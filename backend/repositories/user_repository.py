from extensions import db
from models import User


class UserRepository:
    def get_by_mail(self, mail: str) -> User | None:
        return User.query.filter_by(mail=mail).first()

    def get_by_id(self, user_id: int) -> User | None:
        return db.session.get(User, int(user_id))

    def create_user(self, mail: str, password: str) -> User:
        user = User(mail=mail, is_confirmed=False)
        user.set_password(password)
        db.session.add(user)
        db.session.commit()
        return user

    def confirm_user(self, user: User) -> None:
        user.is_confirmed = True
        db.session.commit()

    def delete_user(self, user: User) -> None:
        db.session.delete(user)
        db.session.commit()
