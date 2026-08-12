# Radiant — Execution Status (2026-08-13)

Este documento **substitui
[`EXECUTION_STATUS_2026-08-12.md`](EXECUTION_STATUS_2026-08-12.md)** como estado
canônico. Ele reconcilia a passagem visual concluída em 2026-08-12; não promove
nenhum gate de release nem substitui evidência em aparelho.

## Sistema de produto e design confirmado

[`PRODUCT.md`](PRODUCT.md) e [`DESIGN.md`](DESIGN.md) foram confirmados pelo dono
antes da implementação. O primeiro é a fonte estratégica do produto; o segundo
transforma as medições da crítica em regras de composição, contraste e movimento.
O commit `5b7f8e2` é o registro versionado dessa decisão.

## Correções P0 da Home e navegação concluídas

| Entrega | Evidência fechada | Commit |
| --- | --- | --- |
| P0-A — selo da trilha ativa legível | `run-1786540569689-bd65efa0`, com memória `dde1501e04ef06e87557f49537ccfc035f27db112febcdce24bb132d26d15094` | `f1d1a72` |
| P0-B — trilha nunca aberta não afirma domínio | mesmo run e memória | `f1d1a72` |
| `navBlue` `#4A9EFF` em foco, aba ativa, paleta local e `streakColor` | `run-1786541539238-9ff07835`, com memória validada | `f1d1a72` |
| HUD — emoji do sistema substituído por SVG animado em código | `run-1786549531451-907750be`, 13 validadores/evidências fechados | `3e6839d` |
| HUD — prancheta recuperada e efeitos autorais completados | `run-1786559682298-f6490054`; referência byte a byte em `docs/design/2026-08-12-hud-assets-approved.html` | fechamento desta sessão |
| HUD — escala corrigida após inspeção no aparelho | `run-1786561046889-f32b9cfd`; XP/chama 18pt, vidas 22pt | fechamento desta sessão |

P0-A corrige a composição de **1,00:1** (texto e fundo com o mesmo token). P0-B
remove a barra verde de sucesso de conteúdo nunca aberto. A correção de navegação
elimina o foco invisível e distingue estado ativo do inativo por composição, não
por token isolado.

## Aprendizado recuperado do HUD

O run do HUD foi validado e fechado, mas não recebeu memória devido ao
encadeamento incorreto do fechamento. O aprendizado durável é recuperado do
commit `3e6839d`: ícones pequenos e onipresentes ficam em SVG + Reanimated, sem
novo runtime; a animação comunica papel — XP celebra evento, chama sinaliza estado
vivo e coração encena perda — e *reduced motion* preserva um estado final estático
e legível. Rive permanece reservado ao Pixel, onde a interpolação de forma paga
seu custo.

A auditoria visual posterior encontrou dois elementos da prancheta aprovada que
não chegaram ao commit `3e6839d`: as quatro fagulhas cardinais do XP e a
rachadura com drenagem do coração perdido. O run
`run-1786559682298-f6490054` recupera o HTML volátil com SHA-256
`1802b14952cf8f1701d87bcff61918f741b6380cd34fd8a83b8c0d970d8844c0` e
completa os dois efeitos. XP dispara uma celebração de 600ms quando o valor
aumenta; só o coração que esvaziou executa impacto, rachadura seca e drenagem em
220ms. Com movimento reduzido, ambos saltam ao estado final sem efeito.
`hapticLifeLost` não foi duplicado no HUD: o fluxo do quiz já o chama uma vez,
depois da persistência real da perda, desde `fde484e`.

Na inspeção seguinte, o dono identificou que a escala original de 14pt/18pt
ficava pequena demais no aparelho. A produção passa a usar 18pt para XP/chama e
22pt para corações. A prancheta permanece intacta como fonte autoral; esta é uma
correção posterior de composição, sem alterar paths, cores ou comportamento.

## Passagem visual complementar concluída

| Entrega decidida pelo dono | Estado entregue |
| --- | --- |
| Legenda do anel da meta | A legenda agora é visível acima de `N de M`, além de continuar no rótulo de acessibilidade. |
| Home, Galáxia e fala do Pixel | A Home conserva hero, foco e próxima ação; catálogo e `JourneyMap` vivem exclusivamente na Galáxia e leem o mesmo `JourneyProgressService`. O balão volta como fala ambiental: aparece por 6,5s após atraso curto, some por 28–45s e nunca carrega informação funcional. `PixelMood` continua também no quiz. |
| Ícones remanescentes | Missions, Progress, PlanetInterior, Checkpoint e a story de `StatPill` usam `HudIcons`/`DecorativeIcon`, não emoji do sistema. |
| Meta diária | A unidade é **XP por dia**, não lições: quatro tiers escolhíveis — Começar (10 XP), Ritmo (20 XP), Foco (35 XP) e Desafio (50 XP). |
| Starfield | As nebulosas são camadas difusas com deriva lenta e desfasada; reduzir movimento as mantém estáticas. |

A escolha de XP evita uma escada artificial de poucas lições e aproveita o
próprio recibo de gamificação. A configuração preserva a chave local v1 e zera
o progresso por data local; detalhes e consequências em
[`ADR-2026-08-13-meta-diaria-em-xp.md`](adr/ADR-2026-08-13-meta-diaria-em-xp.md).

A decisão anterior de remover o balão por inteiro foi corrigida pelo dono após
inspeção no simulador. A mesma inspeção revelou que a aba Galáxia ainda projetava
`GALAXY_CATALOG` enquanto a Home oferecia outro seletor. O fechamento unifica as
duas superfícies sem promover G3 por inteiro: a projeção canônica está entregue,
mas a retirada do bloqueio por vidas e as dependências de H4 permanecem abertas.
Decisão e consequências em
[`ADR-2026-08-13-home-e-galaxia-progressao-unica.md`](adr/ADR-2026-08-13-home-e-galaxia-progressao-unica.md).

## Operação e release

Esta reconciliação não publicou OTA, submit, TestFlight, App Store ou alteração
de versão. Produção segue `off` e o iOS permanece em `1.3.1 (7)`; os gates não
pertencentes a esta passagem continuam com o estado do snapshot anterior.
