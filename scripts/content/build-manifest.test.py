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


CATALOGO = {
    "schemaVersion": 1,
    "sources": [
        {
            "id": "library-source:autorizada",
            "primaryPath": "Conteúdo/Fonte-Autorizada.pdf",
            "rightsClass": "authorized",
            "commercialUse": False,
        },
        {
            "id": "library-source:bloqueada",
            "primaryPath": "Conteúdo/Fonte-Bloqueada.pdf",
            "rightsClass": "blocked",
            "commercialUse": False,
        },
    ],
}


def slug_simples(nome):
    return nome.rsplit(".", 1)[0].lower().replace("-", "-")


class FiltroDeDireitosTest(unittest.TestCase):
    def setUp(self):
        self.direitos = MODULE.rights_by_slug(CATALOGO, slug_simples)
        self.autorizado = dict(EXCERPT, id="excerpt:a:p1:c1", sourceSlug="fonte-autorizada")
        self.bloqueado = dict(EXCERPT, id="excerpt:b:p1:c1", sourceSlug="fonte-bloqueada")
        self.orfao = dict(EXCERPT, id="excerpt:o:p1:c1", sourceSlug="fonte-que-nao-esta-no-catalogo")

    def test_fonte_bloqueada_nao_gera_linha(self):
        linhas, _ = MODULE.partition_excerpts([self.autorizado, self.bloqueado], self.direitos)
        self.assertEqual([l["id"] for l in linhas], ["excerpt:a:p1:c1"])

    def test_descarte_nomeia_a_fonte_e_o_motivo(self):
        _, descartes = MODULE.partition_excerpts([self.bloqueado], self.direitos)
        self.assertEqual(len(descartes), 1)
        self.assertEqual(descartes[0]["sourceId"], "library-source:bloqueada")
        self.assertEqual(descartes[0]["rightsClass"], "blocked")
        self.assertIn("nao autorizada", descartes[0]["motivo"])

    def test_fonte_ausente_do_catalogo_e_descarte_com_motivo_proprio(self):
        linhas, descartes = MODULE.partition_excerpts([self.orfao], self.direitos)
        self.assertEqual(linhas, [])
        self.assertIn("ausente do catalogo", descartes[0]["motivo"])

    def test_a_linha_aceita_carrega_a_classe_da_fonte(self):
        linhas, _ = MODULE.partition_excerpts([self.autorizado], self.direitos)
        self.assertEqual(linhas[0]["rightsClass"], "authorized")


if __name__ == "__main__":
    unittest.main()
