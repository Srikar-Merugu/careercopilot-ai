from abc import ABC, abstractmethod
from dataclasses import dataclass
from datetime import datetime
from typing import Optional


@dataclass
class JobData:
    source: str
    source_id: str
    title: str
    company: str
    company_logo: Optional[str] = None
    location: Optional[str] = None
    salary_min: Optional[int] = None
    salary_max: Optional[int] = None
    salary_currency: str = "USD"
    description: Optional[str] = None
    requirements: Optional[str] = None
    required_skills: Optional[list[str]] = None
    experience_required: Optional[str] = None
    job_type: Optional[str] = None
    remote_type: Optional[str] = None
    apply_url: Optional[str] = None
    category: Optional[str] = None
    posted_at: Optional[datetime] = None


@dataclass
class SearchFilters:
    query: str = ""
    location: Optional[str] = None
    remote_type: Optional[str] = None
    salary_min: Optional[int] = None
    salary_max: Optional[int] = None
    experience: Optional[str] = None
    job_type: Optional[str] = None
    category: Optional[str] = None
    page: int = 1
    per_page: int = 20


@dataclass
class SearchResult:
    jobs: list[JobData]
    total: int
    page: int
    per_page: int


class BaseJobProvider(ABC):
    @abstractmethod
    def search(self, filters: SearchFilters) -> SearchResult:
        pass

    @abstractmethod
    def get_by_id(self, source_id: str) -> Optional[JobData]:
        pass

    @property
    @abstractmethod
    def name(self) -> str:
        pass
