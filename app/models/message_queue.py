from datetime import datetime
import enum

from sqlalchemy import Enum

from app import db
from app.models.utils import ModelMixin


class MessageQueue(db.Model, ModelMixin):

    __tablename__ = "message_queue"

    class MessageType(enum.Enum):
        sms = 'sms'
        registration_email = 'registration_email'

    message_id = db.Column(db.Integer, primary_key=True)
    recipient_id = db.Column(db.Integer, nullable=False)
    message_type = db.Column(Enum(MessageType), nullable=False)
    temp_data = db.Column(db.Text)
    sent = db.Column(db.Boolean, default=False)
    created_on = db.Column(db.DateTime, default=datetime.now)
    error = db.Column(db.Text)

    def __str__(self):
        return '<MessageQueue: %d>' % self.message_id
