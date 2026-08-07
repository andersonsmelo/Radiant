import importlib.util
import json
import unittest
from pathlib import Path

SCRIPT_PATH = Path(__file__).with_name("anchor-lesson.py")
SPEC = importlib.util.spec_from_file_location("anchor_lesson", SCRIPT_PATH)
MODULE = importlib.util.module_from_spec(SPEC)
assert SPEC.loader is not None
SPEC.loader.exec_module(MODULE)

AUTORIZADO = "excerpt:fundamentos:p12:c1"
BLOQUEADO = "excerpt:proibida:p1:c1"


class AnchorLessonTest(unittest.TestCase):
    def test_cosseno_de_vetores_iguais_e_um(self):
        self.assertAlmostEqual(MODULE.cosine([1.0, 0.0], [1.0, 0.0]), 1.0)

    def test_escolhe_o_excerto_mais_proximo(self):
        vetores = {AUTORIZADO: [1.0, 0.0], "excerpt:outro:p1:c1": [0.0, 1.0]}
        excerto, similaridade = MODULE.best_anchor([0.9, 0.1], vetores)
        self.assertEqual(excerto, AUTORIZADO)
        self.assertGreater(similaridade, 0.9)

    def test_excerto_nao_autorizado_nunca_ancora(self):
        vetores = {BLOQUEADO: [1.0, 0.0]}
        relatorio = MODULE.anchor_report(
            [{"claim": "afirmação", "vector": [1.0, 0.0]}], vetores, allowed={}
        )
        self.assertIsNone(relatorio["claims"][0]["excerptId"])
        self.assertEqual(relatorio["unanchored"], 1)

    def test_relatorio_carrega_o_hash_do_excerto_ancorado(self):
        vetores = {AUTORIZADO: [1.0, 0.0]}
        relatorio = MODULE.anchor_report(
            [{"claim": "afirmação", "vector": [1.0, 0.0]}],
            vetores,
            allowed={AUTORIZADO: "abc"},
        )
        self.assertEqual(relatorio["claims"][0]["hash"], "abc")


class ClaimsDoPilotoTest(unittest.TestCase):
    def setUp(self):
        raiz = Path(__file__).resolve().parents[2]
        self.pasta = raiz / "content-manifest" / "lessons"
        self.manifesto = {
            json.loads(l)["id"]
            for l in (raiz / "content-manifest" / "excerpts" / "manifest.jsonl")
            .read_text(encoding="utf-8")
            .splitlines()
            if l.strip()
        }

    def test_ha_pelo_menos_um_arquivo_de_claims(self):
        self.assertTrue(sorted(self.pasta.glob("*.claims.json")))

    def test_forma_do_arquivo_de_claims(self):
        for arquivo in sorted(self.pasta.glob("*.claims.json")):
            dados = json.loads(arquivo.read_text(encoding="utf-8"))
            self.assertTrue(dados["lessonId"].startswith("ai-lesson:"))
            self.assertGreaterEqual(len(dados["claims"]), 5)
            self.assertLessEqual(len(dados["claims"]), 10)
            ids = [c["id"] for c in dados["claims"]]
            self.assertEqual(len(ids), len(set(ids)), "ids de claim repetidos")
            for c in dados["claims"]:
                self.assertTrue(c["claim"].strip())
                self.assertNotIn("hash", c, "hash e derivado; a Task 5 resolve")
                self.assertNotIn("vector", c, "o arquivo em disco nao guarda vetor")

    def test_todo_excerptId_existe_no_manifesto(self):
        for arquivo in sorted(self.pasta.glob("*.claims.json")):
            dados = json.loads(arquivo.read_text(encoding="utf-8"))
            for c in dados["claims"]:
                self.assertIn(
                    c["excerptId"],
                    self.manifesto,
                    f"{c['id']} aponta para excerto fora do manifesto",
                )


class LoadAllowedTest(unittest.TestCase):
    def test_allowed_liga_id_ao_hash_do_manifesto(self):
        linhas = [
            {"id": "excerpt:a:p1:c1", "hash": "h1", "rightsClass": "authorized"},
            {"id": "excerpt:b:p2:c1", "hash": "h2", "rightsClass": "authorized"},
        ]
        self.assertEqual(
            MODULE.load_allowed(linhas), {"excerpt:a:p1:c1": "h1", "excerpt:b:p2:c1": "h2"}
        )


class ResolveAnchorsTest(unittest.TestCase):
    def setUp(self):
        self.allowed = {"excerpt:a:p1:c1": "h1"}

    def test_carimba_o_hash_vigente_do_manifesto(self):
        claims = [{"id": "claim:1", "claim": "x", "excerptId": "excerpt:a:p1:c1"}]
        r = MODULE.resolve_anchors(claims, self.allowed)
        self.assertEqual(r["claims"][0]["hash"], "h1")
        self.assertEqual(r["claims"][0]["excerptId"], "excerpt:a:p1:c1")
        self.assertEqual(r["unanchored"], 0)

    def test_excerto_fora_do_manifesto_conta_como_nao_ancorado(self):
        claims = [{"id": "claim:1", "claim": "x", "excerptId": "excerpt:fantasma:p9:c9"}]
        r = MODULE.resolve_anchors(claims, self.allowed)
        self.assertIsNone(r["claims"][0]["hash"])
        self.assertEqual(r["unanchored"], 1)

    def test_a_saida_nao_carrega_similarity(self):
        claims = [{"id": "claim:1", "claim": "x", "excerptId": "excerpt:a:p1:c1"}]
        r = MODULE.resolve_anchors(claims, self.allowed)
        self.assertNotIn("similarity", r["claims"][0])


if __name__ == "__main__":
    unittest.main()
