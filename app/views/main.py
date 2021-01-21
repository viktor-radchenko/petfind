from flask import render_template, Blueprint, send_from_directory, current_app
from flask_praetorian import auth_required, current_user


main_blueprint = Blueprint("main", __name__)


@main_blueprint.route("/test-index")
def index():
    return render_template("index.html")


@main_blueprint.route("/api/")
def home():
    return {"message": "Hello World"}, 200


@main_blueprint.route("/api/protected")
@auth_required
def protected():
    """
    A protected endpoint. The auth_required decorator will require a header
    containing a valid JWT
    .. example::
       $ curl http://localhost:5000/api/protected -X GET \
         -H "Authorization: Bearer <your_token>"
    """
    return {"message": f"protected endpoint (allowed user {current_user().full_name})"}


@main_blueprint.route("/uploads/tag_image/<string:filename>")
def serve_tag_image(filename):
    return send_from_directory(current_app.config["UPLOAD_FOLDER"], filename)
