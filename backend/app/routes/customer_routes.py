from fastapi import APIRouter, Depends, HTTPException

from sqlalchemy.orm import Session

from sqlalchemy.exc import IntegrityError

from app.core.database import get_db

from app.models.customer import Customer

from app.models.order import Order

from app.schemas.customer_schema import (
    CustomerCreate,
    CustomerUpdate,
    CustomerResponse,
)

router = APIRouter(
    prefix="/customers",
    tags=["Customers"]
)

# GET ALL CUSTOMERS

@router.get(
    "/",
    response_model=list[CustomerResponse]
)
def get_customers(
    db: Session = Depends(get_db)
):

    customers = db.query(Customer).all()

    return customers


# CREATE CUSTOMER

@router.post(
    "/",
    response_model=CustomerResponse
)
def create_customer(
    customer: CustomerCreate,
    db: Session = Depends(get_db)
):

    # CHECK EMAIL EXISTS

    existing_customer = db.query(Customer).filter(
        Customer.email == customer.email
    ).first()

    if existing_customer:

        raise HTTPException(
            status_code=400,
            detail="Customer email already exists"
        )

    new_customer = Customer(
        name=customer.name,
        email=customer.email,
        phone=customer.phone,
    )

    db.add(new_customer)

    db.commit()

    db.refresh(new_customer)

    return new_customer


# UPDATE CUSTOMER

@router.put(
    "/{customer_id}",
    response_model=CustomerResponse
)
def update_customer(
    customer_id: int,
    updated_customer: CustomerUpdate,
    db: Session = Depends(get_db)
):

    customer = db.query(Customer).filter(
        Customer.id == customer_id
    ).first()

    if not customer:

        raise HTTPException(
            status_code=404,
            detail="Customer not found"
        )

    # CHECK EMAIL CONFLICT

    existing_email = db.query(Customer).filter(
        Customer.email == updated_customer.email,
        Customer.id != customer_id
    ).first()

    if existing_email:

        raise HTTPException(
            status_code=400,
            detail="Email already in use"
        )

    # UPDATE FIELDS

    customer.name = updated_customer.name

    customer.email = updated_customer.email

    customer.phone = updated_customer.phone

    db.commit()

    db.refresh(customer)

    return customer


# DELETE CUSTOMER

@router.delete("/{customer_id}")
def delete_customer(
    customer_id: int,
    db: Session = Depends(get_db)
):

    customer = db.query(Customer).filter(
        Customer.id == customer_id
    ).first()

    if not customer:

        raise HTTPException(
            status_code=404,
            detail="Customer not found"
        )

    # CHECK IF CUSTOMER HAS ORDERS

    existing_order = db.query(Order).filter(
        Order.customer_id == customer_id
    ).first()

    if existing_order:

        raise HTTPException(
            status_code=400,
            detail=(
                "Cannot delete customer because order history exists"
            )
        )

    try:

        db.delete(customer)

        db.commit()

        return {
            "message":
            "Customer deleted successfully"
        }

    except IntegrityError:

        db.rollback()

        raise HTTPException(
            status_code=400,
            detail="Unable to delete customer"
        )