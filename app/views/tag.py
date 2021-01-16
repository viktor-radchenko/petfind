from flask import Blueprint

from app.models import Tag

tag_blueprint = Blueprint('tag', __name__)


@tag_blueprint.route('/api/tag-id-lookup/<tag_id>')
def lookup(tag_id):
    tag = Tag.query.get(tag_id)
    if not tag:
        return {"message": "No such tag"}, 200
    if tag.is_registered:
        return {"message": "Tag is already registered"}, 200
    return {
        "message": "Available",
        "tagId": tag.tag_id
    }, 200
