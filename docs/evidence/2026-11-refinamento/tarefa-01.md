# Tarefa 1: botão desabilitado legível

Node 20.20.2. Comando: `cd radiant-app && npx jest --runInBand src/components/ui/AppButton.test.tsx`

## Vermelho (antes de mexer no componente)

Falhas pelo motivo previsto: opacidade 0,45 no conjunto e face na cor da variante.

```
    ✕ desabilitado primary não aplica opacidade (3 ms)
    ✕ desabilitado galaxy não aplica opacidade (2 ms)
    ✕ desabilitado gold não aplica opacidade (1 ms)
    ✕ desabilitado secondary não aplica opacidade (1 ms)
    ✕ desabilitado success não aplica opacidade
    ✕ desabilitado error não aplica opacidade
    ✕ desabilitado primary usa a face neutra (2 ms)
    ✕ desabilitado galaxy usa a face neutra
    ✕ desabilitado gold usa a face neutra (1 ms)
    ✕ desabilitado secondary usa a face neutra (1 ms)
    ✕ desabilitado success usa a face neutra (1 ms)
    ✕ desabilitado error usa a face neutra (1 ms)
    ✕ desabilitado ghost só troca o rótulo, sem opacidade
Tests:       13 failed, 32 passed, 45 total
    Expected: 1
    Received: 0.45

--
    Expected: 1
    Received: 0.45

    Expected: "#232733"
    Received: "#2155FF"

```

## Verde (depois)

```
Tests:       45 passed, 45 total
npm run test:contrast-contract: 18 pass, 0 fail
npx tsc --noEmit e eslint dos três arquivos: sem saída
```
