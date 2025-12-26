from sqlalchemy import Column, Integer, String, Enum 
from app.database import Base
import enum 

class Role(enum.Enum): 
    patient = "patient" 
    doctor = "doctor"
    admin = "admin" 
    
class User(Base): 
    __tablename__ = "users" 
    id = Column(Integer, primary_key=True)
    email = Column(String, unique=True, index=True) 
    hashed_password = Column(String) 
    role = Column(Enum(Role))