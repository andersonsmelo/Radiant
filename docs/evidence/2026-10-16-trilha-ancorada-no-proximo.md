# Trilha ancorada no nó PRÓXIMO — 2026-10-16

Escopo: a aba Estude abre com o nó PRÓXIMO centralizado e preserva a posição
ao voltar de outra aba ([ADR](../adr/ADR-2026-10-16-estude-abre-no-proximo-no.md)).
Branch `codex/radiant-study-improvements`, base `1e66881`. Sem publicação nem
integração à `main`.

## Antes — medido no simulador

iPhone 17 `0A1B5AAA-…` ("Radiant E2E item 38"), iOS 26.5, Metro no perfil V2
(`EXPO_NO_DOTENV=1`, sync desligado, URL de API vazia), Node 20.

- A trilha abriu no topo: título, cartão "Fazer revisão" e primeira lição. O
  nó PRÓXIMO só apareceu depois de rolar.
- Rolado até o PRÓXIMO, ida ao Perfil e volta: trilha de novo no topo.
  Causa: `loadSnapshot` fazia `setLoading(true)` em todo foco, e o esqueleto
  substituía a `FlatList`.

## Testes

- `JourneyTrail.test.tsx`: oito casos novos, que verificam a chamada de
  rolagem que a lista recebe (Jest não faz layout). Vermelhos na primeira
  execução, pelo motivo previsto: **0 chamadas** de `scrollToIndex` e
  `onScrollToIndexFailed` inexistente.
- `JourneyHomeScreen.flow.test.tsx`: "voltar à aba relê a trilha sem trocá-la
  pelo carregamento". Vermelho na primeira execução: o esqueleto estava na tela
  depois do foco.
- Injeções, cada uma derrubando só a sua guarda, com verde de volta ao
  restaurar:
  - recentralizar a cada medição → "não volta a centralizar…" com **2 chamadas
    contra 1**;
  - centralizar só uma vez na vida → "centraliza o novo PRÓXIMO…" com **1
    chamada contra 2**;
  - sem a checagem de índice → "recomendação que não está na trilha…" com
    **1 chamada contra 0**;
  - sem a nova tentativa → "quando o nó ainda não foi medido…" com **0
    chamadas**;
  - ancorar pelo efeito sem esperar a primeira medida → "não centraliza antes
    de a lista ser medida" com **1 chamada contra 0**.
- Lacuna achada ao reler o diff: a recentralização dependia de nova medição,
  e concluir uma lição troca rótulos, não alturas. O caso "centraliza o novo
  PRÓXIMO mesmo quando o conteúdo não muda de tamanho" ficou vermelho com
  **1 chamada contra 2**. A recomendação nova passou a ser ancorada também por
  efeito, depois que a lista já foi medida.
- A primeira tentativa de guarda para o índice (o caso "sem nó recomendado")
  **não** caiu com a injeção, porque a guarda de id já o cobria. O caso da
  recomendação fora da trilha foi acrescentado por isso.
- As duas suítes focadas passaram com **48/48** testes, e as 16 suítes de
  `src/features/journey` com **173/173**.

## Depois — medido no simulador

Mesmo aparelho, com o binário **1.4.0 (3)** de 14/10 instalado por cima do
1.3.1 que ele tinha (os dados do app foram preservados):

- ao abrir, o nó PRÓXIMO ("Revisar Princípios de Tomografia…", revisão devida)
  ficou no centro da tela;
- depois de rolar para baixo, ir ao Perfil (conferido na tela) e voltar, a
  trilha estava no mesmo ponto;
- rolando para cima, o título "Fundamentos de Radiologia", o "8 DE 8" e o
  cartão "Fazer revisão" continuam no topo.

Uma queda durante a conferência não veio desta mudança. O relançamento com
`simctl launch` seguido do link do dev client carregou o bundle duas vezes, e o
Reanimated abortou em `installTurboModule`
(`Radiant-2026-10-16-134856.ips`). Abrir só pelo link não reproduziu a queda.

## Limites

- Não conferido no simulador: a recentralização depois de concluir uma lição
  (só o teste a cobre), AX5 e o SE de viewport curta.
- O gate deste run é o `loop validate` registrado na proveniência do commit.
