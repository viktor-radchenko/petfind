import datetime

from app import db
from app.models.utils import ModelMixin


class Message(db.Model, ModelMixin):

    __tablename__ = 'message'

    message_id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(128), nullable=False)
    phone_number = db.Column(db.String(32), nullable=False)
    text = db.Column(db.Text, nullable=False)
    lat = db.Column(db.String(32))
    lon = db.Column(db.String(32))
    ip_address = db.Column(db.String(16))
    zip_code = db.Column(db.String(16))
    tag_id = db.Column(db.Integer, db.ForeignKey("tag.tag_id"))
    created_on = db.Column(db.DateTime, default=datetime.now)

    def __str__(self):
        return '<Message: %d>' % self.message_id
