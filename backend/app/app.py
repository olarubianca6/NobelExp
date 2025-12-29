from flask import Flask
from flask_cors import CORS
from extensions import db, login_manager, mail
import os
from dotenv import load_dotenv
load_dotenv()

def _env_bool(key: str, default: bool = False) -> bool:
    val = os.getenv(key, str(default)).strip().lower()
    return val in ("1", "true", "yes", "y", "on")


def _env_list(key: str, default: str = "") -> list[str]:
    raw = os.getenv(key, default).strip()
    if not raw:
        return []
    return [x.strip() for x in raw.split(",") if x.strip()]


def create_app():
    app = Flask(__name__)

    # Flask / SQLAlchemy
    app.config["SECRET_KEY"] = os.getenv("SECRET_KEY", "dev_key")
    app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv(
        "SQLALCHEMY_DATABASE_URI", "sqlite:///db.sqlite3"
    )
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = _env_bool(
        "SQLALCHEMY_TRACK_MODIFICATIONS", False
    )

    # Cookies
    app.config["SESSION_COOKIE_SAMESITE"] = os.getenv("SESSION_COOKIE_SAMESITE", "Lax")
    app.config["SESSION_COOKIE_SECURE"] = _env_bool("SESSION_COOKIE_SECURE", False)
    app.config["REMEMBER_COOKIE_SAMESITE"] = os.getenv("REMEMBER_COOKIE_SAMESITE", "Lax")
    app.config["REMEMBER_COOKIE_SECURE"] = _env_bool("REMEMBER_COOKIE_SECURE", False)

    # Mail (Mailtrap)
    app.config["MAIL_SERVER"] = os.getenv("MAIL_SERVER", "sandbox.smtp.mailtrap.io")
    app.config["MAIL_PORT"] = int(os.getenv("MAIL_PORT", "2525"))
    app.config["MAIL_USERNAME"] = os.getenv("MAIL_USERNAME")
    app.config["MAIL_PASSWORD"] = os.getenv("MAIL_PASSWORD")
    app.config["MAIL_USE_TLS"] = _env_bool("MAIL_USE_TLS", True)
    app.config["MAIL_USE_SSL"] = _env_bool("MAIL_USE_SSL", False)
    app.config["MAIL_DEFAULT_SENDER"] = os.getenv(
        "MAIL_DEFAULT_SENDER", app.config.get("MAIL_USERNAME") or "no-reply@local.test"
    )

    CORS(
        app,
        supports_credentials=_env_bool("CORS_SUPPORTS_CREDENTIALS", True),
        origins=_env_list("CORS_ORIGINS", "http://localhost:5173"),
        methods=_env_list("CORS_METHODS", "GET,POST,DELETE"),
    )

    db.init_app(app)
    login_manager.init_app(app)
    mail.init_app(app)

    from models import User
    from auth import auth_bp
    from nobel import nobel_bp
    from laureates import laureat_bp

    @login_manager.user_loader
    def load_user(user_id):
        return User.query.get(int(user_id))

    @login_manager.unauthorized_handler
    def unauthorized():
        return {"error": "Unauthorized"}, 401

    app.register_blueprint(auth_bp, url_prefix="/auth")
    app.register_blueprint(nobel_bp, url_prefix="/api/nobel")
    app.register_blueprint(laureat_bp, url_prefix="/api/laureates")

    with app.app_context():
        db.create_all()

    return app


if __name__ == "__main__":
    app = create_app()
    app.run(
        debug=_env_bool("FLASK_DEBUG", True),
        host=os.getenv("FLASK_HOST", "localhost"),
        port=int(os.getenv("FLASK_PORT", "5000")),
    )
