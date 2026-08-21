import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { DecorativeIcon } from '../../../components/ui/DecorativeIcon';
import { galaxyColors } from '../../../ui/theme';
import { radius, space, typography } from '../../../ui/styles';

type JourneyLevelBandProps = {
  trackId: string;
  trackTitle: string;
  unlocked: boolean;
};

/**
 * O marco que substitui o título de unidade removido do caminho.
 *
 * O `JourneyMap` anterior usava o título como CABEÇALHO: ele partia a trilha em
 * seções, uma por unidade, e o aluno via trechos separados em vez de um
 * percurso. A faixa faz o trabalho oposto — ela vive AO LONGO do caminho, marca
 * a passagem de uma trilha para a seguinte e não interrompe a linha.
 *
 * O cadeado aparece só quando a trilha seguinte ainda não abriu. Ele é o mesmo
 * sinal que o nó bloqueado usa, e não é o único: o rótulo também muda de
 * palavra. Cor sozinha nunca carrega informação neste projeto.
 */
export function JourneyLevelBand({ trackId, trackTitle, unlocked }: JourneyLevelBandProps) {
  const eyebrow = unlocked ? 'Próximo nível' : 'Bloqueado';

  return (
    <View
      testID={`journey-level-band-${trackId}`}
      accessibilityRole="header"
      accessibilityLabel={`${eyebrow}: ${trackTitle}.`}
      style={styles.band}
    >
      <View style={styles.rule} />
      <View style={styles.plate}>
        {!unlocked && (
          <DecorativeIcon name="lock" size={14} color={galaxyColors.nodeLockedAccent} />
        )}
        <View style={styles.copy}>
          <Text style={styles.eyebrow}>{eyebrow}</Text>
          <Text style={styles.title} numberOfLines={2}>
            {trackTitle}
          </Text>
        </View>
      </View>
      <View style={styles.rule} />
    </View>
  );
}

const styles = StyleSheet.create({
  band: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.s2,
    paddingVertical: space.s3,
  },
  rule: {
    flex: 1,
    height: 1,
    backgroundColor: galaxyColors.spine,
  },
  plate: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.s1,
    paddingVertical: space.s1,
    paddingHorizontal: space.s2,
    borderRadius: radius.rLg,
    borderWidth: 1,
    borderColor: galaxyColors.border,
    backgroundColor: galaxyColors.surface,
    maxWidth: '72%',
  },
  copy: {
    alignItems: 'center',
  },
  eyebrow: {
    ...typography.micro,
    color: galaxyColors.textTertiary,
    fontWeight: '800',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  title: {
    ...typography.label,
    // Texto de marco continua em alto contraste mesmo quando a trilha está
    // bloqueada: na referência quem perde cor é a arte, nunca a palavra.
    color: galaxyColors.textPrimary,
    fontWeight: '800',
    textAlign: 'center',
  },
});
