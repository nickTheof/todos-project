from .database import Base, engine
from sqlalchemy import Column, Integer, ForeignKey, VARCHAR
from sqlalchemy.orm import relationship


class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True)
    username = Column(VARCHAR(30), index=True)
    hashed_password = Column(VARCHAR(100))
    todos = relationship('Todo', back_populates='user')


class Todo(Base):
    __tablename__ = 'todos'
    id = Column(Integer, primary_key=True)
    title = Column(VARCHAR(100), index=True)
    user_id = Column(Integer, ForeignKey('users.id'))
    user = relationship('User', back_populates='todos')


def create_db_models():
    Base.metadata.create_all(bind=engine)
