import fs from 'node:fs';
import path from 'node:path';
import type { LessonCastId } from '../../../types/learningActivity';
import { castExpressionFor } from './castExpressionFor';
import { CAST_EXPRESSIONS } from './castExpressions';

type Line = { speaker: LessonCastId; text: string };

/** Todas as falas das aulas publicadas da trilha rtg-2026. */
function publishedLines(): Line[] {
    const dir = path.resolve(__dirname, '../../../../../content-manifest/rtg-2026/aulas');
    const lines: Line[] = [];
    const walk = (node: unknown): void => {
        if (Array.isArray(node)) { node.forEach(walk); return; }
        if (!node || typeof node !== 'object') return;
        const record = node as Record<string, unknown>;
        if (Array.isArray(record.lines) && (record.lines[0] as Line | undefined)?.speaker) lines.push(...(record.lines as Line[]));
        Object.values(record).forEach(walk);
    };
    for (const file of fs.readdirSync(dir).filter((name) => name.endsWith('.json'))) walk(JSON.parse(fs.readFileSync(path.join(dir, file), 'utf8')));
    return lines;
}

describe('castExpressionFor', () => {
    it('fala comum é neutra; pergunta é pensativa; o paciente que pergunta fica preocupado', () => {
        expect(castExpressionFor({ kind: 'fala', speaker: 'lia', text: 'Confira o pedido antes de posicionar.' })).toBe('neutro');
        expect(castExpressionFor({ kind: 'fala', speaker: 'duda', text: 'Então quanto mais, melhor?' })).toBe('pensativo');
        expect(castExpressionFor({ kind: 'fala', speaker: 'pixel', text: 'O que muda de um para o outro?' })).toBe('pensativo');
        expect(castExpressionFor({ kind: 'fala', speaker: 'paciente', text: 'Tem problema fazer o raio X hoje?' })).toBe('preocupado');
    });

    it('a pergunta conta mesmo com aspas ou parêntese depois, e a interrogação no meio não conta', () => {
        expect(castExpressionFor({ kind: 'fala', speaker: 'caio', text: 'Ela perguntou: “dói?”' })).toBe('pensativo');
        expect(castExpressionFor({ kind: 'fala', speaker: 'caio', text: 'Dói? Não. Só fica parado.' })).toBe('neutro');
    });

    it('retorno de acerto é feliz, e comemora só o acerto que fecha um marco', () => {
        expect(castExpressionFor({ kind: 'retorno', correct: true })).toBe('feliz');
        expect(castExpressionFor({ kind: 'retorno', correct: true, celebrate: true })).toBe('comemorando');
    });

    it('retorno de erro é preocupado e acolhedor, mesmo num marco: o erro nunca comemora nem reprova', () => {
        expect(castExpressionFor({ kind: 'retorno', correct: false })).toBe('preocupado');
        expect(castExpressionFor({ kind: 'retorno', correct: false, celebrate: true })).toBe('preocupado');
    });

    it('nas 132 cenas publicadas, toda fala ganha uma expressão do conjunto, e ninguém do elenco fixo fica preocupado numa fala', () => {
        const lines = publishedLines();
        expect(lines.length).toBeGreaterThan(400);
        const bySpeaker = new Map<string, Map<string, number>>();
        for (const line of lines) {
            const expression = castExpressionFor({ kind: 'fala', speaker: line.speaker, text: line.text });
            expect(CAST_EXPRESSIONS).toContain(expression);
            const counts = bySpeaker.get(line.speaker) ?? new Map<string, number>();
            counts.set(expression, (counts.get(expression) ?? 0) + 1);
            bySpeaker.set(line.speaker, counts);
        }
        for (const speaker of ['pixel', 'lia', 'caio', 'duda'] as const) {
            expect(bySpeaker.get(speaker)?.get('preocupado') ?? 0).toBe(0);
            // A cena não vira um coro de dúvidas: cada um afirma mais do que pergunta, ou quase.
            expect(bySpeaker.get(speaker)?.get('neutro') ?? 0).toBeGreaterThan(0);
        }
        expect(bySpeaker.get('paciente')?.get('pensativo') ?? 0).toBe(0);
    });
});
