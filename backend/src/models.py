from sqlalchemy import Table, Column, Integer, String, ForeignKey, Date
from sqlalchemy.orm import relationship
from database import metadata
from sqlalchemy.orm import relationship

# Users table
users = Table(
    "users",
    metadata,
    Column("id", Integer, primary_key=True),
    Column("name", String(100), nullable=False),
    Column("email", String(100), unique=True, nullable=False),
)

# Drinking table
drinking = Table(
    "drinking",
    metadata,
    Column("id", Integer, primary_key=True),
    Column("user_id", Integer, ForeignKey("users.id"), nullable=False),
    Column("oz_goal", Integer, nullable=False),
    Column("oz_consumed", Integer, nullable=False),
    Column("oz_remaining", Integer, nullable=False),
    Column("date", Date, nullable=False)
)

#Defining relationships
users = relationship("User", back_populates="drinking_records")

