from fastapi import APIRouter, Depends
from pydantic import BaseModel, EmailStr
from typing import Optional, Dict, List
from backend.app.core.security import get_current_user
from backend.app.models.user import UserModel

router = APIRouter()


class ProfileUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    headline: Optional[str] = None
    bio: Optional[str] = None
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
    current_user: dict = Depends(get_current_user),
):
    user = await UserModel.get(current_user["id"])
    if not user:
        return {"success": False, "message": "User not found"}

    update_data = profile.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        if value is not None:
            setattr(user, key, value)
    user.updated_at = __import__("datetime").datetime.utcnow()
    await user.save()

    return {
        "success": True,
        "message": "Profile updated successfully.",
        "data": user.to_dict(),
    }


@router.post("/onboarding")
async def complete_onboarding(
    payload: OnboardingPayload,
    current_user: dict = Depends(get_current_user),
):
    user = await UserModel.get(current_user["id"])
    if not user:
        return {"success": False, "message": "User not found"}

    user.preferred_roles = payload.preferred_roles
    user.experience_level = payload.experience_level
    user.locations = payload.locations
    user.skills = payload.skills
    if payload.resume_url:
        user.resume_url = payload.resume_url
    if payload.headline:
        user.headline = payload.headline
    user.onboarding_complete = True
    user.updated_at = __import__("datetime").datetime.utcnow()
    await user.save()

    return {
        "success": True,
        "message": "Onboarding configuration saved.",
        "data": user.to_dict(),
    }


@router.get("/me")
async def get_current_user_profile(current_user: dict = Depends(get_current_user)):
    return {
        "success": True,
        "data": current_user,
    }
