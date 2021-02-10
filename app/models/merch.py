from datetime import datetime

from app import db
from app.models.utils import ModelMixin


class Merch(db.Model, ModelMixin):

    __tablename__ = 'merch'

    merch_id = db.Column(db.Integer, primary_key=True)
    img_url = db.Column(db.Text)
    title = db.Column(db.String(256))
    subtitle = db.Column(db.Text)
    price = db.Column(db.Integer)
    url = db.Column(db.Text)
    created_on = db.Column(db.DateTime, default=datetime.now)

    def to_json(self):
        return {
            "id": self.merch_id,
            "url": self.url,
            "imgUrl": self.img_url,
            "title": self.title,
            "subtitle": self.subtitle,
            "price": self.price,
        }

    def __str__(self):
        return '<Merch: %d>' % self.merch_id
