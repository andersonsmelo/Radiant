import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View, type LayoutChangeEvent } from 'react-native';
import type { BenchPayload, LearningInteractionV2 } from '../../../types/learningActivity';
import { galaxyColors } from '../../../ui/theme';
import { semanticColors } from '../../../ui/semantic-colors';
import { radius, space, typography } from '../../../ui/styles';
import { PixelIllustration } from '../../../ui/characters/PixelIllustration';
import { BenchControlRow } from '../../bench/BenchControlRow';
import { CollimationImage, CollimationReadout } from '../../bench/CollimationImage';
import { FULL_FIELD, type CollimationInput } from '../../bench/collimationModel';
import { ExposureImage } from '../../bench/ExposureImage';
import { REFERENCE_EXPOSURE, type ExposureInput } from '../../bench/exposureModel';
import type { InteractionRendererProps } from './ActivityRendererRegistry';
import { decodeBenchValue, encodeBenchValue, isCorrectInteractionValue, type BenchValues } from './InteractionAnswerValue';

/** Largura da imagem sozinha, no máximo, e a largura de partida até a tela medir o espaço. */
const MAX_SINGLE_WIDTH = 240;
const DEFAULT_AVAILABLE_WIDTH = 280;

const warnedMissingReference = new Set<string>();

/** `match` sem `reference` não quebra a tela: avisa uma vez por interação e usa o ponto de partida. */
function warnMissingReference(interactionId: string) {
  if (warnedMissingReference.has(interactionId)) return;
  warnedMissingReference.add(interactionId);
  console.warn(
    `[BenchStepRenderer] interação "${interactionId}": o alvo match não tem reference; ` +
      `a imagem de referência usa a exposição padrão (${REFERENCE_EXPOSURE.kv} kV, ${REFERENCE_EXPOSURE.mas} mAs)`,
  );
}

/** Os controles que a bancada não oferece ficam no ponto de partida do modelo. */
function exposureFrom(values: BenchValues): ExposureInput {
  return { kv: values.kv ?? REFERENCE_EXPOSURE.kv, mas: values.mas ?? REFERENCE_EXPOSURE.mas };
}

/** O lado do campo que a bancada não oferece fica aberto, do tamanho da imagem. */
function fieldFrom(values: BenchValues): CollimationInput {
  return {
    fieldWidth: values.fieldWidth ?? FULL_FIELD.fieldWidth,
    fieldHeight: values.fieldHeight ?? FULL_FIELD.fieldHeight,
  };
}

/** Medida do campo para o rótulo da imagem, arredondada ao centímetro. */
function fieldText(field: CollimationInput): string {
  return `${Math.round(field.fieldWidth)} × ${Math.round(field.fieldHeight)} cm`;
}

function BenchScreen({
  interactionId,
  payload,
  value,
  onChange,
  submitted,
  explanation,
}: {
  interactionId: string;
  payload: BenchPayload;
  value: string | undefined;
  onChange: (value: string) => void;
  submitted: boolean;
  explanation?: string;
}) {
  const { controls, goal, mode } = payload;
  const values = decodeBenchValue(value, controls);
  const canonical = encodeBenchValue(values);

  // O player só considera o passo completo com um valor. Os valores iniciais
  // sobem uma vez ao montar (e de novo se o guardado estava fora da faixa).
  const emittedFor = useRef<string | null>(null);
  useEffect(() => {
    if (emittedFor.current === interactionId) return;
    emittedFor.current = interactionId;
    if (value !== canonical) onChange(canonical);
  }, [interactionId, value, canonical, onChange]);

  // O valor bruto do arrasto, por controle. Só a imagem o lê; o player não.
  const [preview, setPreview] = useState<Partial<Record<string, number>>>({});
  const live: BenchValues = { ...values };
  for (const control of controls) {
    const raw = preview[control.id];
    if (raw !== undefined) live[control.id] = raw;
  }
  const studentExposure = exposureFrom(live);
  const collimation = payload.simulator === 'collimation';

  // A referência ao lado só existe na exposição: um `match` na colimação é
  // conteúdo defeituoso (`invalid-goal`), e não abre segunda imagem.
  let referenceExposure: ExposureInput | null = null;
  if (!collimation && mode === 'challenge' && goal.kind === 'match') {
    if (goal.reference) {
      referenceExposure = goal.reference;
    } else {
      warnMissingReference(interactionId);
      referenceExposure = REFERENCE_EXPOSURE;
    }
  }

  const [availableWidth, setAvailableWidth] = useState(DEFAULT_AVAILABLE_WIDTH);
  const handleLayout = (event: LayoutChangeEvent) => setAvailableWidth(event.nativeEvent.layout.width);
  const imageSize = referenceExposure
    ? Math.floor((availableWidth - space.s3) / 2)
    : Math.min(MAX_SINGLE_WIDTH, Math.floor(availableWidth));

  return (
    <View style={styles.activity}>
      <Text style={styles.prompt}>{payload.prompt}</Text>

      <View style={styles.stage} onLayout={handleLayout}>
        <View style={styles.images}>
          {referenceExposure ? (
            <View style={styles.imageColumn}>
              <ExposureImage input={referenceExposure} size={imageSize} label="Imagem de referência" />
              <Text style={styles.caption}>Referência</Text>
            </View>
          ) : null}
          <View style={styles.imageColumn}>
            {collimation ? (
              <CollimationImage
                field={fieldFrom(live)}
                size={imageSize}
                label={`${payload.phantomLabel}: campo de ${fieldText(fieldFrom(values))}`}
              />
            ) : (
              <ExposureImage
                input={studentExposure}
                size={imageSize}
                label={`${payload.phantomLabel}: ${studentExposure.kv} kV e ${studentExposure.mas} mAs`}
              />
            )}
            <Text style={styles.caption}>{referenceExposure ? 'Sua imagem' : payload.phantomLabel}</Text>
          </View>
        </View>
        {referenceExposure ? <Text style={styles.caption}>{payload.phantomLabel}</Text> : null}
        {/* O texto segue o valor do passo, como o rótulo do controle; só a máscara acompanha o dedo. */}
        {collimation ? <CollimationReadout field={fieldFrom(values)} /> : null}
      </View>

      {explanation ? (
        <View style={styles.explanation}>
          <View accessible={false} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
            <PixelIllustration state="happy" size="sm" />
          </View>
          <Text style={styles.explanationText}>{explanation}</Text>
        </View>
      ) : null}

      <View style={styles.controls}>
        {controls.map((control) => (
          <BenchControlRow
            key={control.id}
            control={control}
            value={values[control.id]}
            disabled={submitted}
            onPreview={(raw) =>
              setPreview((current) => {
                const next = { ...current };
                if (raw === null) delete next[control.id];
                else next[control.id] = raw;
                return next;
              })
            }
            onChange={(next) => onChange(encodeBenchValue({ ...values, [control.id]: next }))}
          />
        ))}
      </View>
    </View>
  );
}

/**
 * A bancada: o fantoma simulado, uma linha de controle por parâmetro e, no
 * modo `challenge` com alvo `match`, a imagem de referência ao lado. A imagem
 * sai do `simulator`: na colimação, o fantoma com a máscara do campo, e a área e
 * o produto dose-área em texto.
 *
 * Não guarda a resposta: `value` chega de fora (o JSON dos controles) e
 * `onChange` o devolve. O único estado local é o valor bruto do arrasto, que
 * só a imagem lê.
 */
export function BenchStepRenderer({
  interaction,
  value,
  onChange,
  submitted = false,
}: InteractionRendererProps): React.ReactElement {
  if (interaction.type !== 'bench') {
    return <View />;
  }

  return (
    <BenchScreen
      interactionId={interaction.id}
      payload={(interaction as Extract<LearningInteractionV2, { type: 'bench' }>).payload}
      value={value}
      onChange={onChange}
      submitted={submitted}
      explanation={interaction.payload.mode === 'explore' && !submitted
        && isCorrectInteractionValue(interaction, value) ? interaction.feedback.correct : undefined}
    />
  );
}

const galaxy = semanticColors.galaxy;

const styles = StyleSheet.create({
  activity: { gap: space.s3 },
  prompt: { ...typography.h3, color: galaxyColors.textPrimary },
  stage: { gap: space.s1, alignItems: 'center' },
  images: { flexDirection: 'row', justifyContent: 'center', gap: space.s3 },
  imageColumn: { alignItems: 'center', gap: space.s1 },
  caption: { ...typography.caption, color: galaxy.textSecondary },
  explanation: { gap: space.s2, alignItems: 'flex-start' },
  explanationText: { ...typography.bodyRegular, color: galaxy.textPrimary },
  controls: {
    gap: space.s3,
    padding: space.s3,
    borderRadius: radius.rLg,
    borderWidth: 1,
    borderColor: galaxy.border,
    backgroundColor: galaxyColors.surface,
  },
});
