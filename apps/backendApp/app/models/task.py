# models/task.py
from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.models.user import Base
import uuid

class Task(Base):
    __tablename__ = "tasks"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    title = Column(String, index=True)
    description = Column(String, index=True)
    status = Column(String, index=True, default='todo')
    owner_id = Column(String, ForeignKey("users.id"))

    owner = relationship("User", back_populates="tasks")