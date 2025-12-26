from sqlalchemy.orm import Session
from app.models.booking import Booking

def create_booking(db: Session, user_id: int, test_name: str):
    booking = Booking(user_id=user_id, test_name=test_name)
    db.add(booking)
    db.commit()
    db.refresh(booking)
    return booking
