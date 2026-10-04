from pydantic import BaseModel
from typing import Optional

class GalleryBase(BaseModel):
    image_url: str
    caption: Optional[str] = None
    category: Optional[str] = "All"
    sort_order: Optional[int] = 0

class GalleryCreate(GalleryBase):
    pass

class GalleryUpdate(BaseModel):
    image_url: Optional[str] = None
    caption: Optional[str] = None
    category: Optional[str] = None
    sort_order: Optional[int] = None

class GalleryResponse(GalleryBase):
    id: int

    model_config = {"from_attributes": True}