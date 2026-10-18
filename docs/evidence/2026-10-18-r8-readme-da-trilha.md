# R8: README curto da trilha e mapa que não envelhece

**Data:** 2026-10-18. **Autor:** Claude Opus 5.5. **Base:** branch
`claude/r6-store-revisao` em `583c644`, sobre a `main` em `e2e0524`.
**Origem:** o achado A7 da
[revisão do trabalho do Codex](../trilha/avaliacoes/2026-10-17-revisao-do-trabalho-do-codex.md)
e o item R8 do [plano de coordenação](../trilha/plano/2026-10-17-avancos-e-coordenacao-multi-ia.md).
**Critério do R8:** o mapa lista todos os arquivos, e a leitura cabe em cinco
minutos.

## O que mudou

- **[medido] O [README](../trilha/README.md) caiu de 2.344 para 796 palavras**,
  as duas contadas da mesma forma, sem os destinos dos links: cerca de 4 minutos a 200 palavras por
  minuto. Ele tem quatro partes: direção, estado, mapa completo e como
  contribuir.
- O texto antigo foi para o [histórico](../trilha/historico.md), na mesma
  pasta, para os links relativos continuarem valendo. O corpo é idêntico ao do
  README anterior, conferido com `diff`, sob um cabeçalho que diz que nada ali
  é estado atual.
- **O mapa lista os 28 arquivos da pasta**, fora o próprio README: os 27 que já
  existiam e o anexo. Nenhum link
  do README está quebrado.
- A seção de estado só aponta para o STATUS e a FILA, com uma fotografia
  datada, para não virar um segundo documento de estado.

## A guarda que impede o mapa de envelhecer

O A7 nasceu de um mapa escrito à mão que listava 2 das 4 pesquisas. Agora o
`docs-contract`, que roda no `loop validate`, exige que todo arquivo da pasta,
inclusive em subpasta, seja destino de um link Markdown no README
(`FOLDER_MAPS` em `scripts/qa/docs-contract.mjs`). Um link para a subpasta ou
uma menção em código não contam.

**[medido] Vermelho.** Com os exports criados e o `inspectFolderMap` ainda
vazio, os testes 15 e 17 falharam pelo motivo previsto: nenhuma violação
acusada. O README antigo já passava na regra, porque a consolidação de 17/10
tinha passado a linkar todos os arquivos em alguma seção, ainda que a tabela
"Mapa da pasta" estivesse velha. Por isso o vermelho da regra no README real
foi produzido por injeção.

**[medido] Cada guarda, vista falhando pelo defeito que nomeia.** Cada injeção
troca uma âncora e restaura o arquivo. A primeira tentativa de tirar o link do
anexo não reprovou, porque o anexo também é linkado no parágrafo de abertura. A
injeção foi refeita para tirar as duas ocorrências.

```text
## README real sem o link de um arquivo (docs/trilha/README.md, âncora: 1 ocorrência)
not ok 18 - the trail entry point maps every file in its folder
# pass 17
# fail 1
docs-contract.mjs (saída 1): FAIL docs/trilha/README.md: the folder map does not link PROMPT-GEMINI.md

## README real sem nenhum link para o anexo (as 2 ocorrências) (docs/trilha/README.md, âncora: 2 ocorrência)
not ok 18 - the trail entry point maps every file in its folder
# pass 17
# fail 1
docs-contract.mjs (saída 1): FAIL docs/trilha/README.md: the folder map does not link historico.md

## âncora não removida do destino (scripts/qa/docs-contract.mjs, âncora: 1 ocorrência)
not ok 16 - accepts a folder map that links every file, with anchors and ./ prefixes
# pass 17
# fail 1
docs-contract.mjs (saída 0): PASS documentation contract

## menção em código conta como link (scripts/qa/docs-contract.mjs, âncora: 1 ocorrência)
not ok 17 - does not count a link to the subfolder or a mention in code as mapping the file
# pass 17
# fail 1
docs-contract.mjs (saída 0): PASS documentation contract

## arquivo novo na pasta, fora do mapa (docs/trilha/pesquisas/2026-10-18-pesquisa-nova-fora-do-mapa.md, criado e apagado)
not ok 18 - the trail entry point maps every file in its folder
# pass 17
# fail 1
docs-contract.mjs: FAIL docs/trilha/README.md: the folder map does not link pesquisas/2026-10-18-pesquisa-nova-fora-do-mapa.md
```

## Limites

- O tempo de leitura é estimado pela contagem de palavras, e não medido com um
  leitor.
- A regra cobre só a pasta `docs/trilha/`. Outra pasta com README de entrada
  entra acrescentando uma linha em `FOLDER_MAPS`.
- A PR #47, ainda aberta, acrescenta três links ao topo do README antigo. Ao
  ser atualizada com a `main`, ela precisa colocá-los no README novo.
