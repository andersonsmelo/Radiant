import React from 'react';
import { processColor } from 'react-native';
import { render } from '@testing-library/react-native';
import { CheckIcon, CloseIcon, VerdictIcon } from './VerdictIcons';
import { feedbackColors, galaxyColors } from '../theme';

// O SVG não é rasterizado em jest, e a cor chega à árvore já processada.
const HIDDEN = { includeHiddenElements: true };
const json = (view: { toJSON: () => unknown }) => JSON.stringify(view.toJSON());
const hasColor = (view: { toJSON: () => unknown }, hex: string) => json(view).includes(`"payload":${Number(processColor(hex))}`);
const svgProps = (view: { toJSON: () => unknown }) => (view.toJSON() as { props: Record<string, unknown> }).props;

describe('VerdictIcon', () => {
  it('acerto desenha nos três tons de acerto e em nenhum de erro', () => {
    const view = render(<VerdictIcon verdict="correct" />);
    for (const hex of [feedbackColors.success.fill, feedbackColors.success.lip, feedbackColors.success.onFill]) expect(hasColor(view, hex)).toBe(true);
    for (const hex of [feedbackColors.error.fill, feedbackColors.error.lip, feedbackColors.error.onFill]) expect(hasColor(view, hex)).toBe(false);
  });

  it('erro desenha nos três tons de erro e em nenhum de acerto', () => {
    const view = render(<VerdictIcon verdict="incorrect" />);
    for (const hex of [feedbackColors.error.fill, feedbackColors.error.lip, feedbackColors.error.onFill]) expect(hasColor(view, hex)).toBe(true);
    for (const hex of [feedbackColors.success.fill, feedbackColors.success.lip, feedbackColors.success.onFill]) expect(hasColor(view, hex)).toBe(false);
  });

  it('o acerto e o erro têm marcas diferentes e cada uma cabe no viewBox de 24', () => {
    const marks = (verdict: 'correct' | 'incorrect') => {
      const d = /"d":"([^"]+)"/u.exec(json(render(<VerdictIcon verdict={verdict} />)))?.[1] ?? '';
      return d;
    };
    expect(marks('correct')).not.toBe(marks('incorrect'));
    for (const d of [marks('correct'), marks('incorrect')]) {
      const numbers = (d.match(/\d+(\.\d+)?/gu) ?? []).map(Number);
      expect(numbers.length).toBeGreaterThan(0);
      for (const n of numbers) { expect(n).toBeGreaterThanOrEqual(0); expect(n).toBeLessThanOrEqual(24); }
    }
  });

  it('mede 24 por padrão e aceita outro tamanho', () => {
    expect(svgProps(render(<VerdictIcon verdict="correct" />)).width).toBe(24);
    expect(svgProps(render(<VerdictIcon verdict="correct" size={16} />)).width).toBe(16);
  });

  it('é decorativo: fica fora da árvore de acessibilidade', () => {
    const props = svgProps(render(<VerdictIcon verdict="correct" />));
    expect(props.accessible).toBe(false);
    expect(props.importantForAccessibility).toBe('no-hide-descendants');
    expect(props.accessibilityElementsHidden).toBe(true);
  });

  it('o testID pedido aparece na árvore', () => {
    expect(render(<VerdictIcon verdict="correct" testID="v" />).getByTestId('v', HIDDEN)).toBeTruthy();
  });
});

describe.each([['CloseIcon', CloseIcon], ['CheckIcon', CheckIcon]] as const)('%s', (_name, Icon) => {
  it('mede 18 por padrão, usa a cor pedida e é decorativo', () => {
    const view = render(<Icon color={galaxyColors.textPrimary} />);
    expect(svgProps(view).width).toBe(18);
    expect(hasColor(view, galaxyColors.textPrimary)).toBe(true);
    expect(svgProps(view).accessible).toBe(false);
  });
});
