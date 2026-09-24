# Relatório — frente C: pesquisa para a decisão do iOS 27 (2026-09-24)

**Frente:** C do [prompt de continuidade](2026-09-24-radiant-prompt-de-continuidade.md),
escolhida pelo dono nesta conversa. **Branch:** `pesquisa/ios27-xcode-eas`,
criada sem upstream a partir de `docs/continuidade-2026-09-24` (PR #28 ainda
aberto; escolha do dono). **Código:** nenhuma mudança.

**Condição de pronto:**
- documento com as duas saídas, cada uma com custo e risco, separando o medido
  do inferido;
- STATUS e FILA atualizados;
- este relatório;
- run e sessão do Loop fechados.

## Entrega

- [`docs/release/2026-09-24-ios27-decisao-xcode-uiscene.md`](../../release/2026-09-24-ios27-decisao-xcode-uiscene.md):
  12 medições com fonte, as duas saídas (a segunda em dois caminhos) e a
  recomendação.
- `docs/STATUS.md`, seção "Risco de build", e `docs/FILA.md`, item do iOS 27,
  com os trechos substituídos arquivados sem edição.

## O que mudou no entendimento

O STATUS de 2026-09-23 tratava o crash como bloqueio do próximo build da 1.4.
**Medido hoje:** o EAS compila com o Xcode 26.0, e a build de produção da 1.3.1
saiu com o `iPhoneOS26.0.sdk`. O binário que fecha no iOS 27 só sai desta
máquina, que tem apenas o Xcode 27. O prazo real é abril de 2027, pela regra da
Apple. O SDK 54 não tem `UIScene` oficial; a Expo o trouxe no SDK 58, e como
opção no 57.0.23.

## Medido × inferido × não verificado

- **Medido:**
  - `eas.json` sem `ios.image`;
  - a imagem padrão do SDK 54 e a lista de imagens, na documentação da Expo;
  - Xcode e SDK do log da build de produção da 1.3.1;
  - o prazo, no aviso da Apple de 2026-09-09;
  - o suporte a `UIScene` por SDK, na documentação da Expo e em
    `npm pack expo@54.0.37`;
  - o Xcode local e as versões do React Native por SDK.
- **Inferido:**
  - o app compilado pelo EAS com o SDK 26 abre no iOS 27;
  - os custos das saídas 2a e 2b, que são estimativas.
- **Não verificado:**
  - os logs das três builds `preview` de 2026-09-15/16;
  - a 1.3.1 num aparelho com iOS 27;
  - se a Expo pode trocar a imagem por trás do padrão do SDK 54;
  - o comportamento dos quatro pacotes com ganchos de ciclo de vida
    (`expo-notifications`, `expo-linking`, `expo-router` e
    `expo-splash-screen`), que foram só contados.

## Loop

- **O primeiro run caiu em `needs_human`.** Foi o
  `run-1790251884533-3cb213f0`: os 14 validadores passaram, e o `step finish`
  devolveu `OUT_OF_SCOPE_CHANGE`.
- **A causa não foi a entrega.** O app do Claude reescreveu
  `.claude/settings.local.json` para gravar uma permissão, 22 s depois de o
  run abrir. Diagnóstico por hash contra `baselineManifest`.
- **O `git status` não mostra esse arquivo**, porque o ignore global do git o
  exclui. O guarda do Loop só exclui o que está em `context.excludes`, e esse
  arquivo não está lá.
- **Recuperação:** backup dos seis arquivos, `checkpoint restore` e
  `run close`. Depois, um run novo com o mesmo escopo, que recolocou os
  arquivos a partir do backup.
- **Pendente do dono:** decidir se `.claude/settings.local.json` entra em
  `context.excludes` do `.loop/project.yaml`. É mudança de política e vale para
  todo agente. Sem ela, qualquer run pode cair do mesmo jeito.
- **O AGENTS.md está defasado num ponto:** diz que `context.excludes` não isenta
  do guarda de escopo. No Loop atual, isenta: o `stepFinish` de
  `dist/src/engine.js` passa essa lista ao `captureProjectManifest`. O AGENTS.md
  não foi mexido, porque está fora do escopo deste run.

## Pendente

- **Dono:** escolher. A recomendação é fixar a imagem para a 1.4 e adotar
  `UIScene` pela atualização do SDK depois dela. Fixar a imagem é uma edição
  do agente, num run próprio.
- **Dono, no primeiro build `development` da 1.4:** abrir o app num iPhone com
  iOS 27.
- A frente A (E2E) segue no simulador iOS 26.5 enquanto esta máquina tiver só o
  Xcode 27.
