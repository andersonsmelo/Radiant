import { semanticColors, semanticColorTokenNames } from '../semantic-colors';

const requiredTokens = [
  'surface',
  'surfaceElevated',
  'surfaceInverted',
  'textPrimary',
  'textSecondary',
  'textTertiary',
  'textOnAccent',
  'textCritical',
  'border',
  'borderFocus',
  'borderDisabled',
  'actionPrimary',
  'actionPrimaryPressed',
  'statusSuccess',
  'statusWarning',
  'statusError',
  'statusInformation',
  'reward',
] as const;

function contrastRatio(foreground: string, background: string) {
  const relativeLuminance = (hex: string) => {
    const channels = hex.slice(1).match(/.{2}/g)?.map((channel) => Number.parseInt(channel, 16) / 255);
    if (!channels || channels.length !== 3) throw new Error(`Expected a six-digit hex color, received ${hex}`);

    const [red, green, blue] = channels.map((channel) => (
      channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4
    ));

    return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
  };

  const [lighter, darker] = [relativeLuminance(foreground), relativeLuminance(background)].sort((a, b) => b - a);
  return (lighter + 0.05) / (darker + 0.05);
}

describe('semantic color contracts', () => {
  it.each(['light', 'galaxy'] as const)('keeps the %s context complete and defined', (context) => {
    expect(semanticColorTokenNames).toEqual(requiredTokens);
    expect(Object.keys(semanticColors[context])).toEqual(requiredTokens);
    expect(Object.values(semanticColors[context]).every((color) => Boolean(color))).toBe(true);
  });

  it.each([
    ['light body text', semanticColors.light.textPrimary, semanticColors.light.surface],
    ['light primary CTA', semanticColors.light.textOnAccent, semanticColors.light.actionPrimary],
    ['light critical text', semanticColors.light.textCritical, semanticColors.light.surface],
    ['galaxy body text', semanticColors.galaxy.textPrimary, semanticColors.galaxy.surface],
    ['galaxy primary CTA', semanticColors.galaxy.textOnAccent, semanticColors.galaxy.actionPrimary],
    ['galaxy critical text', semanticColors.galaxy.textCritical, semanticColors.galaxy.surface],
  ])('keeps %s at AA text contrast or higher', (_label, foreground, background) => {
    expect(contrastRatio(foreground, background)).toBeGreaterThanOrEqual(4.5);
  });
});
