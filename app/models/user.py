from datetime import datetime

from flask_login import UserMixin, AnonymousUserMixin

from app import db
from app.models.utils import ModelMixin
from app.logger import log


class User(db.Model, UserMixin, ModelMixin):

    __tablename__ = 'user'

    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(64))
    last_name = db.Column(db.String(64))
    email = db.Column(db.String(64), unique=True)
    password = db.Column(db.String(256))
    phone = db.Column(db.String(32), unique=True)
    address = db.Column(db.Text)
    city = db.Column(db.String(64))
    country = db.Column(db.String(64))
    zip_code = db.Column(db.String(16))
    roles = db.Column(db.Text, default='user')
    activated = db.Column(db.Boolean, default=False)
    created_on = db.Column(db.DateTime, default=datetime.now)
    tags = db.relationship("RegisteredTag", lazy=True)

    @property
    def username(self):
        return f'{self.first_name} {self.last_name}'

    @property
    def rolenames(self):
        try:
            return self.roles.split(',')
        except Exception:
            return []

    @classmethod
    def lookup(cls, username):
        log(log.DEBUG, '[Looking up username %s]', username)
        return cls.query.filter_by(email=username).one_or_none()

    @classmethod
    def identify(cls, id):
        return cls.query.get(id)

    @property
    def identity(self):
        return self.id

    def is_valid(self):
        return self.activated

    def __str__(self):
        return '<User: %s %s>' % self.first_name, self.last_name


class AnonymousUser(AnonymousUserMixin):
    pass
