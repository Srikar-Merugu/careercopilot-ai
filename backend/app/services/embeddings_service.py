import logging
import hashlib
from typing import List, Optional, Dict, Any
from functools import lru_cache

from backend.app.core.config import settings

logger = logging.getLogger(__name__)

class EmbeddingsService:
    def __init__(self):
        self.provider = "openai" if settings.OPENAI_API_KEY else "mock"
        self.dimensions = 1536
        self._model = None
        self._client = None
        self._cache: Dict[str, List[float]] = {}

    def _get_client(self):
        if self._client is None:
            try:
                from openai import OpenAI
                self._client = OpenAI(api_key=settings.OPENAI_API_KEY)
            except Exception as e:
                logger.warning(f"OpenAI client init failed: {e}")
                self.provider = "mock"
        return self._client

    def _get_local_model(self):
        if self._model is None and self.provider == "local":
            try:
                from sentence_transformers import SentenceTransformer
                self._model = SentenceTransformer("all-MiniLM-L6-v2")
                self.dimensions = 384
            except Exception as e:
                logger.warning(f"SentenceTransformer load failed: {e}")
                self.provider = "mock"
        return self._model

    def _cache_key(self, text: str) -> str:
        return hashlib.sha256(text.encode()).hexdigest()

    def generate_embeddings(self, texts: List[str]) -> List[List[float]]:
        results = []
        uncached_texts = []
        uncached_indices = []

        for i, text in enumerate(texts):
            key = self._cache_key(text)
            if key in self._cache:
                results.append(self._cache[key])
            else:
                results.append(None)
                uncached_texts.append(text)
                uncached_indices.append(i)

        if uncached_texts:
            if self.provider == "openai":
                new_vectors = self._generate_openai(uncached_texts)
            elif self.provider == "local":
                new_vectors = self._generate_local(uncached_texts)
            else:
                new_vectors = self._generate_mock(uncached_texts)

            for idx, vec in zip(uncached_indices, new_vectors):
                key = self._cache_key(texts[idx])
                self._cache[key] = vec
                results[idx] = vec

        return results

    def generate_embedding(self, text: str) -> List[float]:
        return self.generate_embeddings([text])[0]

    def _generate_openai(self, texts: List[str]) -> List[List[float]]:
        client = self._get_client()
        if not client:
            logger.warning("OpenAI client unavailable, falling back to mock")
            return self._generate_mock(texts)
        try:
            response = client.embeddings.create(
                model="text-embedding-3-small",
                input=texts
            )
            return [item.embedding for item in response.data]
        except Exception as e:
            logger.error(f"OpenAI embedding error: {e}")
            return self._generate_mock(texts)

    def _generate_local(self, texts: List[str]) -> List[List[float]]:
        model = self._get_local_model()
        if not model:
            logger.warning("Local model unavailable, falling back to mock")
            return self._generate_mock(texts)
        try:
            embeddings = model.encode(texts, show_progress_bar=False)
            return [emb.tolist() for emb in embeddings]
        except Exception as e:
            logger.error(f"Local embedding error: {e}")
            return self._generate_mock(texts)

    def _generate_mock(self, texts: List[str]) -> List[List[float]]:
        import random
        random.seed(42)
        return [
            [random.uniform(-1, 1) for _ in range(self.dimensions)]
            for _ in texts
        ]

    def chunk_text(self, text: str, chunk_size: int = 512, overlap: int = 50) -> List[str]:
        words = text.split()
        chunks = []
        start = 0
        while start < len(words):
            end = min(start + chunk_size, len(words))
            chunks.append(" ".join(words[start:end]))
            if end == len(words):
                break
            start = end - overlap
        return chunks

    def generate_document_embeddings(self, text: str, doc_type: str = "resume") -> Dict[str, Any]:
        chunks = self.chunk_text(text)
        chunk_embeddings = self.generate_embeddings(chunks)

        import numpy as np
        if chunk_embeddings:
            mean_embedding = np.mean(chunk_embeddings, axis=0).tolist()
        else:
            mean_embedding = [0.0] * self.dimensions

        return {
            "full_embedding": mean_embedding,
            "chunk_embeddings": chunk_embeddings,
            "chunks": chunks,
            "num_chunks": len(chunks),
            "dimensions": self.dimensions,
            "doc_type": doc_type
        }

    def clear_cache(self):
        self._cache.clear()


embeddings_service = EmbeddingsService()
