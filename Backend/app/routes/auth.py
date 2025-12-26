from fastapi import APIRouter, Depends, HTTPException 
from sqlalchemy.orm import Session 
from app.database import get_db 
from app.models.user import User 
from app.utils.security import hash_password, verify_password, create_access_token 

router = APIRouter(prefix="/auth", tags=["Auth"])

@router.post("/register") 
def register(email: str, password: str, role: str, db: Session = Depends(get_db)): 
    user = User(email=email, hashed_password=hash_password(password), role=role) 
    db.add(user) 
    db.commit() 
    return {"message": "User registered"}
    
@router.post("/login") 
def login(email: str, password: str, db: Session = Depends(get_db)): 
    user = db.query(User).filter(User.email == email).first() 
    if not user or not verify_password(password, user.hashed_password): 
        raise HTTPException(status_code=401, detail="Invalid credentials") 
    token = create_access_token({"sub": user.email, "role": user.role.value}) 
    return {"access_token": token}