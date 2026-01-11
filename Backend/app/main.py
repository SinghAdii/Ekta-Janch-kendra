from fastapi import FastAPI
from app.core.database import Base, engine
from app.api.auth.router import router as auth
from app.api.bookings.router import router as bookings
from app.api.prescriptions.router import router as prescriptions
from app.api.reports.router import router as reports
from app.api.payroll.router import router as payroll
from app.api.inventory.router import router as inventory
from app.api.attendance.router import router as attendance_router
from app.api.admin.router import router as admin_router


Base.metadata.create_all(bind=engine)

app = FastAPI(title="Diagnostic Center Backend")

app.include_router(auth)
app.include_router(bookings)
app.include_router(prescriptions)
app.include_router(reports)
app.include_router(payroll)
app.include_router(inventory)
app.include_router(attendance_router)
app.include_router(admin_router)
