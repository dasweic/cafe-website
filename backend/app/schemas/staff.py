from pydantic import BaseModel
from typing import Optional

class StaffBase(BaseModel):
    name: str
    designation: str
    bio: Optional[str] = None
    image_url: Optional[str] = None
    sort_order: Optional[int] = 0

class StaffCreate(StaffBase):
    pass

class StaffUpdate(BaseModel):
    name: Optional[str] = None
    designation: Optional[str] = None
    bio: Optional[str] = None
    image_url: Optional[str] = None
    sort_order: Optional[int] = None

class StaffResponse(StaffBase):
    id: int

    model_config = {"from_attributes": True}