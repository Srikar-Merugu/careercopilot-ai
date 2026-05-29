from supabase import create_client, Client
from backend.app.core.config import settings
import logging

logger = logging.getLogger(__name__)

class SupabaseService:
    def __init__(self):
        self.url = settings.SUPABASE_URL
        self.key = settings.SUPABASE_ANON_KEY
        self.client: Client | None = None
        
        try:
            if self.url and "your-project" not in self.url:
                self.client = create_client(self.url, self.key)
                logger.info("Supabase client initialized successfully.")
            else:
                logger.warning("Supabase URL placeholder detected. SDK initialized in offline mode.")
        except Exception as e:
            logger.error(f"Failed to initialize Supabase client: {str(e)}")

    def get_client(self) -> Client:
        if not self.client:
            raise RuntimeError("Supabase client is not initialized. Please verify SUPABASE_URL and SUPABASE_ANON_KEY.")
        return self.client

# Singleton client instance
supabase_service = SupabaseService()
