# Prompt de continuidade — E2E dos caminhos dourados da 1.4, depois o Gate H4 (2026-09-24)

Você vai continuar o Radiant, um app iOS de treinamento em radiologia (Expo 54 /
React Native 0.81). Você trabalha com o dono: ele lê o resultado e decide loja,
aparelho, build de distribuição, push e merge.

**Esta conversa tem uma frente:**
1. o E2E dos três caminhos dourados da 1.4;
2. se couber, o Gate H4 no mesmo build.

Nada mais entra aqui.

## 0. De onde você parte

- `origin/main` em `5946e4e`, medido em 2026-09-24. Os PRs #28 a #30 estão
  mergeados e não há PR aberto.
- **iOS 27:** o dono decidiu fixar `macos-sequoia-15.6-xcode-26.0` nos perfis
  de iOS do EAS. O `UIScene` fica para a atualização do SDK, depois da 1.4
  ([ADR](../../adr/ADR-2026-09-24-ios27-imagem-xcode-26.md)). **Nesta máquina
  só existe o Xcode 27**, e o que ele compila fecha na abertura no iOS 27. Rode
  tudo no simulador **iPhone 17 (iOS 26.5)**, UDID
  `E3C547AE-4D2B-4C2D-9E0A-43AC36BBD1AD`, medido em 2026-09-24.
- **Nenhum prazo de relógio aberto.** A verificação de desenvolvedor Android foi
  concluída em 2026-09-24.
- **Loop:** `.claude/settings.local.json` e os subprodutos locais de
  `Conteúdo/extrações` já estão fora do guarda de escopo. Leia a lição corrigida
  sobre `context.excludes` no `AGENTS.md`.

## 1. Meça antes de planejar

```bash
git fetch origin && git status --porcelain && git branch --show-current
gh pr list --state open
git log --oneline -1 origin/main
xcrun simctl list devices available | sed -n '/-- iOS 26.5 --/,/-- /p'
maestro --version
```

Crie a branch sem upstream: `git switch --no-track -c <nova> origin/main`.

## 2. Leia, nesta ordem

1. `AGENTS.md`, inteiro.
2. `docs/STATUS.md`, com a seção "Risco de build" e o procedimento de compilação.
3. `docs/FILA.md`, "AGENTE — o que sobrou da Task 8", item 4.
4. `docs/superpowers/specs/2026-09-14-radiant-1-4-fluxo-do-usuario-design.md`
   §8, item 6: a definição dos três caminhos (o plano a chama de "§8.6").
5. `radiant-app/docs/E2E_RUNBOOK.md`: pré-requisitos, "Validate before
   running", "Execute" e a matriz de sign-off.

## 3. A frente

### 3.1. Os três caminhos dourados (§8, item 6 da spec)

1. **Primeira execução até a conclusão da L1.**
2. **Segundo dia com revisão devida.**
3. **Vidas acabando no meio da lição até a folha.**

**Medido em 2026-09-24: os três flows não existem.** O plano previa
`.maestro/radiant-1-4-*.yaml`, e não há nenhum. Dos 12 flows atuais, nenhum
cobre o 2 nem o 3. O `first-run.yaml` e o `learning-critical-path.yaml` são o
ponto de partida mais próximo do 1. A frente, portanto:

1. **Escreve os três flows** e os registra no contrato
   (`radiant-app/scripts/maestro-contract.test.mjs`, que roda no gate).
   - O caminho 2 precisa de "amanhã": use o que o app já oferece para injetar
     relógio ou estado nas ferramentas de desenvolvedor. Se nada servir,
     registre a lacuna em vez de inventar um atalho só para o teste.
   - O caminho 3 precisa das vidas zeradas no meio da lição. Mesma regra.
2. **Compila e instala** pelo procedimento do STATUS ("Risco de build"):
   - `npx expo prebuild --platform ios`;
   - `pod install` com `RUBYOPT=-rlogger LANG=en_US.UTF-8`;
   - `xcodebuild` com `IPHONEOS_DEPLOYMENT_TARGET=15.1` e
     `SENTRY_DISABLE_AUTO_UPLOAD=true`, destino o simulador iOS 26.5;
   - `xcrun simctl install` e `launch`;
   - Metro pelo `radiant-app/scripts/start-ios-v2.sh`, que exporta os flags
     verificados antes do `expo start`.

   O `npx expo run:ios` **trava** nesta máquina.
3. **Roda cada flow** e guarda a saída do Maestro como evidência. Flow que
   falhar é investigado com `systematic-debugging` antes de qualquer mudança no
   app.

**Condição de pronto:**
- os três flows escritos, no contrato e verdes no simulador iOS 26.5, com a
  evidência registrada;
- STATUS, FILA (item 4 da Task 8) e a matriz de sign-off do runbook
  atualizados;
- o relatório em `docs/superpowers/handoffs/`.

**Fora do escopo:**
- StoreKit real: sandbox e compra são do dono, no build `development`;
- aparelho físico;
- iOS 27.

### 3.2. Gate H4, se couber, no mesmo build

Percorrer:
- aprovação e reforço no checkpoint;
- retomada sem persistir respostas;
- texto grande (Dynamic Type);
- leitor de tela (VoiceOver).

O estado da engenharia está na FILA, "Gate operacional H4". O `inspect` do
simulador dá a árvore de acessibilidade. Pronto quando houver evidência de cada
um dos quatro e a H4 estiver marcada na FILA e no roadmap. Se o E2E consumir a
conversa, a H4 vai para a próxima.

## 4. Regras que valem sempre

- **Loop é o contrato.** A sequência:
  1. `git status --porcelain`;
  2. `node scripts/loop/abrir.mjs "<descrição>" <arquivos>`, declarando todo
     caminho: flows novos, o contrato, o runbook, STATUS e FILA **com os
     arquivos de histórico** e subprodutos;
  3. para fechar: `validate` → `step finish` → [`memory write`] → `run close`,
     uma invocação por comando, lendo o `code` de cada envelope.
- **Não rode `loop validate` com flow E2E rodando** (2,3× de desaceleração
  medida). Termine os flows, pare o Metro e só então valide.
- **Node:** `loop` no 24
  (`export PATH="$HOME/.nvm/versions/node/v24.14.1/bin:$PATH"`); testes, builds
  e Maestro no 20. Confira `node --version`.
- **O gate** é `EXPO_NO_DOTENV=1 npm run quality` em `radiant-app`. Última
  medição, de 2026-09-23: 147 suítes / 1374 testes e 26 avisos de lint. Cite a
  suíte inteira. **O gate não empacota o app nem roda flows:** o E2E é a
  evidência que ele não dá.
- **Toda guarda nova precisa ser vista falhando** pelo defeito que nomeia, com
  a saída registrada. Isso inclui asserção nova do contrato do Maestro.
- **Nada de build de distribuição, envio, push ou merge** sem autorização do
  dono na própria conversa. O build **local** para o simulador faz parte da
  frente.

## 5. O relatório

Termine com um relatório curto em `docs/superpowers/handoffs/` e atualize
STATUS e FILA na mesma passagem. Separe o medido do inferido e diga o que não
foi verificado.
