from sqlalchemy import Column, Integer, String
from app.core.database import Base

class Inventory(Base):
    __tablename__ = "inventory"

    id = Column(Integer, primary_key=True)
    item_name = Column(String)
    type = Column(String)  # INSTRUMENT | MEDICINE
    quantity = Column(Integer)
