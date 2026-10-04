from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from app.db.base_class import Base

class Category(Base):
    __tablename__ = "category"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True, nullable=False)
    description = Column(String, nullable=True)
    sort_order = Column(Integer, default=0)
    
    # One-to-Many relationship with MenuItem
    items = relationship("MenuItem", back_populates="category", cascade="all, delete-orphan")