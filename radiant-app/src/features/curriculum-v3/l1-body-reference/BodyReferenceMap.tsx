import React, { useEffect, useMemo } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, G, Line, Path, Rect } from 'react-native-svg';
import { semanticColors } from '../../../ui/semantic-colors';
import { galaxyColors } from '../../../ui/theme';
import { radius, space, typography } from '../../../ui/styles';
import { useScalePop } from '../../../ui/motion';
import type { L1AnswerOption } from './l1BodyReference.types';
import { CANVAS, FALLBACK_POSITION, LANDMARK_POSITIONS, MARKER_SIZE, canvasRotation, geometryId, labelCounterTransform, type BodyPerspective, type BodyPosture } from './bodyMapGeometry';

export type { BodyPerspective, BodyPosture } from './bodyMapGeometry';

type BodyReferenceMapProps = Readonly<{
  posture: BodyPosture;
  perspective: BodyPerspective;
  selectedRelation: string;
  reduceMotion: boolean;
  landmarks?: readonly L1AnswerOption[];
  showControls?: boolean;
  emphasizeMidline?: boolean;
  landmarksInteractive?: boolean;
  /** Esconde os textos técnicos do mapa (modelo, estado, movimento, legenda). */
  compact?: boolean;
  onPostureChange: (posture: BodyPosture) => void;
  onPerspectiveChange: (perspective: BodyPerspective) => void;
  onRegionSelect: (regionId: string) => void;
}>;

const fallbackLandmarks: readonly L1AnswerOption[] = [
  { id: 'patient-left', label: 'Mão 1', landmarkId: 'patient-left-hand', textDescription: 'Mão à direita da vista frontal.' },
  { id: 'patient-right', label: 'Mão 2', landmarkId: 'patient-right-hand', textDescription: 'Mão à esquerda da vista frontal.' },
];

const relationLabels: Record<string, string> = {
  'superior-inferior': 'cabeça e pés', 'anterior-posterior': 'frente e costas', 'medial-lateral': 'linha mediana e lados', 'proximal-distal': 'ligação do membro e extremidade', 'superficial-deep': 'camadas locais',
};

function postureLabel(posture: BodyPosture): string {
  return posture === 'supine' ? 'decúbito dorsal' : posture === 'prone' ? 'decúbito ventral' : 'posição anatômica';
}

function Control({ label, selected, onPress, children }: Readonly<{ label: string; selected: boolean; onPress: () => void; children: string }>) {
  return <Pressable accessibilityRole="button" accessibilityLabel={label} accessibilityState={{ selected }} onPress={onPress} style={[styles.control, selected && styles.controlSelected]}><Text style={styles.controlText}>{children}</Text></Pressable>;
}

function Controls({ posture, perspective, onPostureChange, onPerspectiveChange }: Pick<BodyReferenceMapProps, 'posture' | 'perspective' | 'onPostureChange' | 'onPerspectiveChange'>) {
  return <View style={styles.controls} accessibilityRole="toolbar" accessibilityLabel="Controles do modelo corporal">
    <Text style={styles.controlHeading}>Vista</Text><View style={styles.controlRow}>
      <Control label="Ver corpo pela frente" selected={perspective === 'front'} onPress={() => onPerspectiveChange('front')}>Frente</Control>
      <Control label="Ver corpo por trás" selected={perspective === 'back'} onPress={() => onPerspectiveChange('back')}>Costas</Control>
    </View><Text style={styles.controlHeading}>Postura</Text><View style={styles.controlRow}>
      <Control label="Apresentar pessoa na posição anatômica" selected={posture === 'anatomical'} onPress={() => onPostureChange('anatomical')}>Referência</Control>
      <Control label="Apresentar pessoa em decúbito dorsal" selected={posture === 'supine'} onPress={() => onPostureChange('supine')}>Dorsal</Control>
      <Control label="Apresentar pessoa em decúbito ventral" selected={posture === 'prone'} onPress={() => onPostureChange('prone')}>Ventral</Control>
    </View>
  </View>;
}

export function BodyReferenceMap({ posture, perspective, selectedRelation, reduceMotion, landmarks = fallbackLandmarks, showControls = true, emphasizeMidline = false, landmarksInteractive = true, compact = false, onPostureChange, onPerspectiveChange, onRegionSelect }: BodyReferenceMapProps) {
  const { scale, style: scaleStyle, animateIn } = useScalePop();
  const rotation = canvasRotation(posture);
  const labelTransform = labelCounterTransform(posture, perspective);
  const layout = geometryId(posture, perspective);
  const displayedLandmarks = useMemo(() => landmarks.map((entry, index) => ({ ...entry, number: index + 1, position: LANDMARK_POSITIONS[entry.landmarkId] ?? FALLBACK_POSITION })), [landmarks]);

  useEffect(() => {
    if (reduceMotion) {
      scale.setValue(1);
      return;
    }
    animateIn();
  }, [animateIn, perspective, posture, reduceMotion, scale]);

  return <View style={styles.root}>
    {compact ? null : <Text style={styles.explainer}>Modelo 2.5D: {relationLabels[selectedRelation] ?? 'relações anatômicas'}.</Text>}
    <Text testID="body-geometry" style={styles.visuallyHidden}>{layout}</Text>
    <View accessible accessibilityLabel={`Modelo corporal interativo. Vista ${perspective === 'front' ? 'frontal' : 'posterior'}, ${postureLabel(posture)}.`} style={styles.frame}>
      <Animated.View testID="body-map-canvas" style={[styles.canvas, { transform: [...scaleStyle.transform, { scaleX: perspective === 'front' ? 1 : -1 }, { rotate: rotation }] }]}>
        <Svg width="100%" height="100%" viewBox="0 0 240 330" accessibilityElementsHidden>
          <Rect x="8" y="8" width="224" height="314" rx="22" fill={galaxyColors.backgroundAlt} />
          <G>
            <Circle cx="120" cy="52" r="25" fill={semanticColors.galaxy.surface} stroke={galaxyColors.textPrimary} strokeWidth="2" />
            <Path d={perspective === 'front' ? 'M92 87 C101 74 139 74 148 87 L166 165 L151 224 L89 224 L74 165 Z' : 'M90 90 C102 79 138 79 150 90 L160 164 L147 224 L93 224 L80 164 Z'} fill={semanticColors.galaxy.surface} stroke={galaxyColors.textPrimary} strokeWidth="2" />
            <Path d="M92 102 L56 174 L68 182 L105 126 M148 102 L184 174 L172 182 L135 126 M100 218 L82 300 M140 218 L158 300" fill="none" stroke={galaxyColors.textPrimary} strokeWidth="16" strokeLinecap="round" />
            <Line testID="body-map-midline" x1="120" x2="120" y1="30" y2="298" stroke={semanticColors.galaxy.statusInformation} strokeWidth={emphasizeMidline ? '5' : '2'} strokeDasharray="6 6" />
            <Path d={perspective === 'front' ? 'M90 126 C106 109 134 109 150 126 L150 156 C134 166 106 166 90 156 Z' : 'M94 126 C108 115 132 115 146 126 L146 156 C132 168 108 168 94 156 Z'} fill="rgba(93,227,174,0.18)" stroke={semanticColors.galaxy.statusSuccess} strokeWidth="2" />
            <Path d="M100 138 C112 128 128 128 140 138" fill="none" stroke={semanticColors.galaxy.statusWarning} strokeWidth="3" strokeDasharray="4 4" />
          </G>
        </Svg>
        {displayedLandmarks.map(({ id, landmarkId, number, position, textDescription }) => {
          // Centrado no ponto, em coordenadas do canvas (= viewBox).
          const placement = [styles.landmark, { left: position[0] - MARKER_SIZE / 2, top: position[1] - MARKER_SIZE / 2 }];
          return landmarksInteractive
            ? <Pressable key={id} testID={`landmark-${landmarkId}`} accessibilityRole="button" accessibilityLabel={`Selecionar opção ${number} no mapa. ${textDescription}`} accessibilityHint="Seleciona esta opção para responder." onPress={() => onRegionSelect(id)} style={placement}><Text style={[styles.landmarkNumber, { transform: labelTransform }]}>{number}</Text></Pressable>
            : <View key={id} testID={`landmark-${landmarkId}`} accessible accessibilityLabel={`Opção ${number} no mapa. ${textDescription}`} style={placement}><Text style={[styles.landmarkNumber, { transform: labelTransform }]}>{number}</Text></View>;
        })}
      </Animated.View>
    </View>
    <Text testID="body-map-state" style={compact ? styles.visuallyHidden : styles.state}>{['Perspectiva: ', perspective === 'front' ? 'frente' : 'costas', ' · Postura: ', postureLabel(posture)]}</Text>
    <Text testID="body-map-motion-state" style={compact ? styles.visuallyHidden : styles.motionState}>{reduceMotion ? 'Movimento reduzido: estado final exibido.' : 'Transição curta mostra a mesma geometria final.'}</Text>
    {compact ? null : <Text style={styles.legend}>Linha tracejada: referência mediana. Contorno contínuo e traço pontilhado: superfícies ou camadas distintas.</Text>}
    {showControls ? <Controls {...{ posture, perspective, onPostureChange, onPerspectiveChange }} /> : null}
  </View>;
}

const styles = StyleSheet.create({
  root: { gap: space.s2 }, explainer: { ...typography.bodyStrong, color: galaxyColors.textPrimary }, visuallyHidden: { height: 0, width: 0, opacity: 0 }, frame: { height: 330, borderRadius: radius.rLg, overflow: 'hidden', borderWidth: 1, borderColor: semanticColors.galaxy.border, backgroundColor: galaxyColors.backgroundAlt, alignItems: 'center', justifyContent: 'center' }, canvas: { width: CANVAS.width, height: CANVAS.height, position: 'relative' }, landmark: { position: 'absolute', width: MARKER_SIZE, height: MARKER_SIZE, minWidth: MARKER_SIZE, minHeight: MARKER_SIZE, borderRadius: MARKER_SIZE / 2, borderWidth: 2, borderColor: semanticColors.galaxy.statusSuccess, backgroundColor: 'rgba(3,3,13,0.82)', alignItems: 'center', justifyContent: 'center' }, landmarkNumber: { ...typography.bodyStrong, color: galaxyColors.textPrimary }, state: { ...typography.bodyRegular, color: galaxyColors.textPrimary }, motionState: { ...typography.caption, color: galaxyColors.textSecondary }, legend: { ...typography.caption, color: galaxyColors.textSecondary }, controls: { gap: space.s1, padding: space.s2, borderRadius: radius.rMd, backgroundColor: semanticColors.galaxy.surface }, controlHeading: { ...typography.caption, color: galaxyColors.textSecondary }, controlRow: { flexDirection: 'row', flexWrap: 'wrap', gap: space.s2 }, control: { minHeight: 44, paddingHorizontal: space.s3, borderRadius: radius.rMd, borderWidth: 1, borderColor: semanticColors.galaxy.border, justifyContent: 'center' }, controlSelected: { borderWidth: 2, borderColor: semanticColors.galaxy.statusSuccess, backgroundColor: 'rgba(93,227,174,0.14)' }, controlText: { ...typography.bodyRegular, color: galaxyColors.textPrimary },
});
