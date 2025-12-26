from fastapi import APIRouter, UploadFile, File, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.report import Report
from app.services.file_service import save_file

router = APIRouter(prefix="/reports", tags=["Reports"])

@router.post("/upload")
def upload_report(file: UploadFile = File(...), db: Session = Depends(get_db)):
    path = save_file(file)
    report = Report(file_path=path)
    db.add(report)
    db.commit()
    return report
