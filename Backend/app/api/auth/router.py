from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.user import User
from app.utils.otp import generate_otp
from app.core.security import create_access_token
from fastapi.security import OAuth2PasswordRequestForm

router = APIRouter(prefix="/auth", tags=["Auth"])
otp_store = {}

@router.post("/send-otp")
def send_otp(phone: str):
    otp_store[phone] = generate_otp()
    print("OTP:", otp_store[phone])
    return {"message": "OTP sent"}

def verify_otp(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    phone = form_data.username
    otp = int(form_data.password)

    if otp_store.get(phone) != otp:
        return {"error": "Invalid OTP"}

    user = db.query(User).filter(User.phone == phone).first()
    if not user:
        user = User(phone=phone, role="PATIENT")
        db.add(user)
        db.commit()

    token = create_access_token({"user_id": user.id, "role": user.role})
    return {"access_token": token}