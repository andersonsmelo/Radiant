/**
 * PlanetInteriorScreen — Nível 3
 * Trilha de lições dentro de um planeta/estrela.
 * Adapta a lógica de JourneyMap para o tema espacial.
 */

import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  STUDENT_CHECKPOINT_SHADOW_CONTENT_VERSION,
  useShadowCheckpoint,
} from '../../student-checkpoints/useShadowCheckpoint';
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
import { useReducedMotionPreferenceState } from '@/src/ui/accessibility/useReducedMotionPreference';
import type { GamificationSnapshot } from '@/src/types/gamification';
import { HUD } from '@/src/ui/components/HUD';
import { DecorativeIcon, type DecorativeIconName } from '@/src/components/ui/DecorativeIcon';
import { HeartIcon } from '@/src/ui/components/HudIcons';
import { StarfieldBackground } from '@/src/ui/components/StarfieldBackground';
import { space, typography } from '@/src/ui/styles';
import { PlanetBody } from '../components/PlanetBody';

const { width: SCREEN_W } = Dimensions.get('window');

const NODE_TYPE_ICON: Record<JourneyNode['type'], DecorativeIconName> = {
  lesson: 'menu-book',
  review: 'refresh',
  checkpoint: 'flag',
  reward: 'emoji-events',
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

export function LessonNode({
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
  const { reducedMotionEnabled: reducedMotion, resolved: motionResolved } = useReducedMotionPreferenceState();

  // Glow pulsante para nó ativo
  const glowOpacity = useSharedValue(isActive ? 0.5 : 0);

  useEffect(() => {
    // Enquanto a preferência é desconhecida, nada é agendado e nenhum laço
    // começa. A consulta é assíncrona e a primeira renderização acontece antes
    // dela: com `index * 60`, os primeiros nós entravam animados ANTES de a
    // resposta chegar. Um quadro de espera custa menos que a preferência.
    if (!motionResolved) {
      return;
    }

    if (reducedMotion) {
      // A entrada em cascata (`index * 60`) é escada: cada nó chega num tempo
      // diferente. Sob reduced motion todos já nascem no destino — a lista
      // aparece pronta em vez de se montar.
      scale.value = 1;
      opacity.value = 1;
      // O glow segue marcando o nó ativo, parado no ponto alto do ciclo.
      glowOpacity.value = isActive ? 0.9 : 0;
      return;
    }

    const timeout = setTimeout(() => {
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

    // Sem limpeza, o timeout sobrevivia à re-execução do efeito e à
    // desmontagem — a cascata disparava depois de a preferência ter virado.
    return () => clearTimeout(timeout);
  }, [motionResolved, reducedMotion, index, isActive]);

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
        onPressIn={() => { if (!isLocked && !reducedMotion) pressScale.value = withSpring(0.90); }}
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
          <DecorativeIcon name={NODE_TYPE_ICON[node.type]} size={20} color={NODE_STATUS_COLOR[node.status]} />
          {isDone && (
            <View style={styles.checkBadge}>
              <DecorativeIcon name="check" size={12} color="#FFFFFF" />
            </View>
          )}
          {isLocked && (
            <View style={styles.lockOverlay}>
              <DecorativeIcon name="lock" size={16} color="#FFFFFF" />
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

  useShadowCheckpoint({
    surface: 'planet-interior',
    flowId: `planet:${galaxyId ?? 'unavailable'}:${bodyId ?? 'unavailable'}`,
    contentVersion: STUDENT_CHECKPOINT_SHADOW_CONTENT_VERSION,
    cursorId: body?.id ?? 'planet-unavailable',
    compatibleCursorIds: body ? [body.id] : ['planet-unavailable'],
    progressPercent: 0,
    completedStepCount: 0,
    totalStepCount: Math.max(1, body?.nodes.length ?? 1),
    galaxyId: galaxy?.id,
    planetId: body?.id,
    enabled: Boolean(galaxy && body),
  });

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
            <Text style={styles.galaxyLabel}>{galaxy.title}</Text>
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
            <View style={styles.emptyTrailContent}>
              <DecorativeIcon name="rocket-launch" size={20} color="rgba(255,255,255,0.7)" />
              <Text style={styles.emptyText}>Em breve — conteúdo chegando!</Text>
            </View>
          </View>
        ) : (
          <ScrollView
            style={styles.trail}
            contentContainerStyle={styles.trailContent}
            showsVerticalScrollIndicator={false}
          >
            {hearts === 0 && (
              <View style={styles.noHeartsWarning}>
                <View style={styles.noHeartsContent}>
                  <HeartIcon size={18} filled />
                  <Text style={styles.noHeartsText}>Sem vidas! Você pode fazer revisões, mas novas lições estão bloqueadas.</Text>
                </View>
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
  // O chevron fica fora da escala tipográfica:
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
  noHeartsContent: { flexDirection: 'row', alignItems: 'flex-start', gap: space.s1 },
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
  lockOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.35)',
    borderRadius: 999,
  },
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
  emptyTrailContent: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  emptyText: {
    ...typography.bodyRegular,
    color: 'rgba(255,255,255,0.50)',
    textAlign: 'center',
  },
});
