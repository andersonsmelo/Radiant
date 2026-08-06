import importlib.util
import unittest
from pathlib import Path

SCRIPT_PATH = Path(__file__).with_name("calibration-report.py")
SPEC = importlib.util.spec_from_file_location("calibration_report", SCRIPT_PATH)
MODULE = importlib.util.module_from_spec(SPEC)
assert SPEC.loader is not None
SPEC.loader.exec_module(MODULE)


class CalibrationReportTest(unittest.TestCase):
    def test_distribuicao_conta_por_faixa(self):
        faixas = MODULE.distribution([0.05, 0.15, 0.95], buckets=10)
        self.assertEqual(faixas["0.0-0.1"], 1)
        self.assertEqual(faixas["0.9-1.0"], 1)

    def test_separacao_positiva_quando_populacoes_diferem(self):
        self.assertGreater(MODULE.separation([0.9, 0.92], [0.2, 0.25]), 0.5)

    def test_separacao_zero_quando_populacoes_se_confundem(self):
        self.assertAlmostEqual(MODULE.separation([0.5], [0.5]), 0.0)

    def test_separacao_zero_quando_um_lado_esta_vazio(self):
        self.assertEqual(MODULE.separation([], [0.2, 0.25]), 0.0)
        self.assertEqual(MODULE.separation([0.9, 0.92], []), 0.0)

    def test_distribuicao_conta_valor_no_limite_superior(self):
        faixas = MODULE.distribution([1.0], buckets=10)
        self.assertEqual(faixas["0.9-1.0"], 1)

    def test_distribuicao_conta_valor_no_limite_inferior(self):
        faixas = MODULE.distribution([0.0], buckets=10)
        self.assertEqual(faixas["0.0-0.1"], 1)


if __name__ == "__main__":
    unittest.main()
