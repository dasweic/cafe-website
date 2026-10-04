from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.core.config import settings

# Create the SQLAlchemy engine
# pool_pre_ping checks the connection before using it (prevents timeouts)
engine = create_engine(settings.DATABASE_URL, pool_pre_ping=True)

# Create a SessionLocal class that we will use to create actual database sessions
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)