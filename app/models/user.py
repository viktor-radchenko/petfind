from datetime import datetime

from flask_login import UserMixin, AnonymousUserMixin

from app import db
from app.models.utils import ModelMixin


class User(db.Model, UserMixin, ModelMixin):

    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.Text)  # TODO: set up JWT auth using email
    email = db.Column(db.Text, unique=True)
    password = db.Column(db.String(256))
    phone = db.Column(db.String(32), unique=True)
    address = db.Column(db.Text)
    city = db.Column(db.String(64))
    country = db.Column(db.String(64))
    zip_code = db.Column(db.String(16))
    roles = db.Column(db.Text, default='user')
    activated = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.now)

    @property
    def rolenames(self):
        try:
            return self.roles.split(',')
        except Exception:
            return []

    @classmethod
    def lookup(cls, username):
        return cls.query.filter_by(username=username).one_or_none()

    @classmethod
    def identify(cls, id):
        return cls.query.get(id)

    @property
    def identity(self):
        return self.id

    def is_valid(self):
        return self.activated

    def __str__(self):
        return '<User: %s>' % self.username


class AnonymousUser(AnonymousUserMixin):
    pass
