import React, { useEffect } from 'react';
import { Modal, StyleSheet, Text, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

import { AppButton } from '../../../components/ui/AppButton';
import { Confetti } from '../../../components/ui/Confetti';
import { STORAGE_KEYS } from '../../../constants/storageKeys';
import { rawHasUnknownSchemaVersion } from '../../../storage/schemaVersionGuard';
import type { JourneyUnit } from '../../../types/journey';
import { AppConfig } from '../../../config';
import { useReducedMotionPreference } from '../../../ui/accessibility/useReducedMotionPreference';
import { motionMsFor, type LessonFeedback } from '../../../ui/feedback/lessonFeedback';
import { MotionView, useMedalMint } from '../../../ui/motion';
import { space, typography } from '../../../ui/styles';
import { galaxyColors } from '../../../ui/theme';
import { resolveNodeTheme } from '../services/resolveNodeTheme';
import { JourneyMedal } from './JourneyMedal';
import type { ConversionService } from '../../conversion/ConversionService';
import { ConversionInvite } from '../../conversion/components/ConversionInvite';
import { useConversionInvite } from '../../conversion/useConversionInvite';
import { SummaryHero } from '../../quiz/components/SummaryHero';

export type CelebrationUnit = { id: string; title: string; theme?: JourneyUnit['theme'] };
type TrailSegment = { trackId: string; trackTitle: string; units: Pick<JourneyUnit, 'nodes' | 'theme'>[] };

/** Unidades (uma trilha por unidade) com todas as aulas e conferências concluídas. A conquista não entra na conta. */
export function completedCelebrationUnits(segments: readonly TrailSegment[]): CelebrationUnit[] {
  return segments.flatMap(segment => {
    const steps = segment.units.flatMap(unit => unit.nodes).filter(node => node.type === 'lesson' || node.type === 'checkpoint');
    return steps.length > 0 && steps.every(node => node.status === 'completed')
      ? [{ id: segment.trackId, title: segment.trackTitle, theme: segment.units[0]?.theme }] : [];
  });
}

const SCHEMA_VERSION = 1;
const KNOWN_SCHEMA_VERSIONS: readonly unknown[] = [SCHEMA_VERSION];

/**
 * Devolve a unidade a comemorar agora, uma vez por unidade.
 *
 * A marca é gravada antes de mostrar, então fechar o app no meio não repete a
 * comemoração. Na primeira leitura (store ausente) as unidades já concluídas
 * viram a base, sem festa: quem atualiza o app não vê a comemoração de tudo o
 * que já tinha feito. Store ilegível, de versão mais nova (G7) ou que não grava
 * não comemora, porque sem a marca a festa voltaria a cada abertura.
 */
export async function takeUnitCelebration(completed: readonly CelebrationUnit[]): Promise<CelebrationUnit | null> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.UNIT_CELEBRATIONS);
    if (rawHasUnknownSchemaVersion(raw, KNOWN_SCHEMA_VERSIONS)) return null;
    const stored = raw === null ? null : (JSON.parse(raw) as { unitIds?: unknown } | null)?.unitIds;
    const seen = Array.isArray(stored) ? stored.filter((id): id is string => typeof id === 'string') : null;
    const fresh = completed.filter(unit => !seen?.includes(unit.id));
    if (seen && fresh.length === 0) return null;
    await AsyncStorage.setItem(STORAGE_KEYS.UNIT_CELEBRATIONS,
      JSON.stringify({ schemaVersion: SCHEMA_VERSION, unitIds: [...(seen ?? []), ...fresh.map(unit => unit.id)] }));
    return seen ? fresh[fresh.length - 1] : null;
  } catch (error) {
    console.error('[UnitCompleteCelebration] Falha ao ler ou marcar a comemoração:', error);
    return null;
  }
}

/** F3: a medalha da unidade cunha ao aparecer, na duração de conclusão do mapa. */
function MintedMedal({ children }: { children: React.ReactNode }) {
  const mintStyle = useMedalMint(true, motionMsFor('unit_complete'));
  return <MotionView style={mintStyle}>{children}</MotionView>;
}

type UnitCompleteCelebrationProps = {
  /** A unidade que acabou de ser concluída; `null` não mostra nada. */
  unit: CelebrationUnit | null;
  onContinue: () => void;
  feedback?: Pick<LessonFeedback, 'emit'> | null;
  conversion?: Pick<ConversionService, 'peekInvite' | 'markInviteSeen' | 'takeSample'>;
};

/**
 * Comemoração curta de unidade concluída: confete, medalha, uma frase e
 * "Continuar". O botão (ou o voltar do Android) dispensa na hora; o confete
 * não recebe toque e some sozinho com "reduzir movimento".
 */
export function UnitCompleteCelebration({ unit, onContinue, feedback, conversion }: UnitCompleteCelebrationProps): React.ReactElement | null {
  const reducedMotion = useReducedMotionPreference();
  // F8: convite opcional e discreto; "Continuar" segue como a ação principal.
  const { invite } = useConversionInvite('unit-complete', unit !== null, conversion);
  const unitId = unit?.id ?? null;
  // F3 (ADR 2026-11-15): com a chave, a medalha cunha ao abrir; o botão não espera.
  const rich = AppConfig.ENABLE_RICH_FEEDBACK;

  // Uma vez por unidade mostrada: o efeito só roda quando a unidade muda.
  useEffect(() => {
    if (unitId !== null) feedback?.emit('unit_complete');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unitId]);

  if (!unit) return null;
  const medal = (
    <JourneyMedal node={{ id: unit.id, type: 'reward' }} theme={resolveNodeTheme({}, unit)} state="done" pulsing={false} size={68}
      accessibilityLabel={`${unit.title}. Unidade concluída.`} />
  );
  return (
    <Modal visible transparent animationType={reducedMotion ? 'none' : 'fade'} onRequestClose={onContinue}>
      <View style={styles.backdrop} accessibilityViewIsModal>
        <Confetti count={30} />
        <View style={styles.body}>
          {/* A Home deixa esta comemoração montada entre unidades: a chave pela
              unidade dá a cada uma a sua cunhagem. */}
          <SummaryHero>{rich ? <MintedMedal key={unit.id}>{medal}</MintedMedal> : medal}</SummaryHero>
          <Text style={styles.title} accessibilityRole="header">Unidade concluída</Text>
          <Text style={styles.line}>Você fechou {unit.title}. Cada aula e cada conferência dela contam no seu caminho.</Text>
        </View>
        <View style={styles.footer}>
          <AppButton label="Continuar" variant="galaxy" onPress={onContinue} accessibilityLabel="Continuar" />
          {invite ? (
            <ConversionInvite moment="unit-complete" sampleAvailable={false}
              onLearnMore={() => {
                // Empilha a assinatura sob o Modal e só então o fecha: empilhar
                // depois, com o Modal saindo, não foi visto no iOS (revisão da F8).
                router.push('/subscription');
                onContinue();
              }} />
          ) : null}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: galaxyColors.background },
  body: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: space.s3, padding: space.s4 },
  footer: { gap: space.s2, padding: space.s3 },
  title: { ...typography.h2, lineHeight: undefined, color: galaxyColors.textPrimary, textAlign: 'center' },
  line: { ...typography.bodyRegular, lineHeight: undefined, color: galaxyColors.textSecondary, textAlign: 'center' },
});
