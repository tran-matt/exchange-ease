# Standard library imports

# Remote library imports
from flask import Flask
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from flask_migrate import Migrate
from flask_restful import Api
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData, or_ 

# Local imports

# Instantiate app, set attributes
app = Flask(__name__)

app.secret_key = b'\xfc\xd9\x8epE\xb5\x1bs\xf5\x0cv\x10\xaa\xc7\x8d\xa6'

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///exchangeease.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SESSION_COOKIE_NAME'] = 'id'
app.config['SESSION_COOKIE_SECURE'] = True  
app.config['SESSION_COOKIE_HTTPONLY'] = True
app.config['SESSION_COOKIE_SAMESITE'] = 'None' 
app.json.compact = False

# Define metadata, instantiate db
metadata = MetaData(naming_convention={
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
})
db = SQLAlchemy(metadata=metadata)
migrate = Migrate(app, db)
db.init_app(app)

# Instantiate Bcrypt
bcrypt = Bcrypt(app)
# Instantiate REST API
api = Api(app)
# Instantiate CORS
CORS(app, supports_credentials=True)
