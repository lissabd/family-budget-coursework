# app/api/auth.py
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status, Response
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.core.database import get_session
from app.core.security import (
    hash_password,
    verify_password,
    create_access_token,
    get_current_user,
)
from app.models.user import User
from app.models.family import Family
from app.schemas.user import UserCreate, UserRead
from app.core.config import settings

router = APIRouter()

@router.post("/register", response_model=UserRead)
async def register(user_create: UserCreate, session: AsyncSession = Depends(get_session)):
    # Проверка: существует ли пользователь с таким email
    result = await session.execute(select(User).where(User.email == user_create.email))
    existing_user = result.scalar_one_or_none()
    if existing_user:
        raise HTTPException(status_code=400, detail="User with this email already exists")

    # Если указан код семьи — ищем её
    family_id = None
    if user_create.family_code:
        result = await session.execute(select(Family).where(Family.code == user_create.family_code))
        family = result.scalar_one_or_none()
        if not family:
            raise HTTPException(status_code=404, detail="Family not found")
        family_id = family.id
    else:
        # Иначе — создаём новую семью
        new_family = Family(code=user_create.email.split("@")[0])  # примитивный код
        session.add(new_family)
        await session.flush()
        family_id = new_family.id

    new_user = User(
        email=user_create.email,
        password_hash=hash_password(user_create.password),
        family_id=family_id
    )
    session.add(new_user)
    await session.commit()
    await session.refresh(new_user)
    return new_user

@router.post("/login")
async def login(
    user_create: UserCreate,
    response: Response,
    session: AsyncSession = Depends(get_session)
):
    # 1) находим пользователя
    result = await session.execute(select(User).where(User.email == user_create.email))
    user = result.scalar_one_or_none()
    if not user or not verify_password(user_create.password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

    # 2) формируем токен
    access_token = create_access_token(data={"sub": str(user.id)})

    # 3) кладем в HTTP-only cookie
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        max_age=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        samesite="lax",
    )
    return {"message": "Logged in"}

@router.post("/logout")
async def logout(response: Response):
    response.delete_cookie("access_token")
    return {"message": "Logged out"}

@router.get("/me", response_model=UserRead)
async def read_users_me(current_user: User = Depends(get_current_user)):
    return current_user
