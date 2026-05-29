from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.database import Base, engine

from app.models.product import Product
from app.models.customer import Customer
from app.models.order import Order
from app.models.order_item import OrderItem

from app.routes.product_routes import router as product_router
from app.routes.order_routes import router as order_router
from app.routes.customer_routes import (
    router as customer_router
)
from app.routes.dashboard_routes import (
    router as dashboard_router
)

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="SmartStock AI",
    version="1.0.0"
)

# CORS

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ROUTES

app.include_router(product_router)
app.include_router(order_router)
app.include_router(customer_router)
app.include_router(dashboard_router)

@app.get("/")
def root():
    return {
        "message": "SmartStock API Running Successfully"
    }