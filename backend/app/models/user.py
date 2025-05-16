# app/models/user.py
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from .base import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    family_id = Column(Integer, ForeignKey("families.id"))
    created_at = Column(DateTime, default=datetime.utcnow)

    family = relationship("Family", back_populates="members")
    transactions = relationship("Transaction", back_populates="user")
