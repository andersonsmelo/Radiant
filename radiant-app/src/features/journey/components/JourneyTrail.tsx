import { galaxyColors } from '../../../ui/theme';
import { JourneyUnitNavigation } from './JourneyUnitNavigation';
import { computeUnitPrimaryProgress } from '../services/JourneyUnitProgress';
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

import type { JourneyNode, JourneyUnit, NextNodeDecision } from '../../../types/journey';
import type { CurriculumSegment } from '../services/JourneyCurriculumService';
import { space, typography } from '../../../ui/styles';
import { JourneyLevelBand } from './JourneyLevelBand';
import { JourneyNodeCard } from './JourneyNodeCard';
import { JourneyTrailSpine, type SpinePosition } from './JourneyTrailSpine';

const TRAIL_GAP = space.s3;
/** O nó PRÓXIMO fica no meio da tela, com o que veio antes e o que vem depois. */
const ANCHOR_VIEW_POSITION = 0.5;
/** Fora da janela virtualizada, cada tentativa aproxima pela altura média. */
const ANCHOR_MAX_RETRIES = 3;
const ANCHOR_RETRY_DELAY_MS = 50;

type JourneyTrailProps = {
  segments: CurriculumSegment[];
  recommendedNodeId?: string;
  recommendationReason?: NextNodeDecision['reason'];
  dueReviewCount?: number;
  onNodePress: (node: JourneyNode) => void;
  isNodeDisabled: (node: JourneyNode) => boolean;
  /** Rola junto com a trilha. Contém contexto e a única recomendação, em todos os tamanhos de texto. */
  header?: React.ReactElement;
};

type TrailBandItem = {
  kind: 'band';
  key: string;
  segment: CurriculumSegment;
  previousTrackTitle: string;
};

type TrailNodeItem = {
  kind: 'node';
  key: string;
  node: JourneyNode;
  nodeIndex: number;
  traveled: boolean;
  position: SpinePosition;
};

type TrailUnitItem = { kind: 'unit'; key: string; unit: JourneyUnit; trackTitle: string; unitNumber: number; unitCount: number };
type TrailItem = TrailBandItem | TrailNodeItem | TrailUnitItem;

function flattenTrail(segments: CurriculumSegment[], recommendedNodeId?: string): TrailItem[] {
  const showUnits = segments.some(segment => segment.units.length > 1);
  const flatNodes = segments.flatMap(segment => segment.units.flatMap(unit => unit.nodes));
  const lastIndex = flatNodes.length - 1;
  const recommendedIndex = flatNodes.findIndex(node => node.id === recommendedNodeId);
  const lastCompletedIndex = flatNodes.reduce(
    (last, node, index) => (node.status === 'completed' ? index : last),
    -1,
  );
  const reachedIndex = recommendedIndex >= 0 ? recommendedIndex : lastCompletedIndex;
  const items: TrailItem[] = [];
  let nodeIndex = 0;

  segments.forEach((segment, segmentIndex) => {
    if (segmentIndex > 0) {
      items.push({
        kind: 'band',
        key: `band:${segment.trackId}`,
        segment,
        previousTrackTitle: segments[segmentIndex - 1].trackTitle,
      });
    }

    segment.units.forEach((unit, unitIndex) => {
      if (showUnits) items.push({ kind: 'unit', key: `unit:${segment.trackId}:${unit.id}`, unit,
        trackTitle: segment.trackTitle, unitNumber: unitIndex + 1, unitCount: segment.units.length });
      unit.nodes.forEach(node => {
        const position: SpinePosition = lastIndex === 0
          ? 'only'
          : nodeIndex === 0
            ? 'first'
            : nodeIndex === lastIndex
              ? 'last'
              : 'middle';
        items.push({
          kind: 'node',
          key: `node:${node.id}`,
          node,
          nodeIndex,
          traveled: nodeIndex <= reachedIndex,
          position,
        });
        nodeIndex += 1;
      });
    });
  });

  return items;
}

/**
 * Percurso único e virtualizado. Bandas, unidades e nós compartilham a lista para
 * preservar a ordem e as chaves estáveis mesmo quando o currículo crescer.
 */
export function JourneyTrail({
  segments,
  recommendedNodeId,
  recommendationReason,
  dueReviewCount = 0,
  onNodePress,
  isNodeDisabled,
  header,
}: JourneyTrailProps) {
  const items = useMemo(
    () => flattenTrail(segments, recommendedNodeId),
    [segments, recommendedNodeId],
  );
  const recommendedIndex = useMemo(
    () => items.findIndex(item => item.kind === 'node' && item.node.id === recommendedNodeId),
    [items, recommendedNodeId],
  );

  // A trilha abre no ponto do aluno, e não no começo do currículo. Ela
  // centraliza uma vez por recomendação: recentralizar a cada medição
  // arrancaria o aluno do lugar para onde ele rolou. Quando a recomendação
  // muda (ele concluiu um nó), o novo PRÓXIMO ganha a sua vez.
  const listRef = useRef<FlatList<TrailItem>>(null);
  const anchoredNodeIdRef = useRef<string | undefined>(undefined);
  const measuredRef = useRef(false);
  const requestedPositionRef = useRef(ANCHOR_VIEW_POSITION);
  const retriesRef = useRef(0);
  const retryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (retryTimerRef.current) clearTimeout(retryTimerRef.current);
  }, []);

  const centerOn = useCallback((index: number, viewPosition = requestedPositionRef.current) => {
    requestedPositionRef.current = viewPosition;
    listRef.current?.scrollToIndex({ index, viewPosition, animated: false });
  }, []);

  const navigateToUnit = useCallback((index: number) => {
    retriesRef.current = 0;
    if (retryTimerRef.current) clearTimeout(retryTimerRef.current);
    centerOn(index, 0);
  }, [centerOn]);

  const anchorToRecommended = useCallback(() => {
    if (recommendedIndex < 0 || anchoredNodeIdRef.current === recommendedNodeId) return;
    anchoredNodeIdRef.current = recommendedNodeId;
    retriesRef.current = 0;
    if (retryTimerRef.current) clearTimeout(retryTimerRef.current);
    centerOn(recommendedIndex, ANCHOR_VIEW_POSITION);
  }, [centerOn, recommendedIndex, recommendedNodeId]);

  // Concluir um nó troca rótulos, não alturas: a lista já medida pode não
  // receber nova medição, então a recomendação nova é ancorada aqui. Antes
  // da primeira medição quem ancora é `onContentSizeChange`.
  useEffect(() => {
    if (measuredRef.current) anchorToRecommended();
  }, [anchorToRecommended]);

  const handleContentSizeChange = useCallback(() => {
    measuredRef.current = true;
    anchorToRecommended();
  }, [anchorToRecommended]);

  const handleScrollToIndexFailed = useCallback(
    ({ index, averageItemLength }: { index: number; averageItemLength: number }) => {
      listRef.current?.scrollToOffset({ offset: averageItemLength * index, animated: false });
      if (retriesRef.current >= ANCHOR_MAX_RETRIES) return;
      retriesRef.current += 1;
      if (retryTimerRef.current) clearTimeout(retryTimerRef.current);
      retryTimerRef.current = setTimeout(() => centerOn(index), ANCHOR_RETRY_DELAY_MS);
    },
    [centerOn],
  );

  return (
    <FlatList
      ref={listRef}
      testID="journey-trail"
      onContentSizeChange={handleContentSizeChange}
      onScrollToIndexFailed={handleScrollToIndexFailed}
      data={items}
      keyExtractor={item => item.key}
      initialNumToRender={12}
      windowSize={7}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.trail}
      ListHeaderComponent={items.some(item => item.kind === 'unit') ? <>
        {header}
        <JourneyUnitNavigation
          destinations={items.flatMap((item, itemIndex) => item.kind === 'unit' ? [{ key: item.key, unitId: item.unit.id,
            title: item.unit.title, trackTitle: item.trackTitle, unitNumber: item.unitNumber, unitCount: item.unitCount, itemIndex }] : [])}
          onSelect={navigateToUnit}
        />
      </> : header}
      renderItem={({ item }) => {
        if (item.kind === 'band') {
          return (
            <JourneyLevelBand
              trackId={item.segment.trackId}
              trackTitle={item.segment.trackTitle}
              unlocked={item.segment.unlocked}
              previousTrackTitle={item.previousTrackTitle}
            />
          );
        }

        if (item.kind === 'unit') {
          const progress = computeUnitPrimaryProgress(item.unit);
          const finished = progress.total > 0 && progress.completed === progress.total;
          const state = finished ? 'Concluída' : item.unit.nodes.every(node => node.status === 'locked') ? 'Bloqueada'
            : item.unit.nodes.some(node => ['completed', 'active', 'resumable'].includes(node.status)) ? 'Em andamento' : 'Disponível';
          const optionalReward = item.unit.nodes.some(node => node.type === 'reward' && node.optionalForProgression && node.status === 'available');
          return <View accessible accessibilityRole="header"
            accessibilityLabel={`Unidade ${item.unitNumber} de ${item.unitCount}: ${item.unit.title}. ${state}. ${progress.completed} de ${progress.total} etapas.${optionalReward ? ' Conquista opcional disponível.' : ''}`}
            style={styles.unit}>
            <Text style={styles.unitCaption}>Unidade {item.unitNumber} de {item.unitCount} · {state}</Text>
            <Text style={styles.unitTitle}>{item.unit.title}</Text>
            <Text style={styles.unitCaption}>{progress.completed} de {progress.total} etapas</Text>
            {optionalReward ? <Text style={styles.unitCaption}>Conquista opcional disponível</Text> : null}
            {state === 'Bloqueada' ? <Text style={styles.unitCaption}>Conclua as etapas anteriores para estudar esta unidade.</Text> : null}
          </View>;
        }

        const alignRight = item.nodeIndex % 2 === 1;
        return (
          <View
            testID={`journey-trail-row-${item.node.id}`}
            style={styles.row}
            accessibilityValue={{ text: alignRight ? 'direita' : 'esquerda' }}
          >
            <JourneyTrailSpine
              traveled={item.traveled}
              position={item.position}
              gap={TRAIL_GAP}
            />
            <JourneyNodeCard
              node={item.node}
              nodeIndex={item.nodeIndex}
              isRecommended={item.node.id === recommendedNodeId}
              recommendationReason={recommendationReason}
              dueReviewCount={dueReviewCount}
              onPress={onNodePress}
              disabled={isNodeDisabled(item.node)}
            />
          </View>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  trail: {
    position: 'relative',
    gap: TRAIL_GAP,
    paddingBottom: space.s3,
  },
  row: { position: 'relative' },
  unit: { paddingVertical: space.s2, gap: space.s0 },
  unitTitle: { ...typography.label, color: galaxyColors.textPrimary },
  unitCaption: { ...typography.micro, color: galaxyColors.textSecondary },
});
