import AsyncStorage from '@react-native-async-storage/async-storage';
import type { LearningEvidence } from '../../../types/learningEvidence';
import { validateLearningEvidence } from '../../../types/learningEvidence';
import {
    LEARNING_EVIDENCE_CAP,
    LearningEvidenceRepository,
} from './LearningEvidenceRepository';

jest.mock('@react-native-async-storage/async-storage', () => ({
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
}));

const storage = AsyncStorage as jest.Mocked<typeof AsyncStorage>;

function evidence(overrides: Partial<LearningEvidence> = {}): LearningEvidence {
    return {
        activityId: 'activity:legacy:block:lesson-1:intro',
        interactionId: 'lesson-1-question',
        competencyId: 'competency:legacy:lesson-1',
        evidenceKind: 'legacy-lesson-recall',
        outcome: 'correct',
        hintUsed: false,
        durationBand: 'unknown',
        contentVersion: 'legacy-lesson-catalog',
        recordedAt: '2026-08-02T12:00:00.000Z',
        ...overrides,
    };
}

function rules(value: unknown): string[] {
    return validateLearningEvidence(value).map((issue) => issue.rule);
}

beforeEach(() => {
    jest.clearAllMocks();
    storage.getItem.mockResolvedValue(null);
    storage.setItem.mockResolvedValue(undefined);
});

describe('validateLearningEvidence — contrato permitido', () => {
    it('aceita um registro dentro da allowlist', () => {
        expect(validateLearningEvidence(evidence())).toEqual([]);
    });

    it('recusa qualquer chave fora da allowlist', () => {
        expect(rules({ ...evidence(), respostaLivre: 'o paciente disse que doía' }))
            .toContain('disallowed-field');
    });

    it('recusa registro com campo obrigatório ausente', () => {
        const incompleto = evidence();
        delete (incompleto as Partial<LearningEvidence>).competencyId;

        expect(rules(incompleto)).toContain('required-field');
    });

    it('recusa texto livre nos campos de id, que só aceitam forma de identificador', () => {
        expect(rules(evidence({ interactionId: 'o aluno respondeu que o osso é mais denso' })))
            .toContain('invalid-id');
    });

    it('recusa URI clínica em qualquer valor', () => {
        expect(rules(evidence({ activityId: 'dicom://estudo/1.2.840' }))).toContain('sensitive-value-detected');
        expect(rules(evidence({ contentVersion: 'https://pacs.hospital/estudo' }))).toContain('sensitive-value-detected');
    });

    it('recusa metadado de imagem e marcador de dado clínico', () => {
        expect(rules(evidence({ activityId: 'activity:paciente-4471' }))).toContain('sensitive-value-detected');
        expect(rules(evidence({ competencyId: 'competency:prontuario:x' }))).toContain('sensitive-value-detected');
    });

    it('recusa resultado, faixa de duração e tipo de evidência fora do contrato', () => {
        expect(rules(evidence({ outcome: 'talvez' as never }))).toContain('invalid-outcome');
        expect(rules(evidence({ durationBand: '3 minutos' as never }))).toContain('invalid-duration-band');
        expect(rules(evidence({ evidenceKind: 'achismo' as never }))).toContain('invalid-evidence-kind');
    });

    it('exige que a dica usada seja booleana e o timestamp seja ISO', () => {
        expect(rules(evidence({ hintUsed: 'sim' as never }))).toContain('invalid-hint-flag');
        expect(rules(evidence({ recordedAt: '02/08/2026' }))).toContain('invalid-timestamp');
    });
});

describe('LearningEvidenceRepository', () => {
    it('grava em chave versionada e devolve o que gravou', async () => {
        await LearningEvidenceRepository.append(evidence());

        expect(storage.setItem).toHaveBeenCalledTimes(1);
        const [key, raw] = storage.setItem.mock.calls[0];
        expect(key).toContain('learning_evidence');
        expect(JSON.parse(raw).schemaVersion).toBe('learning-evidence.v1');
        expect(JSON.parse(raw).evidence).toHaveLength(1);
    });

    it('recusa registro inválido sem gravar nada', async () => {
        const rejeitado = await LearningEvidenceRepository.append(
            evidence({ interactionId: 'texto livre do aluno' }),
        );

        expect(rejeitado.accepted).toBe(false);
        expect(rejeitado.issues.map((issue) => issue.rule)).toContain('invalid-id');
        expect(storage.setItem).not.toHaveBeenCalled();
    });

    it('aplica teto de 1.000 registros removendo os mais antigos', async () => {
        const existentes = Array.from({ length: LEARNING_EVIDENCE_CAP }, (_, index) =>
            evidence({ interactionId: `interaction-${index}` }));
        storage.getItem.mockResolvedValue(
            JSON.stringify({ schemaVersion: 'learning-evidence.v1', evidence: existentes }),
        );

        await LearningEvidenceRepository.append(evidence({ interactionId: 'interaction-novo' }));

        const gravado = JSON.parse(storage.setItem.mock.calls[0][1]).evidence as LearningEvidence[];
        expect(gravado).toHaveLength(LEARNING_EVIDENCE_CAP);
        expect(gravado.at(-1)?.interactionId).toBe('interaction-novo');
        expect(gravado.some((entry) => entry.interactionId === 'interaction-0')).toBe(false);
    });

    it('descarta registro corrompido na leitura em vez de propagar', async () => {
        storage.getItem.mockResolvedValue(
            JSON.stringify({
                schemaVersion: 'learning-evidence.v1',
                evidence: [evidence(), { respostaLivre: 'dado proibido que vazou' }],
            }),
        );

        const todas = await LearningEvidenceRepository.getAll();

        expect(todas).toHaveLength(1);
        expect(todas[0].interactionId).toBe('lesson-1-question');
    });

    it('não lança quando o storage falha na escrita', async () => {
        storage.setItem.mockRejectedValue(new Error('disco cheio'));

        await expect(LearningEvidenceRepository.append(evidence())).resolves.toEqual(
            expect.objectContaining({ accepted: false }),
        );
    });

    it('não lança quando o storage falha na leitura', async () => {
        storage.getItem.mockRejectedValue(new Error('storage indisponível'));

        await expect(LearningEvidenceRepository.getAll()).resolves.toEqual([]);
    });

    it('devolve apenas a evidência da competência pedida', async () => {
        storage.getItem.mockResolvedValue(
            JSON.stringify({
                schemaVersion: 'learning-evidence.v1',
                evidence: [
                    evidence({ competencyId: 'competency:protecao-radiologica:tempo-distancia-e-blindagem' }),
                    evidence({ competencyId: 'competency:legacy:lesson-1' }),
                ],
            }),
        );

        const filtradas = await LearningEvidenceRepository.getByCompetency(
            'competency:protecao-radiologica:tempo-distancia-e-blindagem',
        );

        expect(filtradas).toHaveLength(1);
        expect(filtradas[0].competencyId).toBe('competency:protecao-radiologica:tempo-distancia-e-blindagem');
    });
});
