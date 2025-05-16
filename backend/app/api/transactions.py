# backend/app/api/transactions.py

from typing import List, Optional
from datetime import date

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import and_

from app.core.database import get_session
from app.core.security import get_current_user
from app.models.transaction import Transaction
from app.schemas.transaction import TransactionCreate, TransactionRead
from app.models.user import User

router = APIRouter(
    tags=["Transactions"],
)

@router.get(
    "/",
    response_model=List[TransactionRead],
    summary="Получить список транзакций семьи с опциональными фильтрами"
)
async def list_transactions(
    date_from: Optional[date]       = Query(None, description="Дата начала диапазона"),
    date_to:   Optional[date]       = Query(None, description="Дата конца диапазона"),
    category_id: Optional[int]      = Query(None, description="ID категории"),
    current_user: User              = Depends(get_current_user),
    session: AsyncSession           = Depends(get_session),
):
    """
    Возвращает все транзакции семьи текущего пользователя,
    можно фильтровать по дате создания и по категории.
    """
    filters = [Transaction.family_id == current_user.family_id]
    if date_from:
        filters.append(Transaction.created_at >= date_from)
    if date_to:
        filters.append(Transaction.created_at <= date_to)
    if category_id is not None:
        filters.append(Transaction.category_id == category_id)

    q = await session.execute(
        select(Transaction)
        .where(and_(*filters))
        .order_by(Transaction.created_at.desc())
    )
    return q.scalars().all()


@router.post(
    "/",
    response_model=TransactionRead,
    status_code=status.HTTP_201_CREATED,
    summary="Создать новую транзакцию"
)
async def create_transaction(
    tx_in: TransactionCreate,
    current_user: User    = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    """
    Создает запись о доходе/расходе для текущего пользователя.
    """
    tx = Transaction(
        user_id=current_user.id,
        family_id=current_user.family_id,
        category_id=tx_in.category_id,
        amount=tx_in.amount,
        description=tx_in.description,
    )
    session.add(tx)
    await session.commit()
    await session.refresh(tx)
    return tx


@router.get(
    "/{tx_id}",
    response_model=TransactionRead,
    summary="Получить данные о конкретной транзакции"
)
async def get_transaction(
    tx_id: int,
    current_user: User    = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    """
    Возвращает транзакцию по ID, проверяя, что она принадлежит семье пользователя.
    """
    q = await session.execute(select(Transaction).where(
        and_(
            Transaction.id == tx_id,
            Transaction.family_id == current_user.family_id
        )
    ))
    tx = q.scalar_one_or_none()
    if not tx:
        raise HTTPException(status_code=404, detail="Транзакция не найдена")
    return tx


@router.put(
    "/{tx_id}",
    response_model=TransactionRead,
    summary="Обновить существующую транзакцию"
)
async def update_transaction(
    tx_id: int,
    tx_in: TransactionCreate,
    current_user: User    = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    """
    Обновляет поля транзакции (категория, сумма, описание).
    """
    q = await session.execute(select(Transaction).where(
        and_(
            Transaction.id == tx_id,
            Transaction.family_id == current_user.family_id
        )
    ))
    tx = q.scalar_one_or_none()
    if not tx:
        raise HTTPException(status_code=404, detail="Транзакция не найдена")

    tx.category_id = tx_in.category_id
    tx.amount      = tx_in.amount
    tx.description = tx_in.description
    await session.commit()
    await session.refresh(tx)
    return tx


@router.delete(
    "/{tx_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Удалить транзакцию"
)
async def delete_transaction(
    tx_id: int,
    current_user: User    = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    """
    Удаляет транзакцию по ID.
    """
    q = await session.execute(select(Transaction).where(
        and_(
            Transaction.id == tx_id,
            Transaction.family_id == current_user.family_id
        )
    ))
    tx = q.scalar_one_or_none()
    if not tx:
        raise HTTPException(status_code=404, detail="Транзакция не найдена")

    await session.delete(tx)
    await session.commit()
    return
