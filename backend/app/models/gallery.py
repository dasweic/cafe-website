from sqlalchemy import Column, Integer, String
from app.db.base_class import Base

class Gallery(Base):
    __tablename__ = "gallery"
    
    id = Column(Integer, primary_key=True, index=True)
    image_url = Column(String, nullable=False)
    caption = Column(String, nullable=True)
    category = Column(String, index=True, default="All") # e.g., 'Interior', 'Food', 'Events'
    sort_order = Column(Integer, default=0)