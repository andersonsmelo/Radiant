# Primeira vitória após a apresentação — Design

**Data:** 2026-08-09
**Status:** aprovado
**Decisor:** Anderson (proprietário do projeto)

## Objetivo

Encurtar o caminho entre a primeira abertura do Radiant e a primeira atividade
respondida sem retirar a apresentação aprovada em 2026-08-02 e sem pular os
passos pedagógicos da primeira lição.

Hoje a pessoa conclui três telas de apresentação, chega à Home, procura o próximo
passo e só então abre a lição. A mudança remove apenas a passagem intermediária
pela Home: o CTA final da apresentação passa a abrir o próximo passo elegível da
jornada.

## Entendimento aprovado

- As três telas atuais, sua cópia, o aviso educacional e a acessibilidade são
  preservados.
- **Começar** abre diretamente o próximo passo elegível da jornada.
- Em uma instalação nova, esse passo é a primeira lição.
- A lição começa no primeiro passo e mantém contexto e ensino antes da questão.
- **Pular apresentação** continua levando à Home.
- **Rever apresentação** continua apenas fechando a apresentação e retornando à
  tela anterior.
- Conteúdo v2, Task 10, agendador, backend e publicação nas lojas ficam fora do
  escopo.

## Premissas e requisitos não funcionais

- O destino vem do snapshot atual de `JourneyProgressService`; nenhum id de
  lição fica fixado no primeiro uso.
- Instalações antigas preservam o progresso: se a recomendação atual for uma
  retomada ou revisão, esse é o destino aberto.
- A saída é persistida antes da tentativa de navegação.
- Não há nova coleta, PII, dependência de rede ou trabalho adicional no
  bootstrap.
- Ausência de nó elegível, rota inválida ou falha ao ler a jornada degrada para
  a Home.
- A coordenação evita persistência e navegação duplicadas sob toque repetido.
- A manutenção continua dividida por responsabilidade: apresentação em
  `WelcomeFlowScreen`, estado em `FirstRunService` e elegibilidade/rota nos
  serviços da jornada.

## Abordagens consideradas

### 1. Coordenar no `RootLayout` — escolhida

O `RootLayout` já é o dono do gate de primeiro uso e decide quando o `Stack`
passa a existir. Ele persiste a saída, consulta a jornada, guarda o destino e
navega somente depois de montar o `Stack`.

Essa forma mantém `WelcomeFlowScreen` reutilizável e impede que
`FirstRunService` conheça rotas da jornada.

### 2. Navegar dentro de `WelcomeFlowScreen`

Descartada porque mistura apresentação, persistência e domínio da jornada. A
mesma tela também serve à ação **Rever apresentação**, onde abrir uma lição seria
incorreto.

### 3. Fazer `FirstRunService` devolver a rota

Descartada porque transforma um serviço de estado local em conhecedor da
jornada e do Expo Router, unindo domínios com ciclos de vida diferentes.

## Fluxo final

### Conclusão

1. `WelcomeFlowScreen` chama `onFinish('completed', 3)`.
2. Uma guarda no `RootLayout` recusa nova saída enquanto a primeira está em voo.
3. O coordenador aguarda `FirstRunService.markSeen('completed', 3)`.
4. Obtém o snapshot atual por `JourneyProgressService.bootstrap()`.
5. Valida `nextRecommendedNode` com `canOpenJourneyNode()` e produz o destino por
   `getJourneyNodeHref()`.
6. Guarda o destino como navegação pendente e desmonta a apresentação.
7. Depois de o `Stack` montar, um efeito consome o destino uma vez e executa
   `router.replace()`.

### Salto

1. `WelcomeFlowScreen` chama `onFinish('skipped', passo)`.
2. O coordenador aguarda `FirstRunService.markSeen()`.
3. Desmonta a apresentação sem consultar a jornada e sem produzir destino.
4. A Home é exibida pelo `Stack`.

### Falha

Falha de snapshot, nó ausente ou rota não navegável não mantém a pessoa presa na
apresentação. O coordenador registra o erro pela observabilidade existente,
limpa o destino pendente e monta a Home. Nenhum detalhe pessoal entra no evento.

## Testes

`radiant-app/src/features/first-run/startup-gate.flow.test.tsx` deve provar:

- `markSeen()` termina antes da navegação;
- a conclusão usa o `nextRecommendedNode`, sem id hardcoded;
- `router.replace()` roda depois da montagem do `Stack`;
- o salto não consulta nem abre a jornada;
- toque duplo produz uma persistência e uma navegação;
- nó ausente, não navegável ou erro de snapshot cai na Home;
- uma recomendação de retomada/revisão é preservada.

`radiant-app/.maestro/first-run.yaml` deve atravessar as três telas e afirmar o
primeiro passo da lição depois de **Começar**. O contrato em
`radiant-app/scripts/maestro-contract.test.mjs` deve prender essa transição à
interface real. O subflow `dismiss-first-run.yaml` e `boot-to-home.yaml`
continuam provando **Pular → Home**.

A validação inclui suíte focada, contrato Maestro, lint, typecheck e todos os
validadores do Loop. O flow Maestro deve ser executado em simulador quando o
runtime estiver disponível sem concorrer com `loop validate`; se não estiver,
essa evidência permanece explicitamente pendente.

## Sinalização documental

A implementação atualiza o roadmap ativo e cria
`docs/EXECUTION_STATUS_2026-08-09.md`, substituindo o status de 08-08. O novo
status registra que as três telas permanecem intactas e que somente a passagem
intermediária pela Home foi removida.

## Decision log

| Decisão | Alternativas | Motivo |
| --- | --- | --- |
| Preservar as três telas | compactar ou remover | o dono aprovou preservar a apresentação existente |
| **Começar** abre a jornada; **Pular** abre a Home | ambos abrirem o mesmo destino | o salto precisa continuar honesto e não forçar estudo |
| Começar a lição no primeiro passo | saltar direto para a questão | contexto e ensino são parte do contrato pedagógico |
| Coordenar no `RootLayout` | tela ou serviço navegarem | é o dono do gate e da montagem do `Stack` |
| Derivar o destino do snapshot | fixar `lesson-1` | preserva progresso, revisão e evolução do catálogo |
| Falhar para a Home | manter o gate ou exibir erro bloqueante | o primeiro uso não pode impedir o acesso ao app |
