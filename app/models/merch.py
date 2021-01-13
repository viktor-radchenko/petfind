import datetime

from app import db
from app.models.utils import ModelMixin


class Merch(db.Model, ModelMixin):

    __tablename__ = 'merch'

    merch_id = db.Column(db.Integer, primary_key=True)
    url = db.Column(db.Text)
    created_on = db.Column(db.DateTime, default=datetime.now)

    def __str__(self):
        return '<Merch: %d>' % self.merch_id
