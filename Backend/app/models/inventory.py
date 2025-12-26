from sqlalchemy import Column, Integer, String
from app.database import Base

class Inventory(Base):
    __tablename__ = "inventory"

    id = Column(Integer, primary_key=True)
    item_name = Column(String)
    quantity = Column(Integer)

