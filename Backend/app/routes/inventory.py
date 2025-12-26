from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.inventory import InventoryCreate
from app.models.inventory import Inventory

router = APIRouter(prefix="/inventory", tags=["Inventory"])

@router.post("/")
def add_item(data: InventoryCreate, db: Session = Depends(get_db)):
    item = Inventory(**data.dict())
    db.add(item)
    db.commit()
    return item
