from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.user import User
from app.api.deps import admin_only
import os

router = APIRouter(prefix="/admin", tags=["Admin"])


@router.post("/assign-role")
def assign_role(
    user_id: int,
    role: str,
    admin=Depends(admin_only),
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(404, "User not found")

    user.role = role.upper()
    db.commit()

    return {"message": f"Role set to {role.upper()}"}


@router.get("/users")
def list_users(
    admin=Depends(admin_only),
    db: Session = Depends(get_db)
):
    return db.query(User.id, User.phone, User.role).all()


ADMIN_SECRET_KEY = os.getenv("ADMIN_SECRET_KEY")


@router.post("/claim-admin")
def claim_admin(
    user_id: int,
    secret_key: str,
    db: Session = Depends(get_db)
):
    if secret_key != "HOSPITAL_ADMIN_SECRET_2026":
        raise HTTPException(status_code=403, detail="Invalid secret")

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.role = "ADMIN"
    db.commit()

    return {"message": "Admin access granted"}




