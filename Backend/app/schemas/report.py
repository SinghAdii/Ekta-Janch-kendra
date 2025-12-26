from pydantic import BaseModel

class ReportResponse(BaseModel):
    id: int
    file_path: str

    class Config:
        from_attributes = True
