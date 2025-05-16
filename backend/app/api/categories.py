# backend/app/api/categories.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List

from app.core.database import get_session
from app.models.category import Category
from app.schemas.category import CategoryRead

router = APIRouter(
    tags=["Categories"],
)

@router.get("/", response_model=List[CategoryRead], summary="Список всех категорий")
async def read_categories(session: AsyncSession = Depends(get_session)):
    """
    Возвращает все предопределённые категории доходов и расходов.
    """
    result = await session.execute(select(Category).order_by(Category.type, Category.name))
    categories = result.scalars().all()
    if not categories:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Категории не найдены")
    return categories
