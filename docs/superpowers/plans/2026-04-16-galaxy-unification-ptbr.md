# Galaxy Dark Theme — Unificação + Tradução PT-BR — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

> **Status: ✅ CONCLUÍDO — 2026-04-17** — Todas as 7 tasks executadas. Commits `bf18895` → `2313dd9` no branch `codex/wave1-hardening-api-smoke`. Ver `docs/archive/EXECUTION_STATUS_2026-04-17.md`.

**Goal:** Convert all remaining light-theme screens to the galaxy dark theme and translate every remaining English UI string to Brazilian Portuguese.

**Architecture:** Each screen drops `SafeAreaView` as root and wraps with `View(root) + StarfieldBackground + SafeAreaView(edges:['top']) + HUD + ScrollView`. Light-theme primitives (`SurfaceCard`, `StatItem`, `colors.*`) are replaced with galaxy-styled plain `View`s, a local `GalaxyStatRow` component, and `galaxyColors.*` tokens. No new shared components — YAGNI.

**Tech Stack:** React Native / Expo, TypeScript, `galaxyColors` from `src/ui/theme.ts`, `StarfieldBackground` + `HUD` from `src/ui/components/`, `GamificationService` for HUD data.

---

## Reference Files (read-only — do not modify)

| File | Purpose |
|---|---|
| `src/features/rewards/screens/RewardScreen.tsx` | Already-converted screen — use as the exact structural template |
| `src/ui/components/StarfieldBackground.tsx` | Props: `backgroundColor`, `starCount` |
| `src/ui/components/HUD.tsx` | Props: `totalXp`, `streakDays`, `hearts`, `maxHearts`, `compact?` |
| `src/ui/theme.ts` | `galaxyColors` token object |
| `src/features/gamification/services/GamificationService.ts` | `GamificationService.getSnapshot()` → `GamificationSnapshot` |
| `src/types/gamification.ts` | `GamificationSnapshot` type |

## Galaxy Dark Pattern (copy from RewardScreen)

```tsx
// Root structure — replaces SafeAreaView as root
<View style={styles.root}>
  <StarfieldBackground backgroundColor={galaxyColors.background} starCount={120} />
  <SafeAreaView style={styles.safe} edges={['top']}>
    <HUD
      totalXp={gamification?.totalXp ?? 0}
      streakDays={gamification?.streakDays ?? 0}
      hearts={gamification?.hearts ?? 5}
      maxHearts={gamification?.maxHearts ?? 5}
    />
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      {/* screen content */}
    </ScrollView>
  </SafeAreaView>
</View>

// Required state
const [gamification, setGamification] = useState<GamificationSnapshot | null>(null);
useEffect(() => {
  void GamificationService.getSnapshot().then(setGamification);
}, []);

// Required styles
root: { flex: 1, backgroundColor: galaxyColors.background },
safe: { flex: 1 },
content: { padding: space.s3, gap: space.s3, paddingBottom: space.s5 },
```

## GalaxyStatRow (define locally in each screen that uses it)

```tsx
interface GalaxyStatRowProps {
  icon?: React.ReactNode;
  label: string;
  value: string;
}

function GalaxyStatRow({ icon, label, value }: GalaxyStatRowProps) {
  return (
    <View style={galaxyStatRowStyles.row}>
      {icon ? <View style={galaxyStatRowStyles.icon}>{icon}</View> : null}
      <View style={galaxyStatRowStyles.textBlock}>
        <Text style={galaxyStatRowStyles.label}>{label}</Text>
        <Text style={galaxyStatRowStyles.value}>{value}</Text>
      </View>
    </View>
  );
}

const galaxyStatRowStyles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: space.s2 },
  icon: { width: 28, alignItems: 'center', justifyContent: 'center' },
  textBlock: { flexDirection: 'row', alignItems: 'baseline', flexWrap: 'wrap', gap: 6, flex: 1 },
  label: { fontSize: 11, fontWeight: '600', color: galaxyColors.textSecondary, textTransform: 'uppercase', letterSpacing: 0.5 },
  value: { fontSize: 14, fontWeight: '700', color: galaxyColors.textPrimary },
});
```

## Galaxy Card Styles (use these instead of SurfaceCard variants)

```ts
heroCard: {
  backgroundColor: galaxyColors.surface,
  borderRadius: radius.rLg,
  borderWidth: 1,
  borderColor: galaxyColors.border,
  padding: space.s3,
  gap: space.s3,
  overflow: 'hidden',
},
sectionCard: {
  backgroundColor: galaxyColors.surface,
  borderRadius: radius.rLg,
  borderWidth: 1,
  borderColor: galaxyColors.border,
  padding: space.s3,
  gap: space.s2,
},
actionCard: {
  backgroundColor: 'rgba(255,255,255,0.03)',
  borderRadius: radius.rLg,
  borderWidth: 1,
  borderColor: galaxyColors.border,
  padding: space.s3,
  gap: space.s2,
},
iconButton: {
  width: ICON_BUTTON_SIZE,
  height: ICON_BUTTON_SIZE,
  borderRadius: radius.rXl,
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'rgba(255,255,255,0.07)',
  borderWidth: 1,
  borderColor: galaxyColors.border,
},
headerLabel: {
  fontSize: 13,
  fontWeight: '800',
  color: 'rgba(255,255,255,0.35)',
  letterSpacing: 3,
  textTransform: 'uppercase',
},
```

## PT-BR Translation Table

| English (current in code) | Portuguese (target) |
|---|---|
| `"Review"` (header label) | `"Revisão"` |
| `"Review Quiz"` (header label) | `"Quiz de Revisão"` |
| `"Radiology Journey"` (eyebrow prop) | `"Jornada de Radiologia"` |
| `"Spaced repetition"` (eyebrow prop) | `"Repetição espaçada"` |
| `"Learning Road"` (error messages) | `"jornada"` |
| `"Reward"` (header label) | `"CONQUISTA"` |
| `"Lesson Flow"` (fallback title string) | `"Fluxo da Lição"` |
| `"Checkpoint"` (header label) | keep as-is (brand term) |

---

## Files Modified

| File | Change |
|---|---|
| `src/features/checkpoint/screens/CheckpointScreen.tsx` | LIGHT → galaxy + PT-BR |
| `src/features/checkpoint/screens/CheckpointScreen.flow.test.tsx` | Remove stale StatItem/SurfaceCard mocks |
| `src/features/review/screens/ReviewScreen.tsx` | LIGHT → galaxy + PT-BR |
| `src/features/review/screens/ReviewScreen.flow.test.tsx` | Remove stale StatItem/SurfaceCard mocks |
| `src/features/quiz/screens/QuizScreen.tsx` | MIXED → full galaxy + load gamification for HUD + PT-BR |
| `src/features/quiz/screens/QuizScreen.flow.test.tsx` | Remove stale StatItem/SurfaceCard mocks; expand GamificationService mock |
| `src/features/journey/components/JourneyHero.tsx` | LIGHT → galaxy (dependency of JourneyHomeScreen) |
| `src/features/journey/screens/JourneyHomeScreen.tsx` | LIGHT → galaxy + PT-BR |
| `src/features/journey/screens/JourneyHomeScreen.flow.test.tsx` | Remove stale StatItem/SurfaceCard mocks |
| `src/features/lesson-flow/screens/LessonFlowScreen.tsx` | LIGHT → galaxy + PT-BR |
| `src/features/home/screens/HomeScreen.tsx` | custom dark #000 → galaxyColors + PT-BR |

---

## Task 1: CheckpointScreen — Galaxy + PT-BR

**Files:**
- Modify: `src/features/checkpoint/screens/CheckpointScreen.tsx`
- Modify: `src/features/checkpoint/screens/CheckpointScreen.flow.test.tsx`

### Steps

- [ ] **Step 1: Read the current file**

```bash
cat -n src/features/checkpoint/screens/CheckpointScreen.tsx
```

- [ ] **Step 2: Write the test — verify header label and complete action are visible**

In `CheckpointScreen.flow.test.tsx`:

Remove the stale `jest.mock` blocks for `StatItem` and `SurfaceCard` (lines 39-55). Those components are no longer imported after conversion. Add a mock for `StarfieldBackground` and `HUD` and `GamificationService`:

```ts
jest.mock('../../../ui/components/StarfieldBackground', () => ({
  StarfieldBackground: () => null,
}));

jest.mock('../../../ui/components/HUD', () => ({
  HUD: () => null,
}));

jest.mock('../../gamification/services/GamificationService', () => ({
  GamificationService: {
    getSnapshot: jest.fn().mockResolvedValue({
      totalXp: 120,
      streakDays: 3,
      hearts: 5,
      maxHearts: 5,
    }),
  },
}));
```

Keep all other mocks unchanged. The existing test assertion (`expect(screen.getByText('Pronto para validar esta etapa?')).toBeTruthy()`) still passes with the new code.

- [ ] **Step 3: Run existing test to confirm it currently passes**

```bash
cd /Users/anderson/Documents/Radiant/radiant-app
npx jest src/features/checkpoint/screens/CheckpointScreen.flow.test.tsx --no-coverage
```

Expected: PASS (before any changes to the screen)

- [ ] **Step 4: Rewrite CheckpointScreen.tsx**

Replace the full file content. The logic/JSX structure is identical — only imports, root layout, card primitives, and colors change:

```tsx
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { AppButton } from '../../../components/ui/AppButton';
import { PixelHeroSplit } from '../../../components/ui/PixelHeroSplit';
import { StarfieldBackground } from '../../../ui/components/StarfieldBackground';
import { HUD } from '../../../ui/components/HUD';
import { JourneyProgressService } from '../../journey/services/JourneyProgressService';
import { canOpenJourneyNode, getJourneyNodeHref } from '../../journey/services/JourneyNodeRouting';
import type { JourneyNode, JourneySnapshot } from '../../../types/journey';
import { GamificationService } from '../../gamification/services/GamificationService';
import type { GamificationSnapshot } from '../../../types/gamification';
import { galaxyColors } from '../../../ui/theme';
import { layout, radius, space, typography } from '../../../ui/styles';
import { PaywallService, type PaywallOffer } from '../../paywall/PaywallService';
import { PaywallOfferCard } from '../../paywall/components/PaywallOfferCard';
import { UpgradeInterestService } from '../../paywall/UpgradeInterestService';
```

Replace the `GalaxyStatRow` local component (add before `findFallbackCheckpoint`):

```tsx
// ── GalaxyStatRow ─────────────────────────────────────────────────
interface GalaxyStatRowProps {
  icon?: React.ReactNode;
  label: string;
  value: string;
}

function GalaxyStatRow({ icon, label, value }: GalaxyStatRowProps) {
  return (
    <View style={galaxyStatRowStyles.row}>
      {icon ? <View style={galaxyStatRowStyles.icon}>{icon}</View> : null}
      <View style={galaxyStatRowStyles.textBlock}>
        <Text style={galaxyStatRowStyles.label}>{label}</Text>
        <Text style={galaxyStatRowStyles.value}>{value}</Text>
      </View>
    </View>
  );
}

const galaxyStatRowStyles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: space.s2 },
  icon: { width: 28, alignItems: 'center', justifyContent: 'center' },
  textBlock: { flexDirection: 'row', alignItems: 'baseline', flexWrap: 'wrap', gap: 6, flex: 1 },
  label: { fontSize: 11, fontWeight: '600', color: galaxyColors.textSecondary, textTransform: 'uppercase', letterSpacing: 0.5 },
  value: { fontSize: 14, fontWeight: '700', color: galaxyColors.textPrimary },
});
```

Add gamification state inside `CheckpointScreen` (after existing state declarations):

```tsx
const [gamification, setGamification] = useState<GamificationSnapshot | null>(null);

useEffect(() => {
  void GamificationService.getSnapshot().then(setGamification);
}, []);
```

Replace the loading state render:

```tsx
if (loading) {
  return (
    <View style={styles.root}>
      <StarfieldBackground backgroundColor={galaxyColors.background} starCount={120} />
      <SafeAreaView style={styles.safe}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={galaxyColors.ctaGradientEnd} />
        </View>
      </SafeAreaView>
    </View>
  );
}
```

Replace the empty state render:

```tsx
if (!checkpointNode || !activeUnit) {
  return (
    <View style={styles.root}>
      <StarfieldBackground backgroundColor={galaxyColors.background} starCount={120} />
      <SafeAreaView style={styles.safe}>
        <View style={[layout.container, styles.emptyState]}>
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>Checkpoint indisponível</Text>
            <Text style={styles.emptyBody}>
              Não existe um checkpoint elegível neste momento. Volte para a jornada e siga o próximo nó liberado.
            </Text>
            <AppButton onPress={() => router.replace('/(tabs)')} style={styles.fullWidthButton}>
              Voltar para jornada
            </AppButton>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}
```

Replace the main return:

```tsx
return (
  <View style={styles.root}>
    <StarfieldBackground backgroundColor={galaxyColors.background} starCount={120} />
    <SafeAreaView style={styles.safe} edges={['top']}>
      <HUD
        totalXp={gamification?.totalXp ?? 0}
        streakDays={gamification?.streakDays ?? 0}
        hearts={gamification?.hearts ?? 5}
        maxHearts={gamification?.maxHearts ?? 5}
      />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <Pressable
            onPress={() => router.back()}
            accessibilityRole="button"
            accessibilityLabel="Voltar"
            style={styles.iconButton}
          >
            <MaterialIcons name="close" size={22} color={galaxyColors.textPrimary} />
          </Pressable>
          <Text style={styles.headerLabel}>Checkpoint</Text>
          <View style={styles.iconSpacer} />
        </View>

        <View style={styles.heroCard}>
          <PixelHeroSplit
            eyebrow="Jornada de Radiologia"
            message={completed
              ? 'Checkpoint fechado. A próxima etapa já está liberada.'
              : 'Antes de avançar, valida este trecho da unidade e trava a base.'}
            ringValue={completedPrimaryNodes}
            ringTotal={totalPrimaryNodes}
            ringLabel="Blocos concluídos"
            state={completed ? 'celebrate' : 'guide'}
            tier={completed ? 'advanced' : 'intermediate'}
            accessibilityLabel="Pixel apresentando o checkpoint"
          />
          <View style={styles.heroFooter}>
            <Text style={styles.heroFooterLabel}>Unidade ativa</Text>
            <Text style={styles.heroFooterValue}>{activeUnit.title}</Text>
          </View>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>{checkpointNode.title}</Text>
          <Text style={styles.sectionBody}>
            {checkpointNode.description ?? 'Feche este marco para liberar o próximo trecho da trilha.'}
          </Text>
          <View style={styles.statsList}>
            <GalaxyStatRow
              icon={<MaterialIcons name="task-alt" size={20} color={galaxyColors.ctaGradientEnd} />}
              label="Progresso"
              value={`${completedPrimaryNodes} de ${totalPrimaryNodes} marcos-base concluídos`}
            />
            <GalaxyStatRow
              icon={<MaterialIcons name="refresh" size={20} color={galaxyColors.ctaGradientEnd} />}
              label="Revisão"
              value={dueReviewCount > 0 ? `${dueReviewCount} revisão pendente nesta unidade` : 'Nenhuma revisão crítica bloqueando esta etapa'}
            />
            <GalaxyStatRow
              icon={<MaterialIcons name="bolt" size={20} color={galaxyColors.ctaGradientEnd} />}
              label="Destravamento"
              value={completed ? 'Próximo nó já liberado' : 'Concluir este checkpoint libera a próxima lição'}
            />
          </View>
        </View>

        {error ? (
          <View style={styles.errorCard}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        {paywallOffer ? (
          <PaywallOfferCard
            offer={paywallOffer}
            submitting={paywallSubmitting}
            onPrimary={() => {
              if (paywallSubmitting) { return; }
              void (async () => {
                try {
                  setPaywallSubmitting(true);
                  const interest = await UpgradeInterestService.captureInterest(paywallOffer, { lessonId: checkpointNode.id });
                  await PaywallService.recordOutcome(paywallOffer, 'cta_tap', { lessonId: checkpointNode.id });
                  setPaywallFeedback(
                    interest.email
                      ? `Interesse registrado para ${interest.email}. Vamos avisar quando o Radiant Plus abrir.`
                      : 'Interesse registrado neste dispositivo. Vamos usar esse sinal para abrir o Radiant Plus no momento certo.'
                  );
                } catch (cause) {
                  console.error('[CheckpointScreen] Failed to capture paywall interest:', cause);
                  setPaywallFeedback('Nao foi possivel registrar seu interesse agora. Tente novamente em outro momento.');
                } finally {
                  setPaywallOffer(null);
                  setPaywallSubmitting(false);
                }
              })();
            }}
            onDismiss={() => {
              if (paywallSubmitting) { return; }
              void PaywallService.recordOutcome(paywallOffer, 'dismissed', { lessonId: checkpointNode.id });
              setPaywallOffer(null);
            }}
          />
        ) : null}

        {paywallFeedback ? (
          <View style={styles.messageCard}>
            <Text style={styles.messageText}>{paywallFeedback}</Text>
          </View>
        ) : null}

        <View style={styles.actionCard}>
          <Text style={styles.actionTitle}>{completed ? 'Checkpoint concluído' : 'Pronto para validar esta etapa?'}</Text>
          <Text style={styles.actionBody}>
            {completed
              ? 'Seu progresso foi sincronizado localmente e a jornada já recalculou o melhor próximo passo.'
              : 'O checkpoint não muda o modelo pedagógico. Ele apenas consolida a etapa atual e protege a progressão da trilha.'}
          </Text>
          {completed ? (
            <AppButton onPress={nextAction.action} style={styles.fullWidthButton}>
              {nextAction.label}
            </AppButton>
          ) : (
            <>
              <AppButton onPress={() => void handleComplete()} disabled={submitting} style={styles.fullWidthButton}>
                {submitting ? 'Concluindo checkpoint...' : 'Concluir checkpoint'}
              </AppButton>
              <AppButton
                onPress={() => router.replace('/(tabs)')}
                variant="ghost"
                style={styles.fullWidthButton}
                textStyle={{ color: galaxyColors.textSecondary }}
              >
                Voltar para jornada
              </AppButton>
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  </View>
);
```

Replace the full StyleSheet:

```ts
const ICON_BUTTON_SIZE = 36;
const SCREEN_MAX_WIDTH = 720;

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: galaxyColors.background },
  safe: { flex: 1 },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  content: { padding: space.s3, gap: space.s3, paddingBottom: space.s5 },
  headerRow: { ...layout.rowBetween, width: '100%', maxWidth: SCREEN_MAX_WIDTH, alignSelf: 'center' },
  iconButton: {
    width: ICON_BUTTON_SIZE, height: ICON_BUTTON_SIZE, borderRadius: radius.rXl,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.07)', borderWidth: 1, borderColor: galaxyColors.border,
  },
  iconSpacer: { width: ICON_BUTTON_SIZE, height: ICON_BUTTON_SIZE },
  headerLabel: { fontSize: 13, fontWeight: '800', color: 'rgba(255,255,255,0.35)', letterSpacing: 3, textTransform: 'uppercase' },
  heroCard: {
    backgroundColor: galaxyColors.surface, borderRadius: radius.rLg,
    borderWidth: 1, borderColor: galaxyColors.border, padding: space.s3, gap: space.s3, overflow: 'hidden',
  },
  heroFooter: {
    backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: radius.rMd,
    paddingHorizontal: space.s3, paddingVertical: space.s2, gap: space.s0,
  },
  heroFooterLabel: {
    fontSize: 11, fontWeight: '600', color: galaxyColors.textSecondary,
    textTransform: 'uppercase', letterSpacing: 0.8,
  },
  heroFooterValue: { ...typography.h3, color: galaxyColors.textPrimary },
  sectionCard: {
    backgroundColor: galaxyColors.surface, borderRadius: radius.rLg,
    borderWidth: 1, borderColor: galaxyColors.border, padding: space.s3, gap: space.s2,
  },
  sectionTitle: { ...typography.h3, color: galaxyColors.textPrimary },
  sectionBody: { ...typography.bodyRegular, color: galaxyColors.textSecondary },
  statsList: { gap: space.s2, marginTop: space.s1 },
  actionCard: {
    backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: radius.rLg,
    borderWidth: 1, borderColor: galaxyColors.border, padding: space.s3, gap: space.s2,
  },
  actionTitle: { ...typography.h3, color: galaxyColors.textPrimary },
  actionBody: { ...typography.bodyRegular, color: galaxyColors.textSecondary },
  fullWidthButton: { width: '100%' },
  errorCard: {
    backgroundColor: 'rgba(255,59,48,0.10)', borderRadius: radius.rMd,
    borderWidth: 1, borderColor: 'rgba(255,59,48,0.25)', padding: space.s3,
  },
  errorText: { ...typography.bodyRegular, color: '#FF6B6B' },
  messageCard: {
    backgroundColor: galaxyColors.surfaceMuted, borderRadius: radius.rMd,
    borderWidth: 1, borderColor: galaxyColors.border, padding: space.s3,
  },
  messageText: { ...typography.bodyRegular, color: galaxyColors.textSecondary },
  emptyState: { flex: 1, justifyContent: 'center', padding: space.s3 },
  emptyCard: {
    backgroundColor: galaxyColors.surface, borderRadius: radius.rLg,
    borderWidth: 1, borderColor: galaxyColors.border, padding: space.s3, gap: space.s3,
  },
  emptyTitle: { ...typography.h3, color: galaxyColors.textPrimary, textAlign: 'center' },
  emptyBody: { ...typography.bodyRegular, color: galaxyColors.textSecondary, textAlign: 'center' },
});
```

- [ ] **Step 5: Run the test**

```bash
cd /Users/anderson/Documents/Radiant/radiant-app
npx jest src/features/checkpoint/screens/CheckpointScreen.flow.test.tsx --no-coverage
```

Expected: PASS

- [ ] **Step 6: Commit**

```bash
cd /Users/anderson/Documents/Radiant/radiant-app
git add src/features/checkpoint/screens/CheckpointScreen.tsx \
        src/features/checkpoint/screens/CheckpointScreen.flow.test.tsx
git commit -m "feat(checkpoint): galaxy dark theme + PT-BR translation"
```

---

## Task 2: ReviewScreen — Galaxy + PT-BR

**Files:**
- Modify: `src/features/review/screens/ReviewScreen.tsx`
- Modify: `src/features/review/screens/ReviewScreen.flow.test.tsx`

ReviewScreen has **three** render states: `start`, `finished`, and the active `review` state (non-scroll). All three need the galaxy root structure.

- [ ] **Step 1: Read the current file**

```bash
cat -n src/features/review/screens/ReviewScreen.tsx
cat -n src/features/review/screens/ReviewScreen.flow.test.tsx
```

- [ ] **Step 2: Update the test file**

In `ReviewScreen.flow.test.tsx`, remove the stale `jest.mock` blocks for `StatItem` (lines 66-73) and `SurfaceCard` (lines 75-82). Add mocks for the new dependencies:

```ts
jest.mock('../../../ui/components/StarfieldBackground', () => ({
  StarfieldBackground: () => null,
}));

jest.mock('../../../ui/components/HUD', () => ({
  HUD: () => null,
}));

jest.mock('../../gamification/services/GamificationService', () => ({
  GamificationService: {
    getSnapshot: jest.fn().mockResolvedValue({
      totalXp: 80,
      streakDays: 2,
      hearts: 5,
      maxHearts: 5,
    }),
  },
}));
```

The existing test assertions (`'Pronto para limpar a fila?'`, `'Sessão ativa'`) remain valid.

- [ ] **Step 3: Run the test before any screen changes**

```bash
cd /Users/anderson/Documents/Radiant/radiant-app
npx jest src/features/review/screens/ReviewScreen.flow.test.tsx --no-coverage
```

Expected: PASS

- [ ] **Step 4: Replace ReviewScreen.tsx imports**

```tsx
import React, { useEffect, useMemo, useState } from 'react';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { ActivityIndicator, Animated, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { AppButton } from '../../../components/ui/AppButton';
import { PixelHeroSplit } from '../../../components/ui/PixelHeroSplit';
import { ProgressRing } from '../../../components/ui/ProgressRing';
import { StarfieldBackground } from '../../../ui/components/StarfieldBackground';
import { HUD } from '../../../ui/components/HUD';
import { GamificationService } from '../../gamification/services/GamificationService';
import type { GamificationSnapshot } from '../../../types/gamification';
import { duration, useFadeInUp } from '../../../ui/motion';
import { galaxyColors } from '../../../ui/theme';
import { layout, radius, space, typography } from '../../../ui/styles';
import { PushOptInCard } from '../../push/components/PushOptInCard';
import { PushService } from '../../push/services/PushService';
import { ReviewCard } from '../components/ReviewCard';
import { useReview } from '../hooks/useReview';
import { RatingPromptService } from '../../../services/RatingPromptService';
```

- [ ] **Step 5: Add GalaxyStatRow + gamification state to ReviewScreen**

Add `GalaxyStatRow` (same code as Task 1 Step 4) before `export default function ReviewScreen()`.

Inside `ReviewScreen()` body, after existing `const` declarations, add:

```tsx
const [gamification, setGamification] = useState<GamificationSnapshot | null>(null);

useEffect(() => {
  void GamificationService.getSnapshot().then(setGamification);
}, []);
```

- [ ] **Step 6: Replace the `start` state render**

The header label changes from `"Review"` → `"Revisão"`. The `"Spaced repetition"` eyebrow changes to `"Repetição espaçada"`. Root layout changes from `<SafeAreaView>` to the galaxy pattern:

```tsx
if (state === 'start') {
  const hasItems = queue.length > 0;

  return (
    <View style={styles.root}>
      <StarfieldBackground backgroundColor={galaxyColors.background} starCount={120} />
      <SafeAreaView style={styles.safe} edges={['top']}>
        <HUD
          totalXp={gamification?.totalXp ?? 0}
          streakDays={gamification?.streakDays ?? 0}
          hearts={gamification?.hearts ?? 5}
          maxHearts={gamification?.maxHearts ?? 5}
        />
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.headerRow}>
            <Pressable
              onPress={() => router.replace('/(tabs)')}
              accessibilityRole="button"
              accessibilityLabel="Fechar revisão"
              style={styles.iconButton}
            >
              <MaterialIcons name="close" size={22} color={galaxyColors.textPrimary} />
            </Pressable>
            <Text style={styles.headerLabel}>Revisão</Text>
            <View style={styles.iconSpacer} />
          </View>

          <Animated.View style={fadeAnim.style}>
            <View style={styles.heroCard}>
              <PixelHeroSplit
                eyebrow="Repetição espaçada"
                message={hasItems ? 'Você tem uma fila curta e objetiva. Fecha isso agora e mantém a curva de retenção saudável.' : 'Sem pendências críticas. Sua trilha está limpa por enquanto.'}
                ringValue={0}
                ringTotal={Math.max(queue.length, 1)}
                ringLabel={hasItems ? `${queue.length} itens na fila` : 'Nenhum item agora'}
                state={hasItems ? 'guide' : 'idle'}
                tier={hasItems ? 'intermediate' : 'starter'}
                accessibilityLabel="Pixel guiando a revisão"
              />
            </View>
          </Animated.View>

          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Como essa sessão funciona</Text>
            <View style={styles.statsList}>
              <GalaxyStatRow
                icon={<MaterialIcons name="flash-on" size={20} color={galaxyColors.ctaGradientEnd} />}
                label="Formato"
                value="Uma pergunta por item, resposta rápida e rating direto"
              />
              <GalaxyStatRow
                icon={<MaterialIcons name="timeline" size={20} color={galaxyColors.ctaGradientEnd} />}
                label="Objetivo"
                value="Consolidar memória antes de puxar conteúdo novo"
              />
              <GalaxyStatRow
                icon={<MaterialIcons name="workspace-premium" size={20} color={galaxyColors.ctaGradientEnd} />}
                label="Recompensa"
                value="XP só entra quando você realmente acerta"
              />
            </View>
          </View>

          <View style={styles.actionCard}>
            <Text style={styles.actionTitle}>{hasItems ? 'Pronto para limpar a fila?' : 'Nenhuma revisão pendente'}</Text>
            <Text style={styles.actionBody}>
              {hasItems
                ? 'A sessão está curta o suficiente para caber agora. Não vale adiar uma fila desse tamanho.'
                : 'Você pode voltar para a jornada e continuar o próximo nó recomendado.'}
            </Text>
            {hasItems ? (
              <AppButton onPress={startReview} style={styles.fullWidthButton}>
                Começar revisão
              </AppButton>
            ) : (
              <AppButton onPress={() => router.replace('/(tabs)')} style={styles.fullWidthButton}>
                Voltar para jornada
              </AppButton>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
```

- [ ] **Step 7: Replace the `finished` state render**

Same galaxy root pattern. Header label `"Review"` → `"Revisão"`:

```tsx
if (state === 'finished') {
  return (
    <View style={styles.root}>
      <StarfieldBackground backgroundColor={galaxyColors.background} starCount={120} />
      <SafeAreaView style={styles.safe} edges={['top']}>
        <HUD
          totalXp={gamification?.totalXp ?? 0}
          streakDays={gamification?.streakDays ?? 0}
          hearts={gamification?.hearts ?? 5}
          maxHearts={gamification?.maxHearts ?? 5}
        />
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.headerRow}>
            <Pressable
              onPress={() => router.replace('/(tabs)')}
              accessibilityRole="button"
              accessibilityLabel="Fechar revisão"
              style={styles.iconButton}
            >
              <MaterialIcons name="close" size={22} color={galaxyColors.textPrimary} />
            </Pressable>
            <Text style={styles.headerLabel}>Revisão</Text>
            <View style={styles.iconSpacer} />
          </View>

          <Animated.View style={fadeAnim.style}>
            <View style={styles.heroCard}>
              <PixelHeroSplit
                eyebrow="Sessão concluída"
                message="Boa. Você fechou a fila de revisão e devolveu estabilidade para a trilha."
                ringValue={totalItems}
                ringTotal={Math.max(totalItems, 1)}
                ringLabel="Fila encerrada"
                state="celebrate"
                tier="advanced"
                accessibilityLabel="Pixel celebrando a revisão"
              />
            </View>
          </Animated.View>

          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Resultado da sessão</Text>
            <View style={styles.statsList}>
              <GalaxyStatRow
                icon={<MaterialIcons name="task-alt" size={20} color={galaxyColors.ctaGradientEnd} />}
                label="Itens"
                value={`${totalItems} concluídos nesta rodada`}
              />
              <GalaxyStatRow
                icon={<MaterialIcons name="stars" size={20} color={galaxyColors.ctaGradientEnd} />}
                label="XP"
                value={`+${sessionXp} XP confirmado`}
              />
              <GalaxyStatRow
                icon={<MaterialIcons name="sync" size={20} color={galaxyColors.ctaGradientEnd} />}
                label="Estado"
                value="Cards já atualizados no fluxo local-first"
              />
            </View>
          </View>

          {showPushOptIn ? (
            <View style={styles.pushCard}>
              <PushOptInCard onDismiss={() => setShowPushOptIn(false)} />
            </View>
          ) : null}

          <View style={styles.actionCard}>
            <Text style={styles.actionTitle}>Fila limpa</Text>
            <Text style={styles.actionBody}>
              A próxima decisão agora volta para a jornada principal. Revise só quando realmente estiver devido.
            </Text>
            <AppButton onPress={() => router.replace('/(tabs)')} style={styles.fullWidthButton}>
              Voltar para jornada
            </AppButton>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
```

- [ ] **Step 8: Replace the active `review` state render**

The active state uses a non-scrolling layout. Use HUD `compact` and wrap in galaxy root:

```tsx
return (
  <View style={styles.root}>
    <StarfieldBackground backgroundColor={galaxyColors.background} starCount={80} />
    <SafeAreaView style={styles.safe} edges={['top']}>
      <HUD
        totalXp={gamification?.totalXp ?? 0}
        streakDays={gamification?.streakDays ?? 0}
        hearts={gamification?.hearts ?? 5}
        maxHearts={gamification?.maxHearts ?? 5}
        compact
      />
      <View style={[layout.container, styles.activeLayout]}>
        <View style={styles.headerRow}>
          <Pressable
            onPress={() => router.replace('/(tabs)')}
            accessibilityRole="button"
            accessibilityLabel="Fechar revisão"
            style={styles.iconButton}
          >
            <MaterialIcons name="close" size={22} color={galaxyColors.textPrimary} />
          </Pressable>
          <Text style={styles.headerLabel}>Revisão</Text>
          <Text style={styles.headerProgressText}>{progressValue}/{Math.max(totalItems, 1)}</Text>
        </View>

        <View style={styles.heroCard}>
          <View style={styles.activeHeroHeader}>
            <View style={styles.activeHeroCopy}>
              <Text style={styles.activeTitle}>Sessão ativa</Text>
              <Text style={styles.activeBody}>
                Responda rápido, revele a resposta e classifique sem hesitar. O objetivo aqui é retenção, não exploração.
              </Text>
            </View>
            <ProgressRing
              value={progressValue}
              total={Math.max(totalItems, 1)}
              label="Progresso"
              size={space.s6 * 3}
            />
          </View>
        </View>

        <View style={styles.focusArea}>
          {currentItem ? <ReviewCard question={currentItem.question} onRate={submitRating} /> : null}
        </View>
      </View>
    </SafeAreaView>
  </View>
);
```

- [ ] **Step 9: Replace the loading render (add before `if (state === 'start')`):**

```tsx
if (loading) {
  return (
    <View style={styles.root}>
      <StarfieldBackground backgroundColor={galaxyColors.background} starCount={120} />
      <SafeAreaView style={styles.safe}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={galaxyColors.ctaGradientEnd} />
        </View>
      </SafeAreaView>
    </View>
  );
}
```

- [ ] **Step 10: Replace the StyleSheet**

```ts
const SCREEN_MAX_WIDTH = 720;
const ICON_BUTTON_SIZE = space.s6 + space.s4;

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: galaxyColors.background },
  safe: { flex: 1 },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  content: { padding: space.s3, gap: space.s3, paddingBottom: space.s5 },
  activeLayout: { flex: 1, padding: space.s3, gap: space.s3, maxWidth: SCREEN_MAX_WIDTH },
  headerRow: { ...layout.rowBetween, width: '100%', maxWidth: SCREEN_MAX_WIDTH, alignSelf: 'center' },
  iconButton: {
    width: ICON_BUTTON_SIZE, height: ICON_BUTTON_SIZE, borderRadius: radius.rXl,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.07)', borderWidth: 1, borderColor: galaxyColors.border,
  },
  iconSpacer: { width: ICON_BUTTON_SIZE, height: ICON_BUTTON_SIZE },
  headerLabel: { fontSize: 13, fontWeight: '800', color: 'rgba(255,255,255,0.35)', letterSpacing: 3, textTransform: 'uppercase' },
  headerProgressText: { ...typography.caption, color: galaxyColors.textSecondary, width: ICON_BUTTON_SIZE, textAlign: 'right' },
  heroCard: {
    backgroundColor: galaxyColors.surface, borderRadius: radius.rLg,
    borderWidth: 1, borderColor: galaxyColors.border, padding: space.s3, gap: space.s3, overflow: 'hidden',
  },
  sectionCard: {
    backgroundColor: galaxyColors.surface, borderRadius: radius.rLg,
    borderWidth: 1, borderColor: galaxyColors.border, padding: space.s3, gap: space.s2,
  },
  sectionTitle: { ...typography.h3, color: galaxyColors.textPrimary },
  statsList: { gap: space.s2, marginTop: space.s1 },
  actionCard: {
    backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: radius.rLg,
    borderWidth: 1, borderColor: galaxyColors.border, padding: space.s3, gap: space.s2,
  },
  actionTitle: { ...typography.h3, color: galaxyColors.textPrimary },
  actionBody: { ...typography.bodyRegular, color: galaxyColors.textSecondary },
  fullWidthButton: { width: '100%' },
  pushCard: { width: '100%', maxWidth: SCREEN_MAX_WIDTH, alignSelf: 'center' },
  activeHeroHeader: { flexDirection: 'row', alignItems: 'center', gap: space.s3 },
  activeHeroCopy: { flex: 1, gap: space.s1 },
  activeTitle: { ...typography.h3, color: galaxyColors.textPrimary },
  activeBody: { ...typography.bodyRegular, color: galaxyColors.textSecondary },
  focusArea: { flex: 1, justifyContent: 'center' },
});
```

- [ ] **Step 11: Run the test**

```bash
cd /Users/anderson/Documents/Radiant/radiant-app
npx jest src/features/review/screens/ReviewScreen.flow.test.tsx --no-coverage
```

Expected: PASS

- [ ] **Step 12: Commit**

```bash
cd /Users/anderson/Documents/Radiant/radiant-app
git add src/features/review/screens/ReviewScreen.tsx \
        src/features/review/screens/ReviewScreen.flow.test.tsx
git commit -m "feat(review): galaxy dark theme + PT-BR translation"
```

---

## Task 3: QuizScreen — Full Galaxy + PT-BR

**Files:**
- Modify: `src/features/quiz/screens/QuizScreen.tsx`
- Modify: `src/features/quiz/screens/QuizScreen.flow.test.tsx`

QuizScreen has **three** render paths: loading, no-lesson empty state, and the `QuizSession` component (which itself has two views: active quiz and summary). The active quiz state uses a non-scrolling layout with `HUD compact`. The summary uses a scrolling layout with full HUD.

The current code already imports HUD but passes `totalXp={0}` and `streakDays={0}`. After conversion it loads gamification data.

- [ ] **Step 1: Read the current files**

```bash
cat -n src/features/quiz/screens/QuizScreen.tsx
cat -n src/features/quiz/screens/QuizScreen.flow.test.tsx
```

- [ ] **Step 2: Update the test file**

In `QuizScreen.flow.test.tsx`, remove the stale `jest.mock` blocks for `StatItem` (lines 78-85) and `SurfaceCard` (lines 87-94). Update the `GamificationService` mock to include `totalXp` and `streakDays`:

```ts
jest.mock('../../gamification/services/GamificationService', () => ({
  GamificationService: {
    getSnapshot: jest.fn().mockResolvedValue({
      totalXp: 120,
      streakDays: 3,
      hearts: 5,
      maxHearts: 5,
    }),
    loseHeart: jest.fn().mockResolvedValue({ hearts: 4, maxHearts: 5 }),
    recordQuizCompletion: jest.fn().mockResolvedValue({
      award: { baseXp: 10, bonusXp: 2, totalXpAwarded: 12, reason: 'quiz_complete' },
    }),
  },
}));
```

Add mocks for `StarfieldBackground`:

```ts
jest.mock('../../../ui/components/StarfieldBackground', () => ({
  StarfieldBackground: () => null,
}));
```

The `HUD` mock is already present — keep it.

- [ ] **Step 3: Replace QuizScreen.tsx imports**

```tsx
import React, { useEffect, useState } from 'react';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { ActivityIndicator, Animated, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { AppButton } from '../../../components/ui/AppButton';
import { PixelHeroSplit } from '../../../components/ui/PixelHeroSplit';
import { ProgressRing } from '../../../components/ui/ProgressRing';
import { StarfieldBackground } from '../../../ui/components/StarfieldBackground';
import { HUD } from '../../../ui/components/HUD';
import { QUIZ_THRESHOLDS } from '../../../constants/quiz';
import type { QuizLesson, QuizLessonId } from '../../../types/quiz';
import { duration, useFadeInUp, useScalePop } from '../../../ui/motion';
import { galaxyColors } from '../../../ui/theme';
import { layout, radius, space, typography } from '../../../ui/styles';
import { LessonCatalogService } from '../../content/services/LessonCatalogService';
import { OnboardingService } from '../../onboarding/OnboardingService';
import { PushOptInCard } from '../../push/components/PushOptInCard';
import { PushService } from '../../push/services/PushService';
import { QuizFeedback } from '../components/QuizFeedback';
import { QuizQuestion } from '../components/QuizQuestion';
import { useQuiz } from '../hooks/useQuiz';
import { RatingPromptService } from '../../../services/RatingPromptService';
import { PaywallService, type PaywallOffer } from '../../paywall/PaywallService';
import { PaywallOfferCard } from '../../paywall/components/PaywallOfferCard';
import { UpgradeInterestService } from '../../paywall/UpgradeInterestService';
import { GamificationService } from '../../gamification/services/GamificationService';
import type { GamificationSnapshot } from '../../../types/gamification';
```

- [ ] **Step 4: Add GalaxyStatRow before `export default function QuizScreen`**

Same `GalaxyStatRow` definition as Tasks 1 and 2.

- [ ] **Step 5: Replace loading and empty-state returns in `QuizScreen` (outer component)**

```tsx
if (loading) {
  return (
    <View style={styles.root}>
      <StarfieldBackground backgroundColor={galaxyColors.background} starCount={120} />
      <SafeAreaView style={styles.safe}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={galaxyColors.ctaGradientEnd} />
          <Text style={styles.loadingText}>Carregando lição...</Text>
        </View>
      </SafeAreaView>
    </View>
  );
}

if (!currentLesson) {
  return (
    <View style={styles.root}>
      <StarfieldBackground backgroundColor={galaxyColors.background} starCount={120} />
      <SafeAreaView style={styles.safe}>
        <View style={styles.centered}>
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>Nenhuma lição disponível</Text>
            <Text style={styles.emptyBody}>Não existe conteúdo elegível para este quiz agora.</Text>
            <AppButton onPress={() => router.replace('/(tabs)')} style={styles.fullWidthButton}>
              Voltar para jornada
            </AppButton>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}
```

- [ ] **Step 6: Add gamification state to `QuizSession` component**

Inside `QuizSession` function body, after existing `useState` declarations, add:

```tsx
const [gamification, setGamification] = useState<GamificationSnapshot | null>(null);

useEffect(() => {
  void GamificationService.getSnapshot().then(setGamification);
}, []);
```

- [ ] **Step 7: Replace the `isFinished` summary return in `QuizSession`**

Header label `"Review Quiz"` → `"Quiz de Revisão"`. Root layout → galaxy pattern with full HUD:

```tsx
if (isFinished && result) {
  const scorePercentage = Math.round((result.correctAnswers / result.totalQuestions) * 100);
  const passed = scorePercentage >= QUIZ_THRESHOLDS.PASSING_SCORE;
  const hasMoreLessons = mode === 'review' && currentLessonIndex < totalLessons - 1;
  const characterState = scorePercentage >= QUIZ_THRESHOLDS.EXCELLENT_SCORE || dailyGoalJustCompleted
    ? 'celebrate'
    : passed ? 'happy' : 'guide';

  return (
    <View style={styles.root}>
      <StarfieldBackground backgroundColor={galaxyColors.background} starCount={120} />
      <SafeAreaView style={styles.safe} edges={['top']}>
        <HUD
          totalXp={gamification?.totalXp ?? 0}
          streakDays={gamification?.streakDays ?? 0}
          hearts={hearts}
          maxHearts={maxHearts}
        />
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.headerRow}>
            <Pressable
              onPress={() => router.replace('/(tabs)')}
              accessibilityRole="button"
              accessibilityLabel="Fechar quiz"
              style={styles.iconButton}
            >
              <MaterialIcons name="close" size={22} color={galaxyColors.textPrimary} />
            </Pressable>
            <Text style={styles.headerLabel}>{mode === 'review' ? 'Quiz de Revisão' : 'Quiz'}</Text>
            <View style={styles.iconSpacer} />
          </View>

          <View style={styles.heroCard}>
            <PixelHeroSplit
              eyebrow={mode === 'review' ? 'Consolidação' : 'Avaliação rápida'}
              message={passed
                ? 'Base consolidada. O aprendizado desta etapa foi registrado e a trilha já pode avançar.'
                : 'O resultado ainda não está estável. Vale repetir agora antes de acumular ruído.'}
              ringValue={scorePercentage}
              ringTotal={100}
              ringLabel="Aproveitamento"
              state={characterState}
              tier={characterState === 'celebrate' ? 'advanced' : 'intermediate'}
              accessibilityLabel="Pixel apresentando o resultado do quiz"
            />
          </View>

          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Resumo da tentativa</Text>
            <View style={styles.statsList}>
              <GalaxyStatRow
                icon={<MaterialIcons name="check-circle" size={20} color={galaxyColors.ctaGradientEnd} />}
                label="Acerto"
                value={`${result.correctAnswers} de ${result.totalQuestions} corretas`}
              />
              <GalaxyStatRow
                icon={<MaterialIcons name="workspace-premium" size={20} color={galaxyColors.ctaGradientEnd} />}
                label="Estado"
                value={passed ? 'Checkpoint pedagógico aprovado' : 'Reforço recomendado antes de seguir'}
              />
              <GalaxyStatRow
                icon={<MaterialIcons name="bolt" size={20} color={galaxyColors.ctaGradientEnd} />}
                label="XP"
                value={xpAward ? `+${xpAward.totalXpAwarded} XP registrados` : 'Sem XP adicional nesta tentativa'}
              />
            </View>
          </View>

          {dailyGoalJustCompleted ? (
            <Animated.View style={[helperFade.style, celebrationFade.style, celebrationPop.style]}>
              <View style={styles.messageCard}>
                <Text style={styles.messageTitle}>Meta do dia concluída</Text>
                <Text style={styles.messageBody}>Esta tentativa fechou sua meta diária de módulos com sucesso.</Text>
              </View>
            </Animated.View>
          ) : null}

          {summaryHelper ? (
            <Animated.View style={helperFade.style}>
              <View style={styles.messageCard}>
                <Text style={styles.messageTitle}>Leitura do hábito</Text>
                <Text style={styles.messageBody}>{summaryHelper.message}</Text>
              </View>
            </Animated.View>
          ) : null}

          {showPushOptIn ? (
            <View style={styles.pushCard}>
              <PushOptInCard onDismiss={() => setShowPushOptIn(false)} />
            </View>
          ) : null}

          {paywallOffer ? (
            <PaywallOfferCard
              offer={paywallOffer}
              submitting={paywallSubmitting}
              onPrimary={() => {
                if (paywallSubmitting) { return; }
                void (async () => {
                  try {
                    setPaywallSubmitting(true);
                    const interest = await UpgradeInterestService.captureInterest(paywallOffer, { lessonId: result.lessonId });
                    await PaywallService.recordOutcome(paywallOffer, 'cta_tap', { lessonId: result.lessonId });
                    setPaywallFeedback(
                      interest.email
                        ? `Interesse registrado para ${interest.email}. Vamos avisar quando o Radiant Plus abrir.`
                        : 'Interesse registrado neste dispositivo. Vamos usar esse sinal para abrir o Radiant Plus no momento certo.'
                    );
                  } catch (cause) {
                    console.error('[QuizScreen] Failed to capture paywall interest:', cause);
                    setPaywallFeedback('Nao foi possivel registrar seu interesse agora. Tente novamente em outro momento.');
                  } finally {
                    setPaywallOffer(null);
                    setPaywallSubmitting(false);
                  }
                })();
              }}
              onDismiss={() => {
                if (paywallSubmitting) { return; }
                void PaywallService.recordOutcome(paywallOffer, 'dismissed', { lessonId: result.lessonId });
                setPaywallOffer(null);
              }}
            />
          ) : null}

          {paywallFeedback ? (
            <View style={styles.messageCard}>
              <Text style={styles.messageTitle}>Radiant Plus</Text>
              <Text style={styles.messageBody}>{paywallFeedback}</Text>
            </View>
          ) : null}

          <View style={styles.actionCard}>
            <Text style={styles.actionTitle}>
              {hasMoreLessons ? 'Existe mais revisão na fila' : mode === 'review' ? 'Revisão concluída' : 'Próxima decisão'}
            </Text>
            <Text style={styles.actionBody}>
              {hasMoreLessons
                ? `Você ainda tem ${totalLessons - currentLessonIndex - 1} lição${totalLessons - currentLessonIndex - 1 > 1 ? 'ões' : ''} nesta rodada de revisão.`
                : mode === 'review'
                  ? 'A rodada de revisão acabou. O próximo passo volta para a jornada principal.'
                  : 'Você pode repetir imediatamente ou voltar para a trilha com o estado já atualizado.'}
            </Text>
            {hasMoreLessons ? (
              <AppButton onPress={onNextLesson} style={styles.fullWidthButton}>
                Próxima lição
              </AppButton>
            ) : (
              <AppButton onPress={mode === 'review' ? onFinishReview : reset} style={styles.fullWidthButton}>
                {mode === 'review' ? 'Finalizar revisão' : 'Refazer quiz'}
              </AppButton>
            )}
            {mode === 'normal' ? (
              <AppButton
                onPress={() => router.replace('/(tabs)')}
                variant="ghost"
                style={styles.fullWidthButton}
                textStyle={{ color: galaxyColors.textSecondary }}
              >
                Voltar para jornada
              </AppButton>
            ) : null}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
```

- [ ] **Step 8: Replace the active quiz return in `QuizSession`**

Header label `"Review Quiz"` → `"Quiz de Revisão"`. HUD gets gamification data. Background changes:

```tsx
return (
  <View style={styles.root}>
    <StarfieldBackground backgroundColor={galaxyColors.background} starCount={80} />
    <SafeAreaView style={styles.safe} edges={['top']}>
      <HUD
        totalXp={gamification?.totalXp ?? 0}
        streakDays={gamification?.streakDays ?? 0}
        hearts={hearts}
        maxHearts={maxHearts}
        compact
      />
      <View style={[layout.container, styles.activeLayout]}>
        <View style={styles.headerRow}>
          <Pressable
            onPress={() => router.replace('/(tabs)')}
            accessibilityRole="button"
            accessibilityLabel="Fechar quiz"
            style={styles.iconButton}
          >
            <MaterialIcons name="close" size={22} color={galaxyColors.textPrimary} />
          </Pressable>
          <Text style={styles.headerLabel}>{mode === 'review' ? 'Quiz de Revisão' : 'Quiz'}</Text>
          <Text style={styles.headerProgressText}>
            {progress.currentQuestionIndex + 1}/{progress.totalQuestions}
          </Text>
        </View>

        <View style={styles.activeHeroCard}>
          <View style={styles.activeHeroHeader}>
            <View style={styles.activeHeroCopy}>
              <Text style={styles.activeTitle}>{lesson.title}</Text>
              <Text style={styles.activeBody}>
                {mode === 'review'
                  ? `Modo revisão${totalLessons > 0 ? ` • lição ${currentLessonIndex + 1}/${totalLessons}` : ''}`
                  : 'Selecione uma resposta e confirme a leitura da imagem ou do conceito.'}
              </Text>
            </View>
            <ProgressRing
              value={progress.currentQuestionIndex + 1}
              total={Math.max(progress.totalQuestions, 1)}
              label="Questões"
              size={space.s6 * 3}
            />
          </View>
        </View>

        <ScrollView style={styles.scrollArea} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {currentQuestion ? (
            <QuizQuestion
              question={currentQuestion}
              selectedAnswerIndex={selectedAnswerIndex}
              isAnswered={isAnswered}
              onSelectAnswer={selectAnswer}
            />
          ) : null}
          {feedback.visible ? (
            <QuizFeedback isCorrect={feedback.isCorrect} explanation={feedback.explanation} />
          ) : null}
        </ScrollView>

        {isAnswered ? (
          <View style={styles.footer}>
            <AppButton onPress={next} style={styles.fullWidthButton}>
              Próxima
            </AppButton>
          </View>
        ) : null}
      </View>
    </SafeAreaView>
  </View>
);
```

- [ ] **Step 9: Replace the StyleSheet**

```ts
const SCREEN_MAX_WIDTH = 720;
const ICON_BUTTON_SIZE = space.s6 + space.s4;

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: galaxyColors.background },
  safe: { flex: 1 },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: space.s3 },
  loadingText: { ...typography.caption, color: galaxyColors.textSecondary, marginTop: space.s2 },
  emptyCard: {
    backgroundColor: galaxyColors.surface, borderRadius: radius.rLg,
    borderWidth: 1, borderColor: galaxyColors.border, padding: space.s3, gap: space.s3,
    width: '100%', maxWidth: SCREEN_MAX_WIDTH,
  },
  emptyTitle: { ...typography.h3, color: galaxyColors.textPrimary, textAlign: 'center' },
  emptyBody: { ...typography.bodyRegular, color: galaxyColors.textSecondary, textAlign: 'center' },
  content: { padding: space.s3, gap: space.s3, paddingBottom: space.s5 },
  activeLayout: { flex: 1, maxWidth: SCREEN_MAX_WIDTH, padding: space.s3, gap: space.s3 },
  headerRow: { ...layout.rowBetween, width: '100%', maxWidth: SCREEN_MAX_WIDTH, alignSelf: 'center' },
  iconButton: {
    width: ICON_BUTTON_SIZE, height: ICON_BUTTON_SIZE, borderRadius: radius.rXl,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.07)', borderWidth: 1, borderColor: galaxyColors.border,
  },
  iconSpacer: { width: ICON_BUTTON_SIZE, height: ICON_BUTTON_SIZE },
  headerLabel: { fontSize: 13, fontWeight: '800', color: 'rgba(255,255,255,0.35)', letterSpacing: 3, textTransform: 'uppercase' },
  headerProgressText: { ...typography.caption, color: galaxyColors.textSecondary, width: ICON_BUTTON_SIZE, textAlign: 'right' },
  heroCard: {
    backgroundColor: galaxyColors.surface, borderRadius: radius.rLg,
    borderWidth: 1, borderColor: galaxyColors.border, padding: space.s3, gap: space.s3, overflow: 'hidden',
  },
  sectionCard: {
    backgroundColor: galaxyColors.surface, borderRadius: radius.rLg,
    borderWidth: 1, borderColor: galaxyColors.border, padding: space.s3, gap: space.s2,
  },
  sectionTitle: { ...typography.h3, color: galaxyColors.textPrimary },
  statsList: { gap: space.s2, marginTop: space.s1 },
  pushCard: { width: '100%', maxWidth: SCREEN_MAX_WIDTH, alignSelf: 'center' },
  messageCard: {
    backgroundColor: galaxyColors.surface, borderRadius: radius.rLg,
    borderWidth: 1, borderColor: galaxyColors.border, padding: space.s3, gap: space.s1,
  },
  messageTitle: { ...typography.body, color: galaxyColors.textPrimary, fontWeight: '800' },
  messageBody: { ...typography.bodyRegular, color: galaxyColors.textSecondary },
  actionCard: {
    backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: radius.rLg,
    borderWidth: 1, borderColor: galaxyColors.border, padding: space.s3, gap: space.s2,
  },
  actionTitle: { ...typography.h3, color: galaxyColors.textPrimary },
  actionBody: { ...typography.bodyRegular, color: galaxyColors.textSecondary },
  fullWidthButton: { width: '100%' },
  activeHeroCard: {
    backgroundColor: galaxyColors.surface, borderRadius: radius.rLg,
    borderWidth: 1, borderColor: galaxyColors.border, padding: space.s3, gap: space.s2,
  },
  activeHeroHeader: { flexDirection: 'row', alignItems: 'center', gap: space.s3 },
  activeHeroCopy: { flex: 1, gap: space.s1 },
  activeTitle: { ...typography.h3, color: galaxyColors.textPrimary },
  activeBody: { ...typography.bodyRegular, color: galaxyColors.textSecondary },
  scrollArea: { flex: 1 },
  scrollContent: { gap: space.s2, paddingBottom: space.s2 },
  footer: { paddingBottom: space.s1 },
});
```

- [ ] **Step 10: Run the test**

```bash
cd /Users/anderson/Documents/Radiant/radiant-app
npx jest src/features/quiz/screens/QuizScreen.flow.test.tsx --no-coverage
```

Expected: PASS

- [ ] **Step 11: Commit**

```bash
cd /Users/anderson/Documents/Radiant/radiant-app
git add src/features/quiz/screens/QuizScreen.tsx \
        src/features/quiz/screens/QuizScreen.flow.test.tsx
git commit -m "feat(quiz): galaxy dark theme + PT-BR translation + HUD gamification data"
```

---

## Task 4: JourneyHero + JourneyHomeScreen — Galaxy + PT-BR

**Files:**
- Modify: `src/features/journey/components/JourneyHero.tsx`
- Modify: `src/features/journey/screens/JourneyHomeScreen.tsx`
- Modify: `src/features/journey/screens/JourneyHomeScreen.flow.test.tsx`

JourneyHero is a sub-component used exclusively by JourneyHomeScreen. Update it first, then update the screen. The screen's `"Nao foi possivel carregar a Learning Road."` error message translates to `"Não foi possível carregar a jornada."`.

- [ ] **Step 1: Read the current files**

```bash
cat -n src/features/journey/components/JourneyHero.tsx
cat -n src/features/journey/screens/JourneyHomeScreen.tsx
cat -n src/features/journey/screens/JourneyHomeScreen.flow.test.tsx
```

- [ ] **Step 2: Rewrite JourneyHero.tsx**

JourneyHero wraps `PixelHeroSplit` in a `SurfaceCard` with light-theme glow orbs. Replace with a plain galaxy card View, dark glow orbs using galaxy accent colors:

```tsx
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { PixelHeroSplit } from '../../../components/ui/PixelHeroSplit';
import { galaxyColors } from '../../../ui/theme';
import { radius, space, typography } from '../../../ui/styles';

type JourneyHeroProps = {
  unitTitle: string;
  dailyGoalCompleted: number;
  dailyGoalTarget: number;
  message: string;
  trackLabel?: string;
};

export function JourneyHero({
  unitTitle,
  dailyGoalCompleted,
  dailyGoalTarget,
  message,
  trackLabel = 'Jornada de Radiologia',
}: JourneyHeroProps) {
  return (
    <View style={styles.card}>
      <View style={styles.glowPrimary} />
      <View style={styles.glowSecondary} />
      <PixelHeroSplit
        eyebrow={trackLabel}
        message={message}
        ringValue={dailyGoalCompleted}
        ringTotal={dailyGoalTarget}
        ringLabel="Meta do dia"
        state="guide"
        tier="intermediate"
        accessibilityLabel="Pixel guiando a jornada"
      />
      <View style={styles.footerRow}>
        <Text style={styles.footerLabel}>Unidade ativa</Text>
        <Text style={styles.footerValue}>{unitTitle}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: galaxyColors.surface,
    borderRadius: radius.rLg,
    borderWidth: 1,
    borderColor: galaxyColors.border,
    padding: space.s3,
    paddingTop: space.s4,
    paddingBottom: space.s4,
    gap: space.s3,
    overflow: 'hidden',
  },
  glowPrimary: {
    position: 'absolute',
    top: -30,
    left: -30,
    width: 180,
    height: 180,
    borderRadius: 999,
    backgroundColor: galaxyColors.ctaGradientEnd,
    opacity: 0.08,
  },
  glowSecondary: {
    position: 'absolute',
    top: 10,
    right: -40,
    width: 220,
    height: 220,
    borderRadius: 999,
    backgroundColor: '#7B61FF',
    opacity: 0.06,
  },
  footerRow: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: radius.rLg,
    paddingHorizontal: space.s3,
    paddingVertical: space.s2,
    gap: 4,
  },
  footerLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: galaxyColors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  footerValue: {
    ...typography.h3,
    color: galaxyColors.textPrimary,
    fontSize: 22,
  },
});
```

- [ ] **Step 3: Update the test file**

In `JourneyHomeScreen.flow.test.tsx`, remove the stale `jest.mock` blocks for `StatItem` (lines 55-67) and `SurfaceCard` (lines 69-90). Add mocks for new dependencies:

```ts
jest.mock('../../../ui/components/StarfieldBackground', () => ({
  StarfieldBackground: () => null,
}));

jest.mock('../../../ui/components/HUD', () => ({
  HUD: () => null,
}));

jest.mock('../../gamification/services/GamificationService', () => ({
  GamificationService: {
    getSnapshot: jest.fn().mockResolvedValue({
      totalXp: 80,
      streakDays: 2,
      hearts: 5,
      maxHearts: 5,
    }),
  },
}));
```

Keep all other mocks, including `JourneyHero`, `JourneyMap`, `JourneyProgressService`, etc.

- [ ] **Step 4: Run existing test before changing the screen**

```bash
cd /Users/anderson/Documents/Radiant/radiant-app
npx jest src/features/journey/screens/JourneyHomeScreen.flow.test.tsx --no-coverage
```

Expected: PASS

- [ ] **Step 5: Rewrite JourneyHomeScreen.tsx**

Replace imports:

```tsx
import React, { useCallback, useMemo, useState } from 'react';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useFocusEffect } from 'expo-router';
import { JourneyProgressService } from '../services/JourneyProgressService';
import type { JourneyNode, JourneySnapshot } from '../../../types/journey';
import { DailyGoalService } from '../../daily-goal/services/DailyGoalService';
import type { DailyGoalSnapshot } from '../../../types/dailyGoal';
import { canOpenJourneyNode, getJourneyNodeHref } from '../services/JourneyNodeRouting';
import { AppButton } from '../../../components/ui/AppButton';
import { StarfieldBackground } from '../../../ui/components/StarfieldBackground';
import { HUD } from '../../../ui/components/HUD';
import { GamificationService } from '../../gamification/services/GamificationService';
import type { GamificationSnapshot } from '../../../types/gamification';
import { galaxyColors } from '../../../ui/theme';
import { radius, space, typography } from '../../../ui/styles';
import { JourneyHero } from '../components/JourneyHero';
import { JourneyMap } from '../components/JourneyMap';
import { JourneyTrackShelf } from '../components/JourneyTrackShelf';
import { TelemetryService } from '../../telemetry/TelemetryService';
import { LessonCatalogService } from '../../content/services/LessonCatalogService';
import type { LearningTrack, LessonCatalogManifest } from '../../content/content.types';
```

Add gamification state inside `JourneyHomeScreen` (after existing state declarations):

```tsx
const [gamification, setGamification] = useState<GamificationSnapshot | null>(null);
```

Add inside `loadSnapshot` (add to the `Promise.all` or as a separate `useEffect`). Use a separate `useEffect` to keep it simple:

```tsx
useFocusEffect(
  useCallback(() => {
    void TelemetryService.track('screen_view', { screen: 'journey_home' });
    void loadSnapshot();
    void GamificationService.getSnapshot().then(setGamification);
  }, [loadSnapshot])
);
```

Fix error message (line ~61):
```tsx
setError('Não foi possível carregar a jornada.');
```

Replace the full return JSX:

```tsx
return (
  <View style={styles.root}>
    <StarfieldBackground backgroundColor={galaxyColors.background} starCount={120} />
    <SafeAreaView style={styles.safe} edges={['top']}>
      <HUD
        totalXp={gamification?.totalXp ?? 0}
        streakDays={gamification?.streakDays ?? 0}
        hearts={gamification?.hearts ?? 5}
        maxHearts={gamification?.maxHearts ?? 5}
      />
      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator
            size="large"
            color={galaxyColors.ctaGradientEnd}
            accessibilityRole="progressbar"
            accessibilityLabel="Carregando jornada"
          />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          contentInsetAdjustmentBehavior="always"
        >
          <JourneyHero
            unitTitle={currentUnit?.title ?? 'Sua trilha'}
            dailyGoalCompleted={dailyGoalSnapshot?.completedToday ?? 0}
            dailyGoalTarget={dailyGoalSnapshot?.goalPerDay ?? 1}
            message={heroMessage}
          />

          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Foco de hoje</Text>
            <View style={styles.summaryList}>
              <GalaxyStatRow
                icon={<MaterialIcons name="flag" size={20} color={galaxyColors.ctaGradientEnd} />}
                label="Próximo"
                value={recommendedNodeMeta}
              />
              <GalaxyStatRow
                icon={<MaterialIcons name="account-tree" size={20} color={galaxyColors.ctaGradientEnd} />}
                label="Nós ativos"
                value={`${actionableNodeCount} passos elegíveis nesta unidade`}
              />
              <GalaxyStatRow
                icon={<MaterialIcons name="offline-bolt" size={20} color={galaxyColors.ctaGradientEnd} />}
                label="Sync"
                value="Modo local-first ativo, com progresso protegido mesmo sem rede"
              />
            </View>
          </View>

          <JourneyTrackShelf
            tracks={catalogManifest?.tracks ?? []}
            lessons={catalogManifest?.lessons ?? []}
            activeTrackId={snapshot?.progress.activeTrackId ?? 'track-radiology-foundations'}
            activeProgressPercent={activeTrackProgressPercent}
            onTrackPress={openTrack}
          />

          {noNextStepMessage ? (
            <View style={styles.messageCard}>
              <Text style={styles.messageTitle}>Trilha pausada por agora</Text>
              <Text style={styles.messageText}>{noNextStepMessage}</Text>
            </View>
          ) : null}

          {error ? (
            <View style={styles.errorCard} accessibilityRole="alert">
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          {snapshot && currentUnit ? (
            <JourneyMap
              units={snapshot.track.units}
              recommendedNodeId={snapshot.nextRecommendedNode?.id}
              onNodePress={(node) => void openNode(node)}
              isNodeDisabled={(node) => !canOpenNode(node)}
            />
          ) : null}

          <AppButton
            onPress={() => {
              if (snapshot?.nextRecommendedNode) {
                void openNode(snapshot.nextRecommendedNode);
              }
            }}
            disabled={!snapshot?.nextRecommendedNode || !canOpenNode(snapshot.nextRecommendedNode)}
            style={styles.cta}
            accessibilityLabel={continueLabel}
            accessibilityHint="Abre o próximo passo elegível da trilha ativa."
          >
            {continueLabel}
          </AppButton>
        </ScrollView>
      )}
    </SafeAreaView>
  </View>
);
```

Add `GalaxyStatRow` (same code as previous tasks) before `export default function JourneyHomeScreen`.

Replace the StyleSheet:

```ts
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: galaxyColors.background },
  safe: { flex: 1 },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  content: { padding: space.s3, gap: space.s3, paddingBottom: space.s5 },
  summaryCard: {
    backgroundColor: galaxyColors.surface,
    borderRadius: radius.rLg,
    borderWidth: 1,
    borderColor: galaxyColors.border,
    padding: space.s3,
    gap: space.s2,
  },
  summaryTitle: { ...typography.h3, color: galaxyColors.textPrimary },
  summaryList: { gap: space.s2 },
  messageCard: {
    backgroundColor: galaxyColors.surface,
    borderRadius: radius.rLg,
    borderWidth: 1,
    borderColor: galaxyColors.border,
    padding: space.s3,
    gap: space.s1,
  },
  messageTitle: { ...typography.body, color: galaxyColors.textPrimary, fontWeight: '700' },
  messageText: { ...typography.bodyRegular, color: galaxyColors.textSecondary },
  errorCard: {
    backgroundColor: 'rgba(255,59,48,0.10)',
    borderRadius: radius.rMd,
    borderWidth: 1,
    borderColor: 'rgba(255,59,48,0.25)',
    padding: space.s3,
  },
  errorText: { ...typography.bodyRegular, color: '#FF6B6B' },
  cta: { marginTop: space.s1 },
});
```

- [ ] **Step 6: Run the test**

```bash
cd /Users/anderson/Documents/Radiant/radiant-app
npx jest src/features/journey/screens/JourneyHomeScreen.flow.test.tsx --no-coverage
```

Expected: PASS

- [ ] **Step 7: Commit**

```bash
cd /Users/anderson/Documents/Radiant/radiant-app
git add src/features/journey/components/JourneyHero.tsx \
        src/features/journey/screens/JourneyHomeScreen.tsx \
        src/features/journey/screens/JourneyHomeScreen.flow.test.tsx
git commit -m "feat(journey): galaxy dark theme for JourneyHero + JourneyHomeScreen + PT-BR"
```

---

## Task 5: LessonFlowScreen — Galaxy

**Files:**
- Modify: `src/features/lesson-flow/screens/LessonFlowScreen.tsx`

LessonFlowScreen has no flow test file. It uses `SurfaceCard` and `colors.*`. The renderers (ContextStepRenderer, TeachStepRenderer, etc.) are not in scope for this task — only the screen shell.

- [ ] **Step 1: Read the current file**

```bash
cat -n src/features/lesson-flow/screens/LessonFlowScreen.tsx
```

- [ ] **Step 2: Replace imports**

```tsx
import React, { useEffect, useMemo, useState } from 'react';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { AppButton } from '../../../components/ui/AppButton';
import { StarfieldBackground } from '../../../ui/components/StarfieldBackground';
import { LessonFlowService } from '../services/LessonFlowService';
import type { LessonBlock, MultipleChoicePayload } from '../../../types/lessonFlow';
import { galaxyColors } from '../../../ui/theme';
import { space, typography } from '../../../ui/styles';
import { ContextStepRenderer } from '../renderers/ContextStepRenderer';
import { TeachStepRenderer } from '../renderers/TeachStepRenderer';
import { MultipleChoiceStepRenderer } from '../renderers/MultipleChoiceStepRenderer';
import { ReinforceStepRenderer } from '../renderers/ReinforceStepRenderer';
import { AdvanceStepRenderer } from '../renderers/AdvanceStepRenderer';
import { JourneyProgressService } from '../../journey/services/JourneyProgressService';
import { LessonVisualPanel } from '../components/LessonVisualPanel';
import { LessonFlowProgressHeader } from '../components/LessonFlowProgressHeader';
```

- [ ] **Step 3: Fix the fallback title string**

In the `lessonTitle` useMemo, change the default:

```tsx
return block.lessonId; // keep as-is — lessonId is not a user-facing string
```

The only PT-BR fix needed here is the fallback `'Lesson Flow'` string inside the `lessonTitle` useMemo where `block` is null:

Change `return 'Lesson Flow';` → `return 'Fluxo da Lição';`

- [ ] **Step 4: Replace loading and error state returns**

```tsx
if (loading) {
  return (
    <View style={styles.root}>
      <StarfieldBackground backgroundColor={galaxyColors.background} starCount={80} />
      <SafeAreaView style={styles.safe}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={galaxyColors.ctaGradientEnd} />
        </View>
      </SafeAreaView>
    </View>
  );
}

if (error || !block || !currentStep) {
  return (
    <View style={styles.root}>
      <StarfieldBackground backgroundColor={galaxyColors.background} starCount={80} />
      <SafeAreaView style={styles.safe}>
        <View style={styles.centered}>
          <View style={styles.errorCard}>
            <Text style={styles.errorText}>{error ?? 'Bloco inválido.'}</Text>
          </View>
          <AppButton onPress={exitLesson}>Voltar para a trilha</AppButton>
        </View>
      </SafeAreaView>
    </View>
  );
}
```

- [ ] **Step 5: Replace the main return**

The `SurfaceCard` wrapping `contentCard` becomes a plain `View`. The footer background changes from light-glass to a dark semi-transparent:

```tsx
return (
  <View style={styles.root}>
    <StarfieldBackground backgroundColor={galaxyColors.background} starCount={80} />
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerTopRow}>
            <Pressable
              onPress={exitLesson}
              style={styles.closeButton}
              accessibilityRole="button"
              accessibilityLabel="Fechar lição"
            >
              <MaterialIcons name="close" size={24} color={galaxyColors.textSecondary} />
            </Pressable>
          </View>
          <LessonFlowProgressHeader
            title={lessonTitle}
            currentStep={stepIndex + 1}
            totalSteps={totalSteps}
            progressPercent={progress * 100}
          />
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <LessonVisualPanel hint={panelHint} caption={panelCaption} />

          <View style={styles.contentCard}>
            {currentStep.step.type === 'context' ? (
              <ContextStepRenderer payload={currentStep.step.payload} />
            ) : null}
            {currentStep.step.type === 'teach' ? (
              <TeachStepRenderer payload={currentStep.step.payload} />
            ) : null}
            {currentStep.step.type === 'multiple-choice' ? (
              <MultipleChoiceStepRenderer
                payload={multipleChoicePayload!}
                selectedOptionId={selectedOptionId}
                onSelect={(optionId) => handleSelectOption(multipleChoicePayload!, optionId)}
                locked={Boolean(selectedOptionId)}
              />
            ) : null}
            {currentStep.step.type === 'reinforce' ? (
              <ReinforceStepRenderer
                payload={currentStep.step.payload}
                answeredCorrectly={answeredCorrectly}
                explanation={answerExplanation}
              />
            ) : null}
            {currentStep.step.type === 'advance' ? (
              <AdvanceStepRenderer payload={currentStep.step.payload} />
            ) : null}
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <AppButton onPress={() => void handleContinue()} disabled={!canContinue} style={styles.primaryAction}>
            {isLastStep ? 'Concluir e voltar' : 'Continuar'}
          </AppButton>
        </View>
      </View>
    </SafeAreaView>
  </View>
);
```

- [ ] **Step 6: Replace the StyleSheet**

```ts
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: galaxyColors.background },
  safe: { flex: 1 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: space.s4, gap: space.s3 },
  container: { flex: 1 },
  header: { paddingHorizontal: space.s3, paddingTop: space.s1, paddingBottom: space.s2, gap: space.s2 },
  headerTopRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' },
  closeButton: {
    width: 44, height: 44, borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.07)',
    alignItems: 'center', justifyContent: 'center',
  },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: space.s3, paddingBottom: space.s4, gap: space.s3 },
  contentCard: {
    backgroundColor: galaxyColors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: galaxyColors.border,
    padding: space.s3,
    gap: space.s3,
  },
  footer: {
    paddingHorizontal: space.s3,
    paddingTop: space.s2,
    paddingBottom: space.s3,
    backgroundColor: 'rgba(3,3,13,0.92)',
  },
  primaryAction: { width: '100%' },
  errorCard: {
    backgroundColor: 'rgba(255,59,48,0.10)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,59,48,0.25)',
    padding: space.s3,
    width: '100%',
  },
  errorText: { ...typography.bodyRegular, color: '#FF6B6B', textAlign: 'center' },
});
```

- [ ] **Step 7: Confirm TypeScript compiles**

```bash
cd /Users/anderson/Documents/Radiant/radiant-app
npx tsc --noEmit 2>&1 | grep "lesson-flow"
```

Expected: no errors in `LessonFlowScreen.tsx`

- [ ] **Step 8: Commit**

```bash
cd /Users/anderson/Documents/Radiant/radiant-app
git add src/features/lesson-flow/screens/LessonFlowScreen.tsx
git commit -m "feat(lesson-flow): galaxy dark theme + PT-BR"
```

---

## Task 6: HomeScreen — Galaxy Alignment + PT-BR

**Files:**
- Modify: `src/features/home/screens/HomeScreen.tsx`

HomeScreen is the legacy dark screen using a private `COLORS` object (`#000000` background) and three legacy components: `Card`, `PrimaryButton`, `StatPill`. These are replaced with `AppButton`, inline `View`s, and `galaxyColors` tokens. The `CharacterSlot` usage and all inline sub-components (`HomeHeader`, `IntroCard`, `ClosureCard`, `StatsSection`, `HealthSection`, `AlertBanner`, `ReviewSection`) are kept but their color references change.

**No `StarfieldBackground` for HomeScreen** — it is a tab screen inside the tab navigator (`/(tabs)` route) and the tabs layout already has a galaxy background applied at the navigator level. Adding StarfieldBackground here would double-render stars. Use `backgroundColor: galaxyColors.background` in the root `SafeAreaView` only.

- [ ] **Step 1: Read the current file**

```bash
cat -n src/features/home/screens/HomeScreen.tsx
```

- [ ] **Step 2: Replace imports**

Remove: `Card`, `PrimaryButton`, `StatPill`. Add: `AppButton` (already used in project), `galaxyColors`.

```tsx
import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Animated, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useFocusEffect } from 'expo-router';
import { SpacedRepetitionService } from '../../spaced-repetition/services/SpacedRepetitionService';
import { GamificationService } from '../../gamification/services/GamificationService';
import { DailyGoalService } from '../../daily-goal/services/DailyGoalService';
import { AppButton } from '../../../components/ui/AppButton';
import type { QuizLessonId } from '../../../types/quiz';
import type { GamificationSnapshot } from '../../../types/gamification';
import type { DailyGoalSnapshot } from '../../../types/dailyGoal';
import { space, typography, layout } from '../../../ui/styles';
import { galaxyColors } from '../../../ui/theme';
import { useFadeInUp, useCardEnter } from '../../../ui/motion';
import { CharacterSlot } from '../../../ui/characters/CharacterSlot';
import { TelemetryService } from '../../telemetry/TelemetryService';
import { HeuristicsService } from '../../telemetry/heuristics/HeuristicsService';
import type { HeuristicAlert } from '../../telemetry/heuristics/heuristics.types';
import { HEURISTICS_CONSTANTS } from '../../telemetry/heuristics/heuristics.constants';
import { HealthScoreService } from '../../health/HealthScoreService';
import type { HealthScore } from '../../health/health.types';
import { OnboardingService } from '../../onboarding/OnboardingService';
import type { OnboardingStage } from '../../onboarding/onboarding.types';
import { AppConfig } from '../../../config';
import { PushService } from '../../push/services/PushService';
import { PushOptInCard } from '../../push/components/PushOptInCard';
```

- [ ] **Step 3: Remove the COLORS object**

Delete lines 33-43 (the `const COLORS = { ... }` block). All references to `COLORS.*` below will be replaced with `galaxyColors.*` or hardcoded hex equivalents in the StyleSheet.

Use this mapping when replacing `COLORS.*`:
- `COLORS.background` → `galaxyColors.background`
- `COLORS.cardBackground` → `galaxyColors.surface` (rgba)
- `COLORS.secondaryBackground` → `'rgba(255,255,255,0.07)'`
- `COLORS.primaryText` → `galaxyColors.textPrimary`
- `COLORS.secondaryText` → `galaxyColors.textSecondary`
- `COLORS.primary` → `galaxyColors.ctaGradientEnd`
- `COLORS.success` → `'#34C759'`
- `COLORS.error` → `'#FF453A'`
- `COLORS.warning` → `'#FF9F0A'`

- [ ] **Step 4: Replace `Card` usages with styled `View`s**

`Card` is used in: `IntroCard`, `ClosureCard`, `HealthSection`, `AlertBanner`, `ReviewSection`. Replace each `<Card ...>` with `<View style={styles.card}>` or the specific variant style defined in the StyleSheet.

In `IntroCard`:
```tsx
function IntroCard({ onStart, onSkip }: IntroCardProps) {
  return (
    <View style={styles.introCard}>
      <Text style={styles.introTitle}>Bem-vindo ao Radiant</Text>
      <Text style={styles.introBody}>
        Aprenda radiologia com revisões inteligentes e progresso real.
      </Text>
      <AppButton onPress={onStart} style={styles.button}>
        Começar
      </AppButton>
      <AppButton onPress={onSkip} variant="ghost" style={styles.button} textStyle={{ color: galaxyColors.textSecondary }}>
        Pular introdução
      </AppButton>
    </View>
  );
}
```

In `ClosureCard`:
```tsx
function ClosureCard({ onDismiss }: ClosureCardProps) {
  return (
    <View style={styles.closureCard}>
      <Text style={styles.closureTitle}>Sua jornada começou 🚀</Text>
      <Text style={styles.closureBody}>
        Agora o Radiant se adapta ao seu ritmo. Continue revisando para manter suas chamas acesas.
      </Text>
      <AppButton onPress={onDismiss} style={styles.button}>
        Entendi
      </AppButton>
    </View>
  );
}
```

- [ ] **Step 5: Replace `StatPill` usages in `StatsSection` with inline galaxy pills**

```tsx
function StatsSection({ gamificationState, dailyGoalState }: StatsSectionProps) {
  if (!gamificationState && !dailyGoalState) {
    return null;
  }

  return (
    <View style={styles.statsRow}>
      {gamificationState ? (
        <>
          <View style={[styles.statPill, { flex: 1 }]}>
            <Text style={styles.statPillLabel}>XP</Text>
            <Text style={styles.statPillValue}>{gamificationState.totalXp}</Text>
          </View>
          <View style={[styles.statPill, { flex: 1 }]}>
            <Text style={styles.statPillLabel}>Sequência</Text>
            <Text style={styles.statPillValue}>{`${gamificationState.streakDays}d`}</Text>
          </View>
        </>
      ) : null}
      {dailyGoalState ? (
        <View style={[styles.statPill, { flex: 1 }]}>
          <Text style={styles.statPillLabel}>Meta</Text>
          <Text style={styles.statPillValue}>{`${dailyGoalState.completedToday}/${dailyGoalState.goalPerDay}`}</Text>
        </View>
      ) : null}
    </View>
  );
}
```

- [ ] **Step 6: Replace `PrimaryButton` usages in `HealthSection` with `AppButton`**

```tsx
<AppButton
  onPress={onToggleDetails}
  variant="ghost"
  style={styles.healthDetailsBtn}
  textStyle={styles.healthDetailsButtonText}
>
  {showHealthDetails ? 'Ocultar detalhes' : 'Ver detalhes'}
</AppButton>
```

- [ ] **Step 7: Replace `ReviewSection` and main CTA**

```tsx
function ReviewSection({ dueCount, onboardingStage, onStartReview }: ReviewSectionProps) {
  return (
    <View style={styles.reviewCard}>
      <Text style={styles.reviewLabel}>Revisões pendentes</Text>
      <Text style={styles.reviewCount}>{dueCount}</Text>
      {onboardingStage === 'review_guided' && dueCount > 0 ? (
        <Text style={styles.inlineHelper}>Revisões rápidas mantêm o conhecimento vivo.</Text>
      ) : null}
      <AppButton onPress={onStartReview} disabled={dueCount === 0} style={styles.button}>
        Iniciar revisão
      </AppButton>
    </View>
  );
}
```

In the main `HomeScreen` JSX, replace the bottom CTA:
```tsx
<AppButton onPress={handleContinueLearning} variant="secondary" style={styles.secondaryButton}>
  Continuar aprendendo
</AppButton>
```

- [ ] **Step 8: Replace the StyleSheet**

```ts
const styles = StyleSheet.create({
  screen: {
    ...layout.screen,
    backgroundColor: galaxyColors.background,
    padding: space.none,
  },
  header: {
    paddingHorizontal: space.s4,
    paddingVertical: space.s5,
    borderBottomWidth: 1,
    borderBottomColor: galaxyColors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: space.s3,
  },
  headerCopy: { flex: 1 },
  titleRow: { flexDirection: 'row', alignItems: 'center' },
  title: { ...typography.h1, color: galaxyColors.textPrimary },
  headerStatus: { ...typography.caption, color: galaxyColors.textSecondary, marginTop: space.s1 },
  betaBadge: {
    backgroundColor: 'rgba(255,159,10,0.2)',
    paddingHorizontal: space.s1,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: space.s3,
  },
  betaText: { color: '#FF9F0A', fontSize: 10, fontWeight: '700' },
  content: { padding: space.s4, gap: space.s5, paddingBottom: space.s6 },
  statsRow: { ...layout.row, gap: space.s2 },
  statPill: {
    backgroundColor: galaxyColors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: galaxyColors.border,
    paddingVertical: space.s2,
    paddingHorizontal: space.s3,
    alignItems: 'center',
    gap: 2,
  },
  statPillLabel: { fontSize: 11, fontWeight: '600', color: galaxyColors.textSecondary, textTransform: 'uppercase', letterSpacing: 0.5 },
  statPillValue: { fontSize: 18, fontWeight: '800', color: galaxyColors.textPrimary },
  goalCompletedBanner: {
    backgroundColor: galaxyColors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: galaxyColors.border,
    padding: space.s3,
    alignItems: 'center',
  },
  goalCompletedText: { fontSize: 16, fontWeight: '600', color: '#34C759' },
  reviewCard: {
    backgroundColor: galaxyColors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: galaxyColors.border,
    padding: space.s4,
    alignItems: 'center',
    gap: space.s2,
  },
  reviewLabel: { fontSize: 16, fontWeight: '500', color: galaxyColors.textSecondary },
  reviewCount: { fontSize: 64, fontWeight: '700', color: galaxyColors.ctaGradientEnd },
  inlineHelper: { ...typography.caption, color: galaxyColors.ctaGradientEnd, textAlign: 'center', fontStyle: 'italic' },
  button: { width: '100%' },
  secondaryButton: { width: '100%' },
  introCard: {
    backgroundColor: galaxyColors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: galaxyColors.ctaGradientEnd,
    padding: space.s5,
    alignItems: 'center',
    gap: space.s3,
  },
  introTitle: { ...typography.h2, color: galaxyColors.textPrimary, textAlign: 'center' },
  introBody: { ...typography.body, color: galaxyColors.textSecondary, textAlign: 'center' },
  closureCard: {
    backgroundColor: 'rgba(52,199,89,0.08)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#34C759',
    padding: space.s5,
    gap: space.s2,
  },
  closureTitle: { ...typography.h2, color: '#34C759' },
  closureBody: { ...typography.body, color: galaxyColors.textPrimary },
  healthCard: {
    backgroundColor: galaxyColors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: galaxyColors.border,
    padding: space.s4,
    gap: space.s3,
  },
  healthHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  healthTitle: { fontSize: 18, fontWeight: 'bold', color: galaxyColors.textPrimary },
  healthBadge: { paddingHorizontal: space.s2, paddingVertical: 2, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.07)' },
  healthBadgeText: { fontSize: 12, fontWeight: '600', color: galaxyColors.textPrimary },
  healthMain: { gap: space.s1 },
  healthScoreBig: { fontSize: 48, fontWeight: '800', color: galaxyColors.textPrimary, letterSpacing: -1 },
  healthMicrocopy: { fontSize: 14, color: galaxyColors.textSecondary, lineHeight: 20 },
  healthDetailsBtn: { height: 36 },
  healthDetailsButtonText: { fontSize: 13, color: galaxyColors.textSecondary },
  healthDetails: {
    marginTop: space.s4,
    paddingTop: space.s4,
    borderTopWidth: 1,
    borderTopColor: galaxyColors.border,
    gap: space.s1,
  },
  healthRow: { flexDirection: 'row', justifyContent: 'space-between' },
  healthRowLabel: { fontSize: 13, color: galaxyColors.textSecondary },
  healthRowValue: { fontSize: 13, fontWeight: '600', color: galaxyColors.textPrimary },
  healthPenaltyText: { color: '#FF453A' },
  healthPlaceholder: { fontSize: 14, color: galaxyColors.textSecondary, fontStyle: 'italic' },
  alertCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: space.s3,
  },
  alertCardCritical: { backgroundColor: 'rgba(255,69,58,0.10)', borderColor: '#FF453A' },
  alertCardInformational: { backgroundColor: 'rgba(10,132,255,0.10)', borderColor: galaxyColors.ctaGradientEnd },
  alertTitle: { ...typography.body, color: galaxyColors.textPrimary, fontWeight: '700' },
  sectionBlock: { marginBottom: space.none },
});
```

- [ ] **Step 9: Update `getHealthBadgeStyle` and `AlertBanner` to use galaxyColors**

```tsx
function getHealthBadgeStyle(label: string) {
  switch (label) {
    case 'excellent': return { backgroundColor: 'rgba(52, 199, 89, 0.2)' };
    case 'strong': return { backgroundColor: `rgba(48, 96, 255, 0.2)` };
    case 'consistent': return { backgroundColor: 'rgba(255, 159, 10, 0.2)' };
    default: return { backgroundColor: 'rgba(255,255,255,0.07)' };
  }
}
```

- [ ] **Step 10: Confirm TypeScript compiles**

```bash
cd /Users/anderson/Documents/Radiant/radiant-app
npx tsc --noEmit 2>&1 | grep "HomeScreen"
```

Expected: no errors

- [ ] **Step 11: Commit**

```bash
cd /Users/anderson/Documents/Radiant/radiant-app
git add src/features/home/screens/HomeScreen.tsx
git commit -m "feat(home): align to galaxy dark theme + replace legacy Card/PrimaryButton/StatPill"
```

---

## Task 7: Full Test Suite + TypeScript Check

**Files:** none modified — verification only.

- [ ] **Step 1: Run all flow tests for modified screens**

```bash
cd /Users/anderson/Documents/Radiant/radiant-app
npx jest \
  src/features/checkpoint/screens/CheckpointScreen.flow.test.tsx \
  src/features/review/screens/ReviewScreen.flow.test.tsx \
  src/features/quiz/screens/QuizScreen.flow.test.tsx \
  src/features/journey/screens/JourneyHomeScreen.flow.test.tsx \
  --no-coverage
```

Expected: ALL PASS

- [ ] **Step 2: Run full TypeScript check**

```bash
cd /Users/anderson/Documents/Radiant/radiant-app
npx tsc --noEmit
```

Expected: 0 errors

- [ ] **Step 3: Run full test suite**

```bash
cd /Users/anderson/Documents/Radiant/radiant-app
npx jest --no-coverage
```

Expected: ALL PASS (no regressions)

- [ ] **Step 4: Commit if anything was fixed during verification**

```bash
git add -p
git commit -m "fix: post-galaxy-unification type and test corrections"
```

Only commit if there were actual fixes. Skip if all passed clean.

---

## Self-Review

**Spec coverage check:**
- ✅ CheckpointScreen: LIGHT → galaxy + PT-BR (`"Checkpoint"` kept as brand term, `"Radiology Journey"` → `"Jornada de Radiologia"`)
- ✅ ReviewScreen: LIGHT → galaxy + PT-BR (`"Review"` → `"Revisão"`, `"Spaced repetition"` → `"Repetição espaçada"`)
- ✅ QuizScreen: MIXED → full galaxy + HUD gamification data + PT-BR (`"Review Quiz"` → `"Quiz de Revisão"`)
- ✅ JourneyHero: LIGHT → galaxy (glow orbs preserved with dark opacity)
- ✅ JourneyHomeScreen: LIGHT → galaxy + PT-BR (`"Learning Road"` error → `"jornada"`)
- ✅ LessonFlowScreen: LIGHT → galaxy + PT-BR (`"Lesson Flow"` → `"Fluxo da Lição"`)
- ✅ HomeScreen: custom dark → galaxyColors alignment, legacy Card/PrimaryButton/StatPill replaced

**Placeholder scan:** None found. All code blocks are complete.

**Type consistency:**
- `GamificationSnapshot` imported from `'../../../types/gamification'` in all tasks — consistent
- `galaxyColors.ctaGradientEnd` used as accent icon color throughout — consistent
- `GalaxyStatRow` defined identically in Tasks 1, 2, 3, 4 — consistent
- `StarfieldBackground` props `backgroundColor={galaxyColors.background} starCount={120}` — consistent (80 for compact screens: QuizScreen active, ReviewScreen active, LessonFlowScreen)
