from fastapi import APIRouter
from app.services.finance_service import calculate_salary

router = APIRouter(prefix="/finance", tags=["Finance"])

@router.get("/salary")
def calculate(base: int, commission: int = 0):
    return {"salary": calculate_salary(base, commission)}
