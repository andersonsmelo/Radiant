import React from 'react';
import { PixelIllustration } from '../../../ui/characters/PixelIllustration';

type Moment = 'streak' | 'summary';

const MOMENTS = {
  streak: { size: 'sm', expression: 'feliz', accessibilityLabel: 'Pixel comemorando a sequência' },
  summary: { size: 'md', expression: 'orgulhoso', accessibilityLabel: 'Pixel comemorando o fim da lição' },
} as const;

/**
 * O Pixel da lição híbrida nos dois momentos da spec §5.2: sequência de acertos
 * e fim de lição. Com Reduce Motion aparece parado. Mora fora da tela pela
 * regra R5 do visual QA, como no quiz legado (`QuizFeedback`, `LessonSummary`):
 * o personagem fica em componente de arquétipo, não na tela que o usa.
 */
export function HybridLessonCharacter({ moment, reduceMotion }: Readonly<{ moment: Moment; reduceMotion: boolean }>) {
  const spec = MOMENTS[moment];
  return <PixelIllustration size={spec.size} state={reduceMotion ? 'happy' : 'celebrate'} expression={spec.expression} accessibilityLabel={spec.accessibilityLabel} />;
}
