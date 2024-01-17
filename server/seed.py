#!/usr/bin/env python3

from faker import Faker
from app import app, db
from models import User, Item, Trade, Review, bcrypt
from random import randint, choice

fake = Faker()

def seed_users(num_users=30):
    for _ in range(num_users):
        user = User(
            first_name=fake.first_name(),
            last_name=fake.last_name(),
            username=fake.user_name(),
            email=fake.email(),
            created_at=fake.date_time_this_decade()
        )
        user.password_hash = "Tester69"
        db.session.add(user)
    db.session.commit()

object_list = [
    "Antique Clock",
    "Vintage Camera",
    "Leather Jacket",
    "Handcrafted Jewelry",
    "Rare Vinyl Records",
    "Artisanal Pottery",
    "Classic Board Games",
    "Antique Furniture",
    "Designer Sunglasses",
    "Retro Gaming Console",
    "Persian Rug",
    "Sci-Fi Collectibles",
    "Handwoven Basket",
    "Musical Instruments (e.g., Guitar, Violin)",
    "Vintage Typewriter",
    "Sports Memorabilia",
    "Vintage Tea Set",
    "Sculptures",
    "Bonsai Tree",
    "Vintage Suitcase",
    "Customized Skateboard",
    "Crystal Decanter Set",
    "Rare Coins",
    "Antique Tea Chest",
    "Chess Set",
    "Rare Book Collection",
    "Hand-painted Silk Scarf",
    "Pocket Watches",
    "Vintage Posters",
    "Wooden Chessboard",
    "Stained Glass Art",
    "Antique Maps",
    "Old Trinket Boxes",
    "Exotic Houseplants",
    "Steampunk Gadgets",
    "Vintage Luggage",
    "Hand-carved Statues",
    "Movie Memorabilia",
    "Quirky Wall Clocks",
    "Victorian Era Clothing",
    "Vintage Kitchenware",
    "Autographed Memorabilia",
    "Handmade Quilts",
    "Ancient Artifacts (Replicas)",
    "Antique Writing Desk",
    "Custom Sneaker Art",
    "Hand-dyed Textiles",
    "Retro Lunchboxes",
    "Model Trains",
    "Framed Original Art",
    "Vintage Telephones",
    "Wooden Ship Models",
    "Tribal Masks",
    "Classic Car Parts",
    "Gemstone Jewelry",
    "Antique Globes",
    "Vintage Perfume Bottles",
    "Rare Stamps",
    "Woven Wall Hangings",
    "Antique Brass Candlesticks",
    "Customized Skateboard Decks",
    "Art Nouveau Mirrors",
    "Vintage Microphones",
    "Handmade Candles",
    "Inlaid Wooden Boxes",
    "Vintage Binoculars",
    "Ancient Coins (Replicas)",
    "Hand-embroidered Textiles",
    "Retro Arcade Games",
    "African Art Sculptures",
    "Classic Fountain Pens",
    "Antique Lanterns",
    "Victorian Era Fans",
    "Collectible Figurines",
    "Hand-blown Glass Art",
    "Antique Keys",
    "Vintage Sewing Machines",
    "Customized PC Builds",
    "Handmade Leather Goods",
    "Retro Rotary Phones",
    "Ancient Pottery (Replicas)",
    "Old-fashioned Gramophones",
    "Nautical Instruments",
    "Customized Bicycles",
    "Antique Brass Compasses",
    "Wooden Model Airplanes",
    "Victorian Glove Boxes",
    "Vintage Soda Crates",
    "Art Deco Vases",
    "Classic Vinyl Albums",
    "Architectural Salvage",
    "Vintage Radios",
    "Handcrafted Masks",
    "Vintage Brass Candle Holders",
    "Retro Flip Clocks",
    "Asian Inspired Art",
    "Antique Iron Keys",
    "Handmade Paper Art",
    "Vintage Cookie Jars",
    "Classic Fishing Gear"
]

def seed_items(num_items=100):
    users = User.query.all()
    for _ in range(num_items):
        image_url = f"https://picsum.photos/200/300?random={randint(1, 1000)}"

        item = Item(
            name=choice(object_list),
            image=image_url,
            description=fake.text(),
            estimated_value=randint(1, 1000),
            type=choice(["Electronics", "Home and Furniture", "Clothing and Accessories", "Books and Media", "Collectables and Memorabilia","Toys and Hobbies","Sports and Outdoor Equipement","Tools and DIY Equipement", "Health and Fitness","Vehicles and Parts","Arts and Crafts", "Musical Instruments","Services","Tickets and Events", "Pets and Pet Supplies", "Pets and Pet Supplies", "Miscellaneous"]),
            date_added=fake.date_time_this_decade(),
            owner_id=choice(users).id
        )
        db.session.add(item)
    db.session.commit()

def seed_trades(num_trades=15):
    users = User.query.all()
    items = Item.query.all()
    for _ in range(num_trades):
        trade = Trade(
            status=choice(["not initiated", "pending", "complete"]),
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
