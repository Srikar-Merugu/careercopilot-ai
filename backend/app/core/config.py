from typing import List, Union
from pydantic import AnyHttpUrl, BeforeValidator, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing_extensions import Annotated


def parse_cors_origins(v: Union[str, List[str]]) -> List[str]:
    if isinstance(v, str) and not v.startswith("["):
        return [i.strip() for i in v.split(",")]
    elif isinstance(v, (list, str)):
        return v
    raise ValueError(v)


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore"
    )

    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "CareerCopilot AI"
    ENVIRONMENT: str = "development"
    LOG_LEVEL: str = "info"
    
    # Security
    JWT_SECRET_KEY: str = "9a6d09f7a75a7c29e6231c5123d46777c9ff7a12b4e870503f8a96d4c1ff00f9"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60

    # CORS Allowed Origins (comma-separated in env, parsed to list)
    ALLOWED_ORIGINS_STR: str = "http://localhost:3000"

    # Database
    DATABASE_URL: str = "postgresql://postgres:password@db.supabase.co:5432/postgres"

    # Supabase Connection
    SUPABASE_URL: str = "https://vqkrotdvxrfomjcpuoby.supabase.co"
    SUPABASE_ANON_KEY: str = "sb_publishable_I8l_iL5HyEJt9ZlkwQWN5Q_BjjyKJ44"
    SUPABASE_SERVICE_ROLE_KEY: str = "your-service-role-key"

    # AI Services
    OPENAI_API_KEY: str = ""
    OPENROUTER_API_KEY: str = ""
    OPENAI_MODEL: str = "gpt-4o"

    # Job Providers
    # Job Providers
    ADZUNA_APP_ID: str = ""
    ADZUNA_APP_KEY: str = ""

    # AI Embeddings
    EMBEDDING_PROVIDER: str = "openai"
    EMBEDDING_MODEL: str = "text-embedding-3-small"
    EMBEDDING_DIMENSIONS: int = 1536
    FAISS_INDEX_PATH: str = "/tmp/faiss_index"
    VECTOR_CACHE_ENABLED: bool = True
    SEMANTIC_MATCH_CONFIDENCE_THRESHOLD: float = 0.6

    # Telegram Bot
    TELEGRAM_BOT_TOKEN: str = ""
    TELEGRAM_WEBHOOK_URL: str = ""
    TELEGRAM_WEBHOOK_SECRET_TOKEN: str = ""
    TELEGRAM_BOT_USERNAME: str = "CareerCopilotBot"
    TELEGRAM_OWNER_ID: str = ""
    TELEGRAM_MAX_MESSAGE_LENGTH: int = 4096

    # AI Chat
    AI_CHAT_MODEL: str = "gpt-4o"
    AI_CHAT_TEMPERATURE: float = 0.7
    AI_CHAT_MAX_TOKENS: int = 1024

    # Stripe
    STRIPE_SECRET_KEY: str = ""
    STRIPE_PUBLISHABLE_KEY: str = ""
    STRIPE_WEBHOOK_SECRET: str = ""

    # Sentry
    SENTRY_DSN: str = ""

    # PostHog
    POSTHOG_API_KEY: str = ""
    POSTHOG_HOST: str = "https://app.posthog.com"

    # Redis
    REDIS_URL: str = ""

    # Production URLs
    FRONTEND_URL: str = "https://careercopilot.ai"
    BACKEND_URL: str = "https://api.careercopilot.ai"


settings = Settings()
