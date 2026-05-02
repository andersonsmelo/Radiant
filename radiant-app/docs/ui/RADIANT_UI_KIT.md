# Radiant UI Kit — v2.0

Design system reference for the Radiant mobile application.
Reflects the **New Layout wave** shipped in v1.2.0 (2026-05-02).

---

## Visão Geral

O Radiant tem **dois contextos visuais** que coexistem:

| Contexto | Telas | Background |
|---|---|---|
| **Light** | Home, Quiz, Progress, Missions, Checkpoint, Onboarding | `#F5FAFF` |
| **Dark (Space)** | Galaxy Map, Reward | `#03030D` |

---

## Paleta de Cores

Fonte canônica: `src/ui/theme.ts` (`colors`, `galaxyColors`, `gradients`).

### Light — Backgrounds
| Token | Valor | Uso |
|---|---|---|
| `colors.background` | `#F5FAFF` | Root de telas light |
| `colors.backgroundSecondary` | `#EAF4FF` | Seções alternadas |
| `colors.bg2` | `#EAF2FF` | Gradient endpoint (Checkpoint) |
| `colors.surface` | `#FFFFFF` | Cards, modais |
| `colors.surfaceMuted` | `#F3F8FF` | Superfície sutil |

### Dark (Space) — Backgrounds
| Token | Valor | Uso |
|---|---|---|
| `galaxyColors.background` | `#03030D` | Root de telas escuras |
| `galaxyColors.surface` | `rgba(255,255,255,0.06)` | Cards no espaço |
| `galaxyColors.surfaceMuted` | `rgba(255,255,255,0.03)` | Superfície ultra-sutil |

### Textos
| Token | Valor | Uso |
|---|---|---|
| `colors.textPrimary` | `#14233F` | Títulos, conteúdo principal (light) |
| `colors.textSecondary` | `#5B6B85` | Subtítulos, labels (light) |
| `colors.textTertiary` | `#93A0B8` | Captions, eyebrows (light) |
| `galaxyColors.textPrimary` | `#FFFFFF` | Títulos (dark) |
| `galaxyColors.textSecondary` | `rgba(255,255,255,0.50)` | Labels (dark) |

### Ação / Marca
| Token | Valor | Uso |
|---|---|---|
| `colors.primary` | `#2155FF` | CTA principal, links |
| `colors.primary2` | `#3D6BFF` | Gradiente companheiro do primary |
| `colors.accent` | `#3DCAE8` | Destaques, accents cyan |
| `colors.streak` | `#FF6B2C` | Streak, fogo |

### Semânticas
| Token | Valor | Uso |
|---|---|---|
| `colors.success` | `#1A9C71` | Respostas corretas, conquistas |
| `colors.successSoft` | `#E6FFF6` | Background de feedback correto |
| `colors.danger` | `#D8506F` | Erros, respostas erradas |
| `colors.dangerSoft` | `#FFF0F4` | Background de feedback errado |
| `colors.warning` | `#D79022` | Avisos, XP badges |
| `colors.warningSoft` | `#FFF6DF` | Background de avisos |

### Bordas
| Token | Valor |
|---|---|
| `colors.border` | `#E3ECF7` |
| `colors.borderSoft` | `rgba(57,111,219,0.14)` |
| `colors.borderStrong` | `#7CB8FF` |
| `galaxyColors.border` | `rgba(255,255,255,0.10)` |

### Gradientes
```typescript
gradients.hero          // ['#FFFFFF', '#D8F6FF', '#7EDFFF']
gradients.primaryButton // ['#1B47FF', '#2F71FF']
gradients.cyanGlow      // ['#C7F8FF', '#75DEFF']
gradients.journeyTrack  // ['#3BC8E8', '#4A78FF']

// Galaxy específicos (hardcoded nos componentes)
streak banner    // ['#FF8A4C', '#FF6B2C']
accuracy bar     // ['#3DCAE8', '#2155FF']
hero card        // ['#2155FF', '#3D6BFF']
checkpoint bg    // ['#EAF2FF', '#F5FAFF']
```

---

## Tipografia

Fonte canônica: `src/ui/styles.ts` (`typography`) + `src/ui/theme.ts` (`fontFamily`, `textStyles`).

### Família
- **Sora** (Google Fonts) — usada para display/headlines
  - `fontFamily.sora` — Regular 400
  - `fontFamily.soraSemiBold` — SemiBold 600
  - `fontFamily.soraBold` — Bold 700
  - `fontFamily.soraExtraBold` — ExtraBold 800
- **System** — usada para body text e UI

### Escala (`typography.*`)
| Token | fontSize | lineHeight | fontWeight |
|---|---|---|---|
| `h1` | 40 | 46 | 800 |
| `h2` | 32 | 38 | 800 |
| `h3` | 24 | 30 | 700 |
| `body` | 16 | 24 | 600 |
| `bodyRegular` | 16 | 24 | 400 |
| `caption` | 13 | 18 | 600 |
| `micro` | 12 | 16 | 600 |

### Padrões de UI
```
Eyebrow/Label: 10–11px, fontWeight 800, color textTertiary, letterSpacing 0.08em, textTransform 'uppercase'
Screen title:  26px, fontWeight 800, color textPrimary, letterSpacing -0.02em
Card title:    14px, fontWeight 800, color textPrimary
```

---

## Espaçamento

Fonte: `src/ui/styles.ts` (`space`).

| Token | Valor | Equivalência |
|---|---|---|
| `space.s0` | 4 | XS |
| `space.s1` | 8 | SM |
| `space.s2` | 12 | MD |
| `space.s3` | 16 | LG |
| `space.s4` | 20 | XL |
| `space.s5` | 24 | 2XL |
| `space.s6` | 32 | 3XL |

**Padrões comuns:**
- `paddingHorizontal` de telas: `20`
- `gap` entre cards: `12–14`
- `paddingBottom` de ScrollView (acima de tab bar): `120`

---

## Border Radius

Fonte: `src/ui/styles.ts` (`radius`).

| Token | Valor | Uso |
|---|---|---|
| `radius.rSm` | 8 | Badges, small elements |
| `radius.rMd` | 12 | Botões, chips |
| `radius.rLg` | 16 | Cards padrão |
| `radius.rXl` | 20 | Cards grandes, modais |

Valores adicionais usados localmente: `borderRadius: 14` (mission cards), `borderRadius: 18` (streak banner).

---

## Sombras

Fonte: `src/ui/theme.ts` (`shadows`).

```typescript
shadows.soft  // shadowRadius 18, offset {0,10}  — cards light
shadows.card  // shadowRadius 24, offset {0,12}  — cards elevados
shadows.glow  // shadowRadius 18, offset {0,0}   — glow highlights
```

**Padrão para cards brancos (light):**
```typescript
shadowColor: '#14233F', shadowOpacity: 0.06, shadowRadius: 8, shadowOffset: {width:0, height:2}
```

**Padrão para cards com acento de cor:**
```typescript
shadowColor: colors.primary, shadowOpacity: 0.18, shadowRadius: 20, shadowOffset: {width:0, height:8}
```

---

## Componentes de UI

### AppButton (`src/components/ui/AppButton.tsx`)
```typescript
<AppButton
  label="Texto do botão"      // OU children string
  onPress={() => {}}
  variant="primary"           // 'primary' | 'galaxy' | 'ghost'
  disabled={false}
/>
```
- `primary` — azul `#2155FF`, texto branco
- `galaxy` — gradiente `['#1B47FF','#2F71FF']`, para telas dark
- `ghost` — transparente, borda sutil

### StatPill (`src/ui/components/StatPill.tsx`)
```typescript
<StatPill icon={<SvgIcon />} value="2 840" label="XP" />
```
Usado no HUD e no header da Home.

### ProgressRing (`src/ui/components/ProgressRing.tsx`)
```typescript
<ProgressRing value={0.72} size={72} strokeWidth={6} color={colors.primary} />
```
Animado via Reanimated 4 (`withSpring`).

### XrayPanel (`src/components/ui/XrayPanel.tsx`)
```typescript
<XrayPanel height={220} highlight={{ x: 230, y: 110, r: 18 }} />
```
SVG de raio-X estilizado. Usado em questões de tipo `'image'`.

### Confetti (`src/components/ui/Confetti.tsx`)
```typescript
<Confetti count={30} run={true} />
```
Partículas coloridas animadas via Reanimated. `run` inicia/reinicia a animação.

### PixelIllustration (`src/ui/characters/PixelIllustration.tsx`)
```typescript
<PixelIllustration state="idle" size="md" />
// state: 'idle' | 'happy' | 'guide' | 'thinking' | 'celebrate' | 'oops'
// size: 'sm' | 'md' | 'lg'
```
Mascote Pixel com animações state-driven via Reanimated 4.

### StarfieldBackground (`src/ui/components/StarfieldBackground.tsx`)
```typescript
<StarfieldBackground />
// Opcional: backgroundColor, starCount, extraNebulas
```
Fundo escuro com estrelas e nebulosas. Usado apenas em telas dark (Galaxy, Reward).

### HUD (`src/ui/components/HUD.tsx`)
```typescript
<HUD totalXp={snap.totalXp} streakDays={snap.streakDays} hearts={snap.hearts} maxHearts={snap.maxHearts} />
```
Barra de status com XP + streak + corações. Usada em telas dark.

### GalaxyBlob (`src/features/galaxy/components/GalaxyBlob.tsx`)
```typescript
<GalaxyBlob size={80} colorPrimary="#3DCAE8" />
```
Blob SVG orgânico para representar galáxias no mapa.

---

## Telas e Contextos Visuais

| Tela | Arquivo | Modo | Background |
|---|---|---|---|
| Home | `features/home/screens/HomeScreen.tsx` | Light | `#F5FAFF` |
| Galaxy Map | `features/galaxy/screens/GalaxyMapScreen.tsx` | Dark | `#03030D` |
| Lesson/Quiz | `features/quiz/screens/QuizScreen.tsx` | Light | `colors.background` |
| Reward | `features/rewards/screens/RewardScreen.tsx` | Dark | `#03030D` |
| Progress | `features/progress/screens/ProgressScreen.tsx` | Light | `#F5FAFF` |
| Missions | `features/galaxy/screens/MissionsScreen.tsx` | Light | `#F5FAFF` |
| Checkpoint | `features/checkpoint/screens/CheckpointScreen.tsx` | Light (celebration) / Dark (main) | Gradient / `galaxyColors.background` |
| Onboarding Welcome | `app/onboarding/index.tsx` | Dark | `#03030D` |
| Onboarding Value | `app/onboarding/value.tsx` | Dark | `#03030D` |
| Onboarding Goal | `app/onboarding/goal.tsx` | Light | `#F5FAFF` |

---

## Motion

Fonte: `src/ui/motion.ts`.

### Easings
```typescript
easing.spring   // withSpring padrão — entrada de elementos
easing.snappy   // withTiming 200ms ease-out — micro-interações
easing.smooth   // withTiming 350ms ease-in-out — transições de estado
easing.enter    // withTiming 300ms ease-out — elementos entrando
easing.exit     // withTiming 200ms ease-in — elementos saindo
```

### Hooks de Animação
```typescript
useCardEnter()   // fadeIn + translateY — entrada de cards
useScalePop()    // scale 0.9 → 1 com spring — feedback positivo
useShakeError()  // shake horizontal — feedback de erro
```

### Pixel — Animações por Estado
| State | Animação |
|---|---|
| `idle` | Float suave ↑↓ (2250ms/ciclo) |
| `happy` | Scale pulse contínuo |
| `guide` | Float mais rápido |
| `thinking` | Tilt -8° |
| `celebrate` | Scale pop repetido (600ms/ciclo) |
| `oops` | Shake + tilt fixo -2° |

---

## Layout Patterns

### Tela Light padrão
```
<View style={{ flex: 1, backgroundColor: colors.background }}>
  <SafeAreaView style={{ flex: 1 }} edges={['top']}>
    <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 120 }}>
      {/* conteúdo */}
    </ScrollView>
  </SafeAreaView>
</View>
```

### Tela Dark padrão
```
<View style={{ flex: 1, backgroundColor: galaxyColors.background }}>
  <StarfieldBackground />
  <SafeAreaView style={{ flex: 1 }} edges={['top']}>
    <HUD ... />
    {/* conteúdo */}
  </SafeAreaView>
</View>
```

### Card padrão (light)
```typescript
{
  backgroundColor: '#FFFFFF',
  borderRadius: 16,
  borderWidth: 1,
  borderColor: colors.border,        // '#E3ECF7'
  padding: 16,
  shadowColor: '#14233F',
  shadowOpacity: 0.06,
  shadowRadius: 8,
  shadowOffset: { width: 0, height: 2 },
}
```

### Progress bar com flex (sem % strings)
```tsx
// track
<View style={{ height: 8, borderRadius: 4, backgroundColor: '#EAF2FF', overflow: 'hidden', flexDirection: 'row' }}>
  <LinearGradient
    colors={['#2155FF', '#3DCAE8']}
    start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
    style={{ flex: progress }}      // progress = 0..1
  />
  {progress < 1 && <View style={{ flex: 1 - progress }} />}
</View>
```

---

## Regras de Implementação

### Do's ✅
- Usar tokens (`colors.*`, `space.*`, `radius.*`, `typography.*`) em vez de valores arbitrários
- `SafeAreaView` com `edges={['top']}` em todas as telas
- `flex` para progress bars — nunca `width: '65%'` em StyleSheet
- `expo-linear-gradient` para gradientes — nunca `background: 'linear-gradient()'`
- `react-native-svg` para ícones/shapes — nunca SVG inline sem wrapper

### Don'ts ❌
- `%` strings em `StyleSheet.create()` (exceto em contextos específicos de Reanimated)
- `backdropFilter: blur()` — usar `BlurView` do `expo-blur`
- Cores hardcoded que existem como tokens
- Motion decorativo sem propósito funcional
- `StarfieldBackground` em telas light

---

**Versão**: 2.0
**Atualizado**: 2026-05-02
**Corresponde à release**: v1.2.0 — Design System Wave
