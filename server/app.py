from flask import Flask, request, make_response, jsonify, session, render_template
from flask_restful import Api, Resource
from config import app, db, api
from models import User, Item, Trade, Review
from sqlalchemy import or_
from sqlalchemy.exc import IntegrityError


@app.before_request
def check_if_logged_in():
    if not session.get('user_id') and request.endpoint in {'/signup','/login','/check_session', '/users'}:
        return {'error': 'Unauthorized'}, 401

class AllUsers(Resource):
    def get(self):
        users = User.query.all()
        response_body = [user.to_dict(rules=('-items', '-initiated_trades', '-received_trades', '-reviews_given', '-reviews_received')) for user in users]
        return make_response(response_body, 200)

    # def post(self):
    #     data = request.get_json()
    #     print("Received data:", data)

    #     if 'created_at' not in data:
    #         data['created_at'] = datetime.utcnow()

    #     hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')

    #     new_user = User(name=data['name'], username=data['username'], password=hashed_password, email=data['email'], created_at=data['created_at'])
    #     db.session.add(new_user)
    #     db.session.commit()

    #     response_body = {"message": "User registered successfully"}
    #     return jsonify(response_body), 201

api.add_resource(AllUsers, '/api/users', endpoint='users')


class UserById(Resource):
    def get(self, user_id):
        user = User.query.get(user_id)

        if user:
            response_body = user.to_dict(rules=('-items', '-initiated_trades', '-received_trades', '-reviews_given', '-reviews_received'))
            return make_response(response_body, 200)
        else:
            response_body = {"error": "User not found"}
            return make_response(response_body, 404)

    # def post(self, user_id):
    #     data = request.get_json()

    #     new_user = User(name=data['name'], username=data['username'], password=data['password'], email=data['email'])
    #     db.session.add(new_user)
    #     db.session.commit()

    #     response_body = {"message": "User created successfully"}
    #     return make_response(response_body, 201)

    def patch(self, user_id):
        data = request.get_json()
        user = User.query.get(user_id)

        if user:
            user.name = data.get('name', user.name)
            user.username = data.get('username', user.username)
            # user.password = data.get('password', user.password)
            user.email = data.get('email', user.email)

            db.session.commit()
            response_body = {"message": "User updated successfully"}
            return make_response(response_body, 200)
        else:
            response_body = {"error": "User not found"}
            return make_response(response_body, 404)

    def delete(self, user_id):
        user = User.query.get(user_id)

        if user:
            db.session.delete(user) #could do it off session cookie to prevent cross site attacks
            db.session.commit()
            response_body = {}
            return make_response(response_body, 204)
        else:
            response_body = {"error": "User not found"}
            return make_response(response_body, 404)

api.add_resource(UserById, '/api/users/<int:user_id>')


class AllItems(Resource):
    def get(self):
        items = Item.query.all()
        response_body = [item.to_dict(rules=('-owner', '-trades')) for item in items]
        return make_response(response_body, 200)

api.add_resource(AllItems, '/api/items')

class ItemById(Resource):
    def get(self, item_id):
        item = Item.query.get(item_id)

        if item:
            response_body = item.to_dict(rules=('-owner', '-trades'))
            return make_response(response_body, 200)
        else:
            response_body = {"error": "Item not found"}
            return make_response(response_body, 404)

    def patch(self, item_id):
        data = request.get_json()
        item = Item.query.get(item_id)

        if item:
            item.name = data.get('name', item.name)
            item.description = data.get('description', item.description)
            item.owner_id = data.get('owner_id', item.owner_id)

            db.session.commit()
            response_body = {"message": "Item updated successfully"}
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

api.add_resource(ItemById, '/api/items/<int:item_id>')

class ItemCreation(Resource):
    def post(self):
        print("hello")
        print(request.get_json())
        data = request.get_json()

        try:
            # Print form data and types
            print("Form Data:")
            print(f"Name: {data['name']}")
            print(f"Description: {data['description']}")
            print(f"Estimated Value: {float(data['estimated_Value'])}")
            print(f"Type: {data['type']}")
            print(f"Owner ID: {session.get('user_id')}")

            # Use the filename or path as needed in your item creation logic
            new_item = Item(
                name=data["name"],
                description=data["description"],
                estimated_value=float(data["estimated_Value"]),
                type=data["type"],
                owner_id=session.get('user_id'),
                image=data["image"], 
            )

            db.session.add(new_item)
            db.session.commit()
            print(new_item.id)

            response_body = new_item.to_dict(rules=('-owner', '-trades'))
            return make_response(response_body, 201)
       
        except Exception as e:
            print(e)
            response_body = {"error": "Error processing the request"}
            return make_response(response_body, 500)

api.add_resource(ItemCreation, "/api/items")

class ItemDeletion(Resource):
    def delete(self, item_id):
        item = Item.query.get(item_id)

        if item and item.owner_id == session.get('user_id'):
            db.session.delete(item)
            db.session.commit()
            response_body = {"message": "Item deleted successfully"}
            return make_response(response_body, 204)
        else:
            response_body = {"error": "Item not found or unauthorized"}
            return make_response(response_body, 404)

api.add_resource(ItemDeletion, '/api/items/<int:item_id>')

class ItemUpdate(Resource):
    def patch(self, item_id):
        data = request.get_json()
        item = Item.query.get(item_id)

        if item:
            item.name = data.get('name', item.name)
            item.description = data.get('description', item.description)
            item.estimated_value = data.get('estimatedValue', item.estimated_value)
            item.type = data.get('type', item.type)
            item.image = data.get('image', item.image)

            db.session.commit()
            response_body = {"message": "Item updated successfully"}
            return make_response(response_body, 200)
        else:
            response_body = {"error": "Item not found"}
            return make_response(response_body, 404)

api.add_resource(ItemUpdate, '/api/items/update/<int:item_id>')


class AllTrades(Resource):
    def get(self):
        trades = Trade.query.all()
        response_body = [trade.to_dict(rules=('-item', '-initiator', '-receiver')) for trade in trades]
        return make_response(response_body, 200)

api.add_resource(AllTrades, '/api/trades')

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

api.add_resource(TradeById, '/api/trades/<int:trade_id>')

class TradeReceivedByUser(Resource):
    def get(self):
        trades = Trade.query.filter(Trade.receiver_id).all()
        response_body = [trade.to_dict(rules=('-item', '-initiator', '-receiver')) for trade in trades]
        return make_response(response_body, 200)

@app.route('/api/trades/received')

class TradeCreation(Resource):
    def post(self):
        data = request.get_json()
        new_trade = Trade(
            status="pending",
            initiator_id=session.get('user_id'),
            receiver_id=data['receiver_id'],
            item_id=data['item_id'],
            selected_items=(data['selected_items']),
        )
        db.session.add(new_trade)
        db.session.commit()

        response_body = new_trade.to_dict(rules=('-item', '-initiator', '-receiver'))
        return make_response(response_body, 201)

api.add_resource(TradeCreation, '/api/trades')

class UserItems(Resource):
    def get(self):

        items = Item.query.filter(Item.owner_id == session.get('user_id'))
        response_body = [item.to_dict(rules=('-owner', '-trades')) for item in items]
        return make_response(response_body, 200)


api.add_resource(UserItems, '/api/items/user')

class UserReviews(Resource):
    def get(self):

        reviews = Review.query.filter(Review.reviewed_user_id == session.get('user_id')).all()
        response_body = [review.to_dict(rules=('-reviewer', '-reviewed_user')) for review in reviews]
        return make_response(response_body, 200)

api.add_resource(UserReviews, '/api/reviews/user')

class TradeMadeByUser(Resource):
    def get(self):
        trades = Trade.query.filter(Trade.initiator_id == session.get('user_id')).all()
        response_body = [trade.to_dict(rules=('-item', '-initiator', '-receiver')) for trade in trades]
        return make_response(response_body, 200)

    def delete(self, trade_id):
        trade = Trade.query.get(trade_id)

        if trade and trade.initiator_id == session.get('user_id'):
            db.session.delete(trade)
            db.session.commit()
            response_body = {}
            return make_response(response_body, 204)
        else:
            response_body = {"error": "Trade not found or unauthorized"}
            return make_response(response_body, 404)

api.add_resource(TradeMadeByUser, '/api/trades/user')

class UserTradeOffers(Resource):
    def get(self, user_id):
        trade_offers = Trade.query.filter(Trade.receiver_id == user_id).all()
        response_body = [trade.to_dict(rules=('-item.trades', '-initiator.initiated_trades', '-initiator.received_trades', '-initiator.items', '-receiver', '-initiator.reviews_given','-initiator.reviews_received', '-item.owner')) for trade in trade_offers]
        return make_response(response_body, 200)

api.add_resource(UserTradeOffers, '/api/trades/user/offers/<int:user_id>', endpoint='user_trade_offers');

class TradeAccept(Resource):
    def patch(self, offer_id):
        try:
            trade_offer = Trade.query.get(offer_id)

            if trade_offer and trade_offer.receiver_id == session.get('user_id'):
                trade_offer.status = 'Complete'
                db.session.commit()

                response_body = {"message": "Trade offer accepted successfully"}
                return make_response(response_body, 200)
            else:
                response_body = {"error": "Trade offer not found or unauthorized"}
                return make_response(response_body, 404)
        except Exception as e:
            print(e)
            response_body = {"error": "Error processing the request"}
            return make_response(response_body, 500)

api.add_resource(TradeAccept, '/api/trades/accept/<int:offer_id>', endpoint='trade_accept')


class TradeReject(Resource):
    def patch(self, offer_id):
        try:
            trade_offer = Trade.query.get(offer_id)

            if trade_offer and trade_offer.receiver_id == session.get('user_id'):
                trade_offer.status = 'Incomplete'
                db.session.commit()

                response_body = {"message": "Trade offer rejected successfully"}
                return make_response(response_body, 200)
            else:
                response_body = {"error": "Trade offer not found or unauthorized"}
                return make_response(response_body, 404)
        except Exception as e:
            print(e)
            response_body = {"error": "Error processing the request"}
            return make_response(response_body, 500)

api.add_resource(TradeReject, '/api/trades/reject/<int:offer_id>', endpoint='trade_reject')

class AllReviews(Resource):
    def get(self):
        reviews = Review.query.all()
        response_body = [review.to_dict(rules=('-reviewer', '-reviewed_user')) for review in reviews]
        return make_response(response_body, 200)

api.add_resource(AllReviews, '/api/reviews')

class ReviewById(Resource):
    def get(self, review_id):
        review = Review.query.get(review_id)

        if review:
            response_body = review.to_dict(rules=('-reviewer', '-reviewed_user'))
            return make_response(response_body, 200)
        else:
            response_body = {"error": "Review not found"}
            return make_response(response_body, 404)

    def post(self, review_id):
        data = request.get_json()

        new_review = Review(
            rating=data['rating'],
            comment=data['comment'],
            reviewer_id=data['reviewer_id'],
            reviewed_user_id=data['reviewed_user_id']
        )
        db.session.add(new_review)
        db.session.commit()

        response_body = {"message": "Review created successfully"}
        return make_response(response_body, 201)

    def patch(self, review_id):
        data = request.get_json()
        review = Review.query.get(review_id)

        if review:
            review.rating = data.get('rating', review.rating)
            review.comment = data.get('comment', review.comment)
            review.reviewer_id = data.get('reviewer_id', review.reviewer_id)
            review.reviewed_user_id = data.get('reviewed_user_id', review.reviewed_user_id)

            db.session.commit()
            response_body = {"message": "Review updated successfully"}
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

api.add_resource(ReviewById, '/api/reviews/<int:review_id>')

class ReviewCreation(Resource):
    def post(self):
        data = request.get_json()
        new_review = Review(
            text=data['text'],
            rating=data['rating'],  
            reviewer_id=session.get('user_id'),
            reviewed_user_id=data['reviewed_user_id']
        )
        db.session.add(new_review) 
        db.session.commit()

        response_body = new_review.to_dict(rules=('-reviewer', '-reviewed_user'))
        return make_response(response_body, 201)
api.add_resource(ReviewCreation, '/api/reviews')

class Login(Resource):
    def post(self):
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')

        user = User.query.filter(User.username == username).first()

        if user and user.check_password(password):
            
            session['user_id'] = user.id  
            if session['user_id']:
                return make_response( user.to_dict(rules=('-items', '-initiated_trades', '-received_trades', '-reviews_given', '-reviews_received')), 200)
            return {'error': 'session could not be established'}, 400
        else:
            return {'message': 'Invalid credentials'}, 401

api.add_resource(Login, '/api/login', endpoint='login')

class GetTradeInfo(Resource):
    def get(self, trade_id):
        trade = Trade.query.filter(Trade.id == trade_id).first()
        if not trade:
            return {"message": "Trade not found"}, 404

        # Assuming trade.item_id is the ID of the item being traded
        trade_item = Item.query.filter(Item.id == trade.item_id).first()

        # Get all selected items in a single query
        selected_items_ids = [int(trade) for trade in trade.selected_items]
        selected_items = Item.query.filter(Item.id.in_(selected_items_ids)).all()

        response_body = {
            'trade_item': trade_item.to_dict(rules=('-owner', '-trades')) if trade_item else None,
            'selected_items': [item.to_dict(rules=('-owner', '-trades')) for item in selected_items]
        }
        return response_body, 200

api.add_resource(GetTradeInfo, '/api/trade/<int:trade_id>')

class Logout(Resource):
    def delete(self):
        if session.get('user_id'):
            session['user_id'] = None 
            session.pop('user_id', None)
            response = make_response({"message": "Logged out successfully"}, 200)
            response.set_cookie('id', '', expires=0, path='/', httponly=True)  # Clear the 'id' cookie
            return response
        return make_response({'error': 'Unauthorized'}, 401)

api.add_resource(Logout, '/api/logout')



class CheckSession(Resource):
    def get(self):
        user = User.query.filter(User.id == session.get('user_id')).first()
        if user:
                return  make_response(user.to_dict(rules=('-items', '-initiated_trades', '-received_trades', '-reviews_given', '-reviews_received')), 200)
        return {'message': '401: Not Authorized'}, 401


api.add_resource(CheckSession, '/api/check_session', endpoint='check_session')


class Signup(Resource):
  def post(self):
    email = request.get_json().get('email')
    first_name = request.get_json().get('firstName')
    last_name = request.get_json().get('lastName')
    username = request.get_json().get('username')
    password = request.get_json().get('password')

    if email and password and not User.query.filter(User.email == email).first():
        new_user = User(
        email = email,
        first_name = first_name,
        last_name = last_name,
        username = username,
       )
        new_user.password_hash = password
        try:
            
            db.session.add(new_user)
            db.session.commit()
            session['user_id'] = new_user.id
            return make_response(new_user.to_dict(rules=('-items', '-initiated_trades', '-received_trades', '-reviews_given', '-reviews_received')), 201)
        except IntegrityError:
            return {'error': '422 Unprocessable Entity'}, 422

api.add_resource(Signup, '/api/signup', endpoint='signup')

@app.route('/')
@app.route('/<int:id>')
def index(id=0):
    return render_template("index.html")



if __name__ == '__main__':
    app.run(port=5000, debug=True)
