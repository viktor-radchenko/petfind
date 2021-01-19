from flask import Blueprint, request, jsonify
from flask_praetorian import auth_required, current_user

from app.models import Tag, RegisteredTag, User, Search
from app.controllers import save_picture

tag_blueprint = Blueprint('tag', __name__)


@tag_blueprint.route('/api/tag-id-lookup/<tag_id>')
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


@tag_blueprint.route('/api/registered_tag/<tag_id>', methods=['POST'])
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


@tag_blueprint.route('/api/registered_tag/details')
@auth_required
def get_registered_tags():
    user = current_user()
    tags = [tag.to_json() for tag in user.tags if not tag.deleted]
    if not tags:
        return {"message": "No tags found"}
    return jsonify(tags), 200


@tag_blueprint.route('/api/registered_tag/modify/<tag_id>', methods=['POST'])
@auth_required
def modify_tag(tag_id):
    tag = RegisteredTag.query.get_or_404(tag_id)
    if tag.user_id != current_user().id:
        return {"message": "You are not authorized to edit this tag"}, 401

    tag_image = request.files.get("tag_image")
    if tag_image:
        picture_file = save_picture(tag_image)
        tag.tag_image = picture_file

    for key, value in request.form.items():
        if key == "is_private":
            value = request.form.get(key) == 'true'
            setattr(tag, key, value)
        if value != "undefined":
            setattr(tag, key, value)
    tag.save()
    return jsonify(tag.to_json()), 200


@tag_blueprint.route('/api/registered_tag/delete/<tag_id>', methods=['DELETE'])
@auth_required
def delete_tag(tag_id):
    tag = RegisteredTag.query.get_or_404(tag_id)
    if tag.user_id != current_user().id:
        return {"message": "You are not authorized to delete this tag"}, 401

    tag.deleted = True
    tag.save()
    return jsonify(tag.to_json()), 200
