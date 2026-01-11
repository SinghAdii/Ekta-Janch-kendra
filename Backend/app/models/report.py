from sqlalchemy import Column, Integer, String, Boolean, DateTime
from datetime import datetime
from app.core.database import Base

class Report(Base):
    __tablename__ = "reports"

    id = Column(Integer, primary_key=True)
    phone = Column(String)
    file_path = Column(String, nullable=False)

    is_published = Column(Boolean, default=False)  # ✅ ADD THIS
    created_at = Column(DateTime, default=datetime.utcnow)

