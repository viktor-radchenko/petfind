from datetime import datetime
import string
import random

from app import db
from app.models.utils import ModelMixin


class Tag(db.Model, ModelMixin):

    __tablename__ = 'tag'

    tag_id = db.Column(db.String(16), primary_key=True)
    is_registered = db.Column(db.Boolean, default=False)
    created_on = db.Column(db.DateTime, default=datetime.now)

    def __init__(self, tag_id=None):
        def tag_id_generator(size=6, chars=string.ascii_uppercase + string.digits):
            return ''.join(random.choice(chars) for _ in range(size))
        
        self.tag_id = tag_id
        if not self.tag_id:
            self.tag_id = tag_id_generator()

    def __str__(self):
        return '<Tag: %s' % self.tag_id

