from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from database import database, engine, metadata
from models import users, drinking
from pydantic import BaseModel
from datetime import date, datetime
import logging
from typing import Dict, Any

app = FastAPI(servers=[{"url": "http://localhost:8000", "description": "Local server"}])

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins (adjust for production)
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

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
    print("WE LOVE FORTNITE")
    await database.connect()
    metadata.create_all(engine)

@app.on_event("shutdown")
async def shutdown():
    await database.disconnect()

@app.get("/")
async def read_root():
    print("HELLO")
    return {"message": "Database connection is working!"}

@app.get("/users/")
async def get_users():
    query = "SELECT * FROM users"
    users = await database.fetch_all(query)
    return users

@app.get("/users/{user_id}")
async def get_user(user_id: int):
    query = "SELECT * FROM users WHERE id = :user_id"
    user = await database.fetch_one(query, values={"user_id": user_id})
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")

    return user


@app.post("/login/")
async def get_user(user: UserIn):
    print("GET_USER")
    
    existing_user = await database.fetch_one(
        "SELECT * FROM users WHERE email = :email AND name = :name",
        {"email": user.email, "name": user.name},
    )

    if not existing_user:
        raise HTTPException(status_code=400, detail="USER NOT FOUND")

    use = dict(existing_user)
    user_id = use.get("id")
    
    if not user_id:
        raise HTTPException(status_code=400, detail="User ID not found")

    return {"userid": user_id}


@app.post("/users/")
async def create_user(user: UserIn):
    existing_user = await database.fetch_one(
        "SELECT * FROM users WHERE email = :email",
        {"email": user.email}
    )
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already exists")

    query = "INSERT INTO users (name, email) VALUES (:name, :email) RETURNING id"
    values = {"name": user.name, "email": user.email}
    last_record_id = await database.execute(query, values)
    return {"userid": last_record_id, "name": user.name, "email": user.email}


@app.post("/drinking/")
async def create_drinking(drinking: DrinkingIn):
    if not drinking.date:
        drinking.date = date.today()


    query = """
    INSERT INTO drinking (user_id, oz_goal, oz_consumed, oz_remaining, date)
    VALUES (:user_id, :oz_goal, :oz_consumed, :oz_remaining, :date) RETURNING record_id
    """

    values = {
        "user_id": drinking.user_id,
        "oz_goal": drinking.oz_goal,
        "oz_consumed": drinking.oz_consumed,
        "oz_remaining": drinking.oz_remaining,
        "date": drinking.date
    }

    last_record_id = await database.execute(query, values)
    
    return {
        "record_id": last_record_id,
        "user_id": drinking.user_id,
        "oz_goal": drinking.oz_goal,
        "oz_consumed": drinking.oz_consumed,
        "oz_remaining": drinking.oz_remaining,
        "date": drinking.date
    }


@app.get("/drinking/{user_id}")
async def get_drink(user_id: int):
    query = "SELECT * FROM drinking WHERE user_id = :user_id"
    results = await database.fetch_all(query, values={"user_id": user_id})
    print("degub : USERID ---> " + str(user_id))
    print("degub")

    print("HI")
        # Convert each record and serialize dates
    formatted_records = []
    print("degub")
    for result in results:
        print("degub")
        print(result)
        record_dict = dict(result)  # Convert to dictionary
        print("dicted")
        # Handle date serialization
        record_dict["date"] = str(record_dict["date"])
        print("WE ARE YOUNG")
        formatted_records.append(record_dict)
    print(formatted_records)
    print("degub")
    return formatted_records


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
    WHERE record_id = :record_id AND user_id = :user_id
    RETURNING record_id
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
    return {"record_id": last_record_id, "user_id": user_id, "oz_goal": drinking.oz_goal, "oz_consumed": drinking.oz_consumed, "oz_remaining": oz_remaining, "date": drinking.date}

@app.put("/users/{user_id}")
async def update_user(user_id: int, user: UserIn):
    query = """UPDATE users SET name = :name, email = :email WHERE id = :user_id"""
    values = {"user_id": user_id, "name": user.name, "email": user.email}

    result = await database.execute(query=query, values=values)

    if result == 0:
        raise HTTPException(status_code=404, detail="User not found")

    return {"message": "User updated successfully"}


@app.delete("/users/{user_id}")
async def delete_user(user_id: int):
    query = "SELECT * FROM users WHERE id = :user_id"
    user = await database.fetch_one(query, values={"user_id": user_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    await database.execute("DELETE FROM drinking WHERE user_id = :user_id", values={"user_id": user_id})

    await database.execute("DELETE FROM users WHERE id = :user_id", values={"user_id": user_id})

    return {"message": "User deleted successfully"}

@app.delete("/drinking/{record_id}")
async def delete_drinking(record_id: int):
    query = "DELETE FROM drinking WHERE record_id = :record_id"
    result = await database.execute(query, values={"record_id": record_id})

    if result == 0:
        raise HTTPException(status_code=404, detail="Drinking record not found")

    return {"message": "Drinking record deleted successfully"}
