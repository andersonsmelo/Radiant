# Governança Editorial

Esta pasta guarda os contratos e regras que tornam o pipeline de conteúdo auditável.

## Objetivos

- rastrear origem de cada artefato
- padronizar contratos para extração, classificação, conceitos e formatos
- permitir validação automática antes de qualquer integração com app ou API

## Contratos atuais

- `catalog-payload.json`: bundles aprovados e promovidos para runtime;
- `wave-1-priority-tracks.json`: trilhas que formam o baseline da Wave 1;
- `esquemas/library-source.schema.json`: metadados e classes de direitos da
  biblioteca ampliada;
- `esquemas/media-manifest.schema.json`: autorização, anonimização,
  acessibilidade e hotspots de mídia educacional.

O manifesto de mídia vive em `../mídia/manifest.json`. Em 2026-07-31 ele está
`awaiting-authorized-assets`: 0 itens aprovados e 5 candidatos rejeitados. Esse
estado é intencional; nenhum arquivo deve ser promovido apenas para deixar o
manifesto preenchido.

## Gates

```bash
node scripts/content/validate-foundation.mjs
node scripts/content/validate-media-manifest.mjs
```

Um gate verde confirma coerência dos artefatos presentes. Prontidão editorial
também exige que o lote tenha ativos autorizados e revisão humana concluída.
