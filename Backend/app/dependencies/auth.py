from fastapi import Depends, HTTPException
from jose import jwt
from app.config import settings

def get_current_user(token: str):
    try:
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])
        return payload
    except:
        raise HTTPException(status_code=401, detail="Invalid token")
