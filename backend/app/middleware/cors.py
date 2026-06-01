import re
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.app.core.config import settings

def setup_cors(app: FastAPI) -> None:
    # Parse comma-separated origins string
    raw = settings.ALLOWED_ORIGINS_STR
    origins = [origin.strip() for origin in raw.split(",") if origin.strip()]

    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_origin_regex=settings.ALLOWED_ORIGINS_REGEX,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
