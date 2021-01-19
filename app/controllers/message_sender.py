import pendulum

from flask import current_app, render_template
from mailjet_rest import Client

from app import guard
from ..models import User, MessageQueue
from app.logger import log


class MessageSender:
    def __init__(self, messages):
        self.messages = messages
        self.registration_emails = []
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
            if message.message_type == MessageQueue.MessageType.sms:
                pass

    def send_messages(self):
        if self.registration_emails:
            data = {
                "Globals": {
                    "From": {
                        "Email": current_app.config["MAIL_USERNAME"],
                        "Name": current_app.config["MAIL_USERNAME"],
                    },
                    "Subject": current_app.config["MAIL_SUBJECT_PREFIX"],
                },
                "Messages": self.registration_emails,
            }
            result = self.mailjet.send.create(data=data)
        if self.sms_messages:
            pass

    def prepare_registration_email(self, message):
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
        callback_url = f"http://{current_app.config['SERVER_NAME']}/auth/set_password/{token}"
        msg_body = render_template(
            template + ".txt", user=recipient, password=message.temp_data, token=token, callback_url=callback_url
        )
        msg_html = render_template(
            template + ".html", user=recipient, password=message.temp_data, token=token, callback_url=callback_url
        )
        email_template = {
            "To": [{"Email": recipient.email, "Name": recipient.full_name}],
            "TextPart": msg_body,
            "HTMLPart": msg_html,
        }
        self.registration_emails.append(email_template)
        message.sent = True
        message.save()
