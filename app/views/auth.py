import pendulum

from flask import request, Blueprint, jsonify

from app import guard, db
from app.logger import log
from app.models import User
from app.controllers import send_email

auth_blueprint = Blueprint("auth", __name__)


@auth_blueprint.route("/api/auth/register", methods=["POST"])
def register():
    """
    Registers a new user by parsing a POST request containing new user info and
    dispatching an email with a registration token
    .. example::
       $ curl http://localhost:5000/api/v1/auth/register -X POST \
         -d '{
           "firstName":"joebloggs", \
           "email":"test@example.com"
         }'
    """
    req = request.get_json(force=True)
    email = req.get("email", None)
    phone = req.get("phone", None)
    first_name = req.get("firstName", None)
    last_name = req.get("lastName", None)
    address = req.get("address", None)
    city = req.get("city", None)
    country = req.get("country", None)
    zip_code = req.get("zipCode", None)
    new_user = User(
        first_name=first_name,
        last_name=last_name,
        email=email,
        phone=phone,
        address=address,
        city=city,
        country=country,
        zip_code=zip_code,
        roles="user",
    )
    db.session.add(new_user)
    db.session.commit()
    # app = current_app._get_current_object()
    # guard.send_registration_email(email, user=new_user,
    #                                     confirmation_sender=app.config['MAIL_USERNAME'],
    #                                     subject='User Registration')
    token = guard.encode_jwt_token(
        new_user,
        override_access_lifespan=pendulum.duration(minutes=60),
        bypass_user_check=True,
        is_registration_token=True,
    )
    send_email(
        to=new_user.email,
        subject="Confirm Your Account",
        template="email/registration",
        user=new_user,
        token=token,
    )
    response = {
        "message": "successfully sent registration email to user {}".format(
            new_user.username
        ),
        "token": token
    }

    return jsonify(response)


@auth_blueprint.route('/auth/set-password/<token>', methods=['GET'])
def test_verify(token):
    return None


@auth_blueprint.route('/api/auth/verify', methods=['POST'])
def verify():
    """
    Finalizes a user registration with the token that they were issued in their
    registration email
    .. example::
       $ curl http://localhost:5000/api/v1/auth/verify -X GET \
         -H "Authorization: Bearer <your_token>"
    """
    # registration_token = guard.read_token_from_header()
    # print("TOKEN_: ", registration_token)
    req = request.get_json(force=True)
    token = req.get("token", None)
    password = req.get("password", None)
    password_confirmation = req.get("passwordConfirmation", None)
    if not password:
        return {"message": "Password credentials are invalid. Check your data and try again"}, 401
    if not password_confirmation:
        return {"message": "Password credentials are invalid. Check your data and try again"}, 401
    if password != password_confirmation:
        return {"message": "Passwords do not match"}, 401
    user = guard.get_user_from_registration_token(token)
    user.password = guard.hash_password(password)
    user.activated = True
    user.save()
    # perform 'activation' of user here...like setting 'active' or something
    ret = {'access_token': guard.encode_jwt_token(user)}
    log(log.DEBUG, "ENCODED NEW TOKEN")
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
    print("refresh request")
    old_token = request.get_data()
    new_token = guard.refresh_jwt_token(old_token)
    response = {"access_token": new_token}
    return response, 200
