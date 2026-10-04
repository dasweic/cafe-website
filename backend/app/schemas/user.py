from pydantic import BaseModel, EmailStr
from typing import Optional

# Shared properties across multiple schemas
class UserBase(BaseModel):
    email: Optional[EmailStr] = None
    is_active: Optional[bool] = True
    is_superuser: bool = True
    full_name: Optional[str] = None

# Properties to receive via API on creation
class UserCreate(UserBase):
    email: EmailStr
    password: str

# Properties to receive via API on update
class UserUpdate(UserBase):
    password: Optional[str] = None

# Properties to return via API
class UserResponse(UserBase):
    id: int
    email: EmailStr

    # This tells Pydantic to read data even if it is an ORM model, not just a dict
    model_config = {"from_attributes": True}