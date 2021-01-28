import base64

from flask import make_response, request, url_for
from flask_login.utils import current_user
from flask_admin.contrib.sqla import ModelView
from flask_admin import AdminIndexView, expose

from app.models import User
from app import admin

class MyAdminIndexView(AdminIndexView):
    pass


class UserView(ModelView):
    form_excluded_columns = ('password')
    column_exclude_list = ['password', ]


class RegisteredTagsView(ModelView):
    column_exclude_list = ['tag_image', 'address', 'city', 'country', 'state', 'zip_code', ]
    create_modal = True
    column_display_pk = True
    edit_modal = True
    column_hide_backrefs = False


class TagsView(ModelView):
    column_display_pk = True


class MessageView(ModelView):
    column_display_pk = True


