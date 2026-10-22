import { galaxyColors } from '../../../ui/theme';
import { JourneyUnitNavigation } from './JourneyUnitNavigation';
import { computeUnitPrimaryProgress } from '../services/JourneyUnitProgress';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FlatList, StyleSheet, Text, View, useWindowDimensions, type LayoutChangeEvent } from 'react-native';

import type { JourneyNode, JourneyUnit, NextNodeDecision } from '../../../types/journey';
import type { LessonStars } from '../../quiz/services/resolveLessonStars';
import type { CurriculumSegment } from '../services/JourneyCurriculumService';
import { resolveNodeTheme } from '../services/resolveNodeTheme';
import { space, typography } from '../../../ui/styles';
import { useLargeTextLayout } from '../../../ui/accessibility/useLargeTextLayout';
import { JourneyLevelBand } from './JourneyLevelBand';
import { JourneyMedal, medalStateFor } from './JourneyMedal';
import { JourneyPathSegment } from './JourneyPathSegment';
import { getRecommendationCopy, getStatusCopy } from './nodeCopy';
import {
  NEXT_MEDAL_RADIUS,
  TRAIL_RING_ROOM,
  TRAIL_SEGMENT_HEIGHT,
  TRAIL_TITLE_MAX_WIDTH,
  medalOffsetX,
} from './trailLayout';

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
  /** O recorde de estrelas por aula. Só as lições concluídas o mostram. */
  starsByLessonId?: Record<string, LessonStars>;
  /** O que fica ao lado da medalha (o Pixel, ao lado da próxima). Decorativo. */
  pixelSlot?: (nodeId: string) => React.ReactNode;
};

const NO_STARS: Record<string, LessonStars> = {};
const hiddenFromReader = {
  accessibilityElementsHidden: true,
  importantForAccessibility: 'no-hide-descendants',
} as const;

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
  unit: JourneyUnit;
  /** A posição da unidade dentro da área, a partir de 1: o checkpoint a traz no miolo. */
  unitNumber: number;
  /** O índice no percurso inteiro, que decide o zigue-zague. */
  nodeIndex: number;
  /** O trecho que chega a este nó já foi andado. */
  traveled: boolean;
};

type TrailUnitItem = { kind: 'unit'; key: string; unit: JourneyUnit; trackTitle: string; unitNumber: number; unitCount: number };
type TrailItem = TrailBandItem | TrailNodeItem | TrailUnitItem;

function flattenTrail(segments: CurriculumSegment[], recommendedNodeId?: string): TrailItem[] {
  const showUnits = segments.some(segment => segment.units.length > 1);
  const flatNodes = segments.flatMap(segment => segment.units.flatMap(unit => unit.nodes));
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
        items.push({
          kind: 'node',
          key: `node:${node.id}`,
          node,
          unit,
          unitNumber: unitIndex + 1,
          nodeIndex,
          traveled: nodeIndex <= reachedIndex,
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
 *
 * Cada nó é uma linha: primeiro o trecho pontilhado que chega a ele, a partir
 * do deslocamento do nó anterior, e depois a medalha deslocada no zigue-zague,
 * com o título embaixo. Tudo cabe dentro da linha (o anel da próxima inclusive),
 * então a lista pode recortar o que sai da tela sem cortar o desenho.
 */
export function JourneyTrail({
  segments,
  recommendedNodeId,
  recommendationReason,
  dueReviewCount = 0,
  onNodePress,
  isNodeDisabled,
  header,
  starsByLessonId = NO_STARS,
  pixelSlot,
}: JourneyTrailProps) {
  // Com texto grande o zigue-zague partia as palavras (achado 2 do gate H4): a
  // trilha vira uma coluna centrada, sem deslocamento.
  const largeText = useLargeTextLayout();
  // O zigue-zague é fração da meia-largura da lista. Até a primeira medida,
  // vale a largura da janela, para a trilha não abrir em coluna e saltar.
  const { width: windowWidth } = useWindowDimensions();
  const [measuredWidth, setMeasuredWidth] = useState<number | undefined>(undefined);
  const halfWidth = (measuredWidth ?? windowWidth) / 2;
  const handleLayout = useCallback((event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout;
    setMeasuredWidth(previous => (previous === width ? previous : width));
  }, []);

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
      onLayout={handleLayout}
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
            <Text style={styles.unitTitle}>{item.unit.title}</Text>
            <Text style={styles.unitCaption}>Unidade {item.unitNumber} de {item.unitCount} · {state}</Text>
            <Text style={styles.unitCaption}>{progress.completed} de {progress.total} etapas</Text>
            {optionalReward ? <Text style={styles.unitCaption}>Conquista opcional disponível</Text> : null}
            {state === 'Bloqueada' ? <Text style={styles.unitCaption}>Conclua as etapas anteriores para estudar esta unidade.</Text> : null}
          </View>;
        }

        const { node } = item;
        const isRecommended = node.id === recommendedNodeId;
        const offset = medalOffsetX(item.nodeIndex, halfWidth, largeText);
        const status = getRecommendationCopy(isRecommended, recommendationReason, dueReviewCount) ?? getStatusCopy(node);
        const stars = node.type === 'lesson' && node.status === 'completed' && node.lessonId
          ? starsByLessonId[node.lessonId]
          : undefined;
        const slot = pixelSlot?.(node.id);
        return (
          <View testID={`journey-trail-row-${node.id}`} style={styles.row}>
            {item.nodeIndex > 0 ? (
              <JourneyPathSegment
                fromX={medalOffsetX(item.nodeIndex - 1, halfWidth, largeText)}
                toX={offset}
                height={TRAIL_SEGMENT_HEIGHT}
                traveled={item.traveled}
              />
            ) : null}
            <View
              testID={`journey-anchor-${node.id}`}
              style={[styles.column, largeText && styles.columnLargeText, { transform: [{ translateX: offset }] }]}
            >
              <View style={styles.medalBox}>
                <JourneyMedal
                  node={node}
                  theme={resolveNodeTheme(node, item.unit)}
                  state={medalStateFor(node, isRecommended)}
                  pulsing={isRecommended}
                  stars={stars}
                  size={isRecommended ? NEXT_MEDAL_RADIUS : undefined}
                  unitNumber={node.type === 'checkpoint' ? item.unitNumber : undefined}
                  onPress={() => onNodePress(node)}
                  disabled={isNodeDisabled(node)}
                  accessibilityLabel={`${node.title}. ${status}.`}
                />
                {slot !== undefined && slot !== null && slot !== false ? (
                  // Para dentro da trilha, onde sobra espaço ao lado da medalha.
                  <View
                    pointerEvents="box-none"
                    {...hiddenFromReader}
                    style={[styles.slot, offset < 0 ? styles.slotRight : styles.slotLeft]}
                  >
                    {slot}
                  </View>
                ) : null}
              </View>
              {/* O título já está no rótulo da medalha; aqui é só para ver. */}
              <Text
                {...hiddenFromReader}
                numberOfLines={largeText ? undefined : 2}
                style={[
                  styles.nodeTitle,
                  largeText && styles.nodeTitleLargeText,
                  node.status === 'locked' && styles.nodeTitleLocked,
                ]}
              >
                {node.title}
              </Text>
            </View>
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
  row: { alignItems: 'center' },
  // Sem `overflow: 'hidden'` em lugar nenhum da linha: o anel da próxima sai
  // da caixa da medalha, e a folga de cima é o que o mantém inteiro.
  column: { alignItems: 'center', paddingTop: TRAIL_RING_ROOM },
  columnLargeText: { alignSelf: 'stretch' },
  medalBox: { alignItems: 'center' },
  slot: { position: 'absolute', top: 0, bottom: 0, justifyContent: 'center' },
  slotLeft: { right: '100%', marginRight: space.s1 },
  slotRight: { left: '100%', marginLeft: space.s1 },
  nodeTitle: {
    ...typography.caption,
    color: galaxyColors.textPrimary,
    textAlign: 'center',
    maxWidth: TRAIL_TITLE_MAX_WIDTH,
    marginTop: space.s0,
  },
  nodeTitleLargeText: { maxWidth: '100%' },
  // Sem `opacity`: ela apagaria o título junto, e o contrato de contraste não
  // a enxerga. O bloqueado fica no cinza secundário e continua legível.
  nodeTitleLocked: { color: galaxyColors.textSecondary },
  unit: { paddingVertical: space.s2, gap: space.s0 },
  unitTitle: { ...typography.label, color: galaxyColors.textPrimary },
  unitCaption: { ...typography.micro, color: galaxyColors.textSecondary },
});
