/**
 * GalaxyMapScreen — Nível 1
 * Mapa de galáxias temáticas. Tab principal do app.
 * Galáxias como blobs espirais flutuando no espaço escuro.
 */

import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { Defs, Line, Svg } from 'react-native-svg';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GamificationService } from '../../gamification/services/GamificationService';
import { GalaxyBlob } from '../components/GalaxyBlob';
import { StarfieldBackground } from '../../../ui/components/StarfieldBackground';
import { HUD } from '../../../ui/components/HUD';
import type { GamificationSnapshot } from '../../../types/gamification';
import type { RadiantGalaxy } from '../../../types/galaxy';
import { GALAXY_CATALOG, getActiveGalaxy, getActiveBody } from '../../../data/galaxy-catalog';
import { galaxyColors } from '../../../ui/theme';

// ── Constantes ───────────────────────────────────────────────

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');
const MAP_H = SCREEN_H * 0.62;

// ── Cartão de galáxia (pressable) ────────────────────────────

interface GalaxyCardProps {
  galaxy: RadiantGalaxy;
  onPress: (galaxy: RadiantGalaxy) => void;
}

function GalaxyCard({ galaxy, onPress }: GalaxyCardProps) {
  const scale = useSharedValue(1);
  const isLocked = galaxy.status === 'locked';
  const isActive = galaxy.status === 'active';

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    if (!isLocked) scale.value = withSpring(0.94);
  };
  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  const x = galaxy.mapPosition.x * SCREEN_W;
  const y = galaxy.mapPosition.y * MAP_H;
  const glowColor = isActive
    ? galaxy.colorPrimary
    : isLocked
    ? 'transparent'
    : galaxy.colorPrimary;

  return (
    <Animated.View
      style={[
        styles.galaxyCard,
        {
          left: x - galaxy.visualSize / 2,
          top: y - galaxy.visualSize / 2,
          opacity: isLocked ? 0.25 : 1,
        },
        animStyle,
      ]}
    >
      <Pressable
        onPress={() => !isLocked && onPress(galaxy)}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={styles.galaxyPressable}
      >
        {/* Glow externo via shadow */}
        {!isLocked && (
          <View
            style={[
              styles.galaxyGlow,
              {
                width: galaxy.visualSize * 1.7,
                height: galaxy.visualSize * 1.7,
                borderRadius: galaxy.visualSize,
                backgroundColor: glowColor,
                top: -(galaxy.visualSize * 0.35),
                left: -(galaxy.visualSize * 0.35),
                shadowColor: glowColor,
                shadowOpacity: isActive ? 0.9 : 0.5,
                shadowRadius: 30,
                shadowOffset: { width: 0, height: 0 },
              },
            ]}
          />
        )}

        {/* Blob da galáxia */}
        <GalaxyBlob
          size={galaxy.visualSize}
          colorPrimary={galaxy.colorPrimary}
        />

        {/* Label */}
        <Text
          style={[
            styles.galaxyLabel,
            isActive && { color: '#fff', textShadowColor: galaxy.colorPrimary, textShadowRadius: 8 },
            isLocked && { color: '#2a2a3a' },
          ]}
        >
          {galaxy.title}
        </Text>

        {/* Badge de ativo */}
        {isActive && (
          <View style={styles.activeBadge}>
            <Text style={styles.activeBadgeText}>EM ANDAMENTO</Text>
          </View>
        )}
      </Pressable>
    </Animated.View>
  );
}

// ── Tela principal ───────────────────────────────────────────

export default function GalaxyMapScreen() {
  const router = useRouter();
  const [snapshot, setSnapshot] = useState<GamificationSnapshot | null>(null);

  useEffect(() => {
    GamificationService.getSnapshot().then(setSnapshot);
  }, []);

  const handleGalaxyPress = useCallback(
    (galaxy: RadiantGalaxy) => {
      router.push(`/galaxy/${galaxy.id}`);
    },
    [router],
  );

  // Galáxia e corpo ativos para o CTA
  const activeGalaxy = getActiveGalaxy();
  const activeBody = activeGalaxy ? getActiveBody(activeGalaxy.id) : null;
  const activeNode = activeBody?.nodes.find((n) => n.status === 'active' || n.status === 'available');

  const ctaLabel = activeGalaxy
    ? `▶  Continuar na Galáxia ${activeGalaxy.title}`
    : 'Escolher uma galáxia';
  const ctaHint = activeBody && activeNode
    ? `${activeBody.title} · ${activeNode.title}`
    : '';

  const handleCTA = () => {
    if (activeGalaxy) router.push(`/galaxy/${activeGalaxy.id}`);
  };

  return (
    <View style={styles.root}>
      <StarfieldBackground
        extraNebulas={GALAXY_CATALOG.filter((g) => !['locked'].includes(g.status)).map((g) => ({
          color: g.colorPrimary,
          x: g.mapPosition.x - 0.15,
          y: g.mapPosition.y - 0.1,
          w: g.visualSize * 2.5,
          h: g.visualSize * 2,
        }))}
      />

      <SafeAreaView style={styles.safe} edges={['top']}>
        {/* Status bar */}
        <View style={styles.statusBar}>
          <Text style={styles.appTitle}>RADIANT</Text>
        </View>

        {/* HUD */}
        {snapshot && (
          <HUD
            totalXp={snapshot.totalXp}
            streakDays={snapshot.streakDays}
            hearts={snapshot.hearts}
            maxHearts={snapshot.maxHearts}
          />
        )}

        {/* Mapa de galáxias */}
        <View style={[styles.mapContainer, { height: MAP_H }]}>
          {/* SVG para trilhas pontilhadas entre galáxias */}
          <Svg style={StyleSheet.absoluteFillObject} width={SCREEN_W} height={MAP_H}>
            <Defs />
            {/* Linha Anatomia → Física Rad. */}
            <Line
              x1={GALAXY_CATALOG[0].mapPosition.x * SCREEN_W}
              y1={GALAXY_CATALOG[0].mapPosition.y * MAP_H}
              x2={GALAXY_CATALOG[1].mapPosition.x * SCREEN_W}
              y2={GALAXY_CATALOG[1].mapPosition.y * MAP_H}
              stroke="rgba(255,255,255,0.1)"
              strokeWidth={1.5}
              strokeDasharray="5,8"
            />
            {/* Linha Física → Casos */}
            <Line
              x1={GALAXY_CATALOG[1].mapPosition.x * SCREEN_W}
              y1={GALAXY_CATALOG[1].mapPosition.y * MAP_H}
              x2={GALAXY_CATALOG[2].mapPosition.x * SCREEN_W}
              y2={GALAXY_CATALOG[2].mapPosition.y * MAP_H}
              stroke="rgba(255,255,255,0.06)"
              strokeWidth={1.2}
              strokeDasharray="4,10"
            />
            {/* Linha Casos → Tecnologia */}
            <Line
              x1={GALAXY_CATALOG[2].mapPosition.x * SCREEN_W}
              y1={GALAXY_CATALOG[2].mapPosition.y * MAP_H}
              x2={GALAXY_CATALOG[3].mapPosition.x * SCREEN_W}
              y2={GALAXY_CATALOG[3].mapPosition.y * MAP_H}
              stroke="rgba(255,255,255,0.04)"
              strokeWidth={1}
              strokeDasharray="3,12"
            />
          </Svg>

          {/* Galáxias */}
          {GALAXY_CATALOG.map((galaxy) => (
            <GalaxyCard
              key={galaxy.id}
              galaxy={galaxy}
              onPress={handleGalaxyPress}
            />
          ))}
        </View>

        {/* CTA fixo */}
        <View style={styles.ctaArea}>
          <Pressable style={styles.ctaBtn} onPress={handleCTA}>
            <Text style={styles.ctaBtnText}>{ctaLabel}</Text>
          </Pressable>
          {!!ctaHint && <Text style={styles.ctaHint}>{ctaHint}</Text>}
        </View>
      </SafeAreaView>
    </View>
  );
}

// ── Estilos ──────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: galaxyColors.background,
  },
  safe: {
    flex: 1,
  },
  statusBar: {
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 2,
    alignItems: 'center',
  },
  appTitle: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 3,
    color: 'rgba(255,255,255,0.35)',
  },
  mapContainer: {
    flex: 1,
    position: 'relative',
  },
  galaxyCard: {
    position: 'absolute',
  },
  galaxyPressable: {
    alignItems: 'center',
    gap: 6,
  },
  galaxyGlow: {
    position: 'absolute',
  },
  galaxyLabel: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: 'rgba(255,255,255,0.5)',
    textAlign: 'center',
  },
  activeBadge: {
    backgroundColor: 'rgba(74,158,255,0.2)',
    borderWidth: 1,
    borderColor: 'rgba(74,158,255,0.4)',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginTop: -2,
  },
  activeBadgeText: {
    fontSize: 8,
    fontWeight: '800',
    color: '#7ab8ff',
    letterSpacing: 0.5,
  },
  ctaArea: {
    paddingHorizontal: 20,
    paddingBottom: 100, // espaço para a tab bar flutuante
    paddingTop: 8,
    backgroundColor: 'transparent',
  },
  ctaBtn: {
    backgroundColor: '#1b47ff',
    borderRadius: 18,
    paddingVertical: 14,
    alignItems: 'center',
    shadowColor: 'rgba(27,71,255,0.6)',
    shadowOpacity: 1,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  ctaBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
  },
  ctaHint: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.28)',
    textAlign: 'center',
    marginTop: 5,
  },
});
