from sqlalchemy import Column, Integer, Date, Time, String, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base

class Attendance(Base):
    __tablename__ = "attendance"

    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, ForeignKey("employees.id"), nullable=False)

    date = Column(Date, nullable=False)

    entry_time = Column(Time, nullable=True)
    exit_time = Column(Time, nullable=True)

    worked_minutes = Column(Integer, default=0)

    status = Column(String, default="PENDING")  
    # PENDING / APPROVED / REJECTED

    approved_by = Column(Integer, nullable=True)

    employee = relationship("Employee")
