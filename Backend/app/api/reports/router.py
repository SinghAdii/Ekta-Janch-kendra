from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from fastapi.responses import FileResponse
from datetime import datetime, timedelta

from app.core.database import get_db
from app.models.report import Report
from app.models.report_otp import ReportOTP
from app.utils.otp import generate_otp

router = APIRouter(prefix="/reports", tags=["Reports"])


@router.post("/send-otp")
def send_otp(phone: str, db: Session = Depends(get_db)):
    otp = generate_otp()

    record = ReportOTP(
        phone=phone,
        otp=otp,
        expires_at=datetime.utcnow() + timedelta(minutes=5)
    )
    db.add(record)
    db.commit()

    print("Report OTP:", otp)
    return {"message": "OTP sent"}


@router.post("/download")
def download_report(
    phone: str,
    otp: int,
    report_id: int,
    db: Session = Depends(get_db)
):
    otp_record = db.query(ReportOTP).filter(
        ReportOTP.phone == phone,
        ReportOTP.otp == otp,
        ReportOTP.is_used == 0,
        ReportOTP.expires_at >= datetime.utcnow()
    ).first()

    if not otp_record:
        raise HTTPException(status_code=400, detail="Invalid or expired OTP")

    report = db.query(Report).filter(
        Report.id == report_id,
        Report.phone == phone
    ).first()

    if not report:
        raise HTTPException(status_code=404, detail="Report not found")

    otp_record.is_used = 1
    db.commit()

    return FileResponse(
        report.file_path,
        filename="report.pdf",
        media_type="application/pdf"
    )
