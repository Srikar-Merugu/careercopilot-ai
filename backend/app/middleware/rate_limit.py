import time
import logging
from typing import Dict, Tuple
from fastapi import Request, HTTPException
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import JSONResponse

logger = logging.getLogger(__name__)


class RateLimitMiddleware(BaseHTTPMiddleware):
    def __init__(self, app, requests_per_minute: int = 60):
        super().__init__(app)
        self.requests_per_minute = requests_per_minute
        self._requests: Dict[str, list] = {}

    async def dispatch(self, request: Request, call_next):
        if request.url.path.startswith("/api/v1"):
            client_ip = request.client.host if request.client else "unknown"
            now = time.time()

            if client_ip not in self._requests:
                self._requests[client_ip] = []
            self._requests[client_ip] = [
                t for t in self._requests[client_ip] if now - t < 60
            ]

            if len(self._requests[client_ip]) >= self.requests_per_minute:
                logger.warning(f"Rate limit exceeded for {client_ip}")
                return JSONResponse(
                    status_code=429,
                    content={
                        "detail": "Rate limit exceeded. Try again in a minute.",
                        "retry_after": 60,
                    },
                    headers={"Retry-After": "60", "X-RateLimit-Limit": str(self.requests_per_minute)},
                )

            self._requests[client_ip].append(now)

        response = await call_next(request)
        return response


class FeatureAccessMiddleware(BaseHTTPMiddleware):
    def __init__(self, app):
        super().__init__(app)
        self._protected_routes = {
            "/api/v1/automation/apply": "auto_apply",
            "/api/v1/automation/apply/bulk": "auto_apply",
            "/api/v1/interviews": "interview_prep",
            "/api/v1/telegram/alerts": "telegram_premium",
        }

    async def dispatch(self, request: Request, call_next):
        path = request.url.path
        for route, feature in self._protected_routes.items():
            if path.startswith(route) and request.method in ("POST", "PUT", "DELETE"):
                from backend.app.stripe.subscription_service import subscription_service
                user_id = request.headers.get("X-User-Id", "mock_jwt_token_for_career_copilot_frontend")
                allowed = await subscription_service.can_access(user_id, feature)
                if not allowed:
                    return JSONResponse(
                        status_code=403,
                        content={
                            "detail": f"Premium feature. Upgrade required to access {feature}.",
                            "upgrade_url": "/api/v1/subscriptions/plans",
                        },
                    )
        return await call_next(request)
