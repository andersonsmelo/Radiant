import importlib.util
import unittest
from pathlib import Path


SCRIPT_PATH = Path(__file__).with_name("extract-source.py")
SPEC = importlib.util.spec_from_file_location("extract_source", SCRIPT_PATH)
MODULE = importlib.util.module_from_spec(SPEC)
assert SPEC.loader is not None
SPEC.loader.exec_module(MODULE)

PDF_DO_PILOTO = Path("conteúdo/02.-Fundamentos-de-radiologia-Autor-Everton-Costa-Pinto.pdf")


class ExtractSourceTests(unittest.TestCase):
    def test_slug_is_normalized_for_pilot_source(self):
        slug = MODULE.normalize_source_slug(
            "02.-Fundamentos-de-radiologia-Autor-Everton-Costa-Pinto.pdf"
        )
        self.assertEqual(slug, "fundamentos-de-radiologia-everton-costa-pinto")

    def test_chunker_splits_text_into_bounded_excerpts(self):
        text = " ".join(["radiologia"] * 1200)
        chunks = MODULE.chunk_text(text, max_chars=500)
        self.assertGreaterEqual(len(chunks), 2)
        # O teto passou de duro a SUAVE em 2026-08-07, e a folga e limitada por
        # construcao: um pedaco so ultrapassa `max_chars` quando absorveu um
        # resto menor que MIN_CHARS, entao o maximo possivel e a soma dos dois.
        # A alternativa — recuar o corte para o resto passar do piso — mantinha
        # o teto duro e deixava um toco de ~90 caracteres, que resolve a regua e
        # nao resolve o problema.
        self.assertTrue(all(len(chunk) <= 500 + MODULE.MIN_CHARS for chunk in chunks))


class ChunkerSemOrfaoTests(unittest.TestCase):
    """O laco guloso emitia o `current` final incondicionalmente, sem piso: toda
    pagina com `k * max_chars + epsilon` produzia um orfao de tamanho epsilon.
    Medido em 2026-08-07 na fonte do piloto — 19 de 405 excertos abaixo de 80
    caracteres, e **19 de 19 eram o ultimo pedaco da pagina**. O caso mais limpo
    e uma pagina de 1401 caracteres virando [1398, 3]."""

    def frase(self, n_palavras):
        return " ".join(["radiologia"] * n_palavras)

    def test_resto_minusculo_volta_para_o_pedaco_anterior(self):
        # 46 palavras de 10 chars + espacos = 549 chars. Com teto 500, o corte
        # guloso deixaria um resto de ~38 chars.
        chunks = MODULE.chunk_text(self.frase(46), max_chars=500)
        self.assertEqual(len(chunks), 1, f"tamanhos: {[len(c) for c in chunks]}")

    def test_nenhum_pedaco_fica_abaixo_do_piso_quando_ha_vizinho(self):
        for n in range(45, 60):
            chunks = MODULE.chunk_text(self.frase(n), max_chars=500)
            if len(chunks) < 2:
                continue
            curtos = [len(c) for c in chunks if len(c) < MODULE.MIN_CHARS]
            self.assertEqual(curtos, [], f"{n} palavras produziu orfao: {curtos}")

    def test_o_conteudo_do_resto_nao_se_perde(self):
        texto = self.frase(46)
        self.assertEqual(" ".join(MODULE.chunk_text(texto, max_chars=500)).split(), texto.split())

    def test_pagina_inteira_curta_continua_saindo_como_um_pedaco(self):
        # Sem pedaco anterior nao ha para onde reencostar, e o texto curto e a
        # pagina inteira — um divisor de secao, nao artefato de corte. Medido:
        # 1 dos 19 curtos era o unico pedaco da sua pagina.
        chunks = MODULE.chunk_text("Capitulo 4", max_chars=500)
        self.assertEqual(chunks, ["Capitulo 4"])

    # Este caso le um PDF que NAO esta no versionamento. Ele entrou no gate em
    # 2026-08-07 junto com o resto do arquivo, e sem esta guarda acoplaria o
    # `loop validate` do projeto inteiro a material que uma copia limpa do
    # repositorio nao tem. O `skipUnless` declara a ausencia em vez de fingir
    # aprovacao: um caso que nao rodou nao pode parecer um caso que passou.
    @unittest.skipUnless(
        PDF_DO_PILOTO.exists(), f"material fora do versionamento ausente: {PDF_DO_PILOTO}"
    )
    def test_extract_pages_from_pilot_pdf(self):
        source_path = PDF_DO_PILOTO
        pages = MODULE.extract_pages(source_path)
        self.assertGreater(len(pages), 10)
        self.assertEqual(pages[0]["pageNumber"], 1)
        self.assertIn("FUNDAMENTOS DE RADIOLOGIA", pages[0]["text"].upper())


if __name__ == "__main__":
    unittest.main()
