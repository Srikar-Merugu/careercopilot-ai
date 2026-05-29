import logging
import pickle
import os
import tempfile
from typing import List, Optional, Dict, Any, Tuple
from uuid import UUID
import numpy as np

logger = logging.getLogger(__name__)


class FAISSSearchResult:
    def __init__(self, id: str, score: float, metadata: Optional[Dict[str, Any]] = None):
        self.id = id
        self.score = score
        self.metadata = metadata or {}


class VectorSearchService:
    def __init__(self, dimension: int = 1536):
        self.dimension = dimension
        self._index = None
        self._id_map: Dict[int, str] = {}
        self._metadata_map: Dict[str, Dict[str, Any]] = {}
        self._next_id = 0
        self._initialized = False

    def initialize(self, dimension: Optional[int] = None):
        if dimension:
            self.dimension = dimension
        try:
            import faiss
            self._index = faiss.IndexFlatIP(self.dimension)
            self._initialized = True
            logger.info(f"FAISS index initialized with dimension {self.dimension}")
        except ImportError:
            logger.warning("FAISS not installed, using brute-force numpy search")
            self._index = None
            self._initialized = True

    def add_vectors(
        self,
        vectors: List[List[float]],
        ids: List[str],
        metadata_list: Optional[List[Optional[Dict[str, Any]]]] = None
    ) -> List[int]:
        if not self._initialized:
            self.initialize()

        if metadata_list is None:
            metadata_list = [None] * len(vectors)

        internal_ids = []

        if self._index is not None:
            import faiss
            matrix = np.array(vectors).astype(np.float32)
            faiss.normalize_L2(matrix)
            self._index.add(matrix)
            for i in range(len(vectors)):
                internal_id = self._next_id
                self._id_map[internal_id] = ids[i]
                self._metadata_map[ids[i]] = metadata_list[i] or {}
                internal_ids.append(internal_id)
                self._next_id += 1
        else:
            for i in range(len(vectors)):
                internal_id = self._next_id
                self._id_map[internal_id] = ids[i]
                self._metadata_map[ids[i]] = metadata_list[i] or {}
                internal_ids.append(internal_id)
                self._next_id += 1

        logger.debug(f"Added {len(vectors)} vectors. Total: {self._next_id}")
        return internal_ids

    def search(
        self,
        query_vector: List[float],
        k: int = 10,
        filter_type: Optional[str] = None
    ) -> List[FAISSSearchResult]:
        if not self._initialized:
            self.initialize()

        if self._next_id == 0:
            return []

        query_np = np.array([query_vector]).astype(np.float32)

        if self._index is not None:
            import faiss
            faiss.normalize_L2(query_np)
            scores, indices = self._index.search(query_np, min(k, self._next_id))
            results = []
            for score, idx in zip(scores[0], indices[0]):
                if idx == -1:
                    continue
                vid = self._id_map.get(int(idx), "")
                meta = self._metadata_map.get(vid, {})
                if filter_type and meta.get("embedding_type") != filter_type:
                    continue
                results.append(FAISSSearchResult(
                    id=vid,
                    score=float(score),
                    metadata=meta
                ))
            return results
        else:
            all_vectors = []
            all_ids = []
            for internal_id in range(self._next_id):
                vid = self._id_map.get(internal_id)
                all_ids.append(vid)
            similarities = []
            for internal_id in range(self._next_id):
                vec = self._get_vector(internal_id)
                if vec is not None:
                    sim = self._cosine_similarity(query_np[0], np.array(vec))
                    similarities.append(sim)
                else:
                    similarities.append(-1.0)
            top_indices = np.argsort(similarities)[::-1][:k]
            results = []
            for idx in top_indices:
                if similarities[idx] < 0:
                    continue
                vid = all_ids[idx]
                meta = self._metadata_map.get(vid, {})
                if filter_type and meta.get("embedding_type") != filter_type:
                    continue
                results.append(FAISSSearchResult(
                    id=vid,
                    score=float(similarities[idx]),
                    metadata=meta
                ))
            return results

    def _get_vector(self, internal_id: int) -> Optional[np.ndarray]:
        vid = self._id_map.get(internal_id)
        if vid and vid in self._metadata_map:
            return self._metadata_map[vid].get("_vector")
        return None

    def _cosine_similarity(self, a: np.ndarray, b: np.ndarray) -> float:
        norm_a = np.linalg.norm(a)
        norm_b = np.linalg.norm(b)
        if norm_a == 0 or norm_b == 0:
            return 0.0
        return float(np.dot(a, b) / (norm_a * norm_b))

    def remove_vectors(self, ids: List[str]):
        for vid in ids:
            for internal_id, mapped_id in list(self._id_map.items()):
                if mapped_id == vid:
                    del self._id_map[internal_id]
                    if vid in self._metadata_map:
                        del self._metadata_map[vid]
                    break

    def get_vector_count(self) -> int:
        return self._next_id

    def save_index(self, path: str):
        if self._index is not None:
            import faiss
            faiss.write_index(self._index, path)
        index_data = {
            "id_map": self._id_map,
            "metadata_map": self._metadata_map,
            "next_id": self._next_id,
            "dimension": self.dimension
        }
        meta_path = path + ".meta"
        with open(meta_path, "wb") as f:
            pickle.dump(index_data, f)
        logger.info(f"Index saved to {path}")

    def load_index(self, path: str):
        meta_path = path + ".meta"
        if os.path.exists(meta_path):
            with open(meta_path, "rb") as f:
                index_data = pickle.load(f)
            self._id_map = index_data["id_map"]
            self._metadata_map = index_data["metadata_map"]
            self._next_id = index_data["next_id"]
            self.dimension = index_data["dimension"]
        if os.path.exists(path):
            import faiss
            self._index = faiss.read_index(path)
        self._initialized = True
        logger.info(f"Index loaded from {path}")

    def clear(self):
        self._index = None
        self._id_map = {}
        self._metadata_map = {}
        self._next_id = 0
        self._initialized = False


vector_search_service = VectorSearchService()
