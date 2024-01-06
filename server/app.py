#!/usr/bin/env python3

# Standard library imports

# Remote library imports
from flask import Flask, request, make_response
from flask_restful import Resource

# Local imports
from config import app, db, api
# Add your model imports
from models import db, User

# Views go here!
class AllUsers(Resource):
    def get(self):
        try:
            users = User.query.all()
            response_body = [user.to_dict(rules=('-items','-trades', '-reviews', '-item_types')) for user in users]
            return make_response(response_body, 200)
    
    def post(self):
        try:
            data = request.get_json()
            new_user = User(
                name=data.get('name'),
                username=data.get('username'),
                email=data.get('email'),
                password=data.get('password')
                # Add other fields as needed
            )
            db.session.add(new_user)
            db.session.commit()

            response_body = new_user.to_dict(rules=('-items','-trades', '-reviews', '-item_types'))
            return make_response(response_body, 201)
        except Exception as e:
            print(f"Error adding user: {e}")
            response_body = {"error": "Internal Server Error"}
            return make_response(response_body, 500)

    def delete(self):
        try:
            data = request.get_json()
            user_id = data.get('user_id')
            user = User.query.get(user_id)

            if user:
                db.session.delete(user)
                db.session.commit()
                response_body = {}
                return make_response(response_body, 204)
            else:
                response_body = {"error": "User not found"}
                return make_response(response_body, 404)
        except Exception as e:
            print(f"Error deleting user: {e}")
            response_body = {"error": "Internal Server Error"}
            return make_response(response_body, 500)

class UserById(Resource):
    def get(self, id):
        user = User.query.get(id)

        if user:
            response_body = user.to_dict(rules=('-items', '-trades', '-reviews', '-item_types'))
            return make_response(response_body, 200)
        else:
            response_body = {"error": "User not found"}
            return make_response(response_body, 404)

    def delete(self, id):
        user = User.query.get(id)

        if user:
            db.session.delete(user)
            db.session.commit()
            response_body = {}
            return make_response(response_body, 204)
        else:
            response_body = {"error": "User not found"}
            return make_response(response_body, 404)

    def put(self, id):
        try:
            user = User.query.get(id)

            if user:
                data = request.get_json()
                user.name = data.get('name', user.name)
                user.username = data.get('username', user.username)
                user.email = data.get('email', user.email)
                user.password = data.get('password', user.password)
                # Update other fields as needed

                db.session.commit()

                response_body = user.to_dict(rules=('-items','-trades', '-reviews', '-item_types'))
                return make_response(response_body, 200)
            else:
                response_body = {"error": "User not found"}
                return make_response(response_body, 404)
        except Exception as e:
            print(f"Error updating user: {e}")
            response_body = {"error": "Internal Server Error"}
            return make_response(response_body, 500)

api.add_resource(AllUsers, "/users")
api.add_resource(UserById, '/users/<int:id>')
 
@app.route('/')
def index():
    return '<h1>Exchange Ease</h1>'

if __name__ == '__main__':
    app.run(port=5555, debug=True)
