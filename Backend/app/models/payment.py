from sqlalchemy import Column, Integer, Float, String
from app.core.database import Base

class Payment(Base):
    __tablename__ = "payments"

    id = Column(Integer, primary_key=True)
    booking_id = Column(Integer)
    amount = Column(Float)
    method = Column(String)
