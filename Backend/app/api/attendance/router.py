from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import date

from app.core.database import get_db
from app.api.deps import admin_only
from app.models.attendance import Attendance
from app.models.employee import Employee

router = APIRouter(prefix="/attendance", tags=["Attendance"])

@router.post("/mark")
def mark_attendance(
    employee_id: int,
    present: bool = True,
    attendance_date: date = date.today(),
    db: Session = Depends(get_db),
    admin=Depends(admin_only)
):
    employee = db.query(Employee).filter(Employee.id == employee_id).first()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")

    existing = db.query(Attendance).filter(
        Attendance.employee_id == employee_id,
        Attendance.date == attendance_date
    ).first()

    if existing:
        raise HTTPException(
            status_code=400,
            detail="Attendance already marked for this date"
        )

    record = Attendance(
        employee_id=employee_id,
        date=attendance_date,
        present=present
    )

    db.add(record)
    db.commit()

    return {
        "employee_id": employee_id,
        "date": attendance_date,
        "present": present
    }

@router.get("/employee/{employee_id}")
def get_employee_attendance(
    employee_id: int,
    db: Session = Depends(get_db),
    admin=Depends(admin_only)
):
    return db.query(Attendance).filter(
        Attendance.employee_id == employee_id
    ).all()

@router.get("/date/{attendance_date}")
def get_attendance_by_date(
    attendance_date: date,
    db: Session = Depends(get_db),
    admin=Depends(admin_only)
):
    return db.query(Attendance).filter(
        Attendance.date == attendance_date
    ).all()
