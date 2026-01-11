from pydantic import BaseModel
from typing import Optional

class BookingCreate(BaseModel):
    phone: str
    doctor_id: Optional[int] = None
    test_id: Optional[int] = None
    package_id: Optional[int] = None
    amount: float
    booking_type: str        # ONLINE | CALL | WHATSAPP
    payment_mode: str        # CASH | ONLINE
