from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import extract

from app.core.database import get_db
from app.api.deps import admin_only

from app.models.employee import Employee
from app.models.attendance import Attendance
from app.models.salary_slip import SalarySlip
from app.models.doctor_commission import DoctorCommission
from app.models.commission_rule import CommissionRule

router = APIRouter(prefix="/payroll", tags=["Payroll"])


@router.post("/generate-salary")
def generate_salary(
    employee_id: int,
    month: int,
    year: int,
    db: Session = Depends(get_db),
    admin=Depends(admin_only)
):
    employee = db.query(Employee).filter(
        Employee.id == employee_id
    ).first()

    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")

    attendance_days = db.query(Attendance).filter(
        Attendance.employee_id == employee_id,
        Attendance.present == True,
        extract("month", Attendance.date) == month,
        extract("year", Attendance.date) == year
    ).count()

    salary_amount = (employee.base_salary / 30) * attendance_days

    slip = SalarySlip(
        employee_id=employee_id,
        month=f"{month}-{year}",
        amount=salary_amount
    )

    db.add(slip)
    db.commit()
    db.refresh(slip)

    return {
        "employee_id": employee_id,
        "month": month,
        "year": year,
        "present_days": attendance_days,
        "salary": salary_amount
    }

@router.post("/commission-rule")
def create_commission_rule(
    doctor_id: int | None = None,
    test_id: int | None = None,
    package_id: int | None = None,
    commission_type: str = "PERCENTAGE",  # PERCENTAGE / FLAT
    commission_value: float = 0,
    booking_type: str | None = None,      # HOME / LAB
    payment_mode: str | None = None,      # CASH / ONLINE
    db: Session = Depends(get_db),
    admin=Depends(admin_only)
):
    if commission_type not in ["PERCENTAGE", "FLAT"]:
        raise HTTPException(
            status_code=400,
            detail="commission_type must be PERCENTAGE or FLAT"
        )

    rule = CommissionRule(
        doctor_id=doctor_id,
        test_id=test_id,
        package_id=package_id,
        commission_type=commission_type,
        commission_value=commission_value,
        booking_type=booking_type,
        payment_mode=payment_mode,
        is_active=True
    )

    db.add(rule)
    db.commit()
    db.refresh(rule)

    return {
        "message": "Commission rule created",
        "rule_id": rule.id
    }

@router.get("/commission-rules")
def list_commission_rules(
    db: Session = Depends(get_db),
    admin=Depends(admin_only)
):
    return db.query(CommissionRule).filter(
        CommissionRule.is_active == True
    ).all()

@router.get("/doctor/{doctor_id}/commission-report")
def doctor_commission_report(
    doctor_id: int,
    db: Session = Depends(get_db),
    admin=Depends(admin_only)
):
    commissions = db.query(DoctorCommission).filter(
        DoctorCommission.doctor_id == doctor_id
    ).all()

    total_commission = sum(c.commission_amount for c in commissions)

    return {
        "doctor_id": doctor_id,
        "total_commission": total_commission,
        "records": commissions
    }

@router.get("/doctor/{doctor_id}/commission-summary")
def doctor_monthly_commission(
    doctor_id: int,
    month: int,
    year: int,
    db: Session = Depends(get_db),
    admin=Depends(admin_only)
):
    commissions = db.query(DoctorCommission).filter(
        DoctorCommission.doctor_id == doctor_id,
        extract("month", DoctorCommission.created_at) == month,
        extract("year", DoctorCommission.created_at) == year
    ).all()

    total = sum(c.commission_amount for c in commissions)

    return {
        "doctor_id": doctor_id,
        "month": month,
        "year": year,
        "total_commission": total,
        "records": commissions
    }
