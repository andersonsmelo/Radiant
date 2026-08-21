# Radiant — Execution Status (2026-04-09)

## Resumo executivo

Em 2026-04-09, a Wave 1 avançou de catálogo editorial pronto para experiência multi-trilha no app.

A `Learning Road V2` agora expõe as trilhas prioritárias do catálogo, permite selecionar uma trilha real e preserva progresso local separado por trilha.

Na rodada mais recente, a build iOS nativa foi revalidada em simulador e o retorno para trilhas sem próximo nó elegível saiu do `Alert` modal e passou para um estado inline na `Journey Home`.

## O que foi feito

### App mobile

- `JourneyHomeScreen` carrega o manifesto de catálogo via `LessonCatalogService.bootstrap()`;
- `JourneyTrackShelf` e `JourneyTrackCard` exibem `Fundamentos`, `Tórax` e `Abdome`;
- tocar em uma trilha chama `JourneyProgressService.selectTrack(track.id)`;
- a trilha selecionada abre o próximo nó elegível real, sem ficar limitada a um aviso de preview;
- quando não existe próximo nó elegível, a `Journey Home` mantém a trilha ativa e explica o estado inline na própria tela;
- evento tipado `journey_track_selected` foi adicionado ao contrato de telemetria.

### Motor de jornada

- `JourneyDefinitionService.getTrackDefinition(trackId?)` agora monta uma definição por trilha de catálogo;
- `JourneyDefinitionService.getDefaultTrackId()` define a trilha padrão a partir do catálogo runtime;
- `JourneyProgressStore` foi introduzido em `src/types/journey.ts`;
- schema de progresso foi atualizado para `journey-progress.v2`;
- progresso é persistido por `tracks[trackId]`, com `activeTrackId` no store;
- migração de `journey-progress.v1` preserva progresso legado no bucket da trilha padrão quando possível.

### Conteúdo e painel editorial

- `conteúdo/governança/wave-1-priority-tracks.json` define as trilhas prioritárias da Wave 1;
- o painel editorial calcula prontidão Wave 1 a partir dos bundles aprovados;
- status atual: `18/18` lições prontas nas trilhas prioritárias;
- smoke Wave 1 cobre fundação de conteúdo, rota de catálogo e status editorial.

### API e contrato de catálogo

- contrato `/v1/content/catalog` inclui metadata quando o upstream não fornece;
- testes de rota cobrem o contrato mínimo de catálogo para app e smoke local;
- a API continua espelhando o catálogo promovido pelo seed gerado.

## Artefatos principais

| Área | Caminho |
|---|---|
| Tela de jornada | `radiant-app/src/features/journey/screens/JourneyHomeScreen.tsx` |
| Prateleira de trilhas | `radiant-app/src/features/journey/components/JourneyTrackShelf.tsx` |
| Card de trilha | `radiant-app/src/features/journey/components/JourneyTrackCard.tsx` |
| Definição de jornada por trilha | `radiant-app/src/features/journey/services/JourneyDefinitionService.ts` |
| Progresso multi-trilha | `radiant-app/src/features/journey/services/JourneyProgressService.ts` |
| Tipos de jornada | `radiant-app/src/types/journey.ts` |
| Contrato de trilhas prioritárias | `conteúdo/governança/wave-1-priority-tracks.json` |
| Smoke Wave 1 | `scripts/qa/wave-1-smoke.mjs` |
| Checklist Wave 1 | `docs/superpowers/checklists/2026-04-09-radiant-wave-1-smoke.md` |

## Validação executada

### App

```bash
cd radiant-app
npx tsc --noEmit --pretty false
npx eslint src/features/journey/services/JourneyProgressService.ts src/features/journey/services/JourneyProgressService.test.ts src/features/journey/services/JourneyDefinitionService.ts src/features/journey/services/JourneyDefinitionService.test.ts src/features/journey/screens/JourneyHomeScreen.tsx src/features/journey/components/JourneyTrackCard.tsx src/features/journey/components/JourneyTrackShelf.tsx src/types/journey.ts
CI=1 ./node_modules/.bin/jest --runInBand --forceExit --verbose src/ui/__tests__/motion.test.ts src/features/journey/services/JourneyDefinitionService.test.ts src/features/journey/services/JourneyProgressService.test.ts
```

Resultado: `10` testes passando no recorte de motion e jornada.

### Simulador iOS

```bash
cd radiant-app
npm run ios:doctor
npx expo run:ios --device "iPhone 17"
npm run ios:v2
```

Resultado:

- build nativa concluída com sucesso no simulador;
- `Journey Home` carregada a partir do bundle atual;
- fallback de trilha sem próximo passo validado no runtime sem modal de interrupção.

### Conteúdo e QA

```bash
node scripts/content/validate-foundation.mjs
node --test scripts/content/wave-1-priority-tracks.test.mjs scripts/content/validate-foundation.test.mjs
node scripts/qa/wave-1-smoke.mjs
node --test scripts/qa/wave-1-smoke.test.mjs
```

### API

```bash
cd radiant-api
npm run typecheck
npm test -- src/routes/content.test.ts src/routes/content-contract.test.ts
```

Resultado: contrato de catálogo e rota de conteúdo validados no recorte da Wave 1.

## Estado do workspace

O workspace local contém muitas alterações e arquivos não rastreados acumulados de frentes anteriores.

Higiene aplicada nesta rodada:

- `.gitignore` agora ignora `.next/`, `**/.next/` e `*.tsbuildinfo`;
- artefatos gerados do painel editorial não devem entrar no commit da feature;
- antes de publicar, separar explicitamente código útil, docs, conteúdo e ruído gerado.

## Próximos passos

1. Fechar a homologação manual do tap-flow completo entre `Fundamentos`, `Tórax` e `Abdome` sobre a build já validada.
2. Abrir PR do pacote principal já commitado, sem misturar o restante do workspace.
3. Repetir o smoke Wave 1 depois do próximo sync editorial para manter app e API alinhados.
4. Refinar estados vazios secundários da jornada se aparecerem gaps na homologação manual.
