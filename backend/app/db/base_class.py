from typing import Any
from sqlalchemy.orm import DeclarativeBase, declared_attr

class Base(DeclarativeBase):
    """
    SQLAlchemy 2.0 Declarative Base Class.
    All our database models will inherit from this class.
    """
    id: Any
    __name__: str

    # Automatically generate __tablename__ based on the class name
    # e.g., class User -> __tablename__ = "user"
    @declared_attr.directive
    def __tablename__(cls) -> str:
        return cls.__name__.lower()