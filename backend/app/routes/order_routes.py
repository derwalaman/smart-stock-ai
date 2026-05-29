from fastapi import APIRouter, Depends, HTTPException

from sqlalchemy.orm import Session

from app.core.database import get_db

from app.models.product import Product
from app.models.order import Order
from app.models.order_item import OrderItem

from app.schemas.order_schema import OrderCreate

router = APIRouter(
    prefix="/orders",
    tags=["Orders"]
)


@router.post("/")
def create_order(
    order: OrderCreate,
    db: Session = Depends(get_db)
):

    total_price = 0

    new_order = Order(
        customer_id=order.customer_id,
        total_price=0,
    )

    db.add(new_order)

    db.commit()

    db.refresh(new_order)

    for item in order.items:

        product = db.query(Product).filter(
            Product.id == item.product_id
        ).first()

        if not product:
            raise HTTPException(
                status_code=404,
                detail=f"Product not found"
            )

        if product.stock < item.quantity:
            raise HTTPException(
                status_code=400,
                detail=f"Insufficient stock for {product.name}"
            )

        product.stock -= item.quantity

        item_total = (
            product.price * item.quantity
        )

        total_price += item_total

        order_item = OrderItem(
            order_id=new_order.id,
            product_id=product.id,
            quantity=item.quantity,
            price=product.price,
        )

        db.add(order_item)

    new_order.total_price = total_price

    db.commit()

    return {
        "message": "Order created",
        "order_id": new_order.id,
        "total": total_price,
    }


@router.get("/")
def get_orders(
    db: Session = Depends(get_db)
):

    return db.query(Order).all()

@router.patch("/{order_id}/status")
def update_order_status(
    order_id: int,
    status: str,
    db: Session = Depends(get_db)
):

    order = (
        db.query(Order)
        .filter(Order.id == order_id)
        .first()
    )

    if not order:

        raise HTTPException(
            status_code=404,
            detail="Order not found"
        )

    allowed_statuses = [
        "Pending",
        "Completed",
        "Cancelled",
        "Shipped",
    ]

    if status not in allowed_statuses:

        raise HTTPException(
            status_code=400,
            detail="Invalid status"
        )

    order.status = status

    db.commit()

    db.refresh(order)

    return {
        "message":
        "Order status updated",
        "order": order
    }