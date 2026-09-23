# Relatório — integração local das fatias de vidas da 1.4 (2026-09-23)

Quatro sessões entregaram, no mesmo dia, fatias independentes sobre as vidas.
Cada uma passou no gate **sozinha**. Esta passagem junta as quatro numa branch
local e mede o gate na árvore combinada. Sem push, sem merge em `main`, sem
build. Run do Loop `run-1790177000058-82ca6471`.

## A pilha

```text
4788aa1  PR #17 (fix/ask-to-buy-pendente)
0b0283e  docs de 2026-09-23 (local)
├── 647b2c3  QuizTopBar ∞                         feat/quiztopbar-infinito
│   └── b81a91d  folha de vidas oferece a loja    feat/folha-vidas-loja
├── 1ab8bc8  HUD mostra só o ∞                    fix/hud-infinito
└── 01ac4e7  Perfil e recompensa leem as vidas    claude/sharp-dijkstra-747d12

integ/vidas-1-4 = b81a91d + merge 1ab8bc8 (e5c7a95) + merge 01ac4e7 (1a34d1d)
```

## Conflitos

- `1ab8bc8` (HUD) entrou limpo: a sessão tinha simulado a fusão com
  `git merge-file` e escrito longe dos trechos das outras.
- `01ac4e7` (Perfil) conflitou **só** em `docs/FILA.md` e `docs/STATUS.md`. O
  código entrou limpo. Resolução, preservando o texto das três sessões:
  - FILA: os itens 3 e 3b vieram da pilha; o Perfil virou o item **3c** e a
    aposentadoria do contador legado virou o **3d**; os dois achados do item 3
    que já estavam resolvidos (Perfil e HUD) foram marcados ✅, apontando para
    onde foram resolvidos. O bloqueio do 3d ("o commit da fatia do ∞") caiu:
    `647b2c3` existe.
  - STATUS: os parágrafos dos dois lados ficaram, em sequência; o do Perfil
    trocou "não mergeado" por "integrado localmente em `integ/vidas-1-4`".

## Medido

`EXPO_NO_DOTENV=1 npm run quality` em `radiant-app`, Node `v20.20.2`, no
checkout principal, na árvore de `1a34d1d` → **exit 0, 134 suítes / 1212
testes**, lint 0 erros / 26 avisos, Visual QA 0 regressões (61 baselined,
3 scoped exceptions).

A conta fecha com o que cada sessão mediu sozinha, sobre a base de `0b0283e`
(133 suítes / 1174 testes):

| Fatia | Testes | Suítes |
|---|---|---|
| base `0b0283e` | 1174 | 133 |
| QuizTopBar ∞ | +4 | — |
| folha de vidas | +12 | — |
| HUD (1174 − 1 + 16) | +15 | — |
| Perfil e recompensa | +7 | +1 (`MissionsScreen.flow.test.tsx`) |
| **soma esperada** | **1212** | **134** |

Nenhum teste de uma fatia quebrou por causa de outra.

## Não verificado

- Nada disto foi visto em aparelho. O ∞ nas quatro superfícies (topo da lição,
  HUD, Perfil, recompensa) e a volta de `/subscription` esperam o build interno
  e o sandbox, que são do dono.
- O Swift do `radiant-storekit` continua sem compilar contra o Expo real.

## Decisões que continuam com o dono

1. Offline com binário capaz de vender: o motivo "loja indisponível" aparece na
   tela da assinatura, não na folha, ao contrário da spec §98 (item 3b).
2. Na Trilha, o botão "Vidas ilimitadas" do assinante não abre nada, mas liga
   `heartsSheetVisible`. Se a assinatura expirar com ele ligado, a folha abre
   sozinha ([relatório do HUD](2026-09-23-radiant-hud-infinito-relatorio.md)).
3. Push e ordem de merge. Esta branch contém as quatro fatias em cima de
   `0b0283e`, que ainda não está no remoto; os PRs #15 → #16 → #17 continuam
   antes dela.
