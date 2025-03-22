from databases import Database
from sqlalchemy import create_engine

DATABASE_URL = "postgresql://postgres:postgres@localhost/website_data"

db = Database(DATABASE_URL)
meta = MetaData()

engine = create_engine(DATABASE_URL)
meta.create_all(engine)