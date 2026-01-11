from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.user import User
from app.utils.otp import generate_otp
from app.core.security import create_access_token
from app.schemas.auth import VerifyOTPRequest

router = APIRouter(prefix="/auth", tags=["Auth"])

otp_store = {}

@router.post("/send-otp")
def send_otp(phone: str):
    otp = generate_otp()
    otp_store[phone] = otp
    print("OTP:", otp)
    return {"message": "OTP sent"}


@router.post("/verify-otp")
def verify_otp(
    data: VerifyOTPRequest,
    db: Session = Depends(get_db)
):
    phone = data.phone
    otp = data.otp

    if otp_store.get(phone) != otp:
        raise HTTPException(status_code=400, detail="Invalid OTP")

    user = db.query(User).filter(User.phone == phone).first()
    if not user:
        user = User(phone=phone, role="PATIENT")
        db.add(user)
        db.commit()
        db.refresh(user)

    token = create_access_token({
        "user_id": user.id,
        "role": user.role
    })

    return {
        "access_token": token,
        "token_type": "bearer",
        "user_id": user.id,
        "role": user.role
    }
