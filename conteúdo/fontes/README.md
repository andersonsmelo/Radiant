# Fontes

Esta pasta guarda as obras e materiais brutos registrados na base editorial.

## Regras

- cada obra registrada recebe um slug estável
- cada obra precisa de um `source.json`
- `index.json` é a lista canônica de fontes conhecidas
- a metadata da fonte acompanha os status agregados de `extração`, `classificação`, `conceitos` e `formatos`

Para a biblioteca ampliada, `library-catalog.json` é o inventário canônico por
SHA-256. Cada fonte única também registra título, contribuidores, edição, data,
licença, uso comercial, usos permitidos e a base da decisão humana.

Classes de direitos:

- `authorized`: uso limitado exatamente ao escopo registrado;
- `reference-only`: consulta factual com redação original, sem reprodução;
- `blocked`: não usar até nova decisão humana documentada.

O nome do arquivo, a presença na pasta ou uma licença aparente não bastam para
autorizar reprodução.

## Fonte piloto registrada

- `Fundamentos de Radiologia`

## Biblioteca catalogada em 2026-07-31

- 41 PDFs encontrados;
- 36 fontes únicas;
- 5 duplicatas por hash;
- 4 fontes `authorized`;
- 15 fontes `reference-only`;
- 17 fontes `blocked`.

Validação:

```bash
node scripts/content/catalog-library-sources.mjs
node scripts/content/validate-foundation.mjs
```
