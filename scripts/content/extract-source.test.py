import importlib.util
import unittest
from pathlib import Path


SCRIPT_PATH = Path(__file__).with_name("extract-source.py")
SPEC = importlib.util.spec_from_file_location("extract_source", SCRIPT_PATH)
MODULE = importlib.util.module_from_spec(SPEC)
assert SPEC.loader is not None
SPEC.loader.exec_module(MODULE)


class ExtractSourceTests(unittest.TestCase):
    def test_slug_is_normalized_for_pilot_source(self):
        slug = MODULE.normalize_source_slug(
            "02.-Fundamentos-de-radiologia-Autor-Everton-Costa-Pinto.pdf"
        )
        self.assertEqual(slug, "fundamentos-de-radiologia-everton-costa-pinto")

    def test_chunker_splits_text_into_bounded_excerpts(self):
        text = " ".join(["radiologia"] * 1200)
        chunks = MODULE.chunk_text(text, max_chars=500)
        self.assertGreaterEqual(len(chunks), 2)
        self.assertTrue(all(len(chunk) <= 500 for chunk in chunks))

    def test_extract_pages_from_pilot_pdf(self):
        source_path = Path(
            "conteúdo/02.-Fundamentos-de-radiologia-Autor-Everton-Costa-Pinto.pdf"
        )
        pages = MODULE.extract_pages(source_path)
        self.assertGreater(len(pages), 10)
        self.assertEqual(pages[0]["pageNumber"], 1)
        self.assertIn("FUNDAMENTOS DE RADIOLOGIA", pages[0]["text"].upper())


if __name__ == "__main__":
    unittest.main()
