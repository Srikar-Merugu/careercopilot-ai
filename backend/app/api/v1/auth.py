from fastapi import APIRouter, Depends, HTTPException, Header
from pydantic import BaseModel, EmailStr
from starlette.status import HTTP_401_UNAUTHORIZED, HTTP_409_CONFLICT
from typing import Optional
from backend.app.core.security import hash_password, verify_password, create_access_token, get_current_user
from backend.app.core.exceptions import AuthException
from backend.app.models.user import UserModel

router = APIRouter()


class LoginPayload(BaseModel):
    email: EmailStr
    password: str


class RegisterPayload(BaseModel):
    name: str
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: dict


@router.post("/login", response_model=TokenResponse)
async def login(payload: LoginPayload):
    user = await UserModel.find_one(UserModel.email == payload.email)
    if not user or not verify_password(payload.password, user.hashed_password):
        raise AuthException("Invalid email or password")

    access_token = create_access_token({"sub": str(user.id), "email": user.email})
    return TokenResponse(
        access_token=access_token,
        user=user.to_dict(),
    )


@router.post("/register", response_model=TokenResponse)
async def register(payload: RegisterPayload):
    existing = await UserModel.find_one(UserModel.email == payload.email)
    if existing:
        raise HTTPException(
            status_code=HTTP_409_CONFLICT,
            detail="An account with this email already exists.",
        )

    if len(payload.password) < 6:
        raise AuthException("Password must be at least 6 characters")

    user = UserModel(
        email=payload.email,
        hashed_password=hash_password(payload.password),
        name=payload.name,
    )
    await user.insert()

    access_token = create_access_token({"sub": str(user.id), "email": user.email})
    return TokenResponse(
        access_token=access_token,
        user=user.to_dict(),
    )


@router.get("/me")
async def get_me(current_user: dict = Depends(get_current_user)):
    return {
        "success": True,
        "data": current_user,
    }
