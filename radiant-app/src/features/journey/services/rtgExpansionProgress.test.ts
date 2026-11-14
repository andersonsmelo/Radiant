import type { LearningTrack } from '../../content/content.types';
import { ProductionCurriculumCatalog } from '../../student-checkpoints/ProductionCurriculumCatalog';
import { resolveActiveTrackId, resolveTrackAccess } from './JourneyTrackUnlockService';

/**
 * Aluno com progresso da 1.5.0 diante da trilha ampliada da 1.6 (frente F1).
 *
 * A 1.6 insere m15 depois de M03 e m16 depois de M09, e acrescenta s-od e s-us
 * no fim. Cada unidade é uma trilha; a regra de acesso de 2026-11-13 mantém
 * aberta toda trilha concluída ou iniciada e toda trilha antes da iniciada mais
 * adiante, e conta a trilha ativa a partir dela (mapa da expansão, seção 3, e
 * `docs/evidence/2026-11-13-rtg-2026-expansao/motor.md`).
 */

const track = (unit: string) => `track:rtg-2026:${unit}`;

/** As 20 trilhas publicadas na 1.5.0, na ordem em que estavam (medido em 2026-11-13). */
const LEGACY_1_5_0 = [
    'm01', 'm02', 'm03', 'm04', 'm05', 'm06', 'm07', 'm08', 'm09', 'm10', 'm11', 'm12', 'm13', 'm14',
    's-tc', 's-rm', 's-md', 's-mn', 's-rt', 's-ir',
].map(track);

/**
 * Pela regra sequencial da 1.5.0, o aluno só alcançou dois tipos de estado: as
 * k primeiras trilhas concluídas e nada mais (parado na fronteira), ou as k
 * primeiras concluídas e a trilha k iniciada (no meio dela). Devolve, por
 * população, o que piorou para ele no catálogo novo.
 */
function legacyProgressRegressions(tracks: readonly LearningTrack[], insertedBefore: ReadonlySet<string>): string[] {
    const byId = new Map(tracks.map(entry => [entry.id, entry]));
    const missing = LEGACY_1_5_0.filter(id => !byId.has(id));
    if (missing.length) return missing.map(id => `trilha da 1.5.0 sumiu: ${id}`);
    const legacyTracks = LEGACY_1_5_0.map(id => byId.get(id)!);
    const problems: string[] = [];

    for (let done = 0; done <= LEGACY_1_5_0.length; done += 1) {
        const completed = new Set(LEGACY_1_5_0.slice(0, done));
        const populations = [
            { label: `concluídas ${done}`, started: new Set(completed) },
            ...(done < LEGACY_1_5_0.length
                ? [{ label: `concluídas ${done} e no meio de ${LEGACY_1_5_0[done]}`, started: new Set([...completed, LEGACY_1_5_0[done]]) }]
                : []),
        ];
        for (const { label, started } of populations) {
            const after = new Map(resolveTrackAccess([...tracks], completed, started).map(entry => [entry.trackId, entry]));
            for (const id of LEGACY_1_5_0) {
                if (!after.get(id)!.unlocked && (completed.has(id) || started.has(id))) problems.push(`${label}: ${id} fechou com progresso`);
            }
            const activeBefore = resolveActiveTrackId(legacyTracks, completed);
            const activeAfter = resolveActiveTrackId([...tracks], completed, started);
            const atBoundary = started.size === completed.size;
            // Parado na fronteira de uma inserção: a unidade nova é de fato a próxima
            // na ordem pedagógica, e nada que ele fez fecha. No resto, a ativa não muda.
            const nextIsInserted = atBoundary && done < LEGACY_1_5_0.length && insertedBefore.has(LEGACY_1_5_0[done]);
            const finishedAll = done === LEGACY_1_5_0.length;
            if (!nextIsInserted && !finishedAll && activeAfter !== activeBefore) {
                problems.push(`${label}: trilha ativa ${activeAfter}, esperada ${activeBefore}`);
            }
            if (finishedAll && LEGACY_1_5_0.includes(activeAfter ?? '') && activeAfter !== activeBefore) {
                problems.push(`${label}: trilha ativa ${activeAfter}, esperada ${activeBefore} ou uma unidade nova`);
            }
        }
    }
    return problems;
}

describe('trilha ampliada da 1.6 e o progresso da 1.5.0', () => {
    const tracks = ProductionCurriculumCatalog.listTracks();
    const ids = tracks.map(entry => entry.id);
    /** Trilhas da 1.5.0 que passaram a ter uma unidade nova logo antes. */
    const insertedBefore = new Set(LEGACY_1_5_0.filter(id => !LEGACY_1_5_0.includes(ids[ids.indexOf(id) - 1] ?? id)));

    it('m15 vem depois de M03, m16 depois de M09, e s-od e s-us no fim', () => {
        expect(ids).toEqual(['m01', 'm02', 'm03', 'm15', 'm04', 'm05', 'm06', 'm07', 'm08', 'm09', 'm16', 'm10', 'm11', 'm12', 'm13', 'm14',
            's-tc', 's-rm', 's-md', 's-mn', 's-rt', 's-ir', 's-od', 's-us'].map(track));
        expect([...insertedBefore]).toEqual([track('m04'), track('m10')]);
    });

    it('nenhum aluno da 1.5.0 perde acesso ao que fez nem é levado de volta pela Home', () => {
        expect(legacyProgressRegressions(tracks, insertedBefore)).toEqual([]);
    });

    it('quem está adiante vê a unidade inserida aberta, sem ela virar a ativa', () => {
        const completed = new Set(LEGACY_1_5_0.slice(0, 6));
        const started = new Set([...completed, track('m07')]);
        const access = new Map(resolveTrackAccess([...tracks], completed, started).map(entry => [entry.trackId, entry.unlocked]));
        expect(access.get(track('m15'))).toBe(true);
        expect(access.get(track('m16'))).toBe(false);
        expect(resolveActiveTrackId([...tracks], completed, started)).toBe(track('m07'));
    });

    it('o aluno novo percorre na ordem da ementa e só abre N com N−1 concluída', () => {
        const walked: string[] = [];
        const completed = new Set<string>();
        for (let step = 0; step < tracks.length; step += 1) {
            const access = resolveTrackAccess([...tracks], completed, completed);
            const active = resolveActiveTrackId([...tracks], completed, completed)!;
            expect(access.filter(entry => entry.unlocked && !entry.completed).map(entry => entry.trackId)).toEqual([active]);
            walked.push(active);
            completed.add(active);
        }
        expect(walked).toEqual(ids);
    });

});
