from fastapi import FastAPI
from app.database import Base, engine
from app.routes import auth, bookings, doctors, finance, inventory, prescriptions, reports

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Diagnostic Center Backend")

app.include_router(auth)
app.include_router(bookings)
app.include_router(doctors)
app.include_router(finance)
app.include_router(inventory)
app.include_router(prescriptions)
app.include_router(reports)

