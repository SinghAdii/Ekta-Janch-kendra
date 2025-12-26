from pydantic import BaseModel

class PrescriptionResponse(BaseModel):
    id: int
    file_path: str

    class Config:
        from_attributes = True
