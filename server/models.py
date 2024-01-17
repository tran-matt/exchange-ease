from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData
from sqlalchemy.orm import validates
from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy_serializer import SerializerMixin
from datetime import datetime
from config import db, bcrypt
from flask_bcrypt import Bcrypt
from flask_login import UserMixin

bcrypt = Bcrypt()

class User(db.Model, SerializerMixin, UserMixin):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String)
    last_name = db.Column(db.String)
    username = db.Column(db.String, unique=True, nullable=False)
    _password_hash = db.Column(db.String)
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

    serialize_rules = (     
        '-_password_hash',
   )


    @hybrid_property
    def password_hash(self):
        raise Exception('Password is not a readable attribute.')

    @password_hash.setter
    def password_hash(self, password):
        password_hash = bcrypt.generate_password_hash(password.encode('utf-8'))
        self._password_hash = password_hash.decode('utf-8')

    def check_password(self, password):
        return bcrypt.check_password_hash(
        self._password_hash, password.encode('utf-8')
        )
    

    def get_id(self):
        return str(self.id)

class Item(db.Model, SerializerMixin):
    __tablename__ = 'items'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    image = db.Column(db.String)
    description = db.Column(db.String)
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
    status = db.Column(db.String, default='not-initiated') 
    initiator_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    receiver_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    item_id = db.Column(db.Integer, db.ForeignKey('items.id'))
    selected_items = db.Column(db.JSON) 

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
