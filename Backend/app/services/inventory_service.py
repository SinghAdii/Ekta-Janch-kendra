from sqlalchemy.orm import Session
from app.models.inventory import Inventory

def add_inventory(db: Session, item_name: str, quantity: int):
    item = Inventory(item_name=item_name, quantity=quantity)
    db.add(item)
    db.commit()
    db.refresh(item)
    return item

def get_inventory(db: Session):
    return db.query(Inventory).all()
