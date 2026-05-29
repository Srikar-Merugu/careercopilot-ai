from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from starlette.status import HTTP_500_INTERNAL_SERVER_ERROR, HTTP_400_BAD_REQUEST
import logging

logger = logging.getLogger(__name__)

class BaseAppException(Exception):
    """Base exception class for CareerCopilot AI"""
    def __init__(self, message: str, status_code: int = HTTP_400_BAD_REQUEST):
        super().__init__(message)
        self.message = message
        self.status_code = status_code


class DatabaseException(BaseAppException):
    """Database-related failures"""
    pass


class AuthException(BaseAppException):
    """Authentication or token validation failures"""
    pass


class ValidationException(BaseAppException):
    """Payload or query parsing failures"""
    pass


def register_exception_handlers(app: FastAPI) -> None:
    @app.exception_handler(BaseAppException)
    async def app_exception_handler(request: Request, exc: BaseAppException) -> JSONResponse:
        logger.error(f"App exception occurred: {exc.message} on path {request.url.path}")
        return JSONResponse(
            status_code=exc.status_code,
            content={
                "success": False,
                "error": {
                    "code": exc.__class__.__name__,
                    "message": exc.message
                }
            }
        )

    @app.exception_handler(Exception)
    async def unhandled_exception_handler(request: Request, exc: Exception) -> JSONResponse:
        logger.exception(f"Unhandled system error occurred on path {request.url.path}: {str(exc)}")
        return JSONResponse(
            status_code=HTTP_500_INTERNAL_SERVER_ERROR,
            content={
                "success": False,
                "error": {
                    "code": "InternalServerError",
                    "message": "An unexpected error occurred. Please contact support."
                }
            }
        )
