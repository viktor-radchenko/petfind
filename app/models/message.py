from datetime import datetime

from app import db
from app.models.utils import ModelMixin


class Message(db.Model, ModelMixin):

    __tablename__ = 'message'

    message_id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(128), nullable=False)
    phone_number = db.Column(db.String(32), nullable=False)
    text = db.Column(db.Text, nullable=False)
    lat = db.Column(db.String(32))
    city = db.Column(db.String(32))
    lon = db.Column(db.String(32))
    ip_address = db.Column(db.String(16))
    zip_code = db.Column(db.String(16))
    tag_id = db.Column(db.Integer, db.ForeignKey("registered_tag.tag_id"))
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"))
    created_on = db.Column(db.DateTime, default=datetime.now)
    is_read = db.Column(db.Boolean, default=False)

    def to_json(self):
        return {
            "name": self.name,
            "phone_number": self.phone_number,
            "text": self.text,
            "date": self.created_on.strftime("%m/%d/%Y"),
            "lat": self.lat,
            "lon": self.lon,
            "id": self.message_id,
            "tag": self.tag_id,
            "is_read": self.is_read
        }

    def __str__(self):
        return '<Message: %d>' % self.message_id
