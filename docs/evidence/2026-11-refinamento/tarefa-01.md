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

## Rodada 1 de correção

Comando: `cd radiant-app && npx jest --runInBand src/components/ui/AppButton.test.tsx`

Vermelho (testes novos antes do conserto):
```
    ✕ carregando primary mantém a face da variante (2 ms)
    ✕ carregando galaxy mantém a face da variante (2 ms)
    ✕ alternar disabled não muda borderWidth nem minHeight da face (primary) (2 ms)
    ✕ alternar disabled não muda borderWidth nem minHeight da face (galaxy) (1 ms)
    ✕ alternar disabled não muda borderWidth nem minHeight da face (gold) (1 ms)
    ✕ alternar disabled não muda borderWidth nem minHeight da face (success) (1 ms)
    ✕ alternar disabled não muda borderWidth nem minHeight da face (error) (1 ms)
Tests:       7 failed, 47 passed, 54 total
```
O teste `carregando não aplica opacidade` já nascia verde (loading não tem opacidade desde a rodada anterior); é guarda de regressão, sem passo vermelho.

Verde:
```
Tests:       54 passed, 54 total
tsc --noEmit e eslint dos três arquivos: sem saída
```
