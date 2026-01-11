from sqlalchemy import Column, Integer, String, Boolean, Float, ForeignKey
from app.core.database import Base

class Booking(Base):
    __tablename__ = "bookings"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, nullable=False)

    doctor_id = Column(Integer, nullable=True)
    test_id = Column(Integer, nullable=True)
    package_id = Column(Integer, nullable=True)

    amount = Column(Float, nullable=False)
    booking_type = Column(String, nullable=False)     # LAB / HOME / CALL
    payment_mode = Column(String, nullable=False)     # CASH / ONLINE

    home_service = Column(Boolean, default=False)
