# Radiant — Design System Final: Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Portar o design completo de `/New Layout/` (10 telas, ~3000 linhas de web JSX) para o app React Native com Expo, unificando toda a identidade visual em uma única direção profissional.

**Architecture:** Atualizar tokens → criar primitivos compartilhados → implementar telas. Cada fase é independente e testável. A tradução web→RN segue: `div→View`, `button→Pressable`, CSS animations→Reanimated 4, `backdropFilter→expo-blur`, SVG inline→react-native-svg.

**Tech Stack:** React Native 0.81.5, Expo 54, Expo Router 6, Reanimated 4.1.1, react-native-svg 15.12.1, expo-blur (instalar), Sora font (expo-google-fonts)

**Design Source:** `/New Layout/` — `tokens.css`, `shared.jsx`, `screens.jsx`, `screens2.jsx`

---

## Delta de Instalação

```
expo install expo-blur
npx expo install @expo-google-fonts/sora expo-font
```

---

## Mapa de Arquivos

| Arquivo | Ação | Fonte de referência |
|---------|------|---------------------|
| `radiant-app/src/ui/theme.ts` | MODIFY | `New Layout/tokens.css` |
| `radiant-app/src/ui/styles.ts` | MODIFY | `New Layout/tokens.css` (typography helpers) |
| `radiant-app/src/ui/motion.ts` | MODIFY | `New Layout/tokens.css` (easing) |
| `radiant-app/src/app/_layout.tsx` | MODIFY | carregar Sora font |
| `radiant-app/src/app/(tabs)/_layout.tsx` | MODIFY | adicionar tab Home |
| `radiant-app/src/ui/characters/PixelIllustration.tsx` | MODIFY | `shared.jsx → Pixel` |
| `radiant-app/src/components/ui/StatPill.tsx` | MODIFY | `shared.jsx → StatPill` |
| `radiant-app/src/components/ui/ProgressRing.tsx` | MODIFY | `shared.jsx → ProgressRing` |
| `radiant-app/src/components/ui/AppButton.tsx` | MODIFY | `tokens.css → .btn-primary / .btn-galaxy` |
| `radiant-app/src/components/ui/XrayPanel.tsx` | CREATE | `shared.jsx → XrayPanel` |
| `radiant-app/src/components/ui/Confetti.tsx` | CREATE | `shared.jsx → Confetti` |
| `radiant-app/src/components/ui/StarfieldBg.tsx` | MODIFY | `shared.jsx → Starfield` + nebula layer |
| `radiant-app/src/components/ui/TabBarIcon.tsx` | CREATE | `shared.jsx → TabBar icons` |
| `radiant-app/src/app/(tabs)/index.tsx` (home) | MODIFY | `screens.jsx → ScreenHome` |
| `radiant-app/src/app/(tabs)/galaxy.tsx` | MODIFY | `screens.jsx → ScreenGalaxy` |
| `radiant-app/src/app/(tabs)/progress.tsx` | MODIFY | `screens2.jsx → ScreenProgress` |
| `radiant-app/src/app/(tabs)/missions.tsx` | MODIFY | `screens2.jsx → ScreenMissions` |
| `radiant-app/src/app/quiz.tsx` | MODIFY | `screens.jsx → ScreenLesson` |
| `radiant-app/src/app/reward.tsx` | MODIFY | `screens.jsx → ScreenReward` |
| `radiant-app/src/app/checkpoint.tsx` | MODIFY | `screens2.jsx → ScreenCheckpoint` |
| `radiant-app/src/app/onboarding/` | CREATE (3 files) | `screens2.jsx → ScreenOnboard*` |

---

## Task 1: Instalar dependências e carregar fonte Sora

**Files:**
- Modify: `radiant-app/package.json` (via expo install)
- Modify: `radiant-app/src/app/_layout.tsx`

- [ ] **Step 1: Instalar expo-blur e Sora**

```bash
cd radiant-app
npx expo install expo-blur @expo-google-fonts/sora expo-font
```

Expected: Dependências adicionadas em package.json sem erros.

- [ ] **Step 2: Carregar Sora no root layout**

Em `src/app/_layout.tsx`, adicionar após os imports existentes:

```typescript
import { useFonts, Sora_400Regular, Sora_500Medium, Sora_600SemiBold, Sora_700Bold, Sora_800ExtraBold } from '@expo-google-fonts/sora';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();
```

Dentro do componente `RootLayout`, antes do `return`:

```typescript
const [fontsLoaded] = useFonts({
  'Sora-Regular': Sora_400Regular,
  'Sora-Medium': Sora_500Medium,
  'Sora-SemiBold': Sora_600SemiBold,
  'Sora-Bold': Sora_700Bold,
  'Sora-ExtraBold': Sora_800ExtraBold,
});

useEffect(() => {
  if (fontsLoaded) SplashScreen.hideAsync();
}, [fontsLoaded]);

if (!fontsLoaded) return null;
```

- [ ] **Step 3: Verificar**

```bash
cd radiant-app && npx expo start --ios
```

Expected: App abre sem crash. Fonte Sora disponível.

- [ ] **Step 4: Commit**

```bash
git add radiant-app/package.json radiant-app/src/app/_layout.tsx
git commit -m "feat: add expo-blur and Sora font"
```

---

## Task 2: Atualizar tokens — theme.ts, styles.ts, motion.ts

**Files:**
- Modify: `radiant-app/src/ui/theme.ts`
- Modify: `radiant-app/src/ui/styles.ts`
- Modify: `radiant-app/src/ui/motion.ts`

- [ ] **Step 1: Expandir theme.ts com novos tokens**

Adicionar no objeto `colors` em `src/ui/theme.ts`:

```typescript
// Extensões do New Layout
primary2: '#3D6BFF',
accent2: '#6FE0F2',
bg2: '#EAF2FF',
textSecondary: '#5B6B85',
textTertiary: '#93A0B8',
border: '#E3ECF7',
border2: '#D6E0EE',
streak: '#FF6B2C',

// Galaxy extended
galaxyBg2: '#07091c',
galaxyBg3: '#0D1230',
galaxySurface2: 'rgba(255,255,255,0.08)',
galaxyBorder2: 'rgba(255,255,255,0.16)',
galaxyGlow: 'rgba(61,202,232,0.55)',
galaxyCtaStart: '#1535E8',
galaxyCtaEnd: '#3060FF',
```

- [ ] **Step 2: Adicionar helpers de tipografia em styles.ts**

Adicionar no arquivo `src/ui/styles.ts`:

```typescript
export const fontFamily = {
  sora: 'Sora-Regular',
  soraMedium: 'Sora-Medium',
  soraSemiBold: 'Sora-SemiBold',
  soraBold: 'Sora-Bold',
  soraExtraBold: 'Sora-ExtraBold',
};

export const textStyles = {
  h1: { fontFamily: fontFamily.soraExtraBold, fontSize: 40, lineHeight: 46, letterSpacing: -1 },
  h2: { fontFamily: fontFamily.soraExtraBold, fontSize: 28, lineHeight: 34, letterSpacing: -0.6 },
  h3: { fontFamily: fontFamily.soraBold, fontSize: 22, lineHeight: 28, letterSpacing: -0.4 },
  body: { fontFamily: fontFamily.soraMedium, fontSize: 15, lineHeight: 22 },
  bodyStrong: { fontFamily: fontFamily.soraBold, fontSize: 15, lineHeight: 22 },
  caption: { fontFamily: fontFamily.soraSemiBold, fontSize: 13, lineHeight: 18, letterSpacing: 0.1 },
  micro: { fontFamily: fontFamily.soraBold, fontSize: 11, lineHeight: 14, letterSpacing: 1, textTransform: 'uppercase' as const },
  label: { fontFamily: fontFamily.soraBold, fontSize: 10, lineHeight: 14, letterSpacing: 1, textTransform: 'uppercase' as const },
};
```

- [ ] **Step 3: Adicionar easings ao motion.ts**

Adicionar em `src/ui/motion.ts`:

```typescript
import { Easing } from 'react-native-reanimated';

export const easing = {
  out: Easing.bezier(0.22, 1, 0.36, 1),
  spring: Easing.bezier(0.34, 1.56, 0.64, 1),
  inOut: Easing.bezier(0.4, 0, 0.2, 1),
};
```

- [ ] **Step 4: TypeScript check**

```bash
cd radiant-app && npx tsc --noEmit
```

Expected: Sem erros de tipo.

- [ ] **Step 5: Commit**

```bash
git add radiant-app/src/ui/
git commit -m "feat: expand design tokens, typography system, and motion easings"
```

---

## Task 3: AppButton — variante galaxy + press animation

**Files:**
- Modify: `radiant-app/src/components/ui/AppButton.tsx`

- [ ] **Step 1: Atualizar AppButton com variante galaxy e micro-interaction**

Substituir o conteúdo de `AppButton.tsx`:

```typescript
import React from 'react';
import { StyleSheet, Text, ViewStyle, TextStyle } from 'react-native';
import Animated, {
  useAnimatedStyle, useSharedValue, withTiming
} from 'react-native-reanimated';
import { Pressable } from 'react-native';
import { colors } from '../../ui/theme';
import { fontFamily } from '../../ui/styles';
import { duration, easing } from '../../ui/motion';

type Variant = 'primary' | 'galaxy' | 'secondary' | 'ghost';

interface AppButtonProps {
  label: string;
  onPress?: () => void;
  variant?: Variant;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
}

export function AppButton({
  label, onPress, variant = 'primary',
  disabled = false, style, textStyle, icon,
}: AppButtonProps) {
  const scale = useSharedValue(1);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const onPressIn = () => {
    scale.value = withTiming(0.97, { duration: duration.micro, easing: easing.out });
  };
  const onPressOut = () => {
    scale.value = withTiming(1, { duration: duration.micro, easing: easing.out });
  };

  const bgStyle = {
    primary: {
      background: undefined,
      backgroundColor: undefined,
      shadowColor: colors.primary,
    },
    galaxy: {
      shadowColor: colors.accent,
    },
    secondary: {
      backgroundColor: 'rgba(255,255,255,0.08)',
    },
    ghost: {
      backgroundColor: 'transparent',
    },
  };

  return (
    <Animated.View style={[animStyle, style]}>
      <Pressable
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        disabled={disabled}
        style={[
          styles.base,
          variant === 'primary' && styles.primary,
          variant === 'galaxy' && styles.galaxy,
          variant === 'secondary' && styles.secondary,
          variant === 'ghost' && styles.ghost,
          disabled && styles.disabled,
        ]}
      >
        {icon && <>{icon}</>}
        <Text style={[
          styles.label,
          variant === 'secondary' && styles.labelSecondary,
          variant === 'ghost' && styles.labelGhost,
          textStyle,
        ]}>
          {label}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  base: {
    height: 56,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 24,
  },
  primary: {
    backgroundColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.45,
    shadowRadius: 16,
    elevation: 8,
  },
  galaxy: {
    backgroundColor: '#1535E8',
    shadowColor: '#3DCAE8',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.55,
    shadowRadius: 20,
    elevation: 10,
  },
  secondary: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  disabled: {
    opacity: 0.45,
  },
  label: {
    fontFamily: fontFamily.soraExtraBold,
    fontSize: 16,
    color: '#fff',
    letterSpacing: -0.1,
  },
  labelSecondary: {
    color: '#fff',
  },
  labelGhost: {
    color: colors.primary,
  },
});
```

- [ ] **Step 2: Verificar que componentes existentes ainda compilam**

```bash
cd radiant-app && npx tsc --noEmit
```

Expected: 0 erros.

- [ ] **Step 3: Commit**

```bash
git add radiant-app/src/components/ui/AppButton.tsx
git commit -m "feat: AppButton with galaxy variant and press micro-interaction"
```

---

## Task 4: StatPill — alinhado com o design

**Files:**
- Modify: `radiant-app/src/components/ui/StatPill.tsx`

- [ ] **Step 1: Atualizar StatPill**

```typescript
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../ui/theme';
import { fontFamily } from '../../ui/styles';

interface StatPillProps {
  icon: React.ReactNode;
  value: string;
  color: string;
  dark?: boolean;
}

export function StatPill({ icon, value, color, dark = false }: StatPillProps) {
  return (
    <View style={[styles.pill, dark ? styles.pillDark : styles.pillLight]}>
      <View style={{ tintColor: color }}>{icon}</View>
      <Text style={[styles.value, { color: dark ? '#fff' : colors.text }]}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    height: 30,
    paddingHorizontal: 11,
    borderRadius: 10,
  },
  pillLight: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: 'rgba(20,35,63,0.08)',
    shadowColor: '#14233F',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 0,
  },
  pillDark: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  value: {
    fontFamily: fontFamily.soraBold,
    fontSize: 13,
    letterSpacing: -0.1,
  },
});
```

- [ ] **Step 2: Commit**

```bash
git add radiant-app/src/components/ui/StatPill.tsx
git commit -m "feat: StatPill aligned with final design system"
```

---

## Task 5: ProgressRing — animação com spring easing

**Files:**
- Modify: `radiant-app/src/components/ui/ProgressRing.tsx`

- [ ] **Step 1: Atualizar ProgressRing com Reanimated**

```typescript
import React, { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  useSharedValue, withTiming, useAnimatedProps,
} from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';
import { colors } from '../../ui/theme';
import { duration, easing } from '../../ui/motion';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface ProgressRingProps {
  size?: number;
  value?: number; // 0-1
  stroke?: number;
  color?: string;
  trackColor?: string;
  children?: React.ReactNode;
  animate?: boolean;
}

export function ProgressRing({
  size = 96,
  value = 0.6,
  stroke = 8,
  color = colors.primary,
  trackColor = 'rgba(20,35,63,0.08)',
  children,
  animate = true,
}: ProgressRingProps) {
  const r = (size - stroke) / 2;
  const circumference = 2 * Math.PI * r;
  const progress = useSharedValue(animate ? 0 : value);

  useEffect(() => {
    if (animate) {
      progress.value = withTiming(value, {
        duration: duration.celebrate,
        easing: easing.spring,
      });
    } else {
      progress.value = value;
    }
  }, [value]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: circumference * (1 - progress.value),
  }));

  return (
    <View style={{ width: size, height: size, position: 'relative' }}>
      <Svg width={size} height={size} style={{ transform: [{ rotate: '-90deg' }] }}>
        <Circle
          cx={size / 2} cy={size / 2} r={r}
          stroke={trackColor} strokeWidth={stroke} fill="none"
        />
        <AnimatedCircle
          cx={size / 2} cy={size / 2} r={r}
          stroke={color} strokeWidth={stroke} fill="none"
          strokeDasharray={circumference}
          animatedProps={animatedProps}
          strokeLinecap="round"
        />
      </Svg>
      {children && (
        <View style={{
          position: 'absolute', inset: 0,
          alignItems: 'center', justifyContent: 'center',
        }}>
          {children}
        </View>
      )}
    </View>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add radiant-app/src/components/ui/ProgressRing.tsx
git commit -m "feat: ProgressRing with spring animation via Reanimated 4"
```

---

## Task 6: XrayPanel — painel SVG de raio-X

**Files:**
- Create: `radiant-app/src/components/ui/XrayPanel.tsx`

- [ ] **Step 1: Criar XrayPanel.tsx**

```typescript
import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Defs, RadialGradient, LinearGradient, Stop, Ellipse, Rect, Path, Circle, G } from 'react-native-svg';

interface XrayPanelProps {
  height?: number;
  highlight?: { x: number; y: number; r: number };
}

export function XrayPanel({ height = 220, highlight }: XrayPanelProps) {
  // Scale from design's 320×280 viewBox to actual width
  return (
    <View style={[styles.container, { height }]}>
      {/* Film grain overlay */}
      <View style={styles.grain} />
      <Svg
        viewBox="0 0 320 280"
        preserveAspectRatio="xMidYMid slice"
        style={StyleSheet.absoluteFill}
      >
        <Defs>
          <RadialGradient id="lung" cx="0.5" cy="0.5" r="0.5">
            <Stop offset="0%" stopColor="#3a4555" stopOpacity="0.9" />
            <Stop offset="100%" stopColor="#1a2230" stopOpacity="0.3" />
          </RadialGradient>
          <LinearGradient id="rib" x1="0" y1="0" x2="1" y2="0">
            <Stop offset="0%" stopColor="rgba(220,230,245,0.05)" />
            <Stop offset="50%" stopColor="rgba(220,230,245,0.45)" />
            <Stop offset="100%" stopColor="rgba(220,230,245,0.05)" />
          </LinearGradient>
        </Defs>
        {/* Lung fields */}
        <Ellipse cx="100" cy="135" rx="60" ry="85" fill="url(#lung)" />
        <Ellipse cx="220" cy="135" rx="60" ry="85" fill="url(#lung)" />
        {/* Heart shadow */}
        <Ellipse cx="155" cy="160" rx="42" ry="55" fill="rgba(60,70,90,0.55)" />
        {/* Spine */}
        <Rect x="156" y="50" width="8" height="200" fill="rgba(220,230,245,0.55)" rx="3" />
        {[60, 82, 104, 126, 148, 170, 192, 214, 236].map(y => (
          <Rect key={y} x="152" y={y} width="16" height="3" fill="rgba(255,255,255,0.4)" rx="1" />
        ))}
        {/* Ribs left */}
        {[70, 95, 120, 145, 170, 195].map(y => (
          <Path key={`l${y}`} d={`M152 ${y} Q 90 ${y+18}, 50 ${y+5}`} stroke="rgba(220,230,245,0.4)" strokeWidth="2.2" fill="none" />
        ))}
        {/* Ribs right */}
        {[70, 95, 120, 145, 170, 195].map(y => (
          <Path key={`r${y}`} d={`M168 ${y} Q 230 ${y+18}, 270 ${y+5}`} stroke="rgba(220,230,245,0.4)" strokeWidth="2.2" fill="none" />
        ))}
        {/* Clavicles */}
        <Path d="M60 60 Q 100 50, 152 65" stroke="rgba(220,230,245,0.6)" strokeWidth="3" fill="none" />
        <Path d="M168 65 Q 220 50, 260 60" stroke="rgba(220,230,245,0.6)" strokeWidth="3" fill="none" />
        {/* Highlight finding */}
        {highlight && (
          <G>
            <Circle cx={highlight.x} cy={highlight.y} r={highlight.r}
              fill="none" stroke="#FFB84D" strokeWidth="2" strokeDasharray="4 4" />
            <Circle cx={highlight.x} cy={highlight.y} r={highlight.r + 8}
              fill="none" stroke="rgba(255,184,77,0.3)" strokeWidth="1" />
          </G>
        )}
      </Svg>
      {/* Corner brackets */}
      <View style={[styles.bracket, styles.tl]} />
      <View style={[styles.bracket, styles.tr]} />
      <View style={[styles.bracket, styles.bl]} />
      <View style={[styles.bracket, styles.br]} />
    </View>
  );
}

const B = 12;
const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: '#11161d',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    position: 'relative',
  },
  grain: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.1,
  },
  bracket: {
    position: 'absolute',
    width: B,
    height: B,
  },
  tl: { top: 4, left: 4, borderTopWidth: 1, borderLeftWidth: 1, borderColor: '#9FE5F5' },
  tr: { top: 4, right: 4, borderTopWidth: 1, borderRightWidth: 1, borderColor: '#9FE5F5' },
  bl: { bottom: 4, left: 4, borderBottomWidth: 1, borderLeftWidth: 1, borderColor: '#9FE5F5' },
  br: { bottom: 4, right: 4, borderBottomWidth: 1, borderRightWidth: 1, borderColor: '#9FE5F5' },
});
```

- [ ] **Step 2: Adicionar ao barrel export**

Em `src/components/ui/index.ts`, adicionar:
```typescript
export { XrayPanel } from './XrayPanel';
```

- [ ] **Step 3: Commit**

```bash
git add radiant-app/src/components/ui/XrayPanel.tsx radiant-app/src/components/ui/index.ts
git commit -m "feat: XrayPanel SVG component for quiz screen"
```

---

## Task 7: Confetti — animação de recompensa

**Files:**
- Create: `radiant-app/src/components/ui/Confetti.tsx`

- [ ] **Step 1: Criar Confetti.tsx com Reanimated**

```typescript
import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue, withTiming, withDelay,
  useAnimatedStyle, Easing,
} from 'react-native-reanimated';

const { width: SW, height: SH } = Dimensions.get('window');
const COLORS = ['#2155FF', '#3DCAE8', '#F5A623', '#1A9C71', '#FFFFFF', '#6FE0F2'];

interface PieceProps {
  x: number;
  cx: number;
  rot: number;
  duration: number;
  delay: number;
  size: number;
  isCircle: boolean;
  color: string;
}

function ConfettiPiece({ x, cx, rot, duration: dur, delay, size, isCircle, color }: PieceProps) {
  const translateY = useSharedValue(-20);
  const translateX = useSharedValue(0);
  const rotate = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    const config = { duration: dur, easing: Easing.in(Easing.quad) };
    translateY.value = withDelay(delay, withTiming(SH + 20, config));
    translateX.value = withDelay(delay, withTiming(cx, config));
    rotate.value = withDelay(delay, withTiming(rot, config));
    opacity.value = withDelay(delay, withTiming(1, { duration: 50 }));
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { translateX: translateX.value },
      { rotate: `${rotate.value}deg` },
    ],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[
      animStyle,
      {
        position: 'absolute',
        left: `${x}%` as any,
        top: 0,
        width: size,
        height: isCircle ? size : size * 0.5,
        backgroundColor: color,
        borderRadius: isCircle ? size / 2 : 1,
      },
    ]} />
  );
}

interface ConfettiProps {
  count?: number;
  run?: boolean;
}

export function Confetti({ count = 50, run = true }: ConfettiProps) {
  const pieces = React.useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      x: Math.random() * 100,
      cx: (Math.random() - 0.5) * 200,
      rot: Math.random() * 720 - 360,
      duration: (Math.random() * 1.5 + 2) * 1000,
      delay: Math.random() * 600,
      size: Math.random() * 6 + 5,
      isCircle: Math.random() > 0.5,
      color: COLORS[i % COLORS.length],
    }));
  }, [count]);

  if (!run) return null;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {pieces.map((p, i) => <ConfettiPiece key={i} {...p} />)}
    </View>
  );
}
```

- [ ] **Step 2: Export**

```typescript
// src/components/ui/index.ts
export { Confetti } from './Confetti';
```

- [ ] **Step 3: Commit**

```bash
git add radiant-app/src/components/ui/Confetti.tsx radiant-app/src/components/ui/index.ts
git commit -m "feat: Confetti component with Reanimated 4 staggered fall"
```

---

## Task 8: Pixel — animações por estado

**Files:**
- Modify: `radiant-app/src/ui/characters/PixelIllustration.tsx`

- [ ] **Step 1: Adicionar state-driven animations ao PixelIllustration**

O componente já existe. Adicionar as animações do `shared.jsx → Pixel` usando Reanimated:

```typescript
// Ao início do componente, antes do return:
import { useEffect } from 'react';
import Animated, {
  useSharedValue, withRepeat, withTiming, withSequence,
  useAnimatedStyle,
} from 'react-native-reanimated';

// Dentro do componente PixelIllustration({ state, size }):
const translateY = useSharedValue(0);
const scale = useSharedValue(1);
const rotate = useSharedValue(0);

useEffect(() => {
  // Reset
  translateY.value = 0;
  scale.value = 1;
  rotate.value = 0;

  switch (state) {
    case 'idle':
      translateY.value = withRepeat(
        withSequence(
          withTiming(-8, { duration: 2250 }),
          withTiming(0, { duration: 2250 }),
        ), -1, false
      );
      break;
    case 'happy':
      translateY.value = withRepeat(
        withSequence(
          withTiming(-8, { duration: 1500 }),
          withTiming(0, { duration: 1500 }),
        ), -1, false
      );
      scale.value = 1.03;
      break;
    case 'guide':
      translateY.value = withRepeat(
        withSequence(
          withTiming(-8, { duration: 2500 }),
          withTiming(0, { duration: 2500 }),
        ), -1, false
      );
      rotate.value = -3;
      break;
    case 'thinking':
      translateY.value = withRepeat(
        withSequence(
          withTiming(-8, { duration: 3000 }),
          withTiming(0, { duration: 3000 }),
        ), -1, false
      );
      rotate.value = 4;
      scale.value = 0.97;
      break;
    case 'celebrate':
      scale.value = withRepeat(
        withSequence(
          withTiming(1.08, { duration: 600 }),
          withTiming(1, { duration: 600 }),
        ), -1, false
      );
      break;
    case 'oops':
      translateY.value = withRepeat(
        withSequence(
          withTiming(-6, { duration: 180 }),
          withTiming(6, { duration: 180 }),
          withTiming(-4, { duration: 180 }),
          withTiming(4, { duration: 180 }),
          withTiming(0, { duration: 180 }),
        ), -1, false
      );
      rotate.value = -2;
      scale.value = 0.96;
      break;
  }
}, [state]);

const animStyle = useAnimatedStyle(() => ({
  transform: [
    { translateY: translateY.value },
    { scale: scale.value },
    { rotate: `${rotate.value}deg` },
  ],
}));
```

- [ ] **Step 2: Envolver a imagem com Animated.View**

```typescript
<Animated.View style={[{ position: 'relative', width: size, height: size * 1.5 }, animStyle]}>
  {/* glow existente */}
  <Image source={require('./assets/pixel/pixel_core.png')} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
</Animated.View>
```

- [ ] **Step 3: Commit**

```bash
git add radiant-app/src/ui/characters/
git commit -m "feat: Pixel mascot state-driven animations with Reanimated 4"
```

---

## Task 9: StarfieldBg — adicionar camada de nebulosa

**Files:**
- Modify: `radiant-app/src/components/ui/StarfieldBackground.tsx` (ou onde existir)

- [ ] **Step 1: Verificar arquivo existente**

```bash
find radiant-app/src -name "*tarfield*" -o -name "*starfield*" | head -5
```

- [ ] **Step 2: Adicionar nebula layer**

Dentro do componente, após o View container e antes das estrelas, adicionar:

```typescript
{/* Nebula clouds */}
<View style={[StyleSheet.absoluteFill, { opacity: 1 }]}>
  <View style={{
    position: 'absolute',
    top: '10%', left: '15%',
    width: '55%', height: '40%',
    borderRadius: 999,
    backgroundColor: 'rgba(61,202,232,0.06)',
    transform: [{ scaleX: 1.5 }],
  }} />
  <View style={{
    position: 'absolute',
    bottom: '10%', right: '10%',
    width: '50%', height: '35%',
    borderRadius: 999,
    backgroundColor: 'rgba(33,85,255,0.10)',
    transform: [{ scaleX: 1.4 }],
  }} />
</View>
```

- [ ] **Step 3: Commit**

```bash
git add radiant-app/src/components/ui/
git commit -m "feat: add nebula layer to StarfieldBackground"
```

---

## Task 10: Tab Layout — adicionar aba Home

**Files:**
- Modify: `radiant-app/src/app/(tabs)/_layout.tsx`

- [ ] **Step 1: Adicionar tab Home e reordenar tabs**

Atualizar `_layout.tsx` para corresponder ao design (ordem: Home, Galaxy, Progress, Missions):

```typescript
// Antes das outras Tabs.Screen:
<Tabs.Screen
  name="index"
  options={{
    title: 'Home',
    href: '/(tabs)',
    tabBarIcon: ({ color }) => (
      <IconSymbol size={24} name="house.fill" color={color} />
    ),
  }}
/>
```

Remover o `href: null` atual do index e reordenar para: index → galaxy → progress → missions.

Atualizar `TAB_COLORS.active` para `'#2155FF'` (light mode) no `tabBarActiveTintColor`.

- [ ] **Step 2: Testar navegação**

```bash
npx expo start --ios
```

Expected: 4 tabs visíveis. Home exibe corretamente.

- [ ] **Step 3: Commit**

```bash
git add radiant-app/src/app/(tabs)/_layout.tsx
git commit -m "feat: add Home tab to navigation, reorder tabs per design"
```

---

## Task 11: Home Screen

**Files:**
- Modify: `radiant-app/src/app/(tabs)/index.tsx`

- [ ] **Step 1: Implementar ScreenHome em React Native**

Traduzir `screens.jsx → ScreenHome` para React Native. Estrutura principal:

```typescript
import React from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/src/ui/theme';
import { textStyles, space } from '@/src/ui/styles';
import { StatPill } from '@/src/components/ui/StatPill';
import { ProgressRing } from '@/src/components/ui/ProgressRing';
import { AppButton } from '@/src/components/ui/AppButton';
import { PixelIllustration } from '@/src/ui/characters/PixelIllustration';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.dateLabel}>TUESDAY · DAY 24</Text>
            <Text style={styles.greeting}>Hi, Dr. Alvarez</Text>
          </View>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>MA</Text>
          </View>
        </View>

        {/* Stat row */}
        <View style={styles.statRow}>
          <StatPill icon={<FlameIcon />} value="12" color="#FF6B2C" />
          <StatPill icon={<BoltIcon />} value="2,840 XP" color="#F5A623" />
          <StatPill icon={<HeartIcon />} value="5" color="#FF3B30" />
        </View>

        {/* Hero card */}
        <View style={styles.heroCard}>
          {/* halftone BG */}
          <View style={styles.heroOverlay} />
          <View style={styles.heroContent}>
            <View style={{ flex: 1 }}>
              <Text style={styles.heroLabel}>TODAY'S MISSION</Text>
              <Text style={styles.heroTitle}>Pulmonary nodules{'\n'}on chest CT</Text>
              <View style={styles.heroTags}>
                <View style={styles.tag}><Text style={styles.tagText}>8 cases</Text></View>
                <View style={styles.tag}><Text style={styles.tagText}>~12 min</Text></View>
                <View style={styles.tag}><Text style={styles.tagText}>+120 XP</Text></View>
              </View>
            </View>
            <PixelIllustration state="happy" size={92} />
          </View>
          <AppButton label="Start lesson" variant="primary" style={styles.heroBtn}
            icon={<PlayIcon />}
            textStyle={{ color: colors.primary }}
          />
        </View>

        {/* Continue journey */}
        <View style={styles.journeyCard}>
          <ProgressRing size={64} value={0.55} stroke={6} color={colors.primary}>
            <Text style={styles.ringText}>55%</Text>
          </ProgressRing>
          <View style={{ flex: 1, marginLeft: 14 }}>
            <Text style={styles.cardLabel}>CONTINUE CHAPTER</Text>
            <Text style={styles.cardTitle}>Thoracic Imaging</Text>
            <Text style={styles.cardSub}>11 of 20 lessons</Text>
          </View>
          <View style={styles.arrowBtn}>
            <ArrowRight />
          </View>
        </View>

        {/* Stats trio */}
        <View style={styles.statsGrid}>
          {[
            { l: 'Sessions', v: '47', s: 'this month' },
            { l: 'Accuracy', v: '84%', s: '+3% wk' },
            { l: 'Mastered', v: '23', s: 'topics' },
          ].map(s => (
            <View key={s.l} style={styles.statCard}>
              <Text style={styles.statLabel}>{s.l.toUpperCase()}</Text>
              <Text style={styles.statValue}>{s.v}</Text>
              <Text style={styles.statSub}>{s.s}</Text>
            </View>
          ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
```

Criar os estilos seguindo os valores exatos de `screens.jsx`:
- heroCard: `borderRadius: 24, padding: 20, backgroundColor com gradiente`
- Para gradiente no heroCard usar `expo-linear-gradient` (já instalado via Expo)
- statCard: `borderRadius: 16, padding: 12`

- [ ] **Step 2: Verificar no simulador**

```bash
npx expo start --ios
```

Expected: Home screen visível com HUD, mascote, hero card e stats.

- [ ] **Step 3: Commit**

```bash
git add radiant-app/src/app/(tabs)/index.tsx
git commit -m "feat: Home screen — final design system implementation"
```

---

## Task 12: Lesson/Quiz Screen — XrayPanel + answer feedback

**Files:**
- Modify: `radiant-app/src/app/quiz.tsx`

- [ ] **Step 1: Integrar XrayPanel e feedback drawer**

Elementos chave do `screens.jsx → ScreenLesson`:
- Progress bar no topo com gradiente `#2155FF → #3DCAE8`, altura 10px, borderRadius 999
- `XrayPanel` height=220 com highlight `{ x: 230, y: 110, r: 18 }`
- Opções de resposta: `borderRadius: 16, padding: 12, gap: 12`
- Estados de cor: idle (border #E3ECF7), correct (bg #E5F7EF, border #1A9C71), wrong (bg #FCEAEF, border #D8506F)
- Feedback drawer: `position: absolute, bottom: 0, borderRadius: '24px 24px 0 0'`
- Wrong answer: `animation shake` → usar `useShakeError` do `motion.ts` existente
- Correct answer: scale pop via `useScalePop`

- [ ] **Step 2: Verificar interatividade**

Navegar até o quiz. Selecionar resposta correta e incorreta. Validar animações de feedback.

- [ ] **Step 3: Commit**

```bash
git add radiant-app/src/app/quiz.tsx
git commit -m "feat: Quiz screen with XrayPanel, answer states and feedback drawer"
```

---

## Task 13: Reward Screen — Confetti + XP counter

**Files:**
- Modify: `radiant-app/src/app/reward.tsx`

- [ ] **Step 1: Implementar ScreenReward**

Elementos de `screens.jsx → ScreenReward`:
- Background: `radial-gradient(ellipse at 50% 30%, #1a2570 0%, #0a0e2c 50%, #03030d 100%)`
  → Use `expo-linear-gradient` com colors aproximados
- `StarfieldBackground` com `density={70}`
- `Confetti count={50} run={true}`
- Pixel `state="celebrate"` size={180}, posição `top: 80, left: 50%, centered`
- Radial burst: View com `borderRadius: 999`, largura 320, altura 320, centrado atrás do Pixel
- Reward cards (XP, streak, level):
  ```
  XP card: bg rgba(245,166,35,0.25), border rgba(245,166,35,0.4), borderRadius 18
  Streak card: bg rgba(255,107,44,0.15), border rgba(255,107,44,0.35)
  Level card: bg rgba(61,202,232,0.12), border rgba(61,202,232,0.35)
  ```
- XP counter animado: `useEffect` com intervalo de 18ms, incrementando 6 por tick até 145
- Título com fadeUp animation (delay 200ms)
- Reward stack com fadeUp animation (delay 400ms)

- [ ] **Step 2: Testar fluxo**

Completar uma lição → navegar para reward. Validar:
- Confetti cai
- Pixel está no estado celebrate
- XP counter anima de 0 → 145
- Cards aparecem com fade up staggerado

- [ ] **Step 3: Commit**

```bash
git add radiant-app/src/app/reward.tsx
git commit -m "feat: Reward screen with Confetti, animated XP counter and staggered cards"
```

---

## Task 14: Galaxy Screen — Journey Map

**Files:**
- Modify: `radiant-app/src/app/(tabs)/galaxy.tsx`

- [ ] **Step 1: Implementar ScreenGalaxy**

Elementos de `screens.jsx → ScreenGalaxy`:
- Background: `radial-gradient(ellipse at 50% 90%, #0a0e2c 0%, #03030d 70%)` → LinearGradient + Starfield
- SVG track path com `strokeDasharray="1.6 1.4"` usando react-native-svg
- 7 nodes com posições absolutas em `%` dentro de um ScrollView com `position: relative`
- Estados dos nodes:
  - `done`: bg `linear-gradient(140deg, #1A9C71, #0d7256)`, ícone check
  - `current`: bg `linear-gradient(140deg, #3060FF, #1535E8)`, border `#3DCAE8`, glow, ícone play
  - `boss`: bg `linear-gradient(140deg, #FF6B2C, #D8506F)`, ícone star
  - `locked`: bg `rgba(255,255,255,0.04)`, ícone lock
- Pixel `state="guide"` size=70 próximo ao node atual
- Bottom CTA card com `backdropFilter: blur(18px)` → use `expo-blur BlurView`

- [ ] **Step 2: Verificar mapa**

Navegar para Galaxy tab. Todos os nodes visíveis com estados corretos.

- [ ] **Step 3: Commit**

```bash
git add radiant-app/src/app/(tabs)/galaxy.tsx
git commit -m "feat: Galaxy journey map with SVG track, nodes and BlurView CTA"
```

---

## Task 15: Onboarding Flow

**Files:**
- Create: `radiant-app/src/app/onboarding/index.tsx`
- Create: `radiant-app/src/app/onboarding/value.tsx`
- Create: `radiant-app/src/app/onboarding/goal.tsx`

- [ ] **Step 1: Criar pasta e telas de onboarding**

Criar `src/app/onboarding/` com 3 telas baseadas em `screens2.jsx → ScreenOnboard*`.

**index.tsx (Welcome):**
- Galaxy dark background com Starfield
- Pixel `state="guide"` size={200}, posição `top: 90`
- Speech bubble glass: `bg rgba(255,255,255,0.08)`, `backdropFilter: blur(14px)`, BorderRadius 14
- Dots de paginação: 4 dots, ativo = largo (22px), inativo = 6px
- CTA: `btn-galaxy` → `AppButton variant="galaxy"`

**value.tsx (Value props):**
- 3 feature cards com `fadeUp` staggerado (delays: 0ms, 120ms, 240ms)
- Pixel `state="happy"` size={70} no canto inferior direito

**goal.tsx (Specialty + Daily goal):**
- Lista de 5 especialidades com estado selecionado (border #3DCAE8, glow)
- 3 daily goal options (5/10/20 min)
- CTA "Build my plan →"

- [ ] **Step 2: Configurar rota de onboarding**

Em `src/app/_layout.tsx`, certificar que `onboarding/` está acessível no Stack.

- [ ] **Step 3: Verificar fluxo**

Navegar por todas as 3 telas de onboarding. Pixel aparece correto em cada uma.

- [ ] **Step 4: Commit**

```bash
git add radiant-app/src/app/onboarding/
git commit -m "feat: Onboarding flow (3 screens) with Pixel guide and specialty selection"
```

---

## Task 16: Progress Screen

**Files:**
- Modify: `radiant-app/src/app/(tabs)/progress.tsx`

- [ ] **Step 1: Implementar ScreenProgress**

Elementos de `screens2.jsx → ScreenProgress`:
- Streak calendar: 7 dias com tiles quadrados (1:1 aspect ratio), ativos com gradiente `#FF8A4C → #FF6B2C` e shadow
- Accuracy bar chart: 8 barras em `flex: 1`, último bar com `linear-gradient #3DCAE8 → #2155FF`
- Topics mastered: cards com ProgressBar inline, cor dinâmica por porcentagem (verde/cyan/amber)
- Stats 2×2 grid: Total XP e Sessions cards

- [ ] **Step 2: Commit**

```bash
git add radiant-app/src/app/(tabs)/progress.tsx
git commit -m "feat: Progress screen with streak calendar, accuracy chart and mastery list"
```

---

## Task 17: Missions Screen

**Files:**
- Modify: `radiant-app/src/app/(tabs)/missions.tsx`

- [ ] **Step 1: Implementar ScreenMissions**

Elementos de `screens2.jsx → ScreenMissions`:
- Streak banner: `linear-gradient(140deg, #FF8A4C, #FF6B2C)`, halftone pattern, shadow
- Mission item: icon 44×44, ProgressBar 8px com spring animation, XP badge
- Estados done: ícone check verde, texto `textDecorationLine: 'line-through'`
- Daily/Weekly sections com contadores

- [ ] **Step 2: Commit**

```bash
git add radiant-app/src/app/(tabs)/missions.tsx
git commit -m "feat: Missions screen with streak banner, daily and weekly mission lists"
```

---

## Task 18: Checkpoint Screen

**Files:**
- Modify: `radiant-app/src/app/checkpoint.tsx`

- [ ] **Step 1: Implementar ScreenCheckpoint**

Elementos de `screens2.jsx → ScreenCheckpoint`:
- Light mode (não galaxy): `linear-gradient(180deg, #EAF2FF 0%, #F5FAFF 100%)`
- Confetti `count={30}` leve
- Pixel `state="celebrate"` size={170}
- Achievement card: badge circular dourado com `orbit-spin dashed border`
- XP earned: `bg #FFF6E3`, `border rgba(245,166,35,0.3)`
- Share link ghost button

- [ ] **Step 2: Commit**

```bash
git add radiant-app/src/app/checkpoint.tsx
git commit -m "feat: Checkpoint screen with achievement card and celebrate state"
```

---

## Verificação End-to-End

Após completar todas as tasks:

- [ ] **Fluxo completo:** Onboarding → Home → Galaxy → Lesson → Checkpoint → Reward
- [ ] **Tabs:** Home, Galaxy, Progress, Missions navegam corretamente
- [ ] **Modo dark:** Galaxy screen, Reward, Onboarding em dark; Home, Progress, Missions, Checkpoint em light
- [ ] **Mascote:** Pixel aparece nos contextos corretos com animações por estado
- [ ] **Micro-interações:** Botões escalam ao pressionar, answers flasheiam, XP counter anima
- [ ] **Tokens:** Nenhum valor hardcoded — tudo referencia `colors.*`, `textStyles.*`, `space.*`
- [ ] **Performance:** Sem dropped frames no Galaxy map e no Reward screen (testar em device)

```bash
cd radiant-app && npx expo start --ios
```

---

## Notas de Tradução Web → React Native

| Web | React Native |
|-----|-------------|
| `position: absolute, inset: 0` | `...StyleSheet.absoluteFill` |
| `backdropFilter: blur(18px)` | `<BlurView intensity={18} tint="dark">` de expo-blur |
| `linear-gradient(...)` | `<LinearGradient>` de expo-linear-gradient |
| `CSS animation: float-y` | `withRepeat(withSequence(...))` Reanimated |
| `CSS animation: shake` | `useShakeError()` hook do motion.ts |
| `CSS animation: pop` | `withSequence(withTiming(1.06), withTiming(1))` |
| `CSS animation: fadeUp` | `useFadeInUp()` hook do motion.ts |
| `grid-template-columns: 1fr 1fr 1fr` | `flexDirection: 'row', flexWrap: 'wrap'` com `width: '33.3%'` |
| `gap: 8` | `gap: 8` (suportado no RN 0.71+) |
| `opacity: 0.7 (dim state)` | `opacity: 0.7` no StyleSheet |
| `fontFamily: 'Sora'` | `fontFamily: fontFamily.soraExtraBold` |
| `box-shadow` | `shadowColor + shadowOffset + shadowOpacity + shadowRadius` |
| `border-radius: 50%` | `borderRadius: size / 2` |
| `overflow: hidden` | `overflow: 'hidden'` |
