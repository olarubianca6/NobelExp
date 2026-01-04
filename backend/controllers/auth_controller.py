from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user

from repositories.user_repository import UserRepository
from services.email_service import EmailService
from services.auth_service import AuthService

auth_bp = Blueprint("auth", __name__)


def _service() -> AuthService:
    return AuthService(UserRepository(), EmailService())


@auth_bp.post("/register")
def register():
    data = request.get_json(silent=True) or {}
    try:
        res = _service().register(data.get("mail"), data.get("password"))
        return jsonify(res), 201
    except ValueError as e:
        return jsonify({"error": str(e)}), 400


@auth_bp.get("/confirm/<token>")
def confirm_email(token):
    try:
        res = _service().confirm_email(token)
        return jsonify(res), 200
    except PermissionError as e:
        return jsonify({"error": str(e)}), 400
    except LookupError as e:
        return jsonify({"error": str(e)}), 404


@auth_bp.post("/login")
def login():
    data = request.get_json(silent=True) or {}
    try:
        res = _service().login(data.get("mail"), data.get("password"))
        return jsonify(res), 200
    except PermissionError as e:
        msg = str(e)
        status = 403 if msg == "Email not confirmed" else 401
        return jsonify({"error": msg}), status


@auth_bp.post("/logout")
@login_required
def logout():
    res = _service().logout()
    return jsonify(res), 200


@auth_bp.get("/check")
@login_required
def check_auth():
    return jsonify({"user": current_user.mail}), 200


@auth_bp.delete("/delete")
@login_required
def delete_account():
    try:
        res = _service().delete_account(current_user.id)
        return jsonify(res), 200
    except LookupError as e:
        return jsonify({"error": str(e)}), 404
