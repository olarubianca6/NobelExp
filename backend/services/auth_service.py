from flask import current_app
from flask_login import login_user, logout_user
from itsdangerous import BadSignature, SignatureExpired
from repositories.user_repository import UserRepository
from services.email_service import EmailService
from utils.strings import normalize_mail
from utils.token_utils import make_confirm_token, read_confirm_token


class AuthService:
    def __init__(self, repo: UserRepository, email_service: EmailService):
        self.repo = repo
        self.email_service = email_service

    def register(self, mail: str, password: str) -> dict:
        user_mail = normalize_mail(mail)
        if not user_mail or not password:
            raise ValueError("Missing fields")

        if self.repo.get_by_mail(user_mail):
            raise ValueError("User already exists")

        user = self.repo.create_user(user_mail, password)

        token = make_confirm_token(user.id)
        frontend = current_app.config.get("FRONTEND_URL", "http://localhost:5173")
        confirm_url = f"{frontend}/confirm-email?token={token}"

        try:
            self.email_service.send_confirmation_email(user_mail, confirm_url)
        except Exception as e:
            print("Mail send failed:", e)

        return {"message": "User registered successfully. Please confirm your email."}

    def confirm_email(self, token: str) -> dict:
        try:
            user_id = read_confirm_token(token)
        except SignatureExpired:
            raise PermissionError("Confirmation link expired")
        except BadSignature:
            raise PermissionError("Invalid confirmation link")

        user = self.repo.get_by_id(user_id)
        if not user:
            raise LookupError("User not found")

        if user.is_confirmed:
            return {"message": "Email already confirmed"}

        self.repo.confirm_user(user)
        return {"message": "Email confirmed successfully. You can now log in."}

    def login(self, mail: str, password: str) -> dict:
        user_mail = normalize_mail(mail)
        user = self.repo.get_by_mail(user_mail)

        if not user or not user.check_password(password):
            raise PermissionError("Invalid credentials")

        if not user.is_confirmed:
            raise PermissionError("Email not confirmed")

        login_user(user)
        return {"message": "Logged in successfully", "user": user.mail}

    def logout(self) -> dict:
        logout_user()
        return {"message": "Logged out"}

    def delete_account(self, user_id: int) -> dict:
        user = self.repo.get_by_id(user_id)
        if not user:
            raise LookupError("User not found")

        logout_user()
        self.repo.delete_user(user)
        return {"message": "Account deleted successfully"}
