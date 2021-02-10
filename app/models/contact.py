from datetime import datetime

from app import db
from app.models.utils import ModelMixin


class Contact(db.Model, ModelMixin):

    __tablename__ = 'contact'

    contact_id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(128), nullable=False)
    email = db.Column(db.String(64), nullable=False)
    message = db.Column(db.Text, nullable=False)
    created_on = db.Column(db.DateTime, default=datetime.now)

    def __str__(self):
        return '<Contact: %d>' % self.contact_id
