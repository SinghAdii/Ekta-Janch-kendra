import random
import time

otp_store = {}
OTP_EXPIRY_SECONDS = 300  # 5 minutes


def generate_otp(phone: str) -> int:
    otp = random.randint(100000, 999999)
    otp_store[phone] = {
        "otp": otp,
        "expires_at": time.time() + OTP_EXPIRY_SECONDS
    }
    return otp


def verify_otp_for_phone(phone: str, otp: int) -> bool:
    data = otp_store.get(phone)

    if not data:
        return False

    if time.time() > data["expires_at"]:
        otp_store.pop(phone, None)
        return False

    if data["otp"] != otp:
        return False

    otp_store.pop(phone, None)
    return True
