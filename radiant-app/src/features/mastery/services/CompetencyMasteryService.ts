/**
 * CompetencyMasteryService
 *
 * `calculateCompetencyMastery` é **determinística e pura**: não lê relógio, não
 * lê storage e não conhece o catálogo. Datas e limiares entram por parâmetro.
 * Isso não é purismo — é o que torna uma regra pedagógica auditável: sem relógio
 * interno, o mesmo conjunto de evidências sempre produz o mesmo estado, e
 * discordar do resultado vira discutir os limiares, não caçar não-determinismo.
 *
 * Ordem de aplicação, e ela importa:
 *
 * 1. filtra a evidência da competência (e descarta a legada, salvo pedido);
 * 2. pontua os **tipos distintos** com ao menos um acerto;
 * 3. traduz pontuação em estado pelos limiares;
 * 4. aplica os bloqueios, que só puxam para baixo, nunca para cima.
 *
 * Bloqueio nunca promove. Um estado alto só se alcança acumulando evidência de
 * tipos diferentes; os gates existem para impedir que atividade recente vire
 * domínio declarado.
 */

import type { AuthoredEvidenceKind } from '../../../types/learningActivity';
import type { LearningEvidence } from '../../../types/learningEvidence';
import type {
    CompetencyMastery,
    MasteryBlocker,
    MasteryParams,
    MasteryState,
} from '../../../types/mastery';
import { MASTERY_ORDER } from '../../../types/mastery';

const DAY_IN_MS = 24 * 60 * 60 * 1000;

/**
 * Soma de ponto flutuante com casas fixas. Sem isto, `0.15 + 0.3 + 0.25` sai
 * `0.6999999999999999` e o limiar de `0.7` reprova um percurso que o deveria
 * aprovar — um defeito que apareceria como "às vezes não sobe de nível".
 */
function round(value: number): number {
    return Math.round(value * 1000) / 1000;
}

function rank(state: MasteryState): number {
    return MASTERY_ORDER.indexOf(state);
}

function demoteOne(state: MasteryState): MasteryState {
    // Piso em `introduced`: uma vez que existe evidência, nenhum erro apaga o
    // fato de a competência ter sido apresentada.
    return MASTERY_ORDER[Math.max(1, rank(state) - 1)];
}

function capAt(state: MasteryState, ceiling: MasteryState): MasteryState {
    return rank(state) > rank(ceiling) ? ceiling : state;
}

function isRecent(recordedAt: string, now: string, windowDays: number): boolean {
    const recorded = Date.parse(recordedAt);
    const reference = Date.parse(now);

    if (Number.isNaN(recorded) || Number.isNaN(reference)) {
        return false;
    }

    return reference - recorded <= windowDays * DAY_IN_MS;
}

export function calculateCompetencyMastery(
    competencyId: string,
    evidence: LearningEvidence[],
    params: MasteryParams,
): CompetencyMastery {
    const relevant = evidence.filter((entry) => (
        entry.competencyId === competencyId
        && (params.includeLegacyEvidence || entry.evidenceKind !== 'legacy-lesson-recall')
    ));

    const empty: CompetencyMastery = {
        competencyId,
        state: 'not-started',
        score: 0,
        evidenceCount: 0,
        blockedBy: [],
        evaluatedAt: params.now,
    };

    if (relevant.length === 0) {
        return empty;
    }

    const correctKinds = new Set(
        relevant.filter((entry) => entry.outcome === 'correct').map((entry) => entry.evidenceKind),
    );

    // Tipos distintos, não tentativas: repetir a mesma prática dez vezes não é
    // mais evidência de domínio que fazê-la uma vez — evidência nova vem de
    // mudar o tipo de demanda, não de repetir a mesma.
    const score = round(
        [...correctKinds].reduce(
            (total, kind) => total + (params.weights[kind as AuthoredEvidenceKind] ?? 0),
            0,
        ),
    );

    const hasRetention = correctKinds.has('delayed-retention');
    const hasRecentError = relevant.some((entry) => (
        entry.outcome === 'incorrect' && isRecent(entry.recordedAt, params.now, params.recentErrorWindowDays)
    ));

    let state: MasteryState = score >= params.thresholds.mastered
        ? 'mastered'
        : score >= params.thresholds.retained
            ? 'retained'
            : score >= params.thresholds.practicing
                ? 'practicing'
                : 'introduced';

    const blockedBy: MasteryBlocker[] = [];

    // Sem recuperação após intervalo não há retenção — e sem retenção, o que se
    // mediu foi desempenho na sessão, não aprendizagem. Este é o bloqueio que a
    // spec chama de primário.
    if (!hasRetention && rank(state) > rank('practicing')) {
        state = capAt(state, 'practicing');
        blockedBy.push('missing-retention');
    }

    if (hasRecentError) {
        if (params.criticalSafety) {
            state = capAt(state, 'practicing');
            blockedBy.push('critical-safety-error');
        } else {
            state = demoteOne(state);
            blockedBy.push('recent-error');
        }
    }

    return {
        competencyId,
        state,
        score,
        evidenceCount: relevant.length,
        blockedBy,
        evaluatedAt: params.now,
    };
}
