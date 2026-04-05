import importlib.util
import json
import tempfile
import unittest
from pathlib import Path

SCRIPT_PATH = Path(__file__).with_name("ai-generate-formats.py")
SPEC = importlib.util.spec_from_file_location("ai_generate_formats", SCRIPT_PATH)
MODULE = importlib.util.module_from_spec(SPEC)
assert SPEC.loader is not None
SPEC.loader.exec_module(MODULE)

SAMPLE_CONCEPT = {
    "id": "concept:test-source:radiopacidade",
    "sourceId": "source:test-source",
    "sourceSlug": "test-source",
    "slug": "radiopacidade",
    "title": "Radiopacidade",
    "definition": "Grau de absorção dos raios X por diferentes estruturas do corpo.",
    "galaxyId": "galaxy-fisica",
    "planetId": "planet-radiopacidade",
    "starId": "star-principios-basicos",
    "sourceExcerptIds": ["excerpt:test-source:p1:c1"],
}


class BuildPromptTests(unittest.TestCase):
    def test_replaces_title_placeholder(self):
        template = "Conceito: {{title}}"
        result = MODULE.build_prompt(template, SAMPLE_CONCEPT)
        self.assertIn("Radiopacidade", result)
        self.assertNotIn("{{title}}", result)

    def test_replaces_definition_placeholder(self):
        template = "Def: {{definition}}"
        result = MODULE.build_prompt(template, SAMPLE_CONCEPT)
        self.assertIn("Grau de absorção", result)
        self.assertNotIn("{{definition}}", result)

    def test_replaces_all_taxonomy_placeholders(self):
        template = "{{galaxyId}} {{planetId}} {{starId}}"
        result = MODULE.build_prompt(template, SAMPLE_CONCEPT)
        self.assertNotIn("{{galaxyId}}", result)
        self.assertNotIn("{{planetId}}", result)
        self.assertNotIn("{{starId}}", result)


class BuildAiBundleTests(unittest.TestCase):
    def test_bundle_has_required_fields(self):
        ai_content = {"explanation": "test", "example": "ex", "keyPoints": []}
        bundle = MODULE.build_ai_bundle("microlições", SAMPLE_CONCEPT, ai_content)
        required = {"id", "formatType", "generationStrategy", "title", "sourceId",
                    "conceptIds", "sourceExcerptIds", "reviewStatus", "qualityScore", "aiContent"}
        for field in required:
            self.assertIn(field, bundle, f"Missing field: {field}")

    def test_bundle_id_contains_ai_suffix(self):
        ai_content = {"explanation": "test"}
        bundle = MODULE.build_ai_bundle("quizzes", SAMPLE_CONCEPT, ai_content)
        self.assertTrue(bundle["id"].endswith(":ai"))

    def test_bundle_review_status_is_pending(self):
        ai_content = {}
        bundle = MODULE.build_ai_bundle("microlições", SAMPLE_CONCEPT, ai_content)
        self.assertEqual(bundle["reviewStatus"], "pending")

    def test_bundle_quality_score_is_none(self):
        ai_content = {}
        bundle = MODULE.build_ai_bundle("microlições", SAMPLE_CONCEPT, ai_content)
        self.assertIsNone(bundle["qualityScore"])


class IsGeneratedTests(unittest.TestCase):
    def test_returns_false_when_file_missing(self):
        with tempfile.TemporaryDirectory() as tmpdir:
            formats_root = Path(tmpdir)
            result = MODULE.is_generated("microlições", SAMPLE_CONCEPT, formats_root)
        self.assertFalse(result)

    def test_returns_false_when_bundle_id_absent(self):
        with tempfile.TemporaryDirectory() as tmpdir:
            formats_root = Path(tmpdir)
            path = formats_root / "microlições" / "test-source"
            path.mkdir(parents=True)
            (path / "ai-bundles.json").write_text(
                json.dumps({"version": 1, "bundles": []}), encoding="utf-8"
            )
            result = MODULE.is_generated("microlições", SAMPLE_CONCEPT, formats_root)
        self.assertFalse(result)

    def test_returns_true_when_bundle_id_present(self):
        with tempfile.TemporaryDirectory() as tmpdir:
            formats_root = Path(tmpdir)
            path = formats_root / "microlições" / "test-source"
            path.mkdir(parents=True)
            bundle_id = "format:microlições:test-source:radiopacidade:ai"
            (path / "ai-bundles.json").write_text(
                json.dumps({"version": 1, "bundles": [{"id": bundle_id}]}), encoding="utf-8"
            )
            result = MODULE.is_generated("microlições", SAMPLE_CONCEPT, formats_root)
        self.assertTrue(result)


class AppendBundleTests(unittest.TestCase):
    def test_creates_file_if_missing(self):
        with tempfile.TemporaryDirectory() as tmpdir:
            formats_root = Path(tmpdir)
            bundle = {"id": "format:microlições:test-source:foo:ai", "formatType": "microlições"}
            MODULE.append_bundle("microlições", "test-source", bundle, formats_root)
            path = formats_root / "microlições" / "test-source" / "ai-bundles.json"
            self.assertTrue(path.exists())

    def test_appends_to_existing_file(self):
        with tempfile.TemporaryDirectory() as tmpdir:
            formats_root = Path(tmpdir)
            path = formats_root / "microlições" / "test-source"
            path.mkdir(parents=True)
            (path / "ai-bundles.json").write_text(
                json.dumps({"version": 1, "generationStrategy": "ai-split-v1", "bundles": []}),
                encoding="utf-8",
            )
            bundle = {"id": "format:microlições:test-source:foo:ai"}
            MODULE.append_bundle("microlições", "test-source", bundle, formats_root)
            data = json.loads((path / "ai-bundles.json").read_text(encoding="utf-8"))
            self.assertEqual(len(data["bundles"]), 1)


if __name__ == "__main__":
    unittest.main()
