from pydantic import BaseModel
from typing import Optional, Dict

class CafeSettingsBase(BaseModel):
    cafe_name: str
    logo_url: Optional[str] = None
    tagline: Optional[str] = None
    about_text: Optional[str] = None
    address: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    whatsapp: Optional[str] = None
    google_maps_url: Optional[str] = None
    opening_hours: Optional[Dict[str, str]] = None
    social_links: Optional[Dict[str, str]] = None

class CafeSettingsUpdate(CafeSettingsBase):
    pass

class CafeSettingsResponse(CafeSettingsBase):
    id: int

    model_config = {"from_attributes": True}