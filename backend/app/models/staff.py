from sqlalchemy import Column, Integer, String
from app.db.base_class import Base

class Staff(Base):
    __tablename__ = "staff"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False)
    designation = Column(String, nullable=False)
    bio = Column(String, nullable=True)
    image_url = Column(String, nullable=True)
    sort_order = Column(Integer, default=0)