import os
import base64

from flask import Flask, render_template, request, url_for
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from flask_mail import Mail
from flask_praetorian import Praetorian
from flask_cors import CORS
from flask_admin import Admin
from flask_admin.menu import MenuLink
from flask_admin.contrib.sqla import ModelView
from werkzeug.exceptions import HTTPException

# instantiate extensions
login_manager = LoginManager()
guard = Praetorian()
cors = CORS()
db = SQLAlchemy()
mail = Mail()
admin = Admin()


def create_app(environment='development'):

    from config import config
    from app.views import (
        main_blueprint,
        auth_blueprint,
        tag_blueprint,
        message_blueprint,
        MyAdminIndexView,
        UserView,
        RegisteredTagsView,
        TagsView,
        MessageView,
        TagImportView
    )
    from app.models import (
        User,
        AnonymousUser,
        RegisteredTag,
        Tag,
        MessageQueue
    )

    # Instantiate app.
    app = Flask(__name__)

    # Set app config.
    env = os.environ.get('FLASK_ENV', environment)
    app.config.from_object(config[env])
    config[env].configure(app)

    # Set JWT lifespan
    # TODO: set proper lifespan before putting in production
    app.config['JWT_ACCESS_LIFESPAN'] = {'days': 1}
    app.config['JWT_REFRESH_LIFESPAN'] = {'days': 7}
    guard.init_app(app, User)

    # Set up extensions.
    db.init_app(app)
    login_manager.init_app(app)

    # Initialise CORS
    cors.init_app(app)

    # Initialise email
    mail.init_app(app)

    # Register blueprints.
    app.register_blueprint(auth_blueprint)
    app.register_blueprint(main_blueprint)
    app.register_blueprint(tag_blueprint)
    app.register_blueprint(message_blueprint)

    # Initialise admin views
    admin.init_app(app, index_view=MyAdminIndexView())
    with app.test_request_context():
        admin.add_view(UserView(User, db.session))
        admin.add_view(RegisteredTagsView(RegisteredTag, db.session))
        admin.add_view(TagsView(Tag, db.session))
        admin.add_view(MessageView(MessageQueue, db.session))
        admin.add_view(TagImportView(name="Tag Management", endpoint="tag_management"))
        admin.add_link(MenuLink(name="Back to website", category="", url=url_for("auth.admin_logout")))

    # Set up flask login.
    @login_manager.user_loader
    def load_user(user_id):
        return User.query.get(int(user_id))

    login_manager.login_view = 'auth.login'
    login_manager.login_message_category = 'info'
    login_manager.anonymous_user = AnonymousUser

    # Error handlers.
    @app.errorhandler(HTTPException)
    def handle_http_error(exc):
        return render_template('error.html', error=exc), exc.code

    return app
