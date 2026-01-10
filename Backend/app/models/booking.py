from sqlalchemy import Column, Integer, String, Boolean
from app.core.database import Base

class Booking(Base):
    __tablename__ = "bookings"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer)
    booking_type = Column(String)  # ONLINE | CALL | WHATSAPP
    home_service = Column(Boolean, default=False)
