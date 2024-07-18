import os
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from . import models as _models, schemas as _schemas, services as _services
from typing import Annotated
from sqlalchemy.orm import Session
from datetime import timedelta


ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv('ACCESS_TOKEN_EXPIRE_MINUTES'))


origins = [str(os.getenv("BACKEND_CORS_ORIGINS"))]
@asynccontextmanager
async def lifespan(application: FastAPI):
    _models.create_db_models()
    yield


app = FastAPI(lifespan=lifespan)

app.add_middleware(CORSMiddleware,
                   allow_origins=origins,
                   allow_credentials=True,
                   allow_headers=["*"],
                   allow_methods=["*"])


@app.post('/token', response_model=_schemas.Token)
async def create_access_login(form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
                              db: Annotated[_models.User, Depends(_services.get_db)]):
    db_user = _services.authenticate_user(username=form_data.username, password=form_data.password, db=db)
    if not db_user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Invalid User or Incorrect Password',
                            headers={'WWW-Authenticate': 'Bearer'})
    access_exp = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = _services.create_access_token(data={'sub': db_user.username}, time_expires=access_exp)
    return {'access_token': access_token, 'token_type': 'Bearer'}


@app.get('/')
async def home():
    return {'message': 'Welcome to the Todos Backend API'}


@app.get('/users/current-user', response_model=_schemas.User)
async def get_current_user(user: Annotated[_models.User, Depends(_services.get_current_user)]):
    return user


@app.post('/users/create-user')
async def create_user(user: _schemas.UserCreate, db: Annotated[Session, Depends(_services.get_db)]):
    db_user = _services.create_user(user=user, db=db)
    access_exp = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = _services.create_access_token(data={'sub': db_user.username}, time_expires=access_exp)
    return {'access_token': access_token, 'token_type': 'Bearer'}


@app.delete("/users/current-user/delete")
async def delete_current_user(current_user: Annotated[_models.User, Depends(_services.get_current_user)],
                              db: Annotated[Session, Depends(_services.get_db)]):
    return _services.delete_user(user=current_user, db=db)


@app.get('/todos/current-user/', response_model=list[_schemas.Todo])
async def get_todos_current_user(current_user: Annotated[_models.User, Depends(_services.get_current_user)]):
    return _services.get_todos_by_user(user=current_user)


@app.post('/todos/current-user/create-todo', response_model=_schemas.Todo)
async def create_todo(todo: _schemas.TodoCreate, current_user: Annotated[_models.User,
                      Depends(_services.get_current_user)],
                      db: Annotated[Session, Depends(_services.get_db)]):
    return _services.create_todo(todo=todo, user=current_user, db=db)


@app.put('/todos/current-user/update-todo/{todo_id}', response_model=_schemas.Todo)
async def update_todo(todo_id: int, new_todo_title: str, current_user: Annotated[_models.User,
                      Depends(_services.get_current_user)],
                      db: Annotated[Session, Depends(_services.get_db)]):
    return _services.update_todo(todo_id=todo_id, new_todo_title=new_todo_title, user=current_user, db=db)


@app.delete('/todos/current-user/delete-todo/{todo_id}', status_code=status.HTTP_200_OK)
async def delete_todo(todo_id: int, current_user: Annotated[_models.User,
                      Depends(_services.get_current_user)],
                      db: Annotated[Session, Depends(_services.get_db)]):
    return _services.delete_todo(todo_id, user=current_user, db=db)

