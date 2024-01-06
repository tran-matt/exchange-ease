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

 
@app.route('/')
def index():
    return '<h1>Exchange Ease</h1>'

if __name__ == '__main__':
    app.run(port=5555, debug=True)
