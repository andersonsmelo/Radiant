import importlib.util
import tempfile
import unittest
from pathlib import Path

SCRIPT_PATH = Path(__file__).with_name("embed-excerpts.py")
SPEC = importlib.util.spec_from_file_location("embed_excerpts", SCRIPT_PATH)
MODULE = importlib.util.module_from_spec(SPEC)
assert SPEC.loader is not None
SPEC.loader.exec_module(MODULE)

EXCERPT_ID = "excerpt:fundamentos:p12:c1"


class EmbedExcerptsTest(unittest.TestCase):
    def test_caminho_troca_dois_pontos(self):
        caminho = MODULE.embedding_path(EXCERPT_ID, Path("/tmp/x"))
        self.assertNotIn(":", caminho.name)

    def test_precisa_embutir_quando_nao_existe(self):
        with tempfile.TemporaryDirectory() as tmp:
            self.assertTrue(MODULE.needs_embedding(EXCERPT_ID, "abc", Path(tmp)))

    def test_hash_diferente_exige_reprocesso(self):
        with tempfile.TemporaryDirectory() as tmp:
            raiz = Path(tmp)
            MODULE.save_excerpt_embedding(EXCERPT_ID, "abc", [0.1, 0.2], raiz)
            self.assertFalse(MODULE.needs_embedding(EXCERPT_ID, "abc", raiz))
            self.assertTrue(MODULE.needs_embedding(EXCERPT_ID, "def", raiz))


if __name__ == "__main__":
    unittest.main()
