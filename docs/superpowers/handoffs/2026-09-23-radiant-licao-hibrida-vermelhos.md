# Lição híbrida — execuções vermelhas das guardas

Registro da lição 4 de 2026-09-22 do `AGENTS.md`: toda guarda nova do piloto
foi vista falhando **pelo defeito que nomeia**. Cada seção traz a mutação, o
comando e o trecho da saída. Toda mutação foi revertida logo depois, e a guarda
voltou a passar. Executado em 2026-09-23, em nuvem, no branch
`feat/licao-hibrida-piloto`, com Node `v20.20.2`. Os trechos são a saída
literal do Jest, com uma única edição: o tempo de cada teste (`(N ms)`) foi
tirado do fim das linhas `✕`.

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
