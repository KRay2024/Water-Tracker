# main.py
from fastapi import FastAPI, HTTPException
from database import database, engine, metadata
from models import users
from pydantic import BaseModel

app = FastAPI()

class UserIn(BaseModel):
    name: str
    email: str

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

@app.get("/users/{user_id}")
async def get_user(user_id: int):
    query = users.select().where(users.c.id == user_id)
    user = await database.fetch_one(query)
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@app.post("/users/")
async def create_user(user: UserIn):
    try:
        query = users.insert().values(name=user.name, email=user.email)
        last_record_id = await database.execute(query)
        return {"id": last_record_id, "name": user.name, "email": user.email}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/users/")
async def get_users():
    query = users.select()
    return await database.fetch_all(query)