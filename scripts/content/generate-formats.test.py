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
    def test_format_bundles_are_deterministic(self):
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
        review = MODULE.build_review_bundle(
            {"id": "source:test", "slug": SOURCE_SLUG},
            {
                **first,
                "sourceExcerptIds": ["excerpt:a", "excerpt:b"],
            },
            excerpt_lookup,
        )
        case = MODULE.build_case_bundle(
            {"id": "source:test", "slug": SOURCE_SLUG},
            {
                **first,
                "sourceExcerptIds": ["excerpt:a", "excerpt:b"],
            },
            excerpt_lookup,
        )
        checkpoint = MODULE.build_checkpoint_bundle(
            {"id": "source:test", "slug": SOURCE_SLUG},
            {
                **first,
                "sourceExcerptIds": ["excerpt:a", "excerpt:b"],
            },
            excerpt_lookup,
        )
        reward = MODULE.build_reward_bundle(
            {"id": "source:test", "slug": SOURCE_SLUG},
            {
                **first,
                "sourceExcerptIds": ["excerpt:a", "excerpt:b"],
            },
            excerpt_lookup,
        )

        self.assertEqual(microlesson["formatType"], "microlições")
        self.assertEqual(quiz["formatType"], "quizzes")
        self.assertEqual(review["formatType"], "reviews")
        self.assertEqual(case["formatType"], "casos")
        self.assertEqual(checkpoint["formatType"], "checkpoints")
        self.assertEqual(reward["formatType"], "rewards")
        self.assertEqual(microlesson["conceptIds"], [first["id"]])
        self.assertEqual(quiz["conceptIds"], [first["id"]])
        self.assertEqual(review["conceptIds"], [first["id"]])
        self.assertEqual(case["conceptIds"], [first["id"]])
        self.assertEqual(checkpoint["conceptIds"], [first["id"]])
        self.assertEqual(reward["conceptIds"], [first["id"]])
        self.assertEqual(microlesson["sourceExcerptIds"], ["excerpt:a", "excerpt:b"])
        self.assertEqual(len(microlesson["payload"]["blocks"]), 4)
        self.assertEqual(len(quiz["payload"]["questions"]), 2)
        self.assertEqual(len(quiz["payload"]["questions"][0]["choices"]), 4)
        self.assertEqual(len(review["payload"]["blocks"]), 4)
        self.assertEqual(len(case["payload"]["blocks"]), 4)
        self.assertEqual(len(checkpoint["payload"]["blocks"]), 4)
        self.assertEqual(len(reward["payload"]["blocks"]), 4)
        self.assertEqual(review["payload"]["blocks"][0]["type"], "prompt")
        self.assertEqual(case["payload"]["blocks"][0]["type"], "case")
        self.assertEqual(checkpoint["payload"]["blocks"][0]["type"], "checkpoint")
        self.assertEqual(reward["payload"]["blocks"][0]["type"], "reward")
        self.assertEqual(review["payload"]["keySignals"], review["payload"]["blocks"][2]["bullets"])
        self.assertEqual(case["payload"]["keySignals"], MODULE.collect_dominant_signals({**first, "sourceExcerptIds": ["excerpt:a", "excerpt:b"]})[:3])
        self.assertEqual(checkpoint["payload"]["keySignals"], checkpoint["payload"]["blocks"][2]["bullets"])
        self.assertEqual(checkpoint["payload"]["completionCriteria"], checkpoint["payload"]["blocks"][1]["bullets"])
        self.assertEqual(reward["payload"]["rewardLabel"], reward["payload"]["blocks"][0]["text"])
        self.assertEqual(reward["payload"]["nextStep"], reward["payload"]["blocks"][2]["text"])

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
            review_root = Path(temp_dir) / "reviews" / SOURCE_SLUG
            case_root = Path(temp_dir) / "casos" / SOURCE_SLUG
            checkpoint_root = Path(temp_dir) / "checkpoints" / SOURCE_SLUG
            reward_root = Path(temp_dir) / "rewards" / SOURCE_SLUG
            self.assertTrue((micro_root / "bundles.json").exists())
            self.assertTrue((micro_root / "format-job.json").exists())
            self.assertTrue((quiz_root / "bundles.json").exists())
            self.assertTrue((quiz_root / "format-job.json").exists())
            self.assertTrue((review_root / "bundles.json").exists())
            self.assertTrue((review_root / "format-job.json").exists())
            self.assertTrue((case_root / "bundles.json").exists())
            self.assertTrue((case_root / "format-job.json").exists())
            self.assertTrue((checkpoint_root / "bundles.json").exists())
            self.assertTrue((checkpoint_root / "format-job.json").exists())
            self.assertTrue((reward_root / "bundles.json").exists())
            self.assertTrue((reward_root / "format-job.json").exists())

            micro_bundle = json.loads((micro_root / "bundles.json").read_text(encoding="utf-8"))
            quiz_bundle = json.loads((quiz_root / "bundles.json").read_text(encoding="utf-8"))
            review_bundle = json.loads((review_root / "bundles.json").read_text(encoding="utf-8"))
            case_bundle = json.loads((case_root / "bundles.json").read_text(encoding="utf-8"))
            checkpoint_bundle = json.loads((checkpoint_root / "bundles.json").read_text(encoding="utf-8"))
            reward_bundle = json.loads((reward_root / "bundles.json").read_text(encoding="utf-8"))
            micro_job = json.loads((micro_root / "format-job.json").read_text(encoding="utf-8"))
            quiz_job = json.loads((quiz_root / "format-job.json").read_text(encoding="utf-8"))
            review_job = json.loads((review_root / "format-job.json").read_text(encoding="utf-8"))
            case_job = json.loads((case_root / "format-job.json").read_text(encoding="utf-8"))
            checkpoint_job = json.loads((checkpoint_root / "format-job.json").read_text(encoding="utf-8"))
            reward_job = json.loads((reward_root / "format-job.json").read_text(encoding="utf-8"))

            self.assertEqual(micro_bundle["bundleCount"], 16)
            self.assertEqual(quiz_bundle["bundleCount"], 16)
            self.assertEqual(review_bundle["bundleCount"], 16)
            self.assertEqual(case_bundle["bundleCount"], 16)
            self.assertEqual(checkpoint_bundle["bundleCount"], 16)
            self.assertEqual(reward_bundle["bundleCount"], 16)
            self.assertEqual(micro_bundle["needsReviewCount"], 7)
            self.assertEqual(quiz_bundle["needsReviewCount"], 7)
            self.assertEqual(review_bundle["needsReviewCount"], 7)
            self.assertEqual(case_bundle["needsReviewCount"], 7)
            self.assertEqual(checkpoint_bundle["needsReviewCount"], 7)
            self.assertEqual(reward_bundle["needsReviewCount"], 7)
            self.assertEqual(micro_job["status"], "generated")
            self.assertEqual(quiz_job["status"], "generated")
            self.assertEqual(review_job["status"], "generated")
            self.assertEqual(case_job["status"], "generated")
            self.assertEqual(checkpoint_job["status"], "generated")
            self.assertEqual(reward_job["status"], "generated")
            self.assertEqual(result["formatSummary"]["microlições"]["bundleCount"], 16)
            self.assertEqual(result["formatSummary"]["quizzes"]["bundleCount"], 16)
            self.assertEqual(result["formatSummary"]["reviews"]["bundleCount"], 16)
            self.assertEqual(result["formatSummary"]["casos"]["bundleCount"], 16)
            self.assertEqual(result["formatSummary"]["checkpoints"]["bundleCount"], 16)
            self.assertEqual(result["formatSummary"]["rewards"]["bundleCount"], 16)
            self.assertTrue(any(bundle["reviewStatus"] == "needs-review" for bundle in micro_bundle["bundles"]))
            self.assertTrue(any(bundle["reviewStatus"] == "needs-review" for bundle in quiz_bundle["bundles"]))
            self.assertTrue(any(bundle["reviewStatus"] == "needs-review" for bundle in review_bundle["bundles"]))
            self.assertTrue(any(bundle["reviewStatus"] == "needs-review" for bundle in case_bundle["bundles"]))
            self.assertTrue(any(bundle["reviewStatus"] == "needs-review" for bundle in checkpoint_bundle["bundles"]))
            self.assertTrue(any(bundle["reviewStatus"] == "needs-review" for bundle in reward_bundle["bundles"]))


if __name__ == "__main__":
    unittest.main()
