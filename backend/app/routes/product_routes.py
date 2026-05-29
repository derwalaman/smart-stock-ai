# app/routes/product_routes.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.product import Product
from app.schemas.product_schema import (
    ProductCreate,
    ProductResponse,
    ProductUpdate,
)
from sqlalchemy.exc import IntegrityError

from app.models.order_item import OrderItem

router = APIRouter(
    prefix="/products",
    tags=["Products"]
)


@router.post("/", response_model=ProductResponse)
def create_product(
    product: ProductCreate,
    db: Session = Depends(get_db)
):

    existing_product = db.query(Product).filter(
        Product.sku == product.sku
    ).first()

    if existing_product:
        raise HTTPException(
            status_code=400,
            detail="SKU already exists"
        )

    new_product = Product(**product.dict())

    db.add(new_product)
    db.commit()
    db.refresh(new_product)

    return new_product


@router.get("/", response_model=list[ProductResponse])
def get_products(db: Session = Depends(get_db)):
    return db.query(Product).all()

@router.put("/{product_id}",
    response_model=ProductResponse
)
def update_product(
    product_id: int,
    updated_data: ProductUpdate,
    db: Session = Depends(get_db)
):

    product = db.query(Product).filter(
        Product.id == product_id
    ).first()

    if not product:

        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    # CHECK SKU CONFLICT

    existing_sku = db.query(Product).filter(
        Product.sku == updated_data.sku,
        Product.id != product_id
    ).first()

    if existing_sku:

        raise HTTPException(
            status_code=400,
            detail="SKU already exists"
        )

    # UPDATE FIELDS

    product.name = updated_data.name
    product.sku = updated_data.sku
    product.category = updated_data.category
    product.warehouse = updated_data.warehouse
    product.price = updated_data.price
    product.stock = updated_data.stock

    db.commit()

    db.refresh(product)

    return product

@router.delete("/{product_id}")
def delete_product(
    product_id: int,
    db: Session = Depends(get_db)
):

    product = db.query(Product).filter(
        Product.id == product_id
    ).first()

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    # CHECK IF PRODUCT EXISTS IN ORDERS

    existing_order_item = db.query(OrderItem).filter(
        OrderItem.product_id == product_id
    ).first()

    if existing_order_item:

        raise HTTPException(
            status_code=400,
            detail=(
                "Cannot delete product because it exists in order history"
            )
        )

    try:

        db.delete(product)

        db.commit()

        return {
            "message": "Product deleted successfully"
        }

    except IntegrityError:

        db.rollback()

        raise HTTPException(
            status_code=400,
            detail="Unable to delete product"
        )