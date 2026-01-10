from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.inventory import Inventory

router = APIRouter(prefix="/inventory", tags=["Inventory"])

@router.post("/")
def add(item_name: str, type: str, quantity: int, db: Session = Depends(get_db)):
    db.add(Inventory(item_name=item_name, type=type, quantity=quantity))
    db.commit()
    return {"message": "Item added"}
