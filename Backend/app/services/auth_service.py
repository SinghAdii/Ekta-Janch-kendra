from sqlalchemy.orm import Session
from app.models.user import User
from app.utils.security import hash_password, verify_password, create_access_token

def register_user(db: Session, email: str, password: str, role: str):
    user = User(
        email=email,
        hashed_password=hash_password(password),
        role=role
    )
    db.add(user)
    db.commit()
    return user

def authenticate_user(db: Session, email: str, password: str):
    user = db.query(User).filter(User.email == email).first()
    if not user or not verify_password(password, user.hashed_password):
        return None
    return create_access_token({"sub": user.email, "role": user.role.value})
