# Radiant — Execution Status (2026-08-13)

Este documento **substitui
[`EXECUTION_STATUS_2026-08-12.md`](EXECUTION_STATUS_2026-08-12.md)** como estado
canônico. Ele cobre duas passagens: a **visual**, concluída em 2026-08-12, e a de
**H3**, executada entre 2026-08-12 e 2026-08-13. Não promove nenhum gate de
release nem substitui evidência em aparelho.

Em uma frase: a passagem visual está fechada e verificada; H3 mediu tudo o que
promete medir, **não encontrou regressão em nenhum gate** e ficou `inconclusive`
por ruído do host, o que o deixa dependente de uma janela silenciosa do dono.

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
| HUD — prancheta recuperada e efeitos autorais completados | `run-1786559682298-f6490054`; referência byte a byte em `docs/design/2026-08-12-hud-assets-approved.html` | `6e3c594` |
| HUD — escala corrigida após inspeção no aparelho | `run-1786561046889-f32b9cfd`; XP/chama 18pt, vidas 22pt | `1073cb2` |

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

## Fechamento verificado da passagem visual

A rodada complementar entrou em `8f92723`; a correção de escala do HUD entrou em
`1073cb2`; e a unificação final de Home, Galáxia e fala ambiental entrou em
`56779ea`. O último run material, `run-1786563770360-5c6c65ca`, passou os 13
validadores, chegou a `succeeded`, gravou a memória validada de fingerprint
`74ed5300f1ab2ba7628760a6f27e39936ffacf8dc02cdab766a40b3fdc5d505d` e foi
fechado. A branch `codex/wave1-hardening-api-smoke` foi enviada ao origin e
ficou alinhada em `56779ea`.

Os checks remotos do mesmo SHA fecharam verdes: **Radiant App Quality**
([run 31634995733](https://github.com/andersonsmelo/Radiant/actions/runs/31634995733))
e **Radiant API Quality**
([run 31634995737](https://github.com/andersonsmelo/Radiant/actions/runs/31634995737)).
Isso comprova integração e qualidade no GitHub; não equivale a publicação.

Todos os pontos visuais decididos nesta passagem estão concluídos. A próxima
pendência de engenharia não é um refinamento da Home: é fechar H3 com duas
coortes de 20 amostras de `first_frame` em janela de host e, depois, executar H4
(Task 12 educacional). Só então G3 retoma a retirada do bloqueio de lições por
vidas. O handoff autocontido está em
[`CONTINUIDADE_2026-08-13.md`](CONTINUIDADE_2026-08-13.md).

## H3 — coortes de `first_frame` executadas, veredito `inconclusive`

Em 2026-08-12 as duas coortes do gate H3 rodaram com a métrica que gateia desde
2026-08-10: 20+20 amostras, mesmo binário, aparelho e perfil, em sequência
imediata. Evidência completa em
[`2026-08-12-h3-first-frame-cohorts.md`](../radiant-app/docs/evidence/2026-08-12-h3-first-frame-cohorts.md);
runs `run-1786569447281-441efcf9` (instrumento) e `run-1786575077447-6b656968`
(medição e registro), ambos com 13 validadores e memória validada.

| Gate | Desfecho | Números |
| --- | --- | --- |
| `persistence` | pass | p95 16,8 ms (n=40, limite 75) |
| `restoration` | pass | p95 7,9 ms (n=21, limite 100) |
| `home_to_lesson_delta` | pass | +10 ms contra 771 permitidos |
| `baseline_isolation` | pass | nenhuma métrica de checkpoint no log de `off` |
| `first_frame_delta` | **inconclusive** | delta −72 ms; ruído 132,6 ms contra teto 117,1 ms |

**Nenhum delta medido é positivo** — não há sinal de regressão. O que impede o
verde é o instrumento: durante a janela o macOS cresceu o swap de 2048 MB para
4096 MB, e a degradação caiu sobre o baseline, alargando a dispersão de quem
rodou primeiro. O gate recusa concluir quando a medida perde resolução, que é
exatamente o comportamento desenhado em 2026-08-10 para impedir o passe vazio.

Dois achados de instrumento entraram nesta passagem. O **coletor CDP passou a ser
versionado** — a receita o descrevia em prosa e ele era reconstruído a cada
sessão, o que fazia a medição parecer reprodutível sem ser. E o **controle
positivo podia contaminar a coorte que ele autoriza**: a linha sintética
reaparecia num arquivo posterior, reentregue pelo buffer do alvo, e como imitava
`first_frame` com duração zero, deprimiria o p50 do baseline e inflaria o piso de
ruído. Corrigido com uma métrica que o parser ignora por construção e um piso
temporal.

Fica registrado um bloqueio de comparabilidade **antes de qualquer verde futuro**:
o flow de `active` lança o app duas vezes por amostra, então as duas coortes não
medem a mesma população (n=42 contra n=20, com o relançamento sistematicamente
mais rápido). A correção é mudança de desenho do gate e está **proposta, não
executada**.

**Ausência de efeito duplicado após o relançamento fechou em 2026-08-13** (run
`run-1786622015450-e1943354`, evidência
[`2026-08-13-h3-efeito-duplicado.md`](../radiant-app/docs/evidence/2026-08-13-h3-efeito-duplicado.md)).
O flow conclui a lição, captura o XP em vez de fixá-lo, relança e afirma o mesmo
valor; a guarda foi provada por mutação afirmando o dobro. Contrato Maestro em
21/21.

**Próximo passo de H3 é do dono, em duas frentes.** Repetir as duas coortes em
host silencioso, com reinício para zerar o swap — nenhum trabalho de agente
encurta isso. E fazer a passagem manual de **VoiceOver** e **TalkBack**: o Maestro
não dirige leitor de tela e o runbook recusa presença na árvore de acessibilidade
como critério, então não há automação que substitua. Seguem também sem evidência
aparelho físico de tela baixa e **"segunda falha invalida o checkpoint"** — esta
última com razão medida, não por falta de tentativa: o caminho de falha exige
`contentVersion` diferente, que é embutido no bundle, ou `routeTarget` nulo, que
os fluxos limpos não produzem. Tem cobertura unitária; fechar em E2E é decisão de
desenho, proposta e não tomada.

## Operação e release

Esta reconciliação não publicou OTA, submit, TestFlight, App Store ou alteração
de versão. Produção segue `off` e o iOS permanece em `1.3.1 (7)`; os gates não
pertencentes a esta passagem continuam com o estado do snapshot anterior.
