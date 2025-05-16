# app/schemas/transaction.py

from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from decimal import Decimal

class TransactionBase(BaseModel):
    category_id: int
    amount: Decimal
    description: Optional[str] = None

class TransactionCreate(TransactionBase):
    pass

class TransactionRead(TransactionBase):
    id: int
    user_id: int
    created_at: datetime

    class Config:
        from_attributes = True
