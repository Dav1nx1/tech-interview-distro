# crud/task.py
from sqlalchemy.orm import Session # type: ignore
from app.models import task as models
from app.schemas import task as schemas
from fastapi import HTTPException # type: ignore

# Retrieve a single task by ID
def get_task(db: Session, task_id: int):
    return db.query(models.Task).filter(models.Task.id == task_id).first()

# Retrieve all tasks by a specific user
def get_task_by_user(db: Session, owner_id: str):
    return db.query(models.Task).filter(models.Task.owner_id == owner_id).all()

# Create a new task
def create_task(db: Session, task: schemas.TaskCreate):
    task_data = task.model_dump()
    db_task = models.Task(**task_data)  # Initialize Task model with the updated dictionary
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task

# Update an existing task
def update_task(db: Session, task_id: int, updated_task: schemas.TaskCreate):
    db_task = db.query(models.Task).filter(models.Task.id == task_id).first()
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    for key, value in updated_task.model_dump().items():
        setattr(db_task, key, value)
    
    db.commit()
    db.refresh(db_task)
    return db_task

# Delete a task by ID
def delete_task(db: Session, task_id: int):
    db_task = db.query(models.Task).filter(models.Task.id == task_id).first()
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    db.delete(db_task)
    db.commit()
    return {"message": "Task deleted successfully"}