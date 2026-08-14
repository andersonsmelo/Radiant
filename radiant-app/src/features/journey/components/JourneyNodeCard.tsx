import React from 'react';
import { DecorativeIcon, type DecorativeIconName } from '../../../components/ui/DecorativeIcon';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { JourneyNode } from '../../../types/journey';
import { galaxyColors } from '../../../ui/theme';
import { radius, space, typography } from '../../../ui/styles';

const accent = galaxyColors.ctaGradientEnd;

type MaterialIconName = DecorativeIconName;

function getNodeCopy(node: JourneyNode): { icon: MaterialIconName; label: string } {
  switch (node.type) {
    case 'review':
      return { icon: 'refresh', label: 'Revisão' };
    case 'checkpoint':
      return { icon: 'verified', label: 'Checkpoint' };
    case 'reward':
      return { icon: 'emoji-events', label: 'Conquista' };
    default:
      return { icon: 'menu-book', label: 'Lição' };
  }
}

function getStatusCopy(node: JourneyNode) {
  switch (node.status) {
    case 'completed':
      return 'Concluído';
    case 'active':
      return 'Em andamento';
    case 'resumable':
      return 'Retomar';
    case 'due-review':
      return 'Revisar';
    case 'available':
      return 'Disponível';
    default:
      return 'Bloqueado';
  }
}

/**
 * A cor e o ícone que carregam o estado, além da palavra.
 *
 * Até 2026-08-14 esta função não existia: todo nó desenhava o ícone no azul de
 * acento, no mesmo cartão cinza, e a única diferença entre CONCLUÍDO e
 * BLOQUEADO era o texto de rodapé em cinza apagado — mais um `opacity: 0.5`
 * global no bloqueado, que derruba junto o contraste do texto. Na tela, feito e
 * impedido eram indistinguíveis, e o azul no ícone de um nó bloqueado ainda o
 * fazia parecer clicável.
 *
 * O estado vai por TRÊS canais que não dependem um do outro: a cor, o ícone
 * (cadeado quando bloqueado, selo quando concluído) e a palavra. Cor sozinha
 * nunca carrega informação neste projeto — é a mesma regra do HUD.
 */
function getStatusPresentation(node: JourneyNode): {
  accentColor: string;
  surfaceColor: string;
  /** Substitui o ícone do tipo quando o estado é mais importante que o tipo. */
  overrideIcon?: MaterialIconName;
} {
  switch (node.status) {
    case 'completed':
      return {
        accentColor: galaxyColors.nodeCompletedAccent,
        surfaceColor: galaxyColors.nodeCompleted,
        overrideIcon: 'check-circle',
      };
    case 'due-review':
      return { accentColor: galaxyColors.xpColor, surfaceColor: galaxyColors.surface };
    case 'active':
    case 'resumable':
    case 'available':
      return { accentColor: accent, surfaceColor: galaxyColors.surface };
    default:
      return {
        accentColor: galaxyColors.nodeLockedAccent,
        surfaceColor: galaxyColors.nodeLocked,
        overrideIcon: 'lock',
      };
  }
}

type JourneyNodeCardProps = {
  node: JourneyNode;
  nodeIndex: number;
  isRecommended: boolean;
  onPress: (node: JourneyNode) => void;
  disabled?: boolean;
};

export function JourneyNodeCard({
  node,
  nodeIndex,
  isRecommended,
  onPress,
  disabled = false,
}: JourneyNodeCardProps) {
  const meta = getNodeCopy(node);
  const presentation = getStatusPresentation(node);
  const alignRight = nodeIndex % 2 === 1;
  const isLocked = node.status === 'locked';

  return (
    <View style={[styles.row, alignRight && styles.rowRight]}>
      <View style={styles.anchorColumn}>
        <View
          testID={`journey-anchor-${node.id}`}
          style={[
            styles.anchor,
            { borderColor: presentation.accentColor },
            // O nó concluído é o único ponto PREENCHIDO da linha. Percorrendo a
            // trilha de cima para baixo, a fronteira entre cheio e vazio é onde
            // a pessoa está — sem precisar ler nenhum rótulo.
            node.status === 'completed' && { backgroundColor: presentation.accentColor },
            isRecommended && styles.recommendedRing,
          ]}
        />
      </View>

      <Pressable
        onPress={() => onPress(node)}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityLabel={`${node.title}. ${getStatusCopy(node)}.`}
        accessibilityState={{ disabled }}
        style={({ pressed }) => [
          styles.card,
          alignRight ? styles.cardRight : styles.cardLeft,
          { backgroundColor: presentation.surfaceColor },
          isLocked && styles.cardLocked,
          isRecommended && styles.cardRecommended,
          pressed && !disabled && styles.cardPressed,
        ]}
      >
        <View
          testID={`journey-icon-tile-${node.id}`}
          style={[styles.iconTile, isLocked && styles.iconTileLocked]}
        >
          <DecorativeIcon
            name={presentation.overrideIcon ?? meta.icon}
            size={22}
            color={presentation.accentColor}
          />
        </View>

        <View style={styles.content}>
          <Text style={styles.typeLabel}>{meta.label}</Text>
          <Text style={[styles.title, isLocked && styles.titleLocked]} numberOfLines={3}>
            {node.title}
          </Text>
          <Text
            testID={`journey-status-${node.id}`}
            style={[styles.metaText, { color: presentation.accentColor }]}
          >
            {isRecommended ? 'Próximo passo' : getStatusCopy(node)}
          </Text>
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    minHeight: 122,
  },
  rowRight: {
    justifyContent: 'flex-end',
  },
  anchorColumn: {
    position: 'absolute',
    left: '50%',
    marginLeft: -10,
    top: 0,
    bottom: 0,
    width: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  anchor: {
    width: 18,
    height: 18,
    borderRadius: 999,
    backgroundColor: galaxyColors.background,
    borderWidth: 4,
    borderColor: accent,
  },
  recommendedRing: {
    borderColor: accent,
    shadowColor: accent,
    shadowOpacity: 0.18,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  card: {
    width: '45%',
    minHeight: 96,
    borderRadius: radius.rLg,
    borderWidth: 1,
    borderColor: galaxyColors.border,
    padding: space.s1,
    gap: space.s1,
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  cardLeft: {
    marginRight: '55%',
  },
  cardRight: {
    marginLeft: '55%',
  },
  cardRecommended: {
    borderColor: accent,
    borderWidth: 2,
    backgroundColor: galaxyColors.surfaceActive,
    shadowColor: accent,
    shadowOpacity: 0.12,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 12 },
    elevation: 12,
  },
  // Sem `opacity` global: ela apagaria o texto junto e o contrato de contraste
  // não a enxerga, porque calcula tokens e não composição de runtime. O estado
  // bloqueado é dito pela borda tracejada, pelo cadeado e pela cor — o título
  // continua legível, que é o que permite decidir se vale a pena destravar.
  cardLocked: {
    borderStyle: 'dashed',
    borderColor: galaxyColors.nodeLockedAccent,
  },
  titleLocked: {
    color: galaxyColors.textSecondary,
  },
  iconTileLocked: {
    backgroundColor: galaxyColors.surfaceMuted,
  },
  cardPressed: {
    transform: [{ scale: 0.98 }],
  },
  iconTile: {
    width: 44,
    height: 44,
    borderRadius: radius.rMd,
    backgroundColor: galaxyColors.surfaceActive,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    gap: 2,
  },
  typeLabel: {
    ...typography.micro,
    color: galaxyColors.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  title: {
    ...typography.body,
    color: galaxyColors.textPrimary,
    fontWeight: '800',
  },
  metaText: {
    ...typography.caption,
    color: galaxyColors.textSecondary,
  },
});
