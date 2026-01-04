from flask import current_app
from flask_mail import Message
from extensions import mail

class EmailService:
    def send_confirmation_email(self, recipient_mail: str, confirm_url: str) -> None:
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
           style="display:inline-block; background:#0097a7; color:#ffffff; text-decoration:none;
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

      <p style="margin:0 0 18px; font-size:12px; color:#0097a7; word-break:break-all;">
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

        msg = Message(
            subject=subject,
            recipients=[recipient_mail],
            body=text_body,
            html=html_body,
            sender=f"Nobel Prize Explorer <{current_app.config.get('MAIL_DEFAULT_SENDER')}>",
        )
        mail.send(msg)
