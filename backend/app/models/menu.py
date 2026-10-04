from sqlalchemy import Column, Integer, String, Boolean, Float, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base_class import Base

class MenuItem(Base):
    __tablename__ = "menu_item"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False)
    description = Column(String, nullable=True)
    price = Column(Float, nullable=False)
    is_available = Column(Boolean, default=True)
    is_featured = Column(Boolean, default=False)
    image_url = Column(String, nullable=True)
    
    # Foreign key linking to the Category table
    category_id = Column(Integer, ForeignKey("category.id", ondelete="CASCADE"), nullable=False)
    
    category = relationship("Category", back_populates="items")