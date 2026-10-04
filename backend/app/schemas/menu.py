from pydantic import BaseModel
from typing import Optional
from app.schemas.category import CategoryResponse

class MenuItemBase(BaseModel):
    name: str
    description: Optional[str] = None
    price: float
    is_available: Optional[bool] = True
    is_featured: Optional[bool] = False
    image_url: Optional[str] = None
    category_id: int

class MenuItemCreate(MenuItemBase):
    pass

class MenuItemUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    is_available: Optional[bool] = None
    is_featured: Optional[bool] = None
    image_url: Optional[str] = None
    category_id: Optional[int] = None

class MenuItemResponse(MenuItemBase):
    id: int
    category: Optional[CategoryResponse] = None

    model_config = {"from_attributes": True}