# app/schemas/product_schema.py

from pydantic import BaseModel
from typing import Optional


class ProductBase(BaseModel):
    name: str
    sku: str
    category: Optional[str] = None
    warehouse: Optional[str] = None
    price: float
    stock: int

class ProductUpdate(BaseModel):
    name: str
    sku: str
    category: Optional[str] = None
    warehouse: Optional[str] = None
    price: float
    stock: int

class ProductCreate(ProductBase):
    pass


class ProductResponse(ProductBase):
    id: int

    class Config:
        from_attributes = True