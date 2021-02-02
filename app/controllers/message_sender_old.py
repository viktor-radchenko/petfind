import pendulum
import json

from flask import current_app, render_template
from mailjet_rest import Client as mail_client
from twilio.rest import Client as sms_client

from app import guard
from ..models import User, MessageQueue
from app.logger import log


class MessageSender:
    def __init__(self, messages):
        self.messages = messages
        self.registration_emails = []
        self.contact_emails = []
        self.search_notification = []
        self.password_reset_emails = []
        self.sms_messages = []

        if self.messages:
            log(log.INFO, "New messages detected")
            self.mailjet = mail_client(
                auth=(
                    current_app.config["MAILJET_API_KEY"],
                    current_app.config["MAILJET_SECRET_KEY"],
                ),
                version="v3.1",
            )
            if current_app.config["TWILIO_ACCOUNT_SID"]:
                self.twilio_client = sms_client(
                    current_app.config["TWILIO_ACCOUNT_SID"],
                    current_app.config["TWILIO_AUTH_TOKEN"],
                )

    def prepare_messages(self):
        if not self.messages:
            log(log.INFO, "No new messages")
        for message in self.messages:
            if message.message_type == MessageQueue.MessageType.registration_email:
                self.prepare_registration_email(message)
            if message.message_type == MessageQueue.MessageType.contact_email:
                self.prepare_contact_email(message)
            if message.message_type == MessageQueue.MessageType.sms:
                self.prepare_sms(message)
            if message.message_type == MessageQueue.MessageType.password_reset_email:
                self.prepare_password_reset_email(message)
            if (
                message.message_type
                == MessageQueue.MessageType.search_notification_email
            ):
                self.prepare_search_notification_email(message)

    def prepare_sms(self, message):
        log(log.INFO, "Preparing sms")
        recipient = User.query.get(message.recipient_id)
        if not recipient:
            log(log.ERROR, "No such user to send sms notification")
            return
        data = json.loads(message.temp_data)
        body = f"You have a new message for tag: {data.tag_id}. Visit https://{current_app.config['SERVER_NAME']}/dashboard for details"
        sms_template = {"body": body, "to": recipient.phone}
        self.sms_messages.append(sms_template)

    def prepare_search_notification_email(self, message):
        log(log.INFO, "Preparing search notification email")
        recipient = User.query.get(message.recipient_id)
        if not recipient:
            log(log.ERROR, "No such user to send registration email")
            return

        template = "email/search_notification"
        callback_url = f"https://{current_app.config['SERVER_NAME']}/dashboard"
        msg_body = render_template(
            template + ".txt",
            user=recipient,
            callback_url=callback_url,
        )
        msg_html = render_template(
            template + ".html",
            user=recipient,
            callback_url=callback_url,
        )
        email_template = {
            "To": [{"Email": recipient.email, "Name": recipient.full_name}],
            "TextPart": msg_body,
            "HTMLPart": msg_html,
        }
        self.search_notification.append(email_template)
        message.sent = True
        message.save()

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
            f"https://{current_app.config['SERVER_NAME']}/auth/set_password/{token}"
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
            name=data.get("name"),
            tag_id=data.get("tag_id"),
            phone_number=data.get("phone_number"),
            lat=data.get("lat"),
            lon=data.get("lon"),
            zip_code=data.get("zip_code"),
            city=data.get("city"),
            ip_address=data.get("ip_address"),
            text=data.get("text"),
            time=message.created_on.strftime("%m/%d/%Y, ,%H:%M:%S"),
        )
        msg_html = render_template(
            template + ".html",
            user=recipient,
            name=data.get("name"),
            tag_id=data.get("tag_id"),
            phone_number=data.get("phone_number"),
            lat=data.get("lat"),
            lon=data.get("lon"),
            zip_code=data.get("zip_code"),
            city=data.get("city"),
            ip_address=data.get("ip_address"),
            text=data.get("text"),
            time=message.created_on.strftime("%m/%d/%Y, ,%H:%M:%S"),
        )
        email_template = {
            "To": [{"Email": recipient.email, "Name": recipient.full_name}],
            "TextPart": msg_body,
            "HTMLPart": msg_html,
        }
        self.contact_emails.append(email_template)
        message.sent = True
        message.save()

    def prepare_password_reset_email(self, message):
        log(log.INFO, "Preparing password reset email")
        recipient = User.query.get(message.recipient_id)
        if not recipient:
            log(log.ERROR, "No such user to send password reset email")
            return

        template = "email/password_reset"
        token = guard.encode_jwt_token(
            recipient,
            override_access_lifespan=pendulum.duration(days=1),
            bypass_user_check=True,
            is_reset_token=True,
        )
        callback_url = (
            f"https://{current_app.config['SERVER_NAME']}/auth/reset_password/{token}"
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
        self.password_reset_emails.append(email_template)
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
                    "Subject": "New message from Trace Return App",
                },
                "Messages": self.contact_emails,
            }
            result = self.mailjet.send.create(data=data)
        if self.search_notification:
            data = {
                "Globals": {
                    "From": {
                        "Email": current_app.config["MAIL_USERNAME"],
                        "Name": current_app.config["MAIL_USERNAME"],
                    },
                    "Subject": "People are looking for your Tag ID",
                },
                "Messages": self.search_notification,
            }
            result = self.mailjet.send.create(data=data)
        if self.password_reset_emails:
            data = {
                "Globals": {
                    "From": {
                        "Email": current_app.config["MAIL_USERNAME"],
                        "Name": current_app.config["MAIL_USERNAME"],
                    },
                    "Subject": f"{current_app.config['APP_NAME']} - forgot password?",
                },
                "Messages": self.password_reset_emails,
            }
            result = self.mailjet.send.create(data=data)
        if current_app.config["TWILIO_ACCOUNT_SID"] and self.sms_messages:
            for message in self.sms_messages:
                result = self.twilio_client.messages.create(
                    current_app.config["TWILIO_SERVICE_SID"],
                    body=message.get("body"),
                    to=message.get("to"),
                )
