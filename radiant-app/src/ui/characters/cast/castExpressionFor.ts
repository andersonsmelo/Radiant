import type { LessonCastId } from '../../../types/learningActivity';
import type { CastExpression } from './castExpressions';

/**
 * O momento da aula em que um personagem aparece, só com o que o tocador já
 * sabe. Não muda `LessonDialogueLine` (contrato da F2): a fala entra como texto.
 *
 * - `fala`: uma linha de cena de diálogo;
 * - `retorno`: a reação à resposta. `celebrate` é o acerto que fecha um marco
 *   (combo, checkpoint, aula concluída), quando quem chama sabe disso.
 */
export type CastMoment =
    | { kind: 'fala'; speaker: LessonCastId; text: string }
    | { kind: 'retorno'; correct: boolean; celebrate?: boolean };

/**
 * A expressão de quem aparece, pelo contexto (bíblia de 2026-11-13, "Quando
 * cada expressão aparece"):
 *
 * - fala comum: neutro;
 * - fala que termina em pergunta: pensativo, porque o elenco pergunta para
 *   fazer pensar (Lia, Pixel) ou porque está em dúvida (Duda, Caio); o
 *   paciente que pergunta está inseguro com o próprio exame, e fica preocupado;
 * - retorno de acerto: feliz, ou comemorando quando fecha um marco;
 * - retorno de erro: preocupado, que na bíblia é acolhimento. Não existe
 *   expressão de reprovação no conjunto, então nenhum caminho chega nela.
 */
export function castExpressionFor(moment: CastMoment): CastExpression {
    if (moment.kind === 'retorno') {
        if (!moment.correct) return 'preocupado';
        return moment.celebrate ? 'comemorando' : 'feliz';
    }
    // Aspas e parênteses de fechamento não escondem a pergunta: «… hoje?”».
    const asksQuestion = /\?[\s"'”’»)]*$/u.test(moment.text.trim());
    if (!asksQuestion) return 'neutro';
    return moment.speaker === 'paciente' ? 'preocupado' : 'pensativo';
}
