# Radiant — trilha ampla e engajamento: plano de execução

> **Para quem executa:** este plano é dirigido por subagentes, com o Claude como
> controlador e dono dos runs do Loop. Cada frente abaixo é um brief. O subagente
> não abre nem fecha run, não comita e só cria os arquivos listados na frente dele.
> Os passos usam caixas (`- [ ]`) para acompanhamento.

**Objetivo:** até o fim de 2026-11-06, a branch `claude/conteudo-reinicio-tecnologo`
ter uma trilha jogável de ponta a ponta, com as 14 unidades do núcleo e os 6
aprofundamentos escritos, aulas com cinco interações, diálogo com personagens,
retorno animado com som e uma camada de metas, com os gates verdes e uma PR aberta
para a `main`.

**Arquitetura:** a aula é escrita como dado, num formato único (aula-fonte, JSON),
uma unidade por arquivo. Um gerador confere a forma e emite os lotes de produção em
TypeScript, que a trilha já lê sem chave a ligar. O tocador de aula ganha cena de
diálogo e retorno animado; as regras de XP, vidas e revisão continuam nos serviços
que já existem.

**Stack:** Expo 54, React Native 0.81, Reanimated 4, Skia 2.2, `react-native-svg`,
`expo-audio`, `expo-haptics`. Nenhuma dependência nativa nova: o cliente de
desenvolvimento instalado no simulador `E262D4C1` continua servindo.

**Especificação:** [ADR da delegação](../adr/ADR-2026-11-05-delegacao-de-decisao-e-producao-ampla.md),
[mapa curricular](2026-11-02-planejamento-conteudo-radiant.md) (seções 5 a 10) e
[guia de autoria](../content/2026-11-05-guia-de-autoria-rtg-2026.md).

## Restrições globais

- Testes e builds do app no Node 20; `loop` no Node 24. Confira `node --version`.
- O gate é `cd radiant-app && EXPO_NO_DOTENV=1 npm run quality`, mais `loop validate`.
- Sem dependência nativa nova, sem mudança em `app.json`, sem build, sem envio.
- `conteúdo/governança/curriculum-state.json` continua `retired`.
- Nada importa de `src/features/editorial-preview/dev/` nem do JSON de revisão.
- Chave nova do AsyncStorage entra no inventário do G7 no mesmo commit.
- Texto para o aluno: sem travessão com espaços, sem caixa alta de ênfase.
- Toda animação respeita `useReducedMotionPreference`; som e vibração passam por
  `lessonFeedback` e pelos interruptores de `feedbackPreferences`.
- Toda asserção nova é vista falhando com o defeito que nomeia, e a execução
  vermelha fica na evidência.
- O simulador `5FD8C926-BC5A-4E9E-B5BE-2E080B2ED2A3` não se toca.

## Foco de revisão

O que nenhum teste de frente cobre sozinho e mais pode morder o aluno:

1. **Aluno que atualiza com progresso antigo** abre a trilha nova: precisa ver o
   aviso de conteúdo atualizado e a trilha nova, sem tela vazia. Teste na frente B.
2. **Aula interrompida no meio das cinco interações** e retomada: volta ao passo
   certo, sem XP nem vida em dobro. Teste na frente C.
3. **Texto ampliado e leitor de tela na cena de diálogo:** as falas são lidas em
   ordem, com o nome de quem fala, e o botão de avançar continua alcançável. Teste
   na frente C.
4. **Unidade com resposta correta sempre na mesma posição** depois de editada à
   mão: o gerador reprova. Teste na frente A.
5. **Som ligado com o aparelho no silencioso e "Reduzir movimento" ligado:** a aula
   continua inteligível só com texto. Teste na frente C.

---

## Interfaces fixadas (valem para todas as frentes)

**I1. Aula-fonte.** `content-manifest/rtg-2026/aulas/<unidade>.json`, com
`<unidade>` em `m01`…`m14`, `s-tc`, `s-rm`, `s-md`, `s-mn`, `s-rt`, `s-ir`. Campos e
regras no guia de autoria. O verificador exporta `lintUnit(doc): string[]`.

**I2. Tipos de runtime** (`radiant-app/src/types/learningActivity.ts`, só a frente A
edita):

```ts
export type LessonCastId = 'pixel' | 'lia' | 'caio' | 'duda' | 'paciente';
export interface LessonDialogueLine { speaker: LessonCastId; name?: string; text: string }
export interface LessonDialogue { setting?: string; lines: LessonDialogueLine[] }
// payload de apresentação ganha:  dialogue?: LessonDialogue;  keyPoints?: string[]
// interação ganha:                help?: string
// MAX_STEPS passa de 6 para 12
```

**I3. Contrato amplo.** `EditorialBatchContract` aceita a extensão `wide`, ao lado
de `pilot`. Com `wide`: de 3 a 8 interações por atividade; famílias
`multiple-choice`, `case-decision`, `ordering`, `matching`; fonte com
`use: 'cc-by-4.0' | 'factual-reference'`. Continuam valendo identidade única,
proveniência por afirmação, dois itens de conferência por competência,
`checkpoint-constant-answer` e viés de posição. Sem `wide`, nada muda.

**I4. Lotes gerados.** Um lote por unidade em
`radiant-app/src/features/student-checkpoints/batches/rtg-2026-<unidade>.ts`, com
`batchId` `batch:rtg-2026:<unidade>`, um `trackId` por unidade, uma competência e
uma atividade por aula. `batches/index.ts` exporta a lista na ordem da trilha e
`batches/entries.ts` exporta os textos de apresentação. As aprovações usam
`reviewerRole: 'ai-review-delegated'` e citam a ADR.

**I5. Elenco.** `radiant-app/src/ui/characters/cast/castRegistry.ts` exporta
`CAST: Record<LessonCastId, { displayName: string; role: string }>`;
`CastAvatar.tsx` desenha `lia`, `caio`, `duda` e `paciente` em SVG e delega `pixel`
ao `PixelIllustration`.

**I6. Sons.** `assets/sounds/` ganha `combo.m4a`, `nivel.m4a` e `unidade.m4a`,
sintetizados localmente com `ffmpeg` por `radiant-app/scripts/synth-sounds.mjs`
(autorais, sem download), com durações distintas entre si e das seis existentes.
`lessonFeedback` ganha os eventos `combo`, `level_up` e `unit_complete`.

---

## Frente A — contrato amplo, gerador e trilha

**Arquivos**
- Criar: `scripts/content/rtg-lesson-lint.mjs`, `scripts/content/rtg-lesson-lint.test.mjs`,
  `scripts/content/build-rtg-batches.mjs`, `scripts/content/build-rtg-batches.test.mjs`,
  `radiant-app/src/features/student-checkpoints/EditorialWideContract.ts` e `.test.ts`,
  `radiant-app/src/features/student-checkpoints/batches/index.ts`, `batches/entries.ts`,
  `batches/rtg-2026-<unidade>.ts` (20), `content-manifest/rtg-2026/aulas/<unidade>.json` (20).
- Modificar: `radiant-app/src/types/learningActivity.ts`,
  `EditorialBatchContract.ts`, `EditorialCurriculumCandidate.ts`, `ProductionBatch.ts`,
  `ProductionCurriculumCoverage.ts`, `createProductionCurriculumCatalog.ts`,
  `ProductionCurriculumCatalog.ts`, `production-batches.ts`,
  `production-catalog-entries.ts`, os testes de vazio
  (`ContentRetirement.test.ts`, `JourneyCatalogReachability.test.ts`,
  `TrailCoverage.test.ts`), `scripts/content/check-pilot-payloads.mjs`,
  `scripts/content/audit-production-batches.mjs`, `scripts/qa/trilha-structural-inventory.cjs`,
  `radiant-app/scripts/copy-style-contract.mjs`, `.github/workflows/content-scripts.yml`.

**Produz:** I1 a I4. `node scripts/content/build-rtg-batches.mjs` gera os lotes;
`--check` falha se o gerado estiver defasado em relação às aulas-fonte.

- [x] Verificador: portar o `lint.mjs` de autoria para `rtg-lesson-lint.mjs`, com
      teste que reprova cada defeito nomeado (correta mais longa, posição acima de
      40%, retorno repetido, resposta constante, fonte ausente, travessão).
- [x] Contrato `wide` com testes vermelhos primeiro: aceita 5 interações de 3
      famílias; recusa 9 interações, `hotspot` sem ativo e fonte sem `use`.
- [x] Tipos de I2 e `MAX_STEPS = 12`, com o validador de atividade cobrindo `dialogue`.
- [x] Gerador: aula-fonte → candidato → lote promovido, com identidades
      `<tipo>:rtg-2026:<unidade>:<nome>`, proveniência derivada de `sourceIds` e
      aprovações de I4. Os itens de `recovery` chegam ao aluno depois de uma
      conferência reprovada; se o runtime só repete a atividade, entram como itens
      extras da revisão.
- [x] Trilha: as 20 unidades na ordem do mapa, núcleo antes dos ramos; os testes de
      vazio passam a afirmar as contagens reais; a cobertura estrutural entende as
      quatro famílias.
- [x] Conferência: `npx jest src/features/student-checkpoints src/features/journey
      src/features/content`, `node --test scripts/content/*.test.mjs`,
      `node scripts/content/build-rtg-batches.mjs --check`.

## Frente B — conteúdo das 20 unidades

**Artefatos:** `content-manifest/rtg-2026/aulas/<unidade>.json` (20) e um parecer
por unidade em `docs/evidence/2026-11-06-rtg-2026-revisao/<unidade>.md`.

- [x] Autoria: um agente por unidade escreve as aulas pelo guia, confere cada fato
      em fonte gratuita na web e passa no verificador. Ondas: M01–M07, M08–M14, ramos.
- [x] Revisão independente: outro agente, sem a conversa do autor, confere fatos nas
      fontes citadas, limites profissionais, pistas involuntárias e tom, e registra
      o parecer com cada achado e a correção aplicada.
- [x] Teste do aluno antigo (foco 1): com progresso de aula retirada gravado, a
      trilha nova aparece e o aviso de conteúdo atualizado continua.
- [x] Completude: contar aulas, interações e itens por unidade por dois caminhos (o
      gerador e uma leitura direta dos JSON) e conferir que batem com o mapa:
      84 aulas no núcleo e 48 nos ramos.

## Frente C — experiência da aula

**Arquivos**
- Criar: `radiant-app/src/features/lesson-flow/components/DialogueScene.tsx` e
  `.test.tsx`, `AnswerFeedbackCard.tsx` e `.test.tsx`,
  `radiant-app/src/features/lesson-flow/services/lessonCombo.ts` e `.test.ts`,
  `radiant-app/src/ui/characters/cast/castRegistry.ts`, `CastAvatar.tsx`,
  `CastAvatar.test.tsx`, `radiant-app/scripts/synth-sounds.mjs`,
  `radiant-app/assets/sounds/{combo,nivel,unidade}.m4a`.
- Modificar: `LessonFlowScreen.tsx` e `LessonFlowScreen.flow.test.tsx`, os renderers
  de `lesson-flow/renderers/` que precisarem de `help`, `src/ui/feedback/lessonSounds.ts`,
  `lessonFeedback.ts`, `assets/sounds/README.md`, o resumo da aula
  (`LessonSummary`) e `src/ui/motion.ts`.

**Consome:** I2, I5, I6. **Produz:** `nextCombo(state, correct)` devolvendo
`{ count: number; milestone: 3 | 5 | 10 | null }`.

- [x] Cena de diálogo no passo de abertura e de fecho: avatar, nome, fala, toque
      para avançar, ordem e nome lidos pelo leitor de tela (foco 3).
- [x] Retorno da resposta: cartão que entra animado, Pixel reage ao acerto e ao
      erro com as poses e expressões existentes, tremor leve no erro, e a ajuda
      (`help`) fica disponível antes de responder.
- [x] Combo: 3, 5 e 10 acertos seguidos na aula mostram o selo e tocam `combo`;
      `streak` e `heart_lost` voltam a ser emitidos.
- [x] Fim da aula: confete e som `fim` no resumo com estrela; nada de celebração
      com zero acerto.
- [x] Retomada (foco 2) e modo sem som e sem movimento (foco 5), com teste de fluxo.
- [x] Sons: `synth-sounds.mjs` gera os três arquivos; conferir as durações com
      `afinfo` e registrar a licença autoral no README.

## Frente D — metas e progresso

**Arquivos**
- Criar: `radiant-app/src/features/gamification/services/levelFromXp.ts` e `.test.ts`,
  `radiant-app/src/features/gamification/services/StreakFreezeService.ts` e `.test.ts`,
  `radiant-app/src/features/missions/services/DailyMissionsService.ts` e `.test.ts`,
  `radiant-app/src/features/journey/components/UnitCompleteCelebration.tsx` e
  `.test.tsx`, `radiant-app/src/app/missions.tsx`.
- Modificar: `missions/screens/MissionsScreen.tsx`, o Perfil e a Estude onde as
  entradas aparecem, o inventário de chaves do G7 e `GamificationService.ts`.

**Produz:** `levelFromXp(xp)` devolvendo
`{ level: number; title: string; xpIntoLevel: number; xpForNext: number }`.

- [x] Níveis por XP com título, mostrados no Perfil e no HUD, com som `nivel` ao subir.
- [x] Missões do dia (3 por dia, com dados que já existem: aulas, acertos seguidos,
      revisão) com rota própria e entrada na Estude.
- [x] Proteção de sequência: um dia perdido é coberto por uma proteção ganha a cada
      7 dias de sequência; sem compra.
- [x] Celebração de unidade concluída na trilha, com som `unidade`.

## Frente E — verificação, documentação e entrega

- [x] `EXPO_NO_DOTENV=1 npm run quality` no Node 20 e `loop validate`, com a máquina
      abaixo de carga 5.
- [x] Simulador `E262D4C1`: Metro com `EXPO_NO_TYPESCRIPT_SETUP=1`, fora de run
      aberto; jogar uma aula inteira de M01, errar de propósito, concluir, ver o
      resumo e a trilha; capturas em `docs/evidence/`. Som conferido pelo log.
- [x] `docs/STATUS.md`, `docs/FILA.md`, mapa curricular e evidências atualizados; o
      que não foi verificado fica escrito como não verificado.
- [ ] PR da branch para a `main`. Merge, build e loja são do dono.

## Progresso em 2026-11-06, às 09:13

- **Frentes A, C e D:** entregues, com as evidências em `docs/evidence/2026-11-06-trilha-ampla-*.md`.
- **Frente B:** as 14 unidades do núcleo (84 aulas) estão escritas, revistas e na
  trilha. Os seis aprofundamentos (48 aulas) não foram começados. A caixa de
  completude segue aberta por isso. O teste do aluno antigo está em
  `batches/RtgCatalog.test.ts`.
- **Frente E:** o gate e o `loop validate` passaram; a prova no simulador cobriu só o
  começo de uma aula; a PR não foi aberta.
- **Diferenças em relação ao que este plano previa:** os itens de conferência não
  levam o retorno por alternativa; a recuperação chega pela fila de revisão, sem a
  frase-gancho; a retomada volta à primeira interação, pela regra de privacidade que
  já existia; `IosHomologationService` não apaga as três chaves novas das metas.

**Em 2026-11-07:** os seis aprofundamentos (`s-tc`, `s-rm`, `s-md`, `s-mn`, `s-rt` e `s-ir`) entraram, com parecer "aprovado com correções". A contagem por dois caminhos bate: 132 aulas, 660 interações e 264 itens. A prova no simulador cobriu só a unidade M01, com oito achados não corrigidos, e o piloto de imagens ficou em duas radiografias, abaixo da meta de 6 a 10.

Quem continua segue o
[prompt de continuidade](../superpowers/handoffs/2026-11-06-trilha-ampla-prompt-de-continuidade.md).

## Ordem e paralelismo

1. Run 1 (documentos): ADR, este plano e o guia. Em paralelo, autoria da onda 1.
2. Run 2 (motor): frentes A, C e D por três agentes em arquivos disjuntos, com o
   escopo declarado pela união das listas acima. Em paralelo, autoria das ondas 2 e 3
   e revisão da onda 1, fora do repositório.
3. Run 3 (conteúdo): entram as aulas-fonte, os lotes gerados e os pareceres.
4. Run 4 (acabamento): o que a verificação no simulador achar, documentação e PR.

## Fora desta etapa, de propósito

- Imagem radiográfica real e as famílias `hotspot`, `comparison` e `bench` na trilha
  ampla. **Em 2026-11-06 o dono autorizou baixar radiografias CC0 ou CC BY de acervos
  abertos**; o procedimento está no prompt de continuidade e nada foi baixado ainda. O app não deve prometer "casos com imagem" em texto de loja ou de assinatura.
- Ligas, ranking e voz sintetizada: pedem servidor ou dependência nativa.
- Nivelamento na entrada dos ramos: os ramos abrem em sequência depois de M14.
- Android, VoiceOver e TalkBack audíveis, aparelho físico, build e envio.
