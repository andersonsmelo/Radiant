import { depth, galaxyColors } from '../../../ui/theme';
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
import { MotionView, useTrailMomentStyles, type TrailMomentRoute } from '../../../ui/motion';
import { JourneyLevelBand } from './JourneyLevelBand';
import { JourneyMedal, medalStateFor } from './JourneyMedal';
import { JourneyPathSegment } from './JourneyPathSegment';
import { getRecommendationCopy, getStatusCopy } from './nodeCopy';
import {
  TRAIL_CORNER,
  TRAIL_LEAD,
  TRAIL_MEDAL_TOP,
  TRAIL_PATH_STROKE,
  TRAIL_ROW_BOTTOM,
  TRAIL_SIDE_GAP,
  medalOffsetX,
  medalRadiusFor,
  trailTitleWidth,
} from './trailLayout';

const TRAIL_GAP = space.s3;
/** Em coluna (texto grande), a descida abaixo do título até a linha de baixo. */
const TRAIL_COLUMN_TAIL = 24;
/** O nó PRÓXIMO fica no meio da tela, com o que veio antes e o que vem depois. */
const ANCHOR_VIEW_POSITION = 0.5;
/** Fora da janela virtualizada, cada tentativa aproxima pela altura média. */
const ANCHOR_MAX_RETRIES = 3;
const ANCHOR_RETRY_DELAY_MS = 50;
/** O Pixel anda montado no pontilhado: a base da cabeça desce isto abaixo da linha. */
const MOMENT_RIDE_OVERLAP = 4;
/** No salto final para o lado da medalha, o Pixel sobe isto acima do ponto mais alto. */
const MOMENT_HOP_RISE = 26;

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
  /**
   * O que fica sob a medalha recomendada: o botão que abre o mesmo nó. Fica
   * fora do bloco escondido do leitor de tela, ao contrário do encaixe.
   */
  recommendedAction?: React.ReactNode;
  /**
   * O momento do Pixel, enquanto ele toca: o trecho do nó concluído até o
   * recomendado acende, o Pixel do encaixe percorre o caminho, a medalha cresce
   * e a ação entra. `onDone` avisa o fim.
   */
  moment?: { fromNodeId: string; toNodeId: string; onDone: () => void };
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
  /** Há um nó depois deste no percurso: a linha desenha o trecho que sai. */
  hasNext: boolean;
  /** O trecho que sai deste nó já foi andado. */
  nextTraveled: boolean;
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
          hasNext: nodeIndex < flatNodes.length - 1,
          nextTraveled: nodeIndex + 1 <= reachedIndex,
        });
        nodeIndex += 1;
      });
    });
  });

  return items;
}

type Point = { x: number; y: number };

function quadraticPoints(from: Point, control: Point, to: Point, steps: number): Point[] {
  const points: Point[] = [];
  for (let i = 1; i <= steps; i += 1) {
    const t = i / steps;
    const u = 1 - t;
    points.push({
      x: u * u * from.x + 2 * u * t * control.x + t * t * to.x,
      y: u * u * from.y + 2 * u * t * control.y + t * t * to.y,
    });
  }
  return points;
}

type MomentRouteInput = {
  /** Deslocamento e raio da medalha recomendada. */
  toOffset: number;
  toRadius: number;
  /** O que o encaixe mediu: o tamanho do Pixel. */
  slot: { width: number; height: number };
  /** A medalha concluída logo acima, quando o caminho vem dela. */
  from?: { offset: number; radius: number; rowHeight: number };
};

/**
 * O caminho do Pixel no momento, nas coordenadas da linha recomendada (x a
 * partir do centro da trilha, y a partir do topo da linha), convertido em
 * deslocamentos a partir do lugar onde ele descansa, no encaixe.
 *
 * Com a medalha concluída logo acima, é o mesmo caminho do pontilhado
 * (`outgoingPath` e `incomingPath`): sai da lateral dela, corre na horizontal,
 * faz a curva, desce a vertical da recomendada até perto do topo dela e, por
 * fim, salta para o lado de fora da medalha. O Pixel vai montado na linha.
 * Sem ela (há uma unidade no meio, a trilha está em coluna ou a linha de cima
 * ainda não foi medida), ele aparece no topo da linha e desce só o trecho que
 * chega.
 */
function momentRoute({ toOffset, toRadius, slot, from }: MomentRouteInput): TrailMomentRoute {
  const side = toOffset > 0 ? 1 : -1;
  const rest: Point = {
    x: toOffset + side * (toRadius + space.s1 + slot.width / 2),
    y: TRAIL_MEDAL_TOP + (2 * toRadius + depth.medalLip) / 2,
  };
  const lift = slot.height / 2 - MOMENT_RIDE_OVERLAP;
  const points: Point[] = [];

  if (from) {
    const direction = Math.sign(toOffset - from.offset);
    const lineY = -from.rowHeight + TRAIL_MEDAL_TOP + from.radius;
    // Meio Pixel além do começo do pontilhado, para ele não cobrir a medalha.
    const startX = from.offset + direction * (from.radius + TRAIL_SIDE_GAP + slot.width / 2);
    const corner = Math.max(0, Math.min(TRAIL_CORNER, Math.abs(toOffset - startX)));
    const turn: Point = { x: toOffset - direction * corner, y: lineY };
    points.push({ x: startX, y: lineY }, turn);
    points.push(...quadraticPoints(turn, { x: toOffset, y: lineY }, { x: toOffset, y: lineY + corner }, 8));
  } else {
    points.push({ x: toOffset, y: 0 });
  }
  points.push({ x: toOffset, y: TRAIL_LEAD });

  const riding = points.map(point => ({ x: point.x, y: point.y - lift }));
  const landing = riding[riding.length - 1];
  riding.push(...quadraticPoints(
    landing,
    { x: (landing.x + rest.x) / 2, y: Math.min(landing.y, rest.y) - MOMENT_HOP_RISE },
    rest,
    10,
  ));

  // As amostras vão pelo comprimento do caminho, para a velocidade não mudar
  // de um trecho para o outro.
  const samples: Point[] = [riding[0]];
  for (const point of riding.slice(1)) {
    const last = samples[samples.length - 1];
    if (Math.hypot(point.x - last.x, point.y - last.y) > 0.01) samples.push(point);
  }
  const lengths = [0];
  for (let i = 1; i < samples.length; i += 1) {
    lengths.push(lengths[i - 1] + Math.hypot(samples[i].x - samples[i - 1].x, samples[i].y - samples[i - 1].y));
  }
  const total = lengths[lengths.length - 1];
  if (total <= 0) return { progress: [0, 1], x: [0, 0], y: [0, 0] };

  return {
    progress: lengths.map(length => length / total),
    x: samples.map(point => point.x - rest.x),
    y: samples.map(point => point.y - rest.y),
    fadeIn: from === undefined,
  };
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
  recommendedAction,
  moment,
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

  // O momento do Pixel. Ele só anda pelo pontilhado quando o nó concluído é a
  // linha logo acima da recomendada: é ela que desenha a parte do trecho que
  // sai. A altura dela vem da medida da própria linha, guardada aqui; quando
  // ela muda no meio do momento (a concluída ganhou estrelas), o caminho segue.
  const playing = moment !== undefined && moment.toNodeId === recommendedNodeId && recommendedIndex >= 0;
  const momentFromId = playing ? moment.fromNodeId : undefined;
  const rowHeightsRef = useRef(new Map<string, number>());
  const momentFromRef = useRef<string | undefined>(undefined);
  momentFromRef.current = momentFromId;
  const [fromRowHeight, setFromRowHeight] = useState<{ nodeId: string; height: number } | undefined>(undefined);
  const handleRowHeight = useCallback((nodeId: string, height: number) => {
    rowHeightsRef.current.set(nodeId, height);
    if (nodeId !== momentFromRef.current) return;
    setFromRowHeight(previous => (previous?.nodeId === nodeId && previous.height === height ? previous : { nodeId, height }));
  }, []);
  const [slotSize, setSlotSize] = useState<{ nodeId: string; width: number; height: number } | undefined>(undefined);
  const handleSlotLayout = useCallback((nodeId: string, width: number, height: number) => {
    setSlotSize(previous => (previous?.nodeId === nodeId && previous.width === width && previous.height === height
      ? previous
      : { nodeId, width, height }));
  }, []);

  const toItem = playing ? items[recommendedIndex] : undefined;
  const aboveItem = playing ? items[recommendedIndex - 1] : undefined;
  const fromItem = aboveItem?.kind === 'node' && aboveItem.node.id === momentFromId ? aboveItem : undefined;
  const measuredFromHeight = fromItem
    ? (fromRowHeight?.nodeId === fromItem.node.id ? fromRowHeight.height : rowHeightsRef.current.get(fromItem.node.id))
    : undefined;
  const travelsFromAbove = fromItem !== undefined && measuredFromHeight !== undefined && !largeText;
  const route = useMemo(() => {
    if (toItem?.kind !== 'node') return undefined;
    const slot = slotSize?.nodeId === toItem.node.id ? slotSize : { width: 0, height: 0 };
    return momentRoute({
      toOffset: medalOffsetX(toItem.nodeIndex, halfWidth, largeText),
      toRadius: medalRadiusFor(toItem.node.type, true),
      slot,
      from: travelsFromAbove && fromItem && measuredFromHeight !== undefined ? {
        offset: medalOffsetX(fromItem.nodeIndex, halfWidth, largeText),
        radius: medalRadiusFor(fromItem.node.type, false),
        rowHeight: measuredFromHeight,
      } : undefined,
    });
  }, [toItem, fromItem, travelsFromAbove, measuredFromHeight, slotSize, halfWidth, largeText]);
  const momentStyles = useTrailMomentStyles(playing, {
    route,
    onFinished: moment?.onDone,
    momentKey: playing ? `${moment.fromNodeId}>${moment.toNodeId}` : undefined,
  });

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
      ListHeaderComponentStyle={styles.spacedHeader}
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
            <View style={styles.spaced}>
              <JourneyLevelBand
                trackId={item.segment.trackId}
                trackTitle={item.segment.trackTitle}
                unlocked={item.segment.unlocked}
                previousTrackTitle={item.previousTrackTitle}
              />
            </View>
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

        const isRecommended = item.node.id === recommendedNodeId;
        return (
          <TrailNodeRow
            item={item}
            isRecommended={isRecommended}
            action={isRecommended ? recommendedAction : undefined}
            momentStyles={isRecommended ? momentStyles : undefined}
            litIn={playing && isRecommended}
            litOut={playing && travelsFromAbove && item.node.id === momentFromId}
            segmentStyle={momentStyles.segment}
            holding={momentStyles.holding}
            onHeight={handleRowHeight}
            onSlotLayout={isRecommended ? handleSlotLayout : undefined}
            status={getRecommendationCopy(isRecommended, recommendationReason, dueReviewCount) ?? getStatusCopy(item.node)}
            halfWidth={halfWidth}
            column={largeText}
            stars={item.node.type === 'lesson' && item.node.status === 'completed' && item.node.lessonId
              ? starsByLessonId[item.node.lessonId]
              : undefined}
            slot={pixelSlot?.(item.node.id)}
            disabled={isNodeDisabled(item.node)}
            onPress={onNodePress}
          />
        );
      }}
    />
  );
}

type TrailNodeRowProps = {
  item: TrailNodeItem;
  isRecommended: boolean;
  /** A palavra de estado do rótulo: a da recomendação ou a do nó. */
  status: string;
  halfWidth: number;
  /** Texto grande: coluna centrada, sem zigue-zague. */
  column: boolean;
  stars?: LessonStars;
  slot: React.ReactNode;
  disabled: boolean;
  onPress: (node: JourneyNode) => void;
  /** A ação sob a medalha (só a recomendada tem). */
  action?: React.ReactNode;
  /** O Pixel, a medalha e a ação no momento (só a recomendada). */
  momentStyles?: ReturnType<typeof useTrailMomentStyles>;
  /** O momento acende o trecho que chega a este nó. */
  litIn: boolean;
  /** O momento acende o trecho que sai deste nó. */
  litOut: boolean;
  segmentStyle: ReturnType<typeof useTrailMomentStyles>['segment'];
  /** O momento vai começar: as camadas dele esperam escondidas (ver `useTrailMomentStyles`). */
  holding: boolean;
  onHeight: (nodeId: string, height: number) => void;
  onSlotLayout?: (nodeId: string, width: number, height: number) => void;
};

/**
 * Uma linha da trilha: o fim da descida que chega ao nó, a medalha deslocada
 * com o título embaixo e o começo do trecho que sai dela. O trecho entre dois
 * nós é desenhado em duas partes, uma em cada linha, que se encontram na mesma
 * vertical na borda entre as linhas. A parte que sai precisa da altura da
 * linha (o título tem uma ou duas linhas), por isso só aparece depois da
 * primeira medida.
 */
function TrailNodeRow({
  item,
  isRecommended,
  status,
  halfWidth,
  column,
  stars,
  slot,
  disabled,
  onPress,
  action,
  momentStyles,
  litIn,
  litOut,
  segmentStyle,
  holding,
  onHeight,
  onSlotLayout,
}: TrailNodeRowProps) {
  const { node } = item;
  const [rowHeight, setRowHeight] = useState<number | undefined>(undefined);
  const handleLayout = useCallback((event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout;
    setRowHeight(previous => (previous === height ? previous : height));
    onHeight(node.id, height);
  }, [node.id, onHeight]);
  const handleSlotLayout = useCallback((event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    onSlotLayout?.(node.id, width, height);
  }, [node.id, onSlotLayout]);
  const offset = medalOffsetX(item.nodeIndex, halfWidth, column);
  const nextOffset = medalOffsetX(item.nodeIndex + 1, halfWidth, column);
  const radius = medalRadiusFor(node.type, isRecommended);
  // O trecho que sai nasce meio traço acima do centro da medalha, para a
  // ponta redonda do primeiro ponto caber.
  const outTop = TRAIL_MEDAL_TOP + radius - TRAIL_PATH_STROKE / 2;
  const showSlot = slot !== undefined && slot !== null && slot !== false;

  return (
    <View
      testID={`journey-trail-row-${node.id}`}
      onLayout={handleLayout}
      style={[styles.row, column && item.hasNext ? null : styles.rowBottom]}
    >
      {item.hasNext && !column && rowHeight !== undefined && rowHeight > outTop ? (
        <>
          {/* No momento, o trecho fica apagado embaixo e a camada acesa entra por cima. */}
          <View pointerEvents="none" style={[styles.outPiece, { top: outTop }]}>
            <JourneyPathSegment
              part="out"
              fromX={offset}
              toX={nextOffset}
              fromRadius={radius}
              height={rowHeight - outTop}
              traveled={item.nextTraveled && !litOut}
            />
          </View>
          {litOut ? (
            <View pointerEvents="none" style={[styles.outPiece, { top: outTop }, holding && styles.held]}>
              <MotionView testID="journey-moment-segment-out" style={segmentStyle.outgoing}>
                <JourneyPathSegment
                  part="out"
                  fromX={offset}
                  toX={nextOffset}
                  fromRadius={radius}
                  height={rowHeight - outTop}
                  traveled
                />
              </MotionView>
            </View>
          ) : null}
        </>
      ) : null}
      {item.nodeIndex > 0 ? (
        <>
          <View pointerEvents="none" style={styles.inPiece}>
            <JourneyPathSegment part="in" fromX={offset} toX={offset} height={TRAIL_LEAD} traveled={item.traveled && !litIn} />
          </View>
          {litIn ? (
            <View pointerEvents="none" style={[styles.inPiece, holding && styles.held]}>
              <MotionView testID="journey-moment-segment-in" style={segmentStyle.incoming}>
                <JourneyPathSegment part="in" fromX={offset} toX={offset} height={TRAIL_LEAD} traveled />
              </MotionView>
            </View>
          ) : null}
        </>
      ) : null}
      <View
        testID={`journey-anchor-${node.id}`}
        style={[styles.column, column && styles.columnLargeText, { transform: [{ translateX: offset }] }]}
      >
        <View style={styles.medalBox}>
          <MotionView testID={`journey-medal-${node.id}`} style={momentStyles?.medal}>
            <JourneyMedal
              node={node}
              theme={resolveNodeTheme(node, item.unit)}
              state={medalStateFor(node, isRecommended)}
              pulsing={isRecommended}
              stars={stars}
              size={isRecommended ? radius : undefined}
              unitNumber={node.type === 'checkpoint' ? item.unitNumber : undefined}
              onPress={() => onPress(node)}
              disabled={disabled}
              accessibilityLabel={`${node.title}. ${status}.`}
            />
          </MotionView>
          {showSlot ? (
            // Do lado de fora da trilha: do lado de dentro corre o pontilhado.
            // No momento, o Pixel sai daqui e volta pelo caminho (`momentRoute`).
            <View
              pointerEvents="box-none"
              {...hiddenFromReader}
              style={[styles.slot, offset > 0 ? styles.slotRight : styles.slotLeft, momentStyles && holding && styles.held]}
            >
              <MotionView
                testID={`journey-pixel-slot-${node.id}`}
                pointerEvents="box-none"
                onLayout={onSlotLayout ? handleSlotLayout : undefined}
                style={momentStyles?.pixel}
              >
                {slot}
              </MotionView>
            </View>
          ) : null}
        </View>
        {/* O título já está no rótulo da medalha; aqui é só para ver. */}
        <Text
          {...hiddenFromReader}
          numberOfLines={column ? undefined : 2}
          style={[
            styles.nodeTitle,
            column ? styles.nodeTitleLargeText : { maxWidth: trailTitleWidth(halfWidth) },
            node.status === 'locked' && styles.nodeTitleLocked,
          ]}
        >
          {node.title}
        </Text>
        {action ? (
          // Fora do bloco escondido: é um botão, e o leitor de tela o alcança.
          <View style={[styles.action, momentStyles && holding && styles.held]}>
            <MotionView testID={`journey-action-${node.id}`} style={momentStyles?.cta}>
              {action}
            </MotionView>
          </View>
        ) : null}
      </View>
      {item.hasNext && column ? (
        <JourneyPathSegment part="out" fromX={0} toX={0} height={TRAIL_COLUMN_TAIL} traveled={item.nextTraveled} />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  // Sem `gap` entre as linhas: o pontilhado passa de uma linha para a outra
  // na borda entre elas, e uma folga ali o cortaria. Faixas e unidades trazem
  // a própria margem.
  trail: {
    position: 'relative',
    paddingBottom: space.s3,
  },
  spacedHeader: { marginBottom: TRAIL_GAP },
  spaced: { marginVertical: TRAIL_GAP / 2 },
  row: { alignItems: 'center' },
  rowBottom: { paddingBottom: TRAIL_ROW_BOTTOM },
  // Sem `overflow: 'hidden'` em lugar nenhum da linha: o anel da próxima sai
  // da caixa da medalha, e a folga de cima é o que o mantém inteiro.
  outPiece: { position: 'absolute', left: 0, right: 0, bottom: 0 },
  inPiece: { position: 'absolute', left: 0, right: 0, top: 0 },
  column: { alignItems: 'center', paddingTop: TRAIL_MEDAL_TOP },
  columnLargeText: { alignSelf: 'stretch' },
  medalBox: { alignItems: 'center' },
  slot: { position: 'absolute', top: 0, bottom: 0, justifyContent: 'center' },
  slotLeft: { right: '100%', marginRight: space.s1 },
  slotRight: { left: '100%', marginLeft: space.s1 },
  nodeTitle: {
    ...typography.caption,
    color: galaxyColors.textPrimary,
    textAlign: 'center',
    marginTop: space.s0,
  },
  nodeTitleLargeText: { maxWidth: '100%' },
  action: { marginTop: space.s1 },
  held: { opacity: 0 },
  // Sem `opacity`: ela apagaria o título junto, e o contrato de contraste não
  // a enxerga. O bloqueado fica no cinza secundário e continua legível.
  nodeTitleLocked: { color: galaxyColors.textSecondary },
  unit: { paddingVertical: space.s2, marginVertical: TRAIL_GAP / 2, gap: space.s0 },
  unitTitle: { ...typography.label, color: galaxyColors.textPrimary },
  unitCaption: { ...typography.micro, color: galaxyColors.textSecondary },
});
