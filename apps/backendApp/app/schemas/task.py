from pydantic import BaseModel, ConfigDict
from typing import List
class Task(BaseModel):
    
    model_config = ConfigDict(
        from_attributes=True,         # Allows using ORM objects with Pydantic models
        populate_by_name=True,        # Allow populating fields by name
        str_strip_whitespace=True     # Automatically strip whitespace from strings
    )
    
    title: str
    description: str
    owner_id: str
    status: str

class TaskCreate(Task):
    pass
    owner_id: str

class TaskResponse(Task):
    id: str
    title: str
    description: str
    owner_id: str
    status: str
    
class TaskListResponse(BaseModel):
    tasks: List[TaskResponse]
    
    model_config = ConfigDict(
        from_attributes=True,         # Allows using ORM objects with Pydantic models
        populate_by_name=True,        # Allow populating fields by name
        str_strip_whitespace=True     # Automatically strip whitespace from strings
    )