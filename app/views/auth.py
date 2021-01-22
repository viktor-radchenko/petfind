import secrets

from flask import request, Blueprint, jsonify
from flask_praetorian import auth_required, current_user

from app import guard, db
from app.logger import log
from app.models import User, RegisteredTag, Tag
from app.controllers import save_picture
from app.models import MessageQueue


auth_blueprint = Blueprint("auth", __name__)


@auth_blueprint.route("/api/auth/register", methods=["POST"])
def register():
    """
    Registers a new user and corresponding TagID by parsing a POST request containing new user info and
    dispatching an email with a registration token
    .. example::
       $ curl http://localhost:5000/api/v1/auth/register -X POST \
         -d '{
           "firstName":"joebloggs", \
           "email":"test@example.com"
         }'
    """
    tag_image = request.files.get("tagImage")

    # req = request.get_json(force=True)
    tag_id = request.form.get("tagId", None)
    tag_name = request.form.get("tagName", None)
    first_name = request.form.get("firstName", None)
    last_name = request.form.get("lastName", None)

    phone = request.form.get("phone", None)
    email = request.form.get("email", None)
    address = request.form.get("address", None)
    city = request.form.get("city", None)
    country = request.form.get("country", None)
    state = request.form.get("userState", None)
    zip_code = request.form.get("zipCode", None)

    # Validate request data on server side and return error messages
    if not email:
        return {"error": "Email is missing. Please provide your email and try again"}, 406
    user = User.query.filter_by(email=email).first()
    if user:
        return {"error": "This user is already registered. Please log in"}, 406
    if not phone:
        return {"error": "Phone number is missing. Please provide your phone number and try again"}, 406
    if not tag_id:
        return {"error": "Tag ID is missing. Please provide your tag ID and try again"}, 406
    if not tag_name:
        return {"error": "Tag Name is missing. Please provide your tag ID and try again"}, 406

    temp_user_password = secrets.token_urlsafe(8)

    # Create new user from form
    new_user = User(
        first_name=first_name,
        last_name=last_name,
        email=email,
        phone=phone,
        address=address,
        city=city,
        country=country,
        zip_code=zip_code,
        state=state,
        password=guard.hash_password(temp_user_password),
        roles="user",
    )
    db.session.add(new_user)
    db.session.commit()

    new_user = User.query.filter_by(email=email).first()
    # Create new Registered Tag
    new_tag = RegisteredTag(
        tag_id=tag_id,
        tag_name=tag_name,
        address=address,
        city=city,
        country=country,
        zip_code=zip_code,
        state=state,
        user_id=new_user.id,
        email=user.email,
        phone=user.phone
    )
    if tag_image:
        picture_file = save_picture(tag_image)
        new_tag.tag_image = picture_file

    db.session.add(new_tag)

    # Update is_registered status for Tag
    tag = Tag.query.get(tag_id)
    tag.is_registered = True
    tag.save()

    new_message = MessageQueue(
        recipient_id=new_user.id,
        message_type=MessageQueue.MessageType.registration_email,
        temp_data=temp_user_password
    )
    db.session.add(new_message)
    db.session.commit()
    response = {
        "confirmed": True
    }
    return jsonify(response), 200


@auth_blueprint.route('/api/auth/verify', methods=['POST'])
def verify():
    """
    Finalizes a user registration with the token that they were issued in their
    registration email
    .. example::
       $ curl http://localhost:5000/api/v1/auth/verify -X GET \
         -H "Authorization: Bearer <your_token>"
    """
    req = request.get_json(force=True)
    token = req.get("token", None)
    old_password = req.get("oldPassword", None)
    new_password = req.get("newPassword", None)
    if not old_password:
        return {"message": "Password credentials are invalid. Check your data and try again"}, 401
    if not new_password:
        return {"message": "Password credentials are invalid. Check your data and try again"}, 401
    user = guard.get_user_from_registration_token(token)
    if not guard.authenticate(user.email, old_password):
        return {"message": "Passwords do not match"}, 401
    user.password = guard.hash_password(new_password)
    user.activated = True
    user.save()
    ret = {'access_token': guard.encode_jwt_token(user)}
    return jsonify(ret), 200


@auth_blueprint.route("/api/auth/login", methods=["POST"])
def login():
    """
    Logs a user in by parsing a POST request containing user credentials and
    issuing a JWT token.
    .. example::
       $ curl http://localhost:5000/api/login -X POST \
         -d '{"username":"admin","password":"strongpassword"}'
    """
    req = request.get_json(force=True)
    username = req.get("username", None)
    password = req.get("password", None)
    user = guard.authenticate(username, password)
    response = {"access_token": guard.encode_jwt_token(user)}
    return response, 200


@auth_blueprint.route("/api/auth/refresh", methods=["POST"])
def refresh():
    """
    Refreshes an existing JWT by creating a new one that is a copy of the old
    except that it has a refrehsed access expiration.
    .. example::
       $ curl http://localhost:5000/api/refresh -X GET \
         -H "Authorization: Bearer <your_token>"
    """
    old_token = request.get_data()
    new_token = guard.refresh_jwt_token(old_token)
    response = {"access_token": new_token}
    return response, 200


@auth_blueprint.route("/api/auth/resend_registration_email", methods=["POST"])
def resend_email():
    req = request.get_json(force=True)
    email = req.get("email", None)
    user = User.query.filter_by(email=email).first_or_404()
    if user.activated:
        response = {"error": "User is already activated. Please log in"}
        return jsonify(response), 401
    temp_user_password = secrets.token_urlsafe(8)
    user.password = guard.hash_password(temp_user_password)
    user.save()
    new_message = MessageQueue(
        recipient_id=user.id,
        message_type=MessageQueue.MessageType.registration_email,
        temp_data=temp_user_password
    )
    new_message.save()
    response = {"message": "Activation email succesfully sent. Check your inbox."}
    return jsonify(response), 200


@auth_blueprint.route("/api/auth/forgot_password", methods=['POST'])
def forgot_password():
    log(log.INFO, '/forgot_password')
    email = request.form.get('email')
    if not email:
        return {"error": "No email provided. Check your input and try again"}
    user = User.query.filter_by(email=email).first_or_404()
    new_message = MessageQueue(
        recipient_id=user.id,
        message_type=MessageQueue.MessageType.password_reset_email
    )
    new_message.save()
    response = {"message": "We have sent you an email to confirm password reset. Check your inbox", "status": 'ok'}
    return jsonify(response), 200


@auth_blueprint.route("/api/auth/verify_reset/<token>", methods=['POST'])
def verify_reset(token):
    log(log.INFO, '/verify_reset')
    token = request.form.get("token", None)
    password = request.form.get("password", None)
    password_confirmation = request.form.get("password_confirmation", None)
    if not password or not password_confirmation:
        return {"error": "Password credentials are missing. Check your data and try again"}
    if password != password_confirmation:
        return {"error": "Passwords do not match. Please try again"}
    user = guard.validate_reset_token(token)
    if not user:
        return {"error": "No such user. Check your user credentials and try again"}
    user.password = guard.hash_password(password)
    user.save()
    response = {'access_token': guard.encode_jwt_token(user)}
    return jsonify(response), 200


@auth_blueprint.route("/api/auth/get_user_data")
@auth_required
def get_user_data():
    user = current_user()
    return jsonify(user.to_json()), 200
