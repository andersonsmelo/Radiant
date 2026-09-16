import React, { useEffect, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { G, Line, Path, Rect } from 'react-native-svg';
import { useSlideToPosition } from '../../../ui/motion';
import { semanticColors } from '../../../ui/semantic-colors';
import { radius, space, typography } from '../../../ui/styles';
import { galaxyColors } from '../../../ui/theme';
import type { L2AnswerOption, L2ModelLayerId, L2PlaneId } from './l2SlicingSpace.types';

type L2Region = 'thorax' | 'abdomen' | 'pelvis';
type L2Thickness = 'thin' | 'nominal' | 'thick';

type SlicingSpaceModelProps = Readonly<{
  plane: L2PlaneId;
  region: L2Region;
  thickness: L2Thickness;
  selectedLayer: L2ModelLayerId;
  scenarioId?: string;
  answerOptions?: readonly L2AnswerOption[];
  onCandidateSelect?: (answerId: string) => void;
  reduceMotion: boolean;
  onPlaneChange: (plane: L2PlaneId) => void;
  onRegionChange: (region: L2Region) => void;
  onThicknessChange: (thickness: L2Thickness) => void;
  onLayerSelect: (layer: L2ModelLayerId) => void;
}>;

const planeLabels: Record<L2PlaneId, string> = {
  coronal: 'coronal', sagittal: 'sagital', median: 'mediano', transverse: 'transversal', oblique: 'oblíquo',
};
const regionLabels: Record<L2Region, string> = { thorax: 'tórax', abdomen: 'abdome', pelvis: 'pelve' };
const thicknessLabels: Record<L2Thickness, string> = { thin: 'fina', nominal: 'nominal', thick: 'espessa' };
const planePaths: Record<L2PlaneId, string> = {
  coronal: 'M 42 156 L 198 156', sagittal: 'M 104 36 L 104 302', median: 'M 120 36 L 120 302', transverse: 'M 42 204 L 198 204', oblique: 'M 66 260 L 174 96',
};
const regionBounds: Record<L2Region, readonly [number, number]> = { thorax: [106, 166], abdomen: [166, 226], pelvis: [226, 282] };
const thicknessBandCount: Record<L2Thickness, number> = { thin: 1, nominal: 2, thick: 3 };
const candidatePaths: Record<string, string> = {
  median: 'M 116 44 L 124 44 L 124 294 L 116 294 Z',
  'sagittal-not-median': 'M 146 44 L 154 44 L 154 294 L 146 294 Z',
  coronal: 'M 54 118 L 186 118 L 172 282 L 68 282 Z',
  transverse: 'M 52 192 L 188 192 L 170 216 L 70 216 Z',
  oblique: 'M 66 250 L 78 258 L 178 104 L 166 96 Z',
  'reference-plane': 'M 52 144 L 188 144 L 176 156 L 64 156 Z',
  'region-with-nominal-thickness': 'M 72 178 L 168 178 L 178 194 L 82 194 Z M 72 212 L 168 212 L 178 228 L 82 228 Z',
  'resulting-image': 'M 178 178 L 216 178 L 216 216 L 178 216 Z',
};

const scenarioDetail = (scenarioId: string): Readonly<{ caption: string; markerY: number; markerLeft: number; markerRight: number; dashed: boolean }> => {
  if (scenarioId === 'thorax-midline') return { caption: 'Marcas de referência nos ombros.', markerY: 108, markerLeft: 82, markerRight: 146, dashed: false };
  if (scenarioId === 'pelvis-symmetry') return { caption: 'Dois marcadores pélvicos equidistantes da linha central permitem comparar simetria.', markerY: 252, markerLeft: 72, markerRight: 156, dashed: false };
  if (scenarioId.includes('oblique')) return { caption: 'Faixa diagonal de referência atravessa a região.', markerY: 178, markerLeft: 70, markerRight: 158, dashed: true };
  if (scenarioId.includes('section') || scenarioId.includes('region')) return { caption: 'Moldura de região e faixas de espessura estão destacadas.', markerY: 204, markerLeft: 82, markerRight: 146, dashed: true };
  return { caption: 'Marcas de referência distribuídas pelo modelo.', markerY: 150, markerLeft: 82, markerRight: 146, dashed: false };
};

function Control({ label, selected, onPress, children }: Readonly<{ label: string; selected: boolean; onPress: () => void; children: string }>) {
  return <Pressable accessibilityRole="button" accessibilityLabel={label} accessibilityHint="Altera o estado do modelo; a resposta do desafio é confirmada separadamente." accessibilityState={{ selected }} onPress={onPress} style={[styles.control, selected && styles.controlSelected]}><Text style={styles.controlText}>{children}</Text></Pressable>;
}

export function SlicingSpaceModel({ plane, region, thickness, selectedLayer, scenarioId = 'demonstration-default', answerOptions = [], onCandidateSelect, reduceMotion, onPlaneChange, onRegionChange, onThicknessChange, onLayerSelect }: SlicingSpaceModelProps) {
  const [showRegion, setShowRegion] = useState(reduceMotion);
  const { position: regionMotion, slideTo: slideRegion, settle: settleRegion } = useSlideToPosition(64, 320);
  const [regionTop, regionBottom] = regionBounds[region];
  const planePath = planePaths[plane];
  const bandCount = thicknessBandCount[thickness];
  const scenarioOffset = Array.from(scenarioId).reduce((total, character) => total + character.charCodeAt(0), 0) % 3 * 4;
  const scenario = scenarioDetail(scenarioId);
  const bodyPath = `M ${96 + scenarioOffset} 60 C ${104 + scenarioOffset} 42 ${136 + scenarioOffset} 42 ${144 + scenarioOffset} 60 L ${162 + scenarioOffset} 125 L ${150 + scenarioOffset} 274 L ${90 + scenarioOffset} 274 L ${78 + scenarioOffset} 125 Z`;

  useEffect(() => {
    if (reduceMotion) {
      settleRegion(regionTop);
      setShowRegion(true);
      return;
    }
    setShowRegion(false);
    return slideRegion(regionTop, (finished) => { if (finished) setShowRegion(true); });
  }, [plane, reduceMotion, region, regionTop, scenarioId, settleRegion, slideRegion, thickness]);

  return <View style={styles.root}>
    <Text style={styles.explainer}>Modelo 2.5D: uma placa situa a referência; o volume mostra a região e sua espessura.</Text>
    <Text testID="slicing-model-geometry" style={styles.visuallyHidden}>{`${scenarioId}-${plane}-${region}-${thickness}`}</Text>
    <Text testID="slicing-model-scenario" style={styles.visuallyHidden}>{scenarioId}</Text>
    <Text testID="slicing-plane" style={styles.visuallyHidden}>{planePath}</Text>
    <View accessible accessibilityLabel={`Modelo 2.5D, estado de exploração. ${scenario.caption} Plano: ${planeLabels[plane]}; região: ${regionLabels[region]}; espessura: ${thicknessLabels[thickness]}; camada: ${selectedLayer}. Use os controles nomeados para alterar esses dados.`} style={styles.frame}>
      <View testID="slicing-model-canvas" style={styles.canvas}>
        <Svg width="100%" height="100%" viewBox="0 0 240 320" accessibilityElementsHidden>
          <Rect x="8" y="8" width="224" height="304" rx="20" fill={galaxyColors.backgroundAlt} />
          <G>
            <G transform={`translate(${scenarioOffset} 0)`}>
            <Path d={bodyPath} fill={semanticColors.galaxy.surface} stroke={galaxyColors.textPrimary} strokeWidth="2" />
            <Path d="M94 82 L58 150 M146 82 L182 150 M104 272 L88 298 M136 272 L152 298" fill="none" stroke={galaxyColors.textPrimary} strokeWidth="14" strokeLinecap="round" />
            <Line x1="120" y1="34" x2="120" y2="302" stroke={semanticColors.galaxy.statusInformation} strokeWidth="2" strokeDasharray="6 6" />
            <Rect testID="sampled-region-volume" opacity={showRegion ? 1 : 0} x="68" y={regionTop} width="104" height={regionBottom - regionTop} fill="rgba(93,227,174,0.14)" stroke={selectedLayer === 'sampled-region' ? semanticColors.galaxy.statusSuccess : semanticColors.galaxy.border} strokeWidth={selectedLayer === 'sampled-region' ? 3 : 1} />
            <G testID="nominal-thickness-bands" opacity={showRegion ? 1 : 0}>
              {Array.from({ length: bandCount }, (_, index) => <Rect key={index} x={70 + index * 5} y={regionTop + 4} width="4" height={Math.max(regionBottom - regionTop - 8, 8)} fill={semanticColors.galaxy.statusWarning} opacity={selectedLayer === 'nominal-thickness' ? 0.9 : 0.5} />)}
            </G>
            <Path d={planePath} fill="none" stroke={selectedLayer === 'geometric-plane' ? semanticColors.galaxy.statusInformation : galaxyColors.textSecondary} strokeWidth={selectedLayer === 'geometric-plane' ? 5 : 3} strokeDasharray={plane === 'oblique' ? '0' : '8 5'} />
            {answerOptions.map((entry, index) => <G key={entry.id} testID={`slicing-candidate-${entry.id}`}>
              <Path d={candidatePaths[entry.id]} fill="rgba(84,180,255,0.16)" stroke={index === 0 ? semanticColors.galaxy.statusInformation : semanticColors.galaxy.statusWarning} strokeWidth="3" />
            </G>)}
            <G testID="slicing-model-scenario-markers">
              <Rect x={scenario.markerLeft} y={scenario.markerY} width="12" height="8" fill={semanticColors.galaxy.statusWarning} stroke={galaxyColors.textPrimary} strokeWidth="1" strokeDasharray={scenario.dashed ? '2 2' : '0'} />
              <Rect x={scenario.markerRight} y={scenario.markerY} width="12" height="8" fill={semanticColors.galaxy.statusWarning} stroke={galaxyColors.textPrimary} strokeWidth="1" strokeDasharray={scenario.dashed ? '2 2' : '0'} />
            </G>
            <Rect x="178" y={regionTop + 12} width="32" height="32" fill={selectedLayer === 'resulting-image' ? semanticColors.galaxy.statusSuccess : semanticColors.galaxy.surface} stroke={galaxyColors.textPrimary} strokeWidth="2" />
            </G>
          </G>
        </Svg>
        {!reduceMotion && !showRegion ? <Animated.View pointerEvents="none" style={[styles.movingRegion, { top: regionMotion }]}><Text style={styles.movingRegionText}>A região acompanha a referência</Text></Animated.View> : null}
      </View>
    </View>
    {answerOptions.length > 0 ? <View style={styles.candidates} accessibilityLabel="Candidatos visuais do desafio">
      <Text style={styles.candidateHeading}>Toque em um candidato no modelo ou use as alternativas abaixo</Text>
      <View style={styles.candidateRow}>{answerOptions.map((entry, index) => <Pressable key={entry.id} accessibilityRole="button" accessibilityLabel={`Selecionar opção ${index + 1} no modelo. ${entry.textDescription}`} accessibilityHint="Seleciona o candidato visual; confirme a decisão separadamente." onPress={() => onCandidateSelect?.(entry.id)} style={styles.candidateTarget}><Text style={styles.candidateNumber}>{index + 1}</Text><Text style={styles.candidateLabel}>Candidato {index + 1}</Text></Pressable>)}</View>
    </View> : null}
    <Text testID="slicing-model-state" style={styles.state}>{['Plano: ', planeLabels[plane], ' · Região: ', regionLabels[region], ' · Espessura: ', thicknessLabels[thickness], ' · Camada: ', selectedLayer]}</Text>
    <Text testID="slicing-model-scenario-caption" style={styles.scenarioCaption}>{scenario.caption}</Text>
    <Text testID="slicing-model-motion-state" style={styles.motionState}>{reduceMotion ? 'Movimento reduzido: geometria final exibida.' : showRegion ? 'Sequência instrutiva concluída: a faixa da região deslizou até a referência.' : 'Sequência instrutiva: a faixa da região desliza até a referência geométrica.'}</Text>
    <Text style={styles.legend}>Tracejado: linha mediana; placa contínua: plano; área contornada: região; faixas: espessura; quadro: imagem.</Text>
    <View style={styles.controls} accessibilityRole="toolbar" accessibilityLabel="Controles do modelo espacial">
      <Text style={styles.controlHeading}>Plano</Text><View style={styles.controlRow}>
        {(['coronal', 'sagittal', 'median', 'transverse', 'oblique'] as const).map((entry) => <Control key={entry} label={`Selecionar plano ${planeLabels[entry]}`} selected={plane === entry} onPress={() => onPlaneChange(entry)}>{planeLabels[entry]}</Control>)}
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

const styles = StyleSheet.create({
  root: { gap: space.s2 }, explainer: { ...typography.bodyStrong, color: galaxyColors.textPrimary }, visuallyHidden: { height: 0, width: 0, opacity: 0 }, frame: { borderRadius: radius.rLg, overflow: 'hidden', borderWidth: 1, borderColor: semanticColors.galaxy.border, backgroundColor: galaxyColors.backgroundAlt }, canvas: { width: '100%', height: 320, position: 'relative' }, movingRegion: { position: 'absolute', left: 10, right: 10, minHeight: 32, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: semanticColors.galaxy.statusSuccess, backgroundColor: 'rgba(93,227,174,0.18)' }, movingRegionText: { ...typography.caption, color: galaxyColors.textPrimary }, candidates: { gap: space.s1, padding: space.s2 }, candidateHeading: { ...typography.caption, color: galaxyColors.textSecondary }, candidateRow: { flexDirection: 'row', gap: space.s2 }, candidateTarget: { minHeight: 44, flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: space.s1, borderRadius: radius.rMd, borderWidth: 1, borderColor: semanticColors.galaxy.statusInformation }, candidateNumber: { ...typography.bodyStrong, color: semanticColors.galaxy.statusInformation }, candidateLabel: { ...typography.caption, color: galaxyColors.textPrimary }, state: { ...typography.bodyRegular, color: galaxyColors.textPrimary }, scenarioCaption: { ...typography.caption, color: semanticColors.galaxy.statusInformation }, motionState: { ...typography.caption, color: galaxyColors.textSecondary }, legend: { ...typography.caption, color: galaxyColors.textSecondary }, controls: { gap: space.s1, padding: space.s2, borderRadius: radius.rMd, backgroundColor: semanticColors.galaxy.surface }, controlHeading: { ...typography.caption, color: galaxyColors.textSecondary }, controlRow: { flexDirection: 'row', flexWrap: 'wrap', gap: space.s2 }, control: { minHeight: 44, paddingHorizontal: space.s3, borderRadius: radius.rMd, borderWidth: 1, borderColor: semanticColors.galaxy.border, justifyContent: 'center' }, controlSelected: { borderWidth: 2, borderColor: semanticColors.galaxy.statusSuccess, backgroundColor: 'rgba(93,227,174,0.14)' }, controlText: { ...typography.bodyRegular, color: galaxyColors.textPrimary },
});
