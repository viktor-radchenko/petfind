from datetime import datetime

from app import db
from app.models.utils import ModelMixin


class Search(db.Model, ModelMixin):

    __tablename__ = 'search'

    search_id = db.Column(db.Integer, primary_key=True)
    lat = db.Column(db.String(32))
    lon = db.Column(db.String(32))
    ip_address = db.Column(db.String(16))
    zip_code = db.Column(db.String(16))
    city = db.Column(db.String(32))
    tag_id = db.Column(db.Integer, db.ForeignKey("registered_tag.tag_id"))
    created_on = db.Column(db.DateTime, default=datetime.now)

    def to_json(self):
        return {
            "date": self.created_on.strftime("%m/%d/%Y, %H:%M:%S"),
            "ip_address": self.ip_address,
            "zip_code": self.zip_code,
            "city": self.city,
            "lat": self.lat,
            "lon": self.lon
        }

    def __str__(self):
        return '<Search: %d>' % self.search_id
