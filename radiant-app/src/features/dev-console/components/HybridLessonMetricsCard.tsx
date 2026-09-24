import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { hybridLessonMetricsRepository, type HybridLessonRecord } from '../../curriculum-v3/hybrid-l1/HybridLessonMetricsRepository';
import { galaxyColors } from '../../../ui/theme';
import { radius, space, typography } from '../../../ui/styles';

type Props = Readonly<{ repository?: Readonly<{ list(): Promise<readonly HybridLessonRecord[]> }> }>;

const OUTCOME: Readonly<Record<HybridLessonRecord['outcome'], string>> = { completed: 'Concluiu', out_of_hearts: 'Ficou sem vidas', abandoned: 'Abandonou' };

function minutes(ms: number): string {
  const s = Math.round(ms / 1000);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

function summaryLines(entry: HybridLessonRecord): string[] {
  const times = Object.values(entry.summary.itemTimesMs);
  const mean = times.length === 0 ? 0 : Math.round(times.reduce((a, b) => a + b, 0) / times.length / 1000);
  const confusions = Object.entries(entry.summary.misconceptions).map(([code, n]) => `${code} × ${n}`).join(', ') || 'nenhuma';
  return [
    `${entry.finishedAt.slice(0, 16).replace('T', ' ')} · ${OUTCOME[entry.outcome]}${entry.abandonedAtItemId ? ` em ${entry.abandonedAtItemId}` : ''}`,
    `Precisão ${Math.round(entry.summary.accuracy * 100)}% · Tempo ${minutes(entry.summary.durationMs)} · Média por item ${mean} s`,
    `Vidas gastas ${entry.summary.heartsSpent} · Itens que voltaram ${entry.summary.requeued} · Maior sequência ${entry.summary.bestStreak}`,
    `Confusões: ${confusions}`,
  ];
}

/** Medidas do piloto (spec §5.4), lidas do aparelho para a pessoa mostrar a tela. */
export function HybridLessonMetricsCard({ repository = hybridLessonMetricsRepository }: Props) {
  const [entries, setEntries] = useState<readonly HybridLessonRecord[] | null>(null);
  useEffect(() => { void repository.list().then(setEntries); }, [repository]);
  return (
    <View style={styles.card}>
      <Text style={styles.headline} accessibilityRole="header">Piloto da lição híbrida</Text>
      {entries === null ? null : entries.length === 0 ? (
        <Text style={styles.line}>Nenhuma sessão do piloto neste aparelho.</Text>
      ) : entries.map((entry) => (
        <View key={entry.finishedAt} style={styles.entry}>
          {summaryLines(entry).map((line) => <Text key={line} style={styles.line}>{line}</Text>)}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: galaxyColors.surface, borderRadius: radius.rLg, borderWidth: 1, borderColor: galaxyColors.border, padding: space.s3, gap: space.s2 },
  headline: { ...typography.h3, color: galaxyColors.textPrimary },
  entry: { gap: space.s0, paddingTop: space.s1, borderTopWidth: 1, borderTopColor: galaxyColors.border },
  line: { ...typography.caption, color: galaxyColors.textSecondary },
});
