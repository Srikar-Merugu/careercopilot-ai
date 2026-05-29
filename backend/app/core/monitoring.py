import logging
import time
from contextlib import asynccontextmanager
from typing import Optional

from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware

logger = logging.getLogger(__name__)

APM_METRICS = {
    "requests_total": 0,
    "requests_active": 0,
    "requests_by_path": {},
    "requests_by_status": {},
    "errors_total": 0,
    "ai_requests_total": 0,
    "ai_requests_failed": 0,
    "automation_runs": 0,
    "automation_failures": 0,
}

SENTRY_AVAILABLE = False
POSTHOG_AVAILABLE = False

try:
    import sentry_sdk
    from sentry_sdk.integrations.fastapi import FastApiIntegration

    sentry_sdk.init(
        dsn="",
        integrations=[FastApiIntegration()],
        traces_sample_rate=0.2,
        profiles_sample_rate=0.1,
        environment="production",
    )
    SENTRY_AVAILABLE = True
except ImportError:
    pass

try:
    from posthog import Posthog
    posthog = Posthog(project_api_key="", host="https://app.posthog.com")
    POSTHOG_AVAILABLE = True
except ImportError:
    posthog = None


class MetricsMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        APM_METRICS["requests_total"] += 1
        APM_METRICS["requests_active"] += 1
        start = time.time()

        try:
            response = await call_next(request)
            status_code = response.status_code
        except Exception as e:
            APM_METRICS["errors_total"] += 1
            if SENTRY_AVAILABLE:
                sentry_sdk.capture_exception(e)
            raise
        finally:
            APM_METRICS["requests_active"] -= 1
            duration = time.time() - start

        path = request.url.path
        if path not in APM_METRICS["requests_by_path"]:
            APM_METRICS["requests_by_path"][path] = {"count": 0, "total_duration": 0}
        APM_METRICS["requests_by_path"][path]["count"] += 1
        APM_METRICS["requests_by_path"][path]["total_duration"] += duration

        status_group = f"{status_code // 100}xx"
        APM_METRICS["requests_by_status"][status_group] = (
            APM_METRICS["requests_by_status"].get(status_group, 0) + 1
        )

        if duration > 2.0:
            logger.warning(f"Slow request: {request.method} {path} took {duration:.2f}s")

        if POSTHOG_AVAILABLE and posthog:
            posthog.capture(
                distinct_id=request.headers.get("X-User-Id", "anonymous"),
                event="api_request",
                properties={
                    "path": path,
                    "method": request.method,
                    "status_code": status_code,
                    "duration_ms": round(duration * 1000),
                },
            )

        return response


def track_ai_request(success: bool = True):
    APM_METRICS["ai_requests_total"] += 1
    if not success:
        APM_METRICS["ai_requests_failed"] += 1
        if SENTRY_AVAILABLE:
            sentry_sdk.capture_message("AI request failed")


def track_automation_run(success: bool = True):
    APM_METRICS["automation_runs"] += 1
    if not success:
        APM_METRICS["automation_failures"] += 1


def get_metrics() -> dict:
    metrics = dict(APM_METRICS)
    metrics["sentry_available"] = SENTRY_AVAILABLE
    metrics["posthog_available"] = POSTHOG_AVAILABLE
    return metrics
