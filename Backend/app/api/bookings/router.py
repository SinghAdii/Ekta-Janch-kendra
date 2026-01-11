from fastapi import APIRouter, HTTPException,Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.booking import Booking
from app.utils.otp import verify_otp_for_phone

router = APIRouter(prefix="/bookings", tags=["Bookings"])

@router.post("/")
def create_booking(
    phone: str,
    otp: int,
    doctor_id: int,
    amount: float,
    booking_type: str,
    payment_mode: str,
    db: Session = Depends(get_db)
):
    if not verify_otp_for_phone(phone, otp):
        raise HTTPException(status_code=400, detail="Invalid OTP")

    booking = Booking(
        phone=phone,
        doctor_id=doctor_id,
        amount=amount,
        booking_type=booking_type,
        payment_mode=payment_mode
    )

    db.add(booking)
    db.commit()
    db.refresh(booking)

    return {
        "message": "Booking created",
        "booking_id": booking.id
    }
