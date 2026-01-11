import random
import time

otp_store = {}
OTP_EXPIRY_SECONDS = 300  # 5 minutes



def generate_otp() -> int:
    return random.randint(100000, 999999)


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
