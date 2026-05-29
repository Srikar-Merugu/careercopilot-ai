import logging
from typing import Dict, Any, Optional
from playwright.async_api import Page
from backend.app.automation.providers.base import BaseJobProvider
from backend.app.automation.ai_generation.form_filler import form_filling_ai
from backend.app.automation.utils.browser import browser_manager

logger = logging.getLogger(__name__)


class GenericJobProvider(BaseJobProvider):
    name = "generic"
    base_url = ""

    def __init__(self, platform_name: str, base_url: str):
        self._name = platform_name
        self._base_url = base_url

    @property
    def name(self) -> str:
        return self._name

    @property
    def base_url(self) -> str:
        return self._base_url

    async def login(self, page: Page, credentials: Dict[str, str]) -> bool:
        return True

    async def apply(self, page: Page, job_url: str, application_data: Dict[str, Any]) -> Dict[str, Any]:
        try:
            await page.goto(job_url, wait_until="domcontentloaded")
            await page.wait_for_timeout(3000)

            apply_btn_sel = await self.wait_for_apply_button(page)
            if apply_btn_sel:
                await page.click(apply_btn_sel)
                await page.wait_for_timeout(3000)

            filled = await self.fill_application_form(page, application_data)
            if filled:
                return {"success": True, "platform": self._name, "message": "Form filled successfully"}
            return {"success": False, "error": "Could not complete application form"}
        except Exception as e:
            return await self.handle_error(page, e)

    async def fill_application_form(self, page: Page, application_data: Dict[str, Any]) -> bool:
        try:
            fields = await browser_manager.detect_form_fields(page)
            for field in fields:
                if not field.get("visible"):
                    continue
                response = form_filling_ai.generate_response(field, application_data)
                if field["type"] == "file":
                    resume_path = application_data.get("resume_path", "")
                    if resume_path:
                        await self.upload_resume(page, resume_path)
                elif field["type"] == "select" or field.get("tag") == "select":
                    await self._handle_select(page, field, response)
                elif response and response != "N/A":
                    await browser_manager.safe_fill(page, field["selector"], response)
            return True
        except Exception as e:
            logger.error(f"Generic form fill failed: {e}")
            return False

    async def upload_resume(self, page: Page, resume_path: str) -> bool:
        try:
            file_input = await page.query_selector("input[type='file']")
            if file_input:
                await file_input.set_input_files(resume_path)
                await page.wait_for_timeout(2000)
                return True
            return False
        except Exception as e:
            logger.error(f"Generic resume upload failed: {e}")
            return False

    async def detect_easy_apply(self, page: Page) -> bool:
        return await self.wait_for_apply_button(page) is not None

    async def _handle_select(self, page: Page, field: Dict, value: str):
        try:
            selector = field["selector"]
            options = await page.query_selector_all(f"{selector} option")
            for opt in options:
                opt_text = await opt.inner_text()
                if value.lower() in opt_text.lower():
                    await opt.click()
                    return
            if options:
                await options[0].click()
        except Exception as e:
            logger.warning(f"Select handling failed: {e}")
