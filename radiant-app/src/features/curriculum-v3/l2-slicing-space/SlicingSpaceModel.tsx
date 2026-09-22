import React, { useEffect, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { G, Line, Path, Rect } from 'react-native-svg';
import { useSlideToPosition } from '../../../ui/motion';
import { semanticColors } from '../../../ui/semantic-colors';
import { radius, space, typography } from '../../../ui/styles';
import { galaxyColors } from '../../../ui/theme';
import {
  LIMBS_PATH,
  MIDLINE_X,
  OBLIQUE_ROTATION_DEGREES,
  PARAMEDIAN_OFFSET,
  bodyPathFor,
  candidatePaths,
  candidateTransformFor,
  orientationPaths,
  regionBounds,
  scenarioDetail,
  scenarioOffsetFor,
  shouldRevealImmediately,
  thicknessBandCount,
  type L2Inclination,
  type L2MedianRelation,
  type L2ReferenceOrientation,
  type L2Region,
  type L2Thickness,
} from './l2SlicingGeometry';
import type { L2AnswerOption, L2ModelLayerId } from './l2SlicingSpace.types';

type SlicingSpaceModelProps = Readonly<{
  orientation: L2ReferenceOrientation;
  medianRelation: L2MedianRelation;
  inclination: L2Inclination;
  region: L2Region;
  thickness: L2Thickness;
  selectedLayer: L2ModelLayerId;
  scenarioId?: string;
  answerOptions?: readonly L2AnswerOption[];
  onCandidateSelect?: (answerId: string) => void;
  reduceMotion: boolean;
  motionResolved: boolean;
  onOrientationChange: (orientation: L2ReferenceOrientation) => void;
  onMedianRelationChange: (relation: L2MedianRelation) => void;
  onInclinationChange: (inclination: L2Inclination) => void;
  onRegionChange: (region: L2Region) => void;
  onThicknessChange: (thickness: L2Thickness) => void;
  onLayerSelect: (layer: L2ModelLayerId) => void;
}>;

const orientationLabels: Record<L2ReferenceOrientation, string> = {
  coronal: 'coronal', sagittal: 'sagital', transverse: 'transversal',
};
const medianRelationLabels: Record<L2MedianRelation, string> = {
  median: 'sobre o eixo', offset: 'paralela, fora do eixo',
};
const inclinationLabels: Record<L2Inclination, string> = {
  aligned: 'alinhada', oblique: 'inclinada',
};
const regionLabels: Record<L2Region, string> = { thorax: 'tórax', abdomen: 'abdome', pelvis: 'pelve' };
const thicknessLabels: Record<L2Thickness, string> = { thin: 'fina', nominal: 'nominal', thick: 'espessa' };

/**
 * A placa é UMA geometria com três atributos independentes.
 *
 * Orientação de referência, relação com o eixo mediano e inclinação são eixos
 * separados porque é isso que a lição ensina: o mediano é um caso de sagital,
 * não um irmão dele, e a obliquidade é uma relação com as referências, não uma
 * quarta orientação.
 */
const planeTransform = (
  orientation: L2ReferenceOrientation,
  medianRelation: L2MedianRelation,
  inclination: L2Inclination
): string => {
  const parts: string[] = [];
  if (orientation === 'sagittal' && medianRelation === 'offset') parts.push(`translate(${PARAMEDIAN_OFFSET} 0)`);
  if (inclination === 'oblique') parts.push(`rotate(${OBLIQUE_ROTATION_DEGREES} ${MIDLINE_X} 170)`);
  return parts.join(' ');
};

function Control({ label, selected, onPress, children }: Readonly<{ label: string; selected: boolean; onPress: () => void; children: string }>) {
  return <Pressable accessibilityRole="button" accessibilityLabel={label} accessibilityHint="Altera o estado do modelo; a resposta do desafio é confirmada separadamente." accessibilityState={{ selected }} onPress={onPress} style={[styles.control, selected && styles.controlSelected]}><Text style={styles.controlText}>{children}</Text></Pressable>;
}

export function SlicingSpaceModel({
  orientation, medianRelation, inclination, region, thickness, selectedLayer,
  scenarioId = 'demonstration-default', answerOptions = [], onCandidateSelect,
  reduceMotion, motionResolved,
  onOrientationChange, onMedianRelationChange, onInclinationChange,
  onRegionChange, onThicknessChange, onLayerSelect,
}: SlicingSpaceModelProps) {
  const revealImmediately = shouldRevealImmediately({ reduceMotion, motionResolved });
  const [showRegion, setShowRegion] = useState(revealImmediately);
  const { position: regionMotion, slideTo: slideRegion, settle: settleRegion } = useSlideToPosition(64, 320);
  const [regionTop, regionBottom] = regionBounds[region];
  const bandCount = thicknessBandCount[thickness];
  const scenarioOffset = scenarioOffsetFor(scenarioId);
  const scenario = scenarioDetail(scenarioId);
  const isSagittal = orientation === 'sagittal';

  useEffect(() => {
    if (revealImmediately) {
      settleRegion(regionTop);
      setShowRegion(true);
      return;
    }
    setShowRegion(false);
    return slideRegion(regionTop, (finished) => { if (finished) setShowRegion(true); });
  }, [inclination, medianRelation, orientation, region, regionTop, revealImmediately, scenarioId, settleRegion, slideRegion, thickness]);

  const accessibleState = `Modelo 2.5D, estado de exploração. ${scenario.caption} Orientação: ${orientationLabels[orientation]}; ${isSagittal ? `relação com o eixo mediano: ${medianRelationLabels[medianRelation]}; ` : ''}inclinação: ${inclinationLabels[inclination]}; região: ${regionLabels[region]}; espessura: ${thicknessLabels[thickness]}; camada destacada: ${layerLabels[selectedLayer]}. Use os controles nomeados para alterar esses dados.`;

  const motionState = !motionResolved
    ? 'Preferência de movimento ainda desconhecida: geometria final exibida sem animar.'
    : reduceMotion
      ? 'Movimento reduzido: geometria final exibida.'
      : showRegion
        ? 'Sequência instrutiva concluída: a faixa da região deslizou até a referência.'
        : 'Sequência instrutiva: a faixa da região desliza até a referência geométrica.';

  return <View style={styles.root}>
    <Text style={styles.explainer}>Modelo 2.5D: uma placa situa a referência; o volume mostra a região e sua espessura.</Text>
    <View accessible accessibilityLabel={accessibleState} style={styles.frame}>
      <View testID="slicing-model-canvas" style={styles.canvas}>
        <Svg width="100%" height="100%" viewBox="0 0 240 320" accessibilityElementsHidden>
          <Rect x="8" y="8" width="224" height="304" rx="20" fill={galaxyColors.backgroundAlt} />
          <G transform={`translate(${scenarioOffset} 0)`}>
            <Path testID="slicing-body" d={bodyPathFor(scenarioId)} fill={semanticColors.galaxy.surface} stroke={galaxyColors.textPrimary} strokeWidth="2" />
            <Path d={LIMBS_PATH} fill="none" stroke={galaxyColors.textPrimary} strokeWidth="14" strokeLinecap="round" />
            <Line x1={MIDLINE_X} y1="34" x2={MIDLINE_X} y2="302" stroke={semanticColors.galaxy.statusInformation} strokeWidth="2" strokeDasharray="6 6" />
            <Rect testID="sampled-region-volume" opacity={showRegion ? 1 : 0} x="68" y={regionTop} width="104" height={regionBottom - regionTop} fill="rgba(93,227,174,0.14)" stroke={selectedLayer === 'sampled-region' ? semanticColors.galaxy.statusSuccess : semanticColors.galaxy.border} strokeWidth={selectedLayer === 'sampled-region' ? 3 : 1} />
            <G testID="nominal-thickness-bands" opacity={showRegion ? 1 : 0}>
              {Array.from({ length: bandCount }, (_, index) => <Rect key={index} x={70 + index * 5} y={regionTop + 4} width="4" height={Math.max(regionBottom - regionTop - 8, 8)} fill={semanticColors.galaxy.statusWarning} opacity={selectedLayer === 'nominal-thickness' ? 0.9 : 0.5} />)}
            </G>
            <Path
              testID="slicing-reference-plane"
              d={orientationPaths[orientation]}
              transform={planeTransform(orientation, medianRelation, inclination)}
              fill={orientation === 'sagittal' ? 'none' : 'rgba(84,180,255,0.10)'}
              stroke={selectedLayer === 'geometric-plane' ? semanticColors.galaxy.statusInformation : galaxyColors.textSecondary}
              strokeWidth={selectedLayer === 'geometric-plane' ? 5 : 3}
              strokeDasharray={inclination === 'oblique' ? '0' : '8 5'}
            />
            {answerOptions.map((entry, index) => <G key={entry.id} testID={`slicing-candidate-${entry.id}`} transform={candidateTransformFor(scenarioId)}>
              <Path d={candidatePaths[entry.id]} fill="rgba(84,180,255,0.16)" stroke={index === 0 ? semanticColors.galaxy.statusInformation : semanticColors.galaxy.statusWarning} strokeWidth="3" strokeDasharray={index === 0 ? '0' : '7 4'} />
            </G>)}
            <G testID="slicing-model-scenario-markers">
              <Rect x={scenario.markerLeft} y={scenario.markerY} width="12" height="8" fill={semanticColors.galaxy.statusWarning} stroke={galaxyColors.textPrimary} strokeWidth="1" strokeDasharray={scenario.dashed ? '2 2' : '0'} />
              <Rect x={scenario.markerRight} y={scenario.markerY} width="12" height="8" fill={semanticColors.galaxy.statusWarning} stroke={galaxyColors.textPrimary} strokeWidth="1" strokeDasharray={scenario.dashed ? '2 2' : '0'} />
            </G>
            <Rect x="178" y={regionTop + 12} width="32" height="32" fill={selectedLayer === 'resulting-image' ? semanticColors.galaxy.statusSuccess : semanticColors.galaxy.surface} stroke={galaxyColors.textPrimary} strokeWidth="2" />
          </G>
        </Svg>
        {!revealImmediately && !showRegion ? <Animated.View pointerEvents="none" style={[styles.movingRegion, { top: regionMotion }]}><Text style={styles.movingRegionText}>A região acompanha a referência</Text></Animated.View> : null}
      </View>
    </View>
    {answerOptions.length > 0 ? <View style={styles.candidates} accessibilityLabel="Candidatos visuais do desafio">
      <Text style={styles.candidateHeading}>Cada candidato aparece desenhado no modelo; use os alvos abaixo ou as alternativas textuais</Text>
      <View style={styles.candidateRow}>{answerOptions.map((entry, index) => <Pressable key={entry.id} accessibilityRole="button" accessibilityLabel={`Selecionar opção ${index + 1} no modelo. ${entry.textDescription}`} accessibilityHint="Seleciona o candidato visual; confirme a decisão separadamente." onPress={() => onCandidateSelect?.(entry.id)} style={styles.candidateTarget}><Text style={styles.candidateNumber}>{index + 1}</Text><Text style={styles.candidateLabel}>{index === 0 ? 'Contorno contínuo' : 'Contorno tracejado'}</Text></Pressable>)}</View>
    </View> : null}
    <Text testID="slicing-model-state" style={styles.state}>{['Orientação: ', orientationLabels[orientation], isSagittal ? ` · Eixo mediano: ${medianRelationLabels[medianRelation]}` : '', ' · Inclinação: ', inclinationLabels[inclination], ' · Região: ', regionLabels[region], ' · Espessura: ', thicknessLabels[thickness], ' · Camada: ', layerLabels[selectedLayer]]}</Text>
    <Text testID="slicing-model-scenario-caption" style={styles.scenarioCaption}>{scenario.caption}</Text>
    <Text testID="slicing-model-motion-state" style={styles.motionState}>{motionState}</Text>
    <Text style={styles.legend}>Tracejado curto no eixo: linha mediana; placa tracejada: alinhada às referências; placa contínua: inclinada; área contornada: região; faixas: espessura; quadro: imagem.</Text>
    <View style={styles.controls} accessibilityRole="toolbar" accessibilityLabel="Controles do modelo espacial">
      <Text style={styles.controlHeading}>Orientação de referência</Text><View style={styles.controlRow}>
        {(['coronal', 'sagittal', 'transverse'] as const).map((entry) => <Control key={entry} label={`Selecionar orientação de referência ${orientationLabels[entry]}`} selected={orientation === entry} onPress={() => onOrientationChange(entry)}>{orientationLabels[entry]}</Control>)}
      </View>
      {isSagittal ? <>
        <Text style={styles.controlHeading}>Dentro de sagital · relação com o eixo mediano</Text><View style={styles.controlRow}>
          <Control label="Usar plano mediano, sobre o eixo" selected={medianRelation === 'median'} onPress={() => onMedianRelationChange('median')}>mediano</Control>
          <Control label="Usar plano paramediano, paralelo e fora do eixo" selected={medianRelation === 'offset'} onPress={() => onMedianRelationChange('offset')}>paramediano</Control>
        </View>
      </> : null}
      <Text style={styles.controlHeading}>Inclinação em relação às referências</Text><View style={styles.controlRow}>
        <Control label="Alinhar a placa às referências" selected={inclination === 'aligned'} onPress={() => onInclinationChange('aligned')}>alinhada</Control>
        <Control label="Inclinar a placa em relação às referências" selected={inclination === 'oblique'} onPress={() => onInclinationChange('oblique')}>oblíqua</Control>
      </View>
      <Text style={styles.controlHeading}>Região</Text><View style={styles.controlRow}>
        {(['thorax', 'abdomen', 'pelvis'] as const).map((entry) => <Control key={entry} label={`Mover região para ${regionLabels[entry]}`} selected={region === entry} onPress={() => onRegionChange(entry)}>{regionLabels[entry]}</Control>)}
      </View>
      <Text style={styles.controlHeading}>Espessura</Text><View style={styles.controlRow}>
        {(['thin', 'nominal', 'thick'] as const).map((entry) => <Control key={entry} label={`Usar espessura ${thicknessLabels[entry]}`} selected={thickness === entry} onPress={() => onThicknessChange(entry)}>{thicknessLabels[entry]}</Control>)}
      </View>
      <Text style={styles.controlHeading}>Camada destacada</Text><View style={styles.controlRow}>
        <Control label="Destacar plano geométrico" selected={selectedLayer === 'geometric-plane'} onPress={() => onLayerSelect('geometric-plane')}>Plano</Control>
        <Control label="Destacar região espacial" selected={selectedLayer === 'sampled-region'} onPress={() => onLayerSelect('sampled-region')}>Região</Control>
        <Control label="Destacar espessura nominal" selected={selectedLayer === 'nominal-thickness'} onPress={() => onLayerSelect('nominal-thickness')}>Espessura</Control>
        <Control label="Destacar imagem resultante" selected={selectedLayer === 'resulting-image'} onPress={() => onLayerSelect('resulting-image')}>Imagem</Control>
      </View>
    </View>
  </View>;
}

const layerLabels: Record<L2ModelLayerId, string> = {
  'geometric-plane': 'plano geométrico',
  'sampled-region': 'região amostrada',
  'nominal-thickness': 'espessura nominal',
  'resulting-image': 'imagem resultante',
};

const styles = StyleSheet.create({
  root: { gap: space.s2 }, explainer: { ...typography.bodyStrong, color: galaxyColors.textPrimary }, frame: { borderRadius: radius.rLg, overflow: 'hidden', borderWidth: 1, borderColor: semanticColors.galaxy.border, backgroundColor: galaxyColors.backgroundAlt }, canvas: { width: '100%', height: 320, position: 'relative' }, movingRegion: { position: 'absolute', left: 10, right: 10, minHeight: 32, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: semanticColors.galaxy.statusSuccess, backgroundColor: 'rgba(93,227,174,0.18)' }, movingRegionText: { ...typography.caption, color: galaxyColors.textPrimary }, candidates: { gap: space.s1, padding: space.s2 }, candidateHeading: { ...typography.caption, color: galaxyColors.textSecondary }, candidateRow: { flexDirection: 'row', gap: space.s2 }, candidateTarget: { minHeight: 44, flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: space.s1, borderRadius: radius.rMd, borderWidth: 1, borderColor: semanticColors.galaxy.statusInformation }, candidateNumber: { ...typography.bodyStrong, color: semanticColors.galaxy.statusInformation }, candidateLabel: { ...typography.caption, color: galaxyColors.textPrimary }, state: { ...typography.bodyRegular, color: galaxyColors.textPrimary }, scenarioCaption: { ...typography.caption, color: semanticColors.galaxy.statusInformation }, motionState: { ...typography.caption, color: galaxyColors.textSecondary }, legend: { ...typography.caption, color: galaxyColors.textSecondary }, controls: { gap: space.s1, padding: space.s2, borderRadius: radius.rMd, backgroundColor: semanticColors.galaxy.surface }, controlHeading: { ...typography.caption, color: galaxyColors.textSecondary }, controlRow: { flexDirection: 'row', flexWrap: 'wrap', gap: space.s2 }, control: { minHeight: 44, paddingHorizontal: space.s3, borderRadius: radius.rMd, borderWidth: 1, borderColor: semanticColors.galaxy.border, justifyContent: 'center' }, controlSelected: { borderWidth: 2, borderColor: semanticColors.galaxy.statusSuccess, backgroundColor: 'rgba(93,227,174,0.14)' }, controlText: { ...typography.bodyRegular, color: galaxyColors.textPrimary },
});
