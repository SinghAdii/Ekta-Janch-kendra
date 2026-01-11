from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.api.deps import admin_only
from app.models.attendance import Attendance

router = APIRouter(prefix="/attendance/admin", tags=["Attendance Admin"])


@router.post("/approve")
def approve_attendance(
    attendance_id: int,
    approve: bool = True,
    db: Session = Depends(get_db),
    admin=Depends(admin_only)
):
    record = db.query(Attendance).filter(
        Attendance.id == attendance_id
    ).first()

    if not record:
        raise HTTPException(status_code=404, detail="Attendance not found")

    record.status = "APPROVED" if approve else "REJECTED"
    record.approved_by = admin["user_id"]

    db.commit()

    return {
        "attendance_id": attendance_id,
        "status": record.status
    }
