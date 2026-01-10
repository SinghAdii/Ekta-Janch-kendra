from sqlalchemy import Column, Integer, String, Boolean
from app.core.database import Base

class Report(Base):
    __tablename__ = "reports"

    id = Column(Integer, primary_key=True)
    booking_id = Column(Integer)
    report_url = Column(String)
    is_published = Column(Boolean, default=False)
