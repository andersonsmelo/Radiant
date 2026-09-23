# Relatório da sessão — tarde de 2026-09-23

Uma conversa com o dono, que também coordenou três sessões paralelas. Cada
fatia tem relatório e vermelhos próprios, linkados abaixo. Este arquivo junta
o que ficou na `main` e o que ficou aberto.

## O que entrou na `main`

| PR | Merge | Conteúdo |
|---|---|---|
| [#15](https://github.com/andersonsmelo/Radiant/pull/15) | `9acd2f5` | L2 v3→v6 do currículo; Sentry mínimo; checklist de declarações |
| [#16](https://github.com/andersonsmelo/Radiant/pull/16) | `b77547f` | decisão do StoreKit por módulo local (só docs) |
| [#17](https://github.com/andersonsmelo/Radiant/pull/17) | `18a2789` | adaptador StoreKit, kill switches reais, privacidade do analytics, Ask to Buy, e o `0b0283e` que só existia local |
| [#18](https://github.com/andersonsmelo/Radiant/pull/18) | `8972cbc` | vidas do assinante: ∞ no `QuizTopBar`, folha que oferece a assinatura, `HUD` só com ∞, Perfil e recompensa no `heartsRepository` |
| [#19](https://github.com/andersonsmelo/Radiant/pull/19) | `def864f` | docs: PR #18 mergeada e afirmações de push caducadas |
| [#20](https://github.com/andersonsmelo/Radiant/pull/20) | `2e62fc9` | contador legado de vidas do `GamificationService` aposentado; `/quiz` e Home no `heartsRepository` |

Todos por merge commit, com autorização do dono dada na conversa, na ordem
acima. O CI `quality` passou no head de cada PR que toca `radiant-app` — o da #18
só depois da correção de estreia, abaixo — e na `main` depois dos merges de
#18 e #20.

Relatórios das fatias:
[∞ no topo](2026-09-23-radiant-quiztopbar-infinito-relatorio.md) ·
[folha e loja](2026-09-23-radiant-folha-vidas-loja-relatorio.md) ·
[HUD](2026-09-23-radiant-hud-infinito-relatorio.md) ·
[Perfil](2026-09-23-radiant-perfil-vidas-relatorio.md) ·
[integração e o CI da #18](2026-09-23-radiant-integracao-vidas-relatorio.md) ·
[contador legado](2026-09-23-radiant-aposenta-vidas-legado-relatorio.md).

## Medido

- Gate `EXPO_NO_DOTENV=1 npm run quality`, Node `v20.20.2`, em `b7aa165` (a
  árvore de `2e62fc9`): exit 0, **134 suítes / 1224 testes**, lint 0 erros /
  26 avisos, visual QA com 0 regressões.
- O CI da PR #18 reprovou por custo de estreia do primeiro teste de
  `LessonFlowScreen.flow.test.tsx`, não por regressão. Reproduzido 3/3 com
  `taskpolicy -b` e corrigido tirando a estreia do prazo do `findByText`. A
  suíte inteira passa com a CPU limitada.
- O estado do repositório (0 PR aberto, 11 branches remotas todas
  mergeadas) está no `STATUS.md`, com o comando que o remede.

## Inferido, não medido

- Que o ∞ tem o peso visual certo nas quatro telas (24 px, peso 800, cor do
  coração cheio). Nenhuma tela foi renderizada em aparelho.

## Não verificado — precisa de aparelho, build ou sandbox (dono)

- O Swift do `radiant-storekit` **nunca compilou contra o Expo real**, e agora
  está na `main`. Um build nativo a partir dela pode falhar nesse módulo até o
  build interno `development` passar.
- O ∞ com assinante real, a volta de `/subscription` relendo as vidas e o
  VoiceOver lendo "Vidas ilimitadas".
- A `/quiz` (só por deep link) e a Home (só com `ENABLE_LEARNING_ROAD`
  desligado) depois da aposentadoria do contador.

## Decisões que ficaram com o dono

1. Offline com binário capaz de vender: o motivo "loja indisponível" aparece
   na tela da assinatura, não na folha, ao contrário da spec §98.
2. Na Trilha, o botão "Vidas ilimitadas" do assinante não abre nada, mas liga
   `heartsSheetVisible`. Se a assinatura expirar com ele ligado, a folha abre
   sozinha.
3. Apagar as 11 branches remotas já mergeadas.

## Lições

Quatro entraram no `AGENTS.md` na seção "Quatro lições de 2026-09-23": as
worktrees e os artefatos ignorados, o `--no-track`, os timeouts do CI e a
autorização citável.
