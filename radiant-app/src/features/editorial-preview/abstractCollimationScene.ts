import { collimationModel, DETECTOR_WIDTH_CM, DETECTOR_HEIGHT_CM } from '../bench/collimationModel';

/** Artificial geometry for the approved pilot only; never a positioning or patient-dose model. */
export function abstractCollimationScene(fieldWidth: number) {
    if (!Number.isFinite(fieldWidth)) throw Error('invalid-abstract-field');
    const model = collimationModel({ fieldWidth, fieldHeight: DETECTOR_HEIGHT_CM });
    const detectorWidth = DETECTOR_WIDTH_CM * 10;
    const detectorHeight = DETECTOR_HEIGHT_CM * 10;
    const targetWidth = 18 * 10;
    const width = model.fieldWidth * 10;
    const covered = width >= targetWidth;
    const marginPercent = Math.round(Math.max(0, (width - targetWidth) / width) * 100);
    const description = !covered ? 'Parte do alvo está fora do campo, nas duas bordas laterais.'
        : width === targetWidth ? 'O alvo está inteiro no campo. As bordas laterais coincidem.'
            : `O alvo está inteiro no campo. As margens laterais juntas ocupam cerca de ${marginPercent}% da largura do campo.`;
    return {
        detector: { width: detectorWidth, height: detectorHeight },
        field: { x: (detectorWidth - width) / 2, y: 0, width, height: detectorHeight },
        target: { x: (detectorWidth - targetWidth) / 2, y: detectorHeight * 0.2, width: targetWidth, height: detectorHeight * 0.6 },
        covered, description, relativeFieldArea: model.fieldFraction.width * model.fieldFraction.height,
    };
}
