# Revisão independente — Plano 2, retomada de 2026-10-23

O revisor foi um subagente Claude Opus 5.5, despachado em 2026-10-23 às ~09:25,
em modo só leitura, sem emulador, Metro nem comandos `loop`. Ele leu o
conserto, os testes, a evidência e o plano contra a spec (§§ 4, 8 e 11) e a ADR.
Abaixo está o parecer resumido. Cada achado diz o que se fez com ele.

## Veredito do revisor

- **Conserto:** aprovado com ressalvas. A causa é coerente com a linha do tempo,
  e o código fecha o caminho observado. `ready` é falso no primeiro render do
  momento, porque o encaixe só existe na medalha recomendada. A exceção é um
  caso artificial, B medido antes de A → B, que ficou como P3.
- **Testes (Node 20.20.2):** 46 suítes e 617 testes de `src/features/journey` e
  `src/ui`; `tsc` e `eslint` com código 0. O vermelho confere nas linhas do
  defeito, e as asserções de validade passaram.
- **Plano 2:** não pode ser aceito agora.

## Achados e tratamento

| Achado | Classe | Tratamento |
| --- | --- | --- |
| A amostra nativa do conserto era insuficiente, e o texto já afirmava a correção | P2 | Mais gravações foram feitas, e **o quadro reapareceu** em 1 de 4 com o conserto. STATUS, FILA, plano e índice agora dizem "conserto parcial, não resolvido" ([detecção](android-momento-corrigido-deteccao.txt)). |
| O gate não tinha sido executado | P2 | Rodou duas vezes: na 1ª, FAIL num teste de fluxo frágil, anterior ao conserto; a 2ª passou ([gate](gate.txt)). |
| Vermelho incompleto: a 914 e a 953 nunca tinham sido vistas falhando | P3 | A variante sem a regra do Pixel falha na 914 ([vermelho](testes-vermelho.txt)). A 953 vem depois da 952 e tem a mesma causa da 913, que já foi vista falhando. |
| Atribuição errada do limite do Jest (`mock.js` em vez de `AnimatedComponent`) | P3 | O comentário do teste e a evidência foram corrigidos. |
| Docstring de `motion.ts` desatualizada | P3 | Reescrita para a espera que guarda o começo. |
| O trecho aceso não tem asserção no Jest | P3 | Continua sem, por limite do Jest; documentado no teste. |
| Números da evidência ("0,024 s no trecho", "+2,04", "≈61/s", "Tomograf…", "~230 pt") | P3 | Corrigidos: janela de +0,4 a +4 s, +2,07, 61 por leitura de 1 s, "Tomograf" cortado sem reticências e largura da lista − 128 pt. |
| O passo 3 da tarefa 7 estava marcado sem o segundo dia iOS | P3 | Desmarcado; a nota explica que o iOS vence em 30/10/2026. |
| "Ready" que volta a falso no meio, e preferência não resolvida | P3 | Sem mudança. Os logs de 10 rodadas instrumentadas não mostram `ready` oscilando. |

## Pendências para o aceite, conforme o revisor e a medição

1. O quadro final antecipado no Android, ainda em 1 de 4 gravações. Precisa de
   rastreamento nativo sem log JS antes de outro conserto.
2. A decisão do dono sobre o texto máximo na coluna, que quebra no meio da
   palavra.
3. O segundo dia no iOS, depois de 30/10/2026.
4. O §8 da spec: os 60 fps foram medidos numa story sintética, em emulador
   Debug, com `gfxinfo`. O medidor do G6 não mede quadros contínuos.
