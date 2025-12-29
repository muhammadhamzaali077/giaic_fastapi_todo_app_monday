from sqlmodel import select
from models.model import Todo
from config.database_connection import get_session

def get_all_todos(session):
    return session.exec(select(Todo)).all()

def get_todo(session, todo_id):
    return session.get(Todo, todo_id)

def create_todo(session, todo: Todo):
    session.add(todo)
    session.commit()
    session.refresh(todo)
    return todo

def delete_todo(session, todo_id):
    todo = session.get(Todo, todo_id)
    session.delete(todo)
    session.commit()
    session.refresh(todo)
    return todo

def update_todo(session,todo_id,data):
    todo = session.get(Todo,todo_id)
    for key,value in data.items():
        setattr(todo,key,value)
    session.add(todo)
    session.commit()
    session.refresh(todo)
    return todo
    