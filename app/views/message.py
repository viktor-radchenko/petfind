import json

from flask import Blueprint, request

from app.models import Message, MessageQueue, RegisteredTag, Contact

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

    new_email = MessageQueue()
    new_sms = MessageQueue()

    data = json.dumps({
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

    new_email.message_type = MessageQueue.MessageType.contact_email
    new_email.recipient_id = RegisteredTag.query.get(tag_id).user_id
    new_email.temp_data = data
    new_email.save()

    new_sms.message_type = MessageQueue.MessageType.sms
    new_sms.recipient_id = RegisteredTag.query.get(tag_id).user_id
    new_sms.temp_data = data
    new_sms.save()

    return {"status": "ok"}


@message_blueprint.route('/api/contact_form', methods=["POST"])
def send_contact_form_message():
    name = request.form.get("name")
    email = request.form.get("email")
    message = request.form.get("message")
    new_contact_message = Contact(name=name, email=email, message=message)
    new_contact_message.save()
    return {"status": "ok"}
