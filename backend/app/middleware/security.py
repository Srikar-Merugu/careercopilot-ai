from fastapi import FastAPI, Request
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import Response

class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next) -> Response:
        response: Response = await call_next(request)
        # Prevent clickjacking
        response.headers["X-Frame-Options"] = "DENY"
        # Prevent MIME type sniffing
        response.headers["X-Content-Type-Options"] = "nosniff"
        # XSS Protection
        response.headers["X-XSS-Protection"] = "1; mode=block"
        # Strict HSTS (Only applied when HTTPS is used)
        response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
        # Content Security Policy (Basic default fallback)
        response.headers["Content-Security-Policy"] = "default-src 'self'; frame-ancestors 'none';"
        # Referrer Policy
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        
        return response

def setup_security_headers(app: FastAPI) -> None:
    app.add_middleware(SecurityHeadersMiddleware)
