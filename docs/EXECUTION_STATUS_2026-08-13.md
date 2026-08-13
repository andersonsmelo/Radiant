# Radiant — Execution Status (2026-08-13)

Este documento **substitui
[`EXECUTION_STATUS_2026-08-12.md`](EXECUTION_STATUS_2026-08-12.md)** como estado
canônico. Ele cobre três passagens: a **visual**, concluída em 2026-08-12, a de
**H3**, encerrada por aceitação explícita do dono em 2026-08-13, e o corte de
engenharia executável da **H4**. Não promove nenhum gate de release nem substitui
evidência em aparelho.

Em uma frase: a passagem visual está fechada e verificada; H3 não encontrou
regressão nos gates medidos e foi encerrada pelo dono sem reclassificar a medição
histórica `inconclusive` como aprovação estatística; H4 tem contrato, catálogo,
player e checkpoint executáveis no repositório, sem publicação em loja/OTA.

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
mas a retirada do bloqueio por vidas e o gate operacional de H4 em aparelho
permanecem abertos. A dependência de engenharia H4 já foi integrada à `main`.
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

Todos os pontos visuais decididos nesta passagem estão concluídos. H3 foi
encerrada pelo dono e H4 agora tem domínio, lote v2 promovido, integração
recuperável e checkpoint real. O gate restante é operacional: percorrer em
aparelho os desfechos de aprovação e reforço, retomada sem respostas e
acessibilidade. Só depois desse fechamento G3 retoma a retirada do bloqueio de
lições por vidas. O handoff autocontido está em
[`CONTINUIDADE_2026-08-13.md`](CONTINUIDADE_2026-08-13.md).

## H3 — encerrada por aceitação do dono; coorte histórica `inconclusive`

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

O bloqueio de comparabilidade encontrado nesta coorte foi **corrigido em
2026-08-13**: o flow de `active` continua com dois lançamentos, mas cada
`first_frame` agora carrega fase explícita. O gate compara somente os 20
lançamentos `cold` de cada lado e exige também 20 `resume` no active como prova de
retomada; qualquer população incompleta, extra ou sem fase fica `inconclusive`.
Isso elimina a mistura histórica de n=42 contra n=20 sem retirar a evidência de
recovery. Decisão em
[`ADR-2026-08-13-h3-first-frame-populacao-fria.md`](adr/ADR-2026-08-13-h3-first-frame-populacao-fria.md).

**Ausência de efeito duplicado após o relançamento fechou em 2026-08-13** (run
`run-1786622015450-e1943354`, evidência
[`2026-08-13-h3-efeito-duplicado.md`](../radiant-app/docs/evidence/2026-08-13-h3-efeito-duplicado.md)).
O flow conclui a lição, captura o XP em vez de fixá-lo, relança e afirma o mesmo
valor; a guarda foi provada por mutação afirmando o dobro. Contrato Maestro em
21/21.

**VoiceOver e TalkBack foram declarados concluídos pelo dono em 2026-08-13.** São
passagens manuais, portanto este registro preserva a proveniência como confirmação
do dono, sem inventar artefato automatizado onde o Maestro não alcança leitor de
tela. Isso fecha apenas esses dois checks de acessibilidade do H3.

**H3 foi encerrada por aceitação explícita do dono em 2026-08-13.** O dono
confirmou que a repetição em host silencioso e a passagem em aparelho físico de
tela baixa foram concluídas, sem fornecer novos números ou artefatos para este
repositório. Também aceitou a cobertura unitária para **"segunda falha invalida o
checkpoint"**, em vez de exigir uma simulação externa de `contentVersion`. A razão
medida permanece: o caminho de falha exige
`contentVersion` diferente, que é embutido no bundle, ou `routeTarget` nulo, que
os fluxos limpos não produzem. O resultado `inconclusive` da coorte histórica fica
preservado como proveniência e **não** vira `pass`; o encerramento é operacional do
dono, não promoção de performance nem autorização de produção. Decisão em
[`ADR-2026-08-13-h3-encerramento-por-aceitacao-do-dono.md`](adr/ADR-2026-08-13-h3-encerramento-por-aceitacao-do-dono.md).

## H4 — corte de engenharia executável entregue; gate em aparelho ainda aberto

`UnitCheckpointService` agora produz `CheckpointAttemptV1`,
`ReinforcementPlanV1` e o `UnitCheckpointAttemptIntentV1` já aceito pelo
`CommitCoordinator`. A nota tem peso igual por item, 80% inclusivo, pulado como
incorreto e erro crítico não compensável. Dica não cria recuperação independente;
competência com dica, erro, item pulado ou erro crítico continua frágil para fins
de reforço.

O ciclo é estrito e determinístico: falha inicial gera explicação causal + prática
guiada; depois de esse plano estar concluído, nova falha gera modalidade diferente
e aplicação independente + variante equivalente; somente a terceira falha após os
dois ciclos chega a `support-required`. O intent define desbloqueio apenas por
`passed`, nunca por XP, e o runtime ativo encaminha o intent pelo
`CheckpointCoordinator` ao commit recuperável. O serviço falha fechado para
`legacy` e para competências `competency:legacy:*`; portanto o catálogo atual não
ganha recomendação nem promoção por acidente.

O corte vertical agora promove `ProductionBatchV1` completo e imutável, com as
seis decisões independentes presas ao mesmo SHA-256 material. Mudança em qualquer
atividade, fonte, checkpoint ou reforço invalida as aprovações. A biblioteca de
publicação recalcula o hash material, exige o hash esperado do catálogo e mantém
um lock exclusivo durante leitura, comparação, temporário, `fsync` e rename
atômico. Changelog e rollback ficam no mesmo artefato; mutação posterior à
aprovação, um segundo escritor concorrente e falha injetada antes do rename
falham fechados, preservando o catálogo anterior e removendo o temporário.

`ProductionCurriculumCatalog` projeta o lote promovido no catálogo local, numa
jornada sequencial de 12 atividades, checkpoint e recompensa. O player consome a
atividade v2 nativa sem fabricar `LessonBlock`; a conclusão registra a competência,
o tipo de evidência e o `contentVersion` reais. O checkpoint apresenta os 10 itens,
duas questões por competência, aplica 80% e só marca o nó como concluído quando
passa. A reprovação preserva o bloqueio e encaminha a primeira competência frágil
para revisão. Em `active` interno, o intent é construído com o `checkpointId`
emitido pelo runtime; em produção o kernel continua `off` e a autoridade local
legada continua responsável pelo progresso.

Evidência local desta entrega: **83 testes focados em 10 suítes**, os **6 testes**
da promoção atômica — incluindo adulteração material e escritores concorrentes —,
`npm run typecheck`, lint dos arquivos alterados sem avisos e
build otimizado do painel editorial com as rotas `/production-batches` e
`/api/production-batches`. O lint integral permaneceu em zero erros e 17 avisos
preexistentes após remover os dois avisos introduzidos pela implementação. O
smoke no `Radiant iPhone 17 Pro - iOS 26.5` compilou e abriu a primeira atividade;
a inspeção encontrou e removeu a radiografia legada semanticamente incorreta, e
o Maestro confirmou abertura, avanço e alternativas no bundle corrigido. Ainda
falta registrar o checkpoint completo e acessibilidade em aparelho; por isso H4 não é
reclassificada como integralmente fechada. Houve somente build Debug local; não
houve OTA, build distribuível, publicação ou mudança da versão `1.3.1 (7)`.

### Histórico H4 — do candidato preservado à promoção aprovada

Três IAs receberam o mesmo briefing para a unidade existente
`unit:materia-energia-e-radiacao`. O primeiro retorno foi descartado porque
classificou incorretamente a edição atual de *OpenStax College Physics 2e* como
CC BY 4.0 e ainda trouxe simplificações físicas defeituosas. O terceiro parou
corretamente em `BLOQUEADO_POR_DIREITOS`, mas sua busca não alcançou as páginas
específicas do LibreTexts. O segundo retorno foi selecionado como **candidato**, não
como conteúdo aprovado, e está preservado integralmente em
[`2026-08-13-h4-materia-energia-e-radiacao-candidato.md`](content/2026-08-13-h4-materia-energia-e-radiacao-candidato.md),
com o SHA-256 do anexo de origem.

A triagem documental confirmou páginas textuais específicas que declaram CC BY
4.0 e o candidato não incorpora imagens, tabelas, áudio, vídeo ou marcas dessas
fontes. Isso remove o bloqueio de **descoberta de fontes compatíveis**; não fecha o
gate jurídico. Antes da conversão, ainda é obrigatório: registrar data/hash e
atribuição completa por fonte; indicar tradução/adaptação; completar estabilidade
atômica e a ponte entre transmissão, detector e contraste; fortalecer distratores;
e converter as atividades para o contrato real `LearningActivityV2`, com
proveniência por afirmação, evidência, acessibilidade e `criticalSafety: false`.

Em 2026-08-13, o candidato recebeu uma adaptação estruturada independente em
`radiant-app/src/features/student-checkpoints/EditorialCurriculumCandidate.ts`.
O contrato automático valida as 12 atividades `LearningActivityV2`, fonte por
afirmação, 10 itens do checkpoint (2×5, meta de 80%), acessibilidade, evidência,
`criticalSafety: false` e os dois ciclos. Ele guarda explicitamente o estado
`human-gates-pending`, sem conectar catálogo, telas ou produção.

Um parecer técnico externo posterior confirmou e corrigiu três defeitos mecânicos
do artefato: a divergência antes não declarada em relação ao Markdown preservado,
o viés dos dez gabaritos na primeira posição e a resposta ambígua sobre quantidade
de fótons. Também removeu raios gama de gabaritos de ordenação rígida, pois as
faixas podem se sobrepor e a distinção depende da origem. Isso é correção local
verificada por teste; não satisfaz revisão técnica humana nem qualquer outro gate.

Uma segunda leitura independente fechou três lacunas de contrato: o mapa deixou de
prometer uma avaliação de segurança que o candidato não mede; a ponte conceitual
transmissão diferencial → detector → contraste ganhou a fonte S8, sob CC BY 4.0; e
o contrato passou a distinguir afirmações `source-backed` de distratores autorais,
sem atribuir estes às fontes. São correções locais verificadas por teste e
typecheck, não aprovação técnica, editorial, jurídica ou de produto.

Na revisão final solicitada pelo dono em 2026-08-13, as oito páginas diretas foram
rechecadas e continuavam declarando CC BY 4.0. Não há mídia de terceiros no pacote,
o contrato rejeita metadado de licença com URL divergente e os hashes são tratados
corretamente como fingerprints históricos de respostas HTML dinâmicas. O parecer
final é **aprovado para integração no repositório**, sem achado técnico/editorial
bloqueador. O dono autorizou commit e push. Novas rodadas de conteúdo só são
necessárias se houver mudança material.

O aceite do dono foi materializado como seis decisões independentes e opacas no
schema agora existente, todas vinculadas ao mesmo hash e sem inventar nome, email
ou identidade de dispositivo. `ProductionBatchV1`, promoção atômica e conexão às
telas estão entregues. Não há nova pendência editorial sem mudança material; o
único gate restante de H4 é a passagem da experiência em aparelho, separada da
engenharia já concluída.

### Integração H4 confirmada na `main`

O corte foi integrado pelo [PR #3](https://github.com/andersonsmelo/Radiant/pull/3)
no merge `da638bb`, em 2026-08-13. O workflow remoto **Radiant App Quality**
([run 31742730883](https://github.com/andersonsmelo/Radiant/actions/runs/31742730883))
concluiu com sucesso sobre `935e433`. Os runs Loop materiais
`run-1786650657344-8849c1c9` (corte H4) e
`run-1786653661719-69c3b22b` (hardening do publisher) fecharam com 13/13
validadores. Isso comprova integração e qualidade no repositório; não equivale a
OTA, build distribuível ou publicação em loja.

## Operação e release

Esta reconciliação não publicou OTA, submit, TestFlight, App Store ou alteração
de versão. Produção segue `off` e o iOS permanece em `1.3.1 (7)`; os gates não
pertencentes a esta passagem continuam com o estado do snapshot anterior.

O PR #1 foi incorporado à `main` no merge `6b3095f`; os workflows do merge
`Radiant App Quality` (31724663127) e `Radiant API Quality` (31724663118)
concluíram com sucesso. A branch de origem permanece alinhada ao origin em
`b91819f`. Esse merge comprova integração no repositório, não publicação.
