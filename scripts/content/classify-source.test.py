import importlib.util
import json
import tempfile
import unittest
from pathlib import Path


SCRIPT_PATH = Path(__file__).with_name("classify-source.py")
SPEC = importlib.util.spec_from_file_location("classify_source", SCRIPT_PATH)
MODULE = importlib.util.module_from_spec(SPEC)
assert SPEC.loader is not None
SPEC.loader.exec_module(MODULE)

REPO_ROOT = Path(__file__).resolve().parents[2]
SOURCE_SLUG = "fundamentos-de-radiologia-everton-costa-pinto"
EXCERPTS_PATH = REPO_ROOT / "conteúdo" / "extrações" / SOURCE_SLUG / "excerpts.json"


class ClassifySourceTests(unittest.TestCase):
    def test_classify_excerpt_prefers_physics_for_energy_content(self):
        excerpt = {
            "id": "excerpt:test-energy",
            "sourceSlug": SOURCE_SLUG,
            "pageStart": 4,
            "pageEnd": 4,
            "text": "ENERGIA. A energia pode ser definida como capacidade de realizar trabalho, com raios X, tomografia computadorizada e equipamentos de imagem.",
        }

        record = MODULE.classify_excerpt(excerpt)

        self.assertEqual(record["galaxyId"], "galaxy-fisica")
        self.assertEqual(record["planetId"], "planet-formacao-imagem")
        self.assertEqual(record["starId"], "star-artefatos-basicos")
        self.assertGreater(record["confidence"], 0.7)
        self.assertEqual(record["reviewStatus"], "approved")

    def test_classify_excerpt_fallback_uses_aligned_default_tracks(self):
        excerpt = {
            "id": "excerpt:test-fallback",
            "sourceSlug": SOURCE_SLUG,
            "pageStart": 1,
            "pageEnd": 1,
            "text": "Fundamentos de Radiologia 2017.2",
        }

        record = MODULE.classify_excerpt(excerpt, default_galaxy_id="galaxy-fisica")

        self.assertEqual(record["galaxyId"], "galaxy-fisica")
        self.assertEqual(record["planetId"], "planet-formacao-imagem")
        self.assertEqual(record["starId"], "star-artefatos-basicos")
        self.assertTrue(record["needsReview"])
        self.assertEqual(record["reviewStatus"], "needs-review")

    def test_classify_source_writes_pilot_bundle(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            result = MODULE.classify_source(
                SOURCE_SLUG,
                REPO_ROOT,
                Path(temp_dir) / SOURCE_SLUG,
                update_index=False,
            )

            bundle_path = Path(temp_dir) / SOURCE_SLUG / "classifications.json"
            job_path = Path(temp_dir) / SOURCE_SLUG / "classification-job.json"
            self.assertTrue(bundle_path.exists())
            self.assertTrue(job_path.exists())

            bundle = json.loads(bundle_path.read_text(encoding="utf-8"))
            job = json.loads(job_path.read_text(encoding="utf-8"))

            excerpts = json.loads(EXCERPTS_PATH.read_text(encoding="utf-8"))["excerpts"]
            self.assertEqual(bundle["classificationCount"], len(excerpts))
            self.assertEqual(len(bundle["classifications"]), len(excerpts))
            self.assertEqual(job["artifacts"]["classificationCount"], len(excerpts))
            self.assertEqual(result["classificationCount"], len(excerpts))
            self.assertGreater(bundle["needsReviewCount"], 0)
            self.assertTrue(any(item["reviewStatus"] == "needs-review" for item in bundle["classifications"]))
            self.assertTrue(
                all(
                    not (
                        item["planetId"] == "planet-abdomen"
                        and item["starId"] == "star-coluna"
                    )
                    for item in bundle["classifications"]
                )
            )


if __name__ == "__main__":
    unittest.main()
