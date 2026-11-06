# Governança editorial

Os schemas, direitos, taxonomia, mídia e biblioteca continuam preservados. Em 02/11/2026 o catálogo, a sequência e as prioridades curriculares foram esvaziados; competências e prompts do piloto foram retirados.

O marcador canônico é `../../radiant-app/src/data/curriculum-state.json`. O estado `retired` é explícito e validado estritamente: coleções curriculares devem estar vazias, sem bundles ocultos. O validador mantém as verificações de biblioteca, schemas, mídia e integridade da taxonomia. Um verde nessa condição prova coerência da retirada local; não prova prontidão editorial nem publicação.

Comandos de leitura:

```bash
node scripts/content/validate-foundation.mjs
node scripts/content/validate-content-anchoring.mjs
node scripts/content/validate-taxonomy-map.mjs
node scripts/content/audit-production-batches.mjs --check
```

Os comandos são executados a partir da raiz do repositório. O [planejamento único](../../docs/plans/2026-11-02-planejamento-conteudo-radiant.md) governa a nova produção. A retirada não altera banco remoto, storage do aluno nem app distribuído.
