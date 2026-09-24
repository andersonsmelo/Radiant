# Prompt de continuidade — 2026-09-24

Você vai continuar o Radiant, um app iOS de treinamento em radiologia (Expo 54 /
React Native 0.81). Você trabalha com o dono: ele lê o resultado e decide loja,
aparelho, build, push e merge.

**Uma frente por conversa.** A §3 lista o que o agente pode executar. Escolha uma
com o dono, defina a condição de pronto e não misture outra na mesma conversa.

## 0. O que a sessão de 2026-09-23/24 entregou

Todos os PRs, do #21 ao #27, estão mergeados na `main` (`3343eca`).

- **Estado vivo consolidado.**
  - `docs/STATUS.md` guarda só o presente, e `docs/FILA.md` só o que está aberto.
  - O histórico vai, sem edição, para `docs/archive/STATUS_historico.md` e
    `docs/archive/FILA_concluidos.md`.
  - A regra que impede o inchaço está no topo dos dois documentos.
- **Lição híbrida.**
  - Decisão: a [spec](../specs/2026-09-23-licao-hibrida-piloto-design.md) e a
    [ADR](../../adr/ADR-2026-09-23-licao-hibrida-e-custo-de-vida.md), com o
    Duolingo como referência. São 10 a 15 itens curtos, e só o desafio custa vida.
  - Execução: o [plano](../plans/2026-09-23-licao-hibrida-piloto.md) foi
    implementado por um agente em nuvem e revisado localmente, com relatório e
    vermelhos nesta pasta.
  - O piloto da L1 roda na rota `/licao-hibrida`, só com `SHOW_DEV_TOOLS`. O V3
    continua desligado.
- **Piloto visto no simulador, com quatro defeitos de tela corrigidos:**
  - retorno fora da tela;
  - números espelhados na vista de costas;
  - marcadores fora do desenho;
  - textos técnicos em excesso.
- **O boneco do mapa é ilustração de piloto.** Decisão do dono em 2026-09-24:
  serve para o piloto e para o teste com pessoas, e precisa de arte definitiva
  antes de chegar ao aluno.
- **Sons:** seis sons do Kenney (CC0) em `radiant-app/assets/sounds/`, escolhidos
  de ouvido pelo dono, com origem e hash no README da pasta.
- **Conteúdo:** os scripts leem `conteúdo/` na caixa do índice do git (PR #25), e
  os testes de conteúdo rodam no CI em Linux (PR #26).
- **Risco de build descoberto: iOS 27.** Compilado com o Xcode 27, o app fecha na
  abertura no iOS 27, por falta de `UIScene`. Está em `STATUS.md`, na seção
  "Risco de build", e na `FILA.md` como decisão do dono.

## 1. Meça antes de planejar

```bash
git fetch origin && git status --porcelain && git branch --show-current
gh pr list --state open
git log --oneline -1 origin/main
```

Em 2026-09-24: `origin/main` em `3343eca`, **nenhum PR aberto**. O checkout
principal pode estar em modo detached na `main`, porque a `main` em si está
aberta na worktree `Radiant-release`. Crie sua branch **sem upstream**:

```bash
git switch --no-track -c <nova> origin/main
git branch --show-current   # confira: se o switch falhar, o próximo comando cai no branch errado
```

## 2. Leia, nesta ordem

1. `AGENTS.md`, inteiro.
2. `docs/STATUS.md`. Remeça antes de citar.
3. `docs/FILA.md`, o documento acionável.

## 3. Frentes do agente

### A. E2E dos três caminhos dourados da 1.4 (próximo item da FILA)

Estava travado por falta de aparelho. Agora o app roda num **simulador com iOS
26.5**, pelo procedimento da seção "Risco de build" do `STATUS.md`:
- `npx expo prebuild --platform ios`;
- `pod install` com `RUBYOPT=-rlogger LANG=en_US.UTF-8`;
- `xcodebuild … IPHONEOS_DEPLOYMENT_TARGET=15.1` com `SENTRY_DISABLE_AUTO_UPLOAD=true`;
- `xcrun simctl install` e `launch`;
- Metro com as flags verificadas do `scripts/start-ios-v2.sh`.

No iOS 27 o app fecha na abertura. O `npx expo run:ios` trava nesta máquina.
Roteiro: `radiant-app/docs/E2E_RUNBOOK.md`. **Não rode `loop validate` com um
flow E2E rodando** (desaceleração de 2,3× medida).

### B. Gate H4 no simulador

Item "Gate operacional H4" da `FILA.md`: aprovação e reforço no checkpoint,
retomada sem persistir respostas, texto grande e leitor de tela.

### C. Apoio à decisão do iOS 27 (pesquisa, sem mudar código)

Descubra qual Xcode a imagem padrão do EAS usa para o SDK 54, quais imagens com
Xcode 26 existem, e quanto custa adotar `UIScene` no Expo 54 (config plugin,
`AppDelegate`, E2E). Entregue as duas saídas com custo e risco, para o dono
decidir.

### D. Piloto da lição híbrida — só depois de o dono aprovar a amostra

Quando o dono aprovar os 20 itens de
`radiant-app/src/features/curriculum-v3/hybrid-l1/__snapshots__/l1TemplateApproval.test.ts.snap`,
grave a impressão digital em `L1_TEMPLATE_APPROVAL` (`l1TemplateApproval.ts`),
com data e aprovador. A tela deixa de mostrar "Prévia". Se o dono mudar algum
texto, a impressão digital muda: regrave o snapshot e peça a aprovação de novo.

A **L2 v7 está pausada** pela ADR da lição híbrida. Não a retome: se o piloto
passar no teste com pessoas, a L2 é refeita com modelos de exercício.

## 4. O que é do dono

1. ⏰ **Verificação de desenvolvedor Android: prazo 30/09/2026.** Abra
   `play.google.com/console` digitando o endereço.
2. **Decisão do iOS 27, antes do próximo build da 1.4:** fixar no `eas.json` uma
   imagem com Xcode 26, ou adotar `UIScene` no app.
3. **Aprovar a amostra do piloto**, com três perguntas pendentes:
   - as descrições do tórax sem número;
   - "vista por trás" no decúbito;
   - descrições acessíveis que entregam parte da resposta a quem usa leitor de tela.
4. **Build interno `development` e sandbox do StoreKit.** É a primeira compilação
   real do Swift do `radiant-storekit`.
5. **F2** do Play (opt-ins do closed test). A medição é de 2026-08-03: remeça.
6. **Limpeza:**
   - worktree `zealous-shannon-01c8e3`, que tem 4 arquivos com alterações não
     salvas: descartar ou não;
   - apagar os branches remotos já mergeados.

## 5. Regras que valem sempre

- **Loop é o contrato.**
  - Rode `git status --porcelain`, depois `node scripts/loop/abrir.mjs
    "<descrição>" <arquivos>`, declarando todo caminho, inclusive novos, os de
    histórico se tocar em STATUS ou FILA, e subprodutos locais.
  - Feche com `validate` → `step finish` → [`memory write`] → `run close`, uma
    invocação por comando, lendo o `code` de cada envelope.
  - A CLI não volta de `validating` para `editing`: edite antes de validar.
- **Node:** o `loop` roda no 24
  (`export PATH="$HOME/.nvm/versions/node/v24.14.1/bin:$PATH"`); testes e builds,
  no 20. Confira `node --version`.
- **O gate é `EXPO_NO_DOTENV=1 npm run quality`**, em `radiant-app`. Última
  medição: 2026-09-23, no branch que virou `3343eca` (mesma árvore do app): 147
  suítes / 1374 testes, 26 avisos de lint. Cite a suíte inteira.
- **Toda guarda nova é vista falhando pelo defeito que nomeia**, com a saída
  registrada num arquivo de vermelhos. Guarda que copia o cálculo do componente
  confere a regra errada: compare com o que o aparelho desenha.
- **Ao integrar um branch à `main`:** rode `git fetch` antes (o `gh pr merge` não
  atualiza o `origin/main` local) e confira onde cada trecho de `STATUS.md` caiu.
  Merge sem conflito não quer dizer lugar certo.
- **Nada de build de distribuição, envio, push ou merge sem autorização do
  dono** dada na própria conversa.

## 6. O relatório

Termine com um relatório curto em `docs/superpowers/handoffs/` e atualize
`STATUS.md` e `FILA.md` na mesma passagem. Separe o medido do inferido e diga o
que não foi verificado.
