# backend/app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import auth, families

app = FastAPI(
    title="Family Budget API",
    version="1.0",
    docs_url="/docs",
    openapi_url="/openapi.json",
)

# CORS: разрешаем браузеру обращаться к вашему API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],     
    allow_methods=["*"],
    allow_headers=["*"],
)

# Аутентификация
app.include_router(auth.router, prefix="/api/auth", tags=["Auth"])
# Эндпоинты по «Семье»
app.include_router(families.router, prefix="/api/families", tags=["Families"])