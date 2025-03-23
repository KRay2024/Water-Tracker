# main.py
from fastapi import FastAPI, HTTPException
from database import database, engine, metadata
from models import users, drinking
from pydantic import BaseModel
from datetime import date


app = FastAPI()

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
    query = "SELECT * FROM users WHERE id = :user_id"
    user = await database.fetch_one(query)
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@app.post("/users/")
async def create_user(user: UserIn):
    query = users.insert().values(name=user.name, email=user.email)
    last_record_id = await database.execute(query)
    return {"id": last_record_id, "name": user.name, "email": user.email}

@app.post("/drinking/")
async def create_drinking(drinking: DrinkingIn):
    query = drinking.insert().values(
        user_id=drinking.user_id,
        oz_goal=drinking.oz_goal,
        oz_consumed=drinking.oz_consumed,
        oz_remaining=drinking.oz_goal - drinking.oz_consumed,  
        date=drinking.date
    )
    last_record_id = await database.execute(query)
    return {
        "id": last_record_id,
        "user_id": drinking.user_id,
        "oz_goal": drinking.oz_goal,
        "oz_consumed": drinking.oz_consumed,
        "oz_remaining": drinking.oz_goal - drinking.oz_consumed,
        "date": drinking.date
    }


"""@app.get("/users/")
async def get_users():
    query = users.select()
    return await database.fetch_all(query)"""