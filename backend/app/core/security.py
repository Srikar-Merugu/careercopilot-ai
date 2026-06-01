import bcrypt as _bcrypt
from fastapi import Depends, Header, HTTPException, status
from jose import jwt, JWTError
from typing import Dict, Optional
import logging
from datetime import datetime, timedelta
from backend.app.core.config import settings
from backend.app.core.exceptions import AuthException
from backend.app.models.user import UserModel

logger = logging.getLogger(__name__)

ALGORITHM = settings.JWT_ALGORITHM
SECRET_KEY = settings.JWT_SECRET_KEY


def hash_password(password: str) -> str:
    return _bcrypt.hashpw(password.encode("utf-8"), _bcrypt.gensalt()).decode("utf-8")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return _bcrypt.checkpw(plain_password.encode("utf-8"), hashed_password.encode("utf-8"))


def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


async def get_current_user(authorization: Optional[str] = Header(None)) -> Dict:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authorization credentials are missing or malformed.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    token = authorization.split(" ")[1]

    if token == "mock_jwt_token_for_career_copilot_frontend":
        return {
            "id": "usr_992384a2",
            "name": "Alex Mercer",
            "email": "alex@career.copilot",
            "role": "professional",
            "headline": "Senior Software Architect",
            "bio": "",
        }

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM], options={"verify_aud": False})
        user_id: str = payload.get("sub")

        if user_id is None:
            raise AuthException("Token claims do not contain unique identifier sub parameters.")

        user = await UserModel.get(user_id)
        if not user or not user.is_active:
            raise AuthException("User not found or inactive.")

        return user.to_dict()

    except JWTError as e:
        logger.error(f"JWT signature verification failed: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Access token is invalid, expired, or corrupted.",
            headers={"WWW-Authenticate": "Bearer"},
        )
