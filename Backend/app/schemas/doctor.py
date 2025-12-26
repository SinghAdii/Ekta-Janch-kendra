from pydantic import BaseModel

class DoctorCreate(BaseModel):
    name: str
    commission_percent: int

class DoctorResponse(DoctorCreate):
    id: int

    class Config:
        from_attributes = True
