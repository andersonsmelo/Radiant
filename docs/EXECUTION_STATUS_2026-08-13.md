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

## Passagem visual complementar concluída

| Entrega decidida pelo dono | Estado entregue |
| --- | --- |
| Legenda do anel da meta | A legenda agora é visível acima de `N de M`, além de continuar no rótulo de acessibilidade. |
| Mapa e balão na Home | `JourneyMap` fica exclusivamente na aba Galáxia; o balão inteiro sai da Home. `PixelMood` continua no quiz. |
| Ícones remanescentes | Missions, Progress, PlanetInterior, Checkpoint e a story de `StatPill` usam `HudIcons`/`DecorativeIcon`, não emoji do sistema. |
| Meta diária | A unidade é **XP por dia**, não lições: quatro tiers escolhíveis — Começar (10 XP), Ritmo (20 XP), Foco (35 XP) e Desafio (50 XP). |
| Starfield | As nebulosas são camadas difusas com deriva lenta e desfasada; reduzir movimento as mantém estáticas. |

A escolha de XP evita uma escada artificial de poucas lições e aproveita o
próprio recibo de gamificação. A configuração preserva a chave local v1 e zera
o progresso por data local; detalhes e consequências em
[`ADR-2026-08-13-meta-diaria-em-xp.md`](adr/ADR-2026-08-13-meta-diaria-em-xp.md).

## Operação e release

Esta reconciliação não publicou OTA, submit, TestFlight, App Store ou alteração
de versão. Produção segue `off` e o iOS permanece em `1.3.1 (7)`; os gates não
pertencentes a esta passagem continuam com o estado do snapshot anterior.
