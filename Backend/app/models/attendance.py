from sqlalchemy import Column, Integer, Boolean, Date, ForeignKey, UniqueConstraint
from datetime import date
from app.core.database import Base

class Attendance(Base):
    __tablename__ = "attendance"

    id = Column(Integer, primary_key=True)
    employee_id = Column(Integer, ForeignKey("employees.id"))
    date = Column(Date, default=date.today)
    present = Column(Boolean, default=True)

    __table_args__ = (
        UniqueConstraint("employee_id", "date", name="unique_employee_attendance"),
    )
