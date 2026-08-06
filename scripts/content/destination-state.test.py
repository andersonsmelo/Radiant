import importlib.util
import unittest
from pathlib import Path

SCRIPT_PATH = Path(__file__).with_name("destination-state.py")
SPEC = importlib.util.spec_from_file_location("destination_state", SCRIPT_PATH)
MODULE = importlib.util.module_from_spec(SPEC)
assert SPEC.loader is not None
SPEC.loader.exec_module(MODULE)

MAPEADOS = {"estrela:raios-x"}


class DestinationStateTest(unittest.TestCase):
    def test_no_mapeado(self):
        self.assertEqual(MODULE.destination_state("estrela:raios-x", MAPEADOS), "mapped")

    def test_sem_taxonomia_decidida_e_pendente(self):
        self.assertEqual(MODULE.destination_state(None, MAPEADOS), "pending")

    def test_taxonomia_desconhecida(self):
        self.assertEqual(MODULE.destination_state("estrela:sumida", MAPEADOS), "unknown")

    def test_particao_separa_pendentes_de_classificados(self):
        classificados = [
            {"excerptId": "excerpt:a:p1:c1", "taxonomyId": "estrela:raios-x"},
            {"excerptId": "excerpt:b:p2:c1", "taxonomyId": None},
        ]
        resultado = MODULE.partition(classificados, MAPEADOS)
        self.assertEqual(len(resultado["withDestination"]), 1)
        self.assertEqual(resultado["pendingTaxonomy"][0]["excerptId"], "excerpt:b:p2:c1")


if __name__ == "__main__":
    unittest.main()
