import pendulum
import json

from flask import current_app, render_template
from mailjet_rest import Client

from app import guard
from ..models import User, MessageQueue
from app.logger import log


class MessageSender:
    def __init__(self, messages):
        self.messages = messages
        self.registration_emails = []
        self.contact_emails = []
        self.password_reset_emails = []
        self.sms_messages = []

        if self.messages:
            log(log.INFO, "New messages detected")
            self.mailjet = Client(
                auth=(
                    current_app.config["MAILJET_API_KEY"],
                    current_app.config["MAILJET_SECRET_KEY"],
                ),
                version="v3.1",
            )
        else:
            log(log.INFO, "No new messages")

    def prepare_messages(self):
        log(log.INFO, "Starting preparing messages")
        for message in self.messages:
            if message.message_type == MessageQueue.MessageType.registration_email:
                self.prepare_registration_email(message)
            if message.message_type == MessageQueue.MessageType.contact_email:
                self.prepare_contact_email(message)
            if message.message_type == MessageQueue.MessageType.sms:
                pass

    def prepare_registration_email(self, message):
        log(log.INFO, "Preparing registration email")
        recipient = User.query.get(message.recipient_id)
        if not recipient:
            log(log.ERROR, "No such user to send registration email")
            return

        template = "email/registration"
        token = guard.encode_jwt_token(
            recipient,
            override_access_lifespan=pendulum.duration(days=1),
            bypass_user_check=True,
            is_registration_token=True,
        )
        callback_url = (
            f"http://{current_app.config['SERVER_NAME']}/auth/set_password/{token}"
        )
        msg_body = render_template(
            template + ".txt",
            user=recipient,
            password=message.temp_data,
            token=token,
            callback_url=callback_url,
        )
        msg_html = render_template(
            template + ".html",
            user=recipient,
            password=message.temp_data,
            token=token,
            callback_url=callback_url,
        )
        email_template = {
            "To": [{"Email": recipient.email, "Name": recipient.full_name}],
            "TextPart": msg_body,
            "HTMLPart": msg_html,
        }
        self.registration_emails.append(email_template)
        message.sent = True
        message.save()

    def prepare_contact_email(self, message):
        log(log.INFO, "Preparing contact email")
        recipient = User.query.get(message.recipient_id)
        if not recipient:
            log(log.ERROR, "No such user to send contact email")
            return

        data = json.loads(message.temp_data)

        template = "email/contact"
        msg_body = render_template(
            template + ".txt",
            user=recipient,
            name=data.get('name'),
            tag_id=data.get('tag_id'),
            phone_number=data.get('phone_number'),
            lat=data.get('lat'),
            lon=data.get('lon'),
            zip_code=data.get('zip_code'),
            city=data.get('city'),
            ip_address=data.get('ip_address'),
            text=data.get('text'),
            time=message.created_on.strftime("%m/%d/%Y, ,%H:%M:%S")
        )
        msg_html = render_template(
            template + ".html",
            user=recipient,
            name=data.get('name'),
            tag_id=data.get('tag_id'),
            phone_number=data.get('phone_number'),
            lat=data.get('lat'),
            lon=data.get('lon'),
            zip_code=data.get('zip_code'),
            city=data.get('city'),
            ip_address=data.get('ip_address'),
            text=data.get('text'),
            time=message.created_on.strftime("%m/%d/%Y, ,%H:%M:%S")
        )
        email_template = {
            "To": [{"Email": recipient.email, "Name": recipient.full_name}],
            "TextPart": msg_body,
            "HTMLPart": msg_html,
        }
        self.contact_emails.append(email_template)
        message.sent = True
        message.save()

    def send_messages(self):
        if self.registration_emails:
            data = {
                "Globals": {
                    "From": {
                        "Email": current_app.config["MAIL_USERNAME"],
                        "Name": current_app.config["MAIL_USERNAME"],
                    },
                    "Subject": "Confirm your registration",
                },
                "Messages": self.registration_emails,
            }
            result = self.mailjet.send.create(data=data)
        if self.contact_emails:
            data = {
                "Globals": {
                    "From": {
                        "Email": current_app.config["MAIL_USERNAME"],
                        "Name": current_app.config["MAIL_USERNAME"],
                    },
                    "Subject": "New PetFind App contact message",
                },
                "Messages": self.contact_emails,
            }
            result = self.mailjet.send.create(data=data)
        if self.sms_messages:
            pass
