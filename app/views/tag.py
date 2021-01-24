from flask import Blueprint, request, jsonify
from flask_praetorian import auth_required, current_user

from app import db
from app.models import Tag, RegisteredTag, User, Search
from app.controllers import save_picture

tag_blueprint = Blueprint("tag", __name__)


@tag_blueprint.route("/api/tag-id-lookup/<tag_id>")
def lookup(tag_id):
    tag = Tag.query.get(tag_id)
    if not tag:
        return {"message": "No such tag"}
    if tag.is_registered:
        return {"message": "Tag is already registered"}
    return {"message": "Available", "tagId": tag.tag_id}, 200


@tag_blueprint.route("/api/registered_tag/add_new", methods=["POST"])
@auth_required
def add_new_tag():
    tag_id = request.form.get("tag_id")
    tag_name = request.form.get("tag_name")
    if not tag_id or not tag_name:
        return {
            "error": "No Tag ID or Name provided. Please check your form and try again"
        }
    tag = Tag.query.get(tag_id)
    if tag.is_registered:
        return {"error": "This Tag ID is already registered"}
    registered_tag = RegisteredTag.query.get(tag_id)
    if registered_tag:
        if registered_tag.deleted:
            return {
                "error": "This tag was deleted. Please contact support to restore this tag"
            }
        else:
            return {"error": "This Tag ID is already registered"}
    user = current_user()
    new_tag = RegisteredTag(tag_id=tag_id)
    tag_image = request.files.get("tag_image")
    if tag_image:
        picture_file = save_picture(tag_image)
        new_tag.tag_image = picture_file

    email = (
        request.form.get("email")
        if request.form.get("email") != "" and request.form.get("email") != "null"
        else user.email
    )
    phone = (
        request.form.get("phone")
        if request.form.get("phone") != "" and request.form.get("phone") != "null"
        else user.phone
    )
    address = (
        request.form.get("address")
        if request.form.get("address") != "" and request.form.get("address") != "null"
        else user.address
    )
    country = (
        request.form.get("country")
        if request.form.get("country") != "" and request.form.get("country") != "null"
        else user.country
    )
    city = (
        request.form.get("city")
        if request.form.get("city") != "" and request.form.get("city") != "null"
        else user.city
    )
    state = (
        request.form.get("state")
        if request.form.get("state") != "" and request.form.get("state") != "null"
        else user.state
    )
    zip_code = (
        request.form.get("zip_code")
        if request.form.get("zip_code") != "" and request.form.get("zip_code") != "null"
        else user.zip_code
    )

    new_tag.tag_name = tag_name
    new_tag.email = email
    new_tag.phone = phone
    new_tag.address = address
    new_tag.country = country
    new_tag.city = city
    new_tag.state = state
    new_tag.zip_code = zip_code
    new_tag.user_id = user.id

    db.session.add(new_tag)
    tag.is_registered = True
    db.session.add(tag)
    db.session.commit()

    return jsonify(new_tag.to_json()), 200


@tag_blueprint.route("/api/registered_tag/<tag_id>", methods=["POST"])
def registered_lookup(tag_id):
    tag = RegisteredTag.query.get(tag_id)
    location = request.get_json(force=True)
    if not tag:
        return {"message": "No such tag", "status": "na"}, 200
    search = Search(
        lat=location.get("lat"),
        lon=location.get("lon"),
        ip_address=location.get("query"),
        zip_code=location.get("zip"),
        city=location.get("city"),
        tag_id=tag.tag_id,
    )
    search.save()
    if tag.is_private:
        return {"status": "private"}, 200
    if tag.status == RegisteredTag.StatusType.disabled:
        return {"status": "disabled"}, 200
    user = User.query.filter_by(id=tag.user_id).first()
    user_data = {
        'email': user.email,
        'phone': user.phone,
        'name': user.full_name,
        'address': f"{user.address}, {user.city}, {user.state}",
        'tag_id': tag.tag_id,
        'tag_name': tag.tag_name,
        'tag_image': tag.tag_image
    }
    response = {"status": "found", "data": user_data}
    return jsonify(response), 200


@tag_blueprint.route("/api/registered_tag/details")
@auth_required
def get_registered_tags():
    user = current_user()
    tags = [tag.to_json() for tag in user.tags if not tag.deleted]
    if not tags:
        return {"message": "No tags found"}
    return jsonify(tags), 200


@tag_blueprint.route("/api/registered_tag/modify/<tag_id>", methods=["POST"])
@auth_required
def modify_tag(tag_id):
    tag = RegisteredTag.query.get_or_404(tag_id)
    if tag.user_id != current_user().id:
        return {"error": "You are not authorized to edit this tag"}, 401

    tag_image = request.files.get("tag_image")
    if tag_image:
        picture_file = save_picture(tag_image)
        tag.tag_image = picture_file

    for key, value in request.form.items():
        if key == "is_private":
            value = request.form.get(key) == "true"
            setattr(tag, key, value)
        if value != "undefined":
            setattr(tag, key, value)
    tag.save()
    return jsonify(tag.to_json()), 200


@tag_blueprint.route("/api/registered_tag/delete/<tag_id>", methods=["DELETE"])
@auth_required
def delete_tag(tag_id):
    deleted_tag = RegisteredTag.query.get_or_404(tag_id)
    if deleted_tag.user_id != current_user().id:
        return {"error": "You are not authorized to delete this tag"}, 401

    deleted_tag.deleted = True
    deleted_tag.save()

    return jsonify(deleted_tag.to_json()), 200


@tag_blueprint.route('/api/registered_tag/search_history/<tag_id>')
@auth_required
def search_history(tag_id):
    tag = RegisteredTag.query.get_or_404(tag_id)
    searches = [search.to_json() for search in tag.searches]
    return jsonify(searches), 200
