import importlib.util
import json
import tempfile
import unittest
from pathlib import Path


SCRIPT_PATH = Path(__file__).with_name("classify-source.py")
SPEC = importlib.util.spec_from_file_location("classify_source", SCRIPT_PATH)
MODULE = importlib.util.module_from_spec(SPEC)
assert SPEC.loader is not None
SPEC.loader.exec_module(MODULE)

REPO_ROOT = Path(__file__).resolve().parents[2]
SOURCE_SLUG = "fundamentos-de-radiologia-everton-costa-pinto"
EXCERPTS_PATH = REPO_ROOT / "conteúdo" / "extrações" / SOURCE_SLUG / "excerpts.json"


class ClassifySourceTests(unittest.TestCase):
    def test_classify_excerpt_prefers_physics_for_energy_content(self):
        excerpt = {
            "id": "excerpt:test-energy",
            "sourceSlug": SOURCE_SLUG,
            "pageStart": 4,
            "pageEnd": 4,
            "text": "ENERGIA. A energia pode ser definida como capacidade de realizar trabalho, com raios X, tomografia computadorizada e equipamentos de imagem.",
        }

        record = MODULE.classify_excerpt(excerpt)

        self.assertEqual(record["galaxyId"], "galaxy-fisica")
        self.assertEqual(record["planetId"], "planet-formacao-imagem")
        self.assertEqual(record["starId"], "star-artefatos-basicos")
        self.assertGreater(record["confidence"], 0.7)
        self.assertEqual(record["reviewStatus"], "approved")

    def test_classify_excerpt_fallback_uses_aligned_default_tracks(self):
        excerpt = {
            "id": "excerpt:test-fallback",
            "sourceSlug": SOURCE_SLUG,
            "pageStart": 1,
            "pageEnd": 1,
            "text": "Fundamentos de Radiologia 2017.2",
        }

        record = MODULE.classify_excerpt(excerpt, default_galaxy_id="galaxy-fisica")

        self.assertEqual(record["galaxyId"], "galaxy-fisica")
        self.assertEqual(record["planetId"], "planet-formacao-imagem")
        self.assertEqual(record["starId"], "star-artefatos-basicos")
        self.assertTrue(record["needsReview"])
        self.assertEqual(record["reviewStatus"], "needs-review")

    def test_classify_source_writes_pilot_bundle(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            result = MODULE.classify_source(
                SOURCE_SLUG,
                REPO_ROOT,
                Path(temp_dir) / SOURCE_SLUG,
                update_index=False,
            )

            bundle_path = Path(temp_dir) / SOURCE_SLUG / "classifications.json"
            job_path = Path(temp_dir) / SOURCE_SLUG / "classification-job.json"
            self.assertTrue(bundle_path.exists())
            self.assertTrue(job_path.exists())

            bundle = json.loads(bundle_path.read_text(encoding="utf-8"))
            job = json.loads(job_path.read_text(encoding="utf-8"))

            excerpts = json.loads(EXCERPTS_PATH.read_text(encoding="utf-8"))["excerpts"]
            self.assertEqual(bundle["classificationCount"], len(excerpts))
            self.assertEqual(len(bundle["classifications"]), len(excerpts))
            self.assertEqual(job["artifacts"]["classificationCount"], len(excerpts))
            self.assertEqual(result["classificationCount"], len(excerpts))
            self.assertGreater(bundle["needsReviewCount"], 0)
            self.assertTrue(any(item["reviewStatus"] == "needs-review" for item in bundle["classifications"]))
            self.assertTrue(
                all(
                    not (
                        item["planetId"] == "planet-abdomen"
                        and item["starId"] == "star-coluna"
                    )
                    for item in bundle["classifications"]
                )
            )


    # ── Camada de estrela opcional ────────────────────────────────────────
    # Os planetas do eixo tecnico nao tem estrela (decisao do dono, 2026-08-07).
    # Antes desta mudanca, classify_excerpt indexava PLANET_STAR_IDS[planet_id] e
    # [0] sem fallback, entao um planeta sem estrela era inalcancavel: estourava
    # antes de poder receber classificacao.

    def _planeta_sem_estrela(self):
        """Registra um planeta sem estrela na galaxia de fisica, so para o teste."""
        MODULE.PLANET_RULES["galaxy-fisica"]["planet-sem-estrela-teste"] = [
            ("bucky", 6.0),
            ("colimador", 6.0),
            ("chassi", 6.0),
        ]
        self.addCleanup(
            MODULE.PLANET_RULES["galaxy-fisica"].pop, "planet-sem-estrela-teste", None
        )

    def test_planeta_sem_estrela_recebe_classificacao_com_star_id_nulo(self):
        self._planeta_sem_estrela()
        excerpt = {
            "id": "excerpt:test-sem-estrela",
            "sourceSlug": SOURCE_SLUG,
            "pageStart": 9,
            "pageEnd": 9,
            "text": (
                "O bucky, o colimador e o chassi sao componentes do equipamento de "
                "radiacao ionizante usados na producao de raios X do aparelho."
            ),
        }

        record = MODULE.classify_excerpt(excerpt)

        self.assertEqual(record["planetId"], "planet-sem-estrela-teste")
        self.assertIsNone(record["starId"])
        self.assertIn("sem estrela", record["decisionReason"])

    def test_confianca_renormaliza_sem_a_parcela_da_estrela(self):
        """Sem renormalizar, o teto vira 0.8 do merecido e o limiar e 0.7:
        planeta sem estrela cairia em needs-review por construcao."""
        self._planeta_sem_estrela()
        excerpt = {
            "id": "excerpt:test-renormaliza",
            "sourceSlug": SOURCE_SLUG,
            "pageStart": 9,
            "pageEnd": 9,
            "text": (
                "O bucky, o colimador e o chassi sao componentes do equipamento de "
                "radiacao ionizante usados na producao de raios X do aparelho."
            ),
        }

        record = MODULE.classify_excerpt(excerpt)

        # A prova de que a renormalizacao aconteceu: a confianca supera o que a
        # soma NAO renormalizada poderia produzir. Sem estrela, 0.5*g + 0.3*p
        # nunca passa de 0.8, mesmo com galaxia e planeta perfeitos.
        self.assertGreater(record["confidence"], 0.8)
        self.assertEqual(record["reviewStatus"], "approved")

    def test_planeta_com_estrela_segue_intocado(self):
        """Contraprova: o caminho antigo nao pode ter mudado de comportamento."""
        excerpt = {
            "id": "excerpt:test-com-estrela",
            "sourceSlug": SOURCE_SLUG,
            "pageStart": 4,
            "pageEnd": 4,
            "text": (
                "ENERGIA. A energia pode ser definida como capacidade de realizar "
                "trabalho, com raios X, tomografia computadorizada e equipamentos de imagem."
            ),
        }

        record = MODULE.classify_excerpt(excerpt)

        self.assertEqual(record["planetId"], "planet-formacao-imagem")
        self.assertIsNotNone(record["starId"])
        self.assertEqual(record["starId"], "star-artefatos-basicos")

if __name__ == "__main__":
    unittest.main()
