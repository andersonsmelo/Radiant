import fs from 'fs';
import path from 'path';
import { DECORATIONS } from './catalog';
import { galaxyColors, medalColors } from '../../ui/theme';

describe('catálogo de decorações', () => {
  it('pequeno e completo: 11 itens, nos três encaixes, ids únicos', () => {
    expect(DECORATIONS).toHaveLength(11);
    expect(new Set(DECORATIONS.map(d => d.id)).size).toBe(11);
    for (const slot of ['moldura', 'selo', 'cartao']) expect(DECORATIONS.some(d => d.slot === slot)).toBe(true);
  });

  it('exatamente três exclusivos de assinante, um por encaixe', () => {
    const exclusive = DECORATIONS.filter(d => d.rule.kind === 'assinante');
    expect(exclusive.map(d => d.slot).sort()).toEqual(['cartao', 'moldura', 'selo']);
  });

  it('toda cor vem de um token do tema, sem asset binário', () => {
    const tokens = new Set<string>([...Object.values(galaxyColors), ...Object.values(medalColors).flatMap(tone => Object.values(tone))]
      .filter(value => typeof value === 'string').map(String));
    for (const decoration of DECORATIONS) {
      for (const color of Object.values(decoration.art).filter(v => typeof v === 'string' && v.startsWith('#'))) {
        expect({ id: decoration.id, color, token: tokens.has(color as string) }).toMatchObject({ token: true });
      }
    }
    const source = fs.readFileSync(path.join(__dirname, 'catalog.ts'), 'utf8');
    expect(source).not.toMatch(/require\(|\.png|\.riv|\.json/);
  });

  it('nenhum nome ou regra promete habilitação ou cita especialista', () => {
    for (const d of DECORATIONS) expect(`${d.name} ${d.description}`).not.toMatch(/especialista|certifica|habilita/i);
  });
});
