from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import select

from app.api import deps
from app.models.category import Category
from app.models.user import User
from app.schemas.category import CategoryCreate, CategoryUpdate, CategoryResponse

router = APIRouter()

@router.get("/", response_model=List[CategoryResponse])
def get_categories(db: Session = Depends(deps.get_db)):
    """Retrieve all categories (Public)."""
    categories = db.scalars(select(Category).order_by(Category.sort_order)).all()
    return categories

@router.post("/", response_model=CategoryResponse, status_code=status.HTTP_201_CREATED)
def create_category(
    *,
    db: Session = Depends(deps.get_db),
    category_in: CategoryCreate,
    current_user: User = Depends(deps.get_current_user) # Protected Route
):
    """Create a new category (Admin only)."""
    # Check if category name already exists
    existing = db.scalar(select(Category).where(Category.name == category_in.name))
    if existing:
        raise HTTPException(status_code=400, detail="Category with this name already exists")
    
    db_obj = Category(**category_in.model_dump())
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

@router.put("/{category_id}", response_model=CategoryResponse)
def update_category(
    *,
    db: Session = Depends(deps.get_db),
    category_id: int,
    category_in: CategoryUpdate,
    current_user: User = Depends(deps.get_current_user)
):
    """Update a category (Admin only)."""
    db_obj = db.get(Category, category_id)
    if not db_obj:
        raise HTTPException(status_code=404, detail="Category not found")
    
    update_data = category_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_obj, field, value)
        
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

@router.delete("/{category_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_category(
    *,
    db: Session = Depends(deps.get_db),
    category_id: int,
    current_user: User = Depends(deps.get_current_user)
):
    """Delete a category (Admin only)."""
    db_obj = db.get(Category, category_id)
    if not db_obj:
        raise HTTPException(status_code=404, detail="Category not found")
    
    db.delete(db_obj)
    db.commit()
    return None