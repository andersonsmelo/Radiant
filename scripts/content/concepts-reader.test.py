import importlib.util
import unittest
from pathlib import Path

SCRIPT_PATH = Path(__file__).with_name("concepts-reader.py")
SPEC = importlib.util.spec_from_file_location("concepts_reader", SCRIPT_PATH)
MODULE = importlib.util.module_from_spec(SPEC)
assert SPEC.loader is not None
SPEC.loader.exec_module(MODULE)


class ConceptsReaderTests(unittest.TestCase):
    def test_load_all_concepts_returns_list(self):
        concepts = MODULE.load_all_concepts()
        self.assertIsInstance(concepts, list)
        self.assertGreater(len(concepts), 0)

    def test_each_concept_has_required_fields(self):
        concepts = MODULE.load_all_concepts()
        required = {"id", "title", "definition", "galaxyId", "planetId", "starId"}
        for concept in concepts:
            for field in required:
                self.assertIn(
                    field, concept,
                    f"Concept {concept.get('id')} missing field '{field}'"
                )

    def test_concept_ids_are_unique(self):
        concepts = MODULE.load_all_concepts()
        ids = [c["id"] for c in concepts]
        self.assertEqual(len(ids), len(set(ids)), "Duplicate concept IDs found")


if __name__ == "__main__":
    unittest.main()
