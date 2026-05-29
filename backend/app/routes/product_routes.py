from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
)

from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from app.core.database import get_db

from app.models.product import Product
from app.models.order_item import OrderItem

from app.schemas.product_schema import (
    ProductCreate,
    ProductResponse,
    ProductUpdate,
)

router = APIRouter(
    prefix="/products",
    tags=["Products"]
)

# =========================================================
# CREATE PRODUCT
# =========================================================

@router.post(
    "/",
    response_model=ProductResponse
)
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

    new_product = Product(
        **product.dict()
    )

    db.add(new_product)

    db.commit()

    db.refresh(new_product)

    return new_product


# =========================================================
# GET PRODUCTS
# SEARCH + FILTER SUPPORT
# =========================================================

@router.get(
    "/",
    response_model=list[ProductResponse]
)
def get_products(

    search: str = "",

    category: str = "",

    db: Session = Depends(get_db)
):

    query = db.query(Product)

    # SEARCH

    if search:

        query = query.filter(
            Product.name.ilike(
                f"%{search}%"
            )
        )

    # CATEGORY FILTER

    if category:

        query = query.filter(
            Product.category == category
        )

    return query.all()


# =========================================================
# UPDATE PRODUCT
# =========================================================

@router.put(
    "/{product_id}",
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


# =========================================================
# DELETE PRODUCT
# =========================================================

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

    # CHECK ORDER HISTORY

    existing_order_item = db.query(
        OrderItem
    ).filter(
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
            "message":
                "Product deleted successfully"
        }

    except IntegrityError:

        db.rollback()

        raise HTTPException(
            status_code=400,
            detail="Unable to delete product"
        )


# =========================================================
# INVENTORY OVERVIEW ANALYTICS
# =========================================================

@router.get("/analytics/overview")
def inventory_overview(
    db: Session = Depends(get_db)
):

    products = db.query(Product).all()

    total_products = len(products)

    total_stock = sum(
        product.stock
        for product in products
    )

    low_stock_products = len([
        product
        for product in products
        if product.stock < 20
    ])

    out_of_stock = len([
        product
        for product in products
        if product.stock == 0
    ])

    total_inventory_value = sum(
        product.price *
        product.stock
        for product in products
    )

    return {

        "total_products":
            total_products,

        "total_stock":
            total_stock,

        "low_stock_products":
            low_stock_products,

        "out_of_stock":
            out_of_stock,

        "inventory_value":
            round(
                total_inventory_value,
                2
            ),
    }


# =========================================================
# CATEGORY ANALYTICS
# =========================================================

@router.get("/analytics/categories")
def category_analytics(
    db: Session = Depends(get_db)
):

    products = db.query(Product).all()

    grouped = {}

    for product in products:

        category = (
            product.category
            or "Other"
        )

        if category not in grouped:

            grouped[category] = {

                "stock": 0,

                "products": 0,

                "value": 0,
            }

        grouped[category]["stock"] += (
            product.stock
        )

        grouped[category]["products"] += 1

        grouped[category]["value"] += (
            product.price *
            product.stock
        )

    result = []

    for category, data in grouped.items():

        result.append({

            "category": category,

            "stock":
                data["stock"],

            "products":
                data["products"],

            "inventory_value":
                round(
                    data["value"],
                    2
                ),
        })

    return result


# =========================================================
# LOW STOCK PRODUCTS
# =========================================================

@router.get("/analytics/low-stock")
def low_stock_products(
    db: Session = Depends(get_db)
):

    products = db.query(Product).filter(
        Product.stock < 20
    ).all()

    return products
