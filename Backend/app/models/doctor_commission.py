from sqlalchemy import Column, Integer, Float, String, DateTime
from datetime import datetime
from app.core.database import Base

class DoctorCommission(Base):
    __tablename__ = "doctor_commissions"

    id = Column(Integer, primary_key=True)
    doctor_id = Column(Integer)
    booking_id = Column(Integer)
    test_amount = Column(Float)
    commission_percentage = Column(Float)
    commission_amount = Column(Float)
    created_at = Column(DateTime, default=datetime.utcnow)
