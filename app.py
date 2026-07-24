from dotenv import load_dotenv
from flask import Flask
from flask_migrate import Migrate
from flask_restful import Api

from models import db

load_dotenv()
app=Flask(__name__)

# configure database connection string
app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:///demo.db"

migrate=Migrate(app=app, db=db)

db.init_app(app=app)
api=Api(app=app)
