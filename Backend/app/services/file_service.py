import os
from fastapi import UploadFile
from app.config import settings

def save_file(file: UploadFile) -> str:
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    path = os.path.join(settings.UPLOAD_DIR, file.filename)
    with open(path, "wb") as f:
        f.write(file.file.read())
    return path
