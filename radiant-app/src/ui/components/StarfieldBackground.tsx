/**
 * StarfieldBackground
 * Fundo grafite liso das telas do app (plano 1, fundação visual Medalhão).
 * Sem estrelas, sem nebulosas e sem laço de animação: o custo de CPU do céu
 * animado saiu junto (FILA 12 e 33). O nome fica por enquanto para não tocar as
 * nove telas que o usam; o plano 5 renomeia.
 */

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { galaxyColors } from '../theme';

interface StarfieldBackgroundProps {
  /** Cor de fundo — padrão galaxyColors.background */
  backgroundColor?: string;
  /**
   * Sem efeito desde o fundo liso. Seguem aceitas só para as telas atuais não
   * quebrarem o tipo; o plano 5 as remove junto com a renomeação.
   */
  variant?: 'galaxy' | 'focused';
  starCount?: number;
}

export function StarfieldBackground({
  backgroundColor = galaxyColors.background,
}: StarfieldBackgroundProps) {
  return (
    <View style={[StyleSheet.absoluteFillObject, { backgroundColor }]} pointerEvents="none" />
  );
}
