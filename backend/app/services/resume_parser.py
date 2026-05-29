import io
import re
import logging
from typing import Optional
import pdfplumber
from docx import Document

logger = logging.getLogger(__name__)


class ResumeParserService:
    @staticmethod
    def parse_pdf(file_bytes: bytes) -> Optional[str]:
        try:
            text_parts = []
            with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:
                for page in pdf.pages:
                    text = page.extract_text()
                    if text:
                        text_parts.append(text)
            full_text = "\n".join(text_parts)
            return full_text.strip() if full_text else None
        except Exception as e:
            logger.error(f"PDF parsing failed: {str(e)}")
            return None

    @staticmethod
    def parse_docx(file_bytes: bytes) -> Optional[str]:
        try:
            doc = Document(io.BytesIO(file_bytes))
            text_parts = [p.text for p in doc.paragraphs if p.text.strip()]
            full_text = "\n".join(text_parts)
            return full_text.strip() if full_text else None
        except Exception as e:
            logger.error(f"DOCX parsing failed: {str(e)}")
            return None

    @classmethod
    def parse(cls, file_bytes: bytes, file_type: str) -> Optional[str]:
        if file_type == "application/pdf":
            return cls.parse_pdf(file_bytes)
        elif file_type in (
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "application/msword",
        ):
            return cls.parse_docx(file_bytes)
        else:
            logger.warning(f"Unsupported file type: {file_type}")
            return None

    @staticmethod
    def extract_email(text: str) -> Optional[str]:
        match = re.search(r"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}", text)
        return match.group(0) if match else None

    @staticmethod
    def extract_phone(text: str) -> Optional[str]:
        match = re.search(
            r"(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}",
            text,
        )
        return match.group(0) if match else None

    @staticmethod
    def extract_name(text: str) -> Optional[str]:
        lines = [line.strip() for line in text.split("\n") if line.strip()]
        if lines:
            first_line = lines[0]
            words = first_line.split()
            if 1 <= len(words) <= 4:
                return first_line
        return None


resume_parser = ResumeParserService()
