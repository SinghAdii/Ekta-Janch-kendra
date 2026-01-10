from sqlalchemy import Column, Integer, String, Float
from app.core.database import Base

class Doctor(Base):
    __tablename__ = "doctors"

    id = Column(Integer, primary_key=True)
    name = Column(String)
    specialization = Column(String)
    commission_percentage = Column(Float)
