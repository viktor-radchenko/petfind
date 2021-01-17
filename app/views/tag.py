from flask import Blueprint, request, jsonify

from app.models import Tag, RegisteredTag, User, Search

tag_blueprint = Blueprint('tag', __name__)


@tag_blueprint.route('/api/tag/<tag_id>')
def lookup(tag_id):
    tag = Tag.query.get(tag_id)
    if not tag:
        return {"message": "No such tag"}, 200
    if tag.is_registered:
        return {"message": "Tag is already registered"}, 200
    return {
        "message": "Availabe",
        "tagId": tag.tag_id
    }, 200


@tag_blueprint.route('/api/registered-tag/<tag_id>', methods=['POST'])
def registered_lookup(tag_id):
    tag = RegisteredTag.query.get(tag_id)
    location = request.get_json(force=True)
    if not tag:
        return {"message": "No such tag",
                "status": "na"}, 200
    search = Search(
        lat=location.get('latitude'),
        lon=location.get('longitude'),
        ip_address=location.get('IPv4'),
        zip_code=location.get('postal'),
        tag_id=tag.tag_id
    )
    search.save()
    if tag.is_private:
        return {"message": "This ID is Private",
                "status": "private"}, 200
    if tag.status == RegisteredTag.StatusType.disabled:
        return {"message": "This ID is Disabled",
                "status": "disabled"}, 200
    user = User.query.filter_by(id=tag.user_id).first()
    response = {
        "message": "Found The Owner",
        "status": "found",
        "user": user.to_json()
    }
    return jsonify(response), 200
