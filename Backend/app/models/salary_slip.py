from sqlalchemy import Column, Integer, Float, String
from app.core.database import Base

class SalarySlip(Base):
    __tablename__ = "salary_slips"

    id = Column(Integer, primary_key=True)
    employee_id = Column(Integer)
    month = Column(String)
    amount = Column(Float)
