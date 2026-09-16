import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useReducedMotionPreference } from '../../../ui/accessibility/useReducedMotionPreference';
import { semanticColors } from '../../../ui/semantic-colors';
import { galaxyColors } from '../../../ui/theme';
import { radius, space, typography } from '../../../ui/styles';
import { BodyReferenceMap, type BodyPerspective, type BodyPosture } from './BodyReferenceMap';
import { createBodyReferenceLessonSession, type BodyReferenceAnswerResult } from './BodyReferenceLessonSession';
import { L1_BODY_REFERENCE } from './l1BodyReferenceContent';

type PreviewState = 'answering' | 'feedback';

function activityLabel(evidenceKind: string): string {
  if (evidenceKind === 'initial_independent') return 'Diagnóstico inicial · sem XP';
  if (evidenceKind === 'assisted_practice') return 'Prática assistida · não demonstra domínio';
  return 'Recuperação independente · novo cenário';
}

function relationForChallenge(objectiveId: string): string {
  if (objectiveId.includes('lateralidade')) return 'medial-lateral';
  if (objectiveId.includes('postura')) return 'anterior-posterior';
  if (objectiveId.includes('superior')) return 'superior-inferior';
  if (objectiveId.includes('proximal')) return 'proximal-distal';
  if (objectiveId.includes('superficial')) return 'superficial-deep';
  return 'medial-lateral';
}

export function BodyReferenceLessonPreview() {
  const session = useMemo(() => createBodyReferenceLessonSession(), []);
  const reduceMotion = useReducedMotionPreference();
  const [challengeId, setChallengeId] = useState('l1-diagnostic-laterality');
  const [selectedAnswerId, setSelectedAnswerId] = useState<string | null>(null);
  const [state, setState] = useState<PreviewState>('answering');
  const [result, setResult] = useState<BodyReferenceAnswerResult | null>(null);
  const [posture, setPosture] = useState<BodyPosture>('anatomical');
  const [perspective, setPerspective] = useState<BodyPerspective>('front');
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const challenge = L1_BODY_REFERENCE.challenges.find((entry) => entry.id === challengeId);
  const isScenarioAligned = posture === challenge?.posture && perspective === challenge?.perspective;

  if (!challenge) throw new Error(`UNKNOWN_L1_PREVIEW_CHALLENGE:${challengeId}`);

  const showChallenge = (nextChallengeId: string) => {
    const next = L1_BODY_REFERENCE.challenges.find((entry) => entry.id === nextChallengeId);
    if (!next) throw new Error(`UNKNOWN_L1_PREVIEW_CHALLENGE:${nextChallengeId}`);
    setChallengeId(next.id);
    setPosture(next.posture);
    setPerspective(next.perspective);
    setSelectedAnswerId(null);
    setResult(null);
    setState('answering');
  };

  const confirm = () => {
    if (!selectedAnswerId || !isScenarioAligned) return;
    setResult(session.answer(challenge.id, selectedAnswerId));
    setState('feedback');
  };

  const feedbackAction = () => {
    if (!result) return;
    if (!result.correct) {
      showChallenge(result.remediationChallengeId);
      return;
    }
    if (result.nextChallengeId) showChallenge(result.nextChallengeId);
  };

  const feedbackActionLabel = result && !result.correct
    ? 'Praticar com apoio'
    : result?.correct ? result.nextActionLabel ?? null : null;

  return (
    <ScrollView contentContainerStyle={styles.content} accessibilityLabel="Prévia isolada da lição O corpo como referência">
      <Text style={styles.eyebrow}>L1 · ORIENTAÇÃO ESPACIAL · RASCUNHO LOCAL</Text>
      <Text style={styles.title}>{L1_BODY_REFERENCE.title}</Text>
      <Text style={styles.intro}>Antes de uma imagem, descreva as relações pelo corpo — não pelo lado da tela ou pela gravidade.</Text>
      <BodyReferenceMap
        posture={posture}
        perspective={perspective}
        selectedRelation={relationForChallenge(challenge.objectiveId)}
        reduceMotion={reduceMotion}
        landmarks={challenge.answerOptions}
        onPostureChange={setPosture}
        onPerspectiveChange={setPerspective}
        onRegionSelect={(answerId) => { setSelectedRegion(answerId); setSelectedAnswerId(answerId); }}
      />
      {selectedRegion ? <Text style={styles.selection}>Opção visual selecionada. Confirme a decisão no controle separado.</Text> : null}
      <View style={styles.activity}>
        <Text style={styles.activityLabel}>{activityLabel(challenge.evidenceKind)}</Text>
        <Text style={styles.prompt}>{challenge.prompt}</Text>
        <Text accessible accessibilityLabel={challenge.accessiblePrompt} style={styles.accessibleAlternative}>Alternativa textual: escolha uma opção numerada com a mesma posição indicada no modelo.</Text>
        <View style={styles.options}>
          {challenge.answerOptions.map((option, index) => {
            const selected = option.id === selectedAnswerId;
            return (
              <Pressable
                key={option.id}
                accessibilityRole="radio"
                accessibilityLabel={`Selecionar opção ${index + 1}. ${option.textDescription}`}
                accessibilityHint="Seleciona esta opção. A confirmação acontece em um controle separado."
                accessibilityState={{ selected }}
                onPress={() => setSelectedAnswerId(option.id)}
                style={[styles.option, selected && styles.optionSelected]}
              >
                <Text style={styles.optionNumber}>{index + 1}</Text>
                <View style={styles.optionText}><Text style={styles.optionLabel}>{option.label}</Text><Text style={styles.optionDescription}>{option.textDescription}</Text></View>
                {selected ? <Text style={styles.selected}>Selecionada</Text> : null}
              </Pressable>
            );
          })}
        </View>
        {!isScenarioAligned ? (
          <View style={styles.restoreNotice}>
            <Text style={styles.optionDescription}>A exploração mudou o cenário. Restaure a vista e a postura pedidas antes de confirmar uma decisão.</Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Restaurar cenário do desafio"
              onPress={() => { setPosture(challenge.posture); setPerspective(challenge.perspective); }}
              style={styles.restore}
            ><Text style={styles.restoreText}>Restaurar cenário do desafio</Text></Pressable>
          </View>
        ) : null}
        {state === 'answering' ? (
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ disabled: !selectedAnswerId || !isScenarioAligned }}
            disabled={!selectedAnswerId || !isScenarioAligned}
            onPress={confirm}
            style={[styles.confirm, !selectedAnswerId && styles.confirmDisabled]}
          ><Text style={styles.confirmText}>Confirmar decisão</Text></Pressable>
        ) : null}
        {state === 'feedback' && result ? (
          <View style={styles.feedback} accessibilityLiveRegion="polite">
            <Text style={styles.feedbackTitle}>{result.correct ? 'Boa leitura da relação' : 'Vamos ajustar a referência'}</Text>
            <Text style={styles.feedbackText}>{result.feedback}</Text>
            {result.evidenceKind === 'assisted_practice' && result.correct ? <Text style={styles.feedbackText}>A prática assistida foi registrada; ela não demonstra domínio.</Text> : null}
            {result.evidenceKind === 'later_independent_retrieval' && result.correct ? <Text style={styles.feedbackTitle}>Recuperação independente registrada.</Text> : null}
            {result.reviewTargetId ? <Text style={styles.feedbackText}>Este objetivo permanece pendente para {result.reviewTargetId}, em um item novo; esta repetição não demonstra domínio.</Text> : null}
            {feedbackActionLabel ? <Pressable accessibilityRole="button" onPress={feedbackAction} style={styles.next}><Text style={styles.confirmText}>{feedbackActionLabel}</Text></Pressable> : null}
          </View>
        ) : null}
      </View>
      <View style={styles.summary}>
        <Text style={styles.summaryTitle}>Síntese para retomar depois</Text>
        {L1_BODY_REFERENCE.synthesis.map((line) => <Text key={line} style={styles.summaryText}>• {line}</Text>)}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: space.s4, gap: space.s3, backgroundColor: galaxyColors.background },
  eyebrow: { ...typography.caption, color: semanticColors.galaxy.statusInformation },
  title: { ...typography.h1, color: galaxyColors.textPrimary },
  intro: { ...typography.bodyRegular, color: galaxyColors.textSecondary },
  selection: { ...typography.caption, color: semanticColors.galaxy.statusInformation },
  activity: { gap: space.s2, padding: space.s3, borderRadius: radius.rLg, backgroundColor: semanticColors.galaxy.surface, borderWidth: 1, borderColor: semanticColors.galaxy.border },
  activityLabel: { ...typography.caption, color: semanticColors.galaxy.statusWarning },
  prompt: { ...typography.h3, color: galaxyColors.textPrimary },
  accessibleAlternative: { ...typography.bodyRegular, color: galaxyColors.textSecondary },
  options: { gap: space.s2 },
  option: { minHeight: 44, padding: space.s3, borderRadius: radius.rMd, borderWidth: 1, borderColor: semanticColors.galaxy.border, flexDirection: 'row', alignItems: 'center', gap: space.s2 },
  optionSelected: { borderWidth: 2, borderColor: semanticColors.galaxy.statusSuccess, backgroundColor: 'rgba(93,227,174,0.14)' },
  optionNumber: { ...typography.bodyStrong, color: semanticColors.galaxy.statusInformation },
  optionText: { flex: 1, gap: space.s1 },
  optionLabel: { ...typography.bodyRegular, color: galaxyColors.textPrimary },
  optionDescription: { ...typography.caption, color: galaxyColors.textSecondary },
  restoreNotice: { gap: space.s2, padding: space.s2, borderRadius: radius.rMd, borderWidth: 1, borderColor: semanticColors.galaxy.statusWarning },
  restore: { minHeight: 44, justifyContent: 'center', alignItems: 'center', borderRadius: radius.rMd, borderWidth: 1, borderColor: semanticColors.galaxy.statusInformation, paddingHorizontal: space.s3 },
  restoreText: { ...typography.bodyStrong, color: semanticColors.galaxy.statusInformation },
  selected: { ...typography.caption, color: semanticColors.galaxy.statusSuccess },
  confirm: { minHeight: 44, borderRadius: radius.rMd, justifyContent: 'center', alignItems: 'center', backgroundColor: semanticColors.galaxy.statusInformation, paddingHorizontal: space.s3 },
  confirmDisabled: { opacity: 0.45 },
  confirmText: { ...typography.bodyStrong, color: galaxyColors.background },
  feedback: { gap: space.s2, padding: space.s3, borderRadius: radius.rMd, backgroundColor: galaxyColors.backgroundAlt },
  feedbackTitle: { ...typography.bodyStrong, color: galaxyColors.textPrimary },
  feedbackText: { ...typography.bodyRegular, color: galaxyColors.textSecondary },
  next: { minHeight: 44, justifyContent: 'center', alignItems: 'center', borderRadius: radius.rMd, backgroundColor: semanticColors.galaxy.statusSuccess, paddingHorizontal: space.s3 },
  summary: { gap: space.s1, padding: space.s3, borderRadius: radius.rLg, backgroundColor: galaxyColors.backgroundAlt },
  summaryTitle: { ...typography.bodyStrong, color: galaxyColors.textPrimary },
  summaryText: { ...typography.bodyRegular, color: galaxyColors.textSecondary },
});
