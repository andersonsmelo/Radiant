# Continuidade — Radiant, 2026-08-13

## Estado confirmado

H3 permanece encerrada por aceitação explícita do dono; a coorte histórica
continua `inconclusive` e não deve ser reclassificada. O corte de engenharia de
H4 foi integrado à `main` pelo [PR #3](https://github.com/andersonsmelo/Radiant/pull/3),
merge `da638bb`:

- `ProductionBatchV1` completo, imutável e preso ao SHA-256 material;
- seis decisões independentes: técnica, editorial, acessibilidade, direitos,
  schema e produto;
- promoção com recálculo do hash material e lock exclusivo durante expected
  hash, temporário, `fsync` e rename atômico, com changelog/rollback no mesmo
  artefato;
- painel somente leitura em `/production-batches` e API local em
  `/api/production-batches`;
- 12 atividades v2 promovidas na trilha/jornada e consumidas pelo player nativo;
- conclusão v2 registrando competência, evidência e `contentVersion` reais;
- checkpoint com 10 itens, 2 por competência e aprovação inclusiva em 80%;
- reprovação não conclui o nó e encaminha a competência frágil para reforço;
- intent ativo construído com o `checkpointId` emitido pelo runtime.

A revisão profissional final aprovou o material e a integração na `main` foi
confirmada. Não abrir nova rodada editorial sem mudança material.
Produção do kernel continua `off`; não houve OTA, TestFlight, App Store, Play,
bump ou build do app. O diretório não rastreado `skill-observations/` é
preexistente e deve permanecer fora de commits.

## Evidência automatizada desta entrega

- 83 testes em 10 suítes focadas do app;
- 6 testes da promoção atômica, incluindo adulteração material, escritores
  concorrentes, conflito e falha antes do rename;
- `npm run typecheck` verde;
- lint dos arquivos alterados sem avisos; lint integral sem erros e somente
  avisos preexistentes;
- build otimizado do painel editorial verde.
- build Debug local e smoke Maestro da primeira atividade no simulador iOS 26.5;
  a captura ampliada eliminou o painel radiográfico legado do conteúdo atômico.
- runs Loop `run-1786650657344-8849c1c9` e
  `run-1786653661719-69c3b22b`, ambos com 13/13 validadores;
- **Radiant App Quality** remoto
  ([run 31742730883](https://github.com/andersonsmelo/Radiant/actions/runs/31742730883))
  concluído com sucesso sobre `935e433`.

O `npm ci` do painel informou vulnerabilidades da dependência preexistente
`next@15.3.0` (3 high, 1 critical). O painel é localhost-only e essa dependência
não foi alterada neste run; tratar o upgrade em run próprio com teste de build,
sem misturá-lo à promoção curricular.

## Próximo gate exato

Completar a experiência H4 no simulador/aparelho pretendido: a primeira atividade
promovida e seu avanço já passaram; falta percorrer o checkpoint, observar um
desfecho de aprovação e um de reforço, conferir texto grande/leitor de tela e
retomada sem persistir respostas. Essa passagem fecha H4 integralmente; ela não é
mais uma pendência de schema, catálogo ou conteúdo.

Antes de qualquer edição futura, leia `AGENTS.md`, rode `git status --porcelain`,
abra a sessão do cérebro Loop, consulte o status canônico e preserve o contrato
de fechamento `validate → step finish → memory write (se houver) → run close`,
checando o `code` de cada envelope separadamente.
