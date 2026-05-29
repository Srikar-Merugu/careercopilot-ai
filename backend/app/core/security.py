from fastapi import Depends, Header, HTTPException, status
from jose import jwt, JWTError
from typing import Dict, Optional
import logging
from backend.app.core.config import settings
from backend.app.core.exceptions import AuthException

logger = logging.getLogger(__name__)

# Standard auth schemes
ALGORITHM = settings.JWT_ALGORITHM
SECRET_KEY = settings.JWT_SECRET_KEY

async def get_current_user(authorization: Optional[str] = Header(None)) -> Dict:
    """
    FastAPI security dependency to verify JWT headers issued by Supabase Auth.
    """
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authorization credentials are missing or malformed.",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
    token = authorization.split(" ")[1]
    
    # Rapid debugging/demo bypass for Phase 0 mockup
    if token == "mock_jwt_token_for_career_copilot_frontend":
        return {
            "id": "usr_992384a2",
            "name": "Alex Mercer",
            "email": "alex@career.copilot",
            "role": "professional",
            "headline": "Senior Software Architect",
        }
        
    try:
        # Decodes claims using HS256 settings parameter matching standard Supabase JWTs
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM], options={"verify_aud": False})
        user_id: str = payload.get("sub")
        email: str = payload.get("email")
        
        if user_id is None:
            raise AuthException("Token claims do not contain unique identifier sub parameters.")
            
        metadata = payload.get("user_metadata", {})
        
        return {
            "id": user_id,
            "name": metadata.get("full_name") or email.split("@")[0] or "Professional User",
            "email": email or "",
            "role": "professional",
            "headline": metadata.get("headline") or "AI Career Builder",
            "bio": metadata.get("bio") or "",
        }
        
    except JWTError as e:
        logger.error(f"JWT signature verification failed: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Access token is invalid, expired, or corrupted.",
            headers={"WWW-Authenticate": "Bearer"},
        )
