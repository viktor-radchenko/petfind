from .auth import auth_blueprint  # noqa f401
from .main import main_blueprint  # noqa f401
from .tag import tag_blueprint  # noqa f401
from .message import message_blueprint  # noqa f401
from .admin import MyAdminIndexView, UserView, RegisteredTagsView, TagsView, MessageView  # noqa f401
