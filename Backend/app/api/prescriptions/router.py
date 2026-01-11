from fastapi import APIRouter, Depends, UploadFile, File, HTTPException,Form
from sqlalchemy.orm import Session
from app.api.deps import get_current_user
from app.core.database import get_db
from app.models.prescription import Prescription
from app.utils.file_upload import save_file

router = APIRouter(prefix="/prescriptions", tags=["Prescriptions"])

@router.post("/upload")
@router.post("/upload")
def upload_prescription(
    phone: str = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    path = save_file(file, "prescriptions")
    pres = Prescription(phone=phone, file_path=path)
    db.add(pres)
    db.commit()
    return {"prescription_id": pres.id}
