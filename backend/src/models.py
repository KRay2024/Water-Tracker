from sqlalchemy import Column, Integer, String, ForeignKey, Date
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class users(Base):
    __tablename__ = 'users'
    
    id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, nullable=False)

    # Define a relationship to the Drinking table
    drinking_records = relationship("Drinking", back_populates="user")


class drinking(Base):
    __tablename__ = 'drinking'
    
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    oz_goal = Column(Integer, nullable=False)
    oz_consumed = Column(Integer, nullable=False)
    oz_remaining = Column(Integer, nullable=False)
    date = Column(Date, nullable=False)

    # Define the relationship to the User table
    user = relationship("User", back_populates="drinking_records")


