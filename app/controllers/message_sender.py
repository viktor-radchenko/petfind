import pendulum
import json

from flask import current_app, render_template, url_for
from mailjet_rest import Client as mail_client
from twilio.rest import Client as sms_client

from app import guard
from ..models import User, MessageQueue, ShortUrl
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

    def process_messages(self):
        if not self.messages:
            log(log.INFO, "No new messages")
        for message in self.messages:
            recipient = User.query.get(message.recipient_id)
            if not recipient:
                log(
                    log.ERROR,
                    "Can't send message: no such user. Message ID: [%d]",
                    message.message_id,
                )
                return
            if message.message_type == MessageQueue.MessageType.sms:
                self.send_sms(message, recipient)
                continue
            if message.message_type == MessageQueue.MessageType.registration_email:
                self.send_registration_email(message, recipient)
                continue
            if message.message_type == MessageQueue.MessageType.password_reset_email:
                self.send_password_reset_email(message, recipient)
                continue
            if message.message_type == MessageQueue.MessageType.contact_email:
                self.send_contact_form_email(message, recipient)
                continue
            if message.message_type == MessageQueue.MessageType.search_notification_email:
                self.send_search_notification_email(message, recipient)
                continue
            if message.message_type == MessageQueue.MessageType.contact_us_email:
                self.send_contact_us_email(message)
                continue

    def send_sms(self, message, recipient):
        log(log.INFO, "Sending sms")
        data = json.loads(message.temp_data)
        original_url = f"https://www.google.com/maps/search/?api=1&query={data['lat']},{data['lon']}"
        link = ShortUrl(original_url=original_url)
        link.save()
        body = f"Trace Return Alert ({data['tag_id']}). Visit https://{current_app.config['SERVER_NAME']}/dashboard for details. Check the location of the sender on the map: {url_for('main.redirect_to_url', short_url=link.short_url, _external=True)}"  # noqa 501
        response = self.twilio_client.messages.create(
            messaging_service_sid=current_app.config["TWILIO_SERVICE_SID"], body=body, to=recipient.phone
        )
        if response.status == "accepted":
            message.sent = True
            message.save()

    def send_registration_email(self, message, recipient):
        log(log.INFO, "Sending registration confirmation email")
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
            "Messages": [
                {
                    "From": {
                        "Email": current_app.config["MAIL_USERNAME"],
                        "Name": current_app.config["MAIL_USERNAME"],
                    },
                    "To": [{"Email": recipient.email, "Name": recipient.full_name}],
                    "TextPart": msg_body,
                    "HTMLPart": msg_html,
                    "Subject": "Confirm your registration",
                }
            ]
        }
        response = self.mailjet.send.create(data=email_template)
        if not response.ok:
            message.error = response.text
        else:
            message.sent = True
        message.save()

    def send_password_reset_email(self, message, recipient):
        log(log.INFO, "Sending password reset email")
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
            "Messages": [
                {
                    "From": {
                        "Email": current_app.config["MAIL_USERNAME"],
                        "Name": current_app.config["MAIL_USERNAME"],
                    },
                    "To": [{"Email": recipient.email, "Name": recipient.full_name}],
                    "TextPart": msg_body,
                    "HTMLPart": msg_html,
                    "Subject": "Password reset request",
                }
            ]
        }
        response = self.mailjet.send.create(data=email_template)
        if not response.ok:
            message.error = response.text
        else:
            message.sent = True
        message.save()

    def send_contact_form_email(self, message, recipient):
        log(log.INFO, "Sending contact form email")
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
            "Messages": [
                {
                    "From": {
                        "Email": current_app.config["MAIL_USERNAME"],
                        "Name": current_app.config["MAIL_USERNAME"],
                    },
                    "To": [{"Email": recipient.email, "Name": recipient.full_name}],
                    "TextPart": msg_body,
                    "HTMLPart": msg_html,
                    "Subject": f"New message from {current_app.config['APP_NAME']}",
                }
            ]
        }
        response = self.mailjet.send.create(data=email_template)
        if not response.ok:
            message.error = response.text
        else:
            message.sent = True
        message.save()

    def send_search_notification_email(self, message, recipient):
        log(log.INFO, "Sending search notification email")
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
            "Messages": [
                {
                    "From": {
                        "Email": current_app.config["MAIL_USERNAME"],
                        "Name": current_app.config["MAIL_USERNAME"],
                    },
                    "To": [{"Email": recipient.email, "Name": recipient.full_name}],
                    "TextPart": msg_body,
                    "HTMLPart": msg_html,
                    "Subject": "People are looking for your Tag ID"
                }
            ]
        }
        response = self.mailjet.send.create(data=email_template)
        if not response.ok:
            message.error = response.text
        else:
            message.sent = True
        message.save()

    def send_contact_us_email(self, message):
        log(log.INFO, "Sending search contact us form email")
        template = "email/contact_us"
        data = json.loads(message.temp_data)
        msg_body = render_template(
            template + ".txt",
            name=data.get('name'),
            email=data.get('email'),
            message=data.get('message')
        )
        msg_html = render_template(
            template + ".html",
            name=data.get('name'),
            email=data.get('email'),
            message=data.get('message')
        )
        email_template = {
            "Messages": [
                {
                    "From": {
                        "Email": current_app.config["MAIL_USERNAME"],
                    },
                    "To": [{"Email": current_app.config["CONTACT_US_EMAIL"], "Name": ''}],
                    "TextPart": msg_body,
                    "HTMLPart": msg_html,
                    "Subject": "New contact form message - TraceReturn"
                }
            ]
        }
        response = self.mailjet.send.create(data=email_template)
        if not response.ok:
            message.error = response.text
        else:
            message.sent = True
        message.save()
