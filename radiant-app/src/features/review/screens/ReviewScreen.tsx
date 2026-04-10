import React, { useEffect, useMemo, useState } from 'react';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { ActivityIndicator, Animated, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { AppButton } from '../../../components/ui/AppButton';
import { PixelHeroSplit } from '../../../components/ui/PixelHeroSplit';
import { ProgressRing } from '../../../components/ui/ProgressRing';
import { StatItem } from '../../../components/ui/StatItem';
import { SurfaceCard } from '../../../components/ui/SurfaceCard';
import { duration, useFadeInUp } from '../../../ui/motion';
import { colors } from '../../../ui/theme';
import { layout, radius, space, typography } from '../../../ui/styles';
import { PushOptInCard } from '../../push/components/PushOptInCard';
import { PushService } from '../../push/services/PushService';
import { ReviewCard } from '../components/ReviewCard';
import { useReview } from '../hooks/useReview';
import { RatingPromptService } from '../../../services/RatingPromptService';

const SCREEN_MAX_WIDTH = 720;
const ICON_BUTTON_SIZE = space.s6 + space.s4;

export default function ReviewScreen() {
  const { state, queue, currentItem, currentIndex, totalItems, sessionXp, loading, startReview, submitRating } = useReview();
  const fadeAnim = useFadeInUp(duration.ui);
  const [showPushOptIn, setShowPushOptIn] = useState(false);

  useEffect(() => {
    if (state === 'start' || state === 'finished') {
      fadeAnim.animateIn();
    }
  }, [fadeAnim, state]);

  useEffect(() => {
    if (state === 'finished') {
      void checkPushOptIn();
      void RatingPromptService.maybePromptForReview({
        trigger: 'review_complete',
        entrySurface: 'review_summary',
        itemsCount: totalItems,
      });
    }
  }, [state, totalItems]);

  const checkPushOptIn = async () => {
    const canShow = await PushService.getOptIn();
    if (canShow === null) {
      setShowPushOptIn(true);
    }
  };

  const progressValue = useMemo(() => {
    if (totalItems === 0) {
      return 0;
    }

    if (state === 'finished') {
      return totalItems;
    }

    if (state === 'review') {
      return currentIndex + 1;
    }

    return 0;
  }, [currentIndex, state, totalItems]);

  if (loading) {
    return (
      <SafeAreaView style={styles.screen}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (state === 'start') {
    const hasItems = queue.length > 0;

    return (
      <SafeAreaView style={styles.screen}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.headerRow}>
            <Pressable
              onPress={() => router.replace('/(tabs)')}
              accessibilityRole="button"
              accessibilityLabel="Fechar revisão"
              style={styles.iconButton}
            >
              <MaterialIcons name="close" size={24} color={colors.textPrimary} />
            </Pressable>
            <Text style={styles.headerLabel}>Review</Text>
            <View style={styles.iconSpacer} />
          </View>

          <Animated.View style={fadeAnim.style}>
            <SurfaceCard variant="glass" style={styles.heroCard}>
              <PixelHeroSplit
                eyebrow="Spaced repetition"
                message={hasItems ? 'Você tem uma fila curta e objetiva. Fecha isso agora e mantém a curva de retenção saudável.' : 'Sem pendências críticas. Sua trilha está limpa por enquanto.'}
                ringValue={0}
                ringTotal={Math.max(queue.length, 1)}
                ringLabel={hasItems ? `${queue.length} itens na fila` : 'Nenhum item agora'}
                state={hasItems ? 'guide' : 'idle'}
                tier={hasItems ? 'intermediate' : 'starter'}
                accessibilityLabel="Pixel guiando a revisão"
              />
            </SurfaceCard>
          </Animated.View>

          <SurfaceCard variant="solid" style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Como essa sessão funciona</Text>
            <View style={styles.statsList}>
              <StatItem
                icon={<MaterialIcons name="flash-on" size={20} color={colors.primary} />}
                label="Formato"
                value="Uma pergunta por item, resposta rápida e rating direto"
              />
              <StatItem
                icon={<MaterialIcons name="timeline" size={20} color={colors.primary} />}
                label="Objetivo"
                value="Consolidar memória antes de puxar conteúdo novo"
              />
              <StatItem
                icon={<MaterialIcons name="workspace-premium" size={20} color={colors.primary} />}
                label="Recompensa"
                value="XP só entra quando você realmente acerta"
              />
            </View>
          </SurfaceCard>

          <SurfaceCard variant="elevated" style={styles.actionCard}>
            <Text style={styles.actionTitle}>{hasItems ? 'Pronto para limpar a fila?' : 'Nenhuma revisão pendente'}</Text>
            <Text style={styles.actionBody}>
              {hasItems
                ? 'A sessão está curta o suficiente para caber agora. Não vale adiar uma fila desse tamanho.'
                : 'Você pode voltar para a jornada e continuar o próximo nó recomendado.'}
            </Text>

            {hasItems ? (
              <AppButton onPress={startReview} style={styles.fullWidthButton}>
                Começar revisão
              </AppButton>
            ) : (
              <AppButton onPress={() => router.replace('/(tabs)')} style={styles.fullWidthButton}>
                Voltar para jornada
              </AppButton>
            )}
          </SurfaceCard>
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (state === 'finished') {
    return (
      <SafeAreaView style={styles.screen}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.headerRow}>
            <Pressable
              onPress={() => router.replace('/(tabs)')}
              accessibilityRole="button"
              accessibilityLabel="Fechar revisão"
              style={styles.iconButton}
            >
              <MaterialIcons name="close" size={24} color={colors.textPrimary} />
            </Pressable>
            <Text style={styles.headerLabel}>Review</Text>
            <View style={styles.iconSpacer} />
          </View>

          <Animated.View style={fadeAnim.style}>
            <SurfaceCard variant="glass" style={styles.heroCard}>
              <PixelHeroSplit
                eyebrow="Sessão concluída"
                message="Boa. Você fechou a fila de revisão e devolveu estabilidade para a trilha."
                ringValue={totalItems}
                ringTotal={Math.max(totalItems, 1)}
                ringLabel="Fila encerrada"
                state="celebrate"
                tier="advanced"
                accessibilityLabel="Pixel celebrando a revisão"
              />
            </SurfaceCard>
          </Animated.View>

          <SurfaceCard variant="solid" style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Resultado da sessão</Text>
            <View style={styles.statsList}>
              <StatItem
                icon={<MaterialIcons name="task-alt" size={20} color={colors.primary} />}
                label="Itens"
                value={`${totalItems} concluídos nesta rodada`}
              />
              <StatItem
                icon={<MaterialIcons name="stars" size={20} color={colors.primary} />}
                label="XP"
                value={`+${sessionXp} XP confirmado`}
              />
              <StatItem
                icon={<MaterialIcons name="sync" size={20} color={colors.primary} />}
                label="Estado"
                value="Cards já atualizados no fluxo local-first"
              />
            </View>
          </SurfaceCard>

          {showPushOptIn ? (
            <View style={styles.pushCard}>
              <PushOptInCard onDismiss={() => setShowPushOptIn(false)} />
            </View>
          ) : null}

          <SurfaceCard variant="elevated" style={styles.actionCard}>
            <Text style={styles.actionTitle}>Fila limpa</Text>
            <Text style={styles.actionBody}>
              A próxima decisão agora volta para a jornada principal. Revise só quando realmente estiver devido.
            </Text>
            <AppButton onPress={() => router.replace('/(tabs)')} style={styles.fullWidthButton}>
              Voltar para jornada
            </AppButton>
          </SurfaceCard>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      <View style={[layout.container, styles.activeLayout]}>
        <View style={styles.headerRow}>
          <Pressable
            onPress={() => router.replace('/(tabs)')}
            accessibilityRole="button"
            accessibilityLabel="Fechar revisão"
            style={styles.iconButton}
          >
            <MaterialIcons name="close" size={24} color={colors.textPrimary} />
          </Pressable>
          <Text style={styles.headerLabel}>Review</Text>
          <Text style={styles.headerProgressText}>{progressValue}/{Math.max(totalItems, 1)}</Text>
        </View>

        <SurfaceCard variant="glass" style={styles.activeHeroCard}>
          <View style={styles.activeHeroHeader}>
            <View style={styles.activeHeroCopy}>
              <Text style={styles.activeTitle}>Sessão ativa</Text>
              <Text style={styles.activeBody}>
                Responda rápido, revele a resposta e classifique sem hesitar. O objetivo aqui é retenção, não exploração.
              </Text>
            </View>
            <ProgressRing
              value={progressValue}
              total={Math.max(totalItems, 1)}
              label="Progresso"
              size={space.s6 * 3}
            />
          </View>
        </SurfaceCard>

        <View style={styles.focusArea}>
          {currentItem ? <ReviewCard question={currentItem.question} onRate={submitRating} /> : null}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: space.s3,
    gap: space.s3,
    paddingBottom: space.s5,
  },
  activeLayout: {
    flex: 1,
    padding: space.s3,
    gap: space.s3,
    maxWidth: SCREEN_MAX_WIDTH,
  },
  headerRow: {
    ...layout.rowBetween,
    width: '100%',
    maxWidth: SCREEN_MAX_WIDTH,
    alignSelf: 'center',
  },
  iconButton: {
    width: ICON_BUTTON_SIZE,
    height: ICON_BUTTON_SIZE,
    borderRadius: radius.rXl,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceGlass,
    borderWidth: 1,
    borderColor: colors.borderSoft,
  },
  iconSpacer: {
    width: ICON_BUTTON_SIZE,
    height: ICON_BUTTON_SIZE,
  },
  headerLabel: {
    ...typography.body,
    color: colors.textPrimary,
    fontWeight: '800',
  },
  headerProgressText: {
    ...typography.caption,
    color: colors.textSecondary,
    width: ICON_BUTTON_SIZE,
    textAlign: 'right',
  },
  heroCard: {
    gap: space.s3,
  },
  sectionCard: {
    gap: space.s2,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  statsList: {
    gap: space.s2,
  },
  actionCard: {
    gap: space.s2,
  },
  actionTitle: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  actionBody: {
    ...typography.bodyRegular,
    color: colors.textSecondary,
  },
  fullWidthButton: {
    width: '100%',
  },
  pushCard: {
    width: '100%',
    maxWidth: SCREEN_MAX_WIDTH,
    alignSelf: 'center',
  },
  activeHeroCard: {
    gap: space.s2,
  },
  activeHeroHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.s3,
  },
  activeHeroCopy: {
    flex: 1,
    gap: space.s1,
  },
  activeTitle: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  activeBody: {
    ...typography.bodyRegular,
    color: colors.textSecondary,
  },
  focusArea: {
    flex: 1,
    justifyContent: 'center',
  },
});
