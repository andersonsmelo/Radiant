# Prompt de continuidade — pós-sessão de 2026-09-23

Você vai continuar o Radiant, um app iOS de treinamento em radiologia (Expo /
React Native). Você trabalha com o dono: ele lê o resultado e toma as decisões
de loja, de aparelho, de build, de push e de merge.

**Uma frente por conversa.** A §3 lista as frentes que o agente pode executar
sem aparelho. Escolha uma com o dono, defina a condição de pronto e não misture
outra na mesma conversa.

## 1. Meça antes de planejar

    git fetch origin && git status --porcelain && git branch --show-current
    gh pr list --state open

Em 2026-09-23 havia três PRs empilhados e **não mergeados**:
[#15](https://github.com/andersonsmelo/Radiant/pull/15) →
[#16](https://github.com/andersonsmelo/Radiant/pull/16) →
[#17](https://github.com/andersonsmelo/Radiant/pull/17). O estado vivo está em
`FILA.md`, na seção "três PRs empilhados".

- **Se o #17 ainda estiver aberto,** crie sua branch a partir de
  `fix/ask-to-buy-pendente`, sem upstream: `git switch -c <nova>`. Nunca use
  `git switch -c <nova> origin/<outra>`, porque isso arma o push para a branch
  errada.
- **Se os três já estiverem mergeados,** parta de `origin/main`.

## 2. Leia, nesta ordem

1. `AGENTS.md`, inteiro. Em especial as **"Quatro lições sobre GUARDAS"** e as
   **"Três lições de MEDIÇÃO"**.
2. `docs/STATUS.md`, o único estado vivo. **Remeça antes de citar.**
3. `docs/FILA.md`, o documento acionável.
4. O [relatório da sessão anterior](2026-09-23-radiant-relatorio-da-sessao.md):
   o que foi medido, o que foi inferido e o que não foi verificado.

## 3. Frentes que o agente pode executar sem aparelho

### A. Fatia 3 da Task 8 — `QuizTopBar` mostrando ∞ para assinante (menor; **caminho da 1.4**)

Destravada em 2026-09-23: o estado de assinatura real existe no código.
Arquivo: `radiant-app/src/features/quiz/components/QuizTopBar.tsx` e o teste
dele. O estado vem do `SubscriptionService` (`getStatus`, só cache, nunca a
loja).

**Antes de escrever:** enumere o que o `QuizTopBar` e o `HeartsService`
fazem em cada `SubscriptionStatus`: `none`, `pending`, `unlimited` e
`expired`. Diga quem passa a ver o ∞ e quem deixa de ver as vidas. `pending`
**não** é assinante, e `expired` volta a mostrar vidas. A validação visual
com assinante real espera o sandbox, que é do dono.

### B. L2 v7 do currículo V3 (maior; P0 do currículo, fora do caminho da 1.4)

A ordem está fixada em `FILA.md`, seção J3, e **não se inverte**:

1. **Primeiro, a guarda única de validade semântica.** Para todo item, a
   resposta correta precisa ter `d` não vazio, ficar dentro da banda da região
   que o enunciado nomeia e dentro do tronco, não ter `transform` estranho e não
   coincidir com o outro candidato. Rode-a contra o código atual e **registre a
   execução vermelha** num arquivo versionado. Ela tem que falhar com o Q1.
2. Só então corrija **Q1 e Q2** (o `index` morto junto), **Q3** e **Q4**.
3. Aplique a decisão do dono sobre o **I2** na mesma passagem: crie o código
   `E-PLN-ORT` na spec V3 §5.2 e reclassifique os quatro pontos da L2
   ([ADR](../../adr/ADR-2026-09-23-decisoes-l2-l1-kill-switches.md), item 1).
4. Obtenha o parecer v7 com um auditor independente, pelo §5 do runbook
   `docs/runbooks/curriculum-v3-arco-1.md`. No brief, diga que a descrição do
   autor é **hipótese a testar**, e peça que o auditor reaplique as mutações.

Leia os pareceres v3 a v6 **em ordem** antes de começar. O padrão entre eles
importa mais que qualquer um deles.

### C. C6 na L1 — **só depois da L2 v7 fechar**

Copie a correção da L2 (rótulo pela posição) para
`BodyReferenceLessonPreview.tsx:106-107`, com auditoria independente curta
restrita a essa mudança
([ADR](../../adr/ADR-2026-09-23-decisoes-l2-l1-kill-switches.md), item 2).

### D. Gate H4 — checkpoint, reforço e retomada (simulador)

Veja `FILA.md`, seção "Gate operacional H4". A engenharia está pronta. Falta
percorrer no simulador a aprovação, o reforço, a retomada sem persistir
respostas, o texto grande e o leitor de tela.

## 4. O que é do dono, e nenhum trabalho de agente encurta

1. ⏰ **Verificação de desenvolvedor Android: prazo 30/09/2026.** Abrir
   `play.google.com/console` digitando o endereço, nunca pelos botões do e-mail.
2. **Merge de #15 → #16 → #17, nessa ordem.**
3. **Build interno `development`:** é a primeira compilação do Swift do
   `radiant-storekit`. Depois, a sandbox: compra, Ask to Buy recusado e
   aprovado em até 24 h, Restaurar, renovação, reembolso e `willRenew` em modo
   avião.
4. **F2, os opt-ins do closed test do Play.** A medição mais antiga da fila é
   de 2026-08-03.
5. **`EXPO_PUBLIC_ENABLE_CRASH_REPORTING`:** ligar exige revisar as Privacy
   Labels antes da submissão.
6. **`radiant-app/.env.example`** ainda lista `EXPO_PUBLIC_ENABLE_PRODUCT_ANALYTICS`
   e `EXPO_PUBLIC_ENABLE_REVENUECAT`, que foram apagadas. O arquivo está fora de
   `writePolicy.allowedRoots`: limpar à mão ou ampliar a política, a critério do
   dono.

## 5. Regras que valem sempre

- **Loop é o contrato.** Rode `git status --porcelain` e depois
  `node scripts/loop/abrir.mjs "<descrição>" <arquivos>` **antes** de criar
  qualquer arquivo, declarando todo caminho, inclusive os novos. Quando houver
  memória a gravar, a sequência é `validate` → `step finish` → `memory write` →
  `run close`, cada um numa invocação separada, lendo o `code` de cada
  envelope. Todo comando `loop` sai da raiz do projeto.
- **Node:** o `loop` roda no 24
  (`export PATH="$HOME/.nvm/versions/node/v24.14.1/bin:$PATH"`); testes e
  builds, no 20. Confira `node --version` antes de citar qualquer número.
- **O gate é `EXPO_NO_DOTENV=1 npm run quality`**, em `radiant-app`, e nada
  menos. No relatório, cite a suíte inteira.
- **Toda guarda nova precisa ser vista falhando com o defeito que ela nomeia.**
  Grave a saída com `> arquivo 2>&1` e **confira que o arquivo não está vazio**
  antes de citá-lo: o Jest escreve no stderr.
- **Nada de build, envio, push ou merge** sem autorização do dono, dada na
  própria conversa.

## 6. O relatório

Termine com um relatório curto em `docs/superpowers/handoffs/`. Atualize
`STATUS.md` e `FILA.md` **na mesma passagem**. Separe o que foi **medido** do
que foi **inferido**, e diga o que **não** foi verificado, em especial tudo o
que exigiria aparelho.
