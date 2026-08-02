import type { LessonBlock, LessonStepDefinition } from '../../../types/lessonFlow';
import type {
    LearningActivityV2,
    LearningInteractionV2,
    LearningStepV2,
    PresentationRole,
} from '../../../types/learningActivity';

/**
 * Converte um bloco do contrato legado numa atividade v2.
 *
 * **Puro por exigência do plano:** não lê storage, catálogo nem rede. Recebe o
 * bloco já resolvido e devolve a atividade. Quem busca o bloco é o
 * `LessonFlowService`; separar as duas coisas é o que permite testar a conversão
 * sem montar a árvore de persistência inteira.
 *
 * **Fiel, não corretivo.** O adaptador não preenche buracos: se o bloco legado
 * for incompatível com o v2 — por exemplo com dois passos, que o contrato legado
 * permite e o v2 não — a atividade sai como está e `validateLearningActivity` a
 * reprova. Inventar uma tela para fazer passar esconderia a incompatibilidade
 * exatamente onde ela precisa aparecer.
 */

/**
 * Toda competência sintética de conteúdo legado começa com este prefixo.
 *
 * Lição antiga não foi escrita contra o currículo, então **não se sabe** qual
 * competência ela mede. Atribuir uma competência real seria inventar um dado que
 * depois contamina o cálculo de domínio — e contaminaria de forma invisível,
 * porque o número sairia plausível. O prefixo mantém a evidência rastreável e
 * separável: quem for calcular domínio decide o que fazer com ela, de olhos
 * abertos.
 */
export const LEGACY_COMPETENCY_PREFIX = 'competency:legacy:';

export const LEGACY_CONTENT_VERSION = 'legacy-lesson-catalog';

const ROLE_BY_LEGACY_TYPE: Record<string, PresentationRole> = {
    // Abertura da sessão: contexto é o gancho.
    context: 'hook',
    // Entrega conceitual.
    teach: 'concept',
    // Reforço e avanço são ambos fechamento: síntese depois da tentativa e
    // indicação do próximo passo. Não viram papéis próprios porque um papel por
    // tipo legado faria o v2 espelhar o contrato que ele veio substituir.
    reinforce: 'closing',
    advance: 'closing',
};

function toInteraction(definition: LessonStepDefinition, competencyId: string): LearningInteractionV2 {
    if (definition.step.type !== 'multiple-choice') {
        throw new Error(`[legacy-adapter] Step "${definition.contract.id}" is not interactive.`);
    }

    const { prompt, options, correctOptionId, explanation } = definition.step.payload;

    return {
        type: 'multiple-choice',
        id: definition.contract.id,
        competencyIds: [competencyId],
        evidenceKind: 'legacy-lesson-recall',
        completionRule: definition.contract.completionRule,
        // Conteúdo legado nunca passou por classificação de segurança. `false` é
        // a única resposta honesta: marcar `true` inventaria criticidade, e
        // deixar indefinido violaria a exigência de o campo ser explícito.
        criticalSafety: false,
        // O contrato legado tem uma explicação única, exibida no acerto e no
        // erro. Duplicá-la preserva o comportamento; escrever texto novo para o
        // erro seria inventar conteúdo educacional dentro de um adaptador.
        feedback: { correct: explanation, incorrect: explanation },
        accessibility: { label: prompt },
        payload: {
            prompt,
            options: options.map((option) => ({ id: option.id, label: option.label })),
            correctOptionId,
        },
    };
}

function toPresentation(definition: LessonStepDefinition): LearningStepV2 {
    const role = ROLE_BY_LEGACY_TYPE[definition.step.type] ?? 'concept';
    const payload = definition.step.payload as {
        title: string;
        body?: string;
        eyebrow?: string;
        imageUrl?: string;
        tone?: 'positive' | 'neutral' | 'corrective';
    };

    return {
        kind: 'presentation',
        id: definition.contract.id,
        role,
        payload: {
            title: payload.title,
            body: payload.body,
            eyebrow: payload.eyebrow,
            imageRef: payload.imageUrl,
            tone: payload.tone,
        },
    };
}

export function adaptLegacyBlock(block: LessonBlock): LearningActivityV2 {
    const competencyId = `${LEGACY_COMPETENCY_PREFIX}${block.lessonId}`;

    return {
        id: `activity:legacy:${block.id}`,
        competencyIds: [competencyId],
        provenance: {
            contentVersion: LEGACY_CONTENT_VERSION,
            sourceIds: [block.lessonId],
        },
        // Um passo legado vira exatamente um passo v2, na mesma ordem: a
        // paridade de telas é o que permite trocar o motor sem que o aluno
        // perceba diferença de percurso.
        steps: block.steps.map((definition) => (
            definition.step.type === 'multiple-choice'
                ? { kind: 'interaction', interaction: toInteraction(definition, competencyId) }
                : toPresentation(definition)
        )),
    };
}
