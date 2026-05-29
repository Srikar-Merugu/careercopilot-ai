import logging
import asyncio
from typing import Optional
from playwright.async_api import async_playwright, Browser, BrowserContext, Page

logger = logging.getLogger(__name__)


class BrowserManager:
    _instance = None
    _browser: Optional[Browser] = None
    _playwright = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance

    async def get_browser(self) -> Browser:
        if self._browser is None or not self._browser.is_connected():
            self._playwright = await async_playwright().start()
            self._browser = await self._playwright.chromium.launch(
                headless=True,
                args=[
                    "--no-sandbox",
                    "--disable-setuid-sandbox",
                    "--disable-dev-shm-usage",
                    "--disable-gpu",
                    "--window-size=1920,1080",
                ],
            )
            logger.info("Playwright browser launched.")
        return self._browser

    async def create_context(self, storage_state: Optional[dict] = None) -> BrowserContext:
        browser = await self.get_browser()
        context = await browser.new_context(
            viewport={"width": 1920, "height": 1080},
            user_agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            storage_state=storage_state,
            locale="en-US",
            timezone_id="Asia/Kolkata",
            permissions=["geolocation"],
        )
        context.set_default_timeout(30000)
        return context

    async def create_page(self, context: Optional[BrowserContext] = None) -> Page:
        if context is None:
            browser = await self.get_browser()
            context = await browser.new_context()
        return await context.new_page()

    async def close(self):
        if self._browser:
            await self._browser.close()
            self._browser = None
        if self._playwright:
            await self._playwright.stop()
            self._playwright = None
        logger.info("Playwright browser closed.")

    async def safe_goto(self, page: Page, url: str, timeout: int = 30000) -> bool:
        try:
            await page.goto(url, wait_until="domcontentloaded", timeout=timeout)
            await page.wait_for_load_state("networkidle", timeout=timeout)
            return True
        except Exception as e:
            logger.warning(f"Navigation to {url} failed: {e}")
            return False

    async def safe_fill(self, page: Page, selector: str, value: str, timeout: int = 10000) -> bool:
        try:
            await page.wait_for_selector(selector, timeout=timeout)
            await page.fill(selector, value)
            return True
        except Exception as e:
            logger.warning(f"Fill failed for {selector}: {e}")
            return False

    async def safe_click(self, page: Page, selector: str, timeout: int = 10000) -> bool:
        try:
            await page.wait_for_selector(selector, timeout=timeout)
            await page.click(selector)
            return True
        except Exception as e:
            logger.warning(f"Click failed for {selector}: {e}")
            return False

    async def safe_wait_and_click(self, page: Page, selector: str, timeout: int = 15000) -> bool:
        try:
            await page.wait_for_selector(selector, timeout=timeout)
            await page.wait_for_timeout(500)
            await page.click(selector)
            return True
        except Exception as e:
            logger.warning(f"Wait and click failed for {selector}: {e}")
            return False

    async def human_type(self, page: Page, selector: str, text: str, delay: int = 50):
        await page.wait_for_selector(selector, timeout=10000)
        await page.click(selector)
        await page.wait_for_timeout(200)
        for char in text:
            await page.type(selector, char, delay=delay)
            await page.wait_for_timeout(delay)

    async def take_screenshot(self, page: Page, name: str = "debug") -> bytes:
        try:
            return await page.screenshot(type="png")
        except Exception as e:
            logger.warning(f"Screenshot failed: {e}")
            return b""

    async def detect_form_fields(self, page: Page) -> list:
        fields = []
        selectors = [
            "input[type='text']", "input[type='email']", "input[type='tel']",
            "input[type='url']", "input[type='file']", "textarea",
            "select", "input:not([type='hidden'])",
        ]
        for sel in selectors:
            try:
                elements = await page.query_selector_all(sel)
                for el in elements:
                    try:
                        name = await el.get_attribute("name") or ""
                        placeholder = await el.get_attribute("placeholder") or ""
                        label = await el.get_attribute("aria-label") or ""
                        field_id = await el.get_attribute("id") or ""
                        field_type = await el.get_attribute("type") or "text"
                        fields.append({
                            "selector": sel,
                            "name": name,
                            "placeholder": placeholder,
                            "label": label,
                            "id": field_id,
                            "type": field_type,
                            "visible": await el.is_visible(),
                        })
                    except Exception:
                        continue
            except Exception:
                continue
        return fields


browser_manager = BrowserManager()
