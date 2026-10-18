# G4 — resposta antes do gabarito na revisão

**Data:** 2026-10-17, America/Bahia.  
**Autoria:** OpenAI Codex, família GPT-6; variante exata não exposta.  
**Base:** `codex/radiant-study-improvements`, HEAD `2c1b5f0bccf15d1fbf5b9dd7a48d51bd0d85e24b`, com camadas anteriores e reorganização documental não commitadas, preservadas.  
**Método:** rastrear a tela ativa `/review`, corrigir pelo catálogo atual, exercitar componente/hook/serviço/repositório e uma atividade promovida real, testar corrupção da referência temporal e injetar quatro defeitos discriminantes. [código] é prova local; [usuário], direção recebida; [inferido], limite ou continuidade propostos. Não houve novo estudo clínico, teste com alunos ou execução nativa.

## Mudança no caminho ativo

[código] Antes, `ReviewCard` revelava o gabarito e solicitava “Acertei”/“Revisar depois”. Agora apresenta alternativas selecionáveis e exige Confirmar resposta. `recordAnswer` recebe índice ou pedido de ajuda e calcula o resultado pelo catálogo atual, associado a item/versão. Não confia num booleano nem no gabarito carregado pela interface.

[código] O journal confirma a tentativa e a agenda antes de abrir a explicação. A primeira resposta não pode ser substituída após o envio. A tela mantém feedback até Continuar; não pula imediatamente para outro item. Dois envios concorrentes confirmam uma vez. Em falha, o gabarito permanece oculto e o retry conserva escolha e data em memória. A opção Ver resposta com ajuda confirma `skipped`, marca ajuda e não gera XP de acerto. A escolha não é persistida no journal: somente resultado, ajuda, duração em faixa e identidades permitidas.

[código] A tela ativa usa `submitAnswer`/`continueReview`; as fachadas antigas `submitRating`/`recordReview` permanecem por compatibilidade, sem ligação ao componente ativo. Vidas/recompensa de sessão conservam seu contrato existente; a revisão continua acessível sem vidas. O agregado e o sync são secundários ao journal. Não se afirma transação global entre XP, jornada, vidas e storage.

## Evidência e referência temporal

[código] O modo `review-answer` registra a referência do cartão: confirmação anterior, vencimento e presença de tentativa anterior. O repositório exige que esses valores correspondam ao cartão salvo e que a revisão esteja vencida. Referências adulteradas são recusadas sem alterar o store. O retry confirmado é idempotente, mesmo com outro timestamp recebido posteriormente.

[código] Conteúdo promovido sem ajuda projeta `independent-recall`; consulta à resposta projeta `guided-practice` com ajuda. Conteúdo legado continua `legacy-lesson-recall`, sem promoção de competência sintética. Resultado incorreto continua incorreto; não é substituído por acerto depois de ler a explicação. Campos de duração seguem `unknown` onde não há instrumento.

[inferido] `itemReviewTiming` é uma classificação operacional: `unverified` se falta tentativa anterior confirmada; `after-interval` se o vencimento foi alcançado e passaram ao menos 24 h desde a confirmação anterior; `same-day` nas demais referências com tentativa anterior. O limite de 24 h é um critério conservador da implementação, não uma recomendação científica validada. A agenda SM-2 existente tem intervalo inicial de um dia.

[código] Esse sinal não converte evidência em `delayed-retention`, não pontua retenção automaticamente e não ativa adaptação. Rever o mesmo item não prova transferência, retenção longitudinal, qualidade técnica profissional ou eficácia clínica. Uma política para promover evidência retardada ao cálculo de domínio exige validação pedagógica e decisão de produto.

## Evidências executadas

[código] **Nove suítes/126 testes focados**, no Node 20: cartão, hook, tela de revisão, coordenador, journal, projeção de evidência, domínio, tela de avaliação e histórico de avaliações. A integração sem mock do coordenador conclui a revisão de uma atividade promovida real, conserva primeira resposta sem ajuda, registra referência após intervalo e só finaliza a sessão depois de Continuar.

[código] Cobertura inclui gabarito ausente antes da confirmação, ajuda sem autodeclaração de acerto/XP, seleção bloqueada após envio, dois toques imediatos, falha sem feedback, retry com os mesmos argumentos/data, versão incompatível, índice inválido, gabarito adulterado na UI, referência temporal falsa e distinção entre cartão migrado e tentativa anterior confirmada.

[código] Vermelho inicial: os dois novos testes do cartão falharam contra a interface anterior por ausência de seleção/confirmação e de ajuda explícita. Erros de invocação do Jest fora do diretório do app e de fixture/rerender não contam como evidência de produto. Os testes atuais representam o novo contrato; os casos de temporizador de autodeclaração antiga foram substituídos porque esse fluxo saiu da tela ativa.

[código] Quatro mutações, cada uma isolada com âncora única e restaurada byte a byte em `finally`. Cada uma produziu **uma falha de asserção/zero passes** no teste discriminante selecionado:

- corrigir pelo gabarito adulterado da UI;
- expor feedback apesar da falta de confirmação da escrita;
- revelar o gabarito antes de receber resposta;
- aceitar referência temporal diferente do cartão persistido.

O verde final é medido após restaurar as injeções. O resultado completo do app, contratos, tipos, lint, API e conteúdo pertence aos validadores do run, não apenas às suítes focadas. Não há prova de CI remoto, iOS/Android distribuído, VoiceOver ou desempenho em aparelho nesta entrega.

## Reprodução

No Node 20, a partir de `radiant-app`:

```bash
node node_modules/jest/bin/jest.js --runInBand src/features/review/components/ReviewCard.test.tsx src/features/review/hooks/useReview.test.ts src/features/review/screens/ReviewScreen.flow.test.tsx src/features/spaced-repetition/services/ItemReviewService.test.ts src/features/spaced-repetition/repositories/ItemReviewRepository.test.ts src/features/mastery/repositories/LearningEvidenceRepository.test.ts src/features/mastery/services/CompetencyMasteryService.test.ts src/features/checkpoint/screens/CheckpointScreen.flow.test.tsx src/features/student-checkpoints/AssessmentAttemptRepository.test.ts
```

Run `run-1792269695725-1c4f438c`; consultar gate/fechamento com `loop run status --run run-1792269695725-1c4f438c`. Sessão `brain-session-1792269181556-0098c53e` encerrada antes de abrir o escritor, pois `brain-links` reentra na CLI. Fechamento público por `validate → step finish → memória opcional → run close`, conferindo cada envelope.

## Consumidores nativos e escopo

[código] O primeiro run `run-1792269219490-0cb9aaad` aprovou os 15 validadores e
foi encerrado. Na conferência dos consumidores, dois flows Maestro ainda tocavam
Mostrar resposta/Acertei. Como o escopo do Loop é imutável, o fechamento passou
a `run-1792269695725-1c4f438c`, com esses flows e seu contrato declarados; nenhum
arquivo foi editado fora da declaração e não houve escritores simultâneos.

[código] `review-due.yaml` e `rating-prompt.yaml` selecionam a primeira alternativa
por ID real do componente, confirmam, aguardam feedback e pressionam Continuar.
O roteiro aceita acerto ou erro porque não certifica gabarito; a correção é testada
no serviço. O diálogo nativo da Apple continua obrigatório no flow que o verifica.
O contrato desse flow falhou antes da atualização (1 falha/28 ignorados), nomeando
os dois botões antigos. Contratos locais não substituem execução Maestro.
Os 29 contratos do Maestro passaram após a atualização, assim como os três
testes do componente, incluindo seleção pelo mesmo ID usado nos roteiros.

## Limites e continuidade

[usuário] Implementação no mecanismo compartilhado; aula piloto não é gate. Avaliação final aprovada libera a próxima unidade; conquista fica opcional. Não se alteraram aprovação curricular, reforço, rollout V3, direitos de conteúdo ou material promovido.

[código] Permanecem tetos de histórico e lacunas de backup/reset/recuperação G7. O cartão pode perder sua tentativa antiga por evicção do histórico; não se presume confirmação ausente. O novo modo é local; versões antigas que desconheçam seu schema de campos recusam o envelope em vez de sobrescrevê-lo como vazio. A janela entre crédito de XP e conclusão da jornada continua fora de uma transação conjunta. Sem build, execução em simulador/aparelho, publicação, commit, push ou merge.

[inferido] Próximo pacote: QA nativo da seleção, confirmação, ajuda, erro/retry, retomada e texto ampliado/VoiceOver; desempenho G6 e compatibilidade/recuperação G7. O critério pedagógico de evidência retardada continua pendente. Produção editorial real G3, acervo G5, mapa amplo e P1 permanecem no programa global.

## Fontes locais — acesso em 2026-10-17

- [Cartão](../../radiant-app/src/features/review/components/ReviewCard.tsx), [testes](../../radiant-app/src/features/review/components/ReviewCard.test.tsx), [tela](../../radiant-app/src/features/review/screens/ReviewScreen.tsx).
- [Hook ativo](../../radiant-app/src/features/review/hooks/useReview.ts), [integração](../../radiant-app/src/features/review/hooks/useReview.test.ts), [correção pelo catálogo](../../radiant-app/src/features/spaced-repetition/services/ItemReviewService.ts), [testes](../../radiant-app/src/features/spaced-repetition/services/ItemReviewService.test.ts).
- [Contrato/projeção/sinal temporal](../../radiant-app/src/types/itemReview.ts), [journal](../../radiant-app/src/features/spaced-repetition/repositories/ItemReviewRepository.ts), [testes](../../radiant-app/src/features/spaced-repetition/repositories/ItemReviewRepository.test.ts), [cálculo de domínio preservado](../../radiant-app/src/features/mastery/services/CompetencyMasteryService.ts).
- [Integração anterior das avaliações](2026-10-17-trilha-g4-avaliacoes-no-journal.md), [plano global](../trilha/plano/2026-10-16-loop-global-de-evolucao-da-trilha.md), [estado](../STATUS.md), [fila](../FILA.md).

- [Roteiro de revisão](../../radiant-app/.maestro/review-due.yaml), [roteiro do diálogo da loja](../../radiant-app/.maestro/rating-prompt.yaml), [contrato dos roteiros](../../radiant-app/scripts/maestro-contract.test.mjs).
