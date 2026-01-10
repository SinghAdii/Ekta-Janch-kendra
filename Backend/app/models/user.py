from sqlalchemy import Column, Integer, String, Boolean
from app.core.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    name = Column(String)
    phone = Column(String, unique=True)
    role = Column(String)  # PATIENT | DOCTOR | ADMIN
    is_active = Column(Boolean, default=True)
