/**
 * PlanetInteriorScreen — Nível 3
 * Trilha de lições dentro de um planeta/estrela.
 * Adapta a lógica de JourneyMap para o tema espacial.
 */

import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { getGalaxyById } from '@/src/data/galaxy-catalog';
import { GamificationService } from '@/src/features/gamification/services/GamificationService';
import type { CelestialBody } from '@/src/types/galaxy';
import type { JourneyNode } from '@/src/types/journey';
import type { GamificationSnapshot } from '@/src/types/gamification';
import { HUD } from '@/src/ui/components/HUD';
import { StarfieldBackground } from '@/src/ui/components/StarfieldBackground';
import { typography } from '@/src/ui/styles';
import { PlanetBody } from '../components/PlanetBody';

const { width: SCREEN_W } = Dimensions.get('window');

const NODE_TYPE_ICON: Record<JourneyNode['type'], string> = {
  lesson: '📖',
  review: '🔄',
  checkpoint: '🏁',
  reward: '🏆',
};

const NODE_STATUS_COLOR: Record<JourneyNode['status'], string> = {
  completed: '#50DC64',
  active: '#FFFFFF',
  'due-review': '#F5A623',
  resumable: '#4D7FFF',
  available: 'rgba(255,255,255,0.7)',
  locked: 'rgba(255,255,255,0.25)',
};

// ── Nó de lição ─────────────────────────────────────────────────

function LessonNode({
  node,
  index,
  onPress,
  accentColor,
}: {
  node: JourneyNode;
  index: number;
  onPress: () => void;
  accentColor: string;
}) {
  const scale = useSharedValue(0.7);
  const opacity = useSharedValue(0);
  const pressScale = useSharedValue(1);
  const isActive = node.status === 'active' || node.status === 'resumable';
  const isLocked = node.status === 'locked';
  const isDone = node.status === 'completed';

  // Glow pulsante para nó ativo
  const glowOpacity = useSharedValue(isActive ? 0.5 : 0);

  useEffect(() => {
    setTimeout(() => {
      scale.value = withSpring(1, { damping: 14 });
      opacity.value = withTiming(1, { duration: 250 });
    }, index * 60);

    if (isActive) {
      glowOpacity.value = withRepeat(
        withSequence(
          withTiming(0.9, { duration: 900 }),
          withTiming(0.3, { duration: 900 }),
        ),
        -1,
        true,
      );
    }
  }, []);

  const entryStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value * pressScale.value }],
    opacity: opacity.value,
  }));

  const glowStyle = useAnimatedStyle(() => ({
    shadowOpacity: glowOpacity.value,
  }));

  // Zigzag: alterna lados
  const isLeft = index % 2 === 0;
  const offsetX = isLeft ? -SCREEN_W * 0.12 : SCREEN_W * 0.12;

  const dotSize = isActive ? 64 : isDone ? 52 : 48;

  return (
    <Animated.View style={[styles.nodeRow, { transform: [{ translateX: offsetX }] }, entryStyle]}>
      <TouchableOpacity
        onPress={isLocked ? undefined : onPress}
        onPressIn={() => { if (!isLocked) pressScale.value = withSpring(0.90); }}
        onPressOut={() => { pressScale.value = withSpring(1); }}
        activeOpacity={isLocked ? 1 : 0.75}
      >
        <Animated.View
          style={[
            styles.nodeDot,
            {
              width: dotSize,
              height: dotSize,
              borderRadius: dotSize / 2,
              backgroundColor: isDone
                ? 'rgba(80,220,100,0.15)'
                : isActive
                ? 'rgba(77,127,255,0.18)'
                : 'rgba(255,255,255,0.05)',
              borderColor: NODE_STATUS_COLOR[node.status],
              shadowColor: isActive ? accentColor : isDone ? '#50DC64' : 'transparent',
              shadowRadius: 16,
              shadowOffset: { width: 0, height: 0 },
            },
            glowStyle,
          ]}
        >
          <Text style={styles.nodeIcon}>{NODE_TYPE_ICON[node.type]}</Text>
          {isDone && (
            <View style={styles.checkBadge}>
              <Text style={styles.checkText}>✓</Text>
            </View>
          )}
          {isLocked && (
            <View style={styles.lockOverlay}>
              <Text style={styles.lockIcon}>🔒</Text>
            </View>
          )}
        </Animated.View>

        <Text
          style={[
            styles.nodeTitle,
            { color: NODE_STATUS_COLOR[node.status] },
            isActive && styles.nodeTitleActive,
          ]}
          numberOfLines={2}
        >
          {node.title}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

// ── Tela principal ──────────────────────────────────────────────

export default function PlanetInteriorScreen() {
  const { galaxyId, bodyId } = useLocalSearchParams<{
    galaxyId: string;
    bodyId: string;
  }>();
  const router = useRouter();
  const [snapshot, setSnapshot] = useState<GamificationSnapshot | null>(null);

  useEffect(() => {
    GamificationService.getSnapshot().then(setSnapshot);
  }, []);

  const galaxy = getGalaxyById(galaxyId ?? '');
  const body: CelestialBody | undefined = galaxy?.bodies.find((b) => b.id === bodyId);

  if (!galaxy || !body) {
    return (
      <View style={styles.root}>
        <Text style={{ color: '#fff', padding: 40 }}>Planeta não encontrado.</Text>
      </View>
    );
  }

  const hearts = snapshot?.hearts ?? 5;
  const maxHearts = snapshot?.maxHearts ?? 5;

  const handleNodePress = (node: JourneyNode) => {
    if (node.status === 'locked') return;

    if (node.type === 'lesson' || node.type === 'checkpoint') {
      if (hearts === 0 && node.status !== 'due-review') {
        // Sem vidas — bloquear novas lições
        return;
      }
      if (node.lessonId && node.blockId) {
        router.push(`/learn?lessonId=${node.lessonId}&blockId=${node.blockId}&nodeId=${node.id}`);
      }
    } else if (node.type === 'review') {
      router.push(`/review?nodeId=${node.id}&bodyId=${bodyId}`);
    } else if (node.type === 'reward') {
      router.push(`/reward?nodeId=${node.id}`);
    }
  };

  const nebulaExtras = [
    { color: body.surfaceConfig.atmosphereColor, x: 0.5, y: 0.08, w: 300, h: 240 },
  ];

  return (
    <View style={styles.root}>
      <StarfieldBackground
        backgroundColor="#03030d"
        starCount={80}
        extraNebulas={nebulaExtras}
      />
      <SafeAreaView style={styles.safe} edges={['top']}>
        <HUD
          totalXp={snapshot?.totalXp ?? 0}
          streakDays={snapshot?.streakDays ?? 0}
          hearts={hearts}
          maxHearts={maxHearts}
        />

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} hitSlop={12}>
            <Text style={styles.backIcon}>‹</Text>
          </TouchableOpacity>
          <View style={styles.headerInfo}>
            <Text style={styles.galaxyLabel}>{galaxy.emoji} {galaxy.title}</Text>
            <Text style={styles.bodyTitle} accessibilityRole="header">{body.title}</Text>
          </View>
        </View>

        {/* Planeta hero */}
        <View style={styles.heroArea}>
          <PlanetBody body={body} sizeOverride={120} />
          <View style={styles.heroBadge}>
            <Text style={styles.heroBadgeText}>
              {body.nodes.filter((n) => n.status === 'completed').length}/{body.nodes.length} lições
            </Text>
          </View>
        </View>

        {/* Trilha de nós */}
        {body.nodes.length === 0 ? (
          <View style={styles.emptyTrail}>
            <Text style={styles.emptyText}>🚀 Em breve — conteúdo chegando!</Text>
          </View>
        ) : (
          <ScrollView
            style={styles.trail}
            contentContainerStyle={styles.trailContent}
            showsVerticalScrollIndicator={false}
          >
            {hearts === 0 && (
              <View style={styles.noHeartsWarning}>
                <Text style={styles.noHeartsText}>
                  ❤️ Sem vidas! Você pode fazer revisões, mas novas lições estão bloqueadas.
                </Text>
              </View>
            )}
            {body.nodes.map((node, index) => (
              <LessonNode
                key={node.id}
                node={node}
                index={index}
                onPress={() => handleNodePress(node)}
                accentColor={body.surfaceConfig.glowColor}
              />
            ))}
            <View style={{ height: 120 }} />
          </ScrollView>
        )}
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
  // Glifos de ícone (chevron, ✓, emoji) ficam fora da escala tipográfica:
  // são desenho, não texto, e a métrica da Sora deslocaria o alinhamento.
  backIcon: {
    fontSize: 24,
    color: '#fff',
    lineHeight: 28,
    marginTop: -2,
  },
  headerInfo: { flex: 1 },
  galaxyLabel: {
    ...typography.micro,
    color: 'rgba(255,255,255,0.45)',
  },
  bodyTitle: {
    ...typography.h3,
    color: '#FFFFFF',
  },

  heroArea: {
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 8,
  },
  heroBadge: {
    marginTop: 10,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  heroBadgeText: {
    ...typography.micro,
    color: 'rgba(255,255,255,0.6)',
  },

  trail: { flex: 1 },
  trailContent: {
    paddingTop: 16,
    alignItems: 'center',
    gap: 12,
  },

  noHeartsWarning: {
    marginHorizontal: 24,
    marginBottom: 16,
    backgroundColor: 'rgba(255,59,48,0.12)',
    borderRadius: 12,
    padding: 12,
  },
  noHeartsText: {
    ...typography.caption,
    color: '#FF6B6B',
    textAlign: 'center',
  },

  nodeRow: {
    alignItems: 'center',
    width: SCREEN_W,
  },
  nodeDot: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    shadowOpacity: 0.6,
  },
  nodeIcon: { fontSize: 20 },
  checkBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#50DC64',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkText: { fontSize: 10, color: '#fff', fontWeight: '800' },
  lockOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.35)',
    borderRadius: 999,
  },
  lockIcon: { fontSize: 16 },
  nodeTitle: {
    ...typography.micro,
    marginTop: 6,
    textAlign: 'center',
    maxWidth: 120,
  },
  nodeTitleActive: {
    ...typography.caption,
    fontFamily: 'Sora-Bold',
    fontWeight: '800',
  },

  emptyTrail: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  emptyText: {
    ...typography.bodyRegular,
    color: 'rgba(255,255,255,0.50)',
    textAlign: 'center',
  },
});
