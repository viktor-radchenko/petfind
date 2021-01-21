import json

from flask import Blueprint, request, jsonify
from flask_praetorian import auth_required, current_user

from app import db
from app.models import Message, MessageQueue, RegisteredTag
from app.controllers import save_picture

message_blueprint = Blueprint("message", __name__)


@message_blueprint.route('/api/send_private_message', methods=["POST"])
def send_private_message():
    tag_id = request.form.get("tag_id")
    name = request.form.get("name")
    phone_number = request.form.get("phone_number")
    text = request.form.get("text")
    if not tag_id:
        return {"error": "Tag ID is not specified. Check your input and try again"}
    if not name or not phone_number or not text:
        return {"error": "Contact details are not complete. Check your input and try again"}

    message = Message()
    for key, value in request.form.items():
        if value != "undefined":
            setattr(message, key, value)
    message.save()

    new_message = MessageQueue()

    # TODO: decide on SMS logic
    # if len(text) < 150:
    #     new_message.message_type = MessageQueue.MessageType.sms
    # else:
    new_message.message_type = MessageQueue.MessageType.contact_email
    new_message.recipient_id = RegisteredTag.query.get(tag_id).user_id
    new_message.temp_data = json.dumps({
        'name': message.name,
        'tag_id': message.tag_id,
        'phone_number': message.phone_number,
        'lat': message.lat,
        'lon': message.lon,
        'zip_code': message.zip_code,
        'city': message.city,
        'ip_address': message.ip_address,
        'text': message.text
    })
    new_message.save()

    return {"status": "ok"}
