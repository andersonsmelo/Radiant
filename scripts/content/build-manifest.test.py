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
        linha = MODULE.manifest_line(EXCERPT, "authorized", ["factual-reference"])
        self.assertNotIn("text", linha)
        self.assertEqual(linha["hash"], MODULE.excerpt_hash(EXCERPT["text"]))
        self.assertEqual(linha["rightsClass"], "authorized")

    def test_manifesto_sai_ordenado_por_id(self):
        outro = dict(EXCERPT, id="excerpt:fundamentos:p01:c1")
        with tempfile.TemporaryDirectory() as tmp:
            destino = Path(tmp) / "excerpts.jsonl"
            MODULE.write_manifest(
                [MODULE.manifest_line(EXCERPT, "authorized", ["factual-reference"]),
                 MODULE.manifest_line(outro, "authorized", ["factual-reference"])],
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
            "allowedUses": ["factual-reference", "verbatim-excerpt"],
        },
        {
            "id": "library-source:bloqueada",
            "primaryPath": "Conteúdo/Fonte-Bloqueada.pdf",
            "rightsClass": "blocked",
            "commercialUse": False,
            "allowedUses": [],
        },
        # Autorizada na classe e ainda assim proibida de sustentar afirmacao.
        # A combinacao nao existe no catalogo real de hoje, e existe aqui porque
        # `rightsClass` e `allowedUses` sao eixos independentes: inferir o
        # segundo do primeiro foi exatamente o defeito que este run corrige.
        {
            "id": "library-source:so-consulta",
            "primaryPath": "Conteúdo/Fonte-So-Consulta.pdf",
            "rightsClass": "authorized",
            "commercialUse": True,
            "allowedUses": ["adaptation"],
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

    def test_a_linha_aceita_carrega_os_usos_permitidos_da_fonte(self):
        # `commercialUse` era o unico campo de direitos que o codigo carregava, e
        # ninguem a jusante o lia. `allowedUses` e o que decide o que pode ser
        # feito com o excerto, entao e ele que viaja com a linha.
        linhas, _ = MODULE.partition_excerpts([self.autorizado], self.direitos)
        self.assertEqual(linhas[0]["allowedUses"], ["factual-reference", "verbatim-excerpt"])

    def test_fonte_sem_referencia_factual_nao_gera_linha(self):
        so_consulta = dict(EXCERPT, id="excerpt:s:p1:c1", sourceSlug="fonte-so-consulta")
        linhas, descartes = MODULE.partition_excerpts([so_consulta], self.direitos)
        self.assertEqual(linhas, [])
        self.assertEqual(descartes[0]["rightsClass"], "authorized")
        self.assertIn("referencia factual", descartes[0]["motivo"])

    def test_o_descarte_por_uso_nomeia_causa_diferente_do_descarte_por_classe(self):
        # Os tres motivos precisam ser distinguiveis: um teste que casasse a
        # contagem ficaria verde com qualquer um dos ramos morto, e a mensagem e
        # a unica coisa que diz ao operador ONDE consertar — no catalogo de
        # direitos, na classe, ou no `excerptId` da claim.
        so_consulta = dict(EXCERPT, id="excerpt:s:p1:c1", sourceSlug="fonte-so-consulta")
        _, descartes = MODULE.partition_excerpts(
            [self.bloqueado, self.orfao, so_consulta], self.direitos
        )
        motivos = {d["motivo"] for d in descartes}
        self.assertEqual(len(motivos), 3, f"motivos colidiram: {motivos}")


if __name__ == "__main__":
    unittest.main()
