import importlib.util
import json
import tempfile
import unittest
from pathlib import Path


SCRIPT_PATH = Path(__file__).with_name("generate-formats.py")
SPEC = importlib.util.spec_from_file_location("generate_formats", SCRIPT_PATH)
MODULE = importlib.util.module_from_spec(SPEC)
assert SPEC.loader is not None
SPEC.loader.exec_module(MODULE)

REPO_ROOT = Path(__file__).resolve().parents[2]
SOURCE_SLUG = "fundamentos-de-radiologia-everton-costa-pinto"
CONCEPTS_PATH = REPO_ROOT / "conteúdo" / "conceitos" / SOURCE_SLUG / "concepts.json"


class GenerateFormatsTests(unittest.TestCase):
    def test_microlesson_and_quiz_bundles_are_deterministic(self):
        concepts = json.loads(CONCEPTS_PATH.read_text(encoding="utf-8"))["concepts"]
        first = concepts[0]
        second = concepts[1]

        excerpt_lookup = {
            "excerpt:a": {"pageStart": 10, "pageEnd": 11},
            "excerpt:b": {"pageStart": 12, "pageEnd": 13},
        }

        microlesson = MODULE.build_microlesson_bundle(
            {"id": "source:test", "slug": SOURCE_SLUG},
            {
                **first,
                "sourceExcerptIds": ["excerpt:a", "excerpt:b"],
            },
            excerpt_lookup,
        )
        quiz = MODULE.build_quiz_bundle(
            {"id": "source:test", "slug": SOURCE_SLUG},
            {
                **first,
                "sourceExcerptIds": ["excerpt:a", "excerpt:b"],
            },
            concepts,
            excerpt_lookup,
        )

        self.assertEqual(microlesson["formatType"], "microlições")
        self.assertEqual(quiz["formatType"], "quizzes")
        self.assertEqual(microlesson["conceptIds"], [first["id"]])
        self.assertEqual(quiz["conceptIds"], [first["id"]])
        self.assertEqual(microlesson["sourceExcerptIds"], ["excerpt:a", "excerpt:b"])
        self.assertEqual(len(microlesson["payload"]["blocks"]), 4)
        self.assertEqual(len(quiz["payload"]["questions"]), 2)
        self.assertEqual(len(quiz["payload"]["questions"][0]["choices"]), 4)

    def test_generate_formats_writes_pilot_bundles(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            result = MODULE.generate_format_layer(
                SOURCE_SLUG,
                REPO_ROOT,
                Path(temp_dir),
                update_index=False,
            )

            micro_root = Path(temp_dir) / "microlições" / SOURCE_SLUG
            quiz_root = Path(temp_dir) / "quizzes" / SOURCE_SLUG
            self.assertTrue((micro_root / "bundles.json").exists())
            self.assertTrue((micro_root / "format-job.json").exists())
            self.assertTrue((quiz_root / "bundles.json").exists())
            self.assertTrue((quiz_root / "format-job.json").exists())

            micro_bundle = json.loads((micro_root / "bundles.json").read_text(encoding="utf-8"))
            quiz_bundle = json.loads((quiz_root / "bundles.json").read_text(encoding="utf-8"))
            micro_job = json.loads((micro_root / "format-job.json").read_text(encoding="utf-8"))
            quiz_job = json.loads((quiz_root / "format-job.json").read_text(encoding="utf-8"))

            self.assertEqual(micro_bundle["bundleCount"], 16)
            self.assertEqual(quiz_bundle["bundleCount"], 16)
            self.assertEqual(micro_bundle["needsReviewCount"], 7)
            self.assertEqual(quiz_bundle["needsReviewCount"], 7)
            self.assertEqual(micro_job["status"], "generated")
            self.assertEqual(quiz_job["status"], "generated")
            self.assertEqual(result["formatSummary"]["microlições"]["bundleCount"], 16)
            self.assertEqual(result["formatSummary"]["quizzes"]["bundleCount"], 16)
            self.assertTrue(any(bundle["reviewStatus"] == "needs-review" for bundle in micro_bundle["bundles"]))
            self.assertTrue(any(bundle["reviewStatus"] == "needs-review" for bundle in quiz_bundle["bundles"]))


if __name__ == "__main__":
    unittest.main()
