from sqlalchemy import Column, Integer, String
from app.core.database import Base

class ReportOTP(Base):
    __tablename__ = "report_otps"

    id = Column(Integer, primary_key=True)
    phone = Column(String)
    otp = Column(Integer)
