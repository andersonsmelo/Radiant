# Demais telas no Medalhão, sem cara de IA — plano de implementação (plano 5)

**Continuação de 2026-10-25:** executar junto do
[plano integrador](../../plans/2026-10-25-medalhao-pendencias-e-fechamento.md),
que resolve premissas antigas, explicita as lacunas da aula e põe a
conferência de segundo dia no fechamento. A execução do plano 5 começou em
25/10 pela T01 (guarda/vocabulário), após autorização posterior do dono.
Os exemplos abaixo não autorizam API de histórico inexistente, parsing de
preço localizado, hooks em callback ou mudança da identidade aprovada.

> **Para agentes:** sub-skill obrigatória: superpowers:subagent-driven-development
> (recomendada) ou superpowers:executing-plans, tarefa por tarefa. Os passos
> usam caixas (`- [ ]`) para acompanhamento.

**Objetivo:** levar as telas fora da trilha e da aula para o Medalhão e aplicar
nelas a Regra Sem Cara de IA. São o HUD, as boas-vindas, o resultado, a
recompensa, a revisão, a avaliação, o Perfil, as Configurações, a assinatura e a
folha de vidas.

**Arquitetura:**
- **Uma guarda de texto primeiro, telas depois.** A tarefa 1 cria um contrato
  que conta, por AST, etiqueta em caixa alta, travessão de efeito e jargão
  interno nas telas. Ele nasce com a contagem medida como teto e não deixa
  crescer. Cada tarefa de tela baixa o teto, e a última o leva a zero.
- **Cada tela é uma tarefa**, com o teste de fluxo que ela já tem como rede. Os
  serviços (`GamificationService`, `DailyGoalService`, `SpacedRepetitionService`,
  `subscriptionService`, `heartsRepository`, `JourneyProgressService`) não
  mudam; muda só o desenho e o texto.
- **Peças comuns ficam no `src/ui`**, para a mesma medalha, linha e grupo não
  serem redesenhados em cada tela.

**Pilha:** Expo SDK 54, React Native 0.81, Reanimated 4.1 via `src/ui/motion.ts`,
`react-native-svg` 15.12. Nenhuma dependência nova.

**Spec:** [seção 11 da spec](../specs/2026-10-21-trilha-medalhao-e-aula-bancada-design.md#11-adendo-de-2026-10-21-à-noite-o-pixel-e-o-app-inteiro-sem-cara-de-ia) ·
[prancheta do app](../../design/2026-10-21-app-medalhao.html) ·
[DESIGN.md, A Regra Sem Cara de IA](../../DESIGN.md) ·
[índice](2026-10-21-trilha-medalhao-indice.md).

**Depende de:** plano 1 (feito); plano 6 (Pixel) nas tarefas 4 e 5; plano 3
(aula-bancada) só na tarefa 3, porque as boas-vindas reaproveitam a bancada; e
a tarefa 3 do plano 2, de onde vem o `JourneyMedal`.

## Restrições globais

As do [plano 1](2026-10-21-fundacao-visual-medalhao.md#restrições-globais)
valem todas. E mais:

- **A Regra Sem Cara de IA** (DESIGN.md), item por item:
  - sem etiqueta em caixa alta acima de título;
  - cartão só para o que se toca, e nunca um cartão dentro de outro;
  - cada número aparece uma vez;
  - ouro só para conquista, estrela e plano anual;
  - o Pixel só nos quatro momentos;
  - sem anel de progresso decorativo, faixa em degradê ou fileira de chips;
  - texto sem travessão de efeito, sem tríade de frase curta e sem jargão.
- **Glossário obrigatório:** "jornada" → "trilha"; "nó liberado" → "próxima
  aula"; "elegível" não aparece; "checkpoint" → "avaliação" no texto visível
  (rotas, nomes de arquivo e `testID` ficam); "Configuração" → "Ajustes".
- **Regras que não mudam:** vidas, estrelas, avaliação, revisão, assinatura e o
  texto legal da assinatura, que continua inteiro. Os números da prancheta são
  de demonstração.
- **Leitor de tela e Maestro:** um `accessibilityLabel` que algum roteiro em
  `.maestro/` lê só muda junto com o roteiro e o `maestro-contract`, na mesma
  tarefa. Procure antes de trocar.
- **Texto grande:** cada tela passa no maior Dynamic Type sem cortar texto nem
  sobrepor peça (é o achado 3 da evidência do plano 1, Perfil no maior texto).
- **A política do `visual:qa:strict`.** Em 2026-10-21, os 23 registros de
  `scripts/visual-qa-policy.json` venciam em 2026-10-23, e a PR #67 os renova
  para 2026-11-30, amarrados ao fim deste plano. Cada tarefa que refaz
  uma tela apaga os registros daquele arquivo; nenhuma tarefa renova prazo sem
  dizer por quê.

## Foco da revisão

1. **Texto que volta a ter cara de IA depois do plano.** A guarda da tarefa 1
   fica no `npm run quality` com teto zero. Tarefa 12.
2. **Assinante e loja indisponível.** A assinatura com `store-unavailable` não
   mostra plano nem botão de compra, e o assinante vê "Gerenciar" em vez de
   "Assinar". Tarefa 10.
3. **Perfil sem nada ainda.** Aluno novo, sem medalha, sem sequência e sem meta:
   a estante mostra as medalhas da primeira unidade em silhueta, a semana vazia
   e as metas em 0. Nada de estado vazio genérico. Tarefa 8.
4. **Rota de recompensa ou avaliação aberta sem nó válido.** Por deep link
   (`radiantapp://reward`, `radiantapp://checkpoint`), a tela não mostra
   "indisponível": volta para a trilha. Tarefas 5 e 7.
5. **Vidas zeradas com assinatura em curso.** A folha de vidas não aparece para
   quem tem `status: 'unlimited'`, e o HUD mostra o ∞, como hoje. Tarefas 2 e 11.

---

### Tarefa 0: Prazo da política de visual QA

**Arquivos:**
- Modificar, só se preciso: `radiant-app/scripts/visual-qa-policy.json`

- [ ] **Passo 1: Comparar a data de hoje com os prazos**

Run: `date +%F; grep -o '"expiresOn": "[0-9-]*"' radiant-app/scripts/visual-qa-policy.json | sort | uniq -c`
Expected: a data de hoje e os prazos por contagem (23 em 2026-11-30, se a PR #67
foi mergeada; 23 em 2026-10-23, se não).

- [ ] **Passo 2: Se já venceu, renovar com motivo**

Troque o prazo de cada registro de arquivo que este plano refaz para o fim
previsto do plano mais 14 dias, com o `reason` "Refeito no plano 5 (FILA 67);
o registro sai na tarefa da tela". Os registros de arquivos fora deste plano
ficam como estão e vão para o relatório da tarefa 12.

- [ ] **Passo 3: Conferir e fazer commit**

Run: `cd radiant-app && npm run visual:qa:strict`
Expected: código 0.

```bash
git add radiant-app/scripts/visual-qa-policy.json
git commit -m "chore(qa): prazos da política de visual QA amarrados ao plano 5"
```

### Tarefa 1: Guarda de texto sem cara de IA

**Arquivos:**
- Criar: `radiant-app/scripts/copy-style-contract.test.mjs`
- Criar: `radiant-app/scripts/copy-style-baseline.json`
- Modificar: `radiant-app/package.json`, com o script
  `test:copy-style-contract` dentro de `quality`

**Interfaces:**
- Produz: o contrato, que percorre `src/app/**` e `src/features/**` (sem testes
  nem histórias) com o parser TypeScript, como o `contrast-contract`, e conta
  três classes em literais de texto visível (filhos de `<Text>`, props
  `title`, `label`, `body`, `eyebrow`, `accessibilityLabel` e valores de objetos
  de texto):
  - `eyebrow`: uso da prop `eyebrow`, `textTransform: 'uppercase'` em estilo de
    texto, ou literal todo em maiúsculas com 4 letras ou mais;
  - `dash`: literal com " — " ou " – ";
  - `jargon`: as palavras `jornada`, `elegível`, `nó liberado`, `nó` como
    unidade da trilha, e `checkpoint` em texto visível.
  O JSON guarda o teto por classe e por arquivo. O teste reprova se qualquer
  contagem passar do teto, e avisa (sem reprovar) quando ela cair, para o teto
  ser baixado.

- [x] **Passo 1: Enumerar antes de escrever o teto**

Objetivo: a contagem real das três classes. Critério de completude: duas
buscas por convenções diferentes (a do AST e um `grep` de texto) e uma
diferença entre elas que você consiga explicar caso a caso. A auditoria de
2026-10-21 mediu 29 etiquetas em 18 arquivos, 20 travessões e 20 jargões; use
esses números como conferência, não como resposta.

- [x] **Passo 2: Escrever o contrato com três casos que falham**

Um arquivo temporário em memória (não no disco do app) com
`<Text>Volte para a jornada</Text>`, `title="Vidas — e só isso"` e
`eyebrow="MISSÕES"` precisa produzir uma contagem de cada classe. Veja cada
asserção falhar antes de a contagem existir.

- [x] **Passo 3: Gravar o teto medido e ver passar**

Run: `cd radiant-app && npm run test:copy-style-contract`
Expected: PASS com o teto igual à contagem do passo 1.

- [x] **Passo 4: Commit**

```bash
git add radiant-app/scripts/copy-style-contract.test.mjs radiant-app/scripts/copy-style-baseline.json radiant-app/package.json
git commit -m "test(copy): guarda de etiqueta, travessão e jargão, com teto medido"
```

### Tarefa 2: HUD com um coração e o número

**Arquivos:**
- Modificar: `radiant-app/src/ui/components/HUD.tsx`
- Testar: `radiant-app/src/ui/components/HUD.test.tsx`

**Interfaces:**
- Produz: `HUD` com a mesma API. As vidas viram uma pílula igual às de XP e
  sequência: o ícone de coração de `HudIcons` e o número. O tempo de recarga sai
  do HUD e vai só para a folha de vidas. O pulso de perda (`useLossPulse`)
  passa a valer no coração único.

- [x] **Passo 1: Escrever os testes que falham**

- com `hearts=3`, aparece um coração e o texto "3"; não aparecem cinco corações
  nem "3 · +1 em 12 min";
- o rótulo continua `"3 de 5 vidas; próxima em 12 minutos"` quando há recarga;
- com `status: 'unlimited'`, aparece o ∞ e nenhum número.

- [x] **Passo 2: Ver falhar**

Run: `cd radiant-app && npx jest src/ui/components/HUD.test.tsx`
Expected: FAIL.

- [x] **Passo 3: Implementar**

- [x] **Passo 4: Ver passar, com Maestro**

Run: `cd radiant-app && npx jest src/ui/components && npm run test:maestro-contract`
Expected: PASS.

- [x] **Passo 5: Commit**

```bash
git add radiant-app/src/ui/components/HUD.tsx radiant-app/src/ui/components/HUD.test.tsx
git commit -m "feat(hud): vidas como um coração e o número"
```

### Tarefa 3: Boas-vindas que começam na bancada

**Arquivos:**
- Modificar: `radiant-app/src/features/first-run/screens/WelcomeFlowScreen.tsx`
- Modificar ou remover: `radiant-app/src/features/first-run/components/WelcomeSlide.tsx`
- Testar: `WelcomeFlowScreen.flow.test.tsx` e `WelcomeFlowReentry.test.tsx`

**Interfaces:**
- Consome: `ExposureImage`, `BenchControlRow` e `exposureModel` (plano 3);
  `PixelIllustration` com `state="happy"` e `size="sm"` (plano 6).
- Produz: uma tela só. O Pixel acena com a frase "Oi, eu sou o Pixel. Vamos
  tirar sua primeira radiografia."; abaixo, a imagem e o controle de kV, com a
  frase que muda nas três faixas da prancheta (abaixo de 70, de 70 a 94, de 95
  em diante); o botão "Continuar"; e o rodapé "Sem conta. Seu progresso fica
  neste iPhone." (no Android, "neste aparelho"). "Continuar" faz o que o último
  slide faz hoje.

- [x] **Passo 1: Escrever os testes que falham**

- a tela mostra a imagem, o controle de kV e "Continuar", e não mostra slide
  nem paginação;
- mudar o kV para 100 troca a frase para a da faixa alta;
- "Continuar" grava o mesmo marcador de primeira execução que o fluxo de hoje
  (o teste de reentrada continua passando sem mudança).

- [x] **Passo 2: Ver falhar**

Run: `cd radiant-app && npx jest src/features/first-run`
Expected: FAIL.

- [x] **Passo 3: Implementar**

As frases das três faixas são física: elas entram no documento de revisão de
conteúdo do plano 3, antes de ir à loja.

- [x] **Passo 4: Ver passar, com Maestro**

Run: `cd radiant-app && npx jest src/features/first-run && npm run test:maestro-contract`
Expected: PASS. O `first-run.yaml` e o `radiant-1-4-primeira-execucao.yaml`
mudam junto, se leem o texto dos slides.

- [x] **Passo 5: Commit**

```bash
git add -A radiant-app/src/features/first-run .maestro
git commit -m "feat(boas-vindas): a primeira tela é uma bancada de kV"
```

### Tarefa 4: Resultado da aula

**Arquivos:**
- Modificar: `radiant-app/src/features/quiz/components/LessonSummary.tsx`
- Modificar: `radiant-app/src/ui/motion.ts`, com `useMedalMint`
- Testar: `radiant-app/src/features/quiz/components/LessonSummary.test.tsx` e
  `LessonFlowScreen.flow.test.tsx`

**Interfaces:**
- Consome: `JourneyMedal` em modo só desenho (plano 2, tarefa 3, com
  `state="done"`), `ThemeIllustration` e `PixelIllustration` com
  `state="celebrate"` e `size="sm"`.
- Produz: o resumo com a medalha do tema no centro, as estrelas desta tentativa
  embaixo, o título da aula, a frase de estrelas que já existe
  (`pickSummaryPhrase`), o XP como número grande sem caixa ("+20 XP") e
  "Continuar". `useMedalMint(): { medal: AnimatedStyle; star: (index: number) => AnimatedStyle }`:
  a medalha faz a mola de 0,4 a 1 em 700 ms, e as estrelas caem uma a uma em
  550 ms, com 200 ms entre elas. Com "reduzir movimento", o estado final no
  primeiro quadro.

- [x] **Passo 1: Escrever os testes que falham**

- o resumo não tem cartão em volta do XP nem confete; tem a medalha, as
  estrelas, o título e "+20 XP";
- com 0 estrela, a medalha aparece em grafite (não em ouro) e a frase é a de 0
  estrela, sem "quase";
- o Pixel aparece uma vez.

- [x] **Passo 2: Ver falhar**

Run: `cd radiant-app && npx jest src/features/quiz/components/LessonSummary.test.tsx`
Expected: FAIL.

- [x] **Passo 3: Implementar**

- [x] **Passo 4: Ver passar**

Run: `cd radiant-app && npx jest src/features/quiz src/features/lesson-flow`
Expected: PASS.

- [x] **Passo 5: Commit**

```bash
git add -A radiant-app/src/features/quiz radiant-app/src/ui/motion.ts
git commit -m "feat(resultado): a medalha do tema cunhada em ouro, com as estrelas"
```

**Registro de execução T05 em 27/10/2026:** composição implementada nos dois
consumidores reais, incluindo revisão e aula sem nó, sob o integrador aprovado.
A receita antiga de 700/550ms e star(index) foi substituída pelo contrato de
DESIGN: mola de cunhagem300ms, estrelas220ms com hooks por componente,
sem Reanimated em feature. Zero estrela usa aparência neutra com state done;
revisão não monta Pixel. Fix2 de Dynamic Type conserva identidade dos
controles/movimento e renova apenas Text locais. Revisões de código aprovadas;
iOS R5 large→AX5 e Android aula/revisão fonte2 com glifos íntegros. Loop final15/15 em 27/10 após fix3 de mock consumidor aprovado em R7;
primeira validação do writer substituto/segunda do objetivo. Passo5 de Git
é posterior ao fechamentoCLI; seu comprovante fica no ledger e relatório
final, sem antecipar um SHA neste checkpoint.
[Evidência por fase e limites](../../evidence/2026-10-27-medalhao-t05.md).

Conferência posterior em 27/10 no preflightT06: commitT05 `d033433` publicado, CI AppQuality245/Content150 SUCCESS no SHA completo e árvore limpa antes da nova entrega.

### Tarefa 5: Recompensa sem estado vazio

**Arquivos:**
- Modificar: `radiant-app/src/features/rewards/screens/RewardScreen.tsx`
- Testar: `radiant-app/src/features/rewards/screens/RewardScreen.flow.test.tsx`

**Interfaces:**
- Produz: quando não há recompensa válida para o nó, a tela chama
  `router.dismissTo('/(tabs)')` no efeito de carga e não desenha nada. Com
  recompensa, a celebração usa a mesma peça da tarefa 4.

- [x] **Passo 1: Escrever os testes que falham**

- sem recompensa: `router.dismissTo` com `'/(tabs)'`, e nenhum texto
  "Conquista indisponível", "elegível" ou "jornada" na árvore;
- com recompensa: a medalha de ouro e "Continuar".

- [x] **Passo 2: Ver falhar**

Run: `cd radiant-app && npx jest src/features/rewards`
Expected: FAIL.

- [x] **Passo 3: Implementar**

- [x] **Passo 4: Ver passar**

Run: o mesmo do passo 2. Expected: PASS.

- [x] **Passo 5: Commit**

```bash
git add -A radiant-app/src/features/rewards
git commit -m "feat(recompensa): sem recompensa, a rota volta para a trilha"
```

Registro em 28/10/2026: retorno automático para ausência canônica; loading e
erro distintos, bloqueado/coletado preservados, confirmação pelo serviço e
proteções inflight/póscoleta. R5 código e R6 evidência nativa aprovados no
escopo medido; focal final4/100 e contrato39/39. Fonte live iOS corrigida;
Android normal/máxima inicial legíveis, live não validado por erro de linking
do dev client. P3 cauda permanece para T17. Loop final15/15 aprovado em
ciclo único. Passo5 Git é posterior ao fechamento CLI, comprovante no ledger
e relatório final, sem antecipar SHA neste checkpoint. [Evidência](../../evidence/2026-10-27-medalhao-t06.md).

Reconciliação no preflight T07 em28/10: commitT06 `c694f95` publicado, CI246/151SUCCESS no SHA completo e writer/brain CLOSED confirmados; árvore limpa antes T07.

### Tarefa 6: Revisão

**Arquivos:**
- Modificar: `radiant-app/src/features/review/screens/ReviewScreen.tsx`
- Criar: `radiant-app/src/ui/components/ListRow.tsx`
- Testar: `ReviewScreen.flow.test.tsx` e `radiant-app/src/ui/components/ListRow.test.tsx`

**Interfaces:**
- Produz:
  - `ListRow(props: { leading?: React.ReactNode; title: string; detail?: string; trailing?: React.ReactNode; onPress?: () => void; accessibilityLabel?: string }): React.ReactElement`,
    linha com divisória, sem cartão; vira `Pressable` só com `onPress`;
  - a revisão em ordem de leitura: HUD, título "Revisão", a linha
    `"N itens de <unidade>. Leva uns M minutos."` com M arredondado de
    `N × 40 s`, a lista dos itens (assunto e há quanto tempo foi visto, com a
    medalha da aula de origem em 34 pt), e "Começar" no rodapé. Sem anel, sem
    Pixel e sem o cartão "Como essa sessão funciona".

- [x] **Passo 1: Escrever os testes que falham**

- a ordem na árvore é título, contagem, itens, botão (o botão vem depois);
- não há `PixelIllustration` nem o anel "0 de 5";
- com 1 item, "1 item de …".

- [x] **Passo 2: Ver falhar**

Run: `cd radiant-app && npx jest src/features/review src/ui/components/ListRow.test.tsx`
Expected: FAIL.

- [x] **Passo 3: Implementar**

Os assuntos vêm de onde a tela já busca os itens devidos
(`SpacedRepetitionService`). Se o serviço não expõe o título do item, use o
título da aula de origem; não invente texto.

- [x] **Passo 4: Ver passar, com Maestro**

Run: `cd radiant-app && npx jest src/features/review src/ui/components && npm run test:maestro-contract`
Expected: PASS.

- [x] **Passo 5: Commit**

```bash
git add -A radiant-app/src/features/review radiant-app/src/ui/components/ListRow.tsx radiant-app/src/ui/components/ListRow.test.tsx
git commit -m "feat(revisão): título, contagem, itens e um botão, nessa ordem"
```

Registro28/10: R2 código e R3 nativo aprovados no núcleo T07. Queue real,
metadados desconhecidos distintos, sem Pixel/anel, vida/registro/saída
preservados; focal4/52 e contrato40/40. Engine Maestro não rodou; CLI nativa
existente comprovou os cenários medidos. P2 do convite compartilhado máximo
iOS segueT17 e bloqueia aceite global; Androidlive/resultmax não validados.
Loop final15/15 em ciclo único aprovado. Fechamento CLI e brain CLOSED
confirmados; commit `85ebf0153840d503e6fcd70532529896e8bcc29f` publicado,
50 arquivos próprios/hashes conferidos e CI247/152 SUCCESS no mesmo SHA.
Passo5 reconciliado em 28/10/2026; T08 foi iniciada posteriormente; ver tarefa7 abaixo.
[Evidência](../../evidence/2026-10-28-medalhao-t07.md).

### Tarefa 7: Avaliação da unidade

**Núcleo implementado/revisado/validado em 28/10/2026:** R1 apontou P2 na identidade do resumo sem ID; correção pelo autor aprovada na R2 SpecPASS/QualidadeAPPROVED.61 focais/45 sob CPU limitada PASS; fluxo real iOS/Android medido, R3 aprovou o núcleo medido (BOUNDED); Loop final15/15 em um ciclo. [Evidência](../../evidence/2026-10-28-medalhao-t08.md).

**Arquivos:**
- Modificar: `radiant-app/src/features/checkpoint/screens/CheckpointScreen.tsx`
- Testar: `radiant-app/src/features/checkpoint/screens/CheckpointScreen.flow.test.tsx`

**Interfaces:**
- Consome: `JourneyMedal` com a forma `checkpoint` (prata) do plano 2.
- Produz:
  - aberta: a medalha de prata, o título "Avaliação da unidade N", a regra numa
    frase com os números reais do checkpoint (quantidade de perguntas e o
    mínimo para passar, de onde a tela já os lê) e "Começar avaliação";
  - fechada: a medalha em silhueta e "Abre depois das N aulas. Faltam M.";
  - sem checkpoint válido: volta para a trilha, como a recompensa;
  - os rótulos "Voltar para jornada" viram "Voltar para a trilha", e "Abrir
    checkpoint" vira "Abrir avaliação".

- [x] **Passo 1: Escrever os testes que falham**

Os três estados acima, e nenhum texto visível com "checkpoint", "jornada" ou
"indisponível".

- [x] **Passo 2: Ver falhar**

Run: `cd radiant-app && npx jest src/features/checkpoint`
Expected: FAIL.

- [x] **Passo 3: Implementar**

- [x] **Passo 4: Ver passar, com o relatório de desempenho do checkpoint**

Run: `cd radiant-app && npx jest src/features/checkpoint && npm run test:checkpoint-performance-report && npm run test:checkpoint-instrument`
Expected: PASS.

**Passo 5: Commit após fechamento do Loop**

A revisão Git que contém este registro identifica a entrega. Publicação e CI
são conferidos nesse SHA pelo controlador; não se reutiliza CI de outro commit.

O controlador stageia a lista nominal própria, incluindo documentação e
capturas, confere os hashes e só então cria o commit. Não usar `git add -A`
nem atribuir a esta entrega o CI de BASE_TASK.

**Fechamento:** o run original validou15/15, mas `step finish` reprovou pelo
arquivo gerado `expo-env.d.ts` fora do escopo. Run original encerrado sem sucesso.
Regularização autorizada em28/10, no run `run-1793222933625-71a18c69`, com as31
alterações próprias já na baseline, sem alteração de produto ou política.
Resultados dos dois runs e limites constam na evidência T08. Não atribuir
supervisão retroativa nem usar o15/15 antigo como gate do novo run.

### Tarefa 8: Perfil

**Execução T09 iniciada em29/10:** integrador corrigido prevalece sobre activeDays e a semana fictícia do exemplo. Prova positiva só lastActiveDate; contador nominal independente, desconhecido explícito e G5 preservado. Entrada de edição de meta permanece até T10. Núcleo implementado em29/10: código R1 PASS,60 focais/CPU,163 consumidores/105 contratos; nativo R2 BOUNDED, sem aceite Android ao vivo/retorno/save nativo; Loop15/15 após fix1, dois ciclos. G5/global permanecem separados. [Evidência](../../evidence/2026-10-29-medalhao-t09.md).

**Arquivos:**
- Modificar: `radiant-app/src/features/profile/screens/ProfileScreen.tsx`
- Modificar: `radiant-app/src/features/profile/components/ProfileIdentityHeader.tsx`
- Criar: `radiant-app/src/features/profile/components/MedalShelf.tsx`
- Criar: `radiant-app/src/features/profile/components/StreakWeek.tsx`
- Criar: `radiant-app/src/features/profile/components/TodayGoals.tsx`
- Deixar de montar no Perfil: `MissionsScreen` e `ProgressScreen` embutidos.
  Apague-os só se nenhuma outra rota os usar
- Testar: `ProfileScreen.flow.test.tsx` e um teste por componente novo

**Interfaces:**
- Consome: `GamificationService.getSnapshot()`, `DailyGoalService.getSnapshot()`,
  `SpacedRepetitionService.getDueCount()`, `JourneyCurriculumService.getCurriculumTrail()`
  e `JourneyStarsService` (plano 2).
- Produz:
  - `MedalShelf(props: { nodes: JourneyNode[]; starsByLessonId: Record<string, LessonStars> }): React.ReactElement`:
    as aulas da unidade atual, concluídas em ouro e as demais em silhueta;
  - `StreakWeek(props: { activeDays: ReadonlySet<string>; today: string; streakDays: number }): React.ReactElement`:
    título "N dias seguidos" ("1 dia seguido"), sete dias de segunda a domingo,
    hoje com anel; e, se hoje não está feito e `streakDays > 0`, a linha
    "Estude hoje para manter a sequência. Fecha à meia-noite.";
  - `TodayGoals(props: { goals: { title: string; value: number; target: number }[] }): React.ReactElement`:
    linhas com "v de t" e barra de 6 pt;
  - o total de XP aparece uma vez, como texto no fim ("44 XP no total").

- [x] **Passo 1: Escrever os testes que falham**

- o Perfil não tem os blocos "SEQUÊNCIA" e "XP TOTAL", a faixa laranja, os
  chips "Começar · 10 XP" nem os cartões de missão;
- aluno novo (foco 3): estante toda em silhueta, semana sem dia feito, metas em
  0, e nenhuma frase de estado vazio;
- no maior Dynamic Type, os sete dias da semana continuam numa linha só ou
  quebram em duas linhas inteiras, sem cortar letra.

- [x] **Passo 2: Ver falhar**

Run: `cd radiant-app && npx jest src/features/profile`
Expected: FAIL.

- [x] **Passo 3: Implementar**

A escolha do nível de meta, que hoje vive nos chips, vai para Ajustes como uma
linha "Meta diária" com o nível atual (tarefa 9). A meta não pode sumir do app.

- [ ] **Passo 4: Ver passar, com Maestro**

Focais/CPU/consumidores/contratos PASS e inspeção nativa BOUNDED em29/10; os fluxos Maestro completos não foram executados nesta tarefa. Android ao vivo/retorno e gates globais continuam pendentes.

Run: `cd radiant-app && npx jest src/features/profile src/features/missions src/features/progress && npm run test:maestro-contract`
Expected: PASS.

- [ ] **Passo 5: Commit**

```bash
git add -A radiant-app/src/features/profile radiant-app/src/features/missions radiant-app/src/features/progress
git commit -m "feat(perfil): estante de medalhas, semana da sequência e metas em linha"
```

### Tarefa 9: Ajustes

**Núcleo implementado/revisado em29/10:** R1 reprovada por dois P2 de operações pendentes entre telas; FIX1 aprovada em R2, com ordenação nos serviços existentes sem mudar fórmulas, esquema, consentimento ou política.374testes normais/25suítes,40repetidos sob CPU limitada e105contratos PASS;17mutações causais aceitas. Nativo R3 BOUNDED/APPROVED_CORE_BOUNDED: normal/máxima inicial e Back observados nos dois sistemas; gesto iOS NOT PASS, leitor audível e save nativo sem aceite. P3 dos chevrons legais encaminhado à T17/revisão ampla, não resolvido. Writer atual `run-1793287644499-ac7eb003`,61nominais/27produto; final configurada15/15 PASS em um ciclo na janela atual (também primeiro ciclo final do objetivo). Janelas56/57 abandonadas em edição, zero finais; sem supervisão retroativa. [Evidência](../../evidence/2026-10-29-medalhao-t10.md).

**Arquivos:**
- Modificar: `radiant-app/src/features/settings/screens/SettingsScreen.tsx`
- Criar: `radiant-app/src/ui/components/GroupedList.tsx`
- Modificar: `SubscriptionCard.tsx`, `ICloudBackupCard.tsx`,
  `FeedbackPreferencesCard.tsx` e `LegalLinksCard.tsx`, que viram linhas (ou
  são substituídos por linhas dentro da tela e removidos)
- Testar: `SettingsScreen.flow.test.tsx` e `GroupedList.test.tsx`

**Interfaces:**
- Produz:
  - `GroupedList(props: { header?: string; footer?: string; children: React.ReactNode }): React.ReactElement`,
    o grupo do iOS: título simples acima (sem caixa alta forçada), linhas com
    divisória numa superfície de raio 12, rodapé em uma frase;
  - a tela "Ajustes" com os grupos da prancheta: Radiant Ilimitado; "Durante a
    aula" com Sons e Vibração; "Lembrete" com o lembrete diário; "Meta diária";
    "Progresso" com "Backup no iCloud" e o detalhe "Em breve"; e o grupo final
    com "Rever a apresentação", Privacidade e Termos de uso. As ferramentas de
    homologação continuam só fora do build do aluno.

- [x] **Passo 1: Escrever os testes que falham**

- o título é "Ajustes";
- nenhuma etiqueta em caixa alta e nenhum cartão com borda por opção;
- os interruptores de Sons e Vibração gravam as mesmas preferências de hoje;
- o backup aparece como linha desabilitada "Em breve", sem o parágrafo laranja.

- [x] **Passo 2: Ver falhar**

Run: `cd radiant-app && npx jest src/features/settings src/ui/components/GroupedList.test.tsx`
Expected: FAIL.

- [x] **Passo 3: Implementar**

- [x] **Passo 4: Ver passar**

Run: `cd radiant-app && npx jest src/features/settings src/features/profile src/features/subscription src/features/progress-sync src/ui/components`
Expected: PASS.

- [ ] **Passo 5: Commit**

```bash
git add -A radiant-app/src/features/settings radiant-app/src/ui/components radiant-app/src/features/subscription/components radiant-app/src/features/progress-sync/components radiant-app/src/features/profile/components radiant-app/src/features/progress/components
git commit -m "feat(ajustes): lista agrupada do iOS no lugar dos cartões"
```

### Tarefa 10: Assinatura

**Arquivos:**
- Modificar: `radiant-app/src/features/subscription/screens/SubscriptionScreen.tsx`
- Modificar: o módulo nativo em `radiant-app/modules/radiant-storekit/`,
  `storekitNative.types.ts`, `StoreKit2Adapter.ts` e `subscription.types.ts`,
  para o preço numérico (ver o passo 3)
- Testar: `radiant-app/src/features/subscription/screens/SubscriptionScreen.flow.test.tsx`,
  `StoreKit2Adapter.test.ts` e `radiantStoreKitModule.contract.test.ts`

**Interfaces:**
- Consome: `subscriptionService.loadOffers()`, `purchase(productId, nowMs)`,
  `restore(nowMs)`, `manageSubscription(nowMs)` e `periodOfProduct(productId)`.
- Produz: título "Radiant Ilimitado"; a frase "Errar não custa vida."; a linha
  "As aulas são as mesmas para todo mundo."; os dois planos lado a lado como
  medalhas selecionáveis (mensal no azul, anual em ouro), com o preço da loja e,
  no anual, o preço por mês calculado do preço da loja; um botão "Assinar
  mensal" ou "Assinar anual" conforme a seleção (ouro quando é o anual);
  "Restaurar compras" em texto; e o texto legal de hoje, inteiro, menor.

- [ ] **Passo 1: Escrever os testes que falham**

- o anual vem selecionado; tocar no mensal troca o rótulo do botão;
- o botão chama `purchase` com o `productId` do plano selecionado;
- `store-unavailable`: sem plano e sem botão de compra, com a frase que a tela
  já usa para isso;
- assinante: "Gerenciar assinatura" no lugar de "Assinar";
- o texto legal é idêntico ao de hoje (compare com a string atual);
- com `price: 22.99` e `currencyCode: 'USD'`, o anual mostra "$1.92 por mês";
  sem `price`, essa linha não aparece;
- nenhum "—" no título.

- [ ] **Passo 2: Ver falhar**

Run: `cd radiant-app && npx jest src/features/subscription`
Expected: FAIL.

- [ ] **Passo 3: Implementar**

Em 2026-10-21 o `StoreProduct` só traz `displayPrice`, o texto que a Apple
devolve ("R$ 19,90"), e o módulo nativo não expõe número. O preço por mês exige
acrescentar ao módulo `radiant-storekit` o `price` do StoreKit 2 (o `Decimal`
convertido para `Double`) e o `priceFormatStyle.currencyCode`, e levá-los ao
tipo `StoreProduct` como `price?: number` e `currencyCode?: string`. É mudança
nativa, que entra na mesma build nova que o Skia já exige. O preço por mês é
`price / 12` formatado com `Intl.NumberFormat` na moeda da loja. Sem os dois
campos, a linha não aparece; não converta o texto em número.

- [ ] **Passo 4: Ver passar, com os contratos da loja**

Run: `cd radiant-app && npx jest src/features/subscription`
Expected: PASS, incluindo `storekitTestingConfig.contract.test.ts`.

- [ ] **Passo 5: Commit**

```bash
git add -A radiant-app/src/features/subscription radiant-app/modules/radiant-storekit
git commit -m "feat(assinatura): planos como medalhas e um botão só"
```

### Tarefa 11: Sem vidas

**Arquivos:**
- Modificar: `radiant-app/src/features/hearts/components/HeartsSheet.tsx`
- Testar: `radiant-app/src/features/hearts/components/HeartsSheet.test.tsx`

**Interfaces:**
- Produz: a folha com os cinco corações de 40 pt (cheios e vazios), o título
  "Sem vidas" quando zeradas ou "Suas vidas" quando não, a linha "A próxima
  volta em N min." (de `nextRefillAt`), "Revisar agora" como ação principal
  quando `dueReviewCount > 0`, e "Vidas ilimitadas" como link quando
  `storeAvailable`. As props não mudam.

- [ ] **Passo 1: Escrever os testes que falham**

- 0 vidas e 2 revisões: cinco corações vazios, "Sem vidas", "Revisar agora" e o
  link;
- sem revisão devida: sem "Revisar agora", e "Voltar" como ação;
- `storeAvailable` falso: sem o link.

- [ ] **Passo 2: Ver falhar**

Run: `cd radiant-app && npx jest src/features/hearts`
Expected: FAIL.

- [ ] **Passo 3: Implementar**

- [ ] **Passo 4: Ver passar, com Maestro**

Run: `cd radiant-app && npx jest src/features/hearts && npm run test:maestro-contract`
Expected: PASS. O `radiant-1-4-vidas-esgotadas.yaml` muda junto se lê o texto
da folha.

- [ ] **Passo 5: Commit**

```bash
git add -A radiant-app/src/features/hearts .maestro
git commit -m "feat(vidas): os cinco corações e uma ação principal"
```

### Tarefa 12: Fechamento: fundo, guarda em zero e evidência

**Arquivos:**
- Renomear: `radiant-app/src/ui/components/StarfieldBackground.tsx` para
  `ScreenBackground.tsx`, sem as props inertes `starCount` e `variant`, e todos
  os importadores
- Modificar: `radiant-app/scripts/copy-style-baseline.json`, com teto zero
- Modificar: `radiant-app/scripts/visual-qa-policy.json`, sem os registros dos
  arquivos refeitos
- Modificar: `docs/DESIGN.md`, seções Fundo e HUD
- Criar: `docs/evidence/<data>-demais-telas-medalhao.md` e a pasta de capturas

- [ ] **Passo 1: Renomear o fundo**

Enumere os importadores com duas buscas (o nome do componente e o caminho do
arquivo) antes de renomear, e confira que a contagem bate depois.

- [ ] **Passo 2: Zerar a guarda de texto**

O que sobrar fora das telas deste plano vai para o relatório da evidência, com
o arquivo e a linha, e o teto daquele arquivo fica no valor medido, com o
motivo no JSON. Nenhum teto de tela refeita fica acima de zero.

- [ ] **Passo 3: Rodar o gate**

Run: `cd radiant-app && EXPO_NO_DOTENV=1 npm run quality`
Expected: código 0.

- [ ] **Passo 4: Capturar as nove telas no simulador**

As mesmas nove da prancheta do app, mais o maior Dynamic Type no Perfil e na
assinatura, e "reduzir movimento" no resultado. Ponha cada captura ao lado da
captura de "Hoje" da prancheta.

- [ ] **Passo 5: Rodar os roteiros Maestro**

Run: `maestro test .maestro/`
Expected: todos passam.

- [ ] **Passo 6: Escrever a evidência e fazer commit**

```bash
git add -A radiant-app docs/DESIGN.md docs/evidence/
git commit -m "docs(telas): evidência do app inteiro no Medalhão, guarda de texto em zero"
```

---

## Entradas vindas da execução dos planos 6 e 2 (2026-10-22)

**Estado:** não começado. Estes achados chegaram durante a execução dos outros
planos e entram nas tarefas indicadas:

- **"Continuar jornada" e mais seis rótulos de ação** saíram do cartão de
  recomendação para `nodeCopy.ts` (plano 2, tarefa 6) e ainda dizem "jornada".
  Sete roteiros Maestro tocam "Continuar jornada" ou o testID
  `journey-recommendation-action`. A troca do texto entra na tarefa 1 (guarda de
  texto), com os YAMLs e o `maestro-contract` atualizados na mesma tarefa.
- **Tarefa 3 (boas-vindas):** o "Pular" fica sob a barra de status e não
  respondeu ao toque no simulador em 2026-10-21.
- **Tarefa 6 (revisão):** a seta do `SpeechBubble` corta a primeira letra de
  uma linha ("'tem por vez"). O balão sai com o Pixel da revisão.
- **Tarefa 9 (Ajustes):** os links de Ajuda usam emoji (↗️) como ícone.
- **`HybridLessonCharacter.tsx`** ainda troca `celebrate` por `happy` sob
  "reduzir movimento". Com o Pixel novo, isso troca a pose (comemorar vira
  acenar) em vez de acalmar a animação. Tire a troca na tarefa 4.
- **`JourneyMedal`** já aceita uso sem `onPress` (imagem com rótulo) e
  `unitNumber` para a medalha de avaliação. As tarefas 4, 7 e 8 usam assim.
- **O HUD (tarefa 2)** ainda mostra os cinco corações e o "5" embaixo, visto em
  2026-10-22.

## Entradas vindas da execução do plano 3 (2026-10-24)

Vistas no simulador iOS ao fazer as duas aulas-bancada de exemplo
([evidência](../../evidence/2026-10-24-aula-bancada.md)):

- **Integração da aula (T04 do plano integrador):** a abertura da aula não mostra a medalha do tema, e o
  Pixel não aparece nomeando o efeito no passo de explorar. A spec §5 pede os
  dois, e a §11.1 põe "a explicação na aula" entre os quatro momentos do Pixel.
- **Tarefa 4 (resultado):** a captura de 24/10 mostra o Pixel antigo em PNG;
  em `b5ac9bf`, o `LessonSummary` já importa `PixelIllustration` vetorial.
  Falta a composição Medalhão do resultado, não refazer a troca do mascote.
  Sem nó da trilha, a conclusão mostra "Sem XP nesta tentativa"; mudar o
  desenho/copy não autoriza conceder XP nem gravar progresso sem nó.
- **Player:** o fechamento da aula aparece antes dos itens que voltam. A
  comparação e a decisão de caso ainda não têm bloco de retorno visível (só a
  múltipla escolha e a bancada têm).
- **Bancada:**
  - "Produto dose-área: 100% do campo todo" quebra em duas linhas num iPhone de
    402 pt;
  - o botão desabilitado até o alvo não tem dica de acessibilidade nem anúncio
    quando habilita.


## Registro de execução — 2026-10-25

T00 reconciliado e aprovado por revisor independente. **T01 implementada,
revisada (R4: spec/qualidade APPROVED) e validada (15/15 Loop)**. Guarda AST
no quality, baseline medida por arquivo/classe: 135 achados em 40 arquivos.
CTA “Continuar trilha”, seis YAMLs consumidores e contratos/performance
alinhados; os demais rótulos ficam medidos até suas tarefas. T17 exige zero
e revisão da fronteira estática. Não houve alteração de tela para absorver
achado; dois dashes omitidos pela primeira análise passaram a ser medidos.

A [evidência](../../evidence/2026-10-25-medalhao-t01.md) contém vermelho/verde,
pareceres R1–R4 e validação. O passo de commit do checklist antigo acompanha
o fechamento desta transação pelo controlador; o ledger registra o SHA final.
O número antigo de sete roteiros/rótulos não define o escopo atual.
T01 entregue no commit55e21ae. Nenhum aceite humano ou resultado nativo inferido.

### T02 entregue em 2026-10-26

HUD e QuizTopBar compartilham a pílula: um coração e número no finito,
∞ sozinho no ilimitado. API HeartsDisplay de cinco preservada; a folha
atual ainda não desenha cinco corações, cuja entrega continua na tarefa11/T12,
conforme spec §11.3. Revisão independente R4 aprovada,173 testes/7suítes e
102 contratos focais; visual strict sem regressão. Prova nativa finito5 na
trilha/aula e folha aberta em iOS/Android, nos binários existentes.
[Evidência, limites e revisões](../../evidence/2026-10-26-medalhao-t02.md).

Writer inicial `run-1793009906160-fa339b65` foi encerrado sem validação/sucesso
quando a prova da aula revelou o consumidor QuizTopBar omitido. O substituto
`run-1793011345601-6bbdc725` declarou a união antes da integração e obteve
Loop15/15 na segunda tentativa; primeira14/15 com app-quality timeout, sem
alterar produto/política entre tentativas. Commit e fechamento pelo controlador,
com SHA no ledger. Próxima T03 boas-vindas; G1–G8 permanecem pendentes.


### T03 entregue tecnicamente em 2026-10-26

Boas-vindas em uma tela com a bancada real de kV, Pixel, instrução fora da
fala e saída sempre disponível. Continuar exige mudança real; imagem, texto
e estado respondem ao controle digital existente. Cursores legados e marker
continuam compatíveis, com kV local reiniciando em60. Reentrada e conclusão
única foram testadas nos consumidores reais; as três frases aguardam G2.

O nativo reprovou primeiro Pular sob statusbar e depois texto máximo cortado.
Provider nativo local e refluxo/métricas naturais corrigiram os achados, com
prova de leitura, rolagem e saída em iOS/Android. O escopo incluiu quatro
YAMLs, contrato Maestro e BenchControlRow com seu teste, medidos antes das
respectivas edições. R1–R4 registram os limites; Loop15/15 na segunda tentativa
após oito anotações de tipo nos testes, sem mudar o runtime nativo validado.
[Evidência](../../evidence/2026-10-26-medalhao-t03.md). Próxima T04 do integrador.


### Consolidação documental até T07 — 2026-10-28

Os registros datados acima preservam seus checkpoints. T07 foi encerrada no
núcleo no commit `85ebf01`, com Loop15/15, writer/cérebro CLOSED e CI247/152
SUCCESS no SHA completo, conforme a evidência da tarefa. O passo de commit
da tarefa 6 está concluído. A tarefa 7/T08 ainda não começou. PushOptIn máximo
P2 e cauda P3 seguem para T17; o aceite global do layout permanece bloqueado.


### Correção por criticidade — PushOptIn — 29/10/2026

Após a T08 publicada em1b987c1 com CI249/154 SUCCESS, Anderson priorizou
R3-SHARED-01 antes da T09. Dois arquivos corrigem o componente sem alterar
copy/handlers/economia/política: linhas naturais e identidade de Text porfontScale.
R1 código PASS,53 focais/11 sob CPU limitada; R2 nativo BOUNDED/APPROVED_CORE_BOUNDED
no Home local real. Review atual vazio não foi fabricado; Android ao vivo eT17
global não aprovados. P3 caudaT06 e gates permanecem; T09 ainda não iniciada.
Loop final15/15 PASS, em um ciclo em29/10. [Evidência](../../evidence/2026-10-28-medalhao-pushoptin-p2.md).
