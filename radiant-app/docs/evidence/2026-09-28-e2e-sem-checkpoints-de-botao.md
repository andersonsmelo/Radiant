# E2E da trilha sem os checkpoints de botão, no simulador — 2026-09-28

**A pergunta, do item 34 da [FILA](../../../docs/FILA.md)
([ADR](../../../docs/adr/ADR-2026-09-28-checkpoints-de-botao-saem-da-trilha.md)):**
com os checkpoints de botão fora das trilhas do catálogo, os fluxos que
passavam por eles andam de lição a lição pela Estude?

## Ambiente

- **Simulador temporário** `50F7813E-…`, "Radiant E2E temporario (34)",
  iPhone 17 com iOS 26.5, criado para esta medição e apagado no fim. Os fluxos
  começam com `clearState` e apagariam os dados de outro simulador.
- **Build Debug local** de `Sep 27 19:10`, do DerivedData, com versão nativa
  `1.3.1`. O JS vem do Metro, no Node `v20.20.2`, a partir da árvore do run
  (`feat/d4-decisoes-de-revisao` sobre `e990bf6`), com as variáveis do
  `scripts/start-ios-v2.sh` conferidas pelo `check-env-precedence.mjs`. É o
  mesmo arranjo do [E2E de 2026-09-24](2026-09-24-e2e-caminhos-dourados-1-4.md).
- **Maestro** `/Users/anderson/.maestro/bin/maestro`, rodado com o diretório
  de trabalho no scratchpad, para as capturas não caírem no repositório.
- **Carga da máquina entre 20 e 40** durante toda a medição, por causa de
  outros aplicativos abertos. A lição de 2026-09-28 manda esperar abaixo de ~5,
  e não houve janela assim. Isso explica a duração, e as duas primeiras falhas,
  abaixo.

## Resultado

| Fluxo | Resultado | Duração |
|---|---|---|
| `learning-critical-path` | **passed** na 5ª execução | 19:38:55–19:45:32 |
| `offline-relaunch` | **passed** na 2ª execução | 19:50:43–19:58:47 |
| `reward-unlock` | **failed no último passo**, por defeito anterior ao 34 (FILA, 39); todo o trecho novo passou | 19:58:59–20:22:15 |
| `store-capture` | **passed** na 1ª execução | 20:24:23–20:34:37 |

**No `learning-critical-path`,** o trecho novo rodou: depois da lição 1, o
botão "Continuar jornada" da Estude levou direto à lição 2 ("Princípios de
Tomografia Computadorizada"). O cabeçalho mostrou "Fundamentos de Radiologia.
1 de 8 etapas concluídas.": são 8 etapas, 7 lições e a conquista, contra 14
antes.

**No `reward-unlock`:**
- as sete lições da trilha foram feitas em ordem, com seis passagens pela
  Estude ("Continuar jornada"), e o cabeçalho chegou a "7 de 8";
- depois da última lição, a Estude mostrou "Aguardando nova etapa" e o card
  "Novo arco em breve: Você concluiu tudo que está disponível", e não o botão
  "Receber conquista". O fluxo reprovou no toque nele;
- **a causa é anterior ao 34.** O motor de recomendação da 1.4 exclui a
  conquista (`JourneyRecommendationService`: `if (node.type === 'reward')
  return null;`, desde `75cc9da`). Com ou sem checkpoints, a Estude nunca a
  oferece. O arquivo não foi mudado pelo 34;
- o passo não foi alterado, porque recomendar a conquista é decisão de produto
  (FILA, 39). As asserções da tela da conquista, "7 de 8" e "8 de 8 marcos",
  ficaram sem execução.

**No `store-capture`,** as capturas saíram em `~/.maestro/tests/…/shots/`, fora
do repositório: `01-home`, `02-licao`, `03-quiz` e `06-perfil`. As capturas
`04-checkpoint` e `05-conquista` não existem mais (FILA, 37).

**No `offline-relaunch`,** depois de matar e reabrir o app com o modo avião
ligado, a trilha restaurada apontou para a lição seguinte ("Continuar
jornada").

### As execuções que falharam, e por quê

As falhas vieram de defeitos que **já existiam** nesses fluxos antes do item
34. Eles não rodavam desde as mudanças da 1.4, e cada um foi consertado no
próprio fluxo:

1. **O dev client chegou atrasado,** nas execuções 1 e 4 do
   `learning-critical-path`. A folha "This is the developer menu" subiu depois
   da guarda `runFlow when`, que só é avaliada uma vez, e cobriu a tela.
   - É a corrida documentada em `subflows/dismiss-dev-client.yaml`, medida em
     2026-09-24.
   - Os quatro fluxos passaram a usar o subflow. O `offline-relaunch` também o
     usa depois da reabertura, porque o dev client parou no launcher
     ("DEVELOPMENT SERVERS").
2. **O resumo da lição,** na execução 2. Depois de "Concluir e voltar" vem o
   resumo, que entrou na 1.4, com o botão "Continuar". Os fluxos seguiam direto
   para a trilha.
3. **A âncora da Estude,** na execução 3. `'^\d+ de \d+$'` não existe mais na
   árvore: desde os consertos de acessibilidade, o contador é lido no rótulo do
   cabeçalho. A árvore do Maestro mostrou só
   `Fundamentos de Radiologia. 1 de 8 etapas concluídas.`. A âncora passou a
   ser `'^.+\. \d+ de \d+ etapas concluídas\.$'`, a mesma do caminho dourado 1.

**Seis outros fluxos têm as mesmas âncora e guarda desatualizadas** e não foram
tocados: `boot-to-home`, `rating-prompt`, `reward-locked` e três
`student-checkpoint-*`. Eles viraram o item 38 da FILA.

## Não verificado

- O `radiant-1-4-segundo-dia`, que depende do relógio do dia seguinte. Ele
  mudou só num comentário.
- Se o modo avião do Maestro deixa mesmo o simulador iOS sem rede. O passo
  concluiu, mas o efeito não foi medido.
- Android, aparelho físico e build de produção.
