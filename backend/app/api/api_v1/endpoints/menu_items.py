from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import select

from app.api import deps
from app.models.menu import MenuItem
from app.models.category import Category
from app.models.user import User
from app.schemas.menu import MenuItemCreate, MenuItemUpdate, MenuItemResponse

router = APIRouter()

@router.get("/", response_model=List[MenuItemResponse])
def get_menu_items(
    db: Session = Depends(deps.get_db),
    category_id: Optional[int] = None,
    is_featured: Optional[bool] = None
):
    """Retrieve menu items. Optional filters: category_id, is_featured (Public)."""
    stmt = select(MenuItem)
    if category_id is not None:
        stmt = stmt.where(MenuItem.category_id == category_id)
    if is_featured is not None:
        stmt = stmt.where(MenuItem.is_featured == is_featured)
        
    menu_items = db.scalars(stmt).all()
    return menu_items

@router.post("/", response_model=MenuItemResponse, status_code=status.HTTP_201_CREATED)
def create_menu_item(
    *,
    db: Session = Depends(deps.get_db),
    item_in: MenuItemCreate,
    current_user: User = Depends(deps.get_current_user)
):
    """Create a new menu item (Admin only)."""
    # Verify the category exists
    category = db.get(Category, item_in.category_id)
    if not category:
        raise HTTPException(status_code=400, detail="Invalid Category ID")
        
    db_obj = MenuItem(**item_in.model_dump())
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

@router.put("/{item_id}", response_model=MenuItemResponse)
def update_menu_item(
    *,
    db: Session = Depends(deps.get_db),
    item_id: int,
    item_in: MenuItemUpdate,
    current_user: User = Depends(deps.get_current_user)
):
    """Update a menu item (Admin only)."""
    db_obj = db.get(MenuItem, item_id)
    if not db_obj:
        raise HTTPException(status_code=404, detail="Menu item not found")
        
    if item_in.category_id is not None:
        category = db.get(Category, item_in.category_id)
        if not category:
            raise HTTPException(status_code=400, detail="Invalid Category ID")

    update_data = item_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_obj, field, value)
        
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

@router.delete("/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_menu_item(
    *,
    db: Session = Depends(deps.get_db),
    item_id: int,
    current_user: User = Depends(deps.get_current_user)
):
    """Delete a menu item (Admin only)."""
    db_obj = db.get(MenuItem, item_id)
    if not db_obj:
        raise HTTPException(status_code=404, detail="Menu item not found")
        
    db.delete(db_obj)
    db.commit()
    return None