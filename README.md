# Water-Tracker

## Overview
The water tracker is a web application that helps users log their daily water intake, set goals, and track their drinking progress over time.
The application allows users to edit and view their progress. The project was built using React, FastAPI, PostgreSQL, and Docker.

## Features
#### User management
Users can log water intake records with date, amount consumed, and hydration goals.
#### Dashboard
Shows hydration progress the set amount, the amount drank, and the amount left.
#### ADD and Edit Records
Users can add new hydration records and edit existing ones.
#### Visual
A progress bar to show how much water is left visually.

## Stack
* Frontend: React.js (for UI)
* Backend: FastAPI (for the REST API)
* Database: PostgreSQL (for storage)
* Containerization: Docker (easy deployment)

## Setup
### Clone the project
```bash
git clone https://github.com/KRay2024/Water-Tracker/tree/main
cd hydration-tracker 
```
### Build containers
```bash
docker-compose build
```
### Start containers
```bash
docker-compose up -d
```

The fronend now should be accesibale at: http://localhost:8501/

### Stop containers and services
```bash
docker-compose down
```
