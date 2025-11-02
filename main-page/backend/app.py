from flask import Flask
from flask_cors import CORS
from flask_login import LoginManager
from extensions import db
import os

def create_app():
    app = Flask(__name__)
    app.config['SECRET_KEY'] = os.getenv("SECRET_KEY", "dev_key")
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///db.sqlite3'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'
    app.config['SESSION_COOKIE_SECURE'] = False
    app.config['REMEMBER_COOKIE_SAMESITE'] = 'Lax'
    app.config['REMEMBER_COOKIE_SECURE'] = False

    CORS(
        app,
        supports_credentials=True,
        origins=["http://localhost:5173"],
        methods=["GET", "POST", "DELETE"]
    )

    db.init_app(app)

    from models import User
    from auth import auth_bp
    from nobel import nobel_bp
    from laureates import laureat_bp
    login_manager = LoginManager()
    login_manager.init_app(app)

    @login_manager.user_loader
    def load_user(user_id):
        return User.query.get(int(user_id))

    @login_manager.unauthorized_handler
    def unauthorized():
        return {"error": "Unauthorized"}, 401

    app.register_blueprint(auth_bp, url_prefix="/auth")
    app.register_blueprint(nobel_bp, url_prefix='/api/nobel')
    app.register_blueprint(laureat_bp, url_prefix='/api/laureates')

    with app.app_context():
        db.create_all()

    return app



if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, host="localhost", port=5000)