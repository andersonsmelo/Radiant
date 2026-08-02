# Radiant — Execution Status (2026-08-02)

Este documento **substitui [`EXECUTION_STATUS_2026-07-29.md`](EXECUTION_STATUS_2026-07-29.md)**
como estado canônico. O snapshot anterior — estendido em 2026-07-30, 07-31 e
08-01 com todo o histórico de preparação de lançamento (loja, contas de
desenvolvedor, closed testing, entitlement de premium, currículo v2) —
**permanece histórico e não foi reverificado nesta sessão**. Esta sessão é uma
task de sinalização com escopo travado: registrar que a apresentação de
primeiro uso do Pixel foi entregue e validada em E2E, mover os ponteiros que
apontavam para o documento anterior, e nada além disso. Para o estado de
lançamento (Play Console, App Store Connect, testadores, entitlement,
currículo v2), o documento substituído continua sendo a fonte — nada ali foi
invalidado por este trabalho.

## Status canônico atual

O Radiant é um aplicativo educacional de radiologia **local-first**. O app
abre, oferece catálogo local, registra progresso e permite revisão mesmo
quando a API remota está ausente. A API pública em
`api.radiant.ascendcreative.com.br` permanece **inativa** (HTTP 502) — estado
herdado do documento substituído, **não reverificado nesta sessão** — e não
está no caminho crítico do lançamento local-first.

## O que mudou nesta data — apresentação de primeiro uso do Pixel

A abertura do app mudou: **instalação limpa agora vê a apresentação do Pixel
antes da Learning Road.** A apresentação tem três telas puláveis, narradas
pelo mascote Pixel, explicando o método de estudo. O gatilho é a **ausência**
da chave `@radiant/first_run_v1` no `AsyncStorage`: uma instalação **já
existente**, que nunca teve essa chave, também vê a apresentação **uma vez**,
sem nenhum código de migração. A nova ordem de abertura é splash → bootstrap →
beta gate → apresentação → Learning Road.

A decisão de reintroduzir uma apresentação de primeiro uso — depois que a B6
do roadmap de lançamento havia recomendado ficar **sem** wizard de onboarding
— está registrada em
[`docs/adr/ADR-2026-08-02-apresentacao-de-primeiro-uso.md`](adr/ADR-2026-08-02-apresentacao-de-primeiro-uso.md).
O ADR separa duas categorias que a B6 tratava como uma só: o wizard de setup
removido (que **coletava** preferências, não persistia e para o qual nenhuma
tela navegava — essa remoção segue valendo) e a apresentação de primeiro uso
(que apenas **explica** o produto, pulável em qualquer tela, sem coleta de
dados).

### E2E medido hoje

Execução em simulador iOS, commit `728ca8d`, build Release local (bundle
embutido, sem servidor de desenvolvimento), simulador `Radiant iPhone 17 Pro`
/ iOS 26.5, Maestro 2.7.0. Flows rodados sequencialmente, um por vez:

| Flow | Resultado |
| --- | --- |
| `first-run.yaml` | passou |
| `boot-to-home.yaml` | passou |
| `learning-critical-path.yaml` | passou |
| `offline-relaunch.yaml` | passou |
| `store-capture.yaml` | **falhou** — ver "Pendência" abaixo |

**Android não foi executado nesta sessão.** O estado `passed` de 2026-07-29
(`3/3 Flows Passed in 11m 48s`) é anterior à existência da apresentação e não
a cobre — a linha Android da matriz de sign-off precisa ser lida como **não
revalidada** contra este trabalho.

Evidência completa, receita reproduzível e detalhe da atribuição em
[`radiant-app/docs/evidence/2026-08-02-e2e-primeiro-uso.md`](../radiant-app/docs/evidence/2026-08-02-e2e-primeiro-uso.md).
Matriz de sign-off atualizada em
[`radiant-app/docs/E2E_RUNBOOK.md`](../radiant-app/docs/E2E_RUNBOOK.md).

### Dois defeitos achados pela execução em dispositivo, ambos corrigidos

1. **Acessibilidade — defeito de produto.** `<View accessible
   accessibilityLabel={stepLabel}>` no `WelcomeSlide` colapsava a subárvore
   inteira num único nó de acessibilidade no iOS: título, corpo, rótulo da
   ilustração do Pixel e o aviso legal exigido pela ficha da loja não existiam
   para leitor de tela — só a posição (`Tela N de 3`) era falada. O
   `jest-expo` não modela esse colapso, então a suíte automatizada vinha
   passando havia três tasks sem detectar o problema. Corrigido compondo o
   rótulo do grupo com posição + título + corpo + footnote, sem duplicar
   pontuação. Commits `1a8fd59` e `b3f5684`.
2. **Seletor do Maestro.** O seletor é regex de correspondência **total**, não
   substring. Com o rótulo do grupo carregando a frase inteira, o padrão
   antigo do título isolado parou de casar. Corrigido ancorando os padrões na
   forma real do rótulo, com o contrato estático (`maestro-contract.test.mjs`)
   passando a exigir a forma ancorada **derivada de `SLIDES`** (lida direto de
   `WelcomeFlowScreen.tsx`) e a proibir a forma antiga. Commit `728ca8d`.

### Pendência aberta — `store-capture.yaml`, atribuída a geometria de aparelho

`store-capture.yaml` falhou na seleção da alternativa do quiz. **Não é
regressão desta branch:** o diff desta branch nesse arquivo é uma linha (o
passo de dispensa da apresentação), o flow avançou ~20 passos depois desse
ponto antes de falhar, e a causa é a mesma classe de oclusão que o commit
`f7b602a` corrigiu com uma rolagem fixa calibrada para iPhone 16 Plus e iPhone
11 Pro Max — esta execução foi num iPhone 17 Pro, de geometria diferente. O
flow irmão `learning-critical-path.yaml`, que faz a mesma asserção mas usa
rolagem adaptativa (`scrollUntilVisible`/`centerElement`), passou no mesmo
aparelho minutos antes. A rolagem calibrada não foi tocada — ajustá-la às
cegas arrisca quebrar a captura nos aparelhos onde ela hoje produz os
screenshots de loja publicados. Fica como pendência: revalidar ou recalibrar
`store-capture.yaml` para iPhone 17 Pro (ou outro aparelho do conjunto
calibrado) antes de depender dele para novos screenshots a partir deste
simulador.

## Herdado do documento substituído (não reverificado nesta sessão)

Todo o estado de preparação de lançamento — contas de desenvolvedor Play
Console e App Store Connect, closed test Android, TestFlight iOS,
entitlement de premium (ADR-2026-08-01), currículo por competências v2 (Tasks
4 a 9) — está descrito em
[`EXECUTION_STATUS_2026-07-29.md`](EXECUTION_STATUS_2026-07-29.md) e não foi
tocado, medido ou invalidado por este trabalho. Este documento não o repete
para não arriscar divergir dele por transcrição; quem precisar desse estado
deve ler o documento substituído.

## Ponteiros

- Decisão de produto: [`ADR-2026-08-02`](adr/ADR-2026-08-02-apresentacao-de-primeiro-uso.md).
- Evidência E2E de hoje: [`radiant-app/docs/evidence/2026-08-02-e2e-primeiro-uso.md`](../radiant-app/docs/evidence/2026-08-02-e2e-primeiro-uso.md).
- Runbook Maestro atualizado: [`radiant-app/docs/E2E_RUNBOOK.md`](../radiant-app/docs/E2E_RUNBOOK.md).
- Plano de implementação: [`docs/superpowers/plans/2026-08-02-primeiro-uso-pixel.md`](superpowers/plans/2026-08-02-primeiro-uso-pixel.md).
- Item B6 do roadmap de lançamento, com a confirmação do dono:
  [`docs/plans/2026-07-27-radiant-launch-roadmap.md`](plans/2026-07-27-radiant-launch-roadmap.md).
