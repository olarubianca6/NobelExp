from flask import Blueprint, request, jsonify, current_app, url_for
from flask_login import login_user, logout_user, login_required, current_user
from models import User
from extensions import db, mail
from flask_mail import Message
from itsdangerous import URLSafeTimedSerializer, BadSignature, SignatureExpired

auth_bp = Blueprint('auth', __name__)

def _normalize_mail(value: str) -> str:
    return (value or "").strip().lower()

def _serializer():
    return URLSafeTimedSerializer(current_app.config["SECRET_KEY"])

def _make_confirm_token(user_id: int) -> str:
    return _serializer().dumps({"user_id": user_id}, salt="email-confirm")

def _read_confirm_token(token: str, max_age_seconds: int = 60 * 60 * 24) -> int:
    data = _serializer().loads(token, salt="email-confirm", max_age=max_age_seconds)
    return int(data["user_id"])


@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json(silent=True) or {}
    user_mail = _normalize_mail(data.get('mail'))
    password = data.get('password')

    if not user_mail or not password:
        return jsonify({'error': 'Missing fields'}), 400

    if User.query.filter_by(mail=user_mail).first():
        return jsonify({'error': 'User already exists'}), 400

    new_user = User(mail=user_mail, is_confirmed=False)
    new_user.set_password(password)
    db.session.add(new_user)
    db.session.commit()

    # token + link de confirmare
    token = _make_confirm_token(new_user.id)

    frontend = current_app.config.get("FRONTEND_URL", "http://localhost:5173")
    confirm_url = f"{frontend}/confirm-email?token={token}"
    subject = "Confirm your email — Nobel Prize Explorer"

    text_body = f"""Welcome to Nobel Prize Explorer!

    Thanks for signing up. Please confirm your email address using the link below:
    {confirm_url}

    This link expires in 24 hours.

    If you didn’t create an account, you can safely ignore this email.
    — Nobel Prize Explorer
    """

    html_body = f"""
    <!doctype html>
    <html>
      <body style="margin:0; padding:0; background:#ffffff; font-family:Arial, sans-serif; color:#111827;">
        <div style="max-width:600px; margin:0 auto; padding:24px;">
          <h2 style="margin:0 0 12px; font-size:22px; font-weight:700;">
            Welcome to Nobel Prize Explorer
          </h2>

          <p style="margin:0 0 16px; font-size:14px; line-height:1.6;">
            Thanks for signing up! Please confirm your email address to activate your account.
          </p>

          <div style="margin:20px 0;">
            <a href="{confirm_url}"
               style="display:inline-block; background:#2563eb; color:#ffffff; text-decoration:none;
                      padding:12px 16px; border-radius:8px; font-size:14px; font-weight:600;">
              Confirm email
            </a>
          </div>

          <p style="margin:0 0 12px; font-size:12px; color:#374151; line-height:1.6;">
            This link expires in <strong>24 hours</strong>.
          </p>

          <p style="margin:0 0 6px; font-size:12px; color:#6b7280; line-height:1.6;">
            If the button doesn’t work, copy and paste this link into your browser:
          </p>

          <p style="margin:0 0 18px; font-size:12px; color:#2563eb; word-break:break-all;">
            {confirm_url}
          </p>

          <hr style="border:none; border-top:1px solid #e5e7eb; margin:18px 0;" />

          <p style="margin:0; font-size:12px; color:#6b7280;">
            If you didn’t create an account, you can safely ignore this email.<br/>
            — Nobel Prize Explorer
          </p>
        </div>
      </body>
    </html>
    """
    try:
        msg = Message(
            subject=subject,
            recipients=[user_mail],
            body=text_body,
            html=html_body,
            sender=f"Nobel Prize Explorer <{current_app.config.get('MAIL_DEFAULT_SENDER')}>"
        )
        mail.send(msg)
    except Exception as e:
        print("Mail send failed:", e)

    return jsonify({'message': 'User registered successfully. Please confirm your email.'}), 201


@auth_bp.route('/confirm/<token>', methods=['GET'])
def confirm_email(token):
    try:
        user_id = _read_confirm_token(token)
    except SignatureExpired:
        return jsonify({"error": "Confirmation link expired"}), 400
    except BadSignature:
        return jsonify({"error": "Invalid confirmation link"}), 400

    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    if user.is_confirmed:
        return jsonify({"message": "Email already confirmed"}), 200

    user.is_confirmed = True
    db.session.commit()

    return jsonify({"message": "Email confirmed successfully. You can now log in."}), 200


@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json(silent=True) or {}
    user_mail = _normalize_mail(data.get('mail'))
    password = data.get('password')

    user = User.query.filter_by(mail=user_mail).first()
    if not user or not user.check_password(password):
        return jsonify({'error': 'Invalid credentials'}), 401

    if not user.is_confirmed:
        return jsonify({'error': 'Email not confirmed'}), 403

    login_user(user)
    return jsonify({'message': 'Logged in successfully', 'user': user.mail}), 200


@auth_bp.route('/logout', methods=['POST'])
@login_required
def logout():
    logout_user()
    return jsonify({'message': 'Logged out'}), 200


@auth_bp.route('/check', methods=['GET'])
@login_required
def check_auth():
    return jsonify({'user': current_user.mail}), 200


@auth_bp.route('/delete', methods=['DELETE'])
@login_required
def delete_account():
    user = User.query.get(current_user.id)
    logout_user()
    db.session.delete(user)
    db.session.commit()
    return jsonify({'message': 'Account deleted successfully'}), 200
