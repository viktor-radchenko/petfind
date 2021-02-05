from flask import render_template, Blueprint, send_from_directory, current_app, jsonify, redirect
from flask_praetorian import auth_required, current_user

from app.controllers import MessageSender
from app.models import MessageQueue, ShortUrl

main_blueprint = Blueprint("main", __name__)


@main_blueprint.route("/")
def index():
    return render_template("index.html")


@main_blueprint.route("/dashboard")
def dashboard():
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


# @main_blueprint.route("/api/test/send_messages")
# def test_messages():
#     messages = MessageQueue.query.filter_by(sent=False).all()
#     sender = MessageSender(messages)
#     sender.process_messages()
#     return jsonify({"status": "ok"}), 200


@main_blueprint.route("/r/<short_url>")
def redirect_to_url(short_url):
    url = ShortUrl.query.filter_by(short_url=short_url).first_or_404()
    return redirect(url.original_url)
