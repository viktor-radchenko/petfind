import enum
from datetime import datetime

from sqlalchemy import Enum

from app import db
from app.models.utils import ModelMixin


class RegisteredTag(db.Model, ModelMixin):

    __tablename__ = 'registered_tag'

    class StatusType(enum.Enum):
        enabled = 'enabled'
        disabled = 'disabled'

    tag_id = db.Column(db.String(16), primary_key=True)
    tag_name = db.Column(db.String(64))
    tag_image = db.Column(db.String(128), default='default.jpg')
    email = db.Column(db.String(64))
    phone = db.Column(db.String(32))
    status = db.Column(Enum(StatusType), default=StatusType.enabled)
    is_private = db.Column(db.Boolean, default=False)
    lost = db.Column(db.Boolean, default=False)
    address = db.Column(db.Text)
    city = db.Column(db.String(64))
    country = db.Column(db.String(64))
    state = db.Column(db.String(64))
    zip_code = db.Column(db.String(16))
    available = db.Column(db.Boolean, default=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"))
    searches = db.relationship("Search", lazy=True)
    deleted = db.Column(db.Boolean, default=False)
    created_on = db.Column(db.DateTime, default=datetime.now)

    def to_json(self):
        return {
            "tag_id": self.tag_id,
            "tag_name": self.tag_name,
            "tag_image": self.tag_image,
            "status": self.status.value,
            "is_private": self.is_private,
            "phone": self.phone,
            "email": self.email,
            "lost": self.lost,
            "address": self.address,
            "city": self.city,
            "country": self.country,
            "state": self.state,
            "zip_code": self.zip_code,
        }

    def __str__(self):
        return '<Tag: %s' % self.tag_id
