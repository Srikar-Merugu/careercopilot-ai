import re
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.app.core.config import settings

def setup_cors(app: FastAPI) -> None:
    raw = settings.ALLOWED_ORIGINS_STR
    origins = [origin.strip() for origin in raw.split(",") if origin.strip()]

    known_origins = [
        "https://careercopilot-ai-pi.vercel.app",
        "http://localhost:3000",
        "https://careercopilot-ai.vercel.app",
    ]
    for o in known_origins:
        if o not in origins:
            origins.append(o)

    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_origin_regex=settings.ALLOWED_ORIGINS_REGEX,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
