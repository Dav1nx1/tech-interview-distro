from pydantic import BaseModel, ConfigDict, EmailStr

class User(BaseModel):
    model_config = ConfigDict(
        from_attributes=True,  # Allows using ORM objects with Pydantic models
        populate_by_name=True, # Allow populating fields by name
        str_strip_whitespace=True # Automatically strip whitespace from strings
    )
    
    username: str
    email: EmailStr

class UserCreate(User):
    password: str

class UserResponse(User):
    id: str
    email: EmailStr
    username: str

    class Config:
        model_config = ConfigDict(from_attributes=True)
