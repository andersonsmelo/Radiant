# Radiant — Execution Status (2026-08-12)

Este documento **substitui
[`EXECUTION_STATUS_2026-08-11.md`](EXECUTION_STATUS_2026-08-11.md)** como estado
canônico. Ele fecha o recorte de expressões do Pixel; os demais gates de
lançamento não foram reexecutados nesta continuação.

## Pixel: pronto em código e testes

As sete tasks do plano de expressões estão concluídas. A Home agora mostra a
frase de humor e entrega o balão à mensagem funcional após **4 s ou o primeiro
toque**, incluindo fallback e corridas de resolução. O quiz registra **três
acertos e dois erros** por sessão, reinicia os contadores quando necessário e
leva a frase de momento ao título de feedback, também com fallback, corridas e
cleanup cobertos.

O follow-up acrescentou quatro testes comportamentais de `PixelFace`: piscada
como multiplicador, cleanup do timer, bypass com *reduced motion* e crossfade
arco/pílula. As mutações causais correspondentes ficaram vermelhas; a revisão
final concluiu **Ready: Yes**, sem findings novos Critical, Important ou Minor.

| Entrega | Runs fechados | Commits |
| --- | --- | --- |
| Task 6 — humor e handover na Home | `run-1786492455023-512e9060`, `run-1786493553163-c839a678` | `ff5fbb1`, `985cc23` |
| Task 7 — momentos no quiz | `run-1786494032821-00586b49`, `run-1786494963316-30348baa` | `f001d4e`, `3987a8a` |
| Follow-up — comportamento de `PixelFace` | `run-1786495557400-ad16f3ad`, `run-1786496276927-780e106b` | `9db2789`, `c623f5c` |

Cada run passou os 13 validadores, chegou a `succeeded` e foi fechado.

## Gate visual aberto — não é falha do código

A validação visual atual do mascote continua pendente. O simulador correto
estava desligado e sem o app instalado; o outro dispositivo disponível executa
uma release antiga. Portanto não há evidência visual atual a declarar, mas
também não há falha atribuível a esta entrega. Antes de validar visualmente,
instale a build correta no simulador correto e confira a região do rosto em
recorte ampliado.

## Operação e release

Não houve build, OTA, submit, push, deploy ou publicação nesta continuação.
Produção segue `off` e o iOS `1.3.1 (7)` permanece intocado. Os gates de
lançamento que não pertencem a este recorte permanecem como registrados no
snapshot anterior, sem nova alegação de validação aqui.

## Backlog preservado

- O hook de *reduced motion* ainda usa a variante booleana; a variante `resolved`
  é a adequada para agendadores. A correção é *cross-cutting* e alcança também
  `PixelIllustration`.
- Permanecem diferidos os minors já anotados e as limitações conhecidas de
  `PixelMood`; este closeout não as reclassifica como corrigidas.
- A frase de produto que contrasta a competência do Pixel com o papel de
  aprendiz da pessoa continua sendo decisão do dono.
