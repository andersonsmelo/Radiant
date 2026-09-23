# Prompt de continuidade — pós-sessão da tarde de 2026-09-23

Você vai continuar o Radiant, um app iOS de treinamento em radiologia (Expo /
React Native). Você trabalha com o dono: ele lê o resultado e toma as decisões
de loja, de aparelho, de build, de push e de merge.

**Uma frente por conversa.** A §3 lista o que o agente pode executar. Escolha
uma com o dono, defina a condição de pronto e não misture outra na mesma
conversa.

## 1. Meça antes de planejar

```bash
git fetch origin && git status --porcelain && git branch --show-current
gh pr list --state open
git log --oneline -1 origin/main
```

Em 2026-09-23 à tarde: `origin/main` em `2e62fc9`, **nenhum PR aberto**, e as
11 branches remotas além da `main` já estavam mergeadas nela. Crie sua branch
a partir da `main` remota **sem upstream**:

```bash
git switch --no-track -c <nova> origin/main
```

Se for trabalhar numa worktree, provisione **antes** do primeiro run o que o
git ignora (ver "Quatro lições de 2026-09-23" no `AGENTS.md`).

## 2. Leia, nesta ordem

1. `AGENTS.md`, inteiro. Em especial as lições sobre GUARDAS, MEDIÇÃO e as de
   2026-09-23.
2. `docs/STATUS.md`, o único estado vivo. Remeça antes de citar.
3. `docs/FILA.md`, o documento acionável.
4. [`2026-09-23-radiant-relatorio-da-sessao-2.md`](2026-09-23-radiant-relatorio-da-sessao-2.md):
   o que foi medido, o que foi inferido e o que não foi verificado.

## 3. Frentes do agente

**A 1.4 não tem mais trabalho de agente sem aparelho.** As vidas do
assinante, a folha e o contador legado estão na `main`. O que resta da 1.4
precisa de build, simulador ou sandbox.

### B. L2 v7 do currículo V3 (maior; P0 do currículo, fora do caminho da 1.4)

A ordem está fixada em `FILA.md`, seção J3, e não se inverte:

1. Primeiro, a guarda única de validade semântica. Para todo item, a resposta
   correta tem `d` não vazio, fica dentro da banda da região que o enunciado
   nomeia e dentro do tronco, sem `transform` estranho, e não coincide com o
   outro candidato. Rode-a contra o código atual e registre a execução
   vermelha num arquivo versionado. Ela tem que falhar com o Q1.
2. Só então corrija Q1 e Q2 (o `index` morto junto), Q3 e Q4.
3. Aplique a decisão do dono sobre o I2: o código `E-PLN-ORT` na spec V3
   §5.2, com os quatro pontos da L2 reclassificados (ADR, item 1).
4. Parecer v7 de um auditor independente, pelo §5 do runbook
   `docs/runbooks/curriculum-v3-arco-1.md`. No brief, diga que a descrição do
   autor é hipótese a testar e peça que o auditor reaplique as mutações.

Leia os pareceres v3 a v6 em ordem antes de começar. O padrão entre eles
importa mais que qualquer um deles.

### C. C6 na L1 — só depois da L2 v7 fechar

Copie a correção da L2 (rótulo pela posição) para
`BodyReferenceLessonPreview.tsx`, com auditoria independente curta restrita a
essa mudança.

### D. Com simulador ou aparelho

- Gate H4 (`FILA.md`, "Gate operacional H4"): aprovação, reforço, retomada sem
  persistir respostas, texto grande e leitor de tela.
- E2E dos três caminhos dourados (Task 8, item 4). Não rode `loop validate`
  durante um flow E2E.

## 4. O que é do dono, e nenhum trabalho de agente encurta

1. ⏰ **Verificação de desenvolvedor Android: prazo 30/09/2026.** Abra
   `play.google.com/console` digitando o endereço.
2. **Build interno `development`.** É a primeira compilação real do Swift do
   `radiant-storekit`, que já está na `main`. Depois vem o sandbox: compra,
   Ask to Buy recusado e aprovado, Restaurar, renovação, reembolso e
   `willRenew` em modo avião. É ali que se vê o ∞ nas quatro telas.
3. **F2**, os opt-ins do closed test do Play. A medição é de 2026-08-03:
   remeça antes de decidir.
4. **Três decisões desta sessão:** o motivo "loja indisponível" offline, que
   a spec §98 quer na folha; o botão "Vidas ilimitadas" da Trilha, que liga
   um estado invisível; e apagar as 11 branches remotas mergeadas.
5. `EXPO_PUBLIC_ENABLE_CRASH_REPORTING`: ligar exige revisar as Privacy
   Labels antes da submissão.

## 5. Regras que valem sempre

- **Loop é o contrato.** Rode `git status --porcelain` e depois
  `node scripts/loop/abrir.mjs "<descrição>" <arquivos>`, declarando todo
  caminho, inclusive os novos. Com memória a gravar: `validate` →
  `step finish` → `memory write` → `run close`, cada um numa invocação
  separada, lendo o `code` de cada envelope. Todo comando `loop` sai da raiz.
- **Node:** o `loop` roda no 24
  (`export PATH="$HOME/.nvm/versions/node/v24.14.1/bin:$PATH"`); testes e
  builds, no 20. Confira `node --version` antes de citar qualquer número.
- **O gate é `EXPO_NO_DOTENV=1 npm run quality`**, em `radiant-app`. No
  relatório, cite a suíte inteira.
- **Toda guarda nova precisa ser vista falhando com o defeito que ela
  nomeia.** Grave a saída com `> arquivo 2>&1` e confira que o arquivo não
  está vazio. Quando uma asserção mascarar outra, implemente em etapas até
  cada uma falhar pelo próprio motivo.
- **Nada de build, envio, push ou merge sem autorização do dono**, dada na
  própria conversa.

## 6. O relatório

Termine com um relatório curto em `docs/superpowers/handoffs/`. Atualize
`STATUS.md` e `FILA.md` na mesma passagem. Separe o medido do inferido e diga
o que não foi verificado, em especial tudo o que exigiria aparelho.
