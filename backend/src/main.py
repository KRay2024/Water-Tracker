from fastapi import FastAPI, HTTPException
from database import database, engine, metadata
from models import users

app = FastAPI()

# Connect and disconnect from DB on startup/shutdown
@app.on_event("startup")
async def startup():
    await database.connect()

@app.on_event("shutdown")
async def shutdown():
    await database.disconnect()

# Create a new user
@app.post("/users/")
async def create_user(name: str, email: str):
    query = users.insert().values(name=name, email=email)
    user_id = await database.execute(query)
    return {"id": user_id, "name": name, "email": email}

# Get all users
@app.get("/users/")
async def get_users():
    query = users.select()
    return await database.fetch_all(query)

# Get a user by ID
@app.get("/users/{user_id}")
async def get_user(user_id: int):
    query = users.select().where(users.c.id == user_id)
    user = await database.fetch_one(query)
    if user:
        return user
    raise HTTPException(status_code=404, detail = "User not found")
