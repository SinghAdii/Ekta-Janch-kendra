import random 
OTP_STORE = {} 

def generate_otp(user_id: int): 
    otp = random.randint(100000, 999999) 
    OTP_STORE[user_id] = otp 
    return otp 

def verify_otp(user_id: int, otp: int): 
    return OTP_STORE.get(user_id) == otp