#!/usr/bin/env python3

from faker import Faker
from app import app, db
from models import User, Item, Trade, Review
from random import randint, choice

fake = Faker()

def seed_users(num_users=10):
    for _ in range(num_users):
        user = User(
            name=fake.name(),
            username=fake.user_name(),
            password=fake.password(),
            email=fake.email(),
            created_at=fake.date_time_this_decade()
        )
        db.session.add(user)
    db.session.commit()

def seed_items(num_items=20):
    users = User.query.all()
    for _ in range(num_items):
        item = Item(
            name=fake.word(),
            image=fake.image_url(),
            description=fake.text(),
            estimated_value=randint(1, 1000),
            type=choice(["Electronics", "Clothing", "Books", "Furniture", "Other"]),
            date_added=fake.date_time_this_decade(),
            owner_id=choice(users).id
        )
        db.session.add(item)
    db.session.commit()

def seed_trades(num_trades=10):
    users = User.query.all()
    items = Item.query.all()
    for _ in range(num_trades):
        trade = Trade(
            status=choice(["initiated", "pending", "complete"]),
            initiator_id=choice(users).id,
            receiver_id=choice(users).id,
            item_id=choice(items).id
        )
        db.session.add(trade)
    db.session.commit()

def seed_reviews(num_reviews=15):
    users = User.query.all()
    for _ in range(num_reviews):
        review = Review(
            text=fake.text(),
            rating=randint(1, 5),
            created_at=fake.date_time_this_decade(),
            reviewer_id=choice(users).id,
            reviewed_user_id=choice(users).id
        )
        db.session.add(review)
    db.session.commit()

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
        seed_users()
        seed_items()
        seed_trades()
        seed_reviews()
