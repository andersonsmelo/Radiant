# 🧱 LAYOUT_PRIMITIVES.md — Radiant (v1)
Status: ✅ Oficial (congelado)
Escopo: Layout primitives do `src/ui/styles.ts` + regras de uso

> **Objetivo:**
> Padronizar o “vocabulário de layout” do Radiant para manter consistência premium e evitar regressão visual conforme novas telas/componentes surgirem.

---

## 0) Princípios (Radiant Layout)

1. **Dark-first, premium, com respiro**: Layouts devem parecer limpos e organizados.
2. **Um eixo horizontal consistente**: Mesma coluna base e margens em todas as telas.
3. **Ritmo vertical previsível**: Espaçamentos definidos por stacks, sem improviso.
4. **Sem wrappers inúteis**: `View` só existe se tiver função (layout, estilo, lógica).
5. **Primitives primeiro, exceção depois**:
   - Se existir primitive → use.
   - Se não existir → crie com justificativa.

---

## 1) Fonte de Verdade

Os primitives vivem em:

- `src/ui/styles.ts`
  - `layout.*` (estruturas)
  - `space.*` (espaçamentos: `s0` a `s6`)
  - `typography.*` (tipografia sem cor: `h1` a `caption`)

**Regra:**
> **Não inventar números** (ex: 18, 22, 28) em telas.
> Use `space.s*` ou crie um novo token com justificativa.

---

## 2) Primitives Oficiais (v1)

### A) `layout.screen`
**Quando usar:**
- Sempre no wrapper raiz de telas (`HomeScreen`, `QuizScreen`, `ReviewScreen`, etc.).

**O que resolve:**
- `flex: 1`
- `padding` padrão (space.s3)
- Consistência entre telas.

**Exemplo:**
```tsx
<View style={[layout.screen, { backgroundColor: COLORS.bg }]}>
    {/* resto da tela */}
</View>
```
> **Regra:** Cor de fundo é da tela, não do primitive.

---

### B) `layout.container`
**Quando usar:**
- Qualquer tela com conteúdo “centralizado” no Web (`maxWidth` de 720px).
- Para manter o Radiant premium em desktop/web.

**O que resolve:**
- Largura máxima.
- Centraliza horizontalmente (`alignSelf: 'center'`).

**Exemplo:**
```tsx
<View style={layout.container}>
  {/* conteúdo */}
</View>
```
> **Regra:** Em mobile, o container não atrapalha (`width: 100%`) — só controla o web.

---

### C) `layout.stackSm` / `layout.stackMd`
**Quando usar:**
- Para empilhamento vertical com `gap` consistente.
- Substitui `marginBottom` em cadeia.

**Detalhes:**
- `stackSm`: gap = `space.s2` (12px)
- `stackMd`: gap = `space.s5` (24px)

**Exemplo:**
```tsx
<View style={[layout.container, layout.stackMd]}>
  <Header />
  <StatsRow />
  <ReviewCard />
</View>
```
> **Regra:** Preferir `stack*` ao invés de “espaçamento manual entre blocos”.

---

### D) `layout.row`
**Quando usar:**
- Qualquer linha horizontal simples (ícones + texto, pills, etc.).
- `flexDirection: 'row'`, `alignItems: 'center'`.

**Exemplo:**
```tsx
<View style={layout.row}>
  <Icon />
  <Text style={{ marginLeft: space.s1 }}>XP</Text>
</View>
```
> **Regra:** Se precisa “gap” em row, use `space` (ex: `marginLeft`) ou crie um rowGap específico local.

---

### E) `layout.rowBetween`
**Quando usar:**
- Linha horizontal com extremos (`title` + `action`, `label` + `value`).
- `justifyContent: 'space-between'`.

**Exemplo:**
```tsx
<View style={layout.rowBetween}>
  <Text>Revisões</Text>
  <Text>{dueCount}</Text>
</View>
```
> **Regra:** Não usar `rowBetween` dentro de componentes “apertados” se isso quebrar em telas pequenas.

---

### F) `layout.center`
**Quando usar:**
- Loading state (spinner + texto).
- Empty state central.
- Containers de feedback/sumário que precisam centralizar tudo.

**Exemplo:**
```tsx
<View style={layout.center}>
  <ActivityIndicator />
  <Text style={[typography.caption, { marginTop: space.s3 }]}>Carregando…</Text>
</View>
```
> **Regra:** `center` é para estados e seções, não para a tela inteira (use `screen` + `container`).

---

## 3) Regras de Composição (como combinar)

### Padrão de tela (90% dos casos)
```tsx
<View style={[layout.screen, { backgroundColor: COLORS.bg }]}>
  <View style={[layout.container, layout.stackMd]}>
    {/* conteúdo */}
  </View>
</View>
```

### Seção com ritmo vertical previsível
```tsx
<View style={layout.stackSm}>
  <Card />
  <Card />
  <PrimaryButton />
</View>
```

### Linha com extremos
```tsx
<View style={layout.rowBetween}>
  <Text>Meta do dia</Text>
  <Text>1/1</Text>
</View>
```

---

## 4) Anti-padrões (Proibidos)

❌ **A) “Margin aleatória”**
- Ruim: `marginBottom: 18`, `paddingHorizontal: 22`
- ✅ Bom: `marginBottom: space.s4`, `paddingHorizontal: space.s4`

❌ **B) Wrapper sem função**
- Ruim: `<View><View><Card /></View></View>`
- ✅ Bom: `<Card />`

❌ **C) Espaçamento “em cascata”**
- Ruim: Todo componente com `marginBottom` diferente.
- ✅ Bom: Use `stackSm`/`stackMd` no pai.

❌ **D) Centralizar tudo por padrão**
- Ruim: Toda tela com `layout.center`.
- ✅ Bom: `layout.screen` padrão, `center` só para estados (loading/empty).

❌ **E) Layout “solto” fora do container**
- Ruim: Um card alinhado diferente do resto.
- ✅ Bom: Tudo que é conteúdo principal deve viver dentro de `layout.container`.

---

## 5) Exemplos Reais (Radiant)

### HomeScreen (Arquétipo Dashboard)
**Estrutura recomendada:**
- `screen` + `container` + `stackMd`
- Row de stats: `layout.row`
- Banner condicional
- Card de reviews + CTA principal

```text
screen
  container + stackMd
    header
    statsRow (row)
    goalBanner (optional)
    reviewCard
    primaryCTA
```

### QuizScreen (Arquétipo Flow)
**Estrutura recomendada:**
- `screen` + `container` + `stackMd`
- Conteúdo muda, mas eixo permanece.

```text
screen
  container + stackMd
    topInfo (progress)
    questionCard
    answersStack (stackSm)
    footerCTA
```

### ReviewScreen (Arquétipo Flow rápido)
**Estrutura recomendada:**
- `screen` + `container` + `stackMd`
- Card “flashcard” centralizado visualmente ou no fluxo.

```text
screen
  container + stackMd
    header (compact)
    reviewCard (centered-ish section)
    ratingRow (row)
    continueCTA
```

---

## 6) Checklist (para PRs)

Antes de aprovar layout:
- [ ] Tela usa `layout.screen` no root.
- [ ] Conteúdo principal usa `layout.container`.
- [ ] Ritmo vertical usa `stackSm` / `stackMd` (evita margins manuais).
- [ ] Não há números mágicos (18, 22, 28…).
- [ ] Não há wrappers inúteis.
- [ ] Eixo horizontal consistente.
- [ ] `center` usado apenas em estados (Loading/Empty/Celebration).

---

## 7) Política de Evolução (v2)

Quando surgir uma necessidade recorrente (>= 3 lugares):
1. Criar nova primitive em `layout`.
2. Documentar aqui.
3. Refatorar usos existentes.

**Primitives não são “estilo”. São “infraestrutura de layout”.**
