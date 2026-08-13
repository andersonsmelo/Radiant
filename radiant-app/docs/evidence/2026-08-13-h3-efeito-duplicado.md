# H3 — ausência de efeito duplicado após o relançamento, 2026-08-13

Uma das pendências de H3 era "ausência de efeito duplicado após a retomada", sem
flow que a afirmasse. Agora existe:
`.maestro/student-checkpoint-no-duplicate-effect.yaml`.

## O que o flow faz

Instala limpo, dispensa a apresentação, entra na lição por deep link, responde a
questão e conclui — **é aqui que o efeito acontece**: a conclusão comita XP,
progresso e o recibo de idempotência no mesmo journal. De volta à Home, o flow
**captura** o valor do medidor de XP, mata o app, relança e afirma que o valor
continua o mesmo.

O valor é capturado com `copyTextFrom`, não fixado no arquivo. XP é base mais
bônus (`BASE_XP_PER_QUIZ` é 10 e a execução real deu **18 XP**), então afirmar um
número literal amarraria o flow às regras de gamificação em vez de à propriedade
sob teste. O medidor expõe `accessibilityLabel` no formato `"N XP"`, que é
seletor estável.

## Prova de que a guarda morde

Um teste de guarda não provado é indistinguível de um teste vazio, e este passou
na primeira execução — o que obriga a prova.

- **Execução real:** `copyTextFrom` capturou `18 XP`, e o comando avaliado da
  asserção final registra `"textRegex": "18 XP"` no `commands.json`. O valor é
  real e a asserção o compara depois do relançamento.
- **Mutação:** trocando a asserção final pelo **dobro** do valor capturado
  (`36 XP`) — que é exatamente o que se veria se o efeito fosse reaplicado — o
  flow **reprova**, com `Assertion is false: "36 XP" is visible`. Revertido em
  seguida.

## O que ele prova, e o que não prova

**Prova:** o relançamento reconcilia o journal sem reaplicar um efeito já
comitado. Se a reconciliação duplicasse a concessão de XP, o flow falha.

**Não prova:** idempotência sob crash *no meio* do commit. Matar o app numa
janela específica entre a persistência da intenção e o efeito não é
determinístico por Maestro; essa cobertura continua sendo dos testes de injeção
de crash do módulo (Onda 2), que exercitam os intervalos enumerados. O flow cobre
o caminho que o usuário realmente percorre — concluir, sair e voltar — que era o
que não tinha evidência em aparelho.

## Contrato

O flow entrou nas duas listas de `scripts/maestro-contract.test.mjs` que governam
`scrollUntilVisible`. A lista é explícita e não varredura de diretório, de
propósito: um flow novo que role entra por decisão. **Isso é load-bearing, e foi
provado:** removendo do flow o `assertVisible` que ancora a espera antes da
rolagem, o contrato reprova (20/21); restaurado, volta a **21/21**.

Ele usa a mesma régua de `visibilityPercentage: 80` de
`learning-critical-path.yaml` para o mesmo seletor, como o contrato exige — a
régua saiu de medição, não de gosto.

## Estado das outras pendências de H3

Esta janela fechou **uma** das quatro. As outras três não foram tocadas e não são
todas da mesma natureza:

- **"Segunda falha invalida o checkpoint e volta à Home"** — tem cobertura
  unitária (`ActiveCheckpointRuntime.test.ts`, `restoreFailureCount: 2` e fase
  `invalidated`), mas **não é alcançável por E2E neste binário**, e a razão é
  estrutural: `inspectLaunch` só cai no caminho de falha quando o
  `contentVersion` do checkpoint difere do atual ou quando `routeTarget` devolve
  `null`. O primeiro exige um catálogo diferente — `contentVersion` é
  `LESSON_CATALOG.version`, embutido no bundle; o segundo exige um estado que os
  fluxos limpos não produzem, porque tanto concluir quanto pular a apresentação
  chamam `finish()` e encerram o checkpoint. Fechar isto exige decidir entre
  simular a atualização de conteúdo (mutar a versão do catálogo entre dois
  carregamentos do Dev Client, orquestrado fora do Maestro) ou aceitar a
  cobertura unitária como suficiente. **É decisão de desenho, não execução**, e
  está proposta aqui sem ser tomada.
- **VoiceOver como serviço** e **TalkBack** — o Maestro não dirige leitor de
  tela, e o runbook já recusa presença na árvore de acessibilidade como critério.
  A evidência que falta é passagem manual com o leitor ligado; TalkBack ainda
  exige subir o AVD. **Nenhum trabalho de agente encurta isso.**

Nada aqui promove gate de release. Produção segue `off` e o iOS continua em
`1.3.1 (7)`.
