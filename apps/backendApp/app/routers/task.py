# app/routers/task.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.schemas import task as schemas
from app.controllers import task as crud
from app.controllers import user as userCrud
from app.database import get_db

router = APIRouter()

@router.post("/", response_model=schemas.Task)
def create_task(task: schemas.TaskCreate, db: Session = Depends(get_db)):
    return crud.create_task(db=db, task=task)

@router.get("/{task_id}", response_model=schemas.TaskResponse)
def read_task(task_id: str, db: Session = Depends(get_db)):
    task = crud.get_task(db, task_id)
    if task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    return task

@router.get("/user/{owner_id}", response_model=schemas.TaskListResponse)
def read_task_list(owner_id: str, db: Session = Depends(get_db)):
    tasks = crud.get_task_by_user(db, owner_id)
    if not tasks:  # Check if the list is empty or None
        raise HTTPException(status_code=404, detail="Tasks not found")
    return {"tasks": tasks }

@router.put("/{task_id}", response_model=schemas.TaskResponse)
def update_task(task_id: str, task: schemas.TaskCreate, db: Session = Depends(get_db)):
    db_task = crud.update_task(db, task_id, task)
    return db_task

@router.delete("/{task_id}")
def delete_task(task_id: str, db: Session = Depends(get_db)):
    return crud.delete_task(db, task_id)