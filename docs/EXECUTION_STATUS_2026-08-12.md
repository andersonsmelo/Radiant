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

## Gate visual local fechado

Uma build **Release** local, autocontida e com `main.jsbundle` embutido foi
compilada e instalada no simulador `Radiant iPhone 17 Pro - iOS 26.5`. O hash do
bundle instalado coincidiu com o artefato recém-compilado. O smoke
`.maestro/boot-to-home.yaml` passou sem Metro ou Dev Menu e chegou à Home com
`Foco de hoje` visível.

A inspeção da Home e de um recorte ampliado confirmou o rosto do Pixel dentro
da tela, sem olhos antigos flutuantes, face duplicada ou emenda visível. Essa
evidência fecha a composição estática e o binário efetivamente instalado; os
estados transitórios de humor e sequência do quiz continuam sustentados pelos
testes comportamentais e pelas mutações causais, não por uma nova captura
temporal desta sessão.

## Operação e release

Houve build e instalação **somente no simulador local**, para que a próxima
abertura use o código atual sem depender do Metro. Não houve OTA, submit,
TestFlight, App Store nem deploy de produção. Produção segue `off` e o iOS
`1.3.1 (7)` permanece intocado. Os gates de lançamento que não pertencem a
este recorte permanecem como registrados no snapshot anterior, sem nova
alegação de validação aqui.

## Backlog preservado

- O hook de *reduced motion* ainda usa a variante booleana; a variante `resolved`
  é a adequada para agendadores. A correção é *cross-cutting* e alcança também
  `PixelIllustration`.
- Permanecem diferidos os minors já anotados e as limitações conhecidas de
  `PixelMood`; este closeout não as reclassifica como corrigidas.
- A frase de produto que contrasta a competência do Pixel com o papel de
  aprendiz da pessoa continua sendo decisão do dono.
