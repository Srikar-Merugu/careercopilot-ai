import logging
from typing import Dict, Any
from playwright.async_api import Page
from backend.app.automation.providers.base import BaseJobProvider

logger = logging.getLogger(__name__)


class LinkedInProvider(BaseJobProvider):
    name = "linkedin"
    base_url = "https://www.linkedin.com"

    async def login(self, page: Page, credentials: Dict[str, str]) -> bool:
        try:
            await page.goto("https://www.linkedin.com/login", wait_until="domcontentloaded")
            await page.wait_for_timeout(2000)
            await page.fill("#username", credentials.get("email", ""))
            await page.fill("#password", credentials.get("password", ""))
            await page.click("button[type='submit']")
            await page.wait_for_timeout(5000)
            return "feed" in page.url or "checkpoint" in page.url
        except Exception as e:
            logger.error(f"LinkedIn login failed: {e}")
            return False

    async def apply(self, page: Page, job_url: str, application_data: Dict[str, Any]) -> Dict[str, Any]:
        try:
            await page.goto(job_url, wait_until="domcontentloaded")
            await page.wait_for_timeout(3000)

            if await self._has_easy_apply(page):
                return await self._easy_apply_flow(page, application_data)
            return {"success": False, "error": "No Easy Apply button found", "requires_redirect": True}
        except Exception as e:
            return await self.handle_error(page, e)

    async def _has_easy_apply(self, page: Page) -> bool:
        selectors = [
            "button[data-easy-apply]", "button.jobs-apply-button",
            "button:has-text('Easy Apply')", "button:has-text('Apply')",
            ".jobs-easy-apply-button",
        ]
        for sel in selectors:
            try:
                btn = await page.wait_for_selector(sel, timeout=5000)
                if btn:
                    return True
            except Exception:
                continue
        return False

    async def _easy_apply_flow(self, page: Page, data: Dict[str, Any]) -> Dict[str, Any]:
        try:
            apply_btn = await page.query_selector("button[data-easy-apply], button.jobs-apply-button, button:has-text('Easy Apply')")
            if apply_btn:
                await apply_btn.click()
                await page.wait_for_timeout(3000)

            await self.fill_application_form(page, data)
            return {"success": True, "platform": "linkedin", "message": "Application submitted"}
        except Exception as e:
            return await self.handle_error(page, e)

    async def fill_application_form(self, page: Page, application_data: Dict[str, Any]) -> bool:
        try:
            for _ in range(10):
                next_btn = await page.query_selector("button[aria-label='Next'], button:has-text('Next')")
                review_btn = await page.query_selector("button[aria-label='Review'], button:has-text('Review')")
                submit_btn = await page.query_selector("button[aria-label='Submit'], button:has-text('Submit')")

                if submit_btn:
                    await submit_btn.click()
                    await page.wait_for_timeout(2000)
                    return True
                elif review_btn:
                    await review_btn.click()
                    await page.wait_for_timeout(2000)
                elif next_btn:
                    await next_btn.click()
                    await page.wait_for_timeout(2000)
                else:
                    break

                await page.wait_for_timeout(1000)
            return False
        except Exception as e:
            logger.error(f"Easy Apply form fill failed: {e}")
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
            logger.error(f"Resume upload failed: {e}")
            return False

    async def detect_easy_apply(self, page: Page) -> bool:
        return await self._has_easy_apply(page)
