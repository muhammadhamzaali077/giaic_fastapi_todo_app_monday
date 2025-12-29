from fastapi import FastAPI, Depends
from sqlmodel import Session
from models.model import Todo
from config.database_connection import create_db_and_tables, get_session
from services.service import get_all_todos, get_todo, create_todo, delete_todo,update_todo
from fastapi.exceptions import HTTPException
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup():
    create_db_and_tables()

@app.get("/todos", response_model=list[Todo])
def get_todos(session: Session = Depends(get_session)):
    return get_all_todos(session)

@app.get("/todos/{todo_id}", response_model=Todo)
def read(todo_id: int, session: Session = Depends(get_session)):
   todo = get_todo(session, todo_id)
   if todo is None:
      raise HTTPException(status_code=404, detail="Todo not found")
   else:
      return todo

@app.post("/todos", response_model=Todo)
def create(todo: Todo, session: Session = Depends(get_session)):
   return create_todo(session, todo)


@app.delete("/todos/{todo_id}", response_model=Todo)
def delete(todo_id: int, session: Session = Depends(get_session)):
   return delete_todo(session, todo_id)

@app.put('/todos/{todo_id}', response_model=Todo)
def update(todo_id: int, todo: Todo, session: Session = Depends(get_session)):
    updated = update_todo(session, todo_id, todo.dict(exclude_unset=True))
    return updated
    