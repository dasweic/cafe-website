import cloudinary
import cloudinary.uploader
from fastapi import HTTPException
from app.core.config import settings

# Configure Cloudinary globally using our environment variables
cloudinary.config(
    cloud_name=settings.CLOUDINARY_CLOUD_NAME,
    api_key=settings.CLOUDINARY_API_KEY,
    api_secret=settings.CLOUDINARY_API_SECRET,
    secure=True
)

def upload_image(file_obj, folder: str = "cafe_website"):
    """
    Uploads a file object to Cloudinary and returns the secure URL.
    """
    # Check if credentials are actually set
    if not settings.CLOUDINARY_CLOUD_NAME or not settings.CLOUDINARY_API_KEY:
        raise HTTPException(
            status_code=500, 
            detail="Cloudinary credentials are not configured in .env"
        )

    try:
        # Upload the file to Cloudinary. 
        # file_obj can be a file-like object (like the one FastAPI provides)
        result = cloudinary.uploader.upload(
            file_obj,
            folder=folder,
            resource_type="image"
        )
        return result.get("secure_url")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Image upload failed: {str(e)}")