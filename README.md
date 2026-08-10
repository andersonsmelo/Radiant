# Radiant

Radiant é um aplicativo mobile educacional de radiologia, local-first, com
microaprendizagem, prática ativa, revisão espaçada e gamificação não punitiva.

## Estado atual

| Frente | Estado verificado |
| --- | --- |
| App | Expo/React Native; catálogo e progresso funcionam offline |
| Android | versão `1.3.0 (4)` publicada no teste fechado `alpha`; última leitura em 2026-08-03: 14 contas vinculadas e 2 opt-ins; faltam ≥10 opt-ins e a janela de 14 dias |
| iOS | versão `1.3.1`, build `7`; estado reconfirmado no console em 2026-08-09: **Aguardando revisão**; liberação manual após aprovação |
| E2E local | Maestro **6/6 nas duas plataformas** em 2026-08-03; após a mudança de primeira vitória, o `first-run.yaml` atualizado passou **1/1 no iOS 26.5 e 1/1 no Android API 36** em 2026-08-09 |
| API pública | fora do caminho crítico; o status canônico registra HTTP 502 |
| Conteúdo legado | 18 atividades prontas nas trilhas Fundamentos, Tórax e Abdome |
| Sistema educacional v2 | governança de fontes concluída; gate de mídia implementado; primeiro lote autorizado ainda pendente |

O estado operacional completo e os bloqueios vigentes estão em
[`docs/EXECUTION_STATUS_2026-08-10.md`](docs/EXECUTION_STATUS_2026-08-10.md).

## Evolução educacional

A próxima fase transforma a jornada atual em uma trilha espiral por
competências, começando por **Fundamentos e Segurança Radiológica**. As sessões
terão 3–5 minutos, atividades visuais reutilizáveis, domínio por competência,
checkpoint e revisão posterior. Vidas não bloqueiam estudo e ranking global não
faz parte da primeira fase.

Fundações entregues em 2026-07-31:

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

Nada disso mudou a lição que o usuário vê — foi esse o objetivo. O que muda a
tela é a próxima etapa, os **jogos**: hoje só `multiple-choice` tem renderizador.

O agendador por competência (Task 11) também está pronto, mas permanece inerte:
o lado de leitura ainda não foi ativado e não existe conteúdo v2 para alimentar
uma revisão real. Stores numéricos não finitos agora são rejeitados e enviados
à quarentena; antes da ativação, ainda falta uma guarda explícita que não dependa
apenas da ausência de chamadores.

Essa frente continua em ordem no
[`plano de implementação`](docs/superpowers/plans/2026-07-31-sistema-aprendizagem-competencias.md).
Segue pendente fornecer um primeiro lote de imagens educacionais com autorização
e anonimização verificáveis — sem ele, os jogos que dependem de imagem não têm
com o que ser construídos.

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
- status operacional: [`docs/EXECUTION_STATUS_2026-08-10.md`](docs/EXECUTION_STATUS_2026-08-10.md)
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
