import importlib.util
import unittest
from pathlib import Path

SCRIPT_PATH = Path(__file__).with_name("destination-state.py")
SPEC = importlib.util.spec_from_file_location("destination_state", SCRIPT_PATH)
MODULE = importlib.util.module_from_spec(SPEC)
assert SPEC.loader is not None
SPEC.loader.exec_module(MODULE)

# Forma nua `star-<slug>`, a mesma do campo `id` em
# `Conteúdo/taxonomia/estrelas.json`. O conjunto e injetado, entao nada aqui
# forcava a convencao — e as fixtures usavam `estrela:<slug>`, que nao existe em
# lugar nenhum da fonte real.
MAPEADOS = {"star-artefatos-basicos"}


class DestinationStateTest(unittest.TestCase):
    def test_no_mapeado(self):
        self.assertEqual(
            MODULE.destination_state("star-artefatos-basicos", MAPEADOS), "mapped"
        )

    def test_sem_taxonomia_decidida_e_pendente(self):
        self.assertEqual(MODULE.destination_state(None, MAPEADOS), "pending")

    def test_taxonomia_desconhecida(self):
        self.assertEqual(MODULE.destination_state("star-sumida", MAPEADOS), "unknown")

    def test_particao_separa_pendentes_de_classificados(self):
        classificados = [
            {"excerptId": "excerpt:a:p1:c1", "taxonomyId": "star-artefatos-basicos"},
            {"excerptId": "excerpt:b:p2:c1", "taxonomyId": None},
        ]
        resultado = MODULE.partition(classificados, MAPEADOS)
        self.assertEqual(len(resultado["withDestination"]), 1)
        self.assertEqual(resultado["pendingTaxonomy"][0]["excerptId"], "excerpt:b:p2:c1")

    def test_particao_manda_taxonomia_desconhecida_para_pendentes(self):
        """Prega onde o estado "unknown" cai hoje, ja que `partition` o recolhe.

        Nenhum teste roteava um item "unknown" por `partition`: com
        `estado == "mapped"` mutado para `estado != "pending"`, a suite seguia
        4/4 verde. Este teste e o que fica vermelho sob essa mutacao, e e o que
        vai falhar — de proposito — no dia em que a divisao em tres vias entrar.
        """
        classificados = [
            {"excerptId": "excerpt:c:p3:c1", "taxonomyId": "star-sumida"},
        ]
        resultado = MODULE.partition(classificados, MAPEADOS)
        self.assertEqual(resultado["withDestination"], [])
        self.assertEqual(resultado["pendingTaxonomy"][0]["excerptId"], "excerpt:c:p3:c1")


if __name__ == "__main__":
    unittest.main()
