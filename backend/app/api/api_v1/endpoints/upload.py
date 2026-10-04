from fastapi import APIRouter, Depends, UploadFile, File
from app.api import deps
from app.models.user import User
from app.services import cloudinary_service

router = APIRouter()

@router.post("/image")
def upload_image_endpoint(
    file: UploadFile = File(...),
    current_user: User = Depends(deps.get_current_user) # Protected (Admin Only)
):
    """
    Upload an image to Cloudinary and return its URL.
    """
    # We pass file.file which is the underlying Python SpooledTemporaryFile object
    image_url = cloudinary_service.upload_image(file.file)
    
    return {"url": image_url}