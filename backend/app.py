from flask import Flask
from flask_cors import CORS

from utils.app_utils import env_bool, env_list
from extensions import db, login_manager, mail
import os
from dotenv import load_dotenv
from models import User
from controllers.rdf_controller import rdf_bp
from controllers.auth_controller import auth_bp
from controllers.nobel_controller import nobel_bp
from controllers.laureates_controller import laureat_bp

load_dotenv()


def create_app():
    app = Flask(__name__)

    # Flask / SQLAlchemy
    app.config["SECRET_KEY"] = os.getenv("SECRET_KEY", "dev_key")
    app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv(
        "SQLALCHEMY_DATABASE_URI", "sqlite:///db.sqlite3"
    )
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = env_bool(
        "SQLALCHEMY_TRACK_MODIFICATIONS", False
    )

    # Cookies
    app.config["SESSION_COOKIE_SAMESITE"] = os.getenv("SESSION_COOKIE_SAMESITE", "Lax")
    app.config["SESSION_COOKIE_SECURE"] = env_bool("SESSION_COOKIE_SECURE", False)
    app.config["REMEMBER_COOKIE_SAMESITE"] = os.getenv("REMEMBER_COOKIE_SAMESITE", "Lax")
    app.config["REMEMBER_COOKIE_SECURE"] = env_bool("REMEMBER_COOKIE_SECURE", False)

    # Mail (Mailtrap)
    app.config["MAIL_SERVER"] = os.getenv("MAIL_SERVER", "sandbox.smtp.mailtrap.io")
    app.config["MAIL_PORT"] = int(os.getenv("MAIL_PORT", "2525"))
    app.config["MAIL_USERNAME"] = os.getenv("MAIL_USERNAME")
    app.config["MAIL_PASSWORD"] = os.getenv("MAIL_PASSWORD")
    app.config["MAIL_USE_TLS"] = env_bool("MAIL_USE_TLS", True)
    app.config["MAIL_USE_SSL"] = env_bool("MAIL_USE_SSL", False)
    app.config["MAIL_DEFAULT_SENDER"] = os.getenv(
        "MAIL_DEFAULT_SENDER", app.config.get("MAIL_USERNAME") or "no-reply@local.test"
    )

    CORS(
        app,
        supports_credentials=env_bool("CORS_SUPPORTS_CREDENTIALS", True),
        origins=env_list("CORS_ORIGINS", os.getenv("FRONTEND_URL", "http://localhost:5173")),
        methods=env_list("CORS_METHODS", "GET,POST,DELETE"),
    )

    db.init_app(app)
    login_manager.init_app(app)
    mail.init_app(app)

    @login_manager.user_loader
    def load_user(user_id):
        return User.query.get(int(user_id))

    @login_manager.unauthorized_handler
    def unauthorized():
        return {"error": "Unauthorized"}, 401

    app.register_blueprint(auth_bp, url_prefix="/auth")
    app.register_blueprint(nobel_bp, url_prefix="/api/nobel")
    app.register_blueprint(laureat_bp, url_prefix="/api/laureates")
    app.register_blueprint(rdf_bp, url_prefix="/api/rdf")

    with app.app_context():
        db.create_all()

    return app


if __name__ == "__main__":
    app = create_app()
    app.run(
        debug=env_bool("FLASK_DEBUG", True),
        host=os.getenv("FLASK_HOST", "localhost"),
        port=int(os.getenv("FLASK_PORT", "5000")),
    )
