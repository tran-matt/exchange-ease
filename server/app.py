from flask import Flask, request, make_response
from flask_restful import Api, Resource
from config import app, db, api
from models import User, Item, Trade, Review

class AllUsers(Resource):
    def get(self):
        users = User.query.all()
        response_body = [user.to_dict(rules=('-items', '-initiated_trades', '-received_trades', '-reviews_given', '-reviews_received')) for user in users]
        return make_response(response_body, 200)

api.add_resource(AllUsers, '/users')

class UserById(Resource):
    def get(self, user_id):
        user = User.query.get(user_id)

        if user:
            response_body = user.to_dict(rules=('-items', '-initiated_trades', '-received_trades', '-reviews_given', '-reviews_received'))
            return make_response(response_body, 200)
        else:
            response_body = {"error": "User not found"}
            return make_response(response_body, 404)

    def delete(self, user_id):
        user = User.query.get(user_id)

        if user:
            db.session.delete(user)
            db.session.commit()
            response_body = {}
            return make_response(response_body, 204)
        else:
            response_body = {"error": "User not found"}
            return make_response(response_body, 404)

api.add_resource(UserById, '/users/<int:user_id>')

class AllItems(Resource):
    def get(self):
        items = Item.query.all()
        response_body = [item.to_dict(rules=('-owner', '-trades')) for item in items]
        return make_response(response_body, 200)

api.add_resource(AllItems, '/items')

class ItemById(Resource):
    def get(self, item_id):
        item = Item.query.get(item_id)

        if item:
            response_body = item.to_dict(rules=('-owner', '-trades'))
            return make_response(response_body, 200)
        else:
            response_body = {"error": "Item not found"}
            return make_response(response_body, 404)

    def delete(self, item_id):
        item = Item.query.get(item_id)

        if item:
            db.session.delete(item)
            db.session.commit()
            response_body = {}
            return make_response(response_body, 204)
        else:
            response_body = {"error": "Item not found"}
            return make_response(response_body, 404)

api.add_resource(ItemById, '/items/<int:item_id>')

class AllTrades(Resource):
    def get(self):
        trades = Trade.query.all()
        response_body = [trade.to_dict(rules=('-item', '-initiator', '-receiver')) for trade in trades]
        return make_response(response_body, 200)

api.add_resource(AllTrades, '/trades')

class TradeById(Resource):
    def get(self, trade_id):
        trade = Trade.query.get(trade_id)

        if trade:
            response_body = trade.to_dict(rules=('-item', '-initiator', '-receiver'))
            return make_response(response_body, 200)
        else:
            response_body = {"error": "Trade not found"}
            return make_response(response_body, 404)

    def delete(self, trade_id):
        trade = Trade.query.get(trade_id)

        if trade:
            db.session.delete(trade)
            db.session.commit()
            response_body = {}
            return make_response(response_body, 204)
        else:
            response_body = {"error": "Trade not found"}
            return make_response(response_body, 404)

api.add_resource(TradeById, '/trades/<int:trade_id>')

class AllReviews(Resource):
    def get(self):
        reviews = Review.query.all()
        response_body = [review.to_dict(rules=('-reviewer', '-reviewed_user')) for review in reviews]
        return make_response(response_body, 200)

api.add_resource(AllReviews, '/reviews')

class ReviewById(Resource):
    def get(self, review_id):
        review = Review.query.get(review_id)

        if review:
            response_body = review.to_dict(rules=('-reviewer', '-reviewed_user'))
            return make_response(response_body, 200)
        else:
            response_body = {"error": "Review not found"}
            return make_response(response_body, 404)

    def delete(self, review_id):
        review = Review.query.get(review_id)

        if review:
            db.session.delete(review)
            db.session.commit()
            response_body = {}
            return make_response(response_body, 204)
        else:
            response_body = {"error": "Review not found"}
            return make_response(response_body, 404)

api.add_resource(ReviewById, '/reviews/<int:review_id>')

@app.route('/')
def home():
    return "Exchange Ease!"

if __name__ == '__main__':
    app.run(port=5000, debug=True)
