from pydantic import BaseModel
from typing import Optional

class CategoryBase(BaseModel):
    name: str
    description: Optional[str] = None
    sort_order: Optional[int] = 0

class CategoryCreate(CategoryBase):
    pass

class CategoryUpdate(CategoryBase):
    name: Optional[str] = None

class CategoryResponse(CategoryBase):
    id: int

    model_config = {"from_attributes": True}