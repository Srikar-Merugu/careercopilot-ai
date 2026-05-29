import uuid
import logging
from typing import Optional
from backend.app.core.config import settings
from backend.app.services.supabase import supabase_service

logger = logging.getLogger(__name__)


class StorageService:
    BUCKET_NAME = "resumes"

    def __init__(self):
        self.client = None
        self._init_client()

    def _init_client(self):
        try:
            self.client = supabase_service.get_client()
            self._ensure_bucket()
        except Exception as e:
            logger.warning(f"Storage client not available: {str(e)}")

    def _ensure_bucket(self):
        if not self.client:
            return
        try:
            buckets = self.client.storage.list_buckets()
            exists = any(b.name == self.BUCKET_NAME for b in buckets)
            if not exists:
                self.client.storage.create_bucket(
                    self.BUCKET_NAME,
                    options={"public": False}
                )
                logger.info(f"Created storage bucket: {self.BUCKET_NAME}")
        except Exception as e:
            logger.warning(f"Could not ensure bucket: {str(e)}")

    def upload(self, file_bytes: bytes, file_name: str, content_type: str) -> Optional[str]:
        if not self.client:
            file_id = str(uuid.uuid4())
            logger.warning(f"Storage unavailable. Using local file reference: {file_id}_{file_name}")
            return f"local://{file_id}_{file_name}"

        try:
            file_id = str(uuid.uuid4())
            storage_path = f"{file_id}_{file_name}"

            response = self.client.storage.from_(self.BUCKET_NAME).upload(
                path=storage_path,
                file=file_bytes,
                file_options={"content-type": content_type},
            )

            public_url = self.client.storage.from_(self.BUCKET_NAME).get_public_url(storage_path)
            logger.info(f"File uploaded successfully: {public_url}")
            return public_url

        except Exception as e:
            logger.error(f"Storage upload failed: {str(e)}")
            return None

    def delete(self, file_url: str) -> bool:
        if not self.client or not file_url:
            return False
        try:
            path = file_url.split("/")[-1] if "/" in file_url else file_url
            self.client.storage.from_(self.BUCKET_NAME).remove([path])
            return True
        except Exception as e:
            logger.error(f"Storage delete failed: {str(e)}")
            return False


storage_service = StorageService()
