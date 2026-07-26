# Gate 2 — validação de acessibilidade em device — 2026-07-26

**Data da coleta:** 2026-07-26
**Escopo:** checklist manual de release-candidate de
[`docs/ACCESSIBILITY_QA_V1.md`](../ACCESSIBILITY_QA_V1.md), executado no
simulador iOS com a build Release local equivalente ao perfil `e2e-test`.
**Destino:** `Radiant iPhone 17 Pro / iOS 26.5`.
**Classificação:** `app-failed`. Três dos cinco itens passaram com evidência;
um não pôde ser verificado sem VoiceOver com áudio; um não foi executado. Os
dois defeitos encontrados (D1 e D2) foram **corrigidos e reverificados em
device** no mesmo dia — ver "Correção". O gate segue sem aprovação porque os
itens 2 e 5 continuam abertos, não por causa de D1/D2.

## Método

Este gate não foi conferido a olho. Para cada tela do checklist a árvore de
acessibilidade foi capturada e analisada programaticamente — a mesma árvore que
o VoiceOver percorre — extraindo nome, dica, estado (`selected`, `enabled`),
ordem de leitura e tamanho de alvo de toque. As capturas vêm dos artefatos
`screen-hierarchy` do Maestro, obtidos no ponto exato de cada tela. Screenshots
e árvores ficam fora do Git.

## Item 1 — Reduce Motion: **passou**

Verificado por estabilidade de quadros, não por impressão visual. Com a
preferência ligada
(`simctl spawn booted defaults write com.apple.Accessibility
ReduceMotionEnabled -bool true`), três screenshots consecutivos tirados logo
após a entrada da tela de lição são **byte-idênticos** (mesmo md5 nos três).
Com a preferência desligada, os três quadros **diferem entre si**. Ou seja: a
animação de entrada realmente move conteúdo quando permitida, e realmente
resolve de imediato quando a preferência está ativa — o comportamento em
runtime confirma o que o teste unitário do hook já cobria.

Cobertura honesta: isso valida a animação de **entrada** no caminho da lição.
Os efeitos de shake, scale e press não foram medidos por exigirem captura no
instante da interação.

## Item 2 — nomes, dicas e estado do AppButton: **não verificado**

A ordem de leitura foi capturada em todas as telas do checklist e está
coerente, e todo controle interativo tem nome programático. Mas o requisito
literal do checklist é que o estado seja anunciado **uma vez** e na ordem
esperada, e isso não é decidível a partir da árvore: os nós de texto estático
aparecem duplicados no dump (nó pai com um filho idêntico, mesmos bounds),
enquanto os controles aparecem uma única vez. Esse padrão é artefato do dump
XCUITest, **não** evidência de anúncio duplicado — e também não é prova do
contrário. Fechar este item exige um humano com VoiceOver ligado.

## Item 3 — resposta selecionada e travada sem depender de cor: **passou**

Tela de quiz, após selecionar a opção 1:

| Opção | Estado exposto |
|---|---|
| Tratamento de tumores | `disabled` |
| Visualização de estruturas internas | `selected`, `disabled` |
| Esterilização de equipamentos | `disabled` |
| Aquecimento de tecidos | `disabled` |

Tanto a seleção quanto o travamento pós-resposta são comunicados
programaticamente. Nada depende de cor.

## Item 4 — onboarding com exatamente uma escolha por grupo: **passou**

Na etapa `STEP 3 OF 4`, exatamente uma especialidade
(`Chest & thorax, 120 cases`) e exatamente um objetivo diário
(`10 min por dia, ritmo Steady`) aparecem como `selected`. O papel de rádio
está declarado em [`src/app/onboarding/goal.tsx`](../../src/app/onboarding/goal.tsx)
(linhas 45 e 71).

## Item 5 — navegação por teclado no preview web: **não executado**

Exige uma build web, que não foi gerada neste ciclo.

A parte de tamanho de alvo do mesmo item **foi** medida em device, e passou:
todo controle interativo fica igual ou acima de 44pt — `Fechar lição` 44×44,
opções de quiz 336×56, chips de objetivo 115×63, CTAs 362×56 e 370×56.

## Defeitos encontrados

### D1 — ícones decorativos expostos com o codepoint cru

Glifos do Material Icons são elementos de acessibilidade cujo nome é o
caractere de uso privado da fonte, não um texto legível. Observados como
`` na tela de quiz e `` e `` na tela de checkpoint. Um
usuário de VoiceOver ouve um caractere sem significado no meio do conteúdo.
Correção esperada: ocultar da árvore os ícones puramente decorativos, ou dar a
eles um rótulo real quando carregarem informação.

### D2 — rotas do Expo Router vazando para o header

O header nativo expõe e **exibe** o caminho de rota cru: botão de voltar
rotulado `(tabs)` e título `onboarding/index`; nas etapas seguintes,
`onboarding/value` e `onboarding/goal`. É defeito duplo — o VoiceOver lê o
caminho da rota, e a barra clara aparece por cima da UI escura na tela.

Alcance observado: o header aparece no onboarding acessado por **deep link**,
que é exatamente o caminho usado pelo flow `onboarding-to-home.yaml`. O flow
passa porque afirma `WELCOME TO RADIANT`, que fica abaixo do header, então o
smoke nunca percebeu.

## Correção de D1 e D2 — 2026-07-26

### D1 — corrigido

Novo componente
[`src/components/ui/DecorativeIcon.tsx`](../../src/components/ui/DecorativeIcon.tsx):
envolve o `MaterialIcons` com `accessible={false}`,
`accessibilityElementsHidden` e
`importantForAccessibility="no-hide-descendants"`. Os 30 usos nas 10 telas
migraram para ele; nenhuma tela importa `MaterialIcons` diretamente.

A escolha foi tornar o ícone decorativo **por padrão** em vez de marcar caso a
caso os que vazavam. Só vazavam os ícones fora de um container acessível — os
que ficam dentro de um `Pressable` rotulado já eram colapsados pelo iOS — e
depender disso é frágil: basta mover o ícone para fora do container para o
defeito voltar.

### D2 — corrigido

A causa não era o onboarding: era o padrão da Stack raiz. Todas as rotas
declaradas já pediam `headerShown: false` uma a uma, então qualquer rota **não**
declarada caía no header nativo. `src/app/onboarding/` e `src/app/galaxy/` não
têm `_layout.tsx` próprio, logo seus arquivos viram rotas soltas na raiz que a
declaração `name="onboarding"` não cobria.

Correção em [`src/app/_layout.tsx`](../../src/app/_layout.tsx): inverter o
padrão para `<Stack screenOptions={{ headerShown: false }}>`, deixando o modal
como a única exceção explícita. Isso cobre onboarding, galaxy e qualquer rota
futura, em vez de exigir uma declaração nova a cada tela criada.

### Verificação em device

Rebuild Release, reinstalação e recaptura das mesmas árvores:

| Tela | Antes | Depois |
|---|---|---|
| Quiz | 21 elementos nomeados, incluindo o glifo `` | 19 elementos, sem glifo |
| Onboarding etapa 3 | 20 elementos, incluindo `onboarding/value` e `onboarding/goal` | 18 elementos, sem caminho de rota |

O conteúdo do onboarding subiu de `y=198` para `y=82`, confirmando que a barra
saiu da tela e não apenas da árvore. A suíte E2E foi reexecutada depois da
mudança de layout: `3/3 Flows Passed in 8m 22s`.

### Proteção contra regressão

Dois testes novos em
[`scripts/maestro-contract.test.mjs`](../../scripts/maestro-contract.test.mjs):
um varre `src/features` e `src/app` e falha se qualquer tela importar
`MaterialIcons` direto; o outro exige `screenOptions={{ headerShown: false }}`
na Stack raiz. Ambos os defeitos eram invisíveis em screenshot e passariam
despercebidos numa revisão visual.

## Observações fora do escopo do Gate 2

Registradas aqui porque apareceram durante a coleta, sem correção:

- **Instalação limpa não passa pelo onboarding.** Com o app recém-instalado e
  aberto sem deep link, a primeira tela é a Home, não o onboarding. Vale
  confirmar se é intencional nesta configuração de build.
- **`1 passos elegíveis nesta unidade`** — concordância incorreta no singular.
- **`Tap to inspect`** em inglês dentro da tela de lição em português.
- Quebra de linha no meio da palavra em cartões estreitos (`fundamento s de
  radiologia` no herói do home), mesma classe já registrada para o
  `JourneyMap` em
  [`2026-07-26-device-e2e-followup.md`](2026-07-26-device-e2e-followup.md).

## Privacidade

Nenhum UUID de conta, token, resposta de usuário ou conteúdo clínico foi
incluído. Screenshots e árvores de acessibilidade permanecem fora do Git.
