from sqlalchemy import (
    Column,
    Integer,
    String,
    Float,
    DateTime,
)

from datetime import datetime

from app.core.database import Base


class Product(Base):

    __tablename__ = "products"

    id = Column(Integer, primary_key=True)

    name = Column(String, nullable=False)

    sku = Column(String, unique=True)

    category = Column(String)

    price = Column(Float)

    stock = Column(Integer)

    warehouse = Column(String)

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )