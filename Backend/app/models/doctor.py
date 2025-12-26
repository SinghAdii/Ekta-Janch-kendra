from sqlalchemy import Column, Integer, String
from app.database import Base

class Doctor(Base):
    __tablename__ = "doctors"

    id = Column(Integer, primary_key=True)
    name = Column(String)
    commission_percent = Column(Integer)

