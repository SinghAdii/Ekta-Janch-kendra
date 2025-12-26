from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.doctor import DoctorCreate
from app.models.doctor import Doctor

router = APIRouter(prefix="/doctors", tags=["Doctors"])

@router.post("/")
def create_doctor(data: DoctorCreate, db: Session = Depends(get_db)):
    doctor = Doctor(**data.dict())
    db.add(doctor)
    db.commit()
    return doctor

@router.get("/")
def list_doctors(db: Session = Depends(get_db)):
    return db.query(Doctor).all()
