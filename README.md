# Radiant

Radiant é um aplicativo mobile educacional de radiologia, local-first, com
microaprendizagem, prática ativa, revisão espaçada e gamificação não punitiva.

## Documentação e validação

O [status canônico](docs/STATUS.md) concentra versões publicadas, estado dos
serviços, gates e bloqueios, com a data de cada medição. A
[fila](docs/FILA.md) registra o que está executável; o
[mapa da documentação](docs/README.md) aponta specs, pesquisas e evidências.

As correções locais de revisão, primeiro valor, navegação e QA foram entregues
em `13ee173` (2026-10-14). Consulte o
[relatório de remediação](docs/evidence/2026-10-14-qa-remediacao.md) para resultados
nativos, comparação de memória e limitações. Esse pacote não foi distribuído.
Os procedimentos de build/teste ficam no [README do app](radiant-app/README.md)
e no [runbook E2E](radiant-app/docs/E2E_RUNBOOK.md).

## Evolução educacional

A próxima fase transforma a jornada atual em uma trilha espiral por
competências, começando por **Fundamentos e Segurança Radiológica**. As sessões
terão 3–5 minutos, atividades visuais reutilizáveis, domínio por competência,
checkpoint e revisão posterior. Vidas não bloqueiam estudo e ranking global não
faz parte da primeira fase.

Snapshot histórico das fundações em 2026-07-31:

- 41 PDFs inventariados e reduzidos logicamente a 36 fontes únicas;
- 5 arquivos duplicados detectados por SHA-256;
- direitos classificados em 4 fontes `authorized`, 15 `reference-only` e 17
  `blocked`;
- manifesto de mídia e validação de anonimização implementados;
- lote atual com 0 ativos aprovados e 5 candidatos rejeitados; o status é
  `awaiting-authorized-assets`.

Em 2026-08-01 entrou o **currículo por competências**: 30 competências em 6
unidades, com schema, grafo de pré-requisitos sem ciclos e validador próprio
ligado ao gate de conteúdo.

Em 2026-08-02 entrou o **motor de aprendizagem v2**, do contrato ao player:

- `LearningActivityV2`, união discriminada dos oito tipos de interação da
  biblioteca, em sessões de 3 a 6 passos;
- adaptador que converte o catálogo legado sem reescrevê-lo, preservando número e
  ordem das telas;
- evidência estruturada por interação, com contrato de privacidade sem campo para
  texto livre;
- domínio por competência, puro e determinístico, com `mastered` bloqueado sem
  retenção e gate crítico de segurança;
- player desacoplado dos tipos de atividade, por registro de renderizadores.

Essa fundação já ganhou um corte vertical visível em H4: uma unidade promovida
com 12 atividades v2 nativas, checkpoint de 10 itens e aprovação inclusiva em
80%. A primeira atividade passou em smoke no simulador; checkpoint completo,
retomada sem respostas e acessibilidade ainda precisam de evidência em aparelho.

O agendador por competência (Task 11) também está pronto, mas permanece inerte:
o lado de leitura ainda não foi ativado pelo limite de rollout, embora H4 já
forneça conteúdo v2 real. Stores numéricos não finitos são rejeitados e enviados
à quarentena, e competências sintéticas legadas falham fechadas.

Essa frente continua em ordem no
[`plano de implementação`](docs/superpowers/plans/2026-07-31-sistema-aprendizagem-competencias.md).
O primeiro lote original e sintético já foi autorizado, com proveniência e
anonimização verificáveis. A engenharia da Task 12/H4 está integrada à `main`;
falta somente o gate operacional em aparelho. Produção continua `off`.

## Estrutura

```text
radiant-app/       cliente Expo/React Native
radiant-api/       API Fastify/PostgreSQL para auth e sincronização
Conteúdo/          fontes e pipeline editorial versionado
scripts/content/   geração, catálogo, promoção e validadores editoriais
scripts/qa/        contratos de documentação e smokes do repositório
docs/              estado, decisões, planos, specs e runbooks
```

O app usa `radiant-app/src/app` como única árvore oficial de rotas. O catálogo
local continua sendo a base de funcionamento; atualização remota nunca pode
bloquear o estudo.

## Documentação canônica

- mapa e precedência: [`docs/README.md`](docs/README.md)
- requisitos de produto: [`docs/PRD.md`](docs/PRD.md)
- arquitetura vigente: [`docs/ARCHITECTURE_STATE.md`](docs/ARCHITECTURE_STATE.md)
- status operacional e continuidade: [`docs/STATUS.md`](docs/STATUS.md)
- roadmap ativo: [`docs/plans/2026-07-27-radiant-launch-roadmap.md`](docs/plans/2026-07-27-radiant-launch-roadmap.md)
- pipeline editorial: [`docs/CONTENT_PIPELINE.md`](docs/CONTENT_PIPELINE.md)
- decisão educacional: [`docs/adr/ADR-2026-07-31-aprendizagem-por-competencias.md`](docs/adr/ADR-2026-07-31-aprendizagem-por-competencias.md)
- spec educacional: [`docs/superpowers/specs/2026-07-31-sistema-aprendizagem-competencias-design.md`](docs/superpowers/specs/2026-07-31-sistema-aprendizagem-competencias-design.md)

## Validação

Na raiz do repositório:

```bash
node scripts/content/validate-foundation.mjs
node scripts/content/validate-media-manifest.mjs
node --test scripts/qa/docs-contract.test.mjs
node scripts/qa/docs-contract.mjs
```

No app:

```bash
cd radiant-app
npm run quality
```

O gate integral e autorizado do projeto é `loop validate`; ele também valida
app, API, conteúdo, documentação e links do cérebro do projeto.
