import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppButton } from '../../../components/ui/AppButton';
import { useReducedMotionPreference } from '../../../ui/accessibility/useReducedMotionPreference';
import { createLessonFeedback, type LessonFeedback, type LessonFeedbackEvent } from '../../../ui/feedback/lessonFeedback';
import { readFeedbackPreferences } from '../../../ui/feedback/feedbackPreferences';
import { createLessonSoundPlayer } from '../../../ui/feedback/lessonSounds';
import { semanticColors } from '../../../ui/semantic-colors';
import { galaxyColors } from '../../../ui/theme';
import { radius, space, typography } from '../../../ui/styles';
import { heartsRepository } from '../../hearts/HeartsRepository';
import type { HeartsSnapshot } from '../../hearts/hearts.types';
import { BodyReferenceMap } from '../l1-body-reference/BodyReferenceMap';
import { hybridLessonMetricsRepository, type HybridLessonOutcome, type HybridLessonRecord } from './HybridLessonMetricsRepository';
import { HybridLessonCharacter } from './HybridLessonCharacter';
import { createHybridLessonSession, type HybridAnswerResult, type HybridSummary } from './HybridLessonSession';
import { buildL1HybridPlan } from './l1HybridLessonPlan';
import { isL1TemplateApproved } from './l1TemplateApproval';
import type { HybridItem } from './hybridItem.types';

type HeartsPort = Readonly<{ getSnapshot(nowMs: number): Promise<HeartsSnapshot>; spend(nowMs: number): Promise<HeartsSnapshot> }>;

export type HybridLessonScreenProps = Readonly<{
  plan?: readonly HybridItem[];
  hearts?: HeartsPort;
  feedback?: LessonFeedback;
  now?: () => number;
  metrics?: Readonly<{ append(record: HybridLessonRecord): Promise<void> }>;
  onExit: () => void;
}>;

type Phase = 'opening' | 'item' | 'feedback' | 'out_of_hearts' | 'done';

const SYNTHESIS = 'A referência é o corpo, não você nem a gravidade.';

function formatDuration(ms: number): string {
  const totalSeconds = Math.max(0, Math.round(ms / 1000));
  return `${Math.floor(totalSeconds / 60)}:${String(totalSeconds % 60).padStart(2, '0')}`;
}

/**
 * Rolagem em cima, ação embaixo. O retorno e o botão da fase ficam num rodapé
 * fixo: no simulador (2026-09-23) o painel caía abaixo da dobra e o aluno só via
 * a linha mediana mudar. `scrollKey` remonta a rolagem a cada item novo, para a
 * pergunta seguinte começar no topo.
 */
function LessonShell({ scrollKey, footer, children }: Readonly<{ scrollKey: string; footer: React.ReactNode; children: React.ReactNode }>) {
  return (
    <SafeAreaView style={styles.root}>
      <ScrollView key={scrollKey} testID="hybrid-scroll" style={styles.scroll} contentContainerStyle={styles.content}>
        {children}
      </ScrollView>
      {footer ? <View testID="hybrid-footer" style={styles.footer}>{footer}</View> : null}
    </SafeAreaView>
  );
}

export function HybridLessonScreen({ plan, hearts = heartsRepository, feedback, now = Date.now, metrics = hybridLessonMetricsRepository, onExit }: HybridLessonScreenProps) {
  const reduceMotion = useReducedMotionPreference();
  const session = useMemo(() => createHybridLessonSession({ plan: plan ?? buildL1HybridPlan(), now }), [plan, now]);
  const approved = useMemo(() => isL1TemplateApproved(), []);
  const [phase, setPhase] = useState<Phase>('opening');
  const [item, setItem] = useState<HybridItem | null>(() => session.current());
  const [result, setResult] = useState<HybridAnswerResult | null>(null);
  const [heartsSnapshot, setHeartsSnapshot] = useState<HeartsSnapshot | null>(null);
  const [summary, setSummary] = useState<HybridSummary | null>(null);
  const busy = useRef(false);
  const phaseRef = useRef<Phase>('opening');
  const itemRef = useRef<HybridItem | null>(item);
  const recorded = useRef(false);
  phaseRef.current = phase;
  itemRef.current = item;

  const record = useCallback((outcome: HybridLessonOutcome) => {
    if (recorded.current) return;
    recorded.current = true;
    void metrics.append({
      finishedAt: new Date(now()).toISOString(),
      outcome,
      abandonedAtItemId: outcome === 'completed' ? null : itemRef.current?.id ?? null,
      summary: session.summary(),
    }).catch(() => undefined);
  }, [metrics, now, session]);

  // Ref, não dependência: a limpeza precisa rodar só na desmontagem. Com
  // `[record]`, uma troca de identidade no meio da lição gravaria um abandono falso.
  const recordRef = useRef(record);
  recordRef.current = record;
  useEffect(() => () => {
    if (phaseRef.current === 'item' || phaseRef.current === 'feedback') recordRef.current('abandoned');
  }, []);
  const feedbackRef = useRef<LessonFeedback | null>(feedback ?? null);

  useEffect(() => {
    if (feedback) {
      feedbackRef.current = feedback;
      return undefined;
    }
    const sounds = createLessonSoundPlayer();
    let alive = true;
    void readFeedbackPreferences().then((preferences) => {
      if (alive) feedbackRef.current = createLessonFeedback(sounds, preferences);
    });
    return () => {
      alive = false;
      sounds.release();
    };
  }, [feedback]);

  const emit = useCallback((event: LessonFeedbackEvent) => feedbackRef.current?.emit(event), []);

  const start = useCallback(() => {
    setPhase('item');
    void hearts.getSnapshot(now()).then(setHeartsSnapshot);
  }, [hearts, now]);

  const choose = useCallback(async (optionId: string) => {
    if (phase !== 'item' || busy.current || !item || !item.options.some((option) => option.id === optionId)) return;
    busy.current = true;
    emit('option_tap');
    const answer = session.answer(optionId);
    emit(answer.correct ? 'correct' : 'incorrect');
    if (answer.events.includes('streak3') || answer.events.includes('streak5')) emit('streak');
    setResult(answer);
    setPhase('feedback');
    if (answer.costsHeart) {
      const next = await hearts.spend(now());
      setHeartsSnapshot(next);
      if (next.status !== 'unlimited') emit('heart_lost');
      if (next.status === 'empty') {
        setPhase('out_of_hearts');
        record('out_of_hearts');
      }
    }
    busy.current = false;
  }, [emit, hearts, item, now, phase, record, session]);

  const next = useCallback(() => {
    const { complete } = session.advance();
    setResult(null);
    if (complete) {
      setSummary(session.summary());
      setPhase('done');
      record('completed');
      emit('lesson_complete');
      return;
    }
    setItem(session.current());
    setPhase('item');
  }, [emit, record, session]);

  if (phase === 'opening') {
    return (
      <LessonShell scrollKey="opening" footer={<AppButton variant="galaxy" label="Começar" onPress={start} fullWidth />}>
          <Text style={styles.eyebrow}>PILOTO · LIÇÃO HÍBRIDA</Text>
          <Text style={styles.title} accessibilityRole="header">O corpo como referência</Text>
          <BodyReferenceMap posture="anatomical" perspective="front" selectedRelation="medial-lateral" reduceMotion={reduceMotion} landmarks={[]} showControls={false} compact onPostureChange={() => undefined} onPerspectiveChange={() => undefined} onRegionSelect={() => undefined} />
          <Text style={styles.body}>A marca está à esquerda. Esquerda de quem?</Text>
          {!approved ? <Text style={styles.notice}>Prévia: os modelos de exercício aguardam a revisão do conteúdo.</Text> : null}
      </LessonShell>
    );
  }

  if (phase === 'done' && summary) {
    return (
      <LessonShell scrollKey="done" footer={<AppButton variant="galaxy" label="Continuar" onPress={onExit} fullWidth />}>
          <HybridLessonCharacter moment="summary" reduceMotion={reduceMotion} />
          <Text style={styles.title} accessibilityRole="header">Lição concluída</Text>
          <View style={styles.stats}>
            <Text style={styles.stat}>{`+${summary.xp} XP`}</Text>
            <Text style={styles.stat}>{`Precisão ${Math.round(summary.accuracy * 100)}%`}</Text>
            <Text style={styles.stat}>{`Tempo ${formatDuration(summary.durationMs)}`}</Text>
            <Text style={styles.stat}>{`Maior sequência ${summary.bestStreak}`}</Text>
          </View>
          <Text style={styles.body}>{SYNTHESIS}</Text>
      </LessonShell>
    );
  }

  if (phase === 'out_of_hearts') {
    return (
      <LessonShell scrollKey="out-of-hearts" footer={<AppButton variant="galaxy" label="Sair" onPress={onExit} fullWidth />}>
          <Text style={styles.title} accessibilityRole="header">Suas vidas acabaram.</Text>
          <Text style={styles.body}>Elas voltam com o tempo, uma a cada 30 minutos. Revisar também devolve uma vida.</Text>
      </LessonShell>
    );
  }

  if (!item) return null;
  const { index, total } = session.position();
  const firstContactMiss = phase === 'feedback' && result !== null && !result.correct && item.phase === 'first_contact';
  const streakText = result?.events.includes('streak5') ? 'Cinco seguidos!' : result?.events.includes('streak3') ? 'Três seguidos!' : null;

  const panel = phase === 'feedback' && result ? (
    <View style={styles.panel} accessibilityLiveRegion="polite">
      <Text style={[styles.resultTitle, result.correct ? styles.good : styles.miss]}>{result.correct ? 'Isso!' : 'Quase.'}</Text>
      {result.hint ? <Text style={styles.hint}>{result.hint}</Text> : null}
      <Text style={styles.body}>{result.feedback}</Text>
      {streakText ? (
        <View style={styles.streak}>
          <HybridLessonCharacter moment="streak" reduceMotion={reduceMotion} />
          <Text style={styles.streakText}>{streakText}</Text>
        </View>
      ) : null}
      <AppButton variant="galaxy" label={result.retrySameItem ? 'Tentar de novo' : 'Continuar'} onPress={next} fullWidth />
    </View>
  ) : null;

  return (
    <LessonShell scrollKey={item.id} footer={panel}>
        <Text testID="hybrid-item-id" style={styles.visuallyHidden} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">{item.id}</Text>
        <View style={styles.header}>
          <Text style={styles.progressLabel}>{`${index + 1} de ${total}`}</Text>
          <Text style={styles.progressLabel} accessibilityLabel={heartsSnapshot?.status === 'unlimited' ? 'Vidas ilimitadas' : `${heartsSnapshot?.count ?? 5} vidas`}>
            {heartsSnapshot?.status === 'unlimited' ? 'Vidas ∞' : `Vidas ${heartsSnapshot?.count ?? 5}`}
          </Text>
        </View>
        <View style={styles.track} accessibilityRole="progressbar" accessibilityValue={{ min: 0, max: total, now: index }}>
          <View style={[styles.fill, { width: `${(index / total) * 100}%` }]} />
        </View>
        <Text style={styles.prompt} accessibilityLabel={item.accessiblePrompt}>{item.prompt}</Text>
        <BodyReferenceMap
          posture={item.posture}
          perspective={item.perspective}
          selectedRelation={item.relation}
          reduceMotion={reduceMotion}
          landmarks={item.landmarks}
          showControls={false}
          compact
          emphasizeMidline={firstContactMiss}
          landmarksInteractive={item.format === 'tap' && phase === 'item'}
          onPostureChange={() => undefined}
          onPerspectiveChange={() => undefined}
          onRegionSelect={(id) => { void choose(id); }}
        />
        {item.format === 'tap' ? (
          <Text style={styles.instruction}>Toque no número certo no mapa.</Text>
        ) : (
          <View style={styles.options}>
            {item.options.map((option) => (
              <Pressable
                key={option.id}
                testID={`hybrid-option-${option.id}`}
                accessibilityRole="button"
                accessibilityLabel={`${option.label}. ${option.textDescription}`}
                disabled={phase !== 'item'}
                onPress={() => { void choose(option.id); }}
                style={styles.option}
              >
                <Text style={styles.optionLabel}>{option.label}</Text>
              </Pressable>
            ))}
          </View>
        )}
    </LessonShell>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: galaxyColors.background },
  scroll: { flex: 1 },
  footer: { padding: space.s3, borderTopWidth: 1, borderTopColor: galaxyColors.border, backgroundColor: galaxyColors.background },
  content: { padding: space.s3, gap: space.s3 },
  eyebrow: { ...typography.label, color: galaxyColors.textTertiary },
  title: { ...typography.h2, color: galaxyColors.textPrimary },
  body: { ...typography.bodyRegular, color: galaxyColors.textSecondary },
  notice: { ...typography.caption, color: semanticColors.galaxy.statusWarning },
  header: { flexDirection: 'row', justifyContent: 'space-between' },
  progressLabel: { ...typography.caption, color: galaxyColors.textSecondary },
  track: { height: 6, borderRadius: radius.rMd, backgroundColor: galaxyColors.surfaceActive, overflow: 'hidden' },
  fill: { height: '100%', backgroundColor: semanticColors.galaxy.statusSuccess },
  prompt: { ...typography.h3, color: galaxyColors.textPrimary },
  instruction: { ...typography.caption, color: galaxyColors.textSecondary },
  options: { gap: space.s2 },
  option: { minHeight: 44, padding: space.s3, borderRadius: radius.rMd, borderWidth: 1, borderColor: galaxyColors.border, backgroundColor: galaxyColors.surface, gap: space.s0 },
  optionLabel: { ...typography.bodyStrong, color: galaxyColors.textPrimary },
  panel: { padding: space.s3, borderRadius: radius.rLg, borderWidth: 1, borderColor: galaxyColors.border, backgroundColor: galaxyColors.surface, gap: space.s2 },
  resultTitle: { ...typography.h3 },
  good: { color: semanticColors.galaxy.statusSuccess },
  miss: { color: semanticColors.galaxy.statusWarning },
  hint: { ...typography.bodyStrong, color: galaxyColors.textPrimary },
  streak: { flexDirection: 'row', alignItems: 'center', gap: space.s2 },
  streakText: { ...typography.bodyStrong, color: galaxyColors.textPrimary },
  stats: { gap: space.s1 },
  stat: { ...typography.bodyStrong, color: galaxyColors.textPrimary },
  visuallyHidden: { height: 0, width: 0, opacity: 0 },
});
