from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import select

from app.api import deps
from app.models.settings import CafeSettings
from app.models.user import User
from app.schemas.settings import CafeSettingsUpdate, CafeSettingsResponse

router = APIRouter()

def get_or_create_settings(db: Session) -> CafeSettings:
    """Helper: Get settings (id=1), or create default if none exists."""
    settings = db.get(CafeSettings, 1)
    if not settings:
        settings = CafeSettings(id=1, cafe_name="Brew & Bean")
        db.add(settings)
        db.commit()
        db.refresh(settings)
    return settings

@router.get("/", response_model=CafeSettingsResponse)
def get_settings(db: Session = Depends(deps.get_db)):
    """Retrieve global cafe settings (Public)."""
    return get_or_create_settings(db)

@router.put("/", response_model=CafeSettingsResponse)
def update_settings(
    *,
    db: Session = Depends(deps.get_db),
    settings_in: CafeSettingsUpdate,
    current_user: User = Depends(deps.get_current_user)
):
    """Update global cafe settings (Admin only)."""
    settings = get_or_create_settings(db)
    
    update_data = settings_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(settings, field, value)
        
    db.add(settings)
    db.commit()
    db.refresh(settings)
    return settings