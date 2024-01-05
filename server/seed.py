#!/usr/bin/env python3

# Standard library imports
from random import randint, choice as rc

# Remote library imports
from faker import Faker

# Local imports
from app import app
from models import db, User, Item, Trade, Review, ItemType

fake = Faker()

def seed_users(num_users=10):
    for _ in range(num_users):
        user = User(
            name=fake.name(),
            username=fake.user_name(),
            email=fake.email(),
            password=fake.password()
        )
        db.session.add(user)

def seed_item_types():
    # Manually add some item types
    item_types_data = [
        {"name": "Electronics"},
        {"name": "Clothing"},
        {"name": "Furniture"},
        # Add more item types as needed
    ]

    for data in item_types_data:
        item_type = ItemType(**data)
        db.session.add(item_type)

def seed_items(num_items=20):
    item_types = ItemType.query.all()

    for _ in range(num_items):
        item = Item(
            name=fake.word(),
            description=fake.text(),
            owner_id=randint(1, User.query.count()),  # Assign a random user as the owner
            type_id=rc(item_types).id  # Assign a random item type
        )
        db.session.add(item)

def seed_trades(num_trades=10):
    users = User.query.all()

    for _ in range(num_trades):
        trade = Trade(
            initiator_id=rc(users).id,
            receiver_id=rc(users).id,
            status=Trade.ACCEPTED if randint(0, 1) == 1 else Trade.COMPLETED,  # Randomly set status
            trade_cost=randint(10, 100)
        )
        db.session.add(trade)

def seed_reviews(num_reviews=10):
    users = User.query.all()

    for _ in range(num_reviews):
        review = Review(
            reviewing_user_id=rc(users).id,
            reviewed_user_id=rc(users).id,
            text=fake.text(),
            rating=randint(1, 5)
        )
        db.session.add(review)

if __name__ == '__main__':
    with app.app_context():
        print("Starting seed...")

        # Call the functions to seed your database
        seed_users()
        seed_item_types()  # Add this line to seed item types
        seed_items()
        seed_trades()
        seed_reviews()

        # Commit the changes to the database
        db.session.commit()

        print("Seed completed.")
