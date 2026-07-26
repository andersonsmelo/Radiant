# Follow-up de device E2E — 2026-07-26

**Data da coleta:** 2026-07-26
**Escopo:** re-execução iOS após destravar o ambiente, com investigação de
causa-raiz e correção do bloqueio registrado em `app-failed` no baseline de
2026-07-23.
**Classificação:** iOS recebe `passed` — os três flows concluíram no mesmo
device/runtime, na mesma execução de suíte (`3/3 Flows Passed in 8m 44s`).
Android permanece `environment-blocked`: nenhum build local foi gerado ou
instalado neste ciclo, portanto nenhuma linha abaixo declara Android aprovado.

## Ambiente (pré-condição resolvida)

- Java para o Maestro: instalado **Temurin 17.0.19+10** em
  `~/.jdks` (tarball, sem `sudo`, sem tocar em pacotes de sistema);
  `JAVA_HOME` exportado no shell. `maestro --version` passou a responder
  `2.7.0`.
- Build local **Release** equivalente ao perfil `e2e-test` gerado via
  `xcodebuild -workspace Radiant.xcworkspace -scheme Radiant -configuration
  Release -sdk iphonesimulator` (Pods já presentes; sem CocoaPods CLI, sem EAS
  cloud, sem submissão) e instalado no simulador via `simctl install`.
- Destino: `Radiant iPhone 17 Pro - iOS 26.5`, boot confirmado por `simctl`.

## Execução e causa-raiz

### `onboarding-to-home.yaml` — concluído no iOS

Todos os passos terminaram no device (deep-link de onboarding, seleção de
preferências, chegada ao home `Foco de hoje`).

### `learning-critical-path.yaml` — bloqueio `Fixe este ponto` resolvido; flow não concluído

O bloqueio registrado em 2026-07-23 (`Fixe este ponto` não encontrado após a
primeira resposta) foi investigado e teve **duas causas-raiz confirmadas por
evidência**:

1. **Defeito de layout do app (comportamento observável, corrigido).** As
   opções de resposta inferiores eram renderizadas **abaixo do fim da área de
   rolagem, sob o rodapé fixo**. Geometria medida no hierarchy (tela 402×874pt):
   viewport de rolagem até y≈756; rodapé/botão fixo em y≈756–840; opção 1 em
   y≈785–841 e opção 2 em y≈853–909. O toque na opção 1/2 caía sobre o botão
   desabilitado; `onPress` não disparava; a seleção nunca registrava e o
   `Continuar` permanecia desabilitado. Provas: tocar a opção 0 (acima do
   rodapé) registrava `selected: true`; `scrollUntilVisible` antes do toque
   também. **Correção:** reduzir a dominância do painel visual
   (`LessonVisualPanel`, imagem 280→180pt) para subir as opções.
2. **Asserção incompatível com a UI (corrigida no flow).** O passo de reforço
   (`ReinforceStepRenderer`) exibe o feedback da resposta —
   `Resposta correta` / `Vamos reforçar` — e não o título autoral
   `Fixe este ponto`, que só aparece quando não houve resposta anterior. A
   asserção do flow buscava um texto inexistente no caminho respondido.
   **Correção:** asseverar `Concluir e voltar` (ação real do último passo) e
   centralizar as opções com `scrollUntilVisible` antes do toque.

Após correção e rebuild, o segmento da **lição 1** concluiu no device
(scroll → seleção da opção → `Continuar` → `Concluir e voltar` → `Foco de
hoje`). O flow então parou em `tapOn "Abrir checkpoint"`.

### Reconciliação a jusante do home — três causas distintas, todas com evidência

A hipótese inicial (rótulo `Abrir checkpoint` inexistente na UI) estava
**errada**. O hierarchy capturado no passo que falhou mostra o elemento em
`[16,681][386,737]`, `enabled=true`. O bloqueio tinha três causas independentes:

1. **Defeito de app (corrigido).** A tab bar é `position: 'absolute'`
   (`height: 72`, `bottom: 14` ≈ 86pt de cromo flutuante), logo não insere
   deslocamento no conteúdo rolável. `JourneyHomeScreen` reservava
   `paddingBottom: space.s5` = **24pt**, então o CTA primário do home ficava
   permanentemente cortado sob a tab bar — para usuários reais, não só para o
   teste. Mesma classe do defeito das opções de resposta. **Correção:**
   constante compartilhada `tabBarClearance` (`ui/styles.ts`) = altura + offset
   + `s3`, aplicada ao `contentContainerStyle` do home.
2. **Seletor incompatível com a árvore de acessibilidade (corrigido no flow).**
   `AppButton` define `accessibilityRole="button"` + `accessibilityLabel` no
   `Pressable`; o iOS colapsa a subárvore, então o nó expõe `accessibilityText`
   e **nenhum** atributo `text`. `scrollUntilVisible` casa `element.text` e
   nunca resolve contra esses nós; `visible`/`tapOn` casam `accessibilityText`.
   Provado por flow-probe: `scroll` repetido + `tapOn` conclui onde
   `scrollUntilVisible` falha. **Correção:** `repeat` guardado por
   `while: notVisible` antes de cada ação de rodapé.
3. **Cobertura autoral contra um track que o app não usa (escopo reduzido).** O
   trecho final assumia `defaultTrack.ts` (2 lições, reward após a lição 2). O
   track ativo é gerado do catálogo por `JourneyDefinitionService` (7 lições) e
   destrava o reward só após a **última** lição; no ponto do flow a conquista
   aparece como `Conquista da unidade` e **`Bloqueado`**. O flow foi encerrado
   em `Progresso` e renomeado para
   `Local-first learning path through checkpoint and progress`.
   **Lacuna declarada: o nó de reward não tem cobertura E2E.**

Também corrigido: `tapOn: Progresso` não casava porque a tab expõe o rótulo
VoiceOver completo (`Progresso, tab, 3 of 4`) e o Maestro casa a string inteira
— ancorado com regex.

### `offline-relaunch.yaml` — concluído no iOS

Duas correções antes da primeira execução bem-sucedida: o toque na opção não
rolava (mesmo defeito da lição 1) e `setAirplaneMode: true` **não faz parse** no
Maestro 2.7.0 — o comando aceita `enabled`/`disabled`. Confirmado por probe
isolado no simulador. Com isso o flow prova a persistência local: lição
concluída → modo avião → `killApp` → relaunch → progresso restaurado com o
próximo passo em `Abrir checkpoint`.

### Android — não executado

O emulador `Radiant_Pixel_9_API_36` está disponível, mas nenhum build local
`e2e-test` foi gerado/instalado neste ciclo.

## Matriz de execução por plataforma — 2026-07-26

| Plataforma | Device/runtime | Build | Onboarding | Critical path | Offline relaunch | Estado | Dono/data | Próxima ação |
|---|---|---|---|---|---|---|---|---|
| iOS | Radiant iPhone 17 Pro / iOS 26.5 | Release local `e2e-test` equivalente, instalado | passed | passed (sem cobertura do nó de reward) | passed | passed — `3/3 Flows Passed in 8m 44s` na mesma execução de suíte | engenharia / 2026-07-26 | cobrir o nó de reward em flow próprio; validação manual de acessibilidade |
| Android | Radiant Pixel 9 / Google APIs API 36 ARM64 | não instalado | não executado | não executado | não executado | environment-blocked | engenharia / 2026-07-26 | gerar e instalar build local `e2e-test` e executar os três flows |

## Alterações de código associadas

- `radiant-app/src/features/lesson-flow/components/LessonVisualPanel.tsx`:
  altura da imagem/painel 280→180pt (opções deixam de ficar sob o rodapé).
- `radiant-app/src/ui/styles.ts`: nova constante `tabBarClearance` (altura da
  tab bar + offset + `s3`), com o motivo documentado no próprio arquivo.
- `radiant-app/src/features/journey/screens/JourneyHomeScreen.tsx`:
  `paddingBottom` do conteúdo passa de `space.s5` (24pt) para `tabBarClearance`.
- `radiant-app/.maestro/learning-critical-path.yaml`: `scrollUntilVisible`
  centralizado antes de cada toque de opção; asserções do reforço passam de
  `Fixe este ponto` para `Concluir e voltar`; `repeat` guardado antes de cada
  ação de rodapé; encerramento em `Progresso`; flow renomeado.
- `radiant-app/.maestro/offline-relaunch.yaml`: scroll antes do toque na opção;
  `setAirplaneMode` com `enabled`/`disabled`; scroll antes da asserção do CTA.
- `radiant-app/scripts/maestro-contract.test.mjs`: o contrato deixa de exigir
  `Receber conquista` e a sintaxe booleana de `setAirplaneMode` (ambas
  descreviam um flow que não executa) e passa a exigir o encerramento em
  `Progresso` e o scroll guardado antes de cada ação de rodapé.
- Gates locais e Loop validator verdes após as mudanças; Visual QA sem
  regressões.

## Dívida conhecida observada nesta coleta

- **Sem cobertura E2E do nó de reward.** Requer um flow dedicado que alcance a
  última lição do track do catálogo ou que semeie o estado.
- **`JourneyMap` renderiza em tema claro dentro da tela escura**, com cartões
  estreitos que quebram os rótulos caractere a caractere (`Funda mentos de
  Radiolo gia`). Visível nos screenshots desta coleta; não corrigido aqui.
- **`ProgressScreen` usa `paddingBottom: 24`**, o mesmo valor insuficiente que
  causou o defeito do home. Não reproduzido nem corrigido neste ciclo.

## Privacidade

Nenhum UUID de conta, token, resposta de usuário ou conteúdo clínico foi
incluído. Screenshots e artefatos do Maestro permanecem fora do Git.
