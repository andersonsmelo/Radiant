# T08 — revisão independente R1

**Spec: FAIL. Qualidade: CHANGES_REQUIRED.**

O gate de código não está aprovado. Há um P2 comprovado de identidade/contexto no resumo sem `nodeId`; a prova nativa deve aguardar a correção e nova revisão. Os demais contratos examinados têm suporte no diff e nas evidências focais. Esta decisão não aprova T08 globalmente, G1–G8, G2, T14 ou liberação.

## Objeto e integridade

- Root obrigatório: `/Users/anderson/Developer/Radiant/.claude/worktrees/trilha-2026-10-20`.
- Branch medida: `claude/trilha-medalhao-design`.
- BASE_TASK e HEAD: `2af93856693617d7c569ae36ec139dc9d338abe6`. A igualdade não significa diff vazio: o objeto é a workingtree congelada dos cinco arquivos do manifest.
- `snapshot-r1/manifest.json`: SHA256 `da5cc1ca9a31f1347bec8b93fe63c214b2550f1d07bb9fd19486ee7232e5b27d`, conferido.
- `snapshot-r1/full.diff`: SHA256 `09fb8504bd0f108c029f25e1edfa279d7df4a0305029dadadf0f06d52fddb98a`, conferido.
- Tamanho e SHA256 dos cinco arquivos correntes conferem com o manifest e com o relatório do autor. As duas evidências não rastreadas em `docs/evidence/` pertencem ao controlador e não integram o objeto de produto desta revisão.
- Brief r1, adendo r1a, relatório do implementador, STATUS, roadmap e política Loop lidos. Nenhuma sessão/run Loop foi aberta pelo revisor. O controlador já ativou o contrato Tier2.
- O diff foi consumido uma vez; a primeira saída truncou o meio e só as faixas omitidas foram recuperadas. Não foi rederivado `git diff`. Consultas externas ao diff foram focais aos contratos reais e aos corpos de funções cortados, comunicadas ao controlador.

## Achado material

### P2 — Resumo pode celebrar a avaliação seguinte e abrir seu contexto

**Arquivo:** `radiant-app/src/features/checkpoint/screens/CheckpointScreen.tsx:515`.
**Ligações:** resolução por fallback em 148–162; atualização de `lastPresentation` em 194–197; histórico em 222–230; bindings dos hooks em 270–286 e 295–315.

**Gatilho real:** abrir a avaliação sem `nodeId` num progresso que já contenha as aulas canônicas concluídas, mas ainda tenha duas ou mais avaliações disponíveis. Isso é permitido pelo catálogo e pelo serviço atuais: `createProductionCurriculumCatalog.ts:131–137` exige somente a última atividade de cada estágio para a respectiva avaliação; `JourneyRecommendationService.ts:44–56,59–85` considera as dependências diretas. `JourneyProgressService.ts:487–508` pode construir progresso inicial com aulas rastreadas e sem avaliações. Não é necessário inventar currículo nem alterar serviço.

**Comportamento:** concluir a Avaliação 1 atualiza o snapshot e faz `findFallbackCheckpoint` selecionar a Avaliação 2. O ramo `completed` prefere esse novo `checkpointNode` ao contexto guardado, desenhando a medalha em `done` e o título canônico da Avaliação 2 sob “Avaliação concluída”. Trocar apenas a preferência por `lastPresentation` não basta: o efeito de 195–197 também o sobrescreve com o fallback novo. Além disso, o histórico e os hooks continuam habilitados e recebem o ID da Avaliação 2; os hooks reais reiniciam quando `binding.flowId` muda (`useActiveCheckpoint.ts:34–57`; `useShadowCheckpoint.ts:26–79`). Isso pode iniciar/atualizar a próxima sessão como resumo/100%, embora o aluno esteja apenas vendo a conclusão da anterior. Não foi afirmada duplicação de XP ou de journal dessa segunda avaliação.

**Evidência independente, somente leitura:** probe com Node `v20.20.2`, TypeScript `transpileModule` em memória, importando `ProductionCurriculumCatalog` e `JourneyRecommendationService` reais. Nenhum arquivo de produto/teste foi criado ou alterado. Com `completedNodeIds` igual às 12 aulas canônicas e nenhuma avaliação:

```text
before: Avaliação 1 de 5 available; Avaliação 2 de 5 available;
        Avaliação 3 de 5 available; Avaliação 4 de 5 available;
        Avaliação 5 de 5 available
completed: node:checkpoint:materia-energia-e-radiacao:estrutura-atomica-e-ionizacao
fallbackAfterCompletion:
  id: node:checkpoint:materia-energia-e-radiacao:ionizante-e-nao-ionizante
  title: Avaliação 2 de 5
  status: available
```

A seleção incorreta da apresentação e os efeitos subsequentes são determinados pelas linhas acima; não houve render nativo ou novo teste de tela neste review. O teste novo “conclusão sem nodeId sobrevive ao desaparecimento do fallback” retorna snapshot contendo apenas o nó concluído, logo cobre `fallback == null` e não detecta o cenário demonstrado.

**Correção solicitada:** congelar identidade e contexto do nó que efetivamente está sendo concluído, incluindo a janela entre `setSnapshot` e o término assíncrono; usar esse contexto na apresentação e impedir histórico/start/progress para o próximo fallback enquanto o resumo estiver aberto. Preservar o término do runtime da avaliação efetivamente concluída, o próximo CTA e a possibilidade de iniciar a seguinte por navegação explícita.

**Guarda necessária:** cenário sem `nodeId` com duas avaliações canônicas disponíveis; concluir a primeira; comprovar título/medalha/unidade da primeira no resumo, nenhuma leitura de histórico nem start/progress para a segunda, um submit/um crédito/uma conclusão da primeira e nenhuma conclusão da segunda. Ver a guarda falhar no sintoma específico antes da correção. Não basta um seletor de “Avaliação concluída”, pois ele já existe no comportamento defeituoso.

## Conformidade examinada além do achado

| Contrato | Evidência e resultado |
| --- | --- |
| Bloqueada | Guarda de início, histórico e hooks; handlers também verificam valid/locked. Teste consumidor com JourneyProgressService real mantém perguntas e eventos inacessíveis. Contagem percorre dependências deduplicadas e exclui futuras/revisão/avaliação como aulas. PASS focal. |
| Identidade inválida e I/O | ID explícito usa `getSnapshotForNode`; ausência exata não cai no fallback. Serviço real procura trilha que contém o ID e, se não existe, retorna a ativa; a tela detecta ausência. I/O mantém erro recuperável. PASS focal. |
| Disponível | `getCheckpointByNodeId`/`getBatchByCheckpointNodeId` reais preservam itens e limiar por competência. Índice da unidade vem do snapshot. `JourneyMedal.paletteFor` torna checkpoint prata e locked silhueta; sem Pixel na tela. PASS focal. |
| Retomada, journal e economia | Payload pendente preservado; trava síncrona contra dois envios; aprovação persistida, retry, reforço, ledger, anúncio de vida e assinatura mantêm provas focais existentes. Nenhuma edição de serviços/catálogo/respostas/preços. PASS focal, sem alegar restauração de respostas parciais. |
| Conclusão | Sobrevive ao fallback nulo, preserva ganho/total reais e resumo confirmado não reenviou no teste. FAIL no caso de fallback substituído pelo próximo nó, conforme P2. |
| Políticas e consumidores | Só registros de CheckpointScreen foram retirados das duas baselines; prazos/allowances alheios preservados. Npm scripts reais executam os três testes de instrumentos citados no cartão. Nenhum YAML vivo identificado consumindo os labels substituídos desta tela; ocorrência `Voltar para jornada` em `reward-locked.yaml` pertence a outro consumidor. |
| Identidade global | Diff não altera Sora, Pixel global/quatro momentos, ouro funcional, AppButton/lábio, fingerprint, SDK, currículo nem política Loop. O uso de AppButton existente mantém o componente canônico. |

“Sem efeitos” de inválida/bloqueada significa sem tentativa/journal/cobrança/crédito/conclusão da avaliação. `getSnapshotForNode` chama `ensureProgress`, que pode persistir/hidratar o store de progresso (`JourneyProgressService.ts:83–86,301–313`); portanto não foi interpretado como zero escrita de storage de qualquer espécie.

## Evidência do autor conferida

Não repeti os testes sobre os mesmos bytes sem hipótese nova. Conferi comandos, cwd, Node e resultados nos logs guardados, e confrontei as ligações com o código real. O probe do P2 acima responde uma hipótese nova e não substitui teste de render.

| Evidência | Resultado conferido |
| --- | --- |
| `green-final-r1.log` | Node20.20.2; EXPO_NO_DOTENV=1; runInBand/no-cache; 4 suítes/59 testes PASS, exit0 |
| `green-limited-cpu-r1.log` | taskpolicy -b; 2 suítes/43 testes PASS, exit0 |
| `test-checkpoint-performance-report-r1.log` | 16 PASS, exit0 |
| `test-checkpoint-instrument-r1.log` | 28 PASS, exit0 |
| `test-copy-style-contract-r1.log` | 65 PASS, exit0 |
| `test-maestro-contract-r1.log` | 40 PASS, exit0 |
| `visual-qa-strict-r1.log` | 0 regressões/41 baseline/3 exceções, exit0 |
| `typecheck-r2.log`, `lint-owned-r1.log` | PASS, exit0 |

O verde contém console.error esperado dos cenários `assessment-journal-unavailable` e `after-journal`, com asserções passando. Não o tratei como falha adicional ou prova de ausência de erros em outros fluxos.

`red-original-final-mocks-r1.log` identifica fonte original `2af9385`, SHA original `eb00906360456f665226184619325bfbbd032525d7619bcf0692ea5da568b138` e registra 6 falhas/30 ignorados, exit1. Os vermelhos iniciais incidentais não são prova específica de todos os requisitos; o próprio autor delimitou isso. O caso de conclusão do backout falha antes de concluir por seletor de início e não prova a regressão de conclusão isoladamente. Mutações de fallback inválido, contagem futura, runtime bloqueado, histórico bloqueado, unidade, prata, Pixel e duplo envio falham nos sintomas indicados. A mutação de identidade falha antes da igualdade final porque não conclui no retry; é prova adicional, com esse limite explícito. Os cinco hashes atuais conferem após as restaurações relatadas.

## Limites e sequência pendente

- Este review é de código/contratos/evidência estática. Não executou build, instalação, simulador, EAS/OTA, loja, commit/push, coletor/coorte CLI ou writer/sessão Loop.
- Não existe prova nativa produzida por esta revisão. Jest/SVG inspecionado e visual:qa:strict não provam rasterização, geometria nativa, fonte máxima, VoiceOver/TalkBack, shader, FPS, Android/aparelho físico ou qualidade audível. Os scripts de desempenho validam parsers/instrumentos e não FPS da bancada.
- Após o P2, o controlador deve obter correção pelo autor, novo snapshot e revisão delta; só depois do gate de código aprovado o executor separado deve obter a prova nativa possível, registrando impedimentos exatos. Fonte máxima e limites Android compartilhados de T07 continuam pendentes, assim como G1–G8, G2/T14 e segundo dia no fechamento.
- O simulador reservado `5FD8C926` não foi consultado nem utilizado. Nenhuma limpeza, relógio, instalação ou migração foi feita.
- A validação final configurada Loop e o fechamento independente de writer/cérebro pertencem ao controlador. Não foram alegados como executados pelo revisor.
- Única escrita do revisor: este `reviewer-r1.md`. Nenhum arquivo dos cinco foi alterado, nem conteúdo alheio revertido.

## Restrições literais preservadas do brief

**Global Constraints — copiar literalmente ao brief e ao revisor:**

- Preservar Medalhão, Sora, Pixel vetorial e seus quatro momentos, ouro funcional, lábio dos botões e `runtimeVersion: fingerprint`; sem glass/glow, nova identidade ou migração de SDK.
- Primeira resposta rege estrelas; preservar economia de XP/sequência/vidas/assinatura, revisão e regras do primeiro erro. Não inventar APIs, dados semanais ou preços.
- O segundo dia fica no fechamento. Preservar o simulador `5FD8C926`: sem uso em T00–T17, limpeza, reinstalação, relógio alterado ou migração destrutiva. Confirmar UDID completo antes de qualquer uso posterior.
- Aprovar este roteiro não aprova G1–G8. Merge, build, EAS, OTA, loja, instalação, retirada de conteúdo e alteração de política exigem suas autorizações específicas. Não criar currículo novo aqui.
- Um escritor de produto por vez; só o controlador abre/fecha o writer Loop. `PROJECT_BUSY` é impedimento real, nunca motivo para contornar lock. Não editar antes de `STEP_STARTED`.
- Implementador não cria subagentes, não abre writer/sessão paralela, não faz commit/push, não altera arquivo fora do ownership. Revisor é somente leitura. Controlador coordena e registra; não corrige produto por conta própria.
- Sem reset/clean/stash/revert de trabalho alheio, leitura de caminhos sensíveis ou edição direta do vault. Git ignore não isenta um artefato do guarda Loop.



---

# T08 — revisão independente R2 (delta fix1)

**Spec: PASS. Qualidade: APPROVED. P2 R1: ADDRESSED.**

Gate de código aprovado para o objeto R2. Nenhum novo achado material no delta. A prova nativa pode seguir pelo executor separado, mantendo todos os limites e autorizações do brief; esta aprovação não resolve os gates globais nem substitui a validação final Loop do controlador.

## Objeto conferido

Root: `/Users/anderson/Developer/Radiant/.claude/worktrees/trilha-2026-10-20`.
BASE_TASK/HEAD do pacote: `2af93856693617d7c569ae36ec139dc9d338abe6`.

- Leitura de `implementer-fix1.md` e uma leitura de `snapshot-r2/delta-r1-r2.diff`, sem reabrir auditoria ampla nem rederivar diff.
- Delta SHA256 conferido: `3a3f9860f3ceaf50106dd526b6c9f9ccb5b82c8ac90853495e62df796d5992cf`.
- Manifest R2 conferido: `27b78d4c4b9e9524098a0a3842dbe1340752ec9b1e833b0d57b3eed8fafc3491`.
- Full diff R2 contra BASE_TASK conferido por hash, sem nova leitura ampla: `14700a97a54c692b4ca3b2f9110dec2acc0cd86af3d4197bbdd0cd362033d97c`.
- Cinco tamanhos/hashes correntes conferem com o manifest. Fonte `6c1beac5cb29cfa0e25b8ed5204b10e025670250c295646097f8093ee07a3e6d`; flow `89073db6fb87f163b3b792ddf86b32315f5e2256ea7d30868e33eae5d06f51d6`.
- Apenas tela e teste de fluxo mudaram desde R1; os outros três arquivos mantêm os hashes R1. Docs em escrita do controlador estão fora do objeto de cinco arquivos.

## P2 R1 — ADDRESSED

Arquivo: `radiant-app/src/features/checkpoint/screens/CheckpointScreen.tsx`.

1. **Identidade antes da espera:** `handleComplete` fixa `completionContext` com nó/unidade/número em 348–353, antes de `await markNodeCompleted` e de `setSnapshot`. Ao re-renderizar, 159–162 prioriza o ID fixado e relê o status desse ID no snapshot. O próximo fallback deixa de governar a avaliação corrente.
2. **Janela de finish:** após o novo snapshot e antes de `finish` resolver, bindings active/shadow continuam recebendo o ID/flow da primeira avaliação. Os contratos reais dos hooks já conferidos em R1 reiniciam por identidade; sem troca para a segunda, não ocorre start/progress da segunda por esse caminho. O `finish` chamado em 367 pertence ao controle capturado da primeira. A guarda de conclusão real em 362–364 continua exigindo o nó presente em `completedNodeIds` antes de celebrar.
3. **Histórico e resumo:** a guarda em 230–231 impede a reabertura do histórico com `completionContext`. A apresentação agora prefere o contexto fixado, sem o efeito antigo que o sobrescrevia pelo fallback. O ramo de retomada confirmada fixa o mesmo contexto uma vez e encerra o controle existente (326–331).
4. **Próximo CTA:** `nextAction` ainda deriva do snapshot novo em 341. O teste confirma destino explícito da segunda avaliação e pergunta inicial após nova instância dessa rota; a correção não usa o contexto congelado para decidir o próximo destino.
5. **Retry e economia:** o delta não recria `pendingSubmission`, altera respostas ou remove a trava de envio. Uma falha/recusa de conclusão conserva a avaliação aprovada e o mesmo ID para repetir a conclusão; o contexto fixado não marca `completed` por si só. As guardas de status locked/valid permanecem. O crédito segue protegido pelo conjunto de aprovações, e a regressão de retry da conclusão continua no verde focal completo. Não há mudança de serviço/catálogo/ledger/limiar.

Os dois casos novos em `CheckpointScreen.flow.test.tsx:417` usam nós do catálogo canônico, com duas avaliações disponíveis, e distinguem finish imediato de Promise pendente. As asserções verificam título/ID/unidade da primeira, nenhum histórico/binding da segunda antes e depois de liberar finish, um submit/crédito/conclusão para a primeira e flow correto de finish. O teste ainda permite a navegação explícita posterior. Não se limita ao texto genérico “Avaliação concluída”.

## Evidência da correção conferida

Todos os logs citados registram cwd radiant-app, Node `v20.20.2`, EXPO_NO_DOTENV=1 e comando completo. Não repeti testes sobre os mesmos bytes sem hipótese nova.

| Evidência | Resultado conferido |
| --- | --- |
| `fix1-red.log` | 2 falhas/37 ignorados, exit1. Ambos falham na busca por “Avaliação 1 de 5”; a árvore mostra “Avaliação 2 de 5”. No caso imediato já há resumo; no pendente a falha ocorre na janela entre snapshot e finish. É o sintoma do P2, não seletor inicial incidental. |
| `fix1-green.log` | 4 suítes/61 testes PASS, exit0; inclui retry/journal/ledger e guard real |
| `fix1-limited.log` | taskpolicy -b: 2 novas regressões PASS/37 ignorados, exit0 |
| `fix1-limited-screens.log` | taskpolicy -b: 2 suítes/45 testes PASS, exit0 |
| `fix1-typecheck.log`, `fix1-lint.log` | PASS, exit0 |
| `fix1-copy-contract.log` | 65 PASS, exit0 |

Os console.error esperados de falhas deliberadas permanecem nos verdes e não são ocultados. Os instrumentos/Maestro/visual de R1 não foram reexecutados nesta rodada nem apresentados como medição nova; o delta não os modifica. A final configurada do controlador continua pendente.

## Limites e pendências

- R2 revisa somente fix1 e risco novo introduzido. As demais conclusões de R1 são herdadas, com seu único P2 agora resolvido no código.
- Os spies conservam as funções reais dos hooks, mas Jest não prova runtime nativo/start/progress em aparelho. A prova obtida é da identidade entregue pela tela e da ligação ao contrato real dos hooks, com finish envolvido para controlar a espera. O teste de CTA remonta uma nova instância da rota; não é prova de navegação nativa.
- Não foram verificados rasterização/geometria nativa, fonte máxima, VoiceOver/TalkBack, shader/FPS, Android/aparelho físico ou áudio. Scripts de checkpoint não são FPS da bancada. Fonte máxima e limites Android compartilhados de T07 continuam conforme brief.
- G1–G8, G2/T14, segundo dia no fechamento e decisões do dono permanecem pendentes. Nenhum merge, build, EAS/OTA, loja, instalação, currículo ou alteração de política foi autorizado por esta revisão.
- Sem uso do simulador reservado `5FD8C926`, mudança de relógio, limpeza ou migração. Sem Loop, subagentes, commit/push, build/install ou comando nativo pelo revisor.
- Única escrita desta rodada: `reviewer-r2.md`; produto somente leitura. O controlador mantém a responsabilidade pela prova nativa possível, validação final configurada e fechamento independente de writer/cérebro.

## Restrições literais preservadas

**Global Constraints — copiar literalmente ao brief e ao revisor:**

- Preservar Medalhão, Sora, Pixel vetorial e seus quatro momentos, ouro funcional, lábio dos botões e `runtimeVersion: fingerprint`; sem glass/glow, nova identidade ou migração de SDK.
- Primeira resposta rege estrelas; preservar economia de XP/sequência/vidas/assinatura, revisão e regras do primeiro erro. Não inventar APIs, dados semanais ou preços.
- O segundo dia fica no fechamento. Preservar o simulador `5FD8C926`: sem uso em T00–T17, limpeza, reinstalação, relógio alterado ou migração destrutiva. Confirmar UDID completo antes de qualquer uso posterior.
- Aprovar este roteiro não aprova G1–G8. Merge, build, EAS, OTA, loja, instalação, retirada de conteúdo e alteração de política exigem suas autorizações específicas. Não criar currículo novo aqui.
- Um escritor de produto por vez; só o controlador abre/fecha o writer Loop. `PROJECT_BUSY` é impedimento real, nunca motivo para contornar lock. Não editar antes de `STEP_STARTED`.
- Implementador não cria subagentes, não abre writer/sessão paralela, não faz commit/push, não altera arquivo fora do ownership. Revisor é somente leitura. Controlador coordena e registra; não corrige produto por conta própria.
- Sem reset/clean/stash/revert de trabalho alheio, leitura de caminhos sensíveis ou edição direta do vault. Git ignore não isenta um artefato do guarda Loop.



---

# T08 — revisão independente nativa R3 — 28/10/2026

**Spec: BOUNDED. Qualidade: APPROVED_CORE_BOUNDED. Nenhum novo P1/P2 material de T08 identificado no pacote obtido.**

O percurso principal está demonstrado em iOS e Android, com identidade, contagens, erro deliberado, reforço e economia coerentes com o contrato. A aprovação se limita aos cenários efetivamente obtidos. Não concede PASS universal de layout, retomada persistida ou fonte máxima. As lacunas abaixo têm resolução explícita: continuam **não verificadas**, sem conversão em defeito presumido nem aprovação implícita.

## Objeto e integridade

Root: `/Users/anderson/Developer/Radiant/.claude/worktrees/trilha-2026-10-20`. Pacote sobre BASE_TASK `2af93856693617d7c569ae36ec139dc9d338abe6`, branch `claude/trilha-medalhao-design`.

- Li `brief-r1.md`, `brief-addendum-r1a.md`, `reviewer-r2.md`, `native-report.md`, `provenance.json`, `cleanup.json`, `native-candidate-manifest.json` e o objeto versionado `docs/evidence/2026-10-28-medalhao-t08-native.json`. O gate de código R2 permanece herdado: Spec PASS/Qualidade APPROVED/P2 ADDRESSED (`reviewer-r2.md:3–17,19–29`). Não reabri a revisão integral do código nem repeti testes sobre os mesmos bytes.
- Manifesto fonte R2: `27b78d4c4b9e9524098a0a3842dbe1340752ec9b1e833b0d57b3eed8fafc3491`. Cinco arquivos correntes conferem com `sourceAfter`; os três arquivos canônicos também conferem com os hashes de proveniência. O vínculo é preservado (`docs/evidence/2026-10-28-medalhao-t08-native.json:5–55`).
- Manifesto nativo congelado SHA256 `029cd52cdb931e09ee441d007bb12f8c9369c6501d101c44fa0a13f0f4b0a6b3`: **117/117** tamanhos/hashes conferidos, nenhum mismatch. Report nativo SHA256 `9619773296603014e2554f42b69151430fb00c355ae07cb9c52e0d1f38f1b1df`, também conferido (`native-candidate-manifest.json:557–559`).
- As **14/14** cópias PNG versionadas são idênticas às fontes declaradas; seus registros de UI têm os hashes declarados e o conteúdo embutido coincide com JSON/XML de origem. As cópias de `provenance` e `cleanup` coincidem integralmente com os objetos congelados. Objeto versionado SHA256 desta leitura: `21c984102be9a6f1cc2c119f5ddfec40f0f682425897bedb435943040fe1097d`.
- Inspecionei visualmente os 14 PNGs de `captures[]` e cinco complementos: `native-ios-locked-max-ready.png`, `native-ios-locked-max-scroll1.png`, `native-ios-available-max-explicit-stable.png`, `native-ios-error-selection-real.png` e `native-android-error-selected-max.png`. A leitura dos registros UI foi ligada ao conteúdo visto, sem inferir resultado apenas pelo nome do arquivo.

O ambiente é cliente de desenvolvimento existente 1.4.0(3) + JS Metro desta worktree, iOS26.5/E262D4C1 e AVD Android API34/emulator-5554. Isso sustenta a prova em emuladores deste candidato; não prova build de release, aparelho ou produção (`native-report.md:7–11`; `provenance.json:15–49`).

## Requisitos verificados

Nesta seção, os caminhos de capturas curtos são relativos a `docs/evidence/assets/2026-10-28-medalhao-t08/`; raw e complementos ficam na pasta deste relatório. As referências `native-runtime.jsonl:L` são linhas de comandos e saídas registradas, não novas execuções deste revisor.

| Requisito | Veredito e evidência conferida |
| --- | --- |
| Bloqueada separada, números reais e nenhum acesso pelo CTA | **PASS no percurso medido.** `ios-locked.png`/`android-locked.png`: silhueta, unidade 1, Avaliação 1 de 5, “Abre depois das 3 aulas. Faltam 3.”, retorno à trilha; 66 XP/5 vidas. UI confirma os mesmos rótulos e somente os alvos de retorno. Objeto versionado: linhas968–1023 e1315–1324. Ausência geral de hooks/efeitos em bloqueio continua sendo a prova automatizada revisada em R2, não algo deduzido de uma imagem. |
| ID inválido retorna à trilha sem prêmio | **PASS no percurso medido.** `ios-invalid-return.png`/`android-invalid-return.png` mostram Home/trilha, 66 XP/5 vidas; UI identifica a trilha e navegação, sem avaliação substituta. Objeto: linhas1025–1077 e1326–1335. A Home legada não invalida o adendo: o nó real foi alcançado por ID explícito, sem alterar storage/trilha ativa (`native-report.md:15`). |
| Disponível legítima, prata e regra de 2 questões/todas | **PASS.** `ios-available.png` e `android-available.png`: medalha prata, unidade 1, Avaliação 1 de 5, regra real e Começar avaliação. 120 XP/5 vidas após pré-requisitos. Objeto: linhas909–966 e1304–1313. A progressão real 66→84→102→120 está nas saídas iOS49/53,62/64,73/75 e Android275/278,292/295,309/312 de `native-runtime.jsonl`. |
| Erro deliberado, regra de aprovação e uma vida no percurso | **PASS.** Os dois complementos `error-selection-real`/`error-selected-max` mostram “Mais negativa” selecionada no item 1 com 5 vidas. `ios-wrong.png`/`android-wrong.png` mostram 1 de 2, aprovação exige 2, reforço necessário, 120 XP e4vidas. Raw iOS90–98 e Android321–337 liga seleção/avanço às saídas. Não usei `native-ios-wrong-once` como prova de erro. Objeto: linhas1133–1195 e1348–1357. |
| Reforço legítimo das três atividades antes do retry, sem XP adicional | **PASS no percurso medido.** Raw iOS123,136,151 e Android354,376,398 registra “Sem XP nesta tentativa”; os retornos preservam120XP/4vidas. Só depois dos três resumos o início fica disponível: iOS157 e Android403. O primeiro feedback iOS de reforço não foi confundido com conclusão: a conclusão real SemXP é posterior, como documentado (`native-report.md:25,45`; `provenance.json:54`). |
| Duas respostas corretas, conclusão e crédito observados | **PASS no percurso medido.** iOS196/203 seleciona as duas respostas corretas e205 apresenta +18XP/total138. Android ações15–18 em `native-android-actions.jsonl` registra Mais positiva, Próxima questão, resposta canônica e Enviar avaliação; raw424 apresenta medalha prata/conclusão/+18XP/total138. `ios-completed.png` e `android-completed-maximum.png` corroboram UI e rasterização legíveis. O resumo não escreve2/2: o resultado vem das duas escolhas sob a regra real de dois acertos, sem inventar esse rótulo. Objeto: linhas1197–1249 e1370–1379. |
| Reentrada já aprovada na mesma instância | **PASS limitado a essa condição.** `ios-resume.png` e `android-resume.png` mantêm Avaliação1de5/+18XP/total138 e CTA seguinte legíveis; UI correspondente confere. Objeto: linhas1079–1131 e1337–1346. Isso não amplia a prova para processo encerrado, cursor parcial ou ledger em todos os cenários. |
| Layout disponível/bloqueada iOS com fonte inicial máxima e rolagem | **PASS limitado a esses estados.** Os complementos iOS máximos mostram topo/título/medalha e, após rolagem, regra completa3/3 ou2/todas e CTA completo. `ios-maximum.png` é o trecho inferior disponível com Começar avaliação inteiro, não resultado concluído. O título quebra em várias linhas na escala máxima; as capturas complementares mostram conteúdo alcançável por rolagem, sem comprovar que todos os estados tenham sido cobertos. Objeto: linhas1251–1302; `native-report.md:20,23,34`. |
| Layout Android desde a entrada com fonte2.0 | **PASS limitado ao obtido.** `android-maximum.png`, `android-available.png`, `android-wrong.png`, `android-completed-maximum.png`: textos essenciais e CTAs legíveis, inclusive CTA de reforço em duas linhas e resultado completo. A captura errada rolada conserva feedback/regra/CTA. A UI XML confirma alvos e texto. Não aceitei `locked-max-reentry` em cache como fonte máxima inicial (`provenance.json:61–62`). |

As telas de avaliação/resultados inspecionadas não exibem Pixel, jargão visível “checkpoint/jornada/indisponível” ou troca da identidade Medalhão. A Home de retorno pode conter Pixel porque é a trilha, não o estado de avaliação. O lábio dos botões e medalha de prata/silhueta estão visíveis. Não generalizo esta observação para todos os momentos do aplicativo.

## Limites que impedem PASS integral

1. **Resultado concluído iOS na fonte máxima: NÃO VERIFICADO.** O PNG não foi criado. `native-ios-completed-max-reentry-top/bottom` é início após encerrar/reabrir; raw215 mostra138XP persistido e219 mostra138XP + Começar avaliação. Isso não pode ser usado como prova visual do resultado máximo. O objeto exclui explicitamente `ios-completed-maximum.png` (`docs/evidence/2026-10-28-medalhao-t08-native.json:1381–1384`; `native-report.md:36–38`). Resolução: manter o requisito aberto; este R3 não exige fabricar resumeID nem repetir E2E autorizado como encerrado.
2. **Resumo após processo encerrado e respostas parciais/cursor: NÃO VERIFICADOS.** iOS demonstrou XP persistido e tela de início na rota direta; Android não mediu cold summary. O caminho de treino existente não estabelece um defeito de persistência por si só. “Retomada” no pacote significa reentrada na mesma instância. O contrato já impede prometer respostas parciais não restauradas (`brief-r1.md:95`; `provenance.json:33–36,47–49`). Resolução: nenhuma alegação de cold summary/partial answers aprovada.
3. **Resultado Android normal1.0: NÃO VERIFICADO separadamente.** O resultado real é em2.0. Não há `android-completed.png`; a aprovação visual do resultado2.0 não cria uma medição1.0 (`native-report.md:38`; objeto:1381–1384).
4. **Mudança de fonte ao vivo: NÃO APROVADA.** iOS não atualizou confiavelmente; Android perdeu a rota para Home com aviso de linking em múltiplos lugares. Isso é condição reproduzida/compartilhada de T07, não ausência de defeito. A reabertura permitiu verificar fonte máxima inicial; não corrigiu nem aprovou o live change (`native-report.md:34`; `provenance.json:49`). Resolução: manter limite/bloqueio compartilhado explícito, sem reivindicar conserto em T08.
5. **Commit único/economia geral:** esta execução coerente comprova os efeitos desse percurso; unicidade e idempotência em todas as corridas/retries permanecem sustentadas pela revisão automatizada R2. Uma captura de +18XP repetida no resumo não é uma segunda concessão nem prova universal de ledger (`native-report.md:30`; `reviewer-r2.md:23–29,35–44`).

Não encontrei claim nativo central sem artefato correspondente que exigisse nova rodada de execução para decidir este veredito. Os nomes malsucedidos/históricos foram rejeitados como prova conforme `provenance.json:52–62` e `native-report.md:42–48`. As lacunas acima continuam abertas de forma explícita; **BOUNDED não encerra esses critérios**.

## Limpeza, escopo e próximo gate

`cleanup.json:3–16,175–225` registra CLEAN: fonte Android1.0 lida, animações0/0/0 preservadas, PIDs próprios ausentes, AVD/par de app e simulador alvo encerrados, nenhum booted e porta8081 sem escuta. A fonte iOSlarge é registrada antes do shutdown no runtime. Os hashes5+3 correntes conferem com o final congelado. Esta é revisão das evidências de limpeza na hora registrada, sem nova inicialização/consulta aos dispositivos. Nenhum comando deste revisor foi dirigido ao reservado5FD8C926.

O gate global de layout permanece **BLOCKED** pelos P2 PushOptIn máximo/P3 de T06/T17 já mantidos pelo controlador; esta revisão de T08 não os reclassifica. G1–G8, G2/T14, segundo dia, aparelho físico, fala audível de VoiceOver/TalkBack, FPS/shader/bancada e produção seguem fora da prova. Testes dos scripts de checkpoint não são medição de FPS. Nenhum build, instalação, merge, EAS/OTA, loja ou política foi aprovado aqui (`brief-r1.md:30–36,105–106`; `native-report.md:56–58`).

**Próximo passo autorizado:** controlador pode consolidar o resultado de T08 como núcleo nativo aprovado com limites, executar sua única validação final configurada e fechar writer/cérebro na ordem do contrato. Se um gate posterior exigir resultado iOS máximo/cold summary/normal Android, deve tratá-los como requisitos ainda não verificados, não reutilizar nomes enganosos nem declarar T08 integralmente validado por este R3.

Única escrita R3: `reviewer-native-r3.md`. Produto e artefatos congelados somente leitura; sem E2E novo, Loop, subagentes, build/install, app/simulador/AVD/Metro, commit ou push.
