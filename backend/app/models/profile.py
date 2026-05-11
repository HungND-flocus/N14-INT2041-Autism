from sqlmodel import SQLModel, Field
from typing import Optional
from uuid import UUID, uuid4
from datetime import datetime

class Profile(SQLModel, table=True):
    __tablename__ = "profiles"
    
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    role: str = Field(default="child")
    full_name: str
    avatar_url: Optional[str] = None
    age_group: Optional[str] = None
    support_level: Optional[str] = None
    feedback_mode: str = Field(default="combined")
    parent_id: Optional[UUID] = Field(default=None, foreign_key="profiles.id")
    created_at: datetime = Field(default_factory=datetime.utcnow)
