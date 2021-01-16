from threading import Thread
from flask import current_app, render_template
from flask_mail import Message
from mailjet_rest import Client

from app import mail


def send_async_email(app, msg):
    with app.app_context():
        mail.send(msg)


def send_registration_email(to, subject, template, **kwargs):
    app = current_app._get_current_object()
    msg = Message(
        app.config["MAIL_SUBJECT_PREFIX"] + " " + subject,
        sender=app.config["PRAETORIAN_CONFIRMATION_SENDER"],
        recipients=[to],
    )
    msg.body = render_template(template + ".txt", **kwargs)
    msg.html = render_template(template + ".html", **kwargs)
    thr = Thread(target=send_async_email, args=[app, msg])
    thr.start()
    return thr


def send_mj_registration(to, name, subject, template, **kwargs):
    app = current_app._get_current_object()
    
    msg_body = render_template(template + ".txt", **kwargs)
    msg_html = render_template(template + ".html", **kwargs)

    mailjet = Client(
        auth=(app.config["MAILJET_API_KEY"], app.config["MAILJET_SECRET_KEY"]),
        version="v3.1",
    )
    data = {
        "Messages": [
            {
                "From": {"Email": app.config["MAIL_USERNAME"], "Name": app.config["MAIL_USERNAME"]},
                "To": [{"Email": to, "Name": name}],
                "Subject": app.config["MAIL_SUBJECT_PREFIX"],
                "TextPart": msg_body,
                "HTMLPart": msg_html,
                "CustomID": "AppGettingStartedTest",
            }
        ]
    }

    result = mailjet.send.create(data=data)
    return result
