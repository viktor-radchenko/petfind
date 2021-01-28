import base64

from flask import make_response, request, url_for
from flask_login import current_user
from flask_login.utils import current_user
from flask_admin.contrib.sqla import ModelView
from flask_admin import AdminIndexView, BaseView, expose

from app.models import User
from app import admin


class MyAdminIndexView(AdminIndexView):
    def is_accessible(self):
        return current_user.is_authenticated


class AuthModelView(ModelView):
    def is_accessible(self):
        return current_user.is_authenticated


class UserView(AuthModelView):
    form_excluded_columns = ('password')
    column_exclude_list = ['password', ]


class RegisteredTagsView(AuthModelView):
    column_exclude_list = ['tag_image', 'address', 'city', 'country', 'state', 'zip_code', ]
    create_modal = True
    column_display_pk = True
    edit_modal = True
    column_hide_backrefs = False


class TagsView(AuthModelView):
    column_display_pk = True


class MessageView(AuthModelView):
    column_display_pk = True


class TagImportView(BaseView):

    def is_accessible(self):
        return current_user.is_authenticated

    @expose('/')
    def import_tags(self):
        return self.render('import_csv.html')
