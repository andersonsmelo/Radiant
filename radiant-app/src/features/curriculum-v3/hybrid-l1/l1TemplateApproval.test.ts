import { reviewSample } from './l1HybridLessonPlan';
import { L1_TEMPLATE_APPROVAL, isL1TemplateApproved, l1TemplateFingerprint } from './l1TemplateApproval';
import type { HybridItem } from './hybridItem.types';

function describeForReview(item: HybridItem): string {
  return [
    `${item.id} · ${item.phase === 'first_contact' ? 'primeiro contato' : 'desafio'} · ${item.format} · ${item.posture}/${item.perspective}${item.variant ? ' · variante' : ''}`,
    `Pergunta: ${item.prompt}`,
    // No verdadeiro/falso as opções são V e F: sem esta linha, o revisor não
    // sabe qual landmark é o "marcador N" da afirmação e não confere o ✓.
    ...(item.format === 'true_false' ? [`  No mapa: ${item.landmarks.map((landmark, index) => `${index + 1} = ${landmark.textDescription}`).join(' · ')}`] : []),
    ...item.options.map((option) => `  ${option.id === item.correctOptionId ? '✓' : ' '} ${option.label}: ${option.textDescription}`),
    `Se acertar: ${item.feedback.correct}`,
    `Se errar: ${item.feedback.incorrect}`,
    `Dica de primeiro contato: ${item.hint}`,
  ].join('\n');
}

describe('aprovação dos modelos da L1', () => {
  it('amostra de revisão do dono — o que a lição pode mostrar, com o gabarito marcado', () => {
    expect(reviewSample().map(describeForReview).join('\n\n')).toMatchSnapshot();
  });

  it('nenhuma pergunta se repete na amostra: a variante não duplica outro item', () => {
    // ADR 2026-09-25, item 1a: o h10-v saía idêntico ao h01. Mesma pergunta
    // no mesmo cenário é o mesmo gabarito; a pergunta inclui o cenário.
    const porPergunta = new Map<string, string[]>();
    for (const item of reviewSample()) {
      porPergunta.set(item.prompt, [...(porPergunta.get(item.prompt) ?? []), item.id]);
    }
    const repetidas = [...porPergunta.values()].filter((ids) => ids.length > 1);

    expect(repetidas).toEqual([]);
    expect(porPergunta.size).toBe(20);
  });

  it('nenhum item da amostra usa uma vista que só existiria por baixo da mesa', () => {
    // ADR 2026-09-25, item 1b, e ADR 2026-09-28 (o h08 incluído pelo dono).
    const porBaixo = reviewSample()
      .filter((item) => (item.posture === 'supine' && item.perspective === 'back') || (item.posture === 'prone' && item.perspective === 'front'))
      .map((item) => `${item.id} · ${item.posture}/${item.perspective}`);

    expect(porBaixo).toEqual([]);
  });

  it('a impressão digital é estável', () => {
    expect(l1TemplateFingerprint()).toBe(l1TemplateFingerprint());
    expect(l1TemplateFingerprint()).toMatch(/^[0-9a-f]{8}$/);
  });

  it('a aprovação cai quando o conteúdo muda depois da revisão', () => {
    if (L1_TEMPLATE_APPROVAL === null) {
      expect(isL1TemplateApproved()).toBe(false);
    } else {
      expect(l1TemplateFingerprint()).toBe(L1_TEMPLATE_APPROVAL.fingerprint);
    }
  });
});
