from sqlalchemy.orm import Session
from sqlalchemy import or_, and_

from app.models.commission_rule import CommissionRule


def calculate_commission(
    db: Session,
    doctor_id: int | None,
    test_id: int | None,
    package_id: int | None,
    test_amount: float,
    booking_type: str | None,
    payment_mode: str | None,
) -> float:
    """
    Calculates commission based on rule priority.

    Priority order (highest to lowest):
    1. Doctor + Test/Package specific
    2. Doctor specific
    3. Test/Package specific
    4. Global rule
    """

   
    query = db.query(CommissionRule).filter(
        CommissionRule.is_active == True
    )

    query = query.filter(
        or_(CommissionRule.doctor_id == doctor_id, CommissionRule.doctor_id.is_(None)),
        or_(CommissionRule.test_id == test_id, CommissionRule.test_id.is_(None)),
        or_(CommissionRule.package_id == package_id, CommissionRule.package_id.is_(None)),
        or_(CommissionRule.booking_type == booking_type, CommissionRule.booking_type.is_(None)),
        or_(CommissionRule.payment_mode == payment_mode, CommissionRule.payment_mode.is_(None)),
    )

    rules = query.all()

    if not rules:
        return 0.0

    def rule_priority(rule: CommissionRule) -> int:
        """
        Higher score = higher priority
        """
        score = 0

        if rule.doctor_id is not None:
            score += 100
        if rule.test_id is not None:
            score += 50
        if rule.package_id is not None:
            score += 50
        if rule.booking_type is not None:
            score += 20
        if rule.payment_mode is not None:
            score += 10

        return score

  
    selected_rule = sorted(
        rules,
        key=rule_priority,
        reverse=True
    )[0]

  
    if selected_rule.commission_type == "PERCENTAGE":
        return round((test_amount * selected_rule.commission_value) / 100, 2)

    if selected_rule.commission_type == "FLAT":
        return round(selected_rule.commission_value, 2)

    return 0.0
