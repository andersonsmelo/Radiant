import React from 'react';
import { processColor } from 'react-native';
import { render } from '@testing-library/react-native';
import { MissionIcon, missionKind } from './MissionIcons';
import { medalColors, medalGlyphTones } from '../theme';
import type { MissionId } from '../../features/missions/services/DailyMissionsService';

const json = (view: { toJSON: () => unknown }) => JSON.stringify(view.toJSON());
const hasColor = (view: { toJSON: () => unknown }, hex: string) => json(view).includes(`"payload":${Number(processColor(hex))}`);
const paths = (view: { toJSON: () => unknown }) => [...json(view).matchAll(/"d":"([^"]+)"/gu)].map(match => match[1]);

describe('MissionIcon', () => {
  it('em andamento desenha nos três tons do azul da unidade e em nenhum do ouro', () => {
    const view = render(<MissionIcon kind="aulas" done={false} />);
    for (const hex of [medalColors.unit.face, medalColors.unit.lip, medalGlyphTones.light]) expect(hasColor(view, hex)).toBe(true);
    for (const hex of [medalColors.gold.face, medalColors.gold.lip]) expect(hasColor(view, hex)).toBe(false);
  });

  it('concluída desenha em ouro e em nenhum tom do azul', () => {
    const view = render(<MissionIcon kind="aulas" done />);
    for (const hex of [medalColors.gold.face, medalColors.gold.lip, medalGlyphTones.light]) expect(hasColor(view, hex)).toBe(true);
    for (const hex of [medalColors.unit.face, medalColors.unit.lip]) expect(hasColor(view, hex)).toBe(false);
  });

  it('cada tipo tem um glifo próprio, e concluída troca o glifo pela marca de feito (sempre dentro do viewBox de 48)', () => {
    const glyph = (kind: 'aulas' | 'acertos' | 'meta', done: boolean) => paths(render(<MissionIcon kind={kind} done={done} />)).join('|');
    const open = (['aulas', 'acertos', 'meta'] as const).map(kind => glyph(kind, false));
    expect(new Set(open).size).toBe(3);
    const done = (['aulas', 'acertos', 'meta'] as const).map(kind => glyph(kind, true));
    expect(new Set(done).size).toBe(1);
    for (const kind of ['aulas', 'acertos', 'meta'] as const) expect(done[0]).not.toBe(glyph(kind, false));
    for (const d of [...open, ...done]) for (const n of d.match(/-?\d+(\.\d+)?/gu) ?? []) {
      expect(Number(n)).toBeGreaterThanOrEqual(0);
      expect(Number(n)).toBeLessThanOrEqual(48);
    }
  });

  it('é decorativa: escondida do leitor de tela', () => {
    const props = (render(<MissionIcon kind="meta" done={false} />).toJSON() as { props: Record<string, unknown> }).props;
    expect(props.accessibilityElementsHidden).toBe(true);
    expect(props.importantForAccessibility).toBe('no-hide-descendants');
  });
});

describe('missionKind', () => {
  it('mapeia cada identificador de missão e cai em meta para o desconhecido', () => {
    const expected: Record<MissionId, string> = { 'aula-1': 'aulas', 'aula-2': 'aulas', revisao: 'aulas', 'seguidas-5': 'acertos', 'acertos-10': 'acertos', meta: 'meta' };
    for (const [id, kind] of Object.entries(expected)) expect(missionKind(id)).toBe(kind);
    expect(missionKind('desconhecida')).toBe('meta');
  });
});
