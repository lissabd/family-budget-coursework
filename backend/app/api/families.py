from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import func

from app.core.database import get_session
from app.core.security import get_current_user
from app.models.family import Family
from app.models.user import User
from app.models.transaction import Transaction
from app.schemas.family import FamilyRead, FamilyJoin

router = APIRouter()

@router.get(
    "/{family_id}",
    response_model=FamilyRead,
    summary="Получить информацию о семье по её ID",
)

async def read_family(
    family_id: int,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    if current_user.family_id != family_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Доступ к запрошенной семье запрещён",
        )

    q = await session.execute(
        select(Family).where(Family.id == family_id)
    )
    family = q.scalar_one_or_none()
    if not family:
        raise HTTPException(status_code=404, detail="Семья не найдена")

    # Число членов
    members_cnt = (
        await session.execute(
            select(func.count(User.id))
            .where(User.family_id == family_id)
        )
    ).scalar_one()

    # Число транзакций
    tx_cnt = (
        await session.execute(
            select(func.count(Transaction.id))
            .where(Transaction.family_id == family_id)
        )
    ).scalar_one()

    return FamilyRead(
        id=family.id,
        code=family.code,
        created_at=family.created_at,
        members_count=members_cnt,
        transactions_count=tx_cnt,
    )

@router.post(
    "/join",
    response_model=FamilyRead,
    summary="Присоединиться к существующей семье по коду",
)
async def join_family(
    payload: FamilyJoin,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    q = await session.execute(
        select(Family).where(Family.code == payload.code)
    )
    family = q.scalar_one_or_none()
    if not family:
        raise HTTPException(status_code=404, detail="Семья не найдена")

    current_user.family_id = family.id
    session.add(current_user)
    await session.commit()
    # После коммита считаем заново
    members_cnt = (
        await session.execute(
            select(func.count(User.id))
            .where(User.family_id == family.id)
        )
    ).scalar_one()

    tx_cnt = (
        await session.execute(
            select(func.count(Transaction.id))
            .where(Transaction.family_id == family.id)
        )
    ).scalar_one()

    return FamilyRead(
        id=family.id,
        code=family.code,
        created_at=family.created_at,
        members_count=members_cnt,
        transactions_count=tx_cnt,
    )

@router.post(
    "/join",
    response_model=FamilyRead,
    summary="Присоединиться к существующей семье по коду",
)
async def join_family(
    payload: FamilyJoin,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    # Ищем семью по коду
    q = await session.execute(
        select(Family).where(Family.code == payload.code)
    )
    family = q.scalar_one_or_none()
    if not family:
        raise HTTPException(status_code=404, detail="Семья не найдена")

    # Меняем family_id у пользователя
    current_user.family_id = family.id
    session.add(current_user)
    await session.commit()
    await session.refresh(family)

    # Подсчёт членов/транзакций как в read_family
    members_cnt = (
        await session.execute(
            select(func.count(User.id)).where(User.family_id == family.id)
        )
    ).scalar_one()
    tx_cnt = (
        await session.execute(
            select(func.count()).select_from(Family.__table__.join(
                Family.transactions
            )).where(Family.id == family.id)
        )
    ).scalar_one()

    return FamilyRead(
        id=family.id,
        code=family.code,
        created_at=family.created_at,
        members_count=members_cnt,
        transactions_count=tx_cnt,
    )
