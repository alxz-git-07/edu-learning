import os

from dotenv import load_dotenv
from flask import Flask
from flask_migrate import Migrate
from flask_restful import Api

from models import db
from resources import register_api_resources, bcrypt

load_dotenv()
app = Flask(__name__)

# configure database connection and auth settings
app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL", "sqlite:///demo.db")
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY", "dev-secret-key")
app.config["TOKEN_EXPIRATION"] = int(os.getenv("TOKEN_EXPIRATION", "86400"))

migrate = Migrate(app=app, db=db)

db.init_app(app=app)
bcrypt.init_app(app)
api = Api(app=app)
register_api_resources(api)


@app.after_request
def add_cors_headers(response):
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
    response.headers["Access-Control-Allow-Methods"] = (
        "GET, POST, PUT, PATCH, DELETE, OPTIONS"
    )
    return response
