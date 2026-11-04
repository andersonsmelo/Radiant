import { depth, galaxyColors } from '../../../ui/theme';
import { JourneyUnitNavigation } from './JourneyUnitNavigation';
import { computeUnitPrimaryProgress } from '../services/JourneyUnitProgress';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FlatList, StyleSheet, Text, View, useWindowDimensions, type FlatListProps, type NativeScrollEvent, type NativeSyntheticEvent, type ViewToken, type LayoutChangeEvent } from 'react-native';

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
import { getRecommendationCopy, getScheduledReviewCopy, getStatusCopy } from './nodeCopy';
import { trailColumnText } from './trailTextPresentation';
import {
  TRAIL_CORNER,
  TRAIL_LEAD,
  TRAIL_MEDAL_TOP,
  TRAIL_PATH_STROKE,
  TRAIL_PIXEL_HEAD_WIDTH,
  TRAIL_PIXEL_HEAD_HEIGHT,
  TRAIL_SIDE_GAP,
  medalOffsetX,
  medalRadiusFor,
  trailTitleWidth,
  trailColumnClearance,
  trailColumnContentWidth,
  trailRowBottom,
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
  /** Rola depois de todos os nós, mantendo a mesma instância ao atualizar a lista. */
  footer?: React.ReactElement;
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

type CellProps = React.ComponentProps<NonNullable<FlatListProps<TrailItem>['CellRendererComponent']>>;

/** A célula pode seguir visível só pelo título; quem anima é o corpo da medalha. */
function useVisibleMedals(items: TrailItem[], recommendedNodeId?: string) {
  const nodesRef = useRef(items);
  const recommendedRef = useRef(recommendedNodeId);
  nodesRef.current = items;
  recommendedRef.current = recommendedNodeId;
  const framesRef = useRef(new Map<string, { y: number; height: number }>());
  const viewportRef = useRef({ top: 0, height: 0 });
  const candidatesRef = useRef(new Set<string>());
  const [visibleNodeIds, setVisibleNodeIds] = useState<ReadonlySet<string>>(() => new Set());
  const update = useCallback(() => {
    const { top, height } = viewportRef.current;
    const ids = new Set<string>();
    if (height > 0) for (const item of nodesRef.current) {
      if (item.kind !== 'node' || !candidatesRef.current.has(item.key)) continue;
      const frame = framesRef.current.get(item.key);
      if (!frame) continue;
      const medalTop = frame.y + TRAIL_MEDAL_TOP;
      const medalBottom = medalTop + medalRadiusFor(item.node.type, item.node.id === recommendedRef.current) * 2 + depth.medalLip;
      if (medalBottom > top && medalTop < top + height) ids.add(item.node.id);
    }
    setVisibleNodeIds(previous => previous.size === ids.size && [...ids].every(id => previous.has(id)) ? previous : ids);
  }, []);
  const onCellLayout = useCallback((key: string, layout: { y: number; height: number }) => {
    framesRef.current.set(key, layout);
    update();
  }, [update]);
  // Identidade estável: rolar não remonta nenhuma célula nem reinicia o Lottie.
  const CellRenderer = useMemo(() => function TrailCell({ item, children, style, onLayout, onFocusCapture }: CellProps) {
    // A lista fornece este evento interno, ausente do ViewProps público.
    return <View style={style} {...{ onFocusCapture }} testID={`journey-trail-cell-${item.key}`}
      onLayout={event => {
        onLayout?.(event);
        onCellLayout(item.key, event.nativeEvent.layout);
      }}>{children}</View>;
  }, [onCellLayout]);
  const onViewableItemsChanged = useCallback(({ viewableItems }: { viewableItems: ViewToken<TrailItem>[] }) => {
    candidatesRef.current = new Set(viewableItems.filter(token => token.isViewable).map(token => token.item.key));
    update();
  }, [update]);
  const onScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    viewportRef.current = { top: event.nativeEvent.contentOffset.y, height: event.nativeEvent.layoutMeasurement.height };
    update();
  }, [update]);
  const onLayout = useCallback((height: number) => {
    viewportRef.current.height = height;
    update();
  }, [update]);
  useEffect(update, [items, recommendedNodeId, update]);
  return { visibleNodeIds, CellRenderer, onViewableItemsChanged, onScroll, onLayout };
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
  /** Linhas contínuas da concluída até a recomendada, com medidas atuais. */
  rows?: { offset: number; radius: number; rowHeight: number }[];
  /** Corredor da coluna, fora do conteúdo e dentro da janela. */
  columnLane: number;
  column: boolean;
};

/**
 * O caminho do Pixel no momento, nas coordenadas da linha recomendada (x a
 * partir do centro da trilha, y a partir do topo da linha), convertido em
 * deslocamentos a partir do lugar onde ele descansa, no encaixe.
 *
 * A partir da medalha concluída, segue os conectores medidos do pontilhado
 * (`outgoingPath` e `incomingPath`): sai da lateral dela, corre na horizontal,
 * faz a curva, desce a vertical da recomendada até perto do topo dela e, por
 * fim, salta para o lado de fora da medalha. Nós intermediários são contornados
 * por corredores livres de texto/corpo; as bandas/cabeçalhos interrompem a
 * conexão e permitem aparecer no trecho de chegada.
 */
function momentRoute({ toOffset, toRadius, slot, rows, column, columnLane }: MomentRouteInput): TrailMomentRoute {
  const side = toOffset > 0 ? 1 : -1;
  const rest: Point = {
    x: toOffset + side * (toRadius + space.s1 + slot.width / 2),
    y: TRAIL_MEDAL_TOP + (2 * toRadius + depth.medalLip) / 2,
  };
  const lift = slot.height / 2 - MOMENT_RIDE_OVERLAP;
  const points: Point[] = [];

  if (rows && rows.length > 1) {
    let top = -rows.slice(0, -1).reduce((height, row) => height + row.rowHeight, 0);
    for (let index = 0; index < rows.length - 1; index += 1) {
      const row = rows[index];
      const next = rows[index + 1];
      const nextTop = top + row.rowHeight;
      if (index === 0) {
        const direction = Math.sign(next.offset - row.offset);
        const lineY = column ? nextTop - TRAIL_COLUMN_TAIL + TRAIL_PATH_STROKE / 2
          : top + TRAIL_MEDAL_TOP + row.radius;
        const startX = row.offset + direction * (row.radius + TRAIL_SIDE_GAP + slot.width / 2);
        const corner = Math.max(0, Math.min(TRAIL_CORNER, Math.abs(next.offset - startX)));
        const turn = { x: next.offset - direction * corner, y: lineY };
        points.push({ x: startX, y: lineY }, turn);
        points.push(...quadraticPoints(turn, { x: next.offset, y: lineY }, { x: next.offset, y: lineY + corner }, 8));
      } else if (column) {
        // Contorna todo o bloco intermediário por uma faixa permanente. A
        // travessia abaixo do texto reencontra o primeiro M real da cauda.
        const tailY = nextTop - TRAIL_COLUMN_TAIL + TRAIL_PATH_STROKE / 2;
        points.push({ x: columnLane, y: top + TRAIL_LEAD },
          { x: columnLane, y: tailY }, { x: row.offset, y: tailY });
      } else {
        // Acima do corpo, troca para o lado interno. Esta vertical reencontra
        // o outgoing real depois da curva, sem tocar título, data ou medalha.
        points.push({ x: next.offset, y: top + TRAIL_LEAD });
      }
      points.push({ x: next.offset, y: nextTop + TRAIL_LEAD });
      top = nextTop;
    }
  } else {
    // Uma banda/cabeçalho interrompe a conexão desenhada; aparece no trecho novo.
    points.push({ x: toOffset, y: 0 }, { x: toOffset, y: TRAIL_LEAD });
  }

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
    fadeIn: !rows || rows.length < 2,
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
  footer,
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
  const { width: windowWidth, fontScale } = useWindowDimensions();
  const [measuredWidth, setMeasuredWidth] = useState<number | undefined>(undefined);
  const halfWidth = (measuredWidth ?? windowWidth) / 2;

  const items = useMemo(
    () => flattenTrail(segments, recommendedNodeId),
    [segments, recommendedNodeId],
  );
  const recommendedIndex = useMemo(
    () => items.findIndex(item => item.kind === 'node' && item.node.id === recommendedNodeId),
    [items, recommendedNodeId],
  );

  const visibility = useVisibleMedals(items, recommendedNodeId);
  const onViewportLayout = visibility.onLayout;
  const handleLayout = useCallback((event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setMeasuredWidth(previous => (previous === width ? previous : width));
    onViewportLayout(height);
  }, [onViewportLayout]);

  // O momento acompanha o intervalo contínuo de nós da concluída até a
  // recomendada, inclusive revisões futuras intermediárias. Cada linha deve
  // ter medida atual antes de congelar a rota: concluir muda raio, ação e
  // estrelas. Só bandas/cabeçalhos interrompem a conexão entre os percursos.
  const playing = moment !== undefined && moment.toNodeId === recommendedNodeId && recommendedIndex >= 0;
  const momentFromId = playing ? moment.fromNodeId : undefined;
  const [slotSize, setSlotSize] = useState<{ nodeId: string; width: number; height: number } | undefined>(undefined);
  const handleSlotLayout = useCallback((nodeId: string, width: number, height: number) => {
    setSlotSize(previous => (previous?.nodeId === nodeId && previous.width === width && previous.height === height
      ? previous
      : { nodeId, width, height }));
  }, []);
  // Reservas permanentes: iniciar/terminar o momento não muda o texto nem
  // desloca o percurso. Medidas maiores que sm também ganham espaço real.
  const headWidth = Math.max(TRAIL_PIXEL_HEAD_WIDTH, slotSize?.width ?? 0);
  const headHeight = Math.max(TRAIL_PIXEL_HEAD_HEIGHT, slotSize?.height ?? 0);
  const columnClearance = largeText ? trailColumnClearance(headHeight) : 0;
  const columnContentWidth = trailColumnContentWidth(halfWidth, headWidth, space.s1);
  const rowBottom = trailRowBottom(headHeight);
  const rowSignature = useCallback((item: TrailNodeItem) => JSON.stringify([
    item.node.id, item.node.type, item.node.title, item.node.status, item.node.reviewAvailableAtMs,
    item.node.id === recommendedNodeId, Boolean(item.node.id === recommendedNodeId && recommendedAction),
    item.node.lessonId ? starsByLessonId[item.node.lessonId] : undefined,
    halfWidth, fontScale, largeText, columnClearance, columnContentWidth, rowBottom,
  ]), [recommendedNodeId, recommendedAction, starsByLessonId, halfWidth, fontScale, largeText,
    columnClearance, columnContentWidth, rowBottom]);
  const validSignaturesRef = useRef(new Set<string>());
  validSignaturesRef.current = new Set(items.flatMap(item => item.kind === 'node' ? [rowSignature(item)] : []));
  const [rowMeasures, setRowMeasures] = useState<ReadonlyMap<string, number>>(() => new Map());
  const handleRowHeight = useCallback((_nodeId: string, signature: string, height: number) => {
    if (!validSignaturesRef.current.has(signature) || !Number.isFinite(height) || height <= 0) return;
    setRowMeasures(previous => {
      if (previous.get(signature) === height) return previous;
      const current = new Map([...previous].filter(([key]) => validSignaturesRef.current.has(key)));
      current.set(signature, height);
      return current;
    });
  }, []);
  const toItem = playing ? items[recommendedIndex] : undefined;
  const fromIndex = playing ? items.findIndex(item => item.kind === 'node' && item.node.id === momentFromId) : -1;
  const routeNodes = useMemo(() => {
    if (fromIndex < 0 || fromIndex >= recommendedIndex) return [];
    const interval = items.slice(fromIndex, recommendedIndex + 1);
    return interval.every((item): item is TrailNodeItem => item.kind === 'node') ? interval : [];
  }, [items, fromIndex, recommendedIndex]);
  const measuredRoute = routeNodes.length > 1 && routeNodes.every(item => rowMeasures.has(rowSignature(item)));
  const routeIds = new Set(routeNodes.map(item => item.node.id));
  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 1 }).current;
  const route = useMemo(() => {
    if (toItem?.kind !== 'node') return undefined;
    const slot = slotSize?.nodeId === toItem.node.id ? slotSize : { width: 0, height: 0 };
    return momentRoute({
      toOffset: medalOffsetX(toItem.nodeIndex, halfWidth, largeText),
      toRadius: medalRadiusFor(toItem.node.type, true),
      slot,
      column: largeText,
      columnLane: -(halfWidth - headWidth / 2 - space.s1),
      rows: measuredRoute ? routeNodes.map(item => ({
        offset: medalOffsetX(item.nodeIndex, halfWidth, largeText),
        radius: medalRadiusFor(item.node.type, item.node.id === recommendedNodeId),
        rowHeight: rowMeasures.get(rowSignature(item))!,
      })) : undefined,
    });
  }, [toItem, slotSize, halfWidth, largeText, headWidth, measuredRoute, routeNodes, recommendedNodeId, rowMeasures, rowSignature]);
  const momentStyles = useTrailMomentStyles(playing, {
    route,
    onFinished: moment?.onDone,
    momentKey: playing ? `${moment.fromNodeId}>${moment.toNodeId}` : undefined,
    ready: measuredWidth !== undefined && slotSize !== undefined && slotSize.nodeId === recommendedNodeId
      && slotSize.width > 0 && slotSize.height > 0 && (routeNodes.length < 2 || measuredRoute),
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
      extraData={visibility.visibleNodeIds}
      onViewableItemsChanged={visibility.onViewableItemsChanged}
      CellRendererComponent={visibility.CellRenderer}
      onScroll={visibility.onScroll}
      scrollEventThrottle={16}
      viewabilityConfig={viewabilityConfig}
      keyExtractor={item => item.key}
      initialNumToRender={12}
      windowSize={7}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.trail}
      ListFooterComponent={footer}
      ListFooterComponentStyle={styles.spacedFooter}
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
            key={rowSignature(item)}
            layoutSignature={rowSignature(item)}
            visible={visibility.visibleNodeIds.has(item.node.id)}
            columnClearance={columnClearance}
            columnContentWidth={columnContentWidth}
            rowBottom={rowBottom}
            item={item}
            isRecommended={isRecommended}
            action={isRecommended ? recommendedAction : undefined}
            momentStyles={isRecommended ? momentStyles : undefined}
            litIn={playing && (isRecommended || (routeIds.has(item.node.id) && item.node.id !== momentFromId))}
            litOut={playing && measuredRoute && routeIds.has(item.node.id) && !isRecommended}
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
  layoutSignature: string;
  visible: boolean;
  columnClearance: number;
  columnContentWidth: number;
  rowBottom: number;
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
  onHeight: (nodeId: string, signature: string, height: number) => void;
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
  layoutSignature,
  visible,
  columnClearance,
  columnContentWidth,
  rowBottom,
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
  const scheduledReview = getScheduledReviewCopy(node);
  const [rowHeight, setRowHeight] = useState<number | undefined>(undefined);
  const handleLayout = useCallback((event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout;
    setRowHeight(previous => (previous === height ? previous : height));
    onHeight(node.id, layoutSignature, height);
  }, [node.id, layoutSignature, onHeight]);
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
      style={[styles.row, column && item.hasNext ? null : { paddingBottom: rowBottom }]}
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
        style={[styles.column, column && [styles.columnLargeText, { width: columnContentWidth }], { transform: [{ translateX: offset }] }]}
      >
        <View style={[styles.medalBox, { width: radius * 2 }]}>
          <MotionView testID={`journey-medal-${node.id}`} style={momentStyles?.medal}>
            <JourneyMedal
              node={node}
              theme={resolveNodeTheme(node, item.unit)}
              state={medalStateFor(node, isRecommended)}
              pulsing={isRecommended}
              visible={visible}
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
              style={[styles.slot, { height: radius * 2 + depth.medalLip },
                offset > 0 ? { left: radius * 2 + space.s1 } : { right: radius * 2 + space.s1 },
                momentStyles && holding && styles.held]}
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
          {column ? trailColumnText(node.title) : node.title}
        </Text>
        {scheduledReview ? (
          <Text {...hiddenFromReader} style={[styles.scheduledReview,
            column ? styles.nodeTitleLargeText : { maxWidth: trailTitleWidth(halfWidth) },
          ]}>{column ? trailColumnText(scheduledReview) : scheduledReview}</Text>
        ) : null}
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
        <View style={{ paddingTop: columnClearance }}>
          <View>
          <JourneyPathSegment part="out" fromX={0} toX={0} height={TRAIL_COLUMN_TAIL} traveled={item.nextTraveled && !litOut} />
          {litOut ? (
            <View pointerEvents="none" style={[styles.inPiece, holding && styles.held]}>
              <MotionView testID="journey-moment-segment-out" style={segmentStyle.outgoing}>
                <JourneyPathSegment part="out" fromX={0} toX={0} height={TRAIL_COLUMN_TAIL} traveled />
              </MotionView>
            </View>
          ) : null}
          </View>
        </View>
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
  spacedFooter: { marginTop: TRAIL_GAP },
  spaced: { marginVertical: TRAIL_GAP / 2 },
  row: { alignItems: 'center' },
  // Sem `overflow: 'hidden'` em lugar nenhum da linha: o anel da próxima sai
  // da caixa da medalha, e a folga de cima é o que o mantém inteiro.
  outPiece: { position: 'absolute', left: 0, right: 0, bottom: 0 },
  inPiece: { position: 'absolute', left: 0, right: 0, top: 0 },
  column: { alignItems: 'center', paddingTop: TRAIL_MEDAL_TOP },
  columnLargeText: { alignSelf: 'center' },
  medalBox: { position: 'relative', alignItems: 'center' },
  slot: { position: 'absolute', top: 0, justifyContent: 'center' },
  nodeTitle: {
    ...typography.caption,
    color: galaxyColors.textPrimary,
    textAlign: 'center',
    marginTop: space.s0,
  },
  scheduledReview: { ...typography.caption, color: galaxyColors.textSecondary, textAlign: 'center', marginTop: space.s0 },
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
