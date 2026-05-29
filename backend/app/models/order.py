from sqlalchemy import (
    Column,
    Integer,
    Float,
    ForeignKey,
    String,
    DateTime,
)

from datetime import datetime

from app.core.database import Base


class Order(Base):

    __tablename__ = "orders"

    id = Column(Integer, primary_key=True)

    customer_id = Column(
        Integer,
        ForeignKey("customers.id")
    )

    total_price = Column(Float)

    status = Column(String)

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )