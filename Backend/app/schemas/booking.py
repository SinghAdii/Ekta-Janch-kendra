from pydantic import BaseModel

class BookingCreate(BaseModel):
    test_name: str

class BookingResponse(BaseModel):
    id: int
    test_name: str
    status: str

    class Config:
        from_attributes = True

