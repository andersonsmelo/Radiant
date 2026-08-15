# ADR — Home e Galáxia projetam uma única progressão (2026-08-13)

**Status:** ~~aceita e implementada~~ — **SUPERADA em 2026-08-15** por
[`ADR-2026-08-15-topologia-de-navegacao-estude-e-perfil`](ADR-2026-08-15-topologia-de-navegacao-estude-e-perfil.md)
**Decisor:** Anderson (proprietário do projeto)
**Contexto de origem:** inspeção visual da Home e da Galáxia no simulador

> **Nota de superação (2026-08-15).** A repartição decidida aqui — Home como superfície de
> retomada, Galáxia como única superfície de exploração — deixa de valer. A trilha sobe para a
> aba Estude, em rolagem contínua, e a Galáxia é absorvida. O que **sobrevive** desta ADR é o
> princípio que a motivou: uma progressão só, uma representação só da trilha, sem catálogo
> concorrente. A ADR nova o cumpre com mais rigor — deixa de haver duas superfícies para
> divergirem.

## Contexto

A Home exibia o catálogo de trilhas derivado do conteúdo e a Galáxia exibia um
segundo mapa baseado em `GALAXY_CATALOG`, com estados e destinos mantidos à
parte. O aluno via duas representações concorrentes da própria trilha. A remoção
anterior do balão do hero também foi absoluta demais: o dono aprovou que a fala
do Pixel permaneça viva, desde que apareça e desapareça esporadicamente.

## Decisão

- Home é a superfície de retomada: mostra a unidade ativa, o foco do dia e abre
  o próximo nó elegível;
- Galáxia é a única superfície de exploração: contém o catálogo de trilhas e o
  `JourneyMap`;
- Home e Galáxia usam `JourneyProgressService` e `LessonCatalogService`; a troca
  de trilha na Galáxia atualiza a mesma jornada que a Home retoma;
- o mapa estático de `GALAXY_CATALOG` deixa de dirigir a aba principal. O
  catálogo permanece disponível às rotas interiores legadas enquanto elas
  existirem;
- a fala da Home usa o pool acolhedor de `PixelMood`, surge após 1,2–2,6s, fica
  visível por 6,5s e respeita 28–45s de silêncio antes de outra frase;
- o balão é não funcional: nenhuma ação, estado ou orientação depende dele.

## Consequências

- selecionar uma trilha não abre conteúdo automaticamente; primeiro atualiza o
  mapa, e o aluno escolhe um nó ou usa o CTA de continuação;
- a Home perde o carrossel que a alongava e mantém o CTA perto do foco diário;
- testes passam a afirmar a ausência do seletor na Home e a presença conjunta
  de seletor e mapa canônico na Galáxia;
- G3 avança apenas na projeção canônica. A retirada do bloqueio por vidas e as
  dependências de H4 não são declaradas concluídas por esta decisão.

## Alternativas descartadas

Manter os dois mapas sincronizados por adaptação: preservaria a duplicação e
criaria mais um contrato de conversão. Manter o balão permanentemente: roubaria
hierarquia do objetivo diário. Removê-lo por inteiro: eliminaria uma presença do
mascote que o dono quer perceber ao longo da sessão.
