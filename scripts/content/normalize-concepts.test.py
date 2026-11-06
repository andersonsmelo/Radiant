import importlib.util
import json
import tempfile
import unittest
from pathlib import Path

SPEC = importlib.util.spec_from_file_location("normalizer", Path(__file__).with_name("normalize-concepts.py"))
MODULE = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(MODULE)

class NormalizeConceptsTests(unittest.TestCase):
    def test_slugify(self):
        self.assertEqual(MODULE.slugify("Cubos e círculos"), "cubos-e-circulos")

    def test_explicit_specs_required(self):
        with self.assertRaisesRegex(ValueError, "Explicit non-empty"):
            MODULE.normalize_concepts("synthetic", Path("unused"), Path("unused"))

    def test_provenance_coverage_determinism_and_duplicate_rejection(self):
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)
            def write(name, data):
                file = root / "conteúdo" / name
                file.parent.mkdir(parents=True, exist_ok=True)
                file.write_text(json.dumps(data))
            excerpts = [{"id": f"excerpt:{i}", "sourceSlug": "synthetic", "pageStart": i, "pageEnd": i, "text": f"Forma abstrata {i}"} for i in [1, 2]]
            classifications = [{"id": f"classification:{i}", "sourceExcerptId": f"excerpt:{i}", "sourceSlug": "synthetic", "confidence": 0.8, "reviewStatus": "approved" if i == 1 else "needs-review"} for i in [1, 2]]
            write("fontes/index.json", {"sources": [{"id": "source:synthetic", "slug": "synthetic"}]})
            write("classificação/index.json", {"jobs": [{"sourceSlug": "synthetic", "status": "classified"}]})
            write("extrações/synthetic/excerpts.json", {"excerpts": excerpts})
            write("classificação/synthetic/classifications.json", {"classifications": classifications})
            specs = [{"title": f"Forma {i}", "slug": f"forma-{i}", "pageRanges": [[i, i]], "galaxyId": "g", "planetId": "p", "starId": "s", "definition": f"Descrição sintética {i}"} for i in [1, 2]]
            first = MODULE.normalize_concepts("synthetic", root, root / "out", False, specs)
            second = MODULE.normalize_concepts("synthetic", root, root / "out-2", False, specs)
            self.assertEqual(first, second)
            self.assertEqual(first["bundle"]["conceptCount"], 2)
            self.assertEqual(first["bundle"]["needsReviewCount"], 1)
            self.assertEqual({x for c in first["bundle"]["concepts"] for x in c["sourceExcerptIds"]}, {"excerpt:1", "excerpt:2"})
            with self.assertRaisesRegex(ValueError, "Duplicate excerpt"):
                MODULE.normalize_concepts("synthetic", root, root / "invalid", False, specs + [specs[0]])
            with self.assertRaisesRegex(ValueError, "coverage mismatch"):
                MODULE.normalize_concepts("synthetic", root, root / "invalid", False, specs[:1])

if __name__ == "__main__":
    unittest.main()
