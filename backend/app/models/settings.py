from sqlalchemy import Column, Integer, String, Text
from sqlalchemy.dialects.postgresql import JSONB
from app.db.base_class import Base

class CafeSettings(Base):
    __tablename__ = "cafe_settings"
    
    id = Column(Integer, primary_key=True, index=True) # Will always be 1
    cafe_name = Column(String, default="My Cafe")
    logo_url = Column(String, nullable=True)
    tagline = Column(String, nullable=True)
    about_text = Column(Text, nullable=True)
    
    # Contact Info
    address = Column(String, nullable=True)
    phone = Column(String, nullable=True)
    email = Column(String, nullable=True)
    whatsapp = Column(String, nullable=True)
    google_maps_url = Column(String, nullable=True)
    
    # JSONB is highly optimized in PostgreSQL for storing dictionary-like data
    opening_hours = Column(JSONB, nullable=True) # e.g., {"Monday": "09:00 AM - 10:00 PM"}
    social_links = Column(JSONB, nullable=True)  # e.g., {"instagram": "https://ig...", "facebook": "..."}