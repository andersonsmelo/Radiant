import React, { useCallback, useContext, useState } from 'react';
import { StyleSheet, View, type LayoutChangeEvent } from 'react-native';
import { SafeAreaInsetsContext } from 'react-native-safe-area-context';
import { PixelIllustration } from '../../../ui/characters/PixelIllustration';
import { space } from '../../../ui/styles';

type PixelProps = Pick<React.ComponentProps<typeof PixelIllustration>, 'state' | 'expression' | 'accessibilityLabel'>;

// `Continuar` vive num rodapé fixo fora do ScrollView — a mesma forma do
// problema que `tabBarClearance` (src/ui/styles.ts) resolve para as telas de
// tab: um elemento fixado fora do conteúdo rolável precisa da sua própria
// reserva, ou o fim do scroll renderiza cortado ou fica invisível no primeiro
// paint atrás do botão. Estas telas não são tabs, então ganham sua própria
// constante nomeada em vez de importar `tabBarClearance` — mesmo desenho,
// valor próprio.
const CTA_HEIGHT = 56; // altura mínima do AppButton, components/ui/AppButton.tsx
export const ctaClearance = space.s3 * 2 /* padding vertical do rodapé */ + CTA_HEIGHT + space.s3; /* respiro */

/** Folga da rolagem: a altura medida do rodapé, ou a estimada de um botão até a primeira medida. */
export function scrollClearance(measuredFooter: number | null): number {
  return measuredFooter ?? ctaClearance;
}

/**
 * Rodapé fixo fora da rolagem: mede a si mesmo (vários botões, texto ampliado) e
 * respeita a área segura de baixo. Sem provider (testes) o inset é 0.
 */
export function useFixedFooter() {
  const [measured, setMeasured] = useState<number | null>(null);
  const bottomInset = useContext(SafeAreaInsetsContext)?.bottom ?? 0;
  const onLayout = useCallback((event: LayoutChangeEvent) => setMeasured(event.nativeEvent.layout.height), []);
  return {
    onLayout,
    footerStyle: { paddingBottom: space.s3 + bottomInset },
    scrollPaddingBottom: scrollClearance(measured === null ? null : measured + space.s3),
  };
}

/** A faixa do alto do resumo: a medalha no centro e, se pedido, o Pixel ao lado. */
export function SummaryHero({ children, pixel }: { children: React.ReactNode; pixel?: PixelProps }) {
  return (
    <View style={styles.hero}>
      {children}
      {pixel ? <PixelIllustration {...pixel} size="md" /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: space.s2,
    paddingTop: space.s3,
  },
});
