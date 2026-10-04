from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import select

from app.api import deps
from app.models.gallery import Gallery
from app.models.user import User
from app.schemas.gallery import GalleryCreate, GalleryUpdate, GalleryResponse

router = APIRouter()

@router.get("/", response_model=List[GalleryResponse])
def get_gallery_images(
    db: Session = Depends(deps.get_db),
    category: Optional[str] = None
):
    """Retrieve gallery images. Optional filter: category (Public)."""
    stmt = select(Gallery).order_by(Gallery.sort_order)
    if category:
        stmt = stmt.where(Gallery.category == category)
        
    images = db.scalars(stmt).all()
    return images

@router.post("/", response_model=GalleryResponse, status_code=status.HTTP_201_CREATED)
def add_gallery_image(
    *,
    db: Session = Depends(deps.get_db),
    image_in: GalleryCreate,
    current_user: User = Depends(deps.get_current_user)
):
    """Add a new gallery image (Admin only)."""
    db_obj = Gallery(**image_in.model_dump())
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

@router.put("/{image_id}", response_model=GalleryResponse)
def update_gallery_image(
    *,
    db: Session = Depends(deps.get_db),
    image_id: int,
    image_in: GalleryUpdate,
    current_user: User = Depends(deps.get_current_user)
):
    """Update gallery image details (Admin only)."""
    db_obj = db.get(Gallery, image_id)
    if not db_obj:
        raise HTTPException(status_code=404, detail="Image not found")
        
    update_data = image_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_obj, field, value)
        
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

@router.delete("/{image_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_gallery_image(
    *,
    db: Session = Depends(deps.get_db),
    image_id: int,
    current_user: User = Depends(deps.get_current_user)
):
    """Delete a gallery image (Admin only)."""
    db_obj = db.get(Gallery, image_id)
    if not db_obj:
        raise HTTPException(status_code=404, detail="Image not found")
        
    db.delete(db_obj)
    db.commit()
    return None