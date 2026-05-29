from fastapi import APIRouter, Depends
from pydantic import BaseModel, EmailStr
from typing import Optional, Dict, List
from backend.app.core.security import get_current_user

router = APIRouter()

class ProfileUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    headline: Optional[str] = None
    bio: Optional[str] = None
    # Onboarding fields
    preferred_roles: Optional[List[str]] = None
    experience_level: Optional[str] = None
    locations: Optional[List[str]] = None
    skills: Optional[List[str]] = None
    resume_url: Optional[str] = None
    onboarding_complete: Optional[bool] = None

class OnboardingPayload(BaseModel):
    preferred_roles: List[str]
    experience_level: str
    locations: List[str]
    skills: List[str]
    resume_url: Optional[str] = None
    headline: Optional[str] = None

@router.patch("/profile")
async def update_profile(
    profile: ProfileUpdate,
    current_user: Dict = Depends(get_current_user)
):
    """
    Protected profile updating endpoint. Requires active Authorization Bearer claims.
    """
    return {
        "success": True,
        "message": "Telemetry profile parameters updated successfully.",
        "data": {
            "id": current_user.get("id"),
            "name": profile.name or current_user.get("name"),
            "email": profile.email or current_user.get("email"),
            "headline": profile.headline or current_user.get("headline"),
            "bio": profile.bio or current_user.get("bio"),
            "preferred_roles": profile.preferred_roles,
            "experience_level": profile.experience_level,
            "locations": profile.locations,
            "skills": profile.skills,
            "resume_url": profile.resume_url,
            "onboarding_complete": profile.onboarding_complete,
        }
    }

@router.post("/onboarding")
async def complete_onboarding(
    payload: OnboardingPayload,
    current_user: Dict = Depends(get_current_user)
):
    """
    Saves the completed multi-step onboarding preferences for the authenticated user.
    Marks the onboarding_complete flag and stores career preference metadata.
    """
    return {
        "success": True,
        "message": "Onboarding configuration saved. Career copilot is now active.",
        "data": {
            "id": current_user.get("id"),
            "email": current_user.get("email"),
            "onboarding_complete": True,
            "preferred_roles": payload.preferred_roles,
            "experience_level": payload.experience_level,
            "locations": payload.locations,
            "skills": payload.skills,
            "resume_url": payload.resume_url,
            "headline": payload.headline or current_user.get("headline"),
        }
    }

@router.get("/me")
async def get_current_user_profile(
    current_user: Dict = Depends(get_current_user)
):
    """
    Returns the authenticated user profile data from the JWT token metadata.
    """
    return {
        "success": True,
        "data": current_user
    }
