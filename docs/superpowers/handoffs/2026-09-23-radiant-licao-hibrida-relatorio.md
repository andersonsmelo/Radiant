# Lição híbrida — relatório da implementação do piloto (2026-09-23)

Executado em nuvem em 2026-09-23 pelo
[prompt de handoff](2026-09-23-radiant-licao-hibrida-prompt-nuvem.md), seguindo o
[plano](../plans/2026-09-23-licao-hibrida-piloto.md). Branch
`feat/licao-hibrida-piloto`, criado com `--no-track` a partir de
`origin/docs/licao-hibrida-piloto` (`85bd286`), porque esse branch **não** estava
mergeado na `main`; ele contém a `main` (`78f96d0`). PR em rascunho:
[andersonsmelo/Radiant#24](https://github.com/andersonsmelo/Radiant/pull/24), contra
`docs/licao-hibrida-piloto`. Sem merge, sem build, sem EAS, sem Loop.

## Resumo

1. As 8 tarefas do plano foram implementadas com TDD: geometria do mapa, tabela e modelos, sessão com aprovação, som e vibração, Perfil, tela e rota, e medidas locais.
2. O piloto só existe na rota `/licao-hibrida`, atrás de `SHOW_DEV_TOOLS`. O V3 continua desligado, `prepareV3()` não é chamado e nenhum adaptador de analytics foi registrado.
3. Gate do app (`EXPO_NO_DOTENV=1 npm run quality`, Node v20.20.2): exit 0, com 147 suítes e 1344 testes, 0 erros e 26 avisos de lint, e visual QA sem regressão.
4. Três guardas do plano não falhavam, ou falhavam pelo motivo errado. Foram corrigidas e vistas vermelhas pelo defeito que nomeiam: o espelho da tabela, o teste de evidência que nunca saía de `h01` e o lint.
5. Continuam pendentes a aprovação dos modelos pelo dono (`L1_TEMPLATE_APPROVAL = null`), o fechamento no Loop pela sessão local e a verificação em simulador ou aparelho.

## Commits

Na ordem, sobre `85bd286`:

| Hash | Mensagem |
| --- | --- |
| `ff71afe` | refactor(l1): extrai a geometria do mapa corporal sem mudar comportamento |
| `bf84de5` | feat(l1): geometria do mapa na tela, com guardas de lado, quadro e rotação |
| `e6ca46b` | feat(l1-hibrida): tabela de relações e três modelos com gabarito calculado |
| `9c85bb1` | feat(l1-hibrida): plano de 12 itens, sessão com reinserção e aprovação por impressão digital |
| `8f9224e` | feat(feedback): camada de som e vibração da lição, com preferências |
| `75eca92` | feat(perfil): interruptores de sons e vibração, só no piloto |
| `cfe4bf1` | feat(l1-hibrida): tela da lição híbrida e rota de desenvolvimento |
| `c3f1fda` | feat(l1-hibrida): medidas locais das sessões do piloto no console |
| `5ea82d6` | docs: piloto da lição híbrida implementado localmente |
| `5f1a36d` | fix(l1-hibrida): Pixel da lição em componente de personagem, pela regra R5 do visual QA |
| (este) | docs: relatório do piloto da lição híbrida |

Todos terminam com `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

## Arquivos

Caminhos relativos a `radiant-app/src/`, salvo quando começam por `radiant-app/` ou `docs/`.

**Criados**

- `features/curriculum-v3/l1-body-reference/bodyMapGeometry.ts` — posições dos landmarks, rotação do canvas e ponto e região de cada landmark na tela.
- `features/curriculum-v3/l1-body-reference/bodyMapGeometry.test.ts` — guardas de lado, de quadro (3 larguras × 6 cenários) e de rotação e espelho iguais aos do mapa desenhado.
- `features/curriculum-v3/hybrid-l1/hybridItem.types.ts` — tipos do item híbrido.
- `features/curriculum-v3/hybrid-l1/seededRandom.ts` e `.test.ts` — sorteio mulberry32 determinístico.
- `features/curriculum-v3/hybrid-l1/l1RelationTable.ts` — tabela de relações revisável pelo dono.
- `features/curriculum-v3/hybrid-l1/l1ItemTemplates.ts` e `.test.ts` — os três modelos, a variação de cenário e as guardas de gabarito, descrição, par, quadro e forma.
- `features/curriculum-v3/hybrid-l1/l1HybridLessonPlan.ts` — os 12 itens e a amostra de revisão (20 itens).
- `features/curriculum-v3/hybrid-l1/HybridLessonSession.ts` e `.test.ts` — máquina de estados pura: reinserção, evidência, sequência, XP e tempo.
- `features/curriculum-v3/hybrid-l1/l1TemplateApproval.ts` e `.test.ts` — impressão digital FNV-1a; aprovação `null`.
- `features/curriculum-v3/hybrid-l1/__snapshots__/l1TemplateApproval.test.ts.snap` — a amostra que o dono revisa.
- `features/curriculum-v3/hybrid-l1/HybridLessonScreen.tsx` e `.flow.test.tsx` — a tela, com 6 casos de fluxo e aquecimento em `beforeAll`.
- `features/curriculum-v3/hybrid-l1/HybridLessonCharacter.tsx` — o Pixel da sequência e do fim. **Não está no plano**; ver Desvios.
- `features/curriculum-v3/hybrid-l1/HybridLessonMetricsRepository.ts` e `.test.ts` — medidas locais, no máximo 20 sessões.
- `features/dev-console/components/HybridLessonMetricsCard.tsx` e `.test.tsx` — lista das medidas no console.
- `features/profile/components/FeedbackPreferencesCard.tsx` e `.test.tsx` — os interruptores "Sons" e "Vibração".
- `ui/feedback/feedbackPreferences.ts` e `.test.ts` — preferências, ligadas por padrão.
- `ui/feedback/lessonSounds.ts` e `.test.ts` — pré-carga e toque dos seis sons, respeitando o silencioso.
- `ui/feedback/lessonFeedback.ts` e `.test.ts` — liga cada evento a um som e a uma vibração.
- `test/mocks/expoAudio.ts` — mock do `expo-audio` para o Jest.
- `app/licao-hibrida.tsx` — rota de desenvolvimento, com o mesmo gate do console.
- `test/routes/licao-hibrida.test.tsx` — a rota monta ou bloqueia conforme `SHOW_DEV_TOOLS`.
- `docs/superpowers/handoffs/2026-09-23-radiant-licao-hibrida-vermelhos.md` — execuções vermelhas.
- `docs/superpowers/handoffs/2026-09-23-radiant-licao-hibrida-relatorio.md` — este relatório.

**Modificados**

- `radiant-app/package.json` — `"expo-audio": "~1.1.1"`. A ordem original das dependências foi preservada.
- `radiant-app/package-lock.json` — entrada do `expo-audio 1.1.1`, gerada pelo instalador. Ele também sincronizou o `version` do lock (`1.2.0` → `1.3.1`, que é o valor do `package.json`).
- `radiant-app/jest.config.cjs` — `moduleNameMapper` do `expo-audio`.
- `constants/storageKeys.ts` — `FEEDBACK_PREFERENCES` e `HYBRID_LESSON_METRICS`. Nenhuma das duas entrou em `PEDAGOGICAL_STORAGE_KEYS`.
- `ui/feedback/haptics.ts` — `hapticSelection` e `hapticStreak`.
- `features/curriculum-v3/l1-body-reference/BodyReferenceMap.tsx` — usa a geometria extraída e ganha `showControls`, `emphasizeMidline` e `landmarksInteractive`.
- `features/curriculum-v3/l1-body-reference/BodyReferenceMap.test.tsx` — 3 casos para os props novos.
- `features/profile/screens/ProfileScreen.tsx` — cartão de sons e vibração atrás de `SHOW_DEV_TOOLS`.
- `features/profile/screens/ProfileScreen.flow.test.tsx` — mock das preferências e asserção com a flag ligada e desligada.
- `app/_layout.tsx` — `<Stack.Screen name="licao-hibrida" />`.
- `features/dev-console/screens/DevConsoleScreen.tsx` — cartão de medidas e botão "Piloto: lição híbrida (L1)".
- `features/dev-console/screens/DevConsoleScreen.flow.test.tsx` — mock do repositório de medidas. **Fora da lista do `abrir.mjs`**; ver Riscos.
- `docs/superpowers/specs/2026-09-23-licao-hibrida-piloto-design.md` — estado atualizado e nova §10.
- `docs/FILA.md` — o item do piloto virou pendência do dono.
- `docs/archive/FILA_concluidos.md` — o item antigo, sob "Lote de 2026-09-23 — piloto da lição híbrida implementado localmente".
- `docs/STATUS.md` — linha do Currículo V3.
- `docs/archive/STATUS_historico.md` — a linha antiga, sob "Lote de 2026-09-23 — piloto da lição híbrida implementado no branch".
- `docs/plans/2026-07-27-radiant-launch-roadmap.md` — a J3 aponta para o plano e registra o estado.
- `docs/README.md` — aponta para este relatório.

`radiant-app/app.json` **não mudou**. O `npx expo install` acrescentou o plugin `expo-audio`, e a mudança foi revertida antes do commit.

## Gate

Todos os comandos rodaram em 2026-09-23, sobre a árvore limpa de `5f1a36d` (`git status --porcelain` vazio). Os números valem para o conjunto rastreado.

**1. `node --version`**

```text
v20.20.2
```

**2. `cd radiant-app && EXPO_NO_DOTENV=1 npm run quality`**: **exit 0**

```text
✖ 26 problems (0 errors, 26 warnings)
> tsc --noEmit                      (sem saída)
15 contratos node --test: todos "# fail 0"
Test Suites: 147 passed, 147 total
Tests:       1344 passed, 1344 total
Snapshots:   1 passed, 1 total
Scanned 363 files.
Found 64 issues: 0 regressions, 61 baselined, 3 scoped exceptions.
✅ Visual QA passed without unapproved regressions.
EXIT=0
```

A linha de base do `STATUS.md` (`b7aa165`, 2026-09-23) era de 134 suítes e 1224 testes, com 26 avisos. O piloto soma **13 suítes e 120 testes**, sem aviso de lint novo. A primeira execução completa deste gate **reprovou**, no visual QA (R5, `HybridLessonScreen.tsx`), com Jest 147/1344 verde. A correção está em Desvios.

**3. Na raiz: `node --test scripts/qa/docs-contract.test.mjs && node scripts/qa/docs-contract.mjs`**

```text
# tests 14
# pass 14
# fail 0
PASS documentation contract
```

**4. Na raiz: os três testes de conteúdo**: **reprova neste ambiente, por motivo anterior a este PR**

```text
not ok 20 - galaxy-tecnologia existe, ativa, com o titulo que o app ja reservou
  error: "ENOENT: no such file or directory, open '/home/user/Radiant/Conteúdo/taxonomia/galaxias.json'"
not ok 21 … 24, 26, 29   (mesma causa)
# tests 31
# pass 24
# fail 7
```

Causa medida: o índice do git guarda o diretório como `conteúdo/`, em minúscula, e os scripts abrem `Conteúdo/`. No macOS, que ignora a caixa, os dois nomes abrem o mesmo diretório. No Linux do ambiente em nuvem, não. É a armadilha já descrita no `AGENTS.md` (2026-08-07). Evidência de que a causa não é este diff:

- em worktree limpa da **base** `85bd286`, sem nenhum commit deste PR, o resultado é o mesmo: 24/31 e as mesmas 7 falhas;
- em worktree limpa de **`5f1a36d`**, com um link `Conteúdo -> conteúdo` criado só na worktree temporária: `# tests 31`, `# pass 31`, `# fail 0`. O mesmo vale para a base;
- nenhum workflow em `.github/workflows/` roda esses três testes.

Não corrigi: seria mexer em `scripts/content/` ou na caixa de um diretório rastreado, fora do escopo e com efeito no checkout do dono. **Remedir no Mac do dono.**

## Vermelhos

Detalhe e saída de cada um em
[`2026-09-23-radiant-licao-hibrida-vermelhos.md`](2026-09-23-radiant-licao-hibrida-vermelhos.md).

| Guarda | Mutação | Seção |
| --- | --- | --- |
| Todo landmark fica dentro do quadro | `head-marker` → `[120, -40]` | Tarefa 1 · 1.1 |
| O mapa usa a rotação e o espelho da geometria | `canvasRotation(posture)` → `'90deg'` | Tarefa 1 · 1.2 |
| Lateralidade: resposta é a mão do lado pedido do corpo | gabarito pela mão "à direita" | Tarefa 2 · 2.1 |
| A descrição de cada mão diz onde o mapa a desenha | `describeRegion('direita')` fixo | Tarefa 2 · 2.2 |
| Relação: resposta é o landmark revisado | `lateral` → `shoulder-marker` (**não falhava**; guarda corrigida) | Tarefa 2 · 2.3 |
| Só a primeira tentativa de desafio original é independente | `independent` sem `!item.variant` | Tarefa 3 · 3.1 |
| Com sons desligados, só vibra | apaga o `if (preferences.sounds)` | Tarefa 4 · 4.1 |
| Cartão de sons só com `SHOW_DEV_TOOLS` (extra) | gate → `true` | Tarefa 5 · 5.1 |
| Desligar sons mantém a vibração (extra) | `onChange({ sounds, haptics: true })` | Tarefa 5 · 5.2 |
| A rota não monta a lição no build do aluno | `if (!AppConfig.SHOW_DEV_TOOLS)` → `if (false)` | Tarefa 6 · 6.1 |
| Erro de primeiro contato não gasta vida na tela (extra) | `answer.costsHeart` → `!answer.correct` | Tarefa 6 · 6.2 |
| Props novos do mapa | vermelho antes da implementação (só o resumo guardado) | Tarefa 6 |
| A tela grava sessão concluída e abandono | vermelho antes da implementação (só o resumo guardado) | Tarefa 7 |

Os trechos de saída estão literais, com duas edições marcadas no topo do arquivo: tirei os tempos `(N ms)` das linhas `✕` e troquei o objeto de fibra do React, que ocupava uma linha, por uma indicação.

## Desvios do plano

1. **`bodyMapGeometry.test.ts` sem JSX.** O plano põe JSX num arquivo `.ts`, e o Babel do Jest recusa (`SyntaxError: Unexpected token`, medido). Mantive o nome declarado e troquei o JSX por `React.createElement`.
2. **A guarda "relação: a resposta é o landmark que a tabela liga" era espelho.** Com a mutação 2.3 do plano, a suíte passou inteira (8/8), porque o teste lia o gabarito da mesma tabela que a mutação altera. Criei `REVIEWED_KEY`, uma cópia literal dos 5 pares revisados, dentro do teste, e passei a comparar o item com ela. Ver vermelho 2.3. Consequência: mudar um par passa a exigir mudar a tabela e o teste.
3. **O teste de evidência da sessão errava `h01` para sempre.** Como o primeiro contato repete o item até o acerto, a lição nunca saía de `h01`, e o teste reprovava contra a implementação correta (`kinds.get(...)` vinha `undefined`). Agora ele erra só a primeira tentativa de `h01` e de `h07`. A sessão não mudou.
4. **Amostra de revisão com a linha "No mapa" nos itens de verdadeiro ou falso.** Sem essa linha, o dono não tinha como saber qual landmark é o "marcador N" e conferir o ✓ de 4 dos 20 itens. A impressão digital não muda, porque é calculada sobre os itens e não sobre o texto da amostra.
5. **Mock do AsyncStorage** (`jest.mock(... async-storage-mock)`, a mesma linha de outros testes do repositório) em 4 testes que importam, direta ou indiretamente, módulos que usam o AsyncStorage: preferências, cartão do Perfil, repositório de medidas e cartão do console. Sem o mock, eles reprovam com `NativeModule: AsyncStorage is null`.
6. **`lessonFeedback.test.ts` passa no lint.** O plano tinha 1 erro de lint (`import/namespace`, por causa de `haptics[haptic]`) e 1 aviso (`ReadonlyArray`). Troquei por `jest.requireMock(...)` e `readonly (…)[]`. A mutação 4.1 foi repetida contra a versão final e continua vermelha.
7. **`includeHiddenElements: true`** em duas consultas: `body-map-midline`, que fica dentro do SVG marcado `accessibilityElementsHidden`, e `hybrid-item-id`, que é oculto de propósito. A Testing Library ignora elementos ocultos por padrão.
8. **`placement` com `as const`** em `BodyReferenceMap.tsx`. Extraído para uma variável, o `${n}%` virava `string`, e o `tsc` reprovava (`not assignable to DimensionValue`).
9. **`HybridLessonCharacter.tsx`**, arquivo novo fora da lista do plano. O visual QA reprovou por R5, que só aceita `PixelIllustration` em arquivos com nome de arquétipo (`Summary`, `Quiz`, `Character`…), e a política não tem exceção para R5. Considerei três alternativas:
   - criar uma exceção na política, o que afrouxaria o QA e é proibido;
   - renomear a tela, o que mudaria nomes declarados no plano inteiro;
   - tirar o Pixel, o que contraria a §5.2 da spec.

   Segui o padrão do quiz legado (`QuizFeedback`, `LessonSummary`), com um componente de personagem para os dois momentos. Props e rótulos do Pixel são idênticos aos do plano.
10. **`npx expo install` precisou de `EXPO_OFFLINE=1`.** A API do Expo não responde deste ambiente: `SyntaxError: Unexpected token 'H', "Host not i"... is not valid JSON`. O modo offline usa o `bundledNativeModules.json` local, que também dá `~1.1.1`. O instalador reordenou as dependências do `package.json` e acrescentou o plugin ao `app.json`: restaurei a ordem e reverti o `app.json`. `npm ci` completo em seguida: `added 1534 packages`, sem erro.
11. **Mutações a mais**: 5.1, 5.2 e 6.2, em guardas novas que o plano não mandava mutar.
12. **Commit da Tarefa 5 inclui o arquivo de vermelhos**, porque ganhou a seção dessa tarefa.

A API do `expo-audio 1.1.1` instalado bate com o plano: `createAudioPlayer(source)`, `play()`, `seekTo(seconds): Promise<void>`, `remove()` e `setAudioModeAsync({ playsInSilentMode })`. Nenhum nome precisou ser trocado.

## Não feito

- **Loop e cérebro**: `abrir.mjs`, `loop validate`, `step finish`, memória, `run close` e o passo 4 da Tarefa 8. Não existem neste ambiente; ficam com a sessão local.
- **Simulador, aparelho e build**: nenhum `expo run:ios`, EAS, submit ou OTA. Nada foi visto rodando num app de verdade. Lembrete do `STATUS.md`: o gate não empacota o app, e o `expo-audio` é módulo nativo novo, então o cliente de desenvolvimento precisa ser recompilado.
- **Aprovação dos modelos**: `L1_TEMPLATE_APPROVAL` segue `null`, porque é decisão do dono. A impressão digital atual é `429cca0d`, medida em `5f1a36d`.
- **Correção dos testes de conteúdo no Linux**: fora do escopo (ver Gate, item 4).
- **Merge**: não feito, como pedido.

## Riscos e dúvidas

Em ordem de prioridade para quem revisa:

1. **Escopo do Loop.** `radiant-app/src/features/dev-console/screens/DevConsoleScreen.flow.test.tsx` e `radiant-app/src/features/curriculum-v3/hybrid-l1/HybridLessonCharacter.tsx` **não estão** no `abrir.mjs` da seção "Execução no Loop". A Tarefa 7 manda editar o primeiro; o segundo vem do desvio 9. Declare os dois ao abrir o run local; sem isso, `step finish` devolve `OUT_OF_SCOPE_CHANGE`.
2. **O mapa desenhado e os números podem não coincidir na tela.** Medido por leitura de código, não em aparelho. O SVG usa `viewBox 0 0 240 330` com o `preserveAspectRatio` padrão, que escala por igual e centraliza. Os números dos landmarks usam porcentagem do canvas, que estica largura e altura de forma independente, e o canto superior esquerdo do alvo de 44 pt fica sobre o ponto. Numa largura de 390 pt, a mão desenhada fica perto de x = 259, e o número, perto de x = 299. O lado (esquerda ou direita do centro) continua coerente, que é o que as descrições dizem. Mas o número pode ficar fora do desenho da mão. É comportamento que já existia no `BodyReferenceMap` e foi preservado. Vale olhar no simulador antes do teste com pessoas.
3. **Descrições do tórax.** `LANDMARK_DESCRIPTIONS` traz "Painel com contorno contínuo." e "Painel com traço pontilhado.", como o plano manda. O conteúdo aprovado no parecer v4 diz "Painel 1 tem contorno contínuo." (com número). O comentário "Não altere sem nova revisão" sugere cópia literal, e não é: é uma adaptação. As demais 8 descrições e os 12 feedbacks batem letra por letra com `l1BodyReferenceContent.ts` (conferido com `grep -F`).
4. **Texto de acessibilidade do mapa na prévia da L1.** O novo `accessibilityHint` ("Seleciona esta opção para responder.") vale também para `BodyReferenceLessonPreview`, onde a confirmação continua num controle separado. O plano previu a troca, e nenhum teste fixava o texto antigo.
5. **Rótulo repetido nas opções de lateralidade do tipo escolha.** Em `h10`, o botão mostra "Mão 1" e, embaixo, "Mão 1: aparece na parte de cima do quadro."; o VoiceOver lê "Mão 1. Mão 1: aparece…". Não está errado, mas é redundante, e veio do plano.
6. **Testes de conteúdo no Linux** (Gate, item 4). Anteriores a este PR; qualquer agente em nuvem vai tropeçar neles. A decisão é do dono.
7. **Avisos `act(...)`** do `useReducedMotionPreference` aparecem nos testes do mapa. Já apareciam antes (11 ocorrências medidas sem o diff) e não reprovam nada.

## Amostra de revisão

Caminho:
`radiant-app/src/features/curriculum-v3/hybrid-l1/__snapshots__/l1TemplateApproval.test.ts.snap`,
com os 12 itens do plano e as 8 variantes de desafio, 20 no total.

Li os 20 e **nenhum ✓ estava errado**. Nenhuma correção de tabela ou de modelo foi necessária. A conferência:

- **Lateralidade**: calculei a região de cada mão pela rotação e pelo espelho do mapa, e o ✓ sempre cai na mão do lado pedido **da pessoa**. Posição anatômica de frente: a esquerda da pessoa aparece à direita de quem observa. Vista por trás: à esquerda. Decúbito dorsal: a mão direita fica em cima. Ventral por trás: a esquerda fica em cima.
- **Relações**: cada ✓ está no landmark que a tabela liga ao termo (cabeça, pés, linha mediana, ligação do braço com o tronco, camada interna, painel contínuo como anterior).
- **Verdadeiro ou falso**: medi qual landmark é o "marcador N" em cada item. `h09` e `h09-v`: marcador 1 é o contorno externo do braço, "mais afastado da linha mediana", logo verdadeiro. `h12`: marcador 2 é o punho, "mais longe da ligação", logo verdadeiro. `h12-v`: marcador 2 é a ligação do braço com o tronco, logo falso. Os quatro ✓ estão certos. A amostra agora mostra essa correspondência (desvio 4).

O que mudou na amostra foi a apresentação (a linha "No mapa"), não o gabarito.

---

## Revisão local — sessão no Mac, 2026-09-23

Feita pela sessão local que recebeu este relatório, sobre `50ac56e`, com o
checkout principal limpo e `npm ci` no Node `v20.20.2`.

**Conferido no código, não só no relatório:**
- `app.json` sem diferença contra a base;
- `L1_TEMPLATE_APPROVAL = null`;
- nenhum `prepareV3` e nenhum `registerProductAnalyticsAdapter` nos arquivos do PR;
- rota e cartão do Perfil atrás de `SHOW_DEV_TOOLS`;
- `expo-audio ~1.1.1` com mapeamento no Jest;
- a guarda de relação compara com uma cópia literal (`REVIEWED_KEY`), termo por termo.

**Mutações:** três delas reproduzidas no Mac, todas vermelhas pelo defeito
nomeado. Registro na seção "Revisão local" dos vermelhos.

**Lateralidade conferida pela anatomia, fora do código.** Com o produto
vetorial `esquerda = cabeça × frente` em cada postura e vista, o lado da mão
esquerda na tela bate com `landmarkScreenRegion` nos seis cenários.

**Defeito corrigido nesta revisão (herdado do plano):** a descrição acessível
aparecia no botão e entregava a resposta das escolhas de relação. Agora o botão
mostra só o rótulo, e a descrição fica no `accessibilityLabel`. A descrição da
lateralidade também perdeu o prefixo duplicado ("Mão 1: Mão 1: aparece…" virou
"Aparece…"). A amostra de revisão foi atualizada, e a impressão digital mudou
em relação à `429cca0d` citada acima.

**Gate no Mac depois da correção:** `EXPO_NO_DOTENV=1 npm run quality` com
exit 0; 147 suítes / 1345 testes (os 1344 da nuvem mais a guarda nova); lint
com 0 erros e 26 avisos; visual QA sem regressão.

**Testes de conteúdo:** 31/31 no Mac. Confirmado que o índice do git guarda
74 arquivos sob `conteúdo/` (minúscula), enquanto o código abre `Conteúdo/`.
Falha só em sistema de arquivos que diferencia caixa. É defeito anterior ao
PR, e nenhum workflow roda esses testes.

**Para o dono decidir na aprovação da amostra:**
1. As descrições do tórax ("Painel com contorno contínuo.") são adaptação do
   texto aprovado ("Painel 1 tem…"), porque a ordem das opções é sorteada.
2. Em decúbito, "vista por trás" de quem está em decúbito dorsal é a visão por
   baixo da mesa. A geometria é coerente, mas o cenário é incomum. Fica,
   corta-se, ou vira "vista posterior"?
3. Para leitor de tela, as descrições aprovadas no v4 continuam entregando
   parte da resposta nas relações ("junto à extremidade da cabeça"). Isso foi
   aceito pelo auditor como equivalência; a visão já não é afetada.

