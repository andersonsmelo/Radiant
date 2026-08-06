import importlib.util
import json
import tempfile
import unittest
from pathlib import Path

SCRIPT_PATH = Path(__file__).with_name("build-manifest.py")
SPEC = importlib.util.spec_from_file_location("build_manifest", SCRIPT_PATH)
MODULE = importlib.util.module_from_spec(SPEC)
assert SPEC.loader is not None
SPEC.loader.exec_module(MODULE)

EXCERPT = {
    "id": "excerpt:fundamentos:p12:c1",
    "sourceSlug": "fundamentos",
    "pageStart": 12,
    "pageEnd": 12,
    "text": "Os raios X foram descobertos em 1895.",
    "charCount": 37,
}


class BuildManifestTest(unittest.TestCase):
    def test_hash_muda_quando_o_texto_muda(self):
        primeiro = MODULE.excerpt_hash(EXCERPT["text"])
        segundo = MODULE.excerpt_hash(EXCERPT["text"] + " ")
        self.assertNotEqual(primeiro, segundo)

    def test_linha_nao_carrega_o_texto(self):
        linha = MODULE.manifest_line(EXCERPT, "authorized")
        self.assertNotIn("text", linha)
        self.assertEqual(linha["hash"], MODULE.excerpt_hash(EXCERPT["text"]))
        self.assertEqual(linha["rightsClass"], "authorized")

    def test_manifesto_sai_ordenado_por_id(self):
        outro = dict(EXCERPT, id="excerpt:fundamentos:p01:c1")
        with tempfile.TemporaryDirectory() as tmp:
            destino = Path(tmp) / "excerpts.jsonl"
            MODULE.write_manifest(
                [MODULE.manifest_line(EXCERPT, "authorized"),
                 MODULE.manifest_line(outro, "authorized")],
                destino,
            )
            ids = [json.loads(l)["id"] for l in destino.read_text().splitlines()]
        self.assertEqual(ids, sorted(ids))


if __name__ == "__main__":
    unittest.main()
