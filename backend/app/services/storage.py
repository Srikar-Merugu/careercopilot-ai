import uuid
import os
import logging
from pathlib import Path
from typing import Optional
from backend.app.core.config import settings
from backend.app.services.supabase import supabase_service

logger = logging.getLogger(__name__)

LOCAL_UPLOAD_DIR = Path("uploads/resumes")


class StorageService:
    BUCKET_NAME = "resumes"

    def __init__(self):
        self.client = None
        self._init_client()
        LOCAL_UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

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
            local_path = LOCAL_UPLOAD_DIR / f"{file_id}_{file_name}"
            try:
                local_path.write_bytes(file_bytes)
                logger.info(f"Saved file locally: {local_path}")
                return f"local://{file_id}_{file_name}"
            except Exception as e:
                logger.error(f"Local file save failed: {str(e)}")
                return None

        try:
            file_id = str(uuid.uuid4())
            storage_path = f"{file_id}_{file_name}"

            self.client.storage.from_(self.BUCKET_NAME).upload(
                path=storage_path,
                file=file_bytes,
                file_options={"content-type": content_type},
            )

            public_url = self.client.storage.from_(self.BUCKET_NAME).get_public_url(storage_path)
            logger.info(f"File uploaded successfully: {public_url}")
            return public_url

        except Exception as e:
            logger.error(f"Storage upload failed: {str(e)}")
            file_id = str(uuid.uuid4())
            local_path = LOCAL_UPLOAD_DIR / f"{file_id}_{file_name}"
            try:
                local_path.write_bytes(file_bytes)
                logger.info(f"Fallback: saved file locally: {local_path}")
                return f"local://{file_id}_{file_name}"
            except Exception as e2:
                logger.error(f"Fallback local save also failed: {str(e2)}")
                return None

    def get_local_path(self, file_url: str) -> Optional[Path]:
        if not file_url or not file_url.startswith("local://"):
            return None
        local_name = file_url.replace("local://", "", 1)
        path = LOCAL_UPLOAD_DIR / local_name
        if path.exists():
            return path
        return None

    def delete(self, file_url: str) -> bool:
        if not file_url:
            return False
        if file_url.startswith("local://"):
            local_path = self.get_local_path(file_url)
            if local_path:
                local_path.unlink(missing_ok=True)
                return True
            return False
        if not self.client:
            return False
        try:
            path = file_url.split("/")[-1] if "/" in file_url else file_url
            self.client.storage.from_(self.BUCKET_NAME).remove([path])
            return True
        except Exception as e:
            logger.error(f"Storage delete failed: {str(e)}")
            return False


storage_service = StorageService()
