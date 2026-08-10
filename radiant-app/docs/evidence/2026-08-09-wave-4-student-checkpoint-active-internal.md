# Evidência — Onda 4 de checkpoints ativos internos

**Data:** 2026-08-09
**Run Loop:** `run-1786316805406-810b7633`
**Escopo comprovado:** implementação e builds do runtime `active` interno
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

## Builds internos e limite da evidência

- iOS Simulator inicial `6e4d88b8-55c2-404c-99dc-f8ce23772510`: `ERRORED`
  em `1.3.1 (7)` porque o `sentry-cli` tentou auto-upload sem organização;
- correção em `run-1786323575086-039ac065`: teste vermelho 20/21, inclusão de
  `SENTRY_DISABLE_AUTO_UPLOAD=true`, contrato verde 21/21, 13 validadores Loop,
  `STEP_SUCCEEDED` e `RUN_CLOSED`;
- retry iOS Simulator `2d718691-288d-498e-9825-a03b14411bd2`: `FINISHED` em
  `1.3.1 (7)`;
- Android `62d44f3f-30d0-4e12-b262-21b86ea6326c`: `FINISHED` em `1.3.1 (6)`
  pelo contador remoto. O APK foi instalado no AVD depois de remover a cópia
  local `1.3.1 (3)`, cuja assinatura era incompatível.

Nenhum flow Maestro foi executado antes do encerramento. Não existe evidência
nesta sessão para:

- mínimo de 20 execuções no mesmo aparelho/perfil;
- persistência p95 menor ou igual a 75 ms;
- restauração p95 menor ou igual a 100 ms;
- limite de delta p95 de cold start/Home para Lição;
- VoiceOver, TalkBack e viewport curto.

Esses itens mantêm H3/Onda 4 aberta como gate operacional. H4/Task 12 não deve
começar antes dessa medição. Os artefatos são somente internos e não foram
submetidos, promovidos ou publicados.

## Preparação reproduzível do gate

O run `run-1786322344018-5986c9cc` adicionou a instrumentação que faltava sem
promover H3: o profile ativo liga um probe local somente para persistência e
restauração; cada linha contém apenas versão, métrica fechada, modo e duração.
Cold start e Home→Lição são calculados de ponta a ponta a partir do
`commands.json` do Maestro, portanto o baseline `off` não ganha log, store ou
efeito novo. O mesmo binário/perfil é executado com Metro `off` e depois
`active`; o parser exige 20 amostras por coorte e implementa os quatro limites
do gate com p95 de posto mais próximo.

A preparação passou em **78 suítes/527 testes Jest**, **21/21** contratos
Maestro, **4/4** testes do relatório, typecheck, lint sem erros (12 warnings
preexistentes) e Visual QA com zero regressões. O EAS CLI resolveu
`checkpoint-internal-simulator` como distribuição interna, Dev Client,
simulador iOS, `development+active`, probe local ligado e sync remoto `false`.
Nenhuma dessas verificações substitui amostra em aparelho/perfil.

## Não ocorreu

Não houve OTA, submit, publicação, push, build de produção, alteração dos
arquivos de versão, sync remoto ou integração do commit pedagógico da Task 12.
O Android interno resolveu o contador remoto como `(6)`; isso não altera nem
promove a versão canônica `1.3.1 (7)`. Os estados finais dos runs Loop são a
autoridade para validação e fechamento.
