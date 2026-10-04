from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import select

from app.api import deps
from app.models.staff import Staff
from app.models.user import User
from app.schemas.staff import StaffCreate, StaffUpdate, StaffResponse

router = APIRouter()

@router.get("/", response_model=List[StaffResponse])
def get_staff_members(db: Session = Depends(deps.get_db)):
    """Retrieve all staff members (Public)."""
    staff_members = db.scalars(select(Staff).order_by(Staff.sort_order)).all()
    return staff_members

@router.post("/", response_model=StaffResponse, status_code=status.HTTP_201_CREATED)
def add_staff_member(
    *,
    db: Session = Depends(deps.get_db),
    staff_in: StaffCreate,
    current_user: User = Depends(deps.get_current_user)
):
    """Add a new staff member (Admin only)."""
    db_obj = Staff(**staff_in.model_dump())
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

@router.put("/{staff_id}", response_model=StaffResponse)
def update_staff_member(
    *,
    db: Session = Depends(deps.get_db),
    staff_id: int,
    staff_in: StaffUpdate,
    current_user: User = Depends(deps.get_current_user)
):
    """Update a staff member (Admin only)."""
    db_obj = db.get(Staff, staff_id)
    if not db_obj:
        raise HTTPException(status_code=404, detail="Staff member not found")
        
    update_data = staff_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_obj, field, value)
        
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

@router.delete("/{staff_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_staff_member(
    *,
    db: Session = Depends(deps.get_db),
    staff_id: int,
    current_user: User = Depends(deps.get_current_user)
):
    """Delete a staff member (Admin only)."""
    db_obj = db.get(Staff, staff_id)
    if not db_obj:
        raise HTTPException(status_code=404, detail="Staff member not found")
        
    db.delete(db_obj)
    db.commit()
    return None