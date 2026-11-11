# T03 audit: mutations discriminantes

Node 20.20.2, CPU limitada taskpolicy -b; sem supressão de console.
Cada injeção mira arquivo próprio, com âncora única e restauração em finally + SHA-256.
Mutantes são defeitos sintéticos, não defeitos atribuídos à baseline.

Source SHA-256: 932febab5181357208495e216de1c759ffc2023522afc143b7dac314efea6643

## safe-area removida

Command: /usr/sbin/taskpolicy -b /Users/anderson/.nvm/versions/node/v20.20.2/bin/node radiant-app/node_modules/jest/bin/jest.js --config radiant-app/jest.config.cjs --runInBand radiant-app/src/features/first-run/screens/WelcomeFlowScreen.flow.test.tsx --testNamePattern 'mantém Pular dentro'

Exit 1; source restored SHA-256 932febab5181357208495e216de1c759ffc2023522afc143b7dac314efea6643

```text
FAIL radiant-app/src/features/first-run/screens/WelcomeFlowScreen.flow.test.tsx (5.2 s)
  WelcomeFlowScreen — primeira bancada
    ✕ mantém Pular dentro da safe area e fora da rolagem em viewport curta com texto máximo (64 ms)
    ○ skipped começa em 60 kV, sem paginação, com instrução fora da fala do Pixel
    ○ skipped explica o armazenamento local na plataforma ios
    ○ skipped explica o armazenamento local na plataforma android
    ○ skipped não conclui sem uma mudança real de valor
    ○ skipped ao ajustar para 65 kV, muda a faixa e os números usados no shader
    ○ skipped ao ajustar para 70 kV, muda a faixa e os números usados no shader
    ○ skipped ao ajustar para 90 kV, muda a faixa e os números usados no shader
    ○ skipped ao ajustar para 95 kV, muda a faixa e os números usados no shader
    ○ skipped ao ajustar para 100 kV, muda a faixa e os números usados no shader
    ○ skipped a imagem acompanha o preview contínuo e volta ao valor do passo ao soltar
    ○ skipped botões e ações acessíveis operam a bancada; voltar a 60 mantém Continuar habilitado
    ○ skipped conclui uma vez no passo 1 mesmo com toques repetidos e Pular logo depois
    ○ skipped Pular sai uma vez sem operar a bancada
    ○ skipped avisa apenas o passo único, sem repetir ao ajustar kV
  WelcomeFlowScreen — checkpoint real em memória
    ○ skipped retoma slide-1 na bancada única e normaliza o checkpoint persistido
    ○ skipped retoma slide-2 na bancada única e normaliza o checkpoint persistido
    ○ skipped retoma slide-3 na bancada única e normaliza o checkpoint persistido
    ○ skipped não duplica onFinish enquanto a conclusão assíncrona do checkpoint ainda espera

  ● WelcomeFlowScreen — primeira bancada › mantém Pular dentro da safe area e fora da rolagem em viewport curta com texto máximo

    No instances found with node type: "ForwardRef"

      143 |         </SafeAreaProvider>);
      144 |         try {
    > 145 |             const safe = result.UNSAFE_getByType(SafeAreaView);
          |                                 ^
      146 |             const scroll = result.UNSAFE_getByType(ScrollView);
      147 |             const skip = screen.getByLabelText('Pular apresentação');
      148 |             const style = StyleSheet.flatten(skip.props.style);

      at Object.UNSAFE_getByType (src/features/first-run/screens/WelcomeFlowScreen.flow.test.tsx:145:33)

Test Suites: 1 failed, 1 total
Tests:       1 failed, 18 skipped, 19 total
Snapshots:   0 total
Time:        6.055 s
Ran all test suites matching /radiant-app\/src\/features\/first-run\/screens\/WelcomeFlowScreen.flow.test.tsx/i with tests matching "mantém Pular dentro".

```

## alvo Pular reduzido a 20

Command: /usr/sbin/taskpolicy -b /Users/anderson/.nvm/versions/node/v20.20.2/bin/node radiant-app/node_modules/jest/bin/jest.js --config radiant-app/jest.config.cjs --runInBand radiant-app/src/features/first-run/screens/WelcomeFlowScreen.flow.test.tsx --testNamePattern 'mantém Pular dentro'

Exit 1; source restored SHA-256 932febab5181357208495e216de1c759ffc2023522afc143b7dac314efea6643

```text
FAIL radiant-app/src/features/first-run/screens/WelcomeFlowScreen.flow.test.tsx
  WelcomeFlowScreen — primeira bancada
    ✕ mantém Pular dentro da safe area e fora da rolagem em viewport curta com texto máximo (95 ms)
    ○ skipped começa em 60 kV, sem paginação, com instrução fora da fala do Pixel
    ○ skipped explica o armazenamento local na plataforma ios
    ○ skipped explica o armazenamento local na plataforma android
    ○ skipped não conclui sem uma mudança real de valor
    ○ skipped ao ajustar para 65 kV, muda a faixa e os números usados no shader
    ○ skipped ao ajustar para 70 kV, muda a faixa e os números usados no shader
    ○ skipped ao ajustar para 90 kV, muda a faixa e os números usados no shader
    ○ skipped ao ajustar para 95 kV, muda a faixa e os números usados no shader
    ○ skipped ao ajustar para 100 kV, muda a faixa e os números usados no shader
    ○ skipped a imagem acompanha o preview contínuo e volta ao valor do passo ao soltar
    ○ skipped botões e ações acessíveis operam a bancada; voltar a 60 mantém Continuar habilitado
    ○ skipped conclui uma vez no passo 1 mesmo com toques repetidos e Pular logo depois
    ○ skipped Pular sai uma vez sem operar a bancada
    ○ skipped avisa apenas o passo único, sem repetir ao ajustar kV
  WelcomeFlowScreen — checkpoint real em memória
    ○ skipped retoma slide-1 na bancada única e normaliza o checkpoint persistido
    ○ skipped retoma slide-2 na bancada única e normaliza o checkpoint persistido
    ○ skipped retoma slide-3 na bancada única e normaliza o checkpoint persistido
    ○ skipped não duplica onFinish enquanto a conclusão assíncrona do checkpoint ainda espera

  ● WelcomeFlowScreen — primeira bancada › mantém Pular dentro da safe area e fora da rolagem em viewport curta com texto máximo

    expect(received).toBeGreaterThanOrEqual(expected)

    Expected: >= 44
    Received:    20

      149 |             expect(safe.findAll(node => node === skip)).toHaveLength(1);
      150 |             expect(scroll.findAll(node => node === skip)).toHaveLength(0);
    > 151 |             expect(style.minHeight).toBeGreaterThanOrEqual(44);
          |                                     ^
      152 |             expect(style.minWidth).toBeGreaterThanOrEqual(44);
      153 |             expect(style.position).not.toBe('absolute');
      154 |             expect(screen.getByText('Ajuste o kV e veja a imagem mudar.').props.numberOfLines).toBeUndefined();

      at Object.toBeGreaterThanOrEqual (src/features/first-run/screens/WelcomeFlowScreen.flow.test.tsx:151:37)

Test Suites: 1 failed, 1 total
Tests:       1 failed, 18 skipped, 19 total
Snapshots:   0 total
Time:        4.058 s, estimated 6 s
Ran all test suites matching /radiant-app\/src\/features\/first-run\/screens\/WelcomeFlowScreen.flow.test.tsx/i with tests matching "mantém Pular dentro".

```

## saída sem trava síncrona

Command: /usr/sbin/taskpolicy -b /Users/anderson/.nvm/versions/node/v20.20.2/bin/node radiant-app/node_modules/jest/bin/jest.js --config radiant-app/jest.config.cjs --runInBand radiant-app/src/features/first-run/screens/WelcomeFlowScreen.flow.test.tsx --testNamePattern 'conclui uma vez|Pular sai uma vez|não duplica onFinish'

Exit 1; source restored SHA-256 932febab5181357208495e216de1c759ffc2023522afc143b7dac314efea6643

```text
FAIL radiant-app/src/features/first-run/screens/WelcomeFlowScreen.flow.test.tsx
  WelcomeFlowScreen — primeira bancada
    ✕ conclui uma vez no passo 1 mesmo com toques repetidos e Pular logo depois (150 ms)
    ✕ Pular sai uma vez sem operar a bancada (33 ms)
    ○ skipped começa em 60 kV, sem paginação, com instrução fora da fala do Pixel
    ○ skipped explica o armazenamento local na plataforma ios
    ○ skipped explica o armazenamento local na plataforma android
    ○ skipped não conclui sem uma mudança real de valor
    ○ skipped ao ajustar para 65 kV, muda a faixa e os números usados no shader
    ○ skipped ao ajustar para 70 kV, muda a faixa e os números usados no shader
    ○ skipped ao ajustar para 90 kV, muda a faixa e os números usados no shader
    ○ skipped ao ajustar para 95 kV, muda a faixa e os números usados no shader
    ○ skipped ao ajustar para 100 kV, muda a faixa e os números usados no shader
    ○ skipped a imagem acompanha o preview contínuo e volta ao valor do passo ao soltar
    ○ skipped botões e ações acessíveis operam a bancada; voltar a 60 mantém Continuar habilitado
    ○ skipped avisa apenas o passo único, sem repetir ao ajustar kV
    ○ skipped mantém Pular dentro da safe area e fora da rolagem em viewport curta com texto máximo
  WelcomeFlowScreen — checkpoint real em memória
    ✕ não duplica onFinish enquanto a conclusão assíncrona do checkpoint ainda espera (1113 ms)
    ○ skipped retoma slide-1 na bancada única e normaliza o checkpoint persistido
    ○ skipped retoma slide-2 na bancada única e normaliza o checkpoint persistido
    ○ skipped retoma slide-3 na bancada única e normaliza o checkpoint persistido

  ● WelcomeFlowScreen — primeira bancada › conclui uma vez no passo 1 mesmo com toques repetidos e Pular logo depois

    expect(jest.fn()).toHaveBeenCalledTimes(expected)

    Expected number of calls: 1
    Received number of calls: 3

      117 |         fireEvent.press(screen.getByLabelText('Continuar'));
      118 |         fireEvent.press(screen.getByLabelText('Pular apresentação'));
    > 119 |         expect(onFinish).toHaveBeenCalledTimes(1);
          |                          ^
      120 |         expect(onFinish).toHaveBeenCalledWith('completed', 1);
      121 |     });
      122 |

      at Object.toHaveBeenCalledTimes (src/features/first-run/screens/WelcomeFlowScreen.flow.test.tsx:119:26)

  ● WelcomeFlowScreen — primeira bancada › Pular sai uma vez sem operar a bancada

    expect(jest.fn()).toHaveBeenCalledTimes(expected)

    Expected number of calls: 1
    Received number of calls: 2

      126 |         fireEvent.press(screen.getByLabelText('Pular apresentação'));
      127 |         fireEvent.press(screen.getByLabelText('Pular apresentação'));
    > 128 |         expect(onFinish).toHaveBeenCalledTimes(1);
          |                          ^
      129 |         expect(onFinish).toHaveBeenCalledWith('skipped', 1);
      130 |     });
      131 |

      at Object.toHaveBeenCalledTimes (src/features/first-run/screens/WelcomeFlowScreen.flow.test.tsx:128:26)

  ● WelcomeFlowScreen — checkpoint real em memória › não duplica onFinish enquanto a conclusão assíncrona do checkpoint ainda espera

    expect(jest.fn()).toHaveBeenCalledTimes(expected)

    Expected number of calls: 1
    Received number of calls: 3

      199 |         fireEvent.press(screen.getByLabelText('Continuar'));
      200 |         fireEvent.press(screen.getByLabelText('Pular apresentação'));
    > 201 |         await waitFor(() => expect(finish).toHaveBeenCalledTimes(1));
          |                      ^
      202 |         expect(onFinish.mock.calls).toEqual([['completed', 1]]);
      203 |         await act(async () => { release(); await barrier; });
      204 |         await waitFor(async () => expect(await store.getCheckpointById('welcome-checkpoint')).toMatchObject({ phase: 'superseded' }));

      at Object.<anonymous> (src/features/first-run/screens/WelcomeFlowScreen.flow.test.tsx:201:22)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

Test Suites: 1 failed, 1 total
Tests:       3 failed, 16 skipped, 19 total
Snapshots:   0 total
Time:        5.356 s
Ran all test suites matching /radiant-app\/src\/features\/first-run\/screens\/WelcomeFlowScreen.flow.test.tsx/i with tests matching "conclui uma vez|Pular sai uma vez|não duplica onFinish".

```

## imagem desligada do kV

Command: /usr/sbin/taskpolicy -b /Users/anderson/.nvm/versions/node/v20.20.2/bin/node radiant-app/node_modules/jest/bin/jest.js --config radiant-app/jest.config.cjs --runInBand radiant-app/src/features/first-run/screens/WelcomeFlowScreen.flow.test.tsx --testNamePattern 'ao ajustar para'

Exit 1; source restored SHA-256 932febab5181357208495e216de1c759ffc2023522afc143b7dac314efea6643

```text
FAIL radiant-app/src/features/first-run/screens/WelcomeFlowScreen.flow.test.tsx
  WelcomeFlowScreen — primeira bancada
    ✕ ao ajustar para 65 kV, muda a faixa e os números usados no shader (240 ms)
    ✕ ao ajustar para 70 kV, muda a faixa e os números usados no shader (91 ms)
    ✕ ao ajustar para 90 kV, muda a faixa e os números usados no shader (95 ms)
    ✕ ao ajustar para 95 kV, muda a faixa e os números usados no shader (70 ms)
    ✕ ao ajustar para 100 kV, muda a faixa e os números usados no shader (79 ms)
    ○ skipped começa em 60 kV, sem paginação, com instrução fora da fala do Pixel
    ○ skipped explica o armazenamento local na plataforma ios
    ○ skipped explica o armazenamento local na plataforma android
    ○ skipped não conclui sem uma mudança real de valor
    ○ skipped a imagem acompanha o preview contínuo e volta ao valor do passo ao soltar
    ○ skipped botões e ações acessíveis operam a bancada; voltar a 60 mantém Continuar habilitado
    ○ skipped conclui uma vez no passo 1 mesmo com toques repetidos e Pular logo depois
    ○ skipped Pular sai uma vez sem operar a bancada
    ○ skipped avisa apenas o passo único, sem repetir ao ajustar kV
    ○ skipped mantém Pular dentro da safe area e fora da rolagem em viewport curta com texto máximo
  WelcomeFlowScreen — checkpoint real em memória
    ○ skipped retoma slide-1 na bancada única e normaliza o checkpoint persistido
    ○ skipped retoma slide-2 na bancada única e normaliza o checkpoint persistido
    ○ skipped retoma slide-3 na bancada única e normaliza o checkpoint persistido
    ○ skipped não duplica onFinish enquanto a conclusão assíncrona do checkpoint ainda espera

  ● WelcomeFlowScreen — primeira bancada › ao ajustar para 65 kV, muda a faixa e os números usados no shader

    expect(received).toMatchObject(expected)

    - Expected  - 2
    + Received  + 2

      Object {
        "background": 0.02,
    -   "bone": 0.9329473428479947,
    +   "bone": 0.9329473428479946,
        "noise": 0.049295030175464945,
    -   "soft": 0.6639430472419544,
    +   "soft": 0.6369564813087103,
      }

      81 |             const after = screen.getByTestId('skia-Shader').props.uniforms;
      82 |             const expected = exposureModel({ kv: kv as number, mas: 10 });
    > 83 |             expect(after).toMatchObject(expected);
         |                           ^
      84 |             expect(after.soft).not.toBe(before.soft);
      85 |             expect(after.bone).toBeCloseTo(before.bone, 12);
      86 |             expect(after.noise).toBe(before.noise);

      at toMatchObject (src/features/first-run/screens/WelcomeFlowScreen.flow.test.tsx:83:27)

  ● WelcomeFlowScreen — primeira bancada › ao ajustar para 70 kV, muda a faixa e os números usados no shader

    expect(received).toMatchObject(expected)

    - Expected  - 1
    + Received  + 1

      Object {
        "background": 0.02,
        "bone": 0.9329473428479946,
        "noise": 0.049295030175464945,
    -   "soft": 0.6889113785949478,
    +   "soft": 0.6369564813087103,
      }

      81 |             const after = screen.getByTestId('skia-Shader').props.uniforms;
      82 |             const expected = exposureModel({ kv: kv as number, mas: 10 });
    > 83 |             expect(after).toMatchObject(expected);
         |                           ^
      84 |             expect(after.soft).not.toBe(before.soft);
      85 |             expect(after.bone).toBeCloseTo(before.bone, 12);
      86 |             expect(after.noise).toBe(before.noise);

      at toMatchObject (src/features/first-run/screens/WelcomeFlowScreen.flow.test.tsx:83:27)

  ● WelcomeFlowScreen — primeira bancada › ao ajustar para 90 kV, muda a faixa e os números usados no shader

    expect(received).toMatchObject(expected)

    - Expected  - 1
    + Received  + 1

      Object {
        "background": 0.02,
        "bone": 0.9329473428479946,
        "noise": 0.049295030175464945,
    -   "soft": 0.7723365546207355,
    +   "soft": 0.6369564813087103,
      }

      81 |             const after = screen.getByTestId('skia-Shader').props.uniforms;
      82 |             const expected = exposureModel({ kv: kv as number, mas: 10 });
    > 83 |             expect(after).toMatchObject(expected);
         |                           ^
      84 |             expect(after.soft).not.toBe(before.soft);
      85 |             expect(after.bone).toBeCloseTo(before.bone, 12);
      86 |             expect(after.noise).toBe(before.noise);

      at toMatchObject (src/features/first-run/screens/WelcomeFlowScreen.flow.test.tsx:83:27)

  ● WelcomeFlowScreen — primeira bancada › ao ajustar para 95 kV, muda a faixa e os números usados no shader

    expect(received).toMatchObject(expected)

    - Expected  - 1
    + Received  + 1

      Object {
        "background": 0.02,
        "bone": 0.9329473428479946,
        "noise": 0.049295030175464945,
    -   "soft": 0.789827582219078,
    +   "soft": 0.6369564813087103,
      }

      81 |             const after = screen.getByTestId('skia-Shader').props.uniforms;
      82 |             const expected = exposureModel({ kv: kv as number, mas: 10 });
    > 83 |             expect(after).toMatchObject(expected);
         |                           ^
      84 |             expect(after.soft).not.toBe(before.soft);
      85 |             expect(after.bone).toBeCloseTo(before.bone, 12);
      86 |             expect(after.noise).toBe(before.noise);

      at toMatchObject (src/features/first-run/screens/WelcomeFlowScreen.flow.test.tsx:83:27)

  ● WelcomeFlowScreen — primeira bancada › ao ajustar para 100 kV, muda a faixa e os números usados no shader

    expect(received).toMatchObject(expected)

    - Expected  - 1
    + Received  + 1

      Object {
        "background": 0.02,
        "bone": 0.9329473428479946,
        "noise": 0.049295030175464945,
    -   "soft": 0.8062123519631298,
    +   "soft": 0.6369564813087103,
      }

      81 |             const after = screen.getByTestId('skia-Shader').props.uniforms;
      82 |             const expected = exposureModel({ kv: kv as number, mas: 10 });
    > 83 |             expect(after).toMatchObject(expected);
         |                           ^
      84 |             expect(after.soft).not.toBe(before.soft);
      85 |             expect(after.bone).toBeCloseTo(before.bone, 12);
      86 |             expect(after.noise).toBe(before.noise);

      at toMatchObject (src/features/first-run/screens/WelcomeFlowScreen.flow.test.tsx:83:27)

Test Suites: 1 failed, 1 total
Tests:       5 failed, 14 skipped, 19 total
Snapshots:   0 total
Time:        5.157 s
Ran all test suites matching /radiant-app\/src\/features\/first-run\/screens\/WelcomeFlowScreen.flow.test.tsx/i with tests matching "ao ajustar para".

```

## cursor atual legado errado

Command: /usr/sbin/taskpolicy -b /Users/anderson/.nvm/versions/node/v20.20.2/bin/node radiant-app/node_modules/jest/bin/jest.js --config radiant-app/jest.config.cjs --runInBand radiant-app/src/features/first-run/screens/WelcomeFlowScreen.flow.test.tsx --testNamePattern 'retoma slide'

Exit 1; source restored SHA-256 932febab5181357208495e216de1c759ffc2023522afc143b7dac314efea6643

```text
FAIL radiant-app/src/features/first-run/screens/WelcomeFlowScreen.flow.test.tsx (6.942 s)
  WelcomeFlowScreen — primeira bancada
    ○ skipped começa em 60 kV, sem paginação, com instrução fora da fala do Pixel
    ○ skipped explica o armazenamento local na plataforma ios
    ○ skipped explica o armazenamento local na plataforma android
    ○ skipped não conclui sem uma mudança real de valor
    ○ skipped ao ajustar para 65 kV, muda a faixa e os números usados no shader
    ○ skipped ao ajustar para 70 kV, muda a faixa e os números usados no shader
    ○ skipped ao ajustar para 90 kV, muda a faixa e os números usados no shader
    ○ skipped ao ajustar para 95 kV, muda a faixa e os números usados no shader
    ○ skipped ao ajustar para 100 kV, muda a faixa e os números usados no shader
    ○ skipped a imagem acompanha o preview contínuo e volta ao valor do passo ao soltar
    ○ skipped botões e ações acessíveis operam a bancada; voltar a 60 mantém Continuar habilitado
    ○ skipped conclui uma vez no passo 1 mesmo com toques repetidos e Pular logo depois
    ○ skipped Pular sai uma vez sem operar a bancada
    ○ skipped avisa apenas o passo único, sem repetir ao ajustar kV
    ○ skipped mantém Pular dentro da safe area e fora da rolagem em viewport curta com texto máximo
  WelcomeFlowScreen — checkpoint real em memória
    ✕ retoma slide-1 na bancada única e normaliza o checkpoint persistido (1080 ms)
    ✕ retoma slide-2 na bancada única e normaliza o checkpoint persistido (1052 ms)
    ✕ retoma slide-3 na bancada única e normaliza o checkpoint persistido (1049 ms)
    ○ skipped não duplica onFinish enquanto a conclusão assíncrona do checkpoint ainda espera

  ● WelcomeFlowScreen — checkpoint real em memória › retoma slide-1 na bancada única e normaliza o checkpoint persistido

    expect(received).toMatchObject(expected)

    - Expected  - 1
    + Received  + 1

      Object {
        "completedStepCount": 0,
    -   "cursorId": "slide-1",
    +   "cursorId": "slide-2",
        "totalStepCount": 1,
      }

      182 |         const fallback = jest.fn();
      183 |         renderWithProviders(<WelcomeFlowScreen onFinish={jest.fn()} resumeCheckpointId="legacy" resumeCursorId={cursorId} onResumeFallback={fallback} />);
    > 184 |         await waitFor(async () => expect(await store.getCheckpointById('legacy')).toMatchObject({ cursorId: 'slide-1', totalStepCount: 1, completedStepCount: 0 }));
          |                      ^
      185 |         expect(screen.getByText('60 kV')).toBeTruthy();
      186 |         expect(fallback).not.toHaveBeenCalled();
      187 |     });

      at src/features/first-run/screens/WelcomeFlowScreen.flow.test.tsx:184:22
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

  ● WelcomeFlowScreen — checkpoint real em memória › retoma slide-2 na bancada única e normaliza o checkpoint persistido

    expect(received).toMatchObject(expected)

    - Expected  - 1
    + Received  + 1

      Object {
        "completedStepCount": 0,
    -   "cursorId": "slide-1",
    +   "cursorId": "slide-2",
        "totalStepCount": 1,
      }

      182 |         const fallback = jest.fn();
      183 |         renderWithProviders(<WelcomeFlowScreen onFinish={jest.fn()} resumeCheckpointId="legacy" resumeCursorId={cursorId} onResumeFallback={fallback} />);
    > 184 |         await waitFor(async () => expect(await store.getCheckpointById('legacy')).toMatchObject({ cursorId: 'slide-1', totalStepCount: 1, completedStepCount: 0 }));
          |                      ^
      185 |         expect(screen.getByText('60 kV')).toBeTruthy();
      186 |         expect(fallback).not.toHaveBeenCalled();
      187 |     });

      at src/features/first-run/screens/WelcomeFlowScreen.flow.test.tsx:184:22
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

  ● WelcomeFlowScreen — checkpoint real em memória › retoma slide-3 na bancada única e normaliza o checkpoint persistido

    expect(received).toMatchObject(expected)

    - Expected  - 1
    + Received  + 1

      Object {
        "completedStepCount": 0,
    -   "cursorId": "slide-1",
    +   "cursorId": "slide-2",
        "totalStepCount": 1,
      }

      182 |         const fallback = jest.fn();
      183 |         renderWithProviders(<WelcomeFlowScreen onFinish={jest.fn()} resumeCheckpointId="legacy" resumeCursorId={cursorId} onResumeFallback={fallback} />);
    > 184 |         await waitFor(async () => expect(await store.getCheckpointById('legacy')).toMatchObject({ cursorId: 'slide-1', totalStepCount: 1, completedStepCount: 0 }));
          |                      ^
      185 |         expect(screen.getByText('60 kV')).toBeTruthy();
      186 |         expect(fallback).not.toHaveBeenCalled();
      187 |     });

      at src/features/first-run/screens/WelcomeFlowScreen.flow.test.tsx:184:22
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

Test Suites: 1 failed, 1 total
Tests:       3 failed, 16 skipped, 19 total
Snapshots:   0 total
Time:        7.388 s
Ran all test suites matching /radiant-app\/src\/features\/first-run\/screens\/WelcomeFlowScreen.flow.test.tsx/i with tests matching "retoma slide".

```

## privacidade com plataforma invertida

Command: /usr/sbin/taskpolicy -b /Users/anderson/.nvm/versions/node/v20.20.2/bin/node radiant-app/node_modules/jest/bin/jest.js --config radiant-app/jest.config.cjs --runInBand radiant-app/src/features/first-run/screens/WelcomeFlowScreen.flow.test.tsx --testNamePattern 'explica o armazenamento'

Exit 1; source restored SHA-256 932febab5181357208495e216de1c759ffc2023522afc143b7dac314efea6643

```text
FAIL radiant-app/src/features/first-run/screens/WelcomeFlowScreen.flow.test.tsx
  WelcomeFlowScreen — primeira bancada
    ✕ explica o armazenamento local na plataforma ios (68 ms)
    ✕ explica o armazenamento local na plataforma android (41 ms)
    ○ skipped começa em 60 kV, sem paginação, com instrução fora da fala do Pixel
    ○ skipped não conclui sem uma mudança real de valor
    ○ skipped ao ajustar para 65 kV, muda a faixa e os números usados no shader
    ○ skipped ao ajustar para 70 kV, muda a faixa e os números usados no shader
    ○ skipped ao ajustar para 90 kV, muda a faixa e os números usados no shader
    ○ skipped ao ajustar para 95 kV, muda a faixa e os números usados no shader
    ○ skipped ao ajustar para 100 kV, muda a faixa e os números usados no shader
    ○ skipped a imagem acompanha o preview contínuo e volta ao valor do passo ao soltar
    ○ skipped botões e ações acessíveis operam a bancada; voltar a 60 mantém Continuar habilitado
    ○ skipped conclui uma vez no passo 1 mesmo com toques repetidos e Pular logo depois
    ○ skipped Pular sai uma vez sem operar a bancada
    ○ skipped avisa apenas o passo único, sem repetir ao ajustar kV
    ○ skipped mantém Pular dentro da safe area e fora da rolagem em viewport curta com texto máximo
  WelcomeFlowScreen — checkpoint real em memória
    ○ skipped retoma slide-1 na bancada única e normaliza o checkpoint persistido
    ○ skipped retoma slide-2 na bancada única e normaliza o checkpoint persistido
    ○ skipped retoma slide-3 na bancada única e normaliza o checkpoint persistido
    ○ skipped não duplica onFinish enquanto a conclusão assíncrona do checkpoint ainda espera

  ● WelcomeFlowScreen — primeira bancada › explica o armazenamento local na plataforma ios

    Unable to find an element with text: Sem conta. Seu progresso fica neste iPhone.

    [36m<RNCSafeAreaProvider>[39m
      [36m<RNCSafeAreaView>[39m
        [36m<View>[39m
          [36m<View[39m
            [33maccessibilityLabel[39m=[32m"Pular apresentação"[39m
            [33maccessibilityRole[39m=[32m"button"[39m
            [33maccessible[39m=[32m{true}[39m
          [36m>[39m
            [36m<Text>[39m
              [0mPular[0m
            [36m</Text>[39m
          [36m</View>[39m
        [36m</View>[39m
        [36m<RCTScrollView>[39m
          [36m<View>[39m
            [36m<View>[39m
              [36m<View[39m
                [33maccessibilityLabel[39m=[32m"Pixel acenando"[39m
                [33maccessibilityRole[39m=[32m"image"[39m
                [33maccessible[39m=[32m{true}[39m
              [36m>[39m
                [36m<View[39m
                  [33mnativeID[39m=[32m"0"[39m
                [36m>[39m
                  [36m<View>[39m
                    [36m<RNSVGSvgView[39m
                      [33maccessibilityElementsHidden[39m=[32m{true}[39m
                      [33mimportantForAccessibility[39m=[32m"no-hide-descendants"[39m
                    [36m>[39m
                      [36m<RNSVGGroup>[39m
                        [36m<RNSVGEllipse />[39m
                        [36m<RNSVGEllipse />[39m
                        [36m<RNSVGEllipse />[39m
                        [36m<RNSVGEllipse />[39m
                        [36m<RNSVGPath />[39m
                        [36m<RNSVGPath />[39m
                        [36m<RNSVGPath />[39m
                        [36m<RNSVGGroup>[39m
                          [36m<RNSVGRect />[39m
                          [36m<RNSVGRect />[39m
                          [36m<RNSVGRect />[39m
                          [36m<RNSVGRect />[39m
                        [36m</RNSVGGroup>[39m
                        [36m<RNSVGPath />[39m
                        [36m<RNSVGPath />[39m
                        [36m<RNSVGPath />[39m
                        [36m<RNSVGPath />[39m
                        [36m<RNSVGPath />[39m
                        [36m<RNSVGPath />[39m
                        [36m<RNSVGPath />[39m
                        [36m<RNSVGRect />[39m
                        [36m<RNSVGRect />[39m
                        [36m<RNSVGCircle />[39m
                        [36m<RNSVGCircle />[39m
                        [36m<RNSVGPath />[39m
                        [36m<RNSVGPath />[39m
                        [36m<RNSVGCircle />[39m
                        [36m<RNSVGCircle />[39m
                        [36m<RNSVGCircle />[39m
                        [36m<RNSVGGroup[39m
                          [33mtestID[39m=[32m"pixel-right-arm"[39m
                        [36m>[39m
                          [36m<RNSVGPath />[39m
                          [36m<RNSVGPath />[39m
                          [36m<RNSVGPath />[39m
                          [36m<RNSVGGroup>[39m
                            [36m<RNSVGRect />[39m
                            [36m<RNSVGRect />[39m
                            [36m<RNSVGRect />[39m
                            [36m<RNSVGRect />[39m
                          [36m</RNSVGGroup>[39m
                        [36m</RNSVGGroup>[39m
                        [36m<RNSVGRect />[39m
                        [36m<RNSVGRect />[39m
                        [36m<RNSVGEllipse />[39m
                        [36m<RNSVGCircle />[39m
                        [36m<RNSVGCircle />[39m
                        [36m<RNSVGCircle />[39m
                        [36m<RNSVGCircle />[39m
                        [36m<RNSVGCircle />[39m
                        [36m<RNSVGCircle />[39m
                        [36m<RNSVGCircle />[39m
                        [36m<RNSVGRect />[39m
                        [36m<RNSVGRect />[39m
                        [36m<RNSVGPath />[39m
                        [36m<RNSVGRect />[39m
                        [36m<RNSVGPath />[39m
                      [36m</RNSVGGroup>[39m
                    [36m</RNSVGSvgView>[39m
                    [36m<View[39m
                      [33mpointerEvents[39m=[32m"none"[39m
                    [36m>[39m
                      [36m<View[39m
                        [33mnativeID[39m=[32m"2"[39m
                      [36m/>[39m
                      [36m<View[39m
                        [33mnativeID[39m=[32m"3"[39m
                      [36m/>[39m
                      [36m<RNSVGSvgView>[39m
                        [36m<RNSVGGroup>[39m
                          [36m<RNSVGPath />[39m
                          [36m<RNSVGPath />[39m
                          [36m<RNSVGPath />[39m
                        [36m</RNSVGGroup>[39m
                      [36m</RNSVGSvgView>[39m
                    [36m</View>[39m
                  [36m</View>[39m
                [36m</View>[39m
              [36m</View>[39m
              [36m<Text>[39m
                [0mOi, eu sou o Pixel. Vamos tirar sua primeira radiografia.[0m
              [36m</Text>[39m
            [36m</View>[39m
            [36m<Text>[39m
              [0mAjuste o kV e veja a imagem mudar.[0m
            [36m</Text>[39m
            [36m<View>[39m
              [36m<View[39m
                [33maccessibilityLabel[39m=[32m"Radiografia simulada de um fantoma"[39m
                [33maccessibilityRole[39m=[32m"image"[39m
                [33maccessible[39m=[32m{true}[39m
              [36m>[39m
                [36m<View[39m
                  [33mtestID[39m=[32m"skia-Canvas"[39m
                [36m>[39m
                  [36m<View[39m
                    [33mtestID[39m=[32m"skia-Fill"[39m
                  [36m>[39m
                    [36m<View[39m
                      [33mtestID[39m=[32m"skia-Shader"[39m
                    [36m/>[39m
                  [36m</View>[39m
                [36m</View>[39m
              [36m</View>[39m
            [36m</View>[39m
            [36m<View>[39m
              [36m<View>[39m
                [36m<Text>[39m
                  [0mkV[0m
                [36m</Text>[39m
                [36m<Text>[39m
                  [0m60 kV[0m
                [36m</Text>[39m
              [36m</View>[39m
              [36m<View>[39m
                [36m<View[39m
                  [33maccessibilityHint[39m=[32m"Tira um passo de 5 kV."[39m
                  [33maccessibilityLabel[39m=[32m"Diminuir kV"[39m
                  [33maccessibilityRole[39m=[32m"button"[39m
                  [33maccessibilityState[39m=[32m{
                    {
                      "disabled": false,
                    }
                  }[39m
                  [33maccessible[39m=[32m{true}[39m
                [36m>[39m
                  [36m<Text>[39m
                    [0m−[0m
                  [36m</Text>[39m
                [36m</View>[39m
                [36m<View[39m
                  [33maccessibilityLabel[39m=[32m"kV"[39m
                  [33maccessibilityRole[39m=[32m"adjustable"[39m
                  [33maccessibilityState[39m=[32m{
                    {
                      "disabled": false,
                    }
                  }[39m
                  [33maccessibilityValue[39m=[32m{
                    {
                      "max": 120,
                      "min": 40,
                      "now": 60,
                      "text": "60 kV",
                    }
                  }[39m
                  [33maccessible[39m=[32m{true}[39m
                [36m>[39m
                  [36m<View>[39m
                    [36m<RNCSlider[39m
                      [33maccessibilityElementsHidden[39m=[32m{true}[39m
                      [33maccessibilityState[39m=[32m{
                        {
                          "disabled": false,
                        }
                      }[39m
                      [33mimportantForAccessibility[39m=[32m"no-hide-descendants"[39m
                      [33mtestID[39m=[32m"bench-slider-kv"[39m
                      [33mvalue[39m=[32m{60}[39m
                    [36m/>[39m
                  [36m</View>[39m
                [36m</View>[39m
                [36m<View[39m
                  [33maccessibilityHint[39m=[32m"Soma um passo de 5 kV."[39m
                  [33maccessibilityLabel[39m=[32m"Aumentar kV"[39m
                  [33maccessibilityRole[39m=[32m"button"[39m
                  [33maccessibilityState[39m=[32m{
                    {
                      "disabled": false,
                    }
                  }[39m
                  [33maccessible[39m=[32m{true}[39m
                [36m>[39m
                  [36m<Text>[39m
                    [0m+[0m
                  [36m</Text>[39m
                [36m</View>[39m
              [36m</View>[39m
            [36m</View>[39m
            [36m<Text>[39m
              [0mOsso branco, partes moles escuras: muito contraste.[0m
            [36m</Text>[39m
            [36m<Text>[39m
              [0mRadiant é um app educacional. Não substitui avaliação, diagnóstico ou conduta médica profissional.[0m
            [36m</Text>[39m
          [36m</View>[39m
        [36m</RCTScrollView>[39m
        [36m<View>[39m
          [36m<View>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"app-button-relief"[39m
            [36m>[39m
              [36m<View[39m
                [33mpointerEvents[39m=[32m"none"[39m
                [33mtestID[39m=[32m"app-button-lip"[39m
              [36m/>[39m
              [36m<View[39m
                [33maccessibilityLabel[39m=[32m"Continuar"[39m
                [33maccessibilityRole[39m=[32m"button"[39m
                [33maccessibilityState[39m=[32m{
                  {
                    "busy": false,
                    "disabled": true,
                  }
                }[39m
                [33maccessible[39m=[32m{true}[39m
                [33mnativeID[39m=[32m"7"[39m
                [33mtestID[39m=[32m"app-button-face"[39m
              [36m>[39m
                [36m<Text>[39m
                  [0mContinuar[0m
                [36m</Text>[39m
              [36m</View>[39m
            [36m</View>[39m
          [36m</View>[39m
          [36m<Text>[39m
            [0mSem conta. Seu progresso fica neste aparelho.[0m
          [36m</Text>[39m
        [36m</View>[39m
      [36m</RNCSafeAreaView>[39m
    [36m</RNCSafeAreaProvider>[39m

      58 |             try {
      59 |                 renderWithProviders(<WelcomeFlowScreen onFinish={jest.fn()} />);
    > 60 |                 expect(screen.getByText(privacy)).toBeTruthy();
         |                               ^
      61 |             } finally { Object.defineProperty(Platform, 'OS', { value: original, configurable: true }); }
      62 |         },
      63 |     );

      at getByText (src/features/first-run/screens/WelcomeFlowScreen.flow.test.tsx:60:31)

  ● WelcomeFlowScreen — primeira bancada › explica o armazenamento local na plataforma android

    Unable to find an element with text: Sem conta. Seu progresso fica neste aparelho.

    [36m<RNCSafeAreaProvider>[39m
      [36m<RNCSafeAreaView>[39m
        [36m<View>[39m
          [36m<View[39m
            [33maccessibilityLabel[39m=[32m"Pular apresentação"[39m
            [33maccessibilityRole[39m=[32m"button"[39m
            [33maccessible[39m=[32m{true}[39m
          [36m>[39m
            [36m<Text>[39m
              [0mPular[0m
            [36m</Text>[39m
          [36m</View>[39m
        [36m</View>[39m
        [36m<RCTScrollView>[39m
          [36m<View>[39m
            [36m<View>[39m
              [36m<View[39m
                [33maccessibilityLabel[39m=[32m"Pixel acenando"[39m
                [33maccessibilityRole[39m=[32m"image"[39m
                [33maccessible[39m=[32m{true}[39m
              [36m>[39m
                [36m<View[39m
                  [33mnativeID[39m=[32m"8"[39m
                [36m>[39m
                  [36m<View>[39m
                    [36m<RNSVGSvgViewAndroid[39m
                      [33maccessibilityElementsHidden[39m=[32m{true}[39m
                      [33mimportantForAccessibility[39m=[32m"no-hide-descendants"[39m
                    [36m>[39m
                      [36m<RNSVGGroup>[39m
                        [36m<RNSVGEllipse />[39m
                        [36m<RNSVGEllipse />[39m
                        [36m<RNSVGEllipse />[39m
                        [36m<RNSVGEllipse />[39m
                        [36m<RNSVGPath />[39m
                        [36m<RNSVGPath />[39m
                        [36m<RNSVGPath />[39m
                        [36m<RNSVGGroup>[39m
                          [36m<RNSVGRect />[39m
                          [36m<RNSVGRect />[39m
                          [36m<RNSVGRect />[39m
                          [36m<RNSVGRect />[39m
                        [36m</RNSVGGroup>[39m
                        [36m<RNSVGPath />[39m
                        [36m<RNSVGPath />[39m
                        [36m<RNSVGPath />[39m
                        [36m<RNSVGPath />[39m
                        [36m<RNSVGPath />[39m
                        [36m<RNSVGPath />[39m
                        [36m<RNSVGPath />[39m
                        [36m<RNSVGRect />[39m
                        [36m<RNSVGRect />[39m
                        [36m<RNSVGCircle />[39m
                        [36m<RNSVGCircle />[39m
                        [36m<RNSVGPath />[39m
                        [36m<RNSVGPath />[39m
                        [36m<RNSVGCircle />[39m
                        [36m<RNSVGCircle />[39m
                        [36m<RNSVGCircle />[39m
                        [36m<RNSVGGroup[39m
                          [33mtestID[39m=[32m"pixel-right-arm"[39m
                        [36m>[39m
                          [36m<RNSVGPath />[39m
                          [36m<RNSVGPath />[39m
                          [36m<RNSVGPath />[39m
                          [36m<RNSVGGroup>[39m
                            [36m<RNSVGRect />[39m
                            [36m<RNSVGRect />[39m
                            [36m<RNSVGRect />[39m
                            [36m<RNSVGRect />[39m
                          [36m</RNSVGGroup>[39m
                        [36m</RNSVGGroup>[39m
                        [36m<RNSVGRect />[39m
                        [36m<RNSVGRect />[39m
                        [36m<RNSVGEllipse />[39m
                        [36m<RNSVGCircle />[39m
                        [36m<RNSVGCircle />[39m
                        [36m<RNSVGCircle />[39m
                        [36m<RNSVGCircle />[39m
                        [36m<RNSVGCircle />[39m
                        [36m<RNSVGCircle />[39m
                        [36m<RNSVGCircle />[39m
                        [36m<RNSVGRect />[39m
                        [36m<RNSVGRect />[39m
                        [36m<RNSVGPath />[39m
                        [36m<RNSVGRect />[39m
                        [36m<RNSVGPath />[39m
                      [36m</RNSVGGroup>[39m
                    [36m</RNSVGSvgViewAndroid>[39m
                    [36m<View[39m
                      [33mpointerEvents[39m=[32m"none"[39m
                    [36m>[39m
                      [36m<View[39m
                        [33mnativeID[39m=[32m"10"[39m
                      [36m/>[39m
                      [36m<View[39m
                        [33mnativeID[39m=[32m"11"[39m
                      [36m/>[39m
                      [36m<RNSVGSvgViewAndroid>[39m
                        [36m<RNSVGGroup>[39m
                          [36m<RNSVGPath />[39m
                          [36m<RNSVGPath />[39m
                          [36m<RNSVGPath />[39m
                        [36m</RNSVGGroup>[39m
                      [36m</RNSVGSvgViewAndroid>[39m
                    [36m</View>[39m
                  [36m</View>[39m
                [36m</View>[39m
              [36m</View>[39m
              [36m<Text>[39m
                [0mOi, eu sou o Pixel. Vamos tirar sua primeira radiografia.[0m
              [36m</Text>[39m
            [36m</View>[39m
            [36m<Text>[39m
              [0mAjuste o kV e veja a imagem mudar.[0m
            [36m</Text>[39m
            [36m<View>[39m
              [36m<View[39m
                [33maccessibilityLabel[39m=[32m"Radiografia simulada de um fantoma"[39m
                [33maccessibilityRole[39m=[32m"image"[39m
                [33maccessible[39m=[32m{true}[39m
              [36m>[39m
                [36m<View[39m
                  [33mtestID[39m=[32m"skia-Canvas"[39m
                [36m>[39m
                  [36m<View[39m
                    [33mtestID[39m=[32m"skia-Fill"[39m
                  [36m>[39m
                    [36m<View[39m
                      [33mtestID[39m=[32m"skia-Shader"[39m
                    [36m/>[39m
                  [36m</View>[39m
                [36m</View>[39m
              [36m</View>[39m
            [36m</View>[39m
            [36m<View>[39m
              [36m<View>[39m
                [36m<Text>[39m
                  [0mkV[0m
                [36m</Text>[39m
                [36m<Text>[39m
                  [0m60 kV[0m
                [36m</Text>[39m
              [36m</View>[39m
              [36m<View>[39m
                [36m<View[39m
                  [33maccessibilityHint[39m=[32m"Tira um passo de 5 kV."[39m
                  [33maccessibilityLabel[39m=[32m"Diminuir kV"[39m
                  [33maccessibilityRole[39m=[32m"button"[39m
                  [33maccessibilityState[39m=[32m{
                    {
                      "disabled": false,
                    }
                  }[39m
                  [33maccessible[39m=[32m{true}[39m
                [36m>[39m
                  [36m<Text>[39m
                    [0m−[0m
                  [36m</Text>[39m
                [36m</View>[39m
                [36m<View[39m
                  [33maccessibilityLabel[39m=[32m"kV"[39m
                  [33maccessibilityRole[39m=[32m"adjustable"[39m
                  [33maccessibilityState[39m=[32m{
                    {
                      "disabled": false,
                    }
                  }[39m
                  [33maccessibilityValue[39m=[32m{
                    {
                      "max": 120,
                      "min": 40,
                      "now": 60,
                      "text": "60 kV",
                    }
                  }[39m
                  [33maccessible[39m=[32m{true}[39m
                [36m>[39m
                  [36m<View>[39m
                    [36m<RNCSlider[39m
                      [33maccessibilityElementsHidden[39m=[32m{true}[39m
                      [33maccessibilityState[39m=[32m{
                        {
                          "disabled": false,
                        }
                      }[39m
                      [33mimportantForAccessibility[39m=[32m"no-hide-descendants"[39m
                      [33mtestID[39m=[32m"bench-slider-kv"[39m
                      [33mvalue[39m=[32m{60}[39m
                    [36m/>[39m
                  [36m</View>[39m
                [36m</View>[39m
                [36m<View[39m
                  [33maccessibilityHint[39m=[32m"Soma um passo de 5 kV."[39m
                  [33maccessibilityLabel[39m=[32m"Aumentar kV"[39m
                  [33maccessibilityRole[39m=[32m"button"[39m
                  [33maccessibilityState[39m=[32m{
                    {
                      "disabled": false,
                    }
                  }[39m
                  [33maccessible[39m=[32m{true}[39m
                [36m>[39m
                  [36m<Text>[39m
                    [0m+[0m
                  [36m</Text>[39m
                [36m</View>[39m
              [36m</View>[39m
            [36m</View>[39m
            [36m<Text>[39m
              [0mOsso branco, partes moles escuras: muito contraste.[0m
            [36m</Text>[39m
            [36m<Text>[39m
              [0mRadiant é um app educacional. Não substitui avaliação, diagnóstico ou conduta médica profissional.[0m
            [36m</Text>[39m
          [36m</View>[39m
        [36m</RCTScrollView>[39m
        [36m<View>[39m
          [36m<View>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"app-button-relief"[39m
            [36m>[39m
              [36m<View[39m
                [33mpointerEvents[39m=[32m"none"[39m
                [33mtestID[39m=[32m"app-button-lip"[39m
              [36m/>[39m
              [36m<View[39m
                [33maccessibilityLabel[39m=[32m"Continuar"[39m
                [33maccessibilityRole[39m=[32m"button"[39m
                [33maccessibilityState[39m=[32m{
                  {
                    "busy": false,
                    "disabled": true,
                  }
                }[39m
                [33maccessible[39m=[32m{true}[39m
                [33mnativeID[39m=[32m"15"[39m
                [33mtestID[39m=[32m"app-button-face"[39m
              [36m>[39m
                [36m<Text>[39m
                  [0mContinuar[0m
                [36m</Text>[39m
              [36m</View>[39m
            [36m</View>[39m
          [36m</View>[39m
          [36m<Text>[39m
            [0mSem conta. Seu progresso fica neste iPhone.[0m
          [36m</Text>[39m
        [36m</View>[39m
      [36m</RNCSafeAreaView>[39m
    [36m</RNCSafeAreaProvider>[39m

      58 |             try {
      59 |                 renderWithProviders(<WelcomeFlowScreen onFinish={jest.fn()} />);
    > 60 |                 expect(screen.getByText(privacy)).toBeTruthy();
         |                               ^
      61 |             } finally { Object.defineProperty(Platform, 'OS', { value: original, configurable: true }); }
      62 |         },
      63 |     );

      at getByText (src/features/first-run/screens/WelcomeFlowScreen.flow.test.tsx:60:31)

Test Suites: 1 failed, 1 total
Tests:       2 failed, 17 skipped, 19 total
Snapshots:   0 total
Time:        4.395 s, estimated 7 s
Ran all test suites matching /radiant-app\/src\/features\/first-run\/screens\/WelcomeFlowScreen.flow.test.tsx/i with tests matching "explica o armazenamento".

```

## replay sobrescreve marker

Command: /usr/sbin/taskpolicy -b /Users/anderson/.nvm/versions/node/v20.20.2/bin/node radiant-app/node_modules/jest/bin/jest.js --config radiant-app/jest.config.cjs --runInBand radiant-app/src/features/first-run/screens/WelcomeFlowReentry.test.tsx --testNamePattern 'no replay fecha'

Exit 1; source restored SHA-256 932febab5181357208495e216de1c759ffc2023522afc143b7dac314efea6643

```text
FAIL radiant-app/src/features/first-run/screens/WelcomeFlowReentry.test.tsx
  Rever apresentação — consumidor real de Configuração
    ✕ pular no replay fecha o modal sem reescrever o marcador anterior (272 ms)
    ✕ concluir no replay fecha o modal sem reescrever o marcador anterior (184 ms)

  ● Rever apresentação — consumidor real de Configuração › pular no replay fecha o modal sem reescrever o marcador anterior

    expect(received).toBe(expected) // Object.is equality

    Expected: "{\"seenAt\":100,\"exitedAt\":200,\"exitReason\":\"completed\",\"exitStep\":3}"
    Received: "replay overwrite"

      64 |         expect(screen.getByRole('header', { name: 'Configuração' })).toBeTruthy();
      65 |         expect(markSeen).not.toHaveBeenCalled();
    > 66 |         expect(await AsyncStorage.getItem(KEY)).toBe(ORIGINAL_MARKER);
         |                                                 ^
      67 |         expect(FirstRunService.shouldShowWelcome()).toBe(false);
      68 |         fireEvent.press(screen.getByRole('button', { name: 'Rever apresentação' }));
      69 |         expect(screen.getByText('60 kV')).toBeTruthy();

      at toBe (src/features/first-run/screens/WelcomeFlowReentry.test.tsx:66:49)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

  ● Rever apresentação — consumidor real de Configuração › concluir no replay fecha o modal sem reescrever o marcador anterior

    expect(received).toBe(expected) // Object.is equality

    Expected: "{\"seenAt\":100,\"exitedAt\":200,\"exitReason\":\"completed\",\"exitStep\":3}"
    Received: "replay overwrite"

      64 |         expect(screen.getByRole('header', { name: 'Configuração' })).toBeTruthy();
      65 |         expect(markSeen).not.toHaveBeenCalled();
    > 66 |         expect(await AsyncStorage.getItem(KEY)).toBe(ORIGINAL_MARKER);
         |                                                 ^
      67 |         expect(FirstRunService.shouldShowWelcome()).toBe(false);
      68 |         fireEvent.press(screen.getByRole('button', { name: 'Rever apresentação' }));
      69 |         expect(screen.getByText('60 kV')).toBeTruthy();

      at toBe (src/features/first-run/screens/WelcomeFlowReentry.test.tsx:66:49)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

Test Suites: 1 failed, 1 total
Tests:       2 failed, 2 total
Snapshots:   0 total
Time:        4.91 s
Ran all test suites matching /radiant-app\/src\/features\/first-run\/screens\/WelcomeFlowReentry.test.tsx/i with tests matching "no replay fecha".

```

## Continuar exposto habilitado sem interação

Command: /usr/sbin/taskpolicy -b /Users/anderson/.nvm/versions/node/v20.20.2/bin/node radiant-app/node_modules/jest/bin/jest.js --config radiant-app/jest.config.cjs --runInBand radiant-app/src/features/first-run/screens/WelcomeFlowScreen.flow.test.tsx --testNamePattern 'começa em 60 kV|não conclui sem'

Exit 1; source restored SHA-256 932febab5181357208495e216de1c759ffc2023522afc143b7dac314efea6643

```text
FAIL radiant-app/src/features/first-run/screens/WelcomeFlowScreen.flow.test.tsx
  WelcomeFlowScreen — primeira bancada
    ✕ começa em 60 kV, sem paginação, com instrução fora da fala do Pixel (76 ms)
    ✕ não conclui sem uma mudança real de valor (136 ms)
    ○ skipped explica o armazenamento local na plataforma ios
    ○ skipped explica o armazenamento local na plataforma android
    ○ skipped ao ajustar para 65 kV, muda a faixa e os números usados no shader
    ○ skipped ao ajustar para 70 kV, muda a faixa e os números usados no shader
    ○ skipped ao ajustar para 90 kV, muda a faixa e os números usados no shader
    ○ skipped ao ajustar para 95 kV, muda a faixa e os números usados no shader
    ○ skipped ao ajustar para 100 kV, muda a faixa e os números usados no shader
    ○ skipped a imagem acompanha o preview contínuo e volta ao valor do passo ao soltar
    ○ skipped botões e ações acessíveis operam a bancada; voltar a 60 mantém Continuar habilitado
    ○ skipped conclui uma vez no passo 1 mesmo com toques repetidos e Pular logo depois
    ○ skipped Pular sai uma vez sem operar a bancada
    ○ skipped avisa apenas o passo único, sem repetir ao ajustar kV
    ○ skipped mantém Pular dentro da safe area e fora da rolagem em viewport curta com texto máximo
  WelcomeFlowScreen — checkpoint real em memória
    ○ skipped retoma slide-1 na bancada única e normaliza o checkpoint persistido
    ○ skipped retoma slide-2 na bancada única e normaliza o checkpoint persistido
    ○ skipped retoma slide-3 na bancada única e normaliza o checkpoint persistido
    ○ skipped não duplica onFinish enquanto a conclusão assíncrona do checkpoint ainda espera

  ● WelcomeFlowScreen — primeira bancada › começa em 60 kV, sem paginação, com instrução fora da fala do Pixel

    expect(element).toBeDisabled()

    Received element is not disabled:
      [36m<View[39m
        [33maccessibilityLabel[39m=[32m"Continuar"[39m
        [33maccessibilityRole[39m=[32m"button"[39m
        [33maccessibilityState[39m=[32m{
          {
            "busy": false,
            "disabled": false,
          }
        }[39m
        [33maccessible[39m=[32m{true}[39m
        [33mnativeID[39m=[32m"7"[39m
        [33mtestID[39m=[32m"app-button-face"[39m
      [36m/>[39m

      47 |         expect(screen.getByText('Ajuste o kV e veja a imagem mudar.')).toBeTruthy();
      48 |         expect(screen.queryByLabelText(/Tela \d de/)).toBeNull();
    > 49 |         expect(screen.getByLabelText('Continuar')).toBeDisabled();
         |                                                    ^
      50 |         expect(screen.getByLabelText('Pular apresentação')).not.toBeDisabled();
      51 |         expect(screen.getByText(LEGAL)).toBeTruthy();
      52 |     });

      at Object.toBeDisabled (src/features/first-run/screens/WelcomeFlowScreen.flow.test.tsx:49:52)

  ● WelcomeFlowScreen — primeira bancada › não conclui sem uma mudança real de valor

    expect(element).toBeDisabled()

    Received element is not disabled:
      [36m<View[39m
        [33maccessibilityLabel[39m=[32m"Continuar"[39m
        [33maccessibilityRole[39m=[32m"button"[39m
        [33maccessibilityState[39m=[32m{
          {
            "busy": false,
            "disabled": false,
          }
        }[39m
        [33maccessible[39m=[32m{true}[39m
        [33mnativeID[39m=[32m"15"[39m
        [33mtestID[39m=[32m"app-button-face"[39m
      [36m/>[39m

      69 |         fireEvent.press(screen.getByLabelText('Continuar'));
      70 |         expect(onFinish).not.toHaveBeenCalled();
    > 71 |         expect(screen.getByLabelText('Continuar')).toBeDisabled();
         |                                                    ^
      72 |     });
      73 |
      74 |     it.each([[65, LOW], [70, MIDDLE], [90, MIDDLE], [95, HIGH], [100, HIGH]])(

      at Object.toBeDisabled (src/features/first-run/screens/WelcomeFlowScreen.flow.test.tsx:71:52)

Test Suites: 1 failed, 1 total
Tests:       2 failed, 17 skipped, 19 total
Snapshots:   0 total
Time:        4.558 s
Ran all test suites matching /radiant-app\/src\/features\/first-run\/screens\/WelcomeFlowScreen.flow.test.tsx/i with tests matching "começa em 60 kV|não conclui sem".

```

## Aviso em constante órfã não satisfaz contrato AST

Command: /Users/anderson/.nvm/versions/node/v20.20.2/bin/node --test --test-name-pattern=ties the single welcome bench radiant-app/scripts/maestro-contract.test.mjs
Exit 1; source restored SHA-256 932febab5181357208495e216de1c759ffc2023522afc143b7dac314efea6643

```text
TAP version 13
# Subtest: reward-locked.yaml reaches the reward status through a bounded accessibility-label scroll
ok 1 - reward-locked.yaml reaches the reward status through a bounded accessibility-label scroll # SKIP test name does not match pattern
  ---
  duration_ms: 0.444917
  ...
# Subtest: reward-unlock.yaml reaches the reward status through a bounded accessibility-label scroll
ok 2 - reward-unlock.yaml reaches the reward status through a bounded accessibility-label scroll # SKIP test name does not match pattern
  ---
  duration_ms: 0.039625
  ...
# Subtest: navigation flows match the accessible journey header, not its hidden count
ok 3 - navigation flows match the accessible journey header, not its hidden count # SKIP test name does not match pattern
  ---
  duration_ms: 0.028333
  ...
# Subtest: navigation flows wait for the dev client after every launch and relaunch
ok 4 - navigation flows wait for the dev client after every launch and relaunch # SKIP test name does not match pattern
  ---
  duration_ms: 0.066083
  ...
# Subtest: keeps Maestro discovery explicit and artifact output untracked
ok 5 - keeps Maestro discovery explicit and artifact output untracked # SKIP test name does not match pattern
  ---
  duration_ms: 0.038417
  ...
# Subtest: keeps each shipped flow tied to the installed mobile identifier
ok 6 - keeps each shipped flow tied to the installed mobile identifier # SKIP test name does not match pattern
  ---
  duration_ms: 0.025167
  ...
# Subtest: centers the recommendation header action before each native tap
ok 7 - centers the recommendation header action before each native tap # SKIP test name does not match pattern
  ---
  duration_ms: 0.024625
  ...
# Subtest: centers the due review node before the second-day tap
ok 8 - centers the due review node before the second-day tap # SKIP test name does not match pattern
  ---
  duration_ms: 0.026416
  ...
# Subtest: exposes the scheduled review before the final second-day assertion
ok 9 - exposes the scheduled review before the final second-day assertion # SKIP test name does not match pattern
  ---
  duration_ms: 0.068084
  ...
# Subtest: centers every completed lesson replay above the HUD in the lives flow
ok 10 - centers every completed lesson replay above the HUD in the lives flow # SKIP test name does not match pattern
  ---
  duration_ms: 0.0705
  ...
# Subtest: keeps the critical path walking lesson to lesson on the CTA the home renders for a lesson
ok 11 - keeps the critical path walking lesson to lesson on the CTA the home renders for a lesson # SKIP test name does not match pattern
  ---
  duration_ms: 0.035292
  ...
# Subtest: native learning flows confirm selected multiple-choice answers with the explicit action
ok 12 - native learning flows confirm selected multiple-choice answers with the explicit action # SKIP test name does not match pattern
  ---
  duration_ms: 0.026416
  ...
# Subtest: keeps icon glyphs out of the accessibility tree
ok 13 - keeps icon glyphs out of the accessibility tree # SKIP test name does not match pattern
  ---
  duration_ms: 0.02275
  ...
# Subtest: keeps the journey trail on the dark galaxy theme it renders inside
ok 14 - keeps the journey trail on the dark galaxy theme it renders inside # SKIP test name does not match pattern
  ---
  duration_ms: 0.067
  ...
# Subtest: never lets a route fall back to the native header
ok 15 - never lets a route fall back to the native header # SKIP test name does not match pattern
  ---
  duration_ms: 0.026041
  ...
# Subtest: keeps the e2e build local-first and bypasses the beta gate
ok 16 - keeps the e2e build local-first and bypasses the beta gate # SKIP test name does not match pattern
  ---
  duration_ms: 0.080416
  ...
# Subtest: keeps active checkpoints confined to the dedicated internal profile
ok 17 - keeps active checkpoints confined to the dedicated internal profile # SKIP test name does not match pattern
  ---
  duration_ms: 0.0285
  ...
# Subtest: every EAS build profile disables the Sentry source map upload, inheritance resolved
ok 18 - every EAS build profile disables the Sentry source map upload, inheritance resolved # SKIP test name does not match pattern
  ---
  duration_ms: 0.1055
  ...
# Subtest: keeps the active and baseline performance flows on the same cold-start and Home-to-Lesson path
ok 19 - keeps the active and baseline performance flows on the same cold-start and Home-to-Lesson path # SKIP test name does not match pattern
  ---
  duration_ms: 0.04075
  ...
# Subtest: keeps lesson-answer selectors accessible and deterministic
ok 20 - keeps lesson-answer selectors accessible and deterministic # SKIP test name does not match pattern
  ---
  duration_ms: 0.082667
  ...
# Subtest: ties the single welcome bench and resume flows to rendered copy and a real kV change
not ok 21 - ties the single welcome bench and resume flows to rendered copy and a real kV change
  ---
  duration_ms: 14.321875
  location: '/Users/anderson/Developer/Radiant/.claude/worktrees/trilha-2026-10-20/radiant-app/scripts/maestro-contract.test.mjs:736:1'
  failureType: 'testCodeFailure'
  error: 'expected copy actually consumed by welcome JSX'
  code: 'ERR_ASSERTION'
  name: 'AssertionError'
  expected: true
  operator: '=='
  stack: |-
    TestContext.<anonymous> (file:///Users/anderson/Developer/Radiant/.claude/worktrees/trilha-2026-10-20/radiant-app/scripts/maestro-contract.test.mjs:751:10)
    async Test.run (node:internal/test_runner/test:797:9)
    async Test.processPendingSubtests (node:internal/test_runner/test:526:7)
  ...
# Subtest: requires dated per-platform device evidence before any e2e pass is claimed
ok 22 - requires dated per-platform device evidence before any e2e pass is claimed # SKIP test name does not match pattern
  ---
  duration_ms: 0.348625
  ...
# Subtest: makes every scroll-until-visible wait for the screen it is about to scroll
ok 23 - makes every scroll-until-visible wait for the screen it is about to scroll # SKIP test name does not match pattern
  ---
  duration_ms: 0.025458
  ...
# Subtest: lists exactly the flows that scroll until an element is visible
ok 24 - lists exactly the flows that scroll until an element is visible # SKIP test name does not match pattern
  ---
  duration_ms: 0.020584
  ...
# Subtest: makes every scroll-until-visible state the visibility bar it is measured by
ok 25 - makes every scroll-until-visible state the visibility bar it is measured by # SKIP test name does not match pattern
  ---
  duration_ms: 0.016167
  ...
# Subtest: never lets a scroll-until-visible hide behind a visibility guard
ok 26 - never lets a scroll-until-visible hide behind a visibility guard # SKIP test name does not match pattern
  ---
  duration_ms: 0.016667
  ...
# Subtest: rating flow completes the current review caller and preserves the native dialog
ok 27 - rating flow completes the current review caller and preserves the native dialog # SKIP test name does not match pattern
  ---
  duration_ms: 0.015333
  ...
# Subtest: preserves rating eligibility prerequisites and the native dialog assertion
ok 28 - preserves rating eligibility prerequisites and the native dialog assertion # SKIP test name does not match pattern
  ---
  duration_ms: 0.017
  ...
# Subtest: ties the locked-reward flow to the node id the app actually builds
ok 29 - ties the locked-reward flow to the node id the app actually builds # SKIP test name does not match pattern
  ---
  duration_ms: 0.016042
  ...
# Subtest: keeps the unlock-rule flow walking the whole track the catalog declares
ok 30 - keeps the unlock-rule flow walking the whole track the catalog declares # SKIP test name does not match pattern
  ---
  duration_ms: 0.027667
  ...
# Subtest: escapes every "?" in every selector of every flow
ok 31 - escapes every "?" in every selector of every flow # SKIP test name does not match pattern
  ---
  duration_ms: 0.014917
  ...
# Subtest: keeps one visibility bar per selector across every flow
ok 32 - keeps one visibility bar per selector across every flow # SKIP test name does not match pattern
  ---
  duration_ms: 0.057792
  ...
# Subtest: ties the three 1.4 golden paths to the rules and copy they exist to exercise
ok 33 - ties the three 1.4 golden paths to the rules and copy they exist to exercise # SKIP test name does not match pattern
  ---
  duration_ms: 0.073667
  ...
# Subtest: vidas-esgotadas: the last heart lost on the final retry completes the lesson; the next session pauses before the retry counts
ok 34 - vidas-esgotadas: the last heart lost on the final retry completes the lesson; the next session pauses before the retry counts # SKIP test name does not match pattern
  ---
  duration_ms: 0.016083
  ...
# Subtest: M1-M8 all eight lesson-answer flows exercise every catalog item and its inline feedback
ok 35 - M1-M8 all eight lesson-answer flows exercise every catalog item and its inline feedback # SKIP test name does not match pattern
  ---
  duration_ms: 0.01525
  ...
# Subtest: launches every flow with the launch argument that turns off decorative motion
ok 36 - launches every flow with the launch argument that turns off decorative motion # SKIP test name does not match pattern
  ---
  duration_ms: 0.017208
  ...
# Subtest: never lets a deep link start the app the launch argument did not start
ok 37 - never lets a deep link start the app the launch argument did not start # SKIP test name does not match pattern
  ---
  duration_ms: 0.016917
  ...
1..37
# tests 37
# suites 0
# pass 0
# fail 1
# cancelled 0
# skipped 36
# todo 0
# duration_ms 218.891709

```

# Native fix1 r2 — limite e prova específica

O NONPASS do controlador revelou que a antiga guarda de insets React não media a ancestry nativa do Modal. Ver task-4-native-safearea-nonpass.json. Nova guarda no SettingsScreen real falhou antes do provider com1esperado/0recebido, depois passou com host RNCSafeAreaProvider ancestral real dentro Modal. Red e green reais anexados nos arquivos nominais. Nenhuma injeção nativa adicional; os9mutantes acima pertencem ao SHA932febab histórico.

O legado firstWelcomeDestination foi extraído verbatim antes da nova fixture de comentário: recebeu CORPO FANTASMA em vez de CORPO REAL. Depois de AST,38/38contratos passam. Não foram alterados contratos fora deT03.

Freeze r2 SHA13:
```text
fd687e940ddabac33eea2e00a0a31b86f3cf69b8f61cb1abfcd37f36472c6872  radiant-app/src/features/first-run/screens/WelcomeFlowScreen.tsx
4477c56f658c490daad800d85ac5a9e0d0d6f2689b117cf6833059cdcd6d28e9  radiant-app/src/features/first-run/components/WelcomeSlide.tsx
b2eac7b32ad691724e16f8dc0b5cd87aeb6f84df5cd36a0145445ec37fbcd416  radiant-app/src/features/first-run/screens/WelcomeFlowScreen.flow.test.tsx
4aeb1723a21534cc8c55e20d9c1627e0af53634bc1ff3f9c8e9dc165979bb218  radiant-app/src/features/first-run/screens/WelcomeFlowReentry.test.tsx
a5c098b756625b0c31672eee26b247be208bac736553c4d66e83b31bff465dd2  radiant-app/src/features/first-run/components/WelcomeSlide.test.tsx
8dd9fc84d19563b2f74bf617e57431154188275764f2f254dd461694517c4c11  radiant-app/src/features/first-run/first-run.types.ts
f07a05a35f8da4f23a3a97329d1f4df343e9ec6c6d24644b70d639f3437c8cc4  radiant-app/src/features/first-run/startup-gate.flow.test.tsx
c9ce44773424373d18830b7c704b1ea81686d50b7eaacdccae2689c57fd10310  radiant-app/scripts/maestro-contract.test.mjs
2714ad48d9e23556ed0e3fa750dfbba3b21d8ce8e63588faf9c5baf13b676f73  radiant-app/.maestro/first-run.yaml
915fce74c272aed7384a01ee0af30d176e1ee2b55a281292f4d52fd1b6b0e652  radiant-app/.maestro/radiant-1-4-primeira-execucao.yaml
87976f5a7e9c156379c1a9631d5536b77664574b3250cdcce159011b53e33835  radiant-app/.maestro/student-checkpoint-active-resume.yaml
59833a2dfbe25042fa5ab24fc64e5a0ffceab2265f9923431fd1b1a2e38990fb  radiant-app/.maestro/student-checkpoint-short-viewport.yaml
5ac598287cdfab8a293f1cd89cdff16101feb7bad86deedaec81d5617dee0e00  radiant-app/scripts/visual-qa-policy.json
```

# Fix2 greeting não pode encolher no eixo vertical

Command: /usr/sbin/taskpolicy -b /Users/anderson/.nvm/versions/node/v20.20.2/bin/node radiant-app/node_modules/jest/bin/jest.js --config radiant-app/jest.config.cjs --runInBand radiant-app/src/features/first-run/components/WelcomeSlide.test.tsx --testNamePattern texto grande usa
Exit 1; restored SHA-256 710761eb2ab0d0fbafd0c7f3bf792dc3e92ae405e85ff83785c91a5bba43e03e

```text
FAIL radiant-app/src/features/first-run/components/WelcomeSlide.test.tsx
  WelcomeSlide — apresentação da bancada
    ✕ texto grande usa métricas naturais e não comprime verticalmente a fala empilhada (79 ms)
    ○ skipped apresenta o Pixel numa linha sem grupo acessível que esconda o conteúdo seguinte

  ● WelcomeSlide — apresentação da bancada › texto grande usa métricas naturais e não comprime verticalmente a fala empilhada

    expect(received).toBe(expected) // Object.is equality

    Expected: 0
    Received: 1

      26 |             expect(style.fontSize).toBe(16);
      27 |             expect(style.lineHeight).toBeUndefined();
    > 28 |             expect(style.flexShrink).toBe(0);
         |                                      ^
      29 |             expect(text.props.allowFontScaling).not.toBe(false);
      30 |             expect(text.props.maxFontSizeMultiplier).toBeUndefined();
      31 |             const column = result.UNSAFE_getAllByType(View).find(view => StyleSheet.flatten(view.props.style)?.flexDirection === 'column');

      at Object.toBe (src/features/first-run/components/WelcomeSlide.test.tsx:28:38)

Test Suites: 1 failed, 1 total
Tests:       1 failed, 1 skipped, 2 total
Snapshots:   0 total
Time:        4.089 s
Ran all test suites matching /radiant-app\/src\/features\/first-run\/components\/WelcomeSlide.test.tsx/i with tests matching "texto grande usa".

```

# Fix2 header não pode conservar lado a lado em texto máximo

Command: /usr/sbin/taskpolicy -b /Users/anderson/.nvm/versions/node/v20.20.2/bin/node radiant-app/node_modules/jest/bin/jest.js --config radiant-app/jest.config.cjs --runInBand radiant-app/src/features/bench/BenchControlRow.test.tsx --testNamePattern texto máximo deixa label
Exit 1; restored SHA-256 9c9b07a19f59ffb27f2e84a35ea87b7e7e70beb46bea7875dc4596c7102fb256

```text
FAIL radiant-app/src/features/bench/BenchControlRow.test.tsx
  BenchControlRow
    ✕ texto máximo deixa label e valor crescerem em coluna sem teto de parágrafo (104 ms)
    ○ skipped mostra o rótulo e o valor com a unidade
    ○ skipped sobe de passo em passo ao tocar + três vezes, e o rótulo acompanha
    ○ skipped desce de passo em passo ao tocar − e o rótulo acompanha
    ○ skipped as ações increment e decrement do leitor de tela fazem o mesmo que + e −
    ○ skipped expõe a linha como ajustável, com o valor e a faixa para o leitor de tela
    ○ skipped os botões − e + têm alvo de ao menos 48 dp
    ○ skipped nunca passa do máximo: em 120, + não muda nada, e 115 vai a 120, não a 125
    ○ skipped nunca passa do mínimo: em 40, − não muda nada, e 45 vai a 40, não a 35
    ○ skipped o arrasto é limitado à faixa mesmo com um valor bruto absurdo
    ○ skipped o arrasto atualiza a prévia a cada valor, mas sobe onChange só quando muda de passo
    ○ skipped desativado, nem o arrasto, nem os botões, nem as ações mudam o valor
    ○ skipped texto máximo conserva alvo mínimo48 e deixa os símbolos crescerem sem altura fixa

  ● BenchControlRow › texto máximo deixa label e valor crescerem em coluna sem teto de parágrafo

    expect(received).toBe(expected) // Object.is equality

    Expected: "column"
    Received: "row"

      209 |             }
      210 |             const header = result.UNSAFE_getAllByType(View).find(view => StyleSheet.flatten(view.props.style)?.justifyContent === 'space-between');
    > 211 |             expect(StyleSheet.flatten(header?.props.style).flexDirection).toBe('column');
          |                                                                           ^
      212 |             expect(StyleSheet.flatten(header?.props.style).alignItems).toBe('stretch');
      213 |             fireEvent.press(result.getByLabelText('Aumentar Tensão'));
      214 |             expect(result.getByText('80 kV')).toBeTruthy();

      at Object.toBe (src/features/bench/BenchControlRow.test.tsx:211:75)

Test Suites: 1 failed, 1 total
Tests:       1 failed, 12 skipped, 13 total
Snapshots:   0 total
Time:        2.076 s
Ran all test suites matching /radiant-app\/src\/features\/bench\/BenchControlRow.test.tsx/i with tests matching "texto máximo deixa label".

```

# FIX2 freeze r4 — restauração e limites

RED5novasfalhas/1guardaantigaPASS antes do produto; GREEN78/78,6suítes. Duas mutações acima discriminam flexShrink e coluna sem deixar lineHeight mascarar suas guardas. Freeze atual15paths:

```text
166ae120e47f677cb54e8e9ea7222e7879dd6255c2f37038ea284677ed1a72c6  radiant-app/src/features/first-run/screens/WelcomeFlowScreen.tsx
710761eb2ab0d0fbafd0c7f3bf792dc3e92ae405e85ff83785c91a5bba43e03e  radiant-app/src/features/first-run/components/WelcomeSlide.tsx
f4f71ee2526f056f0fd8ae5e2266a477ca652b737764e0993a0222271346fed6  radiant-app/src/features/first-run/screens/WelcomeFlowScreen.flow.test.tsx
4aeb1723a21534cc8c55e20d9c1627e0af53634bc1ff3f9c8e9dc165979bb218  radiant-app/src/features/first-run/screens/WelcomeFlowReentry.test.tsx
df8693128a97d4501a282fefd7348110e4bf2a6eb19e759ea906cc566c4a41a1  radiant-app/src/features/first-run/components/WelcomeSlide.test.tsx
8dd9fc84d19563b2f74bf617e57431154188275764f2f254dd461694517c4c11  radiant-app/src/features/first-run/first-run.types.ts
f07a05a35f8da4f23a3a97329d1f4df343e9ec6c6d24644b70d639f3437c8cc4  radiant-app/src/features/first-run/startup-gate.flow.test.tsx
c9ce44773424373d18830b7c704b1ea81686d50b7eaacdccae2689c57fd10310  radiant-app/scripts/maestro-contract.test.mjs
2714ad48d9e23556ed0e3fa750dfbba3b21d8ce8e63588faf9c5baf13b676f73  radiant-app/.maestro/first-run.yaml
915fce74c272aed7384a01ee0af30d176e1ee2b55a281292f4d52fd1b6b0e652  radiant-app/.maestro/radiant-1-4-primeira-execucao.yaml
87976f5a7e9c156379c1a9631d5536b77664574b3250cdcce159011b53e33835  radiant-app/.maestro/student-checkpoint-active-resume.yaml
59833a2dfbe25042fa5ab24fc64e5a0ffceab2265f9923431fd1b1a2e38990fb  radiant-app/.maestro/student-checkpoint-short-viewport.yaml
5ac598287cdfab8a293f1cd89cdff16101feb7bad86deedaec81d5617dee0e00  radiant-app/scripts/visual-qa-policy.json
9c9b07a19f59ffb27f2e84a35ea87b7e7e70beb46bea7875dc4596c7102fb256  radiant-app/src/features/bench/BenchControlRow.tsx
12267bf4967fb9d1d95bdc7b23ebb9c75d5bbc73592912a50ac2233bdcf924ef  radiant-app/src/features/bench/BenchControlRow.test.tsx
```

Somente controlador/revisor podem promover o NONPASS nativo após leitura/toque no aparelho; Jest não rasterizou.

# Fix3 type-only delta

8anotações em2testes; source stripping reconstitui hashes anteriores4aeb172/f4f71ee exatos. Runtime166ae/710761/9c9b reconferido, intacto. Typecheck Node20 exit0 e focais24/2PASS. Nenhum gatefull/nativo no implementador.

```text
166ae120e47f677cb54e8e9ea7222e7879dd6255c2f37038ea284677ed1a72c6  radiant-app/src/features/first-run/screens/WelcomeFlowScreen.tsx
710761eb2ab0d0fbafd0c7f3bf792dc3e92ae405e85ff83785c91a5bba43e03e  radiant-app/src/features/first-run/components/WelcomeSlide.tsx
82b6d72695410025ce9313d6844f6562ec224b61c19c91103d6ed62bc97248e3  radiant-app/src/features/first-run/screens/WelcomeFlowScreen.flow.test.tsx
c268571703de33e74966c951c6e15eef3a44d947b23a455699c13b2d944ba329  radiant-app/src/features/first-run/screens/WelcomeFlowReentry.test.tsx
df8693128a97d4501a282fefd7348110e4bf2a6eb19e759ea906cc566c4a41a1  radiant-app/src/features/first-run/components/WelcomeSlide.test.tsx
8dd9fc84d19563b2f74bf617e57431154188275764f2f254dd461694517c4c11  radiant-app/src/features/first-run/first-run.types.ts
f07a05a35f8da4f23a3a97329d1f4df343e9ec6c6d24644b70d639f3437c8cc4  radiant-app/src/features/first-run/startup-gate.flow.test.tsx
c9ce44773424373d18830b7c704b1ea81686d50b7eaacdccae2689c57fd10310  radiant-app/scripts/maestro-contract.test.mjs
2714ad48d9e23556ed0e3fa750dfbba3b21d8ce8e63588faf9c5baf13b676f73  radiant-app/.maestro/first-run.yaml
915fce74c272aed7384a01ee0af30d176e1ee2b55a281292f4d52fd1b6b0e652  radiant-app/.maestro/radiant-1-4-primeira-execucao.yaml
87976f5a7e9c156379c1a9631d5536b77664574b3250cdcce159011b53e33835  radiant-app/.maestro/student-checkpoint-active-resume.yaml
59833a2dfbe25042fa5ab24fc64e5a0ffceab2265f9923431fd1b1a2e38990fb  radiant-app/.maestro/student-checkpoint-short-viewport.yaml
5ac598287cdfab8a293f1cd89cdff16101feb7bad86deedaec81d5617dee0e00  radiant-app/scripts/visual-qa-policy.json
9c9b07a19f59ffb27f2e84a35ea87b7e7e70beb46bea7875dc4596c7102fb256  radiant-app/src/features/bench/BenchControlRow.tsx
12267bf4967fb9d1d95bdc7b23ebb9c75d5bbc73592912a50ac2233bdcf924ef  radiant-app/src/features/bench/BenchControlRow.test.tsx
```
