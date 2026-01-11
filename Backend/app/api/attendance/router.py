from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime, date, time

from app.core.database import get_db
from app.api.deps import admin_only
from app.models.attendance import Attendance
from app.utils.attendance_calc import calculate_worked_minutes

router = APIRouter(prefix="/attendance", tags=["Attendance"])

OFFICE_ENTRY = time(10, 0)
GRACE_MINUTES = 30


@router.post("/entry")
def punch_entry(employee_id: int, db: Session = Depends(get_db)):
    today = date.today()

    existing = db.query(Attendance).filter(
        Attendance.employee_id == employee_id,
        Attendance.date == today
    ).first()

    if existing:
        raise HTTPException(400, "Entry already recorded")

    record = Attendance(
        employee_id=employee_id,
        date=today,
        entry_time=datetime.now().time(),
        status="PENDING"
    )

    db.add(record)
    db.commit()
    return {"message": "Entry recorded"}


@router.post("/exit")
def punch_exit(employee_id: int, db: Session = Depends(get_db)):
    today = date.today()

    record = db.query(Attendance).filter(
        Attendance.employee_id == employee_id,
        Attendance.date == today
    ).first()

    if not record:
        raise HTTPException(404, "Entry not found")

    record.exit_time = datetime.now().time()

    record.worked_minutes = calculate_worked_minutes(
        record.entry_time, record.exit_time
    )

    grace_limit = (
        datetime.combine(today, OFFICE_ENTRY)
        .replace(minute=OFFICE_ENTRY.minute + GRACE_MINUTES)
        .time()
    )

    record.status = "AUTO" if record.entry_time <= grace_limit else "PENDING"

    db.commit()
    return {"message": "Exit recorded", "status": record.status}


@router.post("/approve")
def approve_attendance(
    attendance_id: int,
    approve: bool,
    db: Session = Depends(get_db),
    admin=Depends(admin_only)
):
    record = db.query(Attendance).filter(
        Attendance.id == attendance_id
    ).first()

    if not record:
        raise HTTPException(404, "Attendance not found")

    record.status = "APPROVED" if approve else "REJECTED"
    record.approved_by = admin["user_id"]

    db.commit()
    return {"message": "Attendance updated"}


@router.post("/manual")
def manual_attendance(
    employee_id: int,
    entry_time: time,
    exit_time: time,
    db: Session = Depends(get_db),
    admin=Depends(admin_only)
):
    record = Attendance(
        employee_id=employee_id,
        date=date.today(),
        entry_time=entry_time,
        exit_time=exit_time,
        worked_minutes=calculate_worked_minutes(entry_time, exit_time),
        status="APPROVED",
        approved_by=admin["user_id"]
    )

    db.add(record)
    db.commit()
    return {"message": "Manual attendance added by admin"}
