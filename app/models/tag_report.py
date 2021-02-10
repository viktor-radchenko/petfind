from datetime import datetime

from app import db
from app.models.utils import ModelMixin


class TagReport(db.Model, ModelMixin):
    id = db.Column(db.Integer, primary_key=True)
    filename = db.Column(db.String(124))
    tag_num = db.Column(db.Integer)
    created_on = db.Column(db.DateTime, default=datetime.now)

