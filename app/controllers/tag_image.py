import os
import secrets

from flask import current_app
from PIL import Image


def save_picture(form_picture):
    random_hex = secrets.token_hex(8)
    _, f_ext = os.path.splitext(form_picture.filename)
    picture_fn = random_hex + f_ext
    if not os.path.isdir(current_app.config["UPLOAD_FOLDER"]):
        os.makedirs(current_app.config["UPLOAD_FOLDER"])
    picture_path = os.path.join(current_app.config["UPLOAD_FOLDER"], picture_fn)

    output_size = (155, 118)
    i = Image.open(form_picture)
    i.thumbnail(output_size)
    i.save(picture_path)

    return picture_fn
