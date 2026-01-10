from fastapi import APIRouter, Depends, UploadFile, File
from sqlalchemy.orm import Session
from app.api.deps import get_current_user
from app.core.database import get_db
from app.models.prescription import Prescription
from app.utils.file_upload import save_file

router = APIRouter(prefix="/prescriptions", tags=["Prescriptions"])

@router.post("/upload")
def upload(file: UploadFile = File(...), user=Depends(get_current_user), db: Session = Depends(get_db)):
    path = save_file(file, "prescriptions")
    db.add(Prescription(user_id=user["user_id"], file_path=path))
    db.commit()
    return {"message": "Uploaded"}
