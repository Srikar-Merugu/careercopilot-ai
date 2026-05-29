import logging
from datetime import datetime
from typing import Optional
import requests
from backend.app.core.config import settings
from backend.app.services.job_providers.base import BaseJobProvider, JobData, SearchFilters, SearchResult

logger = logging.getLogger(__name__)


class AdzunaJobProvider(BaseJobProvider):
    BASE_URL = "https://api.adzuna.com/v1/api/jobs"

    def __init__(self):
        self.app_id = settings.ADZUNA_APP_ID or ""
        self.app_key = settings.ADZUNA_APP_KEY or ""
        self.enabled = bool(self.app_id and self.app_key)
        if self.enabled:
            logger.info("Adzuna provider initialized")
        else:
            logger.warning("Adzuna API credentials not configured")

    @property
    def name(self) -> str:
        return "adzuna"

    def search(self, filters: SearchFilters) -> SearchResult:
        if not self.enabled:
            return SearchResult(jobs=[], total=0, page=filters.page, per_page=filters.per_page)

        try:
            country = "us"
            url = f"{self.BASE_URL}/{country}/search/{filters.page}"

            params = {
                "app_id": self.app_id,
                "app_key": self.app_key,
                "results_per_page": min(filters.per_page, 50),
                "what": filters.query or "",
                "where": filters.location or "",
                "content-type": "application/json",
            }

            if filters.salary_min:
                params["salary_min"] = filters.salary_min
            if filters.salary_max:
                params["salary_max"] = filters.salary_max
            if filters.job_type:
                params["full_time"] = "1" if "full" in filters.job_type.lower() else "0"
            if filters.category:
                params["category"] = filters.category

            resp = requests.get(url, params=params, timeout=15)
            resp.raise_for_status()
            data = resp.json()

            jobs = []
            for raw in data.get("results", []):
                job = self._transform(raw)
                if job:
                    jobs.append(job)

            return SearchResult(
                jobs=jobs,
                total=data.get("count", 0),
                page=filters.page,
                per_page=filters.per_page,
            )

        except Exception as e:
            logger.error(f"Adzuna search failed: {e}")
            return SearchResult(jobs=[], total=0, page=filters.page, per_page=filters.per_page)

    def get_by_id(self, source_id: str) -> Optional[JobData]:
        if not self.enabled:
            return None
        try:
            country = "us"
            url = f"{self.BASE_URL}/{country}/jobs/{source_id}"
            params = {
                "app_id": self.app_id,
                "app_key": self.app_key,
            }
            resp = requests.get(url, params=params, timeout=15)
            resp.raise_for_status()
            return self._transform(resp.json())
        except Exception as e:
            logger.error(f"Adzuna get_by_id failed: {e}")
            return None

    def _transform(self, raw: dict) -> Optional[JobData]:
        try:
            salary_min = raw.get("salary_min")
            salary_max = raw.get("salary_max")
            if salary_min is not None:
                salary_min = int(salary_min)
            if salary_max is not None:
                salary_max = int(salary_max)

            return JobData(
                source="adzuna",
                source_id=str(raw.get("id", "")),
                title=raw.get("title", "Unknown Position"),
                company=raw.get("company", {}).get("display_name", "Unknown Company"),
                company_logo=None,
                location=raw.get("location", {}).get("display_name"),
                salary_min=salary_min,
                salary_max=salary_max,
                salary_currency="USD",
                description=raw.get("description"),
                requirements=raw.get("description", "")[:500] if raw.get("description") else None,
                required_skills=[],
                experience_required=None,
                job_type="full_time" if raw.get("full_time") else None,
                remote_type=None,
                apply_url=raw.get("redirect_url"),
                category=raw.get("category", {}).get("label") if raw.get("category") else None,
                posted_at=datetime.fromisoformat(raw["created"].replace("Z", "+00:00")) if raw.get("created") else None,
            )
        except Exception as e:
            logger.warning(f"Failed to transform Adzuna job: {e}")
            return None
