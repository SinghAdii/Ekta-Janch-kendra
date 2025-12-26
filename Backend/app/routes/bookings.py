from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.booking import BookingCreate
from app.services.booking_service import create_booking

router = APIRouter(prefix="/bookings", tags=["Bookings"])

@router.post("/")
def book_test(data: BookingCreate, db: Session = Depends(get_db)):
    return create_booking(db, user_id=1, test_name=data.test_name)
