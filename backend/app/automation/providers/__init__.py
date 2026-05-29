from backend.app.automation.providers.linkedin import LinkedInProvider
from backend.app.automation.providers.generic import GenericJobProvider

linkedin_provider = LinkedInProvider()

provider_registry = {
    "linkedin": linkedin_provider,
    "indeed": GenericJobProvider("indeed", "https://in.indeed.com"),
    "wellfound": GenericJobProvider("wellfound", "https://wellfound.com"),
    "internshala": GenericJobProvider("internshala", "https://internshala.com"),
    "naukri": GenericJobProvider("naukri", "https://naukri.com"),
    "foundit": GenericJobProvider("foundit", "https://www.foundit.in"),
}

def get_provider(platform: str):
    return provider_registry.get(platform.lower())

__all__ = ["provider_registry", "get_provider", "linkedin_provider"]
