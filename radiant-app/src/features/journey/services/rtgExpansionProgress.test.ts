import type { LearningTrack } from '../../content/content.types';
import { ProductionCurriculumCatalog } from '../../student-checkpoints/ProductionCurriculumCatalog';
import { resolveActiveTrackId, resolveTrackAccess } from './JourneyTrackUnlockService';

/**
 * Aluno com progresso da 1.5.0 diante da trilha ampliada da 1.6 (frente F1).
 *
 * Decisão no mapa `docs/plans/2026-11-13-rtg-2026-expansao-pela-ementa.md`,
 * seção 3: cada unidade é uma trilha, e a trilha N só abre com a N−1 concluída.
 * Uma unidade nova no meio fecharia trilhas já concluídas e puxaria a Home de
 * volta; por isso as novas entram no fim. Este teste prova que nenhum aluno da
 * 1.5.0 muda de acesso nem de trilha ativa, exceto quem concluiu tudo, que
 * passa para a primeira unidade nova.
 */

/** As 20 trilhas publicadas na 1.5.0, na ordem em que estavam (medido em 2026-11-13). */
const LEGACY_1_5_0 = [
    'm01', 'm02', 'm03', 'm04', 'm05', 'm06', 'm07', 'm08', 'm09', 'm10', 'm11', 'm12', 'm13', 'm14',
    's-tc', 's-rm', 's-md', 's-mn', 's-rt', 's-ir',
].map(unit => `track:rtg-2026:${unit}`);

/**
 * Pela regra sequencial, o aluno só alcança conjuntos de trilhas concluídas que
 * são prefixos da ordem; cada prefixo da 1.5.0 é uma população. Devolve, por
 * população, o que mudou no acesso às trilhas antigas e na trilha ativa.
 */
function legacyProgressRegressions(tracks: readonly LearningTrack[]): string[] {
    const byId = new Map(tracks.map(track => [track.id, track]));
    const missing = LEGACY_1_5_0.filter(id => !byId.has(id));
    if (missing.length) return missing.map(id => `trilha da 1.5.0 sumiu: ${id}`);
    const legacyTracks = LEGACY_1_5_0.map(id => byId.get(id)!);
    const firstNew = tracks.find(track => !LEGACY_1_5_0.includes(track.id))?.id ?? null;
    const problems: string[] = [];
    for (let done = 0; done <= LEGACY_1_5_0.length; done += 1) {
        const completed = new Set(LEGACY_1_5_0.slice(0, done));
        const before = new Map(resolveTrackAccess(legacyTracks, completed).map(entry => [entry.trackId, entry]));
        const after = new Map(resolveTrackAccess([...tracks], completed).map(entry => [entry.trackId, entry]));
        for (const id of LEGACY_1_5_0) {
            if (before.get(id)!.unlocked !== after.get(id)!.unlocked) {
                problems.push(`concluídas ${done}: ${id} ${before.get(id)!.unlocked ? 'fechou' : 'abriu'}`);
            }
        }
        const activeBefore = resolveActiveTrackId(legacyTracks, completed);
        const activeAfter = resolveActiveTrackId([...tracks], completed);
        const expected = done === LEGACY_1_5_0.length && firstNew ? firstNew : activeBefore;
        if (activeAfter !== expected) problems.push(`concluídas ${done}: trilha ativa ${activeAfter}, esperada ${expected}`);
    }
    return problems;
}

describe('trilha ampliada da 1.6 e o progresso da 1.5.0', () => {
    const tracks = ProductionCurriculumCatalog.listTracks();

    it('as unidades novas vêm depois das 20 da 1.5.0, que mantêm a ordem', () => {
        const ids = tracks.map(track => track.id);
        expect(ids.slice(0, LEGACY_1_5_0.length)).toEqual(LEGACY_1_5_0);
        expect(ids.length).toBeGreaterThanOrEqual(LEGACY_1_5_0.length);
    });

    it('nenhum aluno da 1.5.0 perde acesso nem é levado de volta pela Home', () => {
        expect(legacyProgressRegressions(tracks)).toEqual([]);
    });

    it('a conferência acusa uma unidade nova inserida no meio do núcleo', () => {
        // Guarda vista falhando com o defeito que ela nomeia: a mesma unidade nova,
        // posta entre M03 e M04, fecha M04 para quem já a concluiu e puxa a Home.
        const extra: LearningTrack = { ...tracks[0], id: 'track:rtg-2026:inserida', lessonIds: [] };
        const inserted = [...tracks.slice(0, 3), extra, ...tracks.slice(3)];
        const problems = legacyProgressRegressions(inserted);
        expect(problems).toContain('concluídas 4: track:rtg-2026:m04 fechou');
        expect(problems).toContain('concluídas 5: trilha ativa track:rtg-2026:inserida, esperada track:rtg-2026:m06');
    });
});
