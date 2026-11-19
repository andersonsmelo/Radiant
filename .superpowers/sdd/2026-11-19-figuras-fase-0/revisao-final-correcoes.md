# Correções da revisão final (2026-11-19)

- Crítico: leito novo fora do app. Spec restaurado de 6e68b3e2, entrada e fonte SVG removidas, teste do conversor deriva a lista de `fontes/` (`figurasComFonte`). Prova: `docs/evidence/2026-11-19-figuras/alvos-leito-restaurado.png` (as 5 regiões da M25.05 sobre os objetos certos, aberto e conferido).
- Importante 2: regra `figure-target-label-mismatch` + `rotulos` opcional validado no arquivo de alvos. Vermelho em `vermelho-revisao-final.txt` (4 testes novos reprovam sem a regra; 142 antigos passam).
- Importante 3: STATUS, ADR, orcamento.md e README do conversor dizem o estado exato, com data.
- Menores corrigidos: 6 (`range` validado, 3 casos vermelhos registrados), 8 (6,47 MiB de acréscimo; 10,9 MiB no teto por figura).
- Não corrigidos: 5 (alvo sem arquivo de alvos / arquivo órfão: reprovar quebraria figuras novas em andamento), 7 (teste de movimento reduzido com `range`), 9 (link da licença, sem CC BY ainda), 10 (CI não vê roteiros), 11 (parecer da unidade sobre coordenadas remarcadas), e a guarda (c) "importada sem arquivo de alvos reprova" do achado 1.
- Importante 4 (números cortados no iOS): de outro agente.
- Teste de laço dos roteiros passou a usar `colimador-abrindo` (o leito antigo não tem `periodMs`).
- Falhas alheias na árvore no fim: `registerSource ... pilot book`; `build-rtg-batches` e `RtgCatalog` ("em dia"), registro ("importada sem entrada em figuras.json") e lint da m18 (`figure-target-unlinked`) por causa de esqueleto-axial-apendicular e osso-longo, em andamento por outros agentes.
