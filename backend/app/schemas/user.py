from pydantic import BaseModel, EmailStr
from typing import Optional

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    family_code: Optional[str] = None

class UserRead(BaseModel):
    id: int
    email: EmailStr
    family_id: int

    class Config:
        from_attributes = True
