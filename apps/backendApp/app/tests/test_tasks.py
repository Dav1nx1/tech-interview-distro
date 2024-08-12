from app.schemas.task import TaskCreate
from app.controllers import task as crud

def test_create_task(db):
    task_create = TaskCreate(title="Test Task", description="A task for testing", owner_id="1", status="todo")
    
    print(task_create.model_dump_json())
    
    # Assuming a user with ID 1 exists in your database
    db_task = crud.create_task(db, task_create)
    
    assert db_task.title == task_create.title
    assert db_task.description == task_create.description
    assert db_task.owner_id == task_create.owner_id

def test_get_task(db):
    # First create a task
    task_create = TaskCreate(title="Test Task", description="A task for testing", owner_id="1", status="todo")
    created_task = crud.create_task(db, task_create)

    # Then retrieve the task
    retrieved_task = crud.get_task(db, created_task.id)
    
    assert retrieved_task is not None
    assert retrieved_task.title == created_task.title
    assert retrieved_task.description == created_task.description
    assert retrieved_task.owner_id == created_task.owner_id

def test_update_task(db):
    # First create a task
    task_create = TaskCreate(title="Initial Task", description="Initial description", owner_id="1", status="todo")
    created_task = crud.create_task(db, task_create)

    # Update the task
    updated_task_data = TaskCreate(title="Updated Task", description="Updated description", owner_id="1", status="in-progress")
    updated_task = crud.update_task(db, created_task.id, updated_task_data)

    assert updated_task is not None
    assert updated_task.title == updated_task_data.title
    assert updated_task.description == updated_task_data.description
    assert updated_task.owner_id == updated_task_data.owner_id

def test_delete_task(db):
    # First create a task
    task_create = TaskCreate(title="Task to delete", description="This task will be deleted", owner_id="1", status="todo")
    created_task = crud.create_task(db, task_create)

    # Delete the task
    delete_response = crud.delete_task(db, created_task.id)
    
    assert delete_response["message"] == "Task deleted successfully"

    # Try to retrieve the deleted task
    deleted_task = crud.get_task(db, created_task.id)
    
    assert deleted_task is None

def test_get_task_by_user(db):
    # Create multiple tasks for the same user
    task_create_1 = TaskCreate(title="User's Task 1", description="First task", owner_id="1", status="todo")
    task_create_2 = TaskCreate(title="User's Task 2", description="Second task", owner_id="1", status="in-progress")
    crud.create_task(db, task_create_1)
    crud.create_task(db, task_create_2)

    # Retrieve tasks by user
    tasks = crud.get_task_by_user(db, owner_id="1")
    
    assert len(tasks) == 2
    assert tasks[0].owner_id == "1"
    assert tasks[1].owner_id == "1"