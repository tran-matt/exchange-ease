from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData
from sqlalchemy.orm import validates
from sqlalchemy_serializer import SerializerMixin
from datetime import datetime

metadata = MetaData(naming_convention={
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
})

db = SQLAlchemy(metadata=metadata)


class User(db.Model, SerializerMixin):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    username = db.Column(db.String, unique=True, nullable=False)
    password = db.Column(db.String, nullable=False)
    email = db.Column(db.String, unique=True, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # add relationship
    items = db.relationship('Item', back_populates='owner')
    initiated_trades = db.relationship('Trade', foreign_keys='Trade.initiator_id', back_populates='initiator')
    received_trades = db.relationship('Trade', foreign_keys='Trade.receiver_id', back_populates='receiver')
    reviews_given = db.relationship('Review', foreign_keys='Review.reviewer_id', back_populates='reviewer')
    reviews_received = db.relationship('Review', foreign_keys='Review.reviewed_user_id', back_populates='reviewed_user')

    def __repr__(self):
        return f'<User {self.username}>'


class Item(db.Model, SerializerMixin):
    __tablename__ = 'items'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    image = db.Column(db.String)
    description = db.Column(db.Text)
    estimated_value = db.Column(db.Float)
    type = db.Column(db.String)
    date_added = db.Column(db.DateTime, default=datetime.utcnow)
    owner_id = db.Column(db.Integer, db.ForeignKey('users.id'))

    # add relationship
    owner = db.relationship('User', back_populates='items')
    trades = db.relationship('Trade', back_populates='item')

    def __repr__(self):
        return f'<Item {self.name}>'


class Trade(db.Model, SerializerMixin):
    __tablename__ = 'trades'

    id = db.Column(db.Integer, primary_key=True)
    status = db.Column(db.String, default='initiated')  # 'initiated', 'pending', 'complete'
    initiator_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    receiver_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    item_id = db.Column(db.Integer, db.ForeignKey('items.id'))

    # add relationships
    initiator = db.relationship('User', foreign_keys=[initiator_id], back_populates='initiated_trades')
    receiver = db.relationship('User', foreign_keys=[receiver_id], back_populates='received_trades')
    item = db.relationship('Item', back_populates='trades')

    def __repr__(self):
        return f'<Trade {self.id}>'


class Review(db.Model, SerializerMixin):
    __tablename__ = 'reviews'

    id = db.Column(db.Integer, primary_key=True)
    text = db.Column(db.Text)
    rating = db.Column(db.Integer, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    reviewer_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    reviewed_user_id = db.Column(db.Integer, db.ForeignKey('users.id'))

    # add relationships
    reviewer = db.relationship('User', foreign_keys=[reviewer_id], back_populates='reviews_given')
    reviewed_user = db.relationship('User', foreign_keys=[reviewed_user_id], back_populates='reviews_received')

    # add validation
    @validates('rating')
    def validate_rating(self, attr, value):
        if not (1 <= value <= 5):
            raise ValueError('Review must have a rating between 1 and 5!')
        else:
            return value

    def __repr__(self):
        return f'<Review {self.id}>'
