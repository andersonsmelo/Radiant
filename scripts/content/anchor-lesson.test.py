import contextlib
import importlib.util
import io
import json
import sys
import tempfile
import unittest
from pathlib import Path
from unittest import mock

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


class MainDoRunnerTest(unittest.TestCase):
    """O codigo de saida do processo e a unica superficie pela qual o gate
    decide, e ate 2026-08-07 nenhum teste o media: trocar o retorno de `main`
    por `return 0` fixo deixava os 11 testes desta suite VERDES. Cobertura de
    funcao pura nao se propaga para o invólucro que a chama."""

    def arvore(self, manifesto, claims):
        raiz = Path(tempfile.mkdtemp(prefix="ancoragem-"))
        (raiz / "manifest.jsonl").write_text(
            "".join(json.dumps(linha, ensure_ascii=False) + "\n" for linha in manifesto),
            encoding="utf-8",
        )
        (raiz / "claims.json").write_text(
            json.dumps({"lessonId": "ai-lesson:x", "claims": claims}, ensure_ascii=False),
            encoding="utf-8",
        )
        return raiz

    def rodar(self, raiz):
        argv = [
            "anchor-lesson.py",
            "--claims",
            str(raiz / "claims.json"),
            "--manifest",
            str(raiz / "manifest.jsonl"),
            "--out",
            str(raiz / "saida.json"),
        ]
        with mock.patch.object(sys, "argv", argv), contextlib.redirect_stdout(io.StringIO()):
            return MODULE.main()

    def test_main_devolve_0_quando_toda_claim_esta_ancorada(self):
        raiz = self.arvore(
            [{"id": "excerpt:a:p1:c1", "hash": "h1", "rightsClass": "authorized"}],
            [{"id": "claim:1", "claim": "x", "excerptId": "excerpt:a:p1:c1"}],
        )
        self.assertEqual(self.rodar(raiz), 0)

    def test_main_devolve_1_quando_alguma_claim_fica_sem_ancora(self):
        raiz = self.arvore(
            [{"id": "excerpt:a:p1:c1", "hash": "h1", "rightsClass": "authorized"}],
            [{"id": "claim:1", "claim": "x", "excerptId": "excerpt:fantasma:p9:c9"}],
        )
        self.assertEqual(self.rodar(raiz), 1)

    def test_main_carimba_no_arquivo_o_hash_vigente_do_manifesto(self):
        # A fiacao load_allowed -> resolve_anchors so e exercitada aqui. Os casos
        # de ResolveAnchorsTest injetam `allowed` como literal e nunca chamam
        # load_allowed, e foi por isso que neutralizar load_allowed derrubou um
        # teste em vez dos dois que o plano previa.
        raiz = self.arvore(
            [{"id": "excerpt:a:p1:c1", "hash": "h1", "rightsClass": "authorized"}],
            [{"id": "claim:1", "claim": "x", "excerptId": "excerpt:a:p1:c1"}],
        )
        self.rodar(raiz)
        saida = json.loads((raiz / "saida.json").read_text(encoding="utf-8"))
        self.assertEqual(saida["lessonId"], "ai-lesson:x")
        self.assertEqual(saida["claims"][0]["hash"], "h1")
        self.assertEqual(saida["unanchored"], 0)


if __name__ == "__main__":
    unittest.main()
