import React, { useEffect } from 'react';
import { Modal, StyleSheet, Text, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { AppButton } from '../../../components/ui/AppButton';
import { Confetti } from '../../../components/ui/Confetti';
import { STORAGE_KEYS } from '../../../constants/storageKeys';
import { rawHasUnknownSchemaVersion } from '../../../storage/schemaVersionGuard';
import type { JourneyUnit } from '../../../types/journey';
import { useReducedMotionPreference } from '../../../ui/accessibility/useReducedMotionPreference';
import type { LessonFeedback } from '../../../ui/feedback/lessonFeedback';
import { radius, space, typography } from '../../../ui/styles';
import { galaxyColors } from '../../../ui/theme';
import { resolveNodeTheme } from '../services/resolveNodeTheme';
import { JourneyMedal } from './JourneyMedal';

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

type UnitCompleteCelebrationProps = {
  /** A unidade que acabou de ser concluída; `null` não mostra nada. */
  unit: CelebrationUnit | null;
  onContinue: () => void;
  feedback?: Pick<LessonFeedback, 'emit'> | null;
};

/**
 * Comemoração curta de unidade concluída: confete, medalha, uma frase e
 * "Continuar". O botão (ou o voltar do Android) dispensa na hora; o confete
 * não recebe toque e some sozinho com "reduzir movimento".
 */
export function UnitCompleteCelebration({ unit, onContinue, feedback }: UnitCompleteCelebrationProps): React.ReactElement | null {
  const reducedMotion = useReducedMotionPreference();
  const unitId = unit?.id ?? null;

  // Uma vez por unidade mostrada: o efeito só roda quando a unidade muda.
  useEffect(() => {
    if (unitId !== null) feedback?.emit('unit_complete');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unitId]);

  if (!unit) return null;
  return (
    <Modal visible transparent animationType={reducedMotion ? 'none' : 'fade'} onRequestClose={onContinue}>
      <View style={styles.backdrop} accessibilityViewIsModal>
        <Confetti count={30} />
        <View style={styles.card}>
          <JourneyMedal node={{ id: unit.id, type: 'reward' }} theme={resolveNodeTheme({}, unit)} state="done" pulsing={false} size={56}
            accessibilityLabel={`${unit.title}. Unidade concluída.`} />
          <Text style={styles.title} accessibilityRole="header">Unidade concluída</Text>
          <Text style={styles.line}>Você fechou {unit.title}. Cada aula e cada conferência dela contam no seu caminho.</Text>
          <AppButton label="Continuar" variant="galaxy" onPress={onContinue} accessibilityLabel="Continuar" />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: space.s4, backgroundColor: 'rgba(8,10,18,0.86)' },
  card: { alignItems: 'center', gap: space.s3, padding: space.s4, borderRadius: radius.rMd, backgroundColor: galaxyColors.surface,
    borderWidth: 1, borderColor: galaxyColors.border, alignSelf: 'stretch' },
  title: { ...typography.h3, lineHeight: undefined, color: galaxyColors.textPrimary, textAlign: 'center' },
  line: { ...typography.bodyRegular, color: galaxyColors.textSecondary, textAlign: 'center' },
});
