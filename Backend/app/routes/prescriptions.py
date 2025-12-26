from fastapi import APIRouter, UploadFile, File, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.prescription import Prescription
from app.services.file_service import save_file

router = APIRouter(prefix="/prescriptions", tags=["Prescriptions"])

@router.post("/upload")
def upload_prescription(file: UploadFile = File(...), db: Session = Depends(get_db)):
    path = save_file(file)
    prescription = Prescription(file_path=path)
    db.add(prescription)
    db.commit()
    return prescription
