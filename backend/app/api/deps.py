from collections.abc import Generator
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
import jwt
from jwt.exceptions import InvalidTokenError
from pydantic import ValidationError
from sqlalchemy.orm import Session
from sqlalchemy import select

from app.core.config import settings
from app.db.session import SessionLocal
from app.models.user import User
from app.schemas.token import TokenPayload

# Tells FastAPI where to look for the login token
reusable_oauth2 = OAuth2PasswordBearer(tokenUrl=f"{settings.API_V1_STR}/login/access-token")

# Dependency to get a database session for each request
def get_db() -> Generator:
    try:
        db = SessionLocal()
        yield db
    finally:
        db.close()

# Dependency to get the current authenticated user
def get_current_user(
    db: Session = Depends(get_db), token: str = Depends(reusable_oauth2)
) -> User:
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
        token_data = TokenPayload(**payload)
    except (InvalidTokenError, ValidationError):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Could not validate credentials",
        )
    
    # SQLAlchemy 2.0 query
    user = db.scalar(select(User).where(User.id == int(token_data.sub)))
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if not user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    
    return user