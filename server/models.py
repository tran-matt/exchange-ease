# models.py
from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Float, Text
from sqlalchemy.orm import relationship
from sqlalchemy_serializer import SerializerMixin
from config import db

class User(db.Model, SerializerMixin):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True)
    name = Column(String(50), nullable=False)
    username = Column(String(50), unique=True, nullable=False)
    email = Column(String(120), unique=True, nullable=False)
    password = Column(String(60), nullable=False)
    items = relationship('Item', back_populates='owner', lazy=True)
    trades_initiated = relationship('Trade', back_populates='initiator', foreign_keys='Trade.initiator_id', lazy=True)
    trades_received = relationship('Trade', back_populates='receiver', foreign_keys='Trade.receiver_id', lazy=True)
    reviews_received = relationship('Review', back_populates='reviewed_user', foreign_keys='Review.reviewed_user_id', lazy=True)
    reviews_given = relationship('Review', back_populates='reviewing_user', foreign_keys='Review.reviewing_user_id', lazy=True)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'username': self.username,
            'email': self.email,
            'password': self.password,
        }

class Item(db.Model, SerializerMixin):
    __tablename__ = 'items'

    id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False)
    description = Column(Text, nullable=True)
    owner_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    type_id = Column(Integer, ForeignKey('item_types.id'), nullable=False)
    item_type = relationship('ItemType', back_populates='items')

    owner = relationship('User', back_populates='items')
    trades = relationship('Trade', secondary='trade_item_association', back_populates='item')

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'owner_id': self.owner_id,
            'type_id': self.type_id,
        }

class Trade(db.Model, SerializerMixin):
    __tablename__ = 'trades'

    id = Column(Integer, primary_key=True)
    initiator_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    receiver_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    status = Column(String(20), default='pending', nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    trade_cost = Column(Float, nullable=False)

    ACCEPTED = 'accepted'
    COMPLETED = 'completed'

    @property
    def is_accepted(self):
        return self.status == self.ACCEPTED

    @property
    def is_completed(self):
        return self.status == self.COMPLETED

    initiator = relationship('User', back_populates='trades_initiated', foreign_keys=[initiator_id])
    receiver = relationship('User', back_populates='trades_received', foreign_keys=[receiver_id])
    item = relationship('Item', secondary='trade_item_association', back_populates='trades')

    def to_dict(self):
        return {
            'id': self.id,
            'initiator_id': self.initiator_id,
            'receiver_id': self.receiver_id,
            'status': self.status,
            'created_at': self.created_at.isoformat(),
            'trade_cost': self.trade_cost,
        }

class Review(db.Model, SerializerMixin):
    __tablename__ = 'reviews'

    id = Column(Integer, primary_key=True)
    reviewing_user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    reviewed_user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    text = Column(Text, nullable=False)
    rating = Column(Integer, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    def validate_rating(self):
        if not 1 <= self.rating <= 5:
            raise ValueError("Rating must be between 1 and 5.")

    reviewing_user = relationship('User', back_populates='reviews_given', foreign_keys=[reviewing_user_id])
    reviewed_user = relationship('User', back_populates='reviews_received', foreign_keys=[reviewed_user_id])

    def to_dict(self):
        return {
            'id': self.id,
            'reviewing_user_id': self.reviewing_user_id,
            'reviewed_user_id': self.reviewed_user_id,
            'text': self.text,
            'rating': self.rating,
            'created_at': self.created_at.isoformat(),
        }

class ItemType(db.Model, SerializerMixin):
    __tablename__ = 'item_types'

    id = Column(Integer, primary_key=True)
    name = Column(String(50), unique=True, nullable=False)
    items = relationship('Item', back_populates='item_type')

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
        }
