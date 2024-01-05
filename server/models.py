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

user_item_association = db.Table('user_item_association',
    Column('user_id', Integer, ForeignKey('users.id')),
    Column('item_id', Integer, ForeignKey('items.id'))
)

class Trade(db.Model, SerializerMixin):
    __tablename__ = 'trades'

    id = Column(Integer, primary_key=True)
    initiator_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    receiver_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    status = Column(String(20), default='pending', nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    trade_cost = Column(Float, nullable=False)

    # Additional states for trade
    ACCEPTED = 'accepted'
    COMPLETED = 'completed'

    @property
    def is_accepted(self):
        return self.status == self.ACCEPTED

    @property
    def is_completed(self):
        return self.status == self.COMPLETED

    # Back-populate relationships
    initiator = relationship('User', back_populates='trades_initiated', foreign_keys=[initiator_id])
    receiver = relationship('User', back_populates='trades_received', foreign_keys=[receiver_id])
    item = relationship('Item', secondary='trade_item_association', back_populates='trades')

trade_item_association = db.Table('trade_item_association',
    Column('trade_id', Integer, ForeignKey('trades.id')),
    Column('item_id', Integer, ForeignKey('items.id'))
)

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

    # Back-populate relationships
    reviewing_user = relationship('User', back_populates='reviews_given', foreign_keys=[reviewing_user_id])
    reviewed_user = relationship('User', back_populates='reviews_received', foreign_keys=[reviewed_user_id])

class ItemType(db.Model, SerializerMixin):
    __tablename__ = 'item_types'

    id = Column(Integer, primary_key=True)
    name = Column(String(50), unique=True, nullable=False)
    items = relationship('Item', back_populates='item_type')
    