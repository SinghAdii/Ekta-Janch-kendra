from pydantic import BaseModel

class InventoryCreate(BaseModel):
    item_name: str
    quantity: int

