from datetime import datetime
import uuid

from app import db
from app.models.utils import ModelMixin


class ShortUrl(db.Model, ModelMixin):
    id = db.Column(db.Integer, primary_key=True)
    original_url = db.Column(db.String(512))
    short_url = db.Column(db.String(6), unique=True)
    visits = db.Column(db.Integer, default=0)
    created_on = db.Column(db.DateTime, default=datetime.now)

    def __init__(self, original_url):
        self.original_url = original_url
        self.short_url = self.generate_short_link()

    def generate_short_link(self):
        short_url = uuid.uuid4().hex[:6]
        link = self.query.filter_by(short_url=short_url).first()
        if link:
            self.generate_short_link()
        return short_url
