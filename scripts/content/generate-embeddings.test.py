import importlib.util
import json
import tempfile
import unittest
from pathlib import Path

SCRIPT_PATH = Path(__file__).with_name("generate-embeddings.py")
SPEC = importlib.util.spec_from_file_location("generate_embeddings", SCRIPT_PATH)
MODULE = importlib.util.module_from_spec(SPEC)
assert SPEC.loader is not None
SPEC.loader.exec_module(MODULE)


class GenerateEmbeddingsTests(unittest.TestCase):
    def test_safe_filename_replaces_colons(self):
        concept_id = "concept:source-slug:concept-slug"
        result = MODULE.safe_filename(concept_id)
        self.assertNotIn(":", result)
        self.assertEqual(result, "concept_source-slug_concept-slug")

    def test_save_and_load_embedding_roundtrip(self):
        concept_id = "concept:test:foo"
        embedding = [0.1, 0.2, 0.3]
        with tempfile.TemporaryDirectory() as tmpdir:
            embeddings_dir = Path(tmpdir)
            MODULE.save_embedding(concept_id, embedding, embeddings_dir)
            filename = MODULE.safe_filename(concept_id) + ".json"
            saved = json.loads((embeddings_dir / filename).read_text(encoding="utf-8"))
        self.assertEqual(saved["conceptId"], concept_id)
        self.assertEqual(saved["embedding"], embedding)

    def test_is_embedded_returns_false_when_missing(self):
        with tempfile.TemporaryDirectory() as tmpdir:
            result = MODULE.is_embedded("concept:test:missing", Path(tmpdir))
        self.assertFalse(result)

    def test_is_embedded_returns_true_when_present(self):
        concept_id = "concept:test:present"
        embedding = [0.5, 0.6]
        with tempfile.TemporaryDirectory() as tmpdir:
            embeddings_dir = Path(tmpdir)
            MODULE.save_embedding(concept_id, embedding, embeddings_dir)
            result = MODULE.is_embedded(concept_id, embeddings_dir)
        self.assertTrue(result)

    def test_cosine_similarity_identical_vectors(self):
        v = [1.0, 0.0, 0.0]
        result = MODULE.cosine_similarity(v, v)
        self.assertAlmostEqual(result, 1.0, places=5)

    def test_cosine_similarity_orthogonal_vectors(self):
        v1 = [1.0, 0.0]
        v2 = [0.0, 1.0]
        result = MODULE.cosine_similarity(v1, v2)
        self.assertAlmostEqual(result, 0.0, places=5)

    def test_find_duplicate_returns_none_when_no_match(self):
        with tempfile.TemporaryDirectory() as tmpdir:
            embeddings_dir = Path(tmpdir)
            MODULE.save_embedding("concept:test:a", [1.0, 0.0], embeddings_dir)
            result = MODULE.find_duplicate([0.0, 1.0], "concept:test:b", embeddings_dir)
        self.assertIsNone(result)

    def test_find_duplicate_returns_id_when_similar(self):
        with tempfile.TemporaryDirectory() as tmpdir:
            embeddings_dir = Path(tmpdir)
            MODULE.save_embedding("concept:test:a", [1.0, 0.001], embeddings_dir)
            result = MODULE.find_duplicate([1.0, 0.0], "concept:test:b", embeddings_dir)
        self.assertEqual(result, "concept:test:a")


if __name__ == "__main__":
    unittest.main()
