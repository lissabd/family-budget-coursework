# app/models/category.py

from sqlalchemy import Column, Integer, String
from app.models.base import Base

class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    type = Column(String(10), nullable=False)  # "income" или "expense"
