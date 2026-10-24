import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { semanticColors } from '../../ui/semantic-colors';
import { space, typography } from '../../ui/styles';
import { collimationModel, type CollimationInput } from './collimationModel';
import { REFERENCE_EXPOSURE } from './exposureModel';
import { ExposureImage } from './ExposureImage';

/** Centímetros com até uma casa, com vírgula: "18", "12,5". */
function centimeters(value: number): string {
  return String(Math.round(value * 10) / 10).replace('.', ',');
}

/**
 * A imagem da bancada de colimação: o fantoma da exposição, pintado com a
 * exposição de referência, e a máscara do campo que `collimationModel` calcula.
 * Colimar não muda kV nem mAs; muda só o que o feixe cobre.
 */
export function CollimationImage({
  field,
  size,
  label,
}: {
  field: CollimationInput;
  size: number;
  label: string;
}): React.ReactElement {
  const { fieldFraction } = collimationModel(field);
  return <ExposureImage input={REFERENCE_EXPOSURE} size={size} label={label} field={fieldFraction} />;
}

/**
 * O campo, a área e o produto dose-área em texto: o que a máscara mostra, dito
 * em palavras (spec, seção 8). Não diz "dose": a dose do feixe direto num ponto
 * dentro do campo não cai ao colimar; o que cai, com a área, é o produto
 * dose-área. A linha dele é uma região viva, para quem não vê a imagem ouvir o efeito de cada passo.
 */
export function CollimationReadout({ field }: { field: CollimationInput }): React.ReactElement {
  const out = collimationModel(field);
  const area = Math.round(out.area);
  const doseArea = Math.round(out.relativeDoseArea * 100);

  return (
    <View style={styles.readout}>
      <Text style={styles.line}>
        {`Campo de ${centimeters(out.fieldWidth)} × ${centimeters(out.fieldHeight)} cm, ${area} cm²`}
      </Text>
      <Text style={styles.line} accessibilityLiveRegion="polite">
        {`Produto dose-área: ${doseArea}% do campo todo`}
      </Text>
    </View>
  );
}

const galaxy = semanticColors.galaxy;

const styles = StyleSheet.create({
  readout: { alignItems: 'center', gap: space.s1 },
  line: { ...typography.bodyStrong, color: galaxy.textPrimary },
});
