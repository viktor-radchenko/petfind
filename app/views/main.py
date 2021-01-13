from flask import request, render_template, Blueprint
from flask_praetorian import auth_required, current_user

from app import guard


main_blueprint = Blueprint('main', __name__)


@main_blueprint.route('/test-index')
def index():
    return render_template('index.html')


@main_blueprint.route('/api/')
def home():
    return {"message": "Hello World"}, 200


@main_blueprint.route('/api/protected')
@auth_required
def protected():
    """
    A protected endpoint. The auth_required decorator will require a header
    containing a valid JWT
    .. example::
       $ curl http://localhost:5000/api/protected -X GET \
         -H "Authorization: Bearer <your_token>"
    """
    return {'message': f'protected endpoint (allowed user {current_user().username})'}
