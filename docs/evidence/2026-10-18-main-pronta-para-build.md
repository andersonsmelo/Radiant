# A `main` pronta para uma build: os 7 roteiros nativos e as capturas do G4 — 2026-10-18

**Item:** §4, item 1 do [prompt (19)](../superpowers/handoffs/2026-10-18-radiant-prompt-de-continuidade-19.md)
(FILA 59). O prompt entra na `main` pela PR #47, e o link fica quebrado até o
merge dela. **Executor:** Claude. **Base:** `origin/main` em `cc67243`, na branch
`claude/main-pronta-para-build`. A build de distribuição e o envio são do dono.

**Condição de pronto, combinada com o dono em 2026-10-18:** os 7 roteiros rodam
nativamente e passam, ou viram defeito registrado; as capturas do G4 ficam
versionadas com hash; roteiro desatualizado em relação ao app se corrige no
mesmo run, e defeito do app vira item da FILA, sem conserto nesta frente.

## Resultado

[medido] Seis dos sete roteiros passaram nativamente. O sétimo, o
`radiant-1-4-segundo-dia`, passou numa sonda com fixture. A prova dele com
relógio real exige 24 horas e fica para 2026-10-19. Nenhum defeito do app
apareceu. Dois roteiros estavam desatualizados e foram corrigidos. As seis
capturas do G4 estão versionadas.

| Roteiro | Resultado | Duração | Log |
| --- | --- | --- | --- |
| `learning-critical-path` | passou | 277 s | [log](2026-10-18-main-pronta-para-build/learning-critical-path.log) |
| `offline-relaunch` | passou | 177 s | [log](2026-10-18-main-pronta-para-build/offline-relaunch.log) |
| `student-checkpoint-no-duplicate-effect` | passou | 179 s | [log](2026-10-18-main-pronta-para-build/student-checkpoint-no-duplicate-effect.log) |
| `store-capture` | reprovou, roteiro corrigido, passou | 268 s | [vermelho](2026-10-18-main-pronta-para-build/store-capture-falha-1.log), [verde](2026-10-18-main-pronta-para-build/store-capture.log) |
| `reward-unlock` | passou, 207 passos | 842 s | [log](2026-10-18-main-pronta-para-build/reward-unlock.log) |
| `radiant-1-4-primeira-execucao` | passou (dia 1 do caminho 2, simulador dedicado) | 202 s | [log](2026-10-18-main-pronta-para-build/radiant-1-4-primeira-execucao.log) |
| `radiant-1-4-segundo-dia` | sonda com fixture: reprovou duas vezes, roteiro corrigido, passou. **Relógio real pendente** | 152 s | [vermelho 1](2026-10-18-main-pronta-para-build/radiant-1-4-segundo-dia-falha-1.log), [vermelho 2](2026-10-18-main-pronta-para-build/radiant-1-4-segundo-dia-falha-2.log), [verde da sonda](2026-10-18-main-pronta-para-build/radiant-1-4-segundo-dia.log) |
| `g4-native-evidence` (novo) | passou | 172 s | [log](2026-10-18-main-pronta-para-build/g4-native-evidence.log) |

## Ambiente

[medido] Os dados estão em
[`source-manifest.json`](2026-10-18-main-pronta-para-build/source-manifest.json).
- **Binário:** dev client Debug compilado com o Xcode 27.1 a partir do commit
  `cc67243`, com as flags do STATUS ("Risco de build"). O SHA-256 do executável
  começa por `22408fc7`. O JS vem do Metro da worktree, com as variáveis do
  perfil `e2e-test` e `EXPO_NO_DOTENV=1`.
- **Simuladores:** dois iPhone 17 Pro com iOS 26.5, criados nesta sessão.
- **Ferramentas:** Maestro 2.7.0 e Node 20.20.2.
- **Limite:** o Debug não prova a build Release que vai para a loja. O número de
  build local (`3`) vem do projeto nativo e não é o da loja.

## Os dois roteiros desatualizados

**`store-capture`:** [medido] o toque em "Continuar jornada" não abriu a lição.
A asserção seguinte, "Princípios de Tomografia Computadorizada", passou porque o
título também aparece no card da home, e o roteiro só reprovou no "Continuar"
da lição. A captura da falha mostra o CTA sob a barra de abas, abaixo do convite
do lembrete. O conserto copia o passo que o `learning-critical-path` já tinha:
centralizar `journey-recommendation-action` antes de tocar.

**`radiant-1-4-segundo-dia`:** [medido] a sonda reprovou em dois pontos que o
contrato estático não via:
- a revisão abre em "Passo 1 de 4": a abertura e as três perguntas. O roteiro
  esperava 5, que é a contagem da lição, que também tem a Ideia-chave;
- depois da revisão, o nó anuncia "Disponível em DD/MM/AAAA às HH:MM", e não
  "Concluído". A mudança é intencional: vem de `a366295`, de 2026-10-12, em
  `getStatusCopy` (`JourneyNodeCard.tsx`). A última passagem nativa do roteiro
  foi em 2026-09-25, antes disso.

## A sonda do segundo dia e o que falta

[medido] Rodar o dia 2 com o relógio real exige 24 horas depois do dia 1 no
mesmo simulador, por
[decisão do dono de 2026-09-24](../../radiant-app/.maestro/radiant-1-4-segundo-dia.yaml).
Para não gastar essa janela descobrindo um roteiro velho, a sonda rodou no
simulador principal. Ela fez o dia 1, venceu os três cartões da L1 com
[`preparar-revisao-devida.py`](2026-10-18-main-pronta-para-build/preparar-revisao-devida.py)
e rodou o dia 2. A fixture muda só o `dueAt` dos cartões e imprime o antes e o
depois. **A sonda prova o roteiro, não o relógio.**

**Pendente:** o dia 1 com relógio real rodou no simulador `5FD8C926` às 12:45 de
2026-10-18 e passou. O dia 2 roda nele a partir de **2026-10-19, 12:45 (−03)**,
sem `clearState` no meio. O comando está no item 59 da FILA. O simulador ficou
desligado, com o estado intacto.

## As capturas do G4

[medido] O roteiro novo
[`g4-native-evidence.yaml`](../../radiant-app/.maestro/g4-native-evidence.yaml)
roda sobre a fixture e exercita os três caminhos da revisão por item:
1. [a sessão ativa](2026-10-18-main-pronta-para-build/g4-01-sessao-ativa.png):
   a pergunta sem gabarito, sem seleção, com o "Confirmar resposta" apagado;
2. [a alternativa selecionada](2026-10-18-main-pronta-para-build/g4-02-alternativa-selecionada.png);
3. [o acerto](2026-10-18-main-pronta-para-build/g4-03-resposta-correta.png);
4. [o erro](2026-10-18-main-pronta-para-build/g4-04-resposta-errada.png):
   "Vamos revisar este ponto", com a resposta certa e a explicação;
5. [a ajuda](2026-10-18-main-pronta-para-build/g4-05-resposta-com-ajuda.png):
   "Resposta consultada";
6. [o resumo](2026-10-18-main-pronta-para-build/g4-06-sessao-concluida.png):
   "3 de 3", "3 concluídos nesta rodada" e "+4 XP confirmado".

Os SHA-256 estão em
[`screenshots.json`](2026-10-18-main-pronta-para-build/screenshots.json).

**Observações para o dono, sem conserto:**
- [medido] o feedback do erro mostra a resposta certa, mas não a que o aluno
  marcou;
- [medido] o convite do lembrete aparece também no fim da revisão;
- [não verificado] se os +4 XP são exatamente os da regra (acerto e erro com
  XP, ajuda sem). A captura mostra o total, não a conta.

## Gates

[medido] `EXPO_NO_DOTENV=1 npm run quality`, no Node 20.20.2, na worktree do
run, com todas as mudanças de código desta frente
([log](2026-10-18-main-pronta-para-build/quality.log), `exit=0`). Ele deu:
- 173 suítes e 1.763 testes do Jest, os mesmos números da `main`, porque a
  frente não muda código do app;
- o contrato Maestro com 31 testes, que já cobrem o roteiro novo;
- o visual QA com 0 regressões.

O `loop validate` do run `run-1792335759604-67e957fb` está no envelope do run.

## O que não foi verificado

- o dia 2 com relógio real, que fica para 2026-10-19;
- a build Release, Android, VoiceOver e aparelho físico;
- o `review-due` e o `rating-prompt`, que estão fora dos 7 roteiros do item;
- a sonda e o G4 dependem de uma fixture que muda o armazenamento do app. O
  `review-due.yaml` já previa isso para simulador descartável, mas não é o
  caminho que um aluno percorre.
