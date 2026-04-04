import importlib.util
import json
import tempfile
import unittest
from pathlib import Path


SCRIPT_PATH = Path(__file__).with_name("normalize-concepts.py")
SPEC = importlib.util.spec_from_file_location("normalize_concepts", SCRIPT_PATH)
MODULE = importlib.util.module_from_spec(SPEC)
assert SPEC.loader is not None
SPEC.loader.exec_module(MODULE)

REPO_ROOT = Path(__file__).resolve().parents[2]
SOURCE_SLUG = "fundamentos-de-radiologia-everton-costa-pinto"
EXCERPTS_PATH = REPO_ROOT / "conteúdo" / "extrações" / SOURCE_SLUG / "excerpts.json"


class NormalizeConceptsTests(unittest.TestCase):
    def test_slugify_normalizes_accents_and_spacing(self):
        self.assertEqual(
            MODULE.slugify("Ressonância magnética e qualidade"),
            "ressonancia-magnetica-e-qualidade",
        )

    def test_normalize_source_concepts_writes_pilot_bundle(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            result = MODULE.normalize_concepts(
                SOURCE_SLUG,
                REPO_ROOT,
                Path(temp_dir) / SOURCE_SLUG,
                update_index=False,
            )

            bundle_path = Path(temp_dir) / SOURCE_SLUG / "concepts.json"
            job_path = Path(temp_dir) / SOURCE_SLUG / "concept-job.json"
            self.assertTrue(bundle_path.exists())
            self.assertTrue(job_path.exists())

            bundle = json.loads(bundle_path.read_text(encoding="utf-8"))
            job = json.loads(job_path.read_text(encoding="utf-8"))
            excerpts = json.loads(EXCERPTS_PATH.read_text(encoding="utf-8"))["excerpts"]

            self.assertEqual(bundle["sourceSlug"], SOURCE_SLUG)
            self.assertEqual(bundle["conceptCount"], 16)
            self.assertEqual(bundle["conceptCount"], len(bundle["concepts"]))
            self.assertEqual(len(job["reviewQueueConceptIds"]), bundle["needsReviewCount"])
            self.assertEqual(job["artifacts"]["conceptCount"], 16)
            self.assertEqual(result["bundle"]["conceptCount"], 16)
            self.assertEqual(result["job"]["status"], "normalized")

            excerpt_ids = [item["id"] for item in excerpts]
            seen_source_excerpt_ids = [source_excerpt_id for concept in bundle["concepts"] for source_excerpt_id in concept["sourceExcerptIds"]]
            self.assertEqual(sorted(seen_source_excerpt_ids), sorted(excerpt_ids))
            self.assertEqual(len(seen_source_excerpt_ids), len(set(seen_source_excerpt_ids)))

            concept_titles = [item["title"] for item in bundle["concepts"]]
            self.assertIn("Tomografia computadorizada", concept_titles)
            self.assertIn("Qualidade de imagem", concept_titles)
            self.assertTrue(any(item["reviewStatus"] == "needs-review" for item in bundle["concepts"]))
            self.assertTrue(any(item["reviewStatus"] == "approved" for item in bundle["concepts"]))


if __name__ == "__main__":
    unittest.main()
