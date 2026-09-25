# Vermelhos — E2E dos caminhos dourados da 1.4 (2026-09-24)

Toda asserção nova precisa ser vista falhando pelo defeito **específico** que
ela nomeia (AGENTS.md, lições de 2026-09-22). Este arquivo guarda as execuções
vermelhas, não a afirmação de que existiram.

## 1. Contrato do Maestro — uma mutação por asserção

Método: para cada linha, um script aplicou **uma** mutação num flow real,
rodou `node --test --test-name-pattern 'golden paths'
scripts/maestro-contract.test.mjs` (Node `v20.20.2`), guardou a mensagem de
erro e restaurou os bytes originais, conferidos por igualdade ao fim. A última
linha é a suíte inteira depois da restauração.

```text
R1 falta um caminho (segundo-dia removido): FAIL — the 1.4 golden paths are exactly the three of spec §8 item 6
R2 corrida do dev client (subflow tirado do caminho 3): FAIL — radiant-1-4-vidas-esgotadas.yaml: the dev-client wait must run right after launchApp — a one-shot "when visible" guard races the dev client
R3 caminho 1 sem instalação limpa: FAIL — 'path 1 is a first run, so it must start from a clean install'
R4 copy da conclusão divergente: FAIL — The input did not match the regular expression /^- assertVisible: A lição foi concluída$/m. Input:
R5 caminho 1 não afirma a revisão agendada e fechada: FAIL — The input did not match the regular expression /^- assertVisible: '\^Revisar Fundamentos de Radiologia\\\. Bloqueado\\\.\$'$/m. Input:
R14 caminho 1 volta a cravar "1 dia": FAIL — The input did not match the regular expression /^- assertVisible: '\^Próxima revisão em \\d\+ \(dia\|dias\)\$'$/m. Input:
R6 caminho 2 com clearState: FAIL — 'path 2 starts from the state path 1 left one day earlier; clearing it makes day 2 unreachable'
R7 caminho 2 toca antes de afirmar a revisão devida: FAIL — 'path 2 must assert the due review before it taps anything'
R7b caminho 2 afirma outra coisa primeiro: FAIL — 'path 2 must assert the due-review recommendation first'
R8 caminho 3 com uma resposta certa: FAIL — 'every answer in path 3 must be wrong, or it spends no heart'
R9 caminho 3 com uma tentativa a menos: FAIL — path 3 must answer exactly MAX_HEARTS (5) times — one heart per wrong answer
R10 última tentativa chega ao reforço: FAIL — only the attempts before the last one reach the reinforce step
R11 vidas zeradas afirmadas com a folha modal aberta: FAIL — 'assert the emptied hearts only after the modal sheet is closed'
R13 rótulo do HUD da trilha sem o prazo da recarga: FAIL — 'on the trail the hearts HUD is a button whose label adds the refill ETA — assert "0 de N vidas; próxima em … minutos", not the bare count'
R12 folha não afirmada: FAIL — 'the empty-hearts sheet must be asserted after the last wrong answer'
RESTAURADO: # pass 22 # fail 0
```

R4, R5 e R14 falham pela regex que prende o literal lido da fonte
(`LessonSummary.tsx`, `defaultBlocks.ts` + `JourneyNodeCard.tsx`); as outras
falham pela mensagem que nomeia o defeito.

Duas correções de guarda aconteceram antes desta rodada, e ficam registradas
porque são o tipo de defeito que a rodada existe para pegar:

- **A guarda de `clearState` do caminho 2 casava com o comentário do flow.**
  Escrita como `assert.doesNotMatch(second, /clearState/)`, ela reprovou o
  arquivo correto, porque o cabeçalho do flow explica por que não há
  `clearState`. É a lição 3 dos guardas (texto em vez de estrutura). Agora
  ela casa só a chave YAML: `/^\s+clearState:/m`. A do caminho 1 recebeu a
  mesma âncora.
- **R13 reprovava com a mensagem de R11.** O rótulo sem o prazo da recarga
  fazia a asserção de ordem da folha falhar, e a mensagem acusava o modal.
  Separou-se uma asserção própria para o rótulo; a saída acima é a posterior.

## 2. Caminho 2 rodado antes das 24 horas — vermelho pretendido

Simulador iPhone 17 / iOS 26.5, 11:19 (−03), logo depois do caminho 1 verde
das 11:17. O flow não limpa estado e afirma a revisão devida antes de qualquer
toque:

```text
Launch app "com.ascendcreative.radiant"... COMPLETED
Assert that "^Revisar Fundamentos de Radiologia\. Revisão devida · \d+ (devida|devidas)\.$" is visible... FAILED
Assertion is false: "^Revisar Fundamentos de Radiologia\. Revisão devida · \d+ (devida|devidas)\.$" is visible
```

Árvore de acessibilidade da trilha no mesmo instante (Maestro `hierarchy`):
`Fundamentos de Radiologia. Concluído.` e `Revisar Fundamentos de Radiologia.
Bloqueado.` — o estado do dia 1 sobreviveu à reabertura, e a revisão ainda
não venceu. É o defeito que o flow nomeia (dia 2 inalcançável ou antecipado)
visto falhando; o verde só pode vir com o relógio real.
