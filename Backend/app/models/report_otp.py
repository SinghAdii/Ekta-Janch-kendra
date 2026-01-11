from sqlalchemy import Column, Integer, String,DateTime
from app.core.database import Base

class ReportOTP(Base):
    __tablename__ = "report_otps"

    id = Column(Integer, primary_key=True)
    phone = Column(String, index=True)
    otp = Column(Integer)
    expires_at = Column(DateTime)
    is_used = Column(Integer, default=0)