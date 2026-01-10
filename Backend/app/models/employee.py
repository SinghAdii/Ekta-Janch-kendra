from sqlalchemy import Column, Integer, String, Float
from app.core.database import Base

class Employee(Base):
    __tablename__ = "employees"

    id = Column(Integer, primary_key=True)
    name = Column(String)
    base_salary = Column(Float)
