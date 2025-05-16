# backend/app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.api.auth       import router as auth_router
from app.api.families   import router as families_router
from app.api.categories import router as categories_router
from app.core.database  import get_session
from app.models.category import Category


app = FastAPI(
    title="Family Budget API",
    version="1.0",
    docs_url="/docs",
    openapi_url="/openapi.json",
)

# CORS: разрешаем браузеру любые запросы
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Роутеры
app.include_router(auth_router,       prefix="/api/auth",      tags=["Auth"])
app.include_router(families_router,   prefix="/api/families",  tags=["Families"])
app.include_router(categories_router, prefix="/api/categories", tags=["Categories"])


# ------------------
# заполнение таблицы categories при старте (seed)
# ------------------
@app.on_event("startup")
async def seed_categories():
    async for session in get_session():  # получаем AsyncSession
        # проверяем, есть ли хоть одна категория
        result = await session.execute(select(Category))
        if not result.scalars().first():
            initial = [
                Category(name="Food",          type="expense"),
                Category(name="Utilities",     type="expense"),
                Category(name="Entertainment", type="expense"),
                Category(name="Salary",        type="income"),
                Category(name="Investments",   type="income"),
            ]
            session.add_all(initial)
            await session.commit()
