from fastapi import APIRouter, Depends, HTTPException, Header
from pydantic import BaseModel, EmailStr
from starlette.status import HTTP_401_UNAUTHORIZED
from typing import Optional
from backend.app.core.exceptions import AuthException

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
    """Mock login endpoint providing testing JWT tokens"""
    # Simple validation for testing
    if payload.email == "error@career.copilot" or len(payload.password) < 6:
        raise AuthException("Invalid login credentials")
        
    return TokenResponse(
        access_token="mock_jwt_token_for_career_copilot_frontend",
        user={
            "id": "usr_992384a2",
            "name": payload.email.split("@")[0].capitalize(),
            "email": payload.email,
            "role": "professional"
        }
    )

@router.post("/register", response_model=TokenResponse)
async def register(payload: RegisterPayload):
    """Mock registration endpoint providing testing JWT tokens"""
    if len(payload.password) < 6:
        raise AuthException("Password must be at least 6 characters")
        
    return TokenResponse(
        access_token="mock_jwt_token_for_career_copilot_frontend",
        user={
            "id": "usr_992384a2",
            "name": payload.name,
            "email": payload.email,
            "role": "professional"
        }
    )

@router.get("/me")
async def get_me(authorization: Optional[str] = Header(None)):
    """Mock JWT credential verifying profile parser"""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=HTTP_401_UNAUTHORIZED,
            detail="Missing or malformed Authorization header"
        )
    
    token = authorization.split(" ")[1]
    if token != "mock_jwt_token_for_career_copilot_frontend":
        raise HTTPException(
            status_code=HTTP_401_UNAUTHORIZED,
            detail="Invalid, expired or blacklisted access token"
        )

    return {
        "id": "usr_992384a2",
        "name": "Alex Mercer",
        "email": "alex@career.copilot",
        "role": "professional"
    }
