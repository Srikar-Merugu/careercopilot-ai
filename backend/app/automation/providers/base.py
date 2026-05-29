from abc import ABC, abstractmethod
from typing import Optional, Dict, Any
from playwright.async_api import Page


class BaseJobProvider(ABC):
    @property
    @abstractmethod
    def name(self) -> str:
        pass

    @property
    @abstractmethod
    def base_url(self) -> str:
        pass

    @abstractmethod
    async def login(self, page: Page, credentials: Dict[str, str]) -> bool:
        pass

    @abstractmethod
    async def apply(self, page: Page, job_url: str, application_data: Dict[str, Any]) -> Dict[str, Any]:
        pass

    @abstractmethod
    async def fill_application_form(self, page: Page, application_data: Dict[str, Any]) -> bool:
        pass

    @abstractmethod
    async def upload_resume(self, page: Page, resume_path: str) -> bool:
        pass

    @abstractmethod
    async def detect_easy_apply(self, page: Page) -> bool:
        pass

    async def handle_error(self, page: Page, error: Exception) -> Dict[str, Any]:
        screenshot = None
        try:
            screenshot = await page.screenshot(type="png")
        except Exception:
            pass
        return {
            "success": False,
            "error": str(error),
            "screenshot": screenshot,
            "url": page.url,
        }

    async def wait_for_apply_button(self, page: Page, timeout: int = 15000) -> Optional[str]:
        selectors = [
            "button[data-easy-apply]", "button[aria-label*='Apply']",
            "button:has-text('Apply')", "a:has-text('Apply')",
            "button:has-text('Easy Apply')", "button:has-text('Submit')",
            "[data-apply-button]", ".jobs-apply-button",
        ]
        for sel in selectors:
            try:
                await page.wait_for_selector(sel, timeout=5000)
                return sel
            except Exception:
                continue
        return None
