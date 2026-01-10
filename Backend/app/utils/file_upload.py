import os
from fastapi import UploadFile

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

def save_file(file: UploadFile, folder: str):
    path = f"{UPLOAD_DIR}/{folder}"
    os.makedirs(path, exist_ok=True)
    file_path = f"{path}/{file.filename}"

    with open(file_path, "wb") as f:
        f.write(file.file.read())

    return file_path
