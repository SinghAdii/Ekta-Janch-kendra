from sqlalchemy import Column, Integer, String, ForeignKey
from app.database import Base

class Report(Base):
    __tablename__ = "reports"

    id = Column(Integer, primary_key=True)
    booking_id = Column(Integer, ForeignKey("bookings.id"))
    file_path = Column(String)

