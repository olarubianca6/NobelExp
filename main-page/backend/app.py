from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
import os

from extensions import db, login_manager


def create_app():
    app = Flask(__name__)
    load_dotenv()
    app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev_key')
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///db.sqlite3'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    CORS(app, supports_credentials=True, origins="http://localhost:5174")

    db.init_app(app)
    login_manager.init_app(app)

    from auth import auth_bp
    from nobel import nobel_bp
    from laureates import laureat_bp
    app.register_blueprint(auth_bp, url_prefix='/auth')
    app.register_blueprint(nobel_bp, url_prefix='/api/nobel')
    app.register_blueprint(laureat_bp, url_prefix='/api/laureates')

    @app.route('/')
    def home():
        return {'message': 'API running'}

    with app.app_context():
        db.create_all()

    return app

from models import User
@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))


if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)