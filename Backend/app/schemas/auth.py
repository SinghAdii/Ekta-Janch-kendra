from pydantic import BaseModel

class VerifyOTPRequest(BaseModel):
    phone: str
    otp: int
