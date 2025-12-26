from sqlalchemy import Column, Integer, ForeignKey, String
from app.database import Base

class Booking(Base):
    __tablename__ = "bookings"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    test_name = Column(String, nullable=False)
    status = Column(String, default="pending")
