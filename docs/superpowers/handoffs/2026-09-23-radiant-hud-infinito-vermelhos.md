# HUD sem corações ao lado do ∞ — vermelhos registrados

**Data:** 2026-09-23 · **Branch:** `fix/hud-infinito` (sobre `0b0283e`) ·
**Node:** `v20.20.2` · **Arquivo sob teste:** `radiant-app/src/ui/components/HUD.tsx`

Comando de cada execução, em `radiant-app/`:

```bash
EXPO_NO_DOTENV=1 npx jest --runInBand src/ui/components/HUD.test.tsx > <arquivo> 2>&1
```

A saída foi gravada com `> arquivo 2>&1` (o Jest escreve no stderr) e cada
arquivo foi conferido não vazio antes de ser citado. Os trechos abaixo são
recortes literais dessas saídas: a linha `Tests:` e a linha do código onde cada
asserção disparou (`> N |`), com a contagem de ocorrências.

## 1. Primeiro vermelho, contra o código de `0b0283e` — e um guarda cego

```text
Tests:       8 failed, 26 passed, 34 total
      ✓ desenha os cinco corações e o resumo, sem ∞
      ✓ anuncia a contagem no botão que abre a folha
      ✓ desenha os cinco corações e o resumo, sem ∞
      ✓ anuncia a contagem no botão que abre a folha
      ✓ desenha os cinco corações e o resumo, sem ∞
      ✓ anuncia a contagem no botão que abre a folha
      ✕ não desenha nenhum coração
      ✕ rotula o ∞ como "Vidas ilimitadas" também sem botão (Checkpoint e Revisão)
      ✕ não anuncia "N de 5 vidas" a quem não perde vida
      ✓ mantém o botão que abre a folha, rotulado "Vidas ilimitadas", sem corações dentro
      ✕ no modo compact também troca os corações pelo ∞
      ✕ não desenha nenhum coração
      ✕ rotula o ∞ como "Vidas ilimitadas" também sem botão (Checkpoint e Revisão)
      ✕ não anuncia "N de 5 vidas" a quem não perde vida
      ✓ mantém o botão que abre a folha, rotulado "Vidas ilimitadas", sem corações dentro
      ✕ no modo compact também troca os corações pelo ∞
```

Oito vermelhos pelo motivo previsto: corações presentes, rótulo "Vidas
ilimitadas" ausente quando não há botão e "5 de 5 vidas" / "0 de 5 vidas"
anunciado ao assinante. Um guarda **passou** com os cinco corações na tela:
"mantém o botão… sem corações dentro". Dentro do botão o `HeartsDisplay`
recebe `importantForAccessibility="no-hide-descendants"`, e o RNTL 13 omite nós
ocultos da acessibilidade por padrão; a consulta perguntava se o leitor de tela
alcança o coração, não se ele está desenhado. Corrigido com
`queryByTestId('hud-heart-0', { includeHiddenElements: true })`.

## 2. Segundo vermelho, mesmo código, guarda corrigido

```text
Tests:       10 failed, 24 passed, 34 total
   2     > 177 |       expect(heartsDrawn(screen)).toBeNull();
   2     > 184 |       expect(screen.getByLabelText('Vidas ilimitadas')).toBeTruthy();
   2     > 190 |       expect(screen.queryByLabelText(/de 5 vidas/u)).toBeNull();
   2     > 199 |       expect(heartsDrawn(screen)).toBeNull();
   2     > 205 |       expect(heartsDrawn(screen)).toBeNull();
```

Dez vermelhos (cinco guardas × `count` 5 e 0), cada um na asserção prevista.
O guarda do botão agora reprova na linha 199 (`heartsDrawn`).

## 3. Verde após a correção

```text
Tests:       34 passed, 34 total
```

## 4. Mutações — cada guarda que só tinha sido visto verde, derrubado pelo defeito que nomeia

Cada mutação partiu da cópia da correção (`shasum` `ffd603da…`), foi conferida
como aplicada (`cmp` diferente) e desfeita ao final; o `shasum` voltou idêntico
e a suíte voltou a 34/34.

### M1-snapshot-qualquer-vira-ilimitado

```diff
<   const unlimited = heartsSnapshot?.status === 'unlimited';
>   const unlimited = Boolean(heartsSnapshot);
```

```text
Tests:       7 failed, 27 passed, 34 total
   3     > 149 |         expect(screen.getByTestId(`hud-heart-${i}`)).toBeTruthy();
   3     > 159 |       fireEvent.press(screen.getByRole('button', { name: label }));
   1     > 67 |     expect(screen.getByText('3 · +1 em 10 min')).toBeTruthy();
```

### M2-infinito-ao-lado-dos-coracoes

```diff
<       {summary ? <Text style={styles.heartsSummary}>{summary}</Text> : null}
>       {summary ? <Text style={styles.heartsSummary}>{summary}</Text> : null}<UnlimitedHeartsDisplay />
```

```text
Tests:       3 failed, 31 passed, 34 total
   3     > 152 |       expect(screen.queryByText('∞')).toBeNull();
```

### M3-infinito-sem-rotulo

```diff
<       accessibilityLabel="Vidas ilimitadas"
>       accessibilityLabel={undefined}
```

```text
Tests:       4 failed, 30 passed, 34 total
   2     > 184 |       expect(screen.getByLabelText('Vidas ilimitadas')).toBeTruthy();
   2     > 206 |       expect(screen.getByLabelText('Vidas ilimitadas')).toBeTruthy();
```

### M4-botao-anuncia-contagem

```diff
<   const accessibilityLabel = unlimited
>   const accessibilityLabel = false
```

```text
Tests:       2 failed, 32 passed, 34 total
   2     > 197 |       fireEvent.press(screen.getByRole('button', { name: 'Vidas ilimitadas' }));
```

### M5-sem-infinito

```diff
<     <UnlimitedHeartsDisplay hiddenFromAccessibility={Boolean(onHeartsPress)} />
>     <View />
```

```text
Tests:       6 failed, 28 passed, 34 total
   2     > 178 |       expect(screen.getByText('∞')).toBeTruthy();
   2     > 184 |       expect(screen.getByLabelText('Vidas ilimitadas')).toBeTruthy();
   2     > 206 |       expect(screen.getByLabelText('Vidas ilimitadas')).toBeTruthy();
```

### M6-botao-sem-acao

```diff
<       onPress={onHeartsPress}
>       onPress={undefined}
```

```text
Tests:       6 failed, 28 passed, 34 total
   3     > 160 |       expect(onHeartsPress).toHaveBeenCalledTimes(1);
   2     > 198 |       expect(onHeartsPress).toHaveBeenCalledTimes(1);
   1     > 69 |     expect(onHeartsPress).toHaveBeenCalledTimes(1);
```

### M7-sem-resumo

```diff
<       {summary ? <Text style={styles.heartsSummary}>{summary}</Text> : null}
>       {null}
```

```text
Tests:       4 failed, 30 passed, 34 total
   3     > 151 |       expect(screen.getByText(summary)).toBeTruthy();
   1     > 67 |     expect(screen.getByText('3 · +1 em 10 min')).toBeTruthy();
```

Mapa asserção → vermelho que a sustenta (linhas de `HUD.test.tsx`):

| Linha | Asserção | Vermelho |
| --- | --- | --- |
| 67 | resumo "3 · +1 em 10 min" (teste antigo) | M1, M7 |
| 149 | cinco corações em full/recovering/empty | M1 |
| 151 | resumo em full/recovering/empty | M7 |
| 152 | sem ∞ em full/recovering/empty | M2 |
| 159–160 | botão com a contagem abre a folha | M1, M6 |
| 177 | unlimited: nenhum coração desenhado | natural (§2) |
| 178 | unlimited: ∞ visível | M5 |
| 184 | unlimited sem botão: rótulo "Vidas ilimitadas" | natural (§1, §2), M3, M5 |
| 190 | unlimited: não anuncia "N de 5 vidas" | natural (§1, §2) |
| 197–198 | unlimited: botão "Vidas ilimitadas" abre a folha | M4, M6 |
| 199 | unlimited: sem corações dentro do botão | natural (§2) |
| 205–206 | compact: sem corações, com rótulo | natural (§2), M3, M5 |

## 5. Gate

```text
Test Suites: 133 passed, 133 total
Tests:       1189 passed, 1189 total
Found 64 issues: 0 regressions, 61 baselined, 3 scoped exceptions.
✅ Visual QA passed without unapproved regressions.
exit=0
```

`EXPO_NO_DOTENV=1 npm run quality`, Node `v20.20.2`, worktree limpa em
`fix/hud-infinito`. A contagem fecha com a base: 1174 testes em `0b0283e`
(medição da sessão do Ask to Buy), menos o teste antigo "mostra infinito para
assinante", mais 16 novos = 1189.
