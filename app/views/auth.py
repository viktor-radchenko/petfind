import pendulum

from flask import request, Blueprint, jsonify

from app import guard, db
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
           "username":"joebloggs", \
           "password":"password" \
           "email":"test@example.com"
         }'
    """
    req = request.get_json(force=True)
    username = req.get("username", None)
    email = req.get("email", None)
    password = req.get("password", None)
    new_user = User(
        username=username,
        password=guard.hash_password(password),
        email=email,
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
        override_access_lifespan=pendulum.duration(minutes=15),
        bypass_user_check=True,
        is_registration_token=True,
    )
    send_email(
        new_user.email,
        "Confirm Your Account",
        "email/confirm",
        user=new_user,
        token=token,
    )
    response = {
        "message": "successfully sent registration email to user {}".format(
            new_user.username
        )
    }

    return jsonify(response)


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
