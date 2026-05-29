from fastapi import APIRouter, Depends

from sqlalchemy.orm import Session
from sqlalchemy import func

from app.core.database import get_db

from app.models.product import Product
from app.models.customer import Customer
from app.models.order import Order

from calendar import month_abbr

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"]
)


@router.get("/stats")
def get_dashboard_stats(
    db: Session = Depends(get_db)
):

    total_products = db.query(Product).count()

    total_customers = db.query(Customer).count()

    total_orders = db.query(Order).count()

    total_revenue = db.query(
        func.sum(Order.total_price)
    ).scalar()

    completed_orders = db.query(Order).filter(
        Order.status == "Completed"
    ).count()

    success_rate = (
        round(
            (completed_orders / total_orders) * 100,
            2
        )
        if total_orders > 0
        else 0
    )

    low_stock = db.query(Product).filter(
        Product.stock < 20
    ).count()

    inventory_accuracy = (
        round(
            ((total_products - low_stock) / total_products) * 100,
            2
        )
        if total_products > 0
        else 0
    )

    return {
        "total_products": total_products,
        "total_customers": total_customers,
        "total_orders": total_orders,
        "total_revenue": total_revenue,
        "success_rate": success_rate,
        "inventory_accuracy": inventory_accuracy,
    }


@router.get("/monthly-revenue")
def monthly_revenue(
    db: Session = Depends(get_db)
):

    revenue = db.query(
        func.extract("month", Order.created_at).label("month"),
        func.sum(Order.total_price).label("revenue")
    ).group_by(
        func.extract("month", Order.created_at)
    ).order_by(
        func.extract("month", Order.created_at)
    ).all()

    formatted = []

    for item in revenue:

        formatted.append({
            "month": month_abbr[int(item.month)],
            "revenue": float(item.revenue)
        })

    return formatted


@router.get("/recent-activity")
def recent_activity(
    db: Session = Depends(get_db)
):

    orders = db.query(Order).order_by(
        Order.created_at.desc()
    ).limit(8).all()

    return orders

@router.get("/inventory-overview")
def inventory_overview(
    db: Session = Depends(get_db)
):

    warehouses = db.query(
        Product.warehouse,
        func.count(Product.id)
    ).group_by(
        Product.warehouse
    ).all()

    return [
        {
            "name": warehouse[0],
            "products": warehouse[1],
        }
        for warehouse in warehouses
    ]