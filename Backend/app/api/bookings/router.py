from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.database import get_db
from app.models.booking import Booking
from app.models.doctor_commission import DoctorCommission
from app.services.commission_service import calculate_commission

router = APIRouter(prefix="/bookings", tags=["Bookings"])


@router.post("/")
def create_booking(
    data: dict,
    user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    booking = Booking(
        user_id=user["user_id"],
        doctor_id=data.get("doctor_id"),
        test_id=data.get("test_id"),
        package_id=data.get("package_id"),
        amount=data.get("amount"),
        booking_type=data.get("booking_type"),
        payment_mode=data.get("payment_mode")
    )

    db.add(booking)
    db.commit()
    db.refresh(booking)  # IMPORTANT

    # CALCULATE COMMISSION AFTER BOOKING IS CREATED
    commission_amount = calculate_commission(
        db=db,
        doctor_id=booking.doctor_id,
        test_id=booking.test_id,
        package_id=booking.package_id,
        test_amount=booking.amount,
        booking_type=booking.booking_type,
        payment_mode=booking.payment_mode
    )

    if commission_amount > 0:
        db.add(
            DoctorCommission(
                doctor_id=booking.doctor_id,
                booking_id=booking.id,
                test_amount=booking.amount,
                commission_amount=commission_amount
            )
        )
        db.commit()

    return {
        "message": "Booking created",
        "booking_id": booking.id,
        "commission": commission_amount
    }
