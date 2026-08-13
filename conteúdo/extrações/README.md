# Extrações

Esta pasta guarda os jobs e artefatos de extração derivados das fontes registradas.

## `pages.json` e `excerpts.json` NÃO são versionados, e isso é deliberado

Eles carregam o **texto integral da fonte**. Em 2026-08-07 descobriu-se que os
dois arquivos do job piloto estavam rastreados em git desde `847a12d` — 253 KB
de texto de uma fonte `rightsClass: blocked`, `allowedUses: []`, sem aviso de
licença no PDF, **públicos** num repositório público. Foram retirados do índice
na mesma data.

O que fica desta pasta em git é **metadado**: os `README.md`, o `index.json` e o
`extraction-job.json`. O material extraído é subproduto local, reproduzível a
qualquer momento por:

```bash
python3 scripts/content/extract-source.py --source "<pdf>" --output-dir "Conteúdo/extrações/<slug>"
```

`Conteúdo/` está no `.git/info/exclude` e `Conteúdo/extrações` está em
`context.excludes` do Loop — mas nenhuma das duas listas destrastreia arquivo já
commitado. Se um `pages.json` ou `excerpts.json` reaparecer no `git status` como
rastreado, ele voltou por `git add -f` ou por commit anterior à exclusão, e sai
de novo.

## Regras

- cada job de extração deve apontar para uma `sourceId`
- jobs começam como `pending` e avançam para `extracted` quando os artefatos são materializados
- a pasta do job deve conter, no mínimo, `pages.json` e `excerpts.json` — **em disco**, não em git
- extração real só entra depois que a fonte estiver registrada
- o job piloto usa extração por texto embutido com `pypdf`

## Job piloto atual

- `extract:fundamentos-de-radiologia-everton-costa-pinto`
- estado: `extracted`
