# T00 — revisão independente R1

Medição: 2026-10-25, America/Bahia. Revisor: subagente `t00_revisao`. Escopo: artefatos T00 e conferência local somente leitura; nenhum teste, build, simulador, Loop/brain, commit ou push executado. Única escrita: este parecer no workspace excluído.

**Spec: PASS.**

**Qualidade: APPROVED.**

**Achados bloqueantes: nenhum. T01 pode iniciar**, após o controlador registrar este parecer e a conclusão de T00 no ledger e confirmar `STEP_STARTED` do único writer. Este parecer não libera gates G1–G8 nem valida produto anterior.

## Evidência conferida

- HEAD, origin/branch e origin/main conferidos por `git rev-parse`: respectivamente `e3dca6e1579e7e637cd039b92db482d9a46014c6`, mesmo HEAD e `bcf1a9074a7f213d64f10085242e549ecae0e187`; `git status --short` sem alterações rastreadas. Relato coerente em `task-1-report.md:5`.
- `remote-state.json:4` vincula o snapshot ao HEAD; `:25–39` registra o refresh dos dois checks para completed/success, sem reaproveitar a primeira leitura in_progress. PRs 66/67 estão explicitamente abertas. A origem remota é a leitura MCP fornecida pelo controlador; não fiz consulta remota adicional.
- Política local: baseline 21 + exceções 2, todos `expiresOn=2026-11-30`; workflow realmente usa Node 20 e `EXPO_NO_DOTENV=1 npm run quality`. Pacotes locais confirmam React 19.1.0, RN 0.81.5, Skia 2.2.12 e TypeScript 5.9.3; Jest/tsc e dependências da API existem. Isso prova presença, não execução ou compatibilidade nativa, como delimitado em `task-1-report.md:8–9`.
- Mapa `bases-por-plano.json:5–6,333–336,730–733,1119–1122,1407–1410`: as quatro bases são ancestrais de HEAD. `02b6a5d57ae11d56cb568ac47427261eb4eca229` é exatamente o pai de `60c6c4b93b77e0627c76c8d5e523d1e7c025a736`, primeira implementação Medalhão. Os 62 SHAs registrados, separando SHA do assunto, coincidem com `git rev-list <base>..HEAD`; os 259 caminhos coincidem com `git diff --name-only <base> HEAD`. Todas as referências declaradas resolvem para o SHA registrado e sua indicação inRange corresponde ao intervalo. Hashes dos quatro planos e dos oito registros de evidência disponíveis conferem com os arquivos atuais.
- O uso da mesma base conservadora é aceitável **somente como intervalo amplo para revisão futura**. `task-1-report.md:16,22–23`, `preflight-scan.md:228` e os limits do JSON (`:724–726`, `:1113–1115`, `:1401–1403`, `:1688–1690`) dizem explicitamente que isso não é revisão integral concluída, aceite antigo ou equivalência de pareceres indisponíveis. RF ainda precisa matriz de requisitos, deltas e prova de equivalência do material reutilizado.
- `preflight-scan.md:3–30` contempla os 24 cartões, incluindo T04a. A amostragem dos conflitos obrigatórios confirmou T01/T17 (`:56`), T04/T04a/T05 (`:90,106`), T09/T10 (`:162`), T11/binário (`:180,232`) e T18/T20/T21/catálogos (`:215–223`). Há produtor/consumidor, risco e resolução; interfaces amplas não concedem ownership (`:34`).
- A lista do scan é explicitamente preliminar (`preflight-scan.md:236–240`): caminhos dinâmicos e consumidores precisam lista nominal antes do writer, e retirada/política dependem inventário T15 e G4/G7. Não há autorização implícita por raiz ou grafia semelhante. O brief posterior de T01 já apresenta ownership fechado; sua implementação será objeto de outra revisão.

## Limites e pendências do controlador

`task-1-report.md:10,20` atribui corretamente sessão do cérebro e ledger ao controlador. `progress.md:35` registra a consulta e o encerramento da sessão; não abri sessão paralela nem reproduzi essa operação. A linha T00 ainda aparece pending em `progress.md:6` no instante desta revisão: registrar os vereditos e a transição antes de liberar o writer é fechamento administrativo do controlador, não falha dos artefatos do implementador.

Nenhuma tarefa de produto, aceite nativo, prazo novo ou autorização de retirada foi inferida nesta revisão.
