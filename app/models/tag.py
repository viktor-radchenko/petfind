import enum

from sqlalchemy import Enum

from app import db
from app.models.utils import ModelMixin
from app.controllers import tag_id_generator


class Tag(db.Model, ModelMixin):

    __tablename__ = 'tag'

    class StatusType(enum.Enum):
        enabled = 'enabled'
        disabled = 'disabled'

    tag_id = db.Column(db.String(16), primary_key=True)
    tag_name = db.Column(db.String(64))
    status = db.Column(Enum(StatusType), default=StatusType.enabled)
    is_private = db.Column(db.Boolean, default=False)
    address = db.Column(db.Text)
    city = db.Column(db.String(64))
    country = db.Column(db.String(64))
    zip_code = db.Column(db.String(16))
    available = db.Column(db.Boolean, default=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"))
    searches = db.relationship("Search", lazy=True)

    def __init__(self):
        self.tag_id = tag_id_generator()

    def __str__(self):
        return '<Tag: %s' % self.tag_id
