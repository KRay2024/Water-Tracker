from databases import Database
import sqlalchemy

DATABASE_URL = "postgresql://postgres:postgres@db:5432/website_data"
database = Database(DATABASE_URL)
metadata = sqlalchemy.MetaData()
engine = sqlalchemy.create_engine(DATABASE_URL)

