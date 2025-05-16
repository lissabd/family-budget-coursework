from pydantic import BaseModel

class TokenPayload(BaseModel):
    sub: str  # ID пользователя
    exp: int  # Время истечения токена (установится автоматически)
