# Evidência — Onda 4 de checkpoints ativos internos

**Data:** 2026-08-09
**Run Loop:** `run-1786316805406-810b7633`
**Escopo comprovado:** implementação local do runtime `active` interno
**Gate da onda:** ainda aberto para dispositivo/perfil interno

## Entrega local

- `active` só resolve em ambiente `development` com opt-in explícito; produção
  força `off`, `preview` continua em `shadow` e valor inválido falha para `off`;
- profile EAS dedicado `checkpoint-internal`, com distribuição interna e sync
  remoto herdado como `false`;
- uma única retomada global, com CTA explícito antes de qualquer navegação;
- allowlist direta limitada a apresentação, Lição, Revisão e checkpoint de
  unidade; as oito superfícies restantes continuam pela Home canônica;
- primeiro mismatch preserva o checkpoint e retorna à Home; o segundo invalida;
- storage indisponível não bloqueia o estudo;
- resposta, texto livre, PII, PHI e mídia continuam fora do checkpoint. Quando
  uma Lição foi interrompida depois de uma interação não commitada, a retomada
  volta à interação em vez de presumir uma resposta;
- JourneyProgressService, LessonOutcomeService, revisão, gamificação e filas
  legadas permanecem autoridades. Esta onda somente encerra o checkpoint ativo
  como `superseded` depois da confirmação legada; não liga o commit da Task 12.

## TDD e validação local

O vermelho inicial teve cinco suítes falhando pelos contratos ainda ausentes:
runtime ativo, retomada global, modo `development+active`, cursor inicial da
Lição e props de retomada da apresentação. Depois da implementação:

- matriz focada: **11 suítes/98 testes**;
- módulo `student-checkpoints`: **10 suítes/102 testes**;
- `npm run quality`: **77 suítes/523 testes**, typecheck, contratos estáticos,
  Visual QA com **0 regressões**, lint com **0 erros** e 12 warnings preexistentes;
- contrato Maestro: **20/20**;
- resolução do profile pelo EAS CLI 16.32.0, em iOS e Android: distribuição
  `internal`, dev client, `EXPO_PUBLIC_APP_ENV=development`,
  `EXPO_PUBLIC_STUDENT_CHECKPOINT_MODE=active` e
  `EXPO_PUBLIC_ENABLE_REMOTE_SYNC=false`;
- `git diff --check`: exit 0.

O flow `.maestro/student-checkpoint-active-resume.yaml` cobre instalação limpa,
abandono no segundo slide, modo avião, kill/relaunch, ausência de redirect antes
do CTA, retomada explícita e retorno à Home.

## Limite da evidência

Não havia simulador iOS inicializado e `adb` não estava disponível. Portanto o
flow novo não foi executado e não existe evidência nesta sessão para:

- mínimo de 20 execuções no mesmo aparelho/perfil;
- persistência p95 menor ou igual a 75 ms;
- restauração p95 menor ou igual a 100 ms;
- limite de delta p95 de cold start/Home para Lição;
- VoiceOver, TalkBack e viewport curto.

Esses itens mantêm H3/Onda 4 aberta como gate operacional. H4/Task 12 não deve
começar antes dessa medição. Um build pelo profile interno também não foi
disparado porque EAS/conta e eventual consumo de quota pertencem ao dono.

## Não ocorreu

Não houve build, OTA, IPA/AAB, publicação, push, alteração da versão `1.3.1
(7)`, sync remoto ou integração do commit pedagógico da Task 12. O estado final
do run Loop é autoridade para validação, sucesso, memória e fechamento.
