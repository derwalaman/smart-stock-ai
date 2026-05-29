from faker import Faker
import random

from datetime import timedelta
from datetime import datetime

from app.core.database import SessionLocal

from app.models.product import Product
from app.models.customer import Customer
from app.models.order import Order
from app.models.order_item import OrderItem

fake = Faker()

db = SessionLocal()

print("Cleaning old database data...")

# DELETE OLD DATA IN CORRECT ORDER

db.query(OrderItem).delete()
db.query(Order).delete()
db.query(Customer).delete()
db.query(Product).delete()

db.commit()

print("Old data removed successfully.")

# =========================================
# PRODUCTS
# =========================================

categories = [
    "Laptops",
    "Phones",
    "Gaming",
    "Audio",
    "Accessories",
    "Monitors",
    "Smart Devices",
]

warehouses = [
    "Delhi Warehouse",
    "Mumbai Storage",
    "Bangalore Hub",
    "Hyderabad Center",
]

products = []

print("Creating products...")

for i in range(80):

    category = random.choice(categories)

    stock = random.randint(5, 400)

    # LOW STOCK simulation
    if random.random() < 0.15:
        stock = random.randint(1, 15)

    product = Product(
        name=fake.unique.company(),
        sku=f"SKU-{1000+i}",
        category=category,
        price=random.randint(300, 8000),
        stock=stock,
        warehouse=random.choice(warehouses),
        created_at=fake.date_time_this_year(),
    )

    db.add(product)

    products.append(product)

db.commit()

print(f"{len(products)} products created.")

# =========================================
# CUSTOMERS
# =========================================

customers = []

print("Creating customers...")

for i in range(150):

    customer = Customer(
        name=fake.name(),
        email=fake.unique.email(),
        phone=fake.phone_number(),
        address=fake.address(),
        created_at=fake.date_time_this_year(),
    )

    db.add(customer)

    customers.append(customer)

db.commit()

print(f"{len(customers)} customers created.")

# =========================================
# ORDERS
# =========================================

statuses = [
    "Completed",
    "Pending",
    "Cancelled",
    "Shipped",
]

today = datetime.utcnow()

print("Creating orders...")

orders_created = 0

for i in range(700):

    random_days = random.randint(0, 365)

    order_date = today - timedelta(
        days=random_days
    )

    customer = random.choice(customers)

    status = random.choices(
        statuses,
        weights=[55, 20, 10, 15],
        k=1,
    )[0]

    total_price = 0

    order = Order(
        customer_id=customer.id,
        total_price=0,
        status=status,
        created_at=order_date,
    )

    db.add(order)

    db.commit()

    db.refresh(order)

    # EACH ORDER HAS MULTIPLE PRODUCTS

    order_products = random.sample(
        products,
        random.randint(1, 5),
    )

    for product in order_products:

        quantity = random.randint(1, 4)

        item_total = product.price * quantity

        total_price += item_total

        order_item = OrderItem(
            order_id=order.id,
            product_id=product.id,
            quantity=quantity,
            price=product.price,
        )

        db.add(order_item)

    order.total_price = total_price

    orders_created += 1

db.commit()

print(f"{orders_created} orders created.")

# =========================================
# FINAL SUMMARY
# =========================================

print("\nDatabase seeded successfully 🚀")
print("--------------------------------")
print(f"Products  : {len(products)}")
print(f"Customers : {len(customers)}")
print(f"Orders    : {orders_created}")
print("--------------------------------")