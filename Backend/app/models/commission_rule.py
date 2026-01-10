from sqlalchemy import Column, Integer, Float, String, Boolean
from app.core.database import Base

class CommissionRule(Base):
    __tablename__ = "commission_rules"

    id = Column(Integer, primary_key=True)

    # Who
    doctor_id = Column(Integer, nullable=True)   # NULL = applies to all doctors

    # What
    test_id = Column(Integer, nullable=True)     # NULL = all tests
    package_id = Column(Integer, nullable=True)  # NULL = all packages

    # How
    commission_type = Column(String)             # "PERCENTAGE" or "FLAT"
    commission_value = Column(Float)             # 10 (%) or 200 (₹)

    # Conditions
    booking_type = Column(String, nullable=True) # HOME / LAB
    payment_mode = Column(String, nullable=True) # CASH / ONLINE

    is_active = Column(Boolean, default=True)
