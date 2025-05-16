# app/schemas/family.py

from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class FamilyBase(BaseModel):
    code: str

class FamilyCreate(FamilyBase):
    pass

class FamilyJoin(BaseModel):
    code: str

class FamilyRead(FamilyBase):
    id: int
    created_at: datetime
    # опционально: members_count, transactions_count
    members_count: Optional[int] = None
    transactions_count: Optional[int] = None

    class Config:
        from_attributes = True
