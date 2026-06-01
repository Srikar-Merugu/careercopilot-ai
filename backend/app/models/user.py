import uuid
from datetime import datetime
from beanie import Document
from pydantic import Field


class UserModel(Document):
    email: str = Field(..., index=True, unique=True)
    hashed_password: str = Field(...)
    name: str = Field(default="")
    headline: str = Field(default="AI Career Builder")
    bio: str = Field(default="")
    role: str = Field(default="professional")
    preferred_roles: list[str] = Field(default=[])
    experience_level: str = Field(default="")
    locations: list[str] = Field(default=[])
    skills: list[str] = Field(default=[])
    resume_url: str = Field(default="")
    onboarding_complete: bool = Field(default=False)
    ats_score: float | None = Field(default=None)
    is_active: bool = Field(default=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    def to_dict(self) -> dict:
        return {
            "id": str(self.id),
            "email": self.email,
            "name": self.name,
            "headline": self.headline,
            "bio": self.bio,
            "role": self.role,
            "preferred_roles": self.preferred_roles,
            "experience_level": self.experience_level,
            "locations": self.locations,
            "skills": self.skills,
            "resume_url": self.resume_url,
            "onboarding_complete": self.onboarding_complete,
            "ats_score": self.ats_score,
            "is_active": self.is_active,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }

    class Settings:
        name = "users"
