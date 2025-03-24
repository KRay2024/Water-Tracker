from databases import Database
import sqlalchemy
import os
from dotenv import load_dotenv

load_dotenv("backend.env")

DATABASE_URL = os.getenv("DATABASE_URL")

database = Database(DATABASE_URL)
metadata = sqlalchemy.MetaData()
engine = sqlalchemy.create_engine(DATABASE_URL)

