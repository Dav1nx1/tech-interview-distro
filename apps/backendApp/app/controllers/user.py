# crud/user.py
from sqlalchemy.orm import Session
from app.models import user as models
from app.schemas import user as schemas
from app.core.security import hash_password

def get_user(db: Session, user_id: str):
    return db.query(models.User).filter(models.User.id == user_id).first()

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = hash_password(user.password)
    db_user = models.User(email=user.email, username=user.username, hashed_password=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
        
    # Convert SQLAlchemy model to Pydantic model
    #user_response = schemas.UserResponse.from_attributes(db_user)
    return db_user

def get_all_users(db: Session):
    return db.query(models.User).all()