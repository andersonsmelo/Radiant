/**
 * GalaxyInteriorScreen — Nível 2
 * Interior de uma galáxia: exibe os planetas e estrelas do subtema.
 * Navega para PlanetInteriorScreen ao tocar em um corpo celeste.
 */

import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Line, Svg } from 'react-native-svg';

import { getGalaxyById } from '@/src/data/galaxy-catalog';
import { GamificationService } from '@/src/features/gamification/services/GamificationService';
import type { CelestialBody } from '@/src/types/galaxy';
import type { GamificationSnapshot } from '@/src/types/gamification';
import { useReducedMotionPreference } from '@/src/ui/accessibility/useReducedMotionPreference';
import { HUD } from '@/src/ui/components/HUD';
import { StarfieldBackground } from '@/src/ui/components/StarfieldBackground';
import { typography } from '@/src/ui/styles';
import { PlanetBody } from '../components/PlanetBody';


const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

const PLANET_SIZE: Record<CelestialBody['size'], number> = {
  sm: 52,
  md: 72,
  lg: 96,
};

// ── Sub-componente: card de corpo celeste ───────────────────────

function BodyCard({
  body,
  onPress,
  index,
}: {
  body: CelestialBody;
  onPress: () => void;
  index: number;
}) {
  const scale = useSharedValue(0.5);
  const opacity = useSharedValue(0);
  const pressScale = useSharedValue(1);
  const isLocked = body.status === 'locked';
  const reducedMotion = useReducedMotionPreference();

  useEffect(() => {
    if (reducedMotion) {
      // Sem a cascata de `index * 80`: os corpos já nascem no lugar.
      scale.value = 1;
      opacity.value = 1;
      return;
    }

    const delay = index * 80;
    setTimeout(() => {
      scale.value = withSpring(1, { damping: 14, stiffness: 100 });
      opacity.value = withTiming(1, { duration: 300 });
    }, delay);
  }, [reducedMotion]);

  const entryStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value * pressScale.value }],
    opacity: opacity.value,
  }));

  const handlePressIn = () => {
    if (!isLocked && !reducedMotion) pressScale.value = withSpring(0.92, { damping: 12 });
  };
  const handlePressOut = () => {
    pressScale.value = withSpring(1, { damping: 12 });
  };

  const planetPx = PLANET_SIZE[body.size];
  const hitArea = planetPx + 32;

  // Posição absoluta no mapa
  const left = body.mapPosition.x * SCREEN_W - hitArea / 2;
  const top = body.mapPosition.y * (SCREEN_H * 0.72) - hitArea / 2;

  return (
    <Animated.View
      style={[
        styles.bodyWrapper,
        { width: hitArea, height: hitArea, left, top },
        entryStyle,
      ]}
    >
      <TouchableOpacity
        onPress={isLocked ? undefined : onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={isLocked ? 1 : 0.8}
        style={styles.bodyTouchable}
      >
        <PlanetBody body={body} sizeOverride={planetPx} />
        <Text
          style={[
            styles.bodyLabel,
            isLocked && styles.bodyLabelLocked,
            body.status === 'active' && styles.bodyLabelActive,
          ]}
          numberOfLines={2}
        >
          {isLocked ? '🔒' : body.bodyType === 'star' ? '✦ ' : ''}{body.title}
        </Text>
        {body.nodes.length > 0 && !isLocked && (
          <View style={styles.nodeBadge}>
            <Text style={styles.nodeBadgeText}>{body.nodes.length} lições</Text>
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}

// ── SVG connector lines ─────────────────────────────────────────

function BodyConnectors({ bodies }: { bodies: CelestialBody[] }) {
  const mapW = SCREEN_W;
  const mapH = SCREEN_H * 0.72;

  const available = bodies.filter((b) => b.status !== 'locked');
  if (available.length < 2) return null;

  return (
    <Svg
      width={mapW}
      height={mapH}
      style={StyleSheet.absoluteFill}
      pointerEvents="none"
    >
      {available.slice(0, -1).map((body, i) => {
        const next = available[i + 1];
        const x1 = body.mapPosition.x * mapW;
        const y1 = body.mapPosition.y * mapH;
        const x2 = next.mapPosition.x * mapW;
        const y2 = next.mapPosition.y * mapH;
        return (
          <Line
            key={`${body.id}-${next.id}`}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="rgba(255,255,255,0.12)"
            strokeWidth={1.5}
            strokeDasharray="6,8"
          />
        );
      })}
    </Svg>
  );
}

// ── Tela principal ──────────────────────────────────────────────

export default function GalaxyInteriorScreen() {
  const { galaxyId } = useLocalSearchParams<{ galaxyId: string }>();
  const router = useRouter();
  const [snapshot, setSnapshot] = useState<GamificationSnapshot | null>(null);

  useEffect(() => {
    GamificationService.getSnapshot().then(setSnapshot);
  }, []);

  const galaxy = getGalaxyById(galaxyId ?? '');

  if (!galaxy) {
    return (
      <View style={styles.root}>
        <Text style={{ color: '#fff', padding: 40 }}>Galáxia não encontrada.</Text>
      </View>
    );
  }

  const nebulaExtras = [
    { color: galaxy.colorPrimary, x: 0.5, y: 0.1, w: 260, h: 200 },
    { color: galaxy.colorSecondary, x: 0.15, y: 0.55, w: 200, h: 160 },
  ];

  return (
    <View style={styles.root}>
      <StarfieldBackground
        backgroundColor="#03030d"
        starCount={100}
        extraNebulas={nebulaExtras}
      />
      <SafeAreaView style={styles.safe} edges={['top']}>
        <HUD
          totalXp={snapshot?.totalXp ?? 0}
          streakDays={snapshot?.streakDays ?? 0}
          hearts={snapshot?.hearts ?? 5}
          maxHearts={snapshot?.maxHearts ?? 5}
        />

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} hitSlop={12}>
            <Text style={styles.backIcon}>‹</Text>
          </TouchableOpacity>
          <View style={styles.headerTitleRow}>
            <Text style={styles.headerEmoji}>{galaxy.emoji}</Text>
            <Text style={styles.headerTitle} accessibilityRole="header">{galaxy.title}</Text>
          </View>
        </View>

        {/* Subtítulo */}
        <Text style={styles.subtitle}>
          {galaxy.bodies.filter((b) => b.status !== 'locked').length} / {galaxy.bodies.length} mundos disponíveis
        </Text>

        {/* Mapa de corpos celestes */}
        <View style={styles.mapArea}>
          <BodyConnectors bodies={galaxy.bodies} />
          {galaxy.bodies.map((body, index) => (
            <BodyCard
              key={body.id}
              body={body}
              index={index}
              onPress={() => router.push(`/galaxy/${galaxyId}/${body.id}`)}
            />
          ))}
        </View>
      </SafeAreaView>
    </View>
  );
}

// ── Estilos ─────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#03030d' },
  safe: { flex: 1 },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
    gap: 12,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Glifos de ícone (chevron, emoji) ficam fora da escala tipográfica:
  // são desenho, não texto, e a métrica da Sora deslocaria o alinhamento.
  backIcon: {
    fontSize: 24,
    color: '#fff',
    lineHeight: 28,
    marginTop: -2,
  },
  headerTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  headerEmoji: { fontSize: 22 },
  headerTitle: {
    ...typography.h3,
    color: '#FFFFFF',
  },

  subtitle: {
    ...typography.micro,
    color: 'rgba(255,255,255,0.40)',
    paddingHorizontal: 20,
    marginTop: 4,
    marginBottom: 8,
  },

  mapArea: {
    flex: 1,
    position: 'relative',
  },

  bodyWrapper: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bodyTouchable: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  bodyLabel: {
    ...typography.micro,
    marginTop: 8,
    color: 'rgba(255,255,255,0.75)',
    textAlign: 'center',
    maxWidth: 90,
  },
  bodyLabelLocked: { color: 'rgba(255,255,255,0.30)' },
  bodyLabelActive: { color: '#FFFFFF', fontFamily: 'Sora-Bold', fontWeight: '700' },
  nodeBadge: {
    marginTop: 4,
    backgroundColor: 'rgba(255,255,255,0.10)',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  nodeBadgeText: {
    ...typography.micro,
    color: 'rgba(255,255,255,0.50)',
  },
});
