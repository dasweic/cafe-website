import sys
import os

# Add the parent directory to sys.path so we can import 'app'
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy.orm import Session
from app.db.session import SessionLocal
from app.models.user import User
from app.core.security import get_password_hash

def init():
    db = SessionLocal()
    
    # Check if admin user already exists
    user = db.query(User).filter(User.email == "admin@cafe.com").first()
    if not user:
        print("Creating default admin user...")
        user = User(
            email="admin@cafe.com",
            hashed_password=get_password_hash("admin123"),
            full_name="Cafe Admin",
            is_superuser=True,
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        print("Admin user created successfully!")
        print("Email: admin@cafe.com")
        print("Password: admin123")
    else:
        print("Admin user already exists.")
        
    db.close()

if __name__ == "__main__":
    init()