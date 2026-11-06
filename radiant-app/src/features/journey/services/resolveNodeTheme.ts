import type { JourneyNode, JourneyUnit } from '../../../types/journey';
import {
    ILLUSTRATION_THEMES,
    type IllustrationTheme,
} from '../../../ui/illustrations/illustrationPlayback';

const FALLBACK_THEME: IllustrationTheme = 'radiacao';

function isIllustrationTheme(value: unknown): value is IllustrationTheme {
    return (ILLUSTRATION_THEMES as readonly unknown[]).includes(value);
}

/**
 * Tema da ilustração de uma medalha: o do próprio nó, depois o da unidade e,
 * por fim, `radiacao`. `unit.theme` é texto livre no catálogo, então só vale
 * se for um dos temas que existem.
 */
export function resolveNodeTheme(
    node: Pick<JourneyNode, 'theme'>,
    unit?: Pick<JourneyUnit, 'theme'>,
): IllustrationTheme {
    if (isIllustrationTheme(node.theme)) return node.theme;
    if (isIllustrationTheme(unit?.theme)) return unit.theme;
    return FALLBACK_THEME;
}
