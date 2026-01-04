from flask import current_app
from itsdangerous import URLSafeTimedSerializer

SALT = "email-confirm"


def serializer() -> URLSafeTimedSerializer:
    return URLSafeTimedSerializer(current_app.config["SECRET_KEY"])


def make_confirm_token(user_id: int) -> str:
    return serializer().dumps({"user_id": int(user_id)}, salt=SALT)


def read_confirm_token(token: str, max_age_seconds: int = 60 * 60 * 24) -> int:
    data = serializer().loads(token, salt=SALT, max_age=max_age_seconds)
    return int(data["user_id"])
