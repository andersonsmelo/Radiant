# Task 5 / T04 — revisão independente R1

Data: 2026-10-26. Revisor R, somente leitura de produto. Nenhum brain, writer, subagente, teste, build, instalação, commit ou push executado por esta revisão. Única escrita: este relatório SDD.

## Vereditos

- **Spec: PASS** para a implementação e evidência automatizada do snapshot R1, com os itens nativos abaixo explicitamente pendentes.
- **Qualidade: APPROVED**, condicionada à prova **NATIVE** do controlador e ao **gate Loop 15/15** sobre o conjunto final. Este parecer não aprova rasterização por Jest, não encerra a T04 e não consome G1–G8, G2 ou T14.
- **Achados P1/P2: nenhum.** Não há correção de código requerida por esta revisão.

## Objeto e integridade

Workspace: `/Users/anderson/Developer/Radiant/.claude/worktrees/trilha-2026-10-20`.
BASE_TASK e HEAD medido: `804d1e701f818bc793718b481a490ab377dda850`.
Objeto revisado: `task-5-snapshot-r1/requirements.md`, `diff.patch`, `manifest.json` e arquivos congelados em `files/`. Verificação independente de SHA256: **24/24 entradas do manifest conferem**, sem ausentes ou divergências.

O diff foi lido uma vez; o trecho de produto cuja saída inicial foi truncada foi recuperado separadamente. Consultas focais adicionais verificaram riscos concretos nos chamadores: pureza das definições de tema, fluxo de confirmação/anúncio, identidade das visitas no hook e conclusão real sem nó. Não houve revisão ampla do branch nem reabertura de T00–T03.

Escopo de produto: 19 caminhos nominais, 13 alterados. O diff não modifica `feedbackFor.ts/test`, `CollimationImage.tsx/test`, `lessonFlow.ts`, modelos físicos, serviços de economia, `BenchControlRow`, políticas de copy/visual ou YAMLs. Os documentos do controlador continuam classificando a entrega como em andamento e os gates como pendentes.

## Confronto com o aceite

| Requisito | Resultado e evidência inspecionada |
| --- | --- |
| Retorno visível e acessível dos seis tipos | `LessonFlowScreen.tsx:703` passa a mostrar o mesmo `player.lastFeedback.message` para qualquer interação. O hook conserva `feedbackFor` e o handler usa o mesmo serviço no anúncio. Os casos parametrizados de `LessonFlowScreen.flow.test.tsx:2124` exercitam seleção real de multiple-choice, comparison, hotspot, matching, ordering e bench, em acerto e erro; verificam heading, mensagem visível, anúncio único e ausência de liveRegion. Não se limitam a verificar o registro. |
| Canal único | Retirada de `accessibilityLiveRegion` no painel, preservando o anúncio explícito do handler (`LessonFlowScreen.tsx:376`). O teste conta a mensagem anunciada e verifica ausência do segundo canal. A mutação que esconde só o retorno correto mata seis casos separados. |
| Case-decision | Permanece no contrato, sem novo renderer. O teste do registro exige `false`; seis tipos efetivos permanecem registrados. O requisito de retorno equivalente deve acompanhar uma habilitação futura. |
| Abertura e tema | `LessonFlowScreen.tsx:164` lê `listTracks/getTrackDefinition` e `resolveNodeTheme`; a inspeção focal confirma leitura síncrona do manifesto/definições, sem bootstrap, snapshot ou ensureProgress nesse cálculo. Testes verificam precedência nó → unidade e tema explícito sem nó. Exemplos usam `tubo`/`protecao`; o resolver existente fornece fallback `radiacao`. `JourneyMedal` é reutilizada no hook de abertura, preservando texto. |
| Pixel e conteúdo essencial | `BenchStepRenderer.tsx:140` mostra `feedback.correct` autoral ao atingir o alvo no explorar. Texto e prompt são elementos independentes; Pixel fica decorativo e oculto da árvore acessível. O teste usa o componente real com preferência de movimento resolvida e verifica presença do prompt antes/depois e da explicação ao alvo. Não há nova frase física nesse caminho. |
| CTA espera/aptidão | A semântica anterior de espera do alvo continua. Novo hint explica a espera; o Set em `LessonFlowScreen.tsx:295` usa índice e id da interação. A inspeção do hook confirma avanço monotônico e retries com índices próprios, evitando confundir uma nova visita com rerender/bounce. Testes de explore/correct aguardam `esperarBotaoApto`, oscilam o valor e refazem foco sem repetir anúncio. |
| Imagem crítica | Campo opcional separado de `MultipleChoicePayload` legado; registry o encaminha ao renderer. `ExposureImage` existente é carregada apenas quando o campo está presente. Exposição usa 70 kV/2 mAs, rótulo neutro `Fantoma simulado`; prompt, alternativas, gabarito e ordem/IDs permanecem. O teste mede os uniformes reais entregues ao Shader: ruído maior com mAs baixo e tons iguais. A mutação 2 → 10 mAs falha no catálogo. Isso prova entrada/modelo, não pixels. |
| Validação opcional | `learningActivity.ts:420` valida label preenchido, input finito e faixas inclusivas 40–120 kV/1–40 mAs; short-circuit evita acesso ao input inválido. Enum de theme vem de módulo puro, sem Skia. Testes incluem shape inválida, NaN/infinito, tipo incorreto, fora da faixa, limites aceitos e legado sem os campos. |
| Fonte e dose-área | Removido o teto do heading do retorno, sem novo teto/global hack. A mutação do teto 2 falha especificamente. T03 e CollimationReadout são preservados. **Legibilidade em 402 pt e fonte ampliada requer nativo**, inclusive quando o produto dose-área ocupa duas linhas. |
| Sem nó/sem XP | O teste de conclusão delega ao `LessonOutcomeService` real com snapshot vazio e I/O isolado, verifica `Sem XP nesta tentativa` e zero chamadas de gamificação/meta. Os testes existentes de ausência de writes de posição/retomada/conclusão/checkpoint permanecem. Não é prova de armazenamento no dispositivo. |
| Restrições de produto | O diff conserva primeira resposta/estrelas, física, economia e posição do fechamento. A adição documental à tabela G2 é somente o rótulo neutro, com coluna de aprovação vazia. T14 continua decisão do dono. |

## Evidência e limites

Evidência lida em `files/docs/evidence/2026-10-26-medalhao-t04/`:

- `red.txt:1291–1294`: 27 falhas específicas/5 suítes, 9 passes e 195 ignorados. As três injeções discriminantes aparecem após essa fase; restauração com SHA idêntico registrada nas linhas 1430, 2508 e 2592. Não tratei testes que já passavam na base como defeitos novos.
- `green.txt:139–142` e `297–300`: execuções intermediárias com duas falhas cada, preservadas. Não são a evidência final.
- `green.txt:608–612`: execução final **294/294, nove suítes, zero ignorados**, 56.583 s. O relatório identifica Node 20.20.2, EXPO_NO_DOTENV=1, taskpolicy -b e --runInBand/--no-cache. Não reproduzi as suítes, pois não surgiu hipótese concreta sem prova.
- `green.txt:614–625`: typecheck sem diagnóstico; lint zero erros e um warning de import `router` inalterado no teste da guarda. Não afirmo reprodução desse warning na BASE.
- Final do `green.txt`: **38/38 do contrato Maestro**. Isso é validação do contrato dos flows, não execução nativa de 38 cenários.
- Console de act e getCardState ausente nos dublês continua no log final. Não foi ocultado nem convertido em alegação de baseline reproduzida. Não invalida as asserções da alteração, mas limita o diagnóstico desses cenários no ambiente de teste.

## Condições antes do aceite final

O controlador deve fornecer evidência vinculada aos hashes finais para abertura temática, explorar antes/depois do alvo, imagem crítica com texto equivalente, CTA/retorno e colimação em 402 pt/fonte ampliada nos binários existentes. Deve registrar o limite de VoiceOver/TalkBack e comprovar nativamente a ausência de XP/progresso no deep link sem nó, sem apagar dados. Jest não resolve rasterização do grão, colisões reais ou anúncio audível.

Depois da prova nativa, executar o gate final configurado 15/15 e reconciliar a documentação canônica. Se o nativo exigir mudança de produto, este parecer deixa de cobrir o novo delta e requer revisão desse delta. G2/conteúdo e T14 permanecem pendentes do dono; nenhuma aprovação clínica, build, release, merge ou submissão é concedida aqui.

## Revisão do nativo após R1 — alterações exigidas

O revisor original confirmou P2 no indicador de passos em `ios-dose-text.png`: contagem cortada verticalmente com a maior categoria Dynamic Type em 402pt. Dose-área legível em duas linhas. O estilo da contagem já existia na BASE, portanto não se atribui a causa à remoção do teto de `feedbackTitle`. Correção mínima e nova captura requeridas antes do aceite final. Sem aprovação do nativo ou do Loop nesta fase.

## Segunda triagem nativa, 2026-10-27

O indicador corrigido ficou inteiro nos dois sistemas. Nova leitura do readout no iOS 402pt/AX5 revelou corte lateral do último “o” de “campo todo”, confirmado por revisor independente. A medição nova prevalece sobre a leitura inicial de duas linhas. `CollimationImage.tsx` ainda está idêntico à BASE: não se atribui a falha ao fix1. `ios-dose.png` preserva esta falha. Correção local de largura e nova captura exigidas.


# T04 / Task 5 — revisão independente R2

Data: 2026-10-27. Revisor de retomada, produto somente leitura. Workspace `/Users/anderson/Developer/Radiant/.claude/worktrees/trilha-2026-10-20`, branch `claude/trilha-medalhao-design`, BASE_TASK/HEAD `804d1e701f818bc793718b481a490ab377dda850`.

## Vereditos separados

- **Spec: PASS** para R2 e o delta focal desde R1. As pendências visuais concretas da contagem e do produto dose-área estão resolvidas na evidência inspecionada.
- **Qualidade: APPROVED**, condicionada ao **gate final configurado Loop 15/15 sobre o conjunto final** e à reconciliação documental já prevista pelo controlador. Não é declaração de run concluído, T04 encerrada ou release aprovado.
- **P1/P2 abertos: nenhum neste escopo.** Sem nova correção de produto requerida.

Este parecer preserva as conclusões técnicas R1 para os contratos sem delta. Não reinicia auditoria do branch, T00–T03, economia ou conteúdo clínico. Não consome G1–G8, G2 ou T14.

## Objeto e integridade reproduzida

Objeto: `task-5-snapshot-r2/{requirements.md,diff.patch,manifest.json,files/}`, delta `task-5-delta-r1-r2/{manifest.json,diff.patch}`, e parecer `task-5-review-r1.md`.

- SHA256 do manifesto R2: **`62b3955e9b30bf207d300812954f294ad554513c70439fe8eec3b89a23385201`**, igual ao informado pelo controlador.
- **43/43 entradas** conferem existência, tamanho e SHA256 nos arquivos congelados; nenhuma divergência ou ausência.
- **26/26 entradas do delta** conferem SHA anterior/posterior contra os dois snapshots. `requirements.md` é byte-idêntico ao R1.
- O delta de produto contém **exatamente quatro caminhos**: `LessonFlowScreen.tsx`, seu `flow.test.tsx`, `CollimationImage.tsx` e seu teste. Os dois Collimation não estavam copiados no R1 por serem inalterados; para obter o delta real, comparei-os com `git show BASE_TASK:<path>`, evitando interpretar o arquivo inteiro como nova implementação.
- Os 11 arquivos de produto/teste comuns aos manifests e sem delta continuam byte-idênticos ao R1. Os **19 `finalSourceHashes`** do pacote também conferem; arquivos nominais não copiados no snapshot foram conferidos no workspace, sem edição.
- **14/14 hashes de PNGs** em `versionedFrames` conferem com os arquivos congelados. Os **quatro suplementos locais** têm SHA256 igual ao vinculado em `native-state.json`.
- Os quatro JSONs AX locais referenciados em `nativeNoXpCaptures` foram encontrados em `task-5-native/`; **4/4 SHA256 conferem** e os marcadores de UI descritos estão presentes nos dados brutos.

O patch completo serve como envelope BASE→R2; a revisão de regressão foi orientada pelo delta R1→R2, reconstruído e lido para os quatro arquivos. Saídas iniciais volumosas foram truncadas; recuperei o delta de código integral e os trechos de evidência pertinentes com consultas focais, sem tratar truncamento como leitura completa.

## Delta de código e regressões

| Mudança | Conferência e conclusão |
| --- | --- |
| `LessonFlowScreen.tsx:800–804` | Somente `lineHeight: undefined` e `flexShrink: 0` no `stepCount`, após `typography.micro`. Preserva fonte, tamanho, cor, HUD, lógica e componentes. Não há cap, altura fixa ou truncamento. Corrige o determinante local da contagem cortada, separado do heading de retorno. |
| `LessonFlowScreen.flow.test.tsx:2205–2225` | Renderiza a tela real, encontra `Passo 1 de 3` e inspeciona o estilo efetivo entregue ao Text. Verifica métricas naturais, ausência de compressão e de limites que ocultariam o problema. Não é espelho de props nem alegação de rasterização por Jest. |
| `CollimationImage.tsx:59–60` | Readout ocupa a largura disponível e estica linhas; texto centralizado recebe `lineHeight: undefined` após `bodyStrong`. Família Sora-Bold e tamanho 16 permanecem. JSX, literal, fórmula/modelo e liveRegion permanecem iguais à BASE. Nenhuma alteração global, cap, limite de linhas, redução ou ajuste automático de fonte. |
| `CollimationImage.test.tsx:76–106` | Renderiza `CollimationReadout` real e consulta View/Text efetivos. Asserções cobrem as duas frases, largura/estiramento e ausência de entrelinha/limites de fonte, preservando os testes físicos/semânticos anteriores. O nome do teste de largura não prova Yoga no Jest; o relatório reconhece esse limite e as capturas fornecem a prova visual. |

As mudanças são de apresentação. Não introduzem novo estado, persistência, chamador de conclusão, resposta, ID, ordem, cursor ou cálculo físico. Os contratos de feedback/medalha/Pixel/imagem crítica avaliados no R1 permanecem sem novo delta. Nenhuma hipótese concreta restante justificou executar suítes no revisor.

## RED/GREEN inspecionados, sem rerun

Logs congelados em `files/docs/evidence/2026-10-26-medalhao-t04/`:

- **Fix1:** `red.txt:2708–2732` mostra falha específica `lineHeight` recebido **16**, 1 falha/84 ignorados, exit1. `green.txt:1021–1043` mostra a suíte inteira da tela **85/85**, 47.738s, lint/typecheck/diff-check exit0. Hashes de fonte/teste do log conferem com o congelado (`7fa4ea...`/`85f3d4...`).
- **Fix2:** `red.txt:2735–2820` registra 3 falhas de largura/alinhamento; `green.txt:1046–1079`, **34/34 em duas suítes**. Esse verde **não resolveu o nativo**, como documentado nas triagens anteriores. Não foi usado como aceite visual.
- **Fix3:** `red.txt:2823–2880` mostra as duas linhas reais falhando com `lineHeight` recebido **24**; 2 falhas/10 passes. `green.txt:1082–1115` vincula os hashes finais **`651036a2f870dbacf069308602e233885d0c6a32f88a66817e5c5c8df36b3d73`** e **`6931f95ddf2976b0d2d79d5b383e7b7656eabe6ed91395ad803a206352e4e7d5`**, com **34/34 em duas suítes**, 34.552s, lint/typecheck/diff-check exit0.
- Os comandos focais registram cwd `radiant-app`, Node **20.20.2**, `EXPO_NO_DOTENV=1`, `--runInBand --no-cache` sob `taskpolicy -b`/`caffeinate`.
- A evidência R1 **294/294 em nove suítes** continua sendo a execução R1, não uma suíte integral executada sobre R2. Os logs de act/dublês da tela permanecem visíveis; não foram convertidos em baseline reproduzida nem ocultados.

As falhas registradas discriminam os determinantes corrigidos. As guardas não demonstram glifos; a suficiência visual vem da prova abaixo.

## Prova nativa e proveniência

Inspecionei as capturas das duas plataformas para abertura, explorar, imagem crítica, feedback, dose e saída; a captura `ios-dose.png` já havia sido inspecionada nesta revisão de retomada e seu hash preservado é o mesmo da triagem. Também inspecionei os quatro suplementos finais vinculados por hash. Não lancei ou controlei dispositivos.

| Pendência R1/triagens | Resultado observado e limite |
| --- | --- |
| Contagem ampliada | `ios-dose-text.png` final mostra **`Passo 2 de 5` inteiro** em iOS 402pt/AX5. Não confundir o recorte da borda superior do conteúdo rolado com o antigo corte da contagem fixa. |
| Produto dose-área | `ios-dose-text.png`, SHA **`d893ff0b3d8a60e142fe722ff1d39b721331f00118e436b5b3e4afea424c0177`**, mostra **“Produto / dose-área: / 100% do / campo / todo”**, com cada palavra e o último “o” inteiros. P2 das triagens R2/R3 **resolvido**. Cinco linhas são aceitáveis na fonte máxima: o requisito permite duas linhas legíveis e não estabelece duas como máximo. |
| Android fonte2 | `android-dose-text.png`, SHA **`629c136c40d625aafe9e26b21e084a5ba66d2f6383d6b0470beac9c4575653bb`**, mostra a frase completa em duas linhas, sem colisão. |
| Escala padrão | Suplemento `task-5-ios-dose-normal-final.png` mostra a frase inteira em duas linhas, sem corte ou redução de fonte. |
| Retorno ampliado | Os três suplementos `task-5-ios-feedback-max{,-body,-end}.png` mostram heading, corpo e fim da explicação legíveis ao longo da rolagem, com `Continuar` disponível. Quebra dentro de palavra no heading gigante não perde caracteres e não há exigência de manter a palavra inteira numa única linha. O controlador registra aptidão ao alvo16; screenshot de CTA habilitado/feedback não prova anúncio audível. |
| Medalha/Pixel/imagem crítica | Capturas R1 das duas plataformas mostram medalha do tubo na abertura, Pixel com explicação textual independente ao alvo100, retorno visível e fantoma com grão no passo crítico junto ao enunciado equivalente. Os caminhos funcionais correspondentes não mudaram no delta; uniformes/física continuam sob a evidência automatizada R1. Não é aprovação clínica do conteúdo. |
| Conclusão sem nó | `ios-exit.png` mostra **4 de 4 corretas** e **Sem XP nesta tentativa**. AX seq1 e seq36 conservam `screenHash: 0g3a0e1`, 18XP, 1dia, 1de8, 5vidas e o próximo nó disponível; seq34/35 registram o resultado completo e CTA. Isso prova o estado visível antes/depois no cenário iOS. Ausência de chamadas proibidas é evidência Jest separada; não foi inspecionado armazenamento nativo. Android continua apenas parcial nesse cenário. |

`native-state.json` agora separa explicitamente **R1**, **fix1** e **fix3**. A divergência de rótulo apontada na triagem R3 está reconciliada. `ios-dose.png` é a falha deliberadamente preservada antes do fix2, com header já corrigido; não é captura final aceita. `ios-exit.png` e as provas R1 conservadas também **não são novas medições dos bytes fix3**. O delta posterior restringe-se ao readout de colimação e sua guarda; não altera o fluxo de exposição usado na conclusão sem nó.

Não concluo, a partir do sucesso do fix3, uma causa interna específica de Sora/React Native. A sequência preserva que largura isolada foi insuficiente e que as métricas naturais locais acompanharam uma captura posterior legível.

## Condição para fechamento e limites que continuam

O controlador pode prosseguir para **uma validação final configurada, exigindo 15/15**, sobre o conjunto final e a reconciliação de STATUS/roadmap/evidência/G2/integrador já prevista. O presente parecer não afirma que essa validação rodou. Se houver nova mudança de produto, o novo delta sai da cobertura deste R2; reconciliação apenas documental e registro do gate não exigem reabrir esta auditoria de produto.

A prova é de simuladores/dev clients existentes. VoiceOver/TalkBack audível, aparelho físico, armazenamento nativo direto, FPS, segundo dia e G1–G8 não foram aprovados aqui. G2/conteúdo e T14 continuam decisões do dono. Nenhum build, install, push, merge, publicação ou submissão é autorizado por este parecer.

Única escrita do revisor neste passo: `task-5-review-r2.md`. Nenhum processo persistente aberto, suíte executada, brain/writer/Loop iniciado ou produto alterado. O estado final de apps/fontes/dispositivos em `native-state.json` é registro do controlador, não nova medição do revisor.


# T04 / Task 5 — revisão independente R3, fix4 R5

Data: 2026-10-27. Escopo restrito ao classificador R5 e seus testes, preflight autorizado e evidências do delta R2→R3. Produto R2/nativo não reabertos. Única escrita: este relatório local. Sem Loop/brain, build/install, commit/push, agente ou suíte executada. Uma reprodução focal nova rodou somente strings em memória.

## Vereditos

- **Spec: FAIL** para o fix4: alias de namespace com acesso por string consegue introduzir uma montagem incondicional sem R5, contrariando o preflight de aliases/usos desconhecidos com rejeição conservadora.
- **Qualidade: CHANGES_REQUIRED.** Um P2 aberto, descrito abaixo.
- O parecer de produto R2 permanece preservado para seus bytes e limites. Esta reprovação é do mecanismo de guarda novo, não nova regressão visual do produto.

## [P2] Rejeitar import de namespace e acesso por string que escondem uma montagem extra

Arquivo: **`radiant-app/scripts/visual-qa.mjs:103–109`**, com consequência na contagem de usos em **`:174–175`** e no retorno de teste **`:109`**.

O inventário considera somente nós AST `Identifier` cujo texto é `PixelIllustration`. Um acesso `CharacterArt['PixelIllustration']` contém um StringLiteral, não esse Identifier. Assim, um import adicional de namespace do mesmo módulo e uma montagem por alias local não alteram `pixelNames`: o produto continua parecendo ter exatamente um Pixel, apesar do segundo mascote incondicional. No teste, `pixelNames.length === 0` aprova imediatamente a montagem por namespace, sem examinar o `render/createElement`.

Isso é um bypass concreto do novo reconhecimento contextual e contradiz os contratos “um único uso renderizado”, “alias local escapando ou referência desconhecida não deve obter aprovação” e “JSX/createElement em teste continua sendo uso”. Não depende de comentário mentiroso, nome de arquivo novo, alteração de política ou sintaxe malformada.

### Reprodução independente

Cwd: `/Users/anderson/Developer/Radiant/.claude/worktrees/trilha-2026-10-20/radiant-app`.
Comando: `/Users/anderson/.nvm/versions/node/v20.20.2/bin/node --input-type=module`, com o seguinte corpo fornecido por heredoc; sem arquivo temporário nem alteração do produto:

```js
import { readFileSync } from 'node:fs';
import { scanSource } from './scripts/visual-qa.mjs';
const file = 'src/features/lesson-flow/renderers/BenchStepRenderer.tsx';
const actual = readFileSync(file, 'utf8');
const prefix = "import * as CharacterArt from '../../../ui/characters/PixelIllustration';\nconst ExtraMascot = CharacterArt['PixelIllustration'];\n";
const anchor = '<Text style={styles.prompt}>{payload.prompt}</Text>';
if (actual.split(anchor).length !== 2) throw new Error('nonunique anchor');
const mutated = prefix + actual.replace(anchor,
  '<ExtraMascot state="happy" size="sm" />' + anchor);
const testOnly = "import React from 'react';\nimport { render } from '@testing-library/react-native';\nimport * as CharacterArt from '../../../ui/characters/PixelIllustration';\nrender(React.createElement(CharacterArt['PixelIllustration'], {state:'happy',size:'sm'}));";
for (const [name, code, path] of [
  ['actual positive', actual, file],
  ['extra unconditional namespace alias', mutated, file],
  ['mounted character in test with namespace lookup', testOnly,
    file.replace('.tsx', '.test.tsx')],
]) console.log(JSON.stringify({ name,
  R5: scanSource(code, path).filter(issue => issue.rule === 'R5') }));
```

Resultado real, exit0:

```json
{"name":"actual positive","R5":[]}
{"name":"extra unconditional namespace alias","R5":[]}
{"name":"mounted character in test with namespace lookup","R5":[]}
```

O primeiro resultado é o controle positivo esperado. Os outros dois deveriam registrar uma regressão R5 e não registram. A montagem adicional no produto fica antes do prompt, fora da condição `explanation`, enquanto o Pixel autorizado permanece intacto.

### Correção restrita e aceite

Não é necessário implementar análise genérica de fluxo. Para a forma autorizada, rejeitar conservadoramente imports/bindings alternativos do módulo do mascote e acessos por namespace/bracket desconhecidos, antes de aceitar ausência de Identifiers ou a contagem única. A implementação não deve converter o novo caso em allowlist, baseline ou exceção. O par atual válido precisa continuar passando; os dois casos literais acima precisam retornar R5 e seus testes devem ser vistos falhando antes da correção. Formas equivalentes válidas não reconhecidas podem continuar reprovando conforme o preflight.

Este relatório não aprova outras equivalências de alias nem afirma cobertura de semântica arbitrária de JavaScript. Após este achado, não foram feitos novos probes independentes; aguarda-se o fix5 congelado e re-review focal.

## Integridade e evidência conferida

- Manifesto R3 SHA256 **`c6c760ca7227bb8856a3889eee025e81c548e8efaf344b2801c57559b1e9e1af`**: **48/48** arquivos conferem existência, tamanho e hash.
- Delta R2→R3: **17/17** entradas conferem hashes antes/depois. Exatamente dois scripts novos de escopo; nenhum dos 19 arquivos de produto está no delta. `requirements.md` é byte-idêntico ao R2.
- Scripts congelados conferem: `visual-qa.mjs` **`bd5611b7a4f7d63e29d7f19976de9b1c758edd0401ad23fe31f66b80e2f50bf2`**; `visual-qa.test.mjs` **`5b64b3b5f25454ffb6641d815ce8f1b7871e0ccb63b97b94651a0d9670d942ca`**. O módulo executado na reprodução é o mesmo desses bytes congelados.
- **19/19 `finalSourceHashes` de R2 preservados**, nenhuma divergência. Política visual comparada byte a byte com BASE/HEAD: idêntica, SHA **`5ac598287cdfab8a293f1cd89cdff16101feb7bad86deedaec81d5617dee0e00`**.
- Os três testes antigos de visual-qa estão preservados. A lista legada de nomes e a avaliação de limites/prazos não foram ampliadas no diff. R1–R4 não receberam uma nova regra de dispensa; o problema é a decisão contextual R5 nova.
- Logs do implementador registram RED inicial **28/32**, quatro falhas concretas; self-review **32/36**, quatro falhas individualizadas (CharacterSlot, receptor falso, reassignment e shadowing); final **36/36** e strict **462 arquivos/52 issues/0 regressões/49 baseline/3 exceções existentes**. Essas execuções são evidência do implementador, não reruns do revisor.
- A bateria adiciona 24 mutações de âncora única e casos de observação/receptores. Ela cobre vários erros relevantes, mas não o namespace com acesso por string reproduzido acima. O verde strict mede o produto atual; não prova que o classificador rejeita essa forma futura inválida.

## Condições restantes

Manter o fix4 congelado até a correção focal. Depois de fix5, exigir revisão independente do novo delta e, somente após aprovação, **um gate final Loop configurado 15/15**. A primeira tentativa **14/15/app-quality falhou** e permanece falha histórica; este parecer não a reclassifica, não fecha o replacement writer e não executa validação concorrente.

STATUS/G2/roadmap e evidência final continuam sob responsabilidade do controlador. Produto, PNGs e limites nativos R2 permanecem os já aprovados; G1–G8, G2/conteúdo, T14, VoiceOver audível, dispositivo físico e armazenamento nativo não foram consumidos por esta revisão técnica.


# T04 / Task 5 — revisão independente R4, fix5 do P2 R3

Data: 2026-10-27. Escopo: fechar o achado R3 de namespace/bracket e revisar regressões introduzidas no delta R3→R4. Produto e prova nativa R2 não foram reabertos. Única escrita: este relatório local. Nenhuma suíte, Loop/brain, agente, build/install ou commit/push executado. Executei apenas uma reprodução focal com os dois casos literais R3 e controles válidos, usando strings em memória.

## Vereditos separados

- **Spec: PASS** para o fix5 e o fechamento do P2 R3 dentro do reconhecimento estático autorizado.
- **Qualidade: APPROVED**, condicionada ao **gate final configurado Loop 15/15** e reconciliação documental já prevista pelo controlador.
- **P1/P2 remanescente neste escopo: nenhum.** O P2 R3 está resolvido; nenhuma alteração adicional requerida por esta revisão.

O parecer R2 continua cobrindo seus próprios bytes, provas e limites. Esta aprovação não declara que a primeira validação 14/15 passou, que o replacement writer foi fechado ou que T04/G1–G8/G2/T14 foram consumidos.

## Integridade reproduzida

- Manifesto R4: SHA256 **`6191019b27db5e0cb16b8149422a40285a36f74d292bebfdd57cf8fc64782a42`**; **48/48** entradas conferem existência, tamanho e hash nos arquivos congelados.
- Delta R3→R4: **9/9** entradas conferem hashes anteriores/posteriores. Exatamente dois scripts e sete documentos/evidências; nenhum arquivo dos 19 de produto no delta.
- `visual-qa.mjs`: **`8127e952e3c9756abd2a82947f556c986f82c1f381f6a009e0cb27f15b65c4a4`**. `visual-qa.test.mjs`: **`25b0c8e4d05d2eae8fd5da6b0bbb814223c08dcf73779dbdab6eed5ad4769446`**. Scripts do workspace são byte-idênticos aos congelados e foram os executados na reprodução focal.
- **19/19 hashes de produto R2 preservados**, sem divergência. `native-state.json` e os **14 PNGs** R4 são byte-idênticos ao R2; não há nova alegação nativa produzida por esta rodada.
- Política comparada byte a byte com BASE/HEAD: idêntica. Nenhuma baseline, exceção, prazo ou nome de tela permitido foi ampliado.

## Correção do achado e risco do delta

`radiant-app/scripts/visual-qa.mjs:104–126` passa a inventariar imports **antes** da contagem de Identifiers e de qualquer aprovação precoce do teste. O inventário inclui os módulos exatos Pixel/CharacterSlot e imports nomeados cujo nome local ou exportado seja PixelIllustration/CharacterSlot. Ele rejeita múltiplos imports relevantes, namespace, default, type-only e aliases, incluindo export nomeado por StringLiteral.

Só a forma canônica existente — um único import nomeado PixelIllustration sem alias — segue para o reconhecimento estrutural já revisado. Isso fecha os dois casos que antes escondiam o mascote no StringLiteral de `CharacterArt['PixelIllustration']`. Um import de namespace continua desconhecido/reprovado mesmo que seja usado apenas para uma consulta inocente; essa recusa conservadora é autorizada pelo preflight.

O retorno antecipado do arquivo de teste agora exige ausência tanto de Identifier Pixel quanto de import relevante. Não basta montar um Pixel via namespace sem escrever o Identifier. O guard de `namedBindings` também evita o TypeError do estágio intermediário com o import default de React.

Os dois fundamentos do preflight permanecem distintos:

1. **Momento aprovado:** a spec/brief autorizam Pixel na explicação do explorar. O reconhecimento da condição/estrutura existente permite esse contexto concreto; não adiciona `Bench` ou outro basename à lista legada de telas.
2. **Observação versus montagem:** importar ou consultar o tipo no teste não monta um mascote. O arquivo inteiro não foi dispensado; referências desconhecidas das formas cobertas são reprovadas, e os dois casos de montagem namespace/createElement agora também o são.

O delta não modifica R1–R4, a classificação legada fora dos dois caminhos exatos, ou `assessIssues`. A complexidade adicionada é um inventário local de imports, sem novo framework ou dependência. Não detectei regressão nova carregada por esse delta.

**Limite da aprovação:** a guarda reconhece a forma estática aprovada e os imports/bindings exercitados. Ela não prova semântica arbitrária de JavaScript, resolução de módulos alternativa, import dinâmico, fluxo entre módulos ou equivalências não exercitadas. Não aprovo tais casos por inferência nem exijo que esta correção vire analisador genérico. Os contratos de runtime e o nativo R2 continuam sendo evidência separada.

## Reprodução independente do P2 fechado

Cwd: `/Users/anderson/Developer/Radiant/.claude/worktrees/trilha-2026-10-20/radiant-app`.
Comando: **`/Users/anderson/.nvm/versions/node/v20.20.2/bin/node --input-type=module`**, heredoc, sem escrita de fixture.

Importei `scanSource` dos bytes finais. Reutilizei literalmente os dois payloads R3 documentados em `task-5-review-r3.md`:

- Prefixo de namespace canônico e `const ExtraMascot = CharacterArt['PixelIllustration']`, seguido de um segundo `<ExtraMascot state="happy" size="sm" />` antes do prompt. Âncora única verificada por assert.
- Arquivo de teste com import React/render, namespace canônico e `render(React.createElement(CharacterArt['PixelIllustration'], {state:'happy',size:'sm'}))`.

Acrescentei assert de cardinalidade para os dois casos e dois controles reais. Saída observada, exit0:

```json
{"name":"actual positive","R5":0}
{"name":"actual observational positive","R5":0}
{"name":"extra unconditional namespace alias","R5":1}
{"name":"mounted character in test with namespace lookup","R5":1}
```

Assim, o mesmo bypass que produziu R5=0 em R3 agora produz R5=1, sem sacrificar as duas formas válidas existentes. Não executei a suíte inteira novamente.

## RED/GREEN do implementador inspecionados

- `task-5-fix5-red.txt:186–240` inclui as duas reproduções R3 falhando na guarda antiga, esperado1/recebido0. Resumo `:392–395`: **45 testes, 37 passes, 8 falhas**. O alias nomeado simples já era rejeitado; não foi apresentado como novo vermelho.
- `task-5-fix5-green.txt` preserva a tentativa intermediária **44/45** com TypeError; não foi escondida nem contada como aprovação.
- Final `green.txt:441–490`: as duas reproduções passam, assim como os sete casos adicionais de import; **45/45**, incluindo os 36 anteriores. Os testes adicionais usam strings em memória e cobrem namespace ponto, default, alias nomeado, alias nomeado por string, default junto ao canônico e CharacterSlot por namespace/string.
- Final `green.txt:497–512`: strict com **462 arquivos, 52 issues, 0 regressões, 49 baseline, 3 exceções existentes**, lint e diff-check sem erro. Esses resultados são do implementador, não reruns do revisor. O strict só mede a árvore atual; não prova equivalências não exercitadas.

Os logs são locais SDD e foram anexados ao pacote versionado de evidência pelo controlador. Os SHA dos scripts usados e congelados conferem com o relatório do fix5.

## Condição para fechamento

O controlador pode agora prosseguir para **uma validação final configurada, exigindo 15/15**, sobre o replacement writer/conjunto final, sem E2E concorrente. O fracasso inicial 14/15 permanece preservado. Depois do gate, registrar o resultado e reconciliar os documentos canônicos, respeitando a sequência de fechamento do Loop. Este parecer não executa nem antecipa nenhum desses estados.

Nenhuma mudança de produto ou PNG novo é necessária por este parecer. Se houver novo delta de produto ou do classificador, ele sai da cobertura desta revisão. G1–G8, G2/conteúdo clínico, T14, aparelho físico, VoiceOver audível, FPS e inspeção de armazenamento nativo continuam fora deste aceite.
