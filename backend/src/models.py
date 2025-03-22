from sqlalchemy import Table, Column, Integer, String, MetaData

metadata = MetaData()

users = Table(
    "users",
    metadata,
    Column("id", Integer, primary_key = True),
    Column("name", String(100)),
    Column("email", String(100), unique = True)
)

drinking = Table(
    "drinking",
    metadata,
    Column("id", Integer, primary_key = True),
    Column("user_id", Integer, foreign_key = True),
    Column("oz_goal", Integer),
    Column("oz_consumed", Integer),
    Column("oz_remaining", Integer),
    Column("date", String(10)) 
)

