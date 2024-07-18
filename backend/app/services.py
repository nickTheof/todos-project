import os
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from . import database
from . import models as _models
from . import schemas as _schemas
from fastapi import HTTPException, status, Depends
from fastapi.security import OAuth2PasswordBearer
from passlib.context import CryptContext
from jose import jwt, JWTError
from typing import Annotated


ALGORITHM = os.getenv('ALGORITHM')
SECRET_KEY = os.getenv('SECRET_KEY')


oauth_scheme = OAuth2PasswordBearer(tokenUrl='/token')

password_manager = CryptContext('bcrypt', deprecated='auto')


def hash_password(plain_password: str) -> str:
    return password_manager.hash(plain_password)


def verify_password(plan_password: str, hashed_password: str) -> bool:
    return password_manager.verify(plan_password, hashed_password)


def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_user_by_username(username: str, db: Session) -> _models.User | None:
    db_user = db.query(_models.User).filter(_models.User.username == username).first()
    return db_user


def create_user(user: _schemas.UserCreate, db: Session) -> _models.User | None:
    db_user = get_user_by_username(username=user.username, db=db)
    if db_user is not None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail="Username already used. Please try a different combination")
    new_user = _models.User(username=user.username, hashed_password=hash_password(user.password))
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user


def delete_user(user: _models.User, db: Session):
    if user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='User not exists')
    db.delete(user)
    db.commit()
    return {'message': f'User with username: {user.username} deleted successfully.'}


def get_todos_by_user(user: _models.User) -> list[_schemas.Todo]:
    return user.todos


def create_todo(todo: _schemas.TodoCreate, user: _models.User, db: Session) -> _models.Todo | None:
    user_todos = get_todos_by_user(user)
    filtered_todos = list(filter(lambda x: x.title == todo.title, user_todos))
    if len(filtered_todos) != 0:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail='Todo already exists in users todo list.')
    new_todo: _models.Todo = _models.Todo(title=todo.title, user_id=user.id)
    db.add(new_todo)
    db.commit()
    db.refresh(new_todo)
    return new_todo


def delete_todo(todo_id: int, user: _models.User, db: Session) -> dict | None:
    user_todos = get_todos_by_user(user)
    filtered_todos = list(filter(lambda x: x.id == todo_id, user_todos))
    if len(filtered_todos) == 0:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Todo does not exist in users todo list.')
    db.delete(filtered_todos[0])
    db.commit()
    return {'message': f'Todo with title: {filtered_todos[0].title} deleted successfully'}


def update_todo(todo_id: int, new_todo_title: str, user: _models.User, db: Session) -> _models.Todo | None:
    user_todos = get_todos_by_user(user)
    filtered_todos = list(filter(lambda x: x.id == todo_id, user_todos))
    if len(filtered_todos) == 0:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Todo does not exist in users todo list.')
    db_todo = filtered_todos[0]
    db_todo.title = new_todo_title
    db.add(db_todo)
    db.commit()
    db.refresh(db_todo)
    return db_todo


# Authentication steps

def authenticate_user(username: str, password: str, db: Session) -> _models.User | bool:
    db_user = get_user_by_username(username=username, db=db)
    if db_user is None:
        return False
    if not verify_password(password, db_user.hashed_password):
        return False
    return db_user


def create_access_token(data: dict, time_expires: timedelta | None = None):
    to_encode = data.copy()
    if time_expires:
        expire = datetime.utcnow() + time_expires
    else:
        expire = datetime.utcnow() + timedelta(minutes=5)
    to_encode.update({'exp': expire})
    jwt_encoded = jwt.encode(to_encode, SECRET_KEY, ALGORITHM)
    return jwt_encoded


async def get_current_user(token: Annotated[_models.User, Depends(oauth_scheme)],
                           db: Annotated[Session, Depends(get_db)]) -> _models.User | None:
    credentials_exception = HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                                          detail='We could not authorize your credentials',
                                          headers={'WWW-AUTHENTICATE': 'Bearer'})
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get('sub')
        if username is None:
            raise credentials_exception
        tokenData = _schemas.TokenData(username=username)
    except JWTError:
        raise credentials_exception
    db_user = get_user_by_username(username=tokenData.username, db=db)
    if db_user is None:
        raise credentials_exception
    return db_user

