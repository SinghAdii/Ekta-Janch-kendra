from sqlalchemy import Column, Integer, String, ForeignKey
from app.database import Base

class Prescription(Base):
    __tablename__ = "prescriptions"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    file_path = Column(String)

