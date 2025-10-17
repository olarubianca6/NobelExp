from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from dotenv import load_dotenv
import os
from models import User

db = SQLAlchemy()
login_manager = LoginManager()

def create_app():
    app = Flask(__name__)
    load_dotenv()
    app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev_key')
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///db.sqlite3'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    CORS(app, supports_credentials=True)

    db.init_app(app)
    login_manager.init_app(app)

    from routes.auth import auth_bp
    app.register_blueprint(auth_bp, url_prefix='/auth')

    from routes.main import main_bp
    app.register_blueprint(main_bp, url_prefix='/main')

    @app.route('/')
    def home():
        return {'message': 'API running'}

    return app

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

if __name__ == '__main__':
    app = create_app()
    with app.app_context():
        db.create_all()
    app.run(debug=True)