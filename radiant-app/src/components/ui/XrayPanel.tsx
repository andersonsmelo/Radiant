import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, {
  Defs,
  RadialGradient,
  LinearGradient,
  Stop,
  Ellipse,
  Rect,
  Path,
  Circle,
  G,
} from 'react-native-svg';

interface XrayPanelProps {
  height?: number;
  highlight?: { x: number; y: number; r: number };
}

export function XrayPanel({ height = 220, highlight }: XrayPanelProps) {
  return (
    <View style={[styles.container, { height }]}>
      <Svg
        viewBox="0 0 320 280"
        preserveAspectRatio="xMidYMid slice"
        style={StyleSheet.absoluteFill}
      >
        <Defs>
          <RadialGradient id="lung" cx="0.5" cy="0.5" r="0.5">
            <Stop offset="0%" stopColor="#3a4555" stopOpacity={0.9} />
            <Stop offset="100%" stopColor="#1a2230" stopOpacity={0.3} />
          </RadialGradient>
          <LinearGradient id="rib" x1="0" y1="0" x2="1" y2="0">
            <Stop offset="0%" stopColor="#dce6f5" stopOpacity={0.05} />
            <Stop offset="50%" stopColor="#dce6f5" stopOpacity={0.45} />
            <Stop offset="100%" stopColor="#dce6f5" stopOpacity={0.05} />
          </LinearGradient>
        </Defs>

        {/* Lung fields */}
        <Ellipse cx="100" cy="135" rx="60" ry="85" fill="url(#lung)" />
        <Ellipse cx="220" cy="135" rx="60" ry="85" fill="url(#lung)" />

        {/* Heart shadow */}
        <Ellipse cx="155" cy="160" rx="42" ry="55" fill="rgba(60,70,90,0.55)" />

        {/* Spine */}
        <Rect x="156" y="50" width="8" height="200" fill="rgba(220,230,245,0.55)" rx={3} />
        {([60, 82, 104, 126, 148, 170, 192, 214, 236] as number[]).map((y) => (
          <Rect key={y} x="152" y={y} width="16" height="3" fill="rgba(255,255,255,0.4)" rx={1} />
        ))}

        {/* Ribs left */}
        {([70, 95, 120, 145, 170, 195] as number[]).map((y) => (
          <Path
            key={`l${y}`}
            d={`M152 ${y} Q 90 ${y + 18}, 50 ${y + 5}`}
            stroke="rgba(220,230,245,0.4)"
            strokeWidth="2.2"
            fill="none"
          />
        ))}

        {/* Ribs right */}
        {([70, 95, 120, 145, 170, 195] as number[]).map((y) => (
          <Path
            key={`r${y}`}
            d={`M168 ${y} Q 230 ${y + 18}, 270 ${y + 5}`}
            stroke="rgba(220,230,245,0.4)"
            strokeWidth="2.2"
            fill="none"
          />
        ))}

        {/* Clavicles */}
        <Path d="M60 60 Q 100 50, 152 65" stroke="rgba(220,230,245,0.6)" strokeWidth="3" fill="none" />
        <Path d="M168 65 Q 220 50, 260 60" stroke="rgba(220,230,245,0.6)" strokeWidth="3" fill="none" />

        {/* Highlight finding */}
        {highlight != null && (
          <G>
            <Circle
              cx={highlight.x}
              cy={highlight.y}
              r={highlight.r}
              fill="none"
              stroke="#FFB84D"
              strokeWidth="2"
              strokeDasharray="4 4"
            />
            <Circle
              cx={highlight.x}
              cy={highlight.y}
              r={highlight.r + 8}
              fill="none"
              stroke="rgba(255,184,77,0.3)"
              strokeWidth="1"
            />
          </G>
        )}
      </Svg>

      {/* Corner brackets */}
      <View style={[styles.bracket, styles.tl]} />
      <View style={[styles.bracket, styles.tr]} />
      <View style={[styles.bracket, styles.bl]} />
      <View style={[styles.bracket, styles.br]} />
    </View>
  );
}

const B = 12;
const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: '#11161d',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    position: 'relative',
  },
  bracket: {
    position: 'absolute',
    width: B,
    height: B,
  },
  tl: { top: 4, left: 4, borderTopWidth: 1, borderLeftWidth: 1, borderColor: '#9FE5F5' },
  tr: { top: 4, right: 4, borderTopWidth: 1, borderRightWidth: 1, borderColor: '#9FE5F5' },
  bl: { bottom: 4, left: 4, borderBottomWidth: 1, borderLeftWidth: 1, borderColor: '#9FE5F5' },
  br: { bottom: 4, right: 4, borderBottomWidth: 1, borderRightWidth: 1, borderColor: '#9FE5F5' },
});
