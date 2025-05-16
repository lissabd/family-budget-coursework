# app/schemas/category.py

from pydantic import BaseModel

class CategoryBase(BaseModel):
    name: str
    type: str  # "income" или "expense"

class CategoryCreate(CategoryBase):
    pass

class CategoryRead(CategoryBase):
    id: int

    class Config:
        from_attributes = True
