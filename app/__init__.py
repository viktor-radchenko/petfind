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
        MessageView
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
        admin.add_link(MenuLink(name="Back to website", category="", url=url_for("main.index")))
    
    # Set up flask login.
    @login_manager.user_loader
    def get_user():
        # first, try to login using the api_key url arg
        api_key = request.args.get('api_key')
        if api_key:
            user = User.query.filter_by(api_key=api_key).first()
            if user:
                return user

        # next, try to login using Basic Auth
        api_key = request.headers.get('Authorization')
        if api_key:
            api_key = api_key.replace('Basic ', '', 1)
            try:
                api_key = base64.b64decode(api_key)
            except TypeError:
                pass
            user = User.query.filter_by(api_key=api_key).first()
            if user:
                return user
        # finally, return None if both methods did not login the user
        return None

    login_manager.login_view = 'auth.login'
    login_manager.login_message_category = 'info'
    login_manager.anonymous_user = AnonymousUser

    # Error handlers.
    @app.errorhandler(HTTPException)
    def handle_http_error(exc):
        return render_template('error.html', error=exc), exc.code

    return app
