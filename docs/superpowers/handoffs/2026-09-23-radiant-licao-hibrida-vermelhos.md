# Lição híbrida — execuções vermelhas das guardas

Registro da lição 4 de 2026-09-22 do `AGENTS.md`: toda guarda nova do piloto
foi vista falhando **pelo defeito que nomeia**. Cada seção traz a mutação, o
comando e o trecho da saída. Toda mutação foi revertida logo depois, e a guarda
voltou a passar. Executado em 2026-09-23, em nuvem, no branch
`feat/licao-hibrida-piloto`, com Node `v20.20.2`. Os trechos são a saída
literal do Jest, com duas edições: o tempo de cada teste (`(N ms)`) foi tirado
do fim das linhas `✕`, e um objeto de fibra do React de uma linha só, na
mutação 5.1, foi truncado com a indicação no próprio trecho.

## Tarefa 1 — geometria do mapa corporal

### Mutação 1.1 — landmark fora do quadro

Em `bodyMapGeometry.ts`, `'head-marker': [120, 38]` → `[120, -40]`.

```bash
cd radiant-app && npx jest src/features/curriculum-v3/l1-body-reference/bodyMapGeometry.test.ts --runInBand
```

```text
Tests:       14 failed, 49 passed, 63 total
    ✕ todo landmark fica dentro do quadro (anatomical, front, 320 px)
    ✕ todo landmark fica dentro do quadro (anatomical, front, 390 px)
    ✕ todo landmark fica dentro do quadro (anatomical, front, 430 px)
    ✕ todo landmark fica dentro do quadro (anatomical, back, 320 px)
    ✕ todo landmark fica dentro do quadro (anatomical, back, 390 px)
    ✕ todo landmark fica dentro do quadro (anatomical, back, 430 px)
    ✕ todo landmark fica dentro do quadro (supine, front, 320 px)
    ✕ todo landmark fica dentro do quadro (supine, front, 390 px)
    ✕ todo landmark fica dentro do quadro (supine, back, 320 px)
    ✕ todo landmark fica dentro do quadro (supine, back, 390 px)
    ✕ todo landmark fica dentro do quadro (prone, front, 320 px)
    ✕ todo landmark fica dentro do quadro (prone, front, 390 px)
    ✕ todo landmark fica dentro do quadro (prone, back, 320 px)
    ✕ todo landmark fica dentro do quadro (prone, back, 390 px)

  ● geometria do mapa corporal › todo landmark fica dentro do quadro (anatomical, front, 390 px)

    expect(received).toEqual(expected) // deep equality

    - Expected  - 1
    + Received  + 1

      Object {
    -   "inside": true,
    +   "inside": false,
        "landmarkId": "head-marker",
      }

      52 |   it.each(COMBOS)('todo landmark fica dentro do quadro (%s, %s, %i px)', (posture, perspective, width) => {
      53 |     for (const landmarkId of Object.keys(LANDMARK_POSITIONS)) {
    > 54 |       expect({ landmarkId, inside: isInsideFrame(landmarkScreenPoint(landmarkId, posture, perspective, width), width) }).toEqual({ landmarkId, inside: true });
         |                                                                                                                          ^
      55 |     }
      56 |   });
      57 |

      at toEqual (src/features/curriculum-v3/l1-body-reference/bodyMapGeometry.test.ts:54:122)

```

Em decúbito a 430 px a cabeça, girada para a lateral, cabe no quadro mais
largo; por isso 14 dos 18 casos falham, e não 18.

### Mutação 1.2 — mapa com rotação fixa

Em `BodyReferenceMap.tsx`, `const rotation = canvasRotation(posture);` →
`const rotation = '90deg';`.

```bash
cd radiant-app && npx jest src/features/curriculum-v3/l1-body-reference/bodyMapGeometry.test.ts --runInBand
```

```text
Tests:       4 failed, 59 passed, 63 total
    ✕ o mapa desenhado usa a mesma rotação e o mesmo espelho da geometria (anatomical, front)
    ✕ o mapa desenhado usa a mesma rotação e o mesmo espelho da geometria (anatomical, back)
    ✕ o mapa desenhado usa a mesma rotação e o mesmo espelho da geometria (prone, front)
    ✕ o mapa desenhado usa a mesma rotação e o mesmo espelho da geometria (prone, back)

  ● geometria do mapa corporal › o mapa desenhado usa a mesma rotação e o mesmo espelho da geometria (anatomical, front)

    expect(received).toContainEqual(expected) // deep equality

    Expected value: {"rotate": "0deg"}
    Received array: [{"scale": 1}, {"scaleX": 1}, {"rotate": "90deg"}]

      64 |       );
      65 |       const transform = (StyleSheet.flatten(getByTestId('body-map-canvas').props.style).transform ?? []) as Record<string, unknown>[];
    > 66 |       expect(transform).toContainEqual({ rotate: canvasRotation(posture) });
         |                         ^
      67 |       expect(transform).toContainEqual({ scaleX: perspective === 'front' ? 1 : -1 });
      68 |     },
      69 |   );

      at toContainEqual (src/features/curriculum-v3/l1-body-reference/bodyMapGeometry.test.ts:66:25)

```

## Tarefa 2 — tabela de relações e modelos

Comando das quatro execuções:

```bash
cd radiant-app && npx jest src/features/curriculum-v3/hybrid-l1/l1ItemTemplates.test.ts --runInBand
```

As mutações 2.1 e 2.2 rodaram contra o teste como o plano o escreveu; os
números de linha citados são dessa versão.

### Mutação 2.1 — gabarito pela tela, não pelo corpo

Em `lateralityItem`, ``correctOptionId: `patient-${params.side}` `` →
`correctOptionId: options.find((o) => o.textDescription.includes('à direita'))?.id ?? ''`.

O plano previa a falha "na vista de costas". Ela aparece antes: o laço para no
primeiro cenário errado, que é a posição anatômica vista de frente pedindo o
lado **direito** — a mão desenhada à direita de quem observa é a esquerda da
pessoa. É o mesmo defeito, flagrado mais cedo.

```text
    ✕ lateralidade: a resposta é a mão do lado pedido do corpo, em qualquer cenário
    ✕ forma: todo item tem objetivo, código de erro conhecido, opções únicas, resposta entre as opções e textos dentro do limite
Tests:       2 failed, 6 passed, 8 total

  ● modelos de exercício da L1 › lateralidade: a resposta é a mão do lado pedido do corpo, em qualquer cenário

    expect(received).toBe(expected) // Object.is equality

    Expected: "patient-right-hand"
    Received: "patient-left-hand"

      34 |         const item = lateralityItem({ id: 'x', posture, perspective, side, phase: 'challenge', format: 'tap' }, rng);
      35 |         const correct = item.options.find((option) => option.id === item.correctOptionId);
    > 36 |         expect(correct?.landmarkId).toBe(`patient-${side}-hand`);
         |                                     ^
      37 |       }
      38 |     }
      39 |   });

      at toBe (src/features/curriculum-v3/hybrid-l1/l1ItemTemplates.test.ts:36:37)
      at Object._loop (src/features/curriculum-v3/hybrid-l1/l1ItemTemplates.test.ts:33:43)

```

### Mutação 2.2 — descrição que não bate com o desenho

Em `lateralityItem`, `describeRegion(region)` → `describeRegion('direita')`.

```text
    ✕ lateralidade: a descrição de cada mão diz onde o mapa a desenha
Tests:       1 failed, 7 passed, 8 total

  ● modelos de exercício da L1 › lateralidade: a descrição de cada mão diz onde o mapa a desenha

    expect(received).toContain(expected) // indexOf

    Expected substring: "à esquerda de quem observa"
    Received string:    "Mão 2: aparece à direita de quem observa."

      45 |       for (const option of item.options) {
      46 |         const region = landmarkScreenRegion(option.landmarkId ?? '', posture, perspective, REFERENCE_FRAME_WIDTH);
    > 47 |         expect(option.textDescription).toContain(describeRegion(region));
         |                                        ^
      48 |       }
      49 |     }
      50 |   });

      at Object.toContain (src/features/curriculum-v3/hybrid-l1/l1ItemTemplates.test.ts:47:40)

```

### Mutação 2.3 — par errado na tabela: **a guarda do plano não falhou**

Em `l1RelationTable.ts`, o `landmarkId` de `lateral`: `'outer-arm-marker'` →
`'shoulder-marker'`.

Contra o teste como o plano o escreveu, a suíte passou inteira:

```text
Tests:       8 passed, 8 total
```

Causa: a asserção comparava o gabarito do item com
`entry.terms[termIndex].landmarkId`, lido **da mesma tabela** que a mutação
altera. Era um espelho, e espelho tem conjunto de falhas vazio (corolário de
teste do `AGENTS.md`, 2026-09-22).

Correção, mínima e só no teste: `l1ItemTemplates.test.ts` ganhou
`REVIEWED_KEY`, cópia literal dos cinco pares revisados, fora da tabela. A
asserção passou a comparar o item com ela, e o teste confere também que a
tabela e a cópia listam as mesmas relações. Mesma mutação, contra o teste
corrigido:

```text
    ✕ relação: a resposta é o landmark que a tabela liga ao termo pedido, e a outra opção é o par dele
Tests:       1 failed, 7 passed, 8 total

  ● modelos de exercício da L1 › relação: a resposta é o landmark que a tabela liga ao termo pedido, e a outra opção é o par dele

    expect(received).toEqual(expected) // deep equality

    - Expected  - 1
    + Received  + 1

      Array [
        "midline-marker",
    -   "outer-arm-marker",
    +   "shoulder-marker",
      ]

      73 |           const byId = new Map(item.options.map((option) => [option.id, option.landmarkId]));
      74 |           expect(byId.get(item.correctOptionId)).toBe(REVIEWED_KEY[entry.relation][termIndex]);
    > 75 |           expect([...byId.values()].sort()).toEqual([...REVIEWED_KEY[entry.relation]].sort());
         |                                             ^
      76 |         }
      77 |       }
      78 |     }
```

## Tarefa 3 — sessão: evidência independente

### Mutação 3.1 — variante contada como evidência independente

Em `HybridLessonSession.ts`,
`const independent = item.phase === 'challenge' && !item.variant;` →
`const independent = item.phase === 'challenge';`.

```bash
cd radiant-app && npx jest src/features/curriculum-v3/hybrid-l1/HybridLessonSession.test.ts --runInBand
```

```text
    ✕ só a primeira tentativa de um desafio original é evidência independente
Tests:       1 failed, 8 passed, 9 total

  ● sessão da lição híbrida › só a primeira tentativa de um desafio original é evidência independente

    expect(received).toBe(expected) // Object.is equality

    Expected: "assisted_practice"
    Received: "initial_independent"

      74 |       expect(kinds.get(item.id)).toBe(item.phase === 'challenge' ? 'initial_independent' : 'assisted_practice');
      75 |     }
    > 76 |     expect(kinds.get('h07-sup-prof-v')).toBe('assisted_practice');
         |                                         ^
      77 |     expect(session.evidence().filter((entry) => entry.itemId === 'h01-lat-frente')).toHaveLength(1);
      78 |   });
      79 |

      at Object.toBe (src/features/curriculum-v3/hybrid-l1/HybridLessonSession.test.ts:76:41)

```

Antes desta mutação, o teste como o plano o escreveu já reprovava contra a
implementação correta, por outro motivo: ele errava `h01-lat-frente` em
**todas** as tentativas, e o primeiro contato repete o item até o acerto, então
a lição nunca saía de `h01` e o `kinds.get('h02-…')` vinha `undefined`. O teste
foi corrigido para errar só a primeira tentativa de `h01` e de `h07`; a execução
acima é contra o teste corrigido.

## Tarefa 4 — som e vibração: preferência de sons

### Mutação 4.1 — sons tocam mesmo desligados

A execução abaixo foi contra o teste como o plano o escreveu. Depois, o teste
mudou só para passar no lint (acesso ao mock por `jest.requireMock` em vez de
`haptics[nome]`), e a mesma mutação foi repetida contra a versão final: `1
failed, 7 passed`, no mesmo caso.

Em `createLessonFeedback`, `if (preferences.sounds) sounds.play(SOUND[event]);`
→ `sounds.play(SOUND[event]);`.

```bash
cd radiant-app && npx jest src/ui/feedback/lessonFeedback.test.ts --runInBand
```

```text
    ✕ com sons desligados, só vibra
Tests:       1 failed, 7 passed, 8 total

  ● feedback da lição › com sons desligados, só vibra

    expect(jest.fn()).not.toHaveBeenCalled()

    Expected number of calls: 0
    Received number of calls: 1

    1: "acerto"

      29 |     const sounds = { play: jest.fn(), release: jest.fn() };
      30 |     createLessonFeedback(sounds, { sounds: false, haptics: true }).emit('correct');
    > 31 |     expect(sounds.play).not.toHaveBeenCalled();
         |                             ^
      32 |     expect(haptics.hapticSuccess).toHaveBeenCalledTimes(1);
      33 |   });
      34 |

```

## Tarefa 5 — cartão "Sons e vibração"

O plano não pede mutação nesta tarefa, mas ela cria duas guardas novas; as duas
foram vistas falhando.

### Mutação 5.1 — o cartão aparece no build do aluno

Em `ProfileScreen.tsx`, `{AppConfig.SHOW_DEV_TOOLS ? (` antes do
`<FeedbackPreferencesCard` → `{true ? (`.

```bash
cd radiant-app && npx jest src/features/profile/screens --runInBand
```

```text
    ✕ não mostra nada disso no build do aluno
Tests:       1 failed, 10 passed, 11 total

  ● ProfileScreen — a porta do console de desenvolvimento › não mostra nada disso no build do aluno

    expect(received).toBeNull()

    Received: {"_fiber": … (nó de texto "Sons e vibração"; objeto truncado aqui)

      163 |     expect(screen.queryByText(/desenvolvimento/iu)).toBeNull();
      164 |     // Os sons só existem no piloto: o aluno não vê interruptor de algo que nunca ouve.
    > 165 |     expect(screen.queryByText('Sons e vibração')).toBeNull();
          |                                                   ^
      166 |   });
      167 | });
      168 |
```

### Mutação 5.2 — desligar sons religa a vibração

Em `FeedbackPreferencesCard.tsx`, `onChange({ ...value, sounds })` →
`onChange({ sounds, haptics: true })`.

```bash
cd radiant-app && npx jest src/features/profile/components --runInBand
```

```text
    ✕ desligar sons mantém a vibração como estava
Tests:       1 failed, 1 passed, 2 total

  ● cartão de sons e vibração › desligar sons mantém a vibração como estava

    expect(jest.fn()).toHaveBeenCalledWith(...expected)

    - Expected
    + Received

      Object {
    -   "haptics": false,
    +   "haptics": true,
        "sounds": false,
      },

    Number of calls: 1

      16 |     render(<FeedbackPreferencesCard preferences={{ sounds: true, haptics: false }} onChange={onChange} />);
      17 |     fireEvent(screen.getByLabelText('Sons'), 'valueChange', false);
    > 18 |     expect(onChange).toHaveBeenCalledWith({ sounds: false, haptics: false });
         |                      ^
      19 |   });
      20 | });
```
