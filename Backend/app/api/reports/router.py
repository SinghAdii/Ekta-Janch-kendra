from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.report import Report
from app.models.report_otp import ReportOTP
from app.utils.otp import generate_otp

router = APIRouter(prefix="/reports", tags=["Reports"])

@router.post("/send-otp")
def send_otp(phone: str, db: Session = Depends(get_db)):
    otp = generate_otp()
    db.add(ReportOTP(phone=phone, otp=otp))
    db.commit()
    print("Report OTP:", otp)
    return {"message": "OTP sent"}

@router.post("/download")
def download(phone: str, otp: int, report_id: int, db: Session = Depends(get_db)):
    if not db.query(ReportOTP).filter_by(phone=phone, otp=otp).first():
        raise HTTPException(status_code=401)

    report = db.query(Report).filter_by(id=report_id, is_published=True).first()
    if not report:
        raise HTTPException(status_code=404 , detail="Report not found")
    return {"report_url": report.report_url}
