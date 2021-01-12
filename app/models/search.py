from app import db
from app.models.utils import ModelMixin


class Search(db.Model, ModelMixin):

    __tablename__ = 'search'

    search_id = db.Column(db.Integer, primary_key=True)
    lat = db.Column(db.String(32))
    lon = db.Column(db.String(32))
    ip_address = db.Column(db.String(16))
    zip_code = db.Column(db.String(16))
    tag_id = db.Column(db.Integer, db.ForeignKey("tag.tag_id"))

    def __str__(self):
        return '<Search: %d>' % self.search_id
