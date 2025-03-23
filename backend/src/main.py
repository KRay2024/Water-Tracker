# main.py
from fastapi import FastAPI, HTTPException
from database import database, engine, metadata
from models import users, drinking
from pydantic import BaseModel
from datetime import date
import logging

app = FastAPI()

logger = logging.getLogger(__name__)


class UserIn(BaseModel):
    name: str
    email: str

class DrinkingIn(BaseModel):
    user_id: int
    oz_goal: int
    oz_consumed: int
    oz_remaining: int
    date: date

@app.on_event("startup")
async def startup():
    await database.connect()
    metadata.create_all(engine)

@app.on_event("shutdown")
async def shutdown():
    await database.disconnect()

@app.get("/")
async def read_root():
    return {"message": "Database connection is working!"}

@app.get("/users/")
async def get_users():
    query = "SELECT * FROM users"
    users = await database.fetch_all(query)
    return users

@app.get("/users/{user_id}")
async def get_user(user_id: int):
    try:
        query = "SELECT * FROM users WHERE id = :user_id"
        user = await database.fetch_one(query, values={"user_id": user_id})
        if user is None:
            raise HTTPException(status_code=404, detail="User not found")
        return user
    except Exception as e:
        logger.error(f"Error fetching user {user_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@app.post("/users/")
async def create_user(user: UserIn):
    query = "INSERT INTO users (name, email) VALUES (:name, :email) RETURNING id"
    values = {"name": user.name, "email": user.email}
    last_record_id = await database.execute(query, values)
    return {"id": last_record_id, "name": user.name, "email": user.email}

@app.post("/drinking/")
async def create_drinking(drinking: DrinkingIn):
    if not drinking.date:
        drinking.date = date.today()

    oz_remaining = drinking.oz_goal - drinking.oz_consumed

    query = """
    INSERT INTO drinking (user_id, oz_goal, oz_consumed, oz_remaining, date)
    VALUES (:user_id, :oz_goal, :oz_consumed, :oz_remaining, :date)
    """

    values = {
        "user_id": drinking.user_id,
        "oz_goal": drinking.oz_goal,
        "oz_consumed": drinking.oz_consumed,
        "oz_remaining": oz_remaining,
        "date": drinking.date
    }

    last_record_id = await database.execute(query, values)
    
    return {
        "id": last_record_id,
        "user_id": drinking.user_id,
        "oz_goal": drinking.oz_goal,
        "oz_consumed": drinking.oz_consumed,
        "oz_remaining": oz_remaining,
        "date": drinking.date
    }

@app.get("/drinking/{user_id}")
async def get_drink(user_id: int):
    query = "SELECT * FROM drinking WHERE user_id = :user_id"
    user = await database.fetch_one(query, values={"user_id": user_id})
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@app.get("/drinking/")
async def get_drinks():
    query = "SELECT * FROM drinking"
    drinks = await database.fetch_all(query)
    return drinks

@app.get("/drinking/{user_id}/{date}")
async def get_drink_by_date(user_id: int, date: date):
    query = "SELECT * FROM drinking WHERE user_id = :user_id AND date = :date"
    drink = await database.fetch_one(query, values={"user_id": user_id, "date": date})
    if drink is None:
        raise HTTPException(status_code=404, detail="Record not found")
    return drink

@app.put("/drinking/{user_id}/{record_id}")
async def update_drinking(user_id: int, record_id: int, drinking: DrinkingIn):
    oz_remaining = drinking.oz_goal - drinking.oz_consumed
    query = """
    UPDATE drinking
    SET oz_goal = :oz_goal, oz_consumed = :oz_consumed, oz_remaining = :oz_remaining, date = :date
    WHERE id = :record_id AND user_id = :user_id
    RETURNING id
    """
    values = {
        "user_id": user_id,
        "oz_goal": drinking.oz_goal,
        "oz_consumed": drinking.oz_consumed,
        "oz_remaining": oz_remaining,
        "date": drinking.date,
        "record_id": record_id
    }
    last_record_id = await database.execute(query, values)
    if not last_record_id:
        raise HTTPException(status_code=404, detail="Record not found")
    return {"id": last_record_id, "user_id": user_id, "oz_goal": drinking.oz_goal, "oz_consumed": drinking.oz_consumed, "oz_remaining": oz_remaining, "date": drinking.date}
