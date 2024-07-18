from pydantic import BaseModel, Field


class UserBase(BaseModel):
    username: str


class UserCreate(UserBase):
    password: str = Field(min_length=8)


class User(UserBase):
    id: int
    hashed_password: str
    todos: list['Todo']


User.model_config = {'from_attributes': True}


class TodoBase(BaseModel):
    title: str = Field(min_length=3)


class TodoCreate(TodoBase):
    pass


class Todo(TodoCreate):
    id: int
    user_id: int


Todo.model_config = {'from_attributes': True}


class TokenData(BaseModel):
    username: str


class Token(BaseModel):
    access_token: str
    token_type: str

