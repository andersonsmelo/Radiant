import importlib.util
import unittest
from pathlib import Path

SCRIPT_PATH = Path(__file__).with_name("sampling-queue.py")
SPEC = importlib.util.spec_from_file_location("sampling_queue", SCRIPT_PATH)
MODULE = importlib.util.module_from_spec(SPEC)
assert SPEC.loader is not None
SPEC.loader.exec_module(MODULE)

AULAS = [f"lesson:{i}" for i in range(100)]


class SamplingQueueTest(unittest.TestCase):
    def test_sem_teto_escrito_a_taxa_e_total(self):
        self.assertEqual(MODULE.effective_rate(ceiling_written=False), 1.0)

    def test_com_teto_escrito_a_taxa_e_zero(self):
        self.assertEqual(MODULE.effective_rate(ceiling_written=True), 0.0)

    def test_selecao_e_deterministica(self):
        self.assertEqual(
            MODULE.selected_for_review(AULAS, 0.2),
            MODULE.selected_for_review(AULAS, 0.2),
        )

    def test_taxa_total_seleciona_tudo(self):
        self.assertEqual(len(MODULE.selected_for_review(AULAS, 1.0)), len(AULAS))

    def test_taxa_parcial_exclui_pelo_menos_uma_aula(self):
        selecionadas = MODULE.selected_for_review(AULAS, 0.2)
        self.assertGreater(len(selecionadas), 0)
        self.assertLess(len(selecionadas), len(AULAS))

    def test_taxa_do_teto_escrito_nao_seleciona_ninguem(self):
        # `rate=0.0` nao e valor hipotetico: e exatamente o que
        # `effective_rate(ceiling_written=True)` devolve, entao o caminho e
        # vivo. Prega a composicao inteira para que a consequencia de virar a
        # flag — zero revisao humana — fique escrita num teste, e nao so na
        # docstring.
        taxa = MODULE.effective_rate(ceiling_written=True)
        self.assertEqual(taxa, 0.0)
        self.assertEqual(MODULE.selected_for_review(AULAS, taxa), [])


if __name__ == "__main__":
    unittest.main()
