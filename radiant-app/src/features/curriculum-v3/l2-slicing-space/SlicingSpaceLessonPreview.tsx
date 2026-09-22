import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useReducedMotionPreferenceState } from '../../../ui/accessibility/useReducedMotionPreference';
import { semanticColors } from '../../../ui/semantic-colors';
import { radius, space, typography } from '../../../ui/styles';
import { galaxyColors } from '../../../ui/theme';
import { L2_SLICING_SPACE } from './l2SlicingSpaceContent';
import { createSlicingSpaceLessonSession, type SlicingSpaceAnswerResult } from './SlicingSpaceLessonSession';
import { SlicingSpaceModel } from './SlicingSpaceModel';
import type { L2Inclination, L2MedianRelation, L2ReferenceOrientation, L2Region, L2Thickness } from './l2SlicingGeometry';
import type { L2Challenge, L2ModelLayerId } from './l2SlicingSpace.types';

const challengeById = (id: string): L2Challenge => {
  const challenge = L2_SLICING_SPACE.challenges.find((entry) => entry.id === id);
  if (!challenge) throw new Error(`Unknown L2 preview challenge: ${id}`);
  return challenge;
};

const activityLabel = (challenge: L2Challenge): string => {
  if (challenge.evidenceKind === 'assisted_practice') return 'Prática assistida · não demonstra domínio';
  if (challenge.evidenceKind === 'later_independent_retrieval') return 'Recuperação independente · novo cenário';
  return challenge.id === 'l2-initial-median' ? 'Diagnóstico inicial · sem XP' : 'Decisão independente · sem XP';
};

export function SlicingSpaceLessonPreview() {
  const [session] = useState(createSlicingSpaceLessonSession);
  const [challengeId, setChallengeId] = useState(L2_SLICING_SPACE.sequence[0]);
  const [orientation, setOrientation] = useState<L2ReferenceOrientation>('coronal');
  const [medianRelation, setMedianRelation] = useState<L2MedianRelation>('median');
  const [inclination, setInclination] = useState<L2Inclination>('aligned');
  const [region, setRegion] = useState<L2Region>('thorax');
  const [thickness, setThickness] = useState<L2Thickness>('nominal');
  const [selectedLayer, setSelectedLayer] = useState<L2ModelLayerId>('geometric-plane');
  const [selectedAnswerId, setSelectedAnswerId] = useState<string | null>(null);
  const [result, setResult] = useState<SlicingSpaceAnswerResult | null>(null);
  const { reducedMotionEnabled: reduceMotion, resolved: motionResolved } = useReducedMotionPreferenceState();
  const challenge = challengeById(challengeId);

  const showChallenge = (nextChallengeId: string) => {
    challengeById(nextChallengeId);
    setChallengeId(nextChallengeId);
    setOrientation('coronal');
    setMedianRelation('median');
    setInclination('aligned');
    setRegion('thorax');
    setThickness('nominal');
    setSelectedLayer('geometric-plane');
    setSelectedAnswerId(null);
    setResult(null);
  };

  const confirm = () => {
    if (!selectedAnswerId) return;
    setResult(session.answer(challenge.id, selectedAnswerId));
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
    : result?.nextChallengeId ? result.nextActionLabel ?? 'Continuar' : null;

  return <ScrollView contentContainerStyle={styles.content} accessibilityLabel="Prévia isolada da lição Cortando o espaço">
    <Text style={styles.eyebrow}>L2 · ORIENTAÇÃO ESPACIAL · RASCUNHO LOCAL</Text>
    <Text style={styles.title}>{L2_SLICING_SPACE.title}</Text>
    <Text style={styles.intro}>A referência geométrica ajuda a situar dados de uma região. Plano, região, espessura e imagem não são sinônimos.</Text>
    <SlicingSpaceModel {...{ orientation, medianRelation, inclination, region, thickness, selectedLayer, reduceMotion, motionResolved }} scenarioId={challenge.visualScenarioId} answerOptions={challenge.answerOptions} onCandidateSelect={setSelectedAnswerId} onOrientationChange={setOrientation} onMedianRelationChange={setMedianRelation} onInclinationChange={setInclination} onRegionChange={setRegion} onThicknessChange={setThickness} onLayerSelect={setSelectedLayer} />
    <View style={styles.activity}>
      <Text style={styles.activityLabel}>{activityLabel(challenge)}</Text>
      <Text style={styles.prompt}>{challenge.prompt}</Text>
      <Text accessible accessibilityLabel={challenge.accessiblePrompt} style={styles.accessibleAlternative}>Alternativa textual: escolha uma opção numerada a partir dos dados descritos, sem depender da cor do modelo.</Text>
      <View style={styles.options}>
        {challenge.answerOptions.map((option, index) => {
          const selected = selectedAnswerId === option.id;
          return <Pressable key={option.id} accessibilityRole="radio" accessibilityLabel={`Selecionar opção ${index + 1}. ${option.textDescription}`} accessibilityHint="Seleciona esta opção. A confirmação acontece em um controle separado." accessibilityState={{ selected }} accessibilityValue={{ text: selected ? 'selecionada' : 'não selecionada' }} onPress={() => setSelectedAnswerId(option.id)} style={[styles.option, selected && styles.optionSelected]}>
            <Text style={styles.optionNumber}>{index + 1}</Text><View style={styles.optionText}><Text style={styles.optionLabel}>{`Opção ${index + 1}`}</Text><Text style={styles.optionDescription}>{option.textDescription}</Text></View>{selected ? <Text style={styles.selected}>Selecionada</Text> : null}
          </Pressable>;
        })}
      </View>
      {!result ? <Pressable accessibilityRole="button" accessibilityState={{ disabled: !selectedAnswerId }} disabled={!selectedAnswerId} onPress={confirm} style={[styles.confirm, !selectedAnswerId && styles.confirmDisabled]}><Text style={styles.confirmText}>Confirmar decisão</Text></Pressable> : null}
      {result ? <View style={styles.feedback} accessibilityLiveRegion="polite"><Text style={styles.feedbackTitle}>{result.correct ? 'Leitura registrada' : 'Vamos ajustar o modelo'}</Text><Text style={styles.feedbackText}>{result.feedback}</Text>{result.evidenceKind === 'assisted_practice' && result.correct ? <Text style={styles.feedbackText}>A prática assistida foi registrada; ela não demonstra domínio.</Text> : null}{result.evidenceKind === 'later_independent_retrieval' && result.demonstratesMastery ? <Text style={styles.feedbackTitle}>Recuperação independente registrada.</Text> : null}<Text style={styles.feedbackText}>Este objetivo permanece em {result.reviewTargetId}, com um item novo; XP e repetição imediata não comprovam domínio.</Text>{feedbackActionLabel ? <Pressable accessibilityRole="button" onPress={feedbackAction} style={styles.next}><Text style={styles.confirmText}>{feedbackActionLabel}</Text></Pressable> : null}</View> : null}
    </View>
    <View style={styles.summary}><Text style={styles.summaryTitle}>Síntese para retomar depois</Text>{L2_SLICING_SPACE.synthesis.map((line) => <Text key={line} style={styles.summaryText}>• {line}</Text>)}</View>
  </ScrollView>;
}

const styles = StyleSheet.create({
  content: { padding: space.s4, gap: space.s3, backgroundColor: galaxyColors.background }, eyebrow: { ...typography.caption, color: semanticColors.galaxy.statusInformation }, title: { ...typography.h1, color: galaxyColors.textPrimary }, intro: { ...typography.bodyRegular, color: galaxyColors.textSecondary }, activity: { gap: space.s2, padding: space.s3, borderRadius: radius.rLg, backgroundColor: semanticColors.galaxy.surface, borderWidth: 1, borderColor: semanticColors.galaxy.border }, activityLabel: { ...typography.caption, color: semanticColors.galaxy.statusWarning }, prompt: { ...typography.h3, color: galaxyColors.textPrimary }, accessibleAlternative: { ...typography.bodyRegular, color: galaxyColors.textSecondary }, options: { gap: space.s2 }, option: { minHeight: 44, padding: space.s3, borderRadius: radius.rMd, borderWidth: 1, borderColor: semanticColors.galaxy.border, flexDirection: 'row', alignItems: 'center', gap: space.s2 }, optionSelected: { borderWidth: 2, borderColor: semanticColors.galaxy.statusSuccess, backgroundColor: 'rgba(93,227,174,0.14)' }, optionNumber: { ...typography.bodyStrong, color: semanticColors.galaxy.statusInformation }, optionText: { flex: 1, gap: space.s1 }, optionLabel: { ...typography.bodyRegular, color: galaxyColors.textPrimary }, optionDescription: { ...typography.caption, color: galaxyColors.textSecondary }, restoreNotice: { gap: space.s2, padding: space.s2, borderRadius: radius.rMd, borderWidth: 1, borderColor: semanticColors.galaxy.statusWarning }, restore: { minHeight: 44, justifyContent: 'center', alignItems: 'center', borderRadius: radius.rMd, borderWidth: 1, borderColor: semanticColors.galaxy.statusInformation, paddingHorizontal: space.s3 }, restoreText: { ...typography.bodyStrong, color: semanticColors.galaxy.statusInformation }, selected: { ...typography.caption, color: semanticColors.galaxy.statusSuccess }, confirm: { minHeight: 44, borderRadius: radius.rMd, justifyContent: 'center', alignItems: 'center', backgroundColor: semanticColors.galaxy.statusInformation, paddingHorizontal: space.s3 }, confirmDisabled: { opacity: 0.45 }, confirmText: { ...typography.bodyStrong, color: galaxyColors.background }, feedback: { gap: space.s2, padding: space.s3, borderRadius: radius.rMd, backgroundColor: galaxyColors.backgroundAlt }, feedbackTitle: { ...typography.bodyStrong, color: galaxyColors.textPrimary }, feedbackText: { ...typography.bodyRegular, color: galaxyColors.textSecondary }, next: { minHeight: 44, justifyContent: 'center', alignItems: 'center', borderRadius: radius.rMd, backgroundColor: semanticColors.galaxy.statusSuccess, paddingHorizontal: space.s3 }, summary: { gap: space.s1, padding: space.s3, borderRadius: radius.rLg, backgroundColor: galaxyColors.backgroundAlt }, summaryTitle: { ...typography.bodyStrong, color: galaxyColors.textPrimary }, summaryText: { ...typography.bodyRegular, color: galaxyColors.textSecondary },
});
