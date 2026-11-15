# F8: execuções vermelhas (2026-11-15)

Cada asserção nova foi vista falhando antes do verde. O método variou conforme o caso:

- **asserção sobre comportamento novo:** um esqueleto ingênuo (convida sempre, nunca
  grava, não renderiza nada), para a falha vir do defeito nomeado e não de "módulo não
  encontrado";
- **contraprova (chave desligada = `main`):** defeito injetado no código pronto (a chave
  ignorada), teste rodado e o código restaurado.

Comandos com Node 20.20.2, em `radiant-app/`. Saídas resumidas às linhas da falha.

**Ressalva de método:** nas Tarefas 1 e 2, o redirecionamento `2>&1 > arquivo` mandou o
stderr do Jest para a tela, e os arquivos ficaram vazios. Os trechos dessas tarefas
foram transcritos da saída vista na conversa. Das Tarefas 3 e 4 em diante, a saída
foi salva inteira e está resumida aqui.

## Tarefa 1: chave e serviço

`npx jest src/config/killSwitches.contract.test.ts src/features/conversion src/storage`

- Antes da flag: `ENABLE_CONVERSION_PROMPTS lê EXPO_PUBLIC_ENABLE_CONVERSION_PROMPTS, com
  padrão desligado`: `expect(valor).toBeDefined()`, `Received: undefined`.
- Com a flag e sem leitor: `toda flag ENABLE_* tem leitor`: `+ "ENABLE_CONVERSION_PROMPTS"`.
- Esqueleto do serviço (`takeInvite` devolve sempre `{ sampleAvailable: true }`, nada é
  gravado, a amostra chama `setUnlimited(null)`): 10 falhas em 11.
  - desligado: `Received: {"sampleAvailable": true}` (linha 41);
  - um por dia local: o segundo convite do mesmo dia `Received: {"sampleAvailable": true}` (51);
  - não convida assinante, nem pedido pendente, nem sem loja: `Received: {"sampleAvailable": true}` (66, 72);
  - ex-assinante: `- "sampleAvailable": false / + true` (77);
  - amostra: `Expected: "2026-11-16T03:00:00.000Z", 1794796200000 / Received: null, 1794796200000` (85);
  - amostra só sem vidas: `- false / + true` (100);
  - funil: `SyntaxError: "undefined" is not valid JSON` (109; a chave nunca foi gravada);
  - G7: `Received: {"sampleAvailable": true}` (121).
  - **Passou contra o esqueleto:** "store ilegível vira estado vazio". É uma asserção de
    robustez que o esqueleto satisfaz por acaso, e não foi vista falhando.

## Tarefa 2: comparação e tela

- Esqueleto da comparação (aulas "Algumas" × "Todas", vidas iguais): falharam a de
  diferença das vidas (`Expected: not "Limitadas"`), a da recompensa
  (`Expected substring: "1 vida" / Received string: "Devolve vida"`) e a das aulas
  iguais (`Expected: "Todas" / Received: "Algumas"`).
- **Guarda de validade vista sozinha:** com as vidas diferentes, mas sem números
  (`"Limitadas"` × `"Ilimitadas"`), a asserção de diferença passou e a de validade falhou:
  `Expected substring: "5" / Received string: "Limitadas"` (linha 20).
- Tela sem a F8: os três casos ligados falharam com `Unable to find an element with
  text: Gratuito`, e as contagens de compra deram `Received: undefined`.
- **Contraprova:** com `const comparing = true; // DEFEITO INJETADO`, falhou
  `Unable to find an element with text: As aulas são as mesmas para todo mundo.` (linha 85).
  Restaurado; `grep -c DEFEITO` = 0.

## Tarefa 3: convite na folha e na comemoração

Esqueleto (o componente não renderiza nada, e o gancho devolve `invite: null`): 8 falhas,
todas `Unable to find`:

- folha: o título do convite (147), o botão "Conhecer o Ilimitado" (157), o botão
  `/Experimentar/` (165) e a reabertura no mesmo dia (182);
- comemoração: a linha do convite (121);
- componente: o título (15), o botão da amostra (27) e a linha da unidade (39).

**Contraprovas:** com `takeInvite` sem o `!this.enabled() ||` (`// DEFEITO INJETADO`), as
duas falharam:

- `HeartsSheet … desligada (contraprova)`:
  `expect(view.queryByText('Com o Radiant Ilimitado, errar não gasta vida.')).toBeNull()` (194);
- `UnitCompleteCelebration … desligada (contraprova)`:
  `expect(screen.queryByText(/Radiant Ilimitado/)).toBeNull()` (132).

Serviço restaurado da cópia; `grep -c DEFEITO` = 0.

## Tarefa 4: cartão do funil

Esqueleto vazio: `Unable to find an element with text: Convite visto, sem vidas: 4` e
`… desligada · nada é contado · nenhum convite ainda`.
