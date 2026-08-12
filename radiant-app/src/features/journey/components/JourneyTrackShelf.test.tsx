import React from 'react';
import { act, render } from '@testing-library/react-native';
import { JourneyTrackShelf } from './JourneyTrackShelf';
import type { LearningTrack } from '../../content/content.types';

// A prateleira afirmava conclusão sobre conteúdo que o aluno nunca abriu:
// toda trilha não-ativa recebia `progressPercent={100}` e desenhava a barra
// cheia em verde de sucesso. Num app cuja proposta é progressão por domínio,
// barra cheia significa "você domina isto" — e o app dizia isso sobre proteção
// radiológica para quem não tinha aberto uma lição.

const trilhaAtiva: LearningTrack = {
  id: 'track-fundamentos',
  slug: 'fundamentos',
  title: 'Fundamentos de Radiologia',
  description: 'A base do raciocínio radiológico.',
  lessonIds: [],
};

const trilhaNuncaAberta: LearningTrack = {
  id: 'track-radiacao',
  slug: 'radiacao',
  title: 'Radiação, Modalidades e Equipamentos',
  description: 'Proteção radiológica, medicina nuclear e tomografia.',
  lessonIds: [],
};

async function renderShelf() {
  const utils = render(
    <JourneyTrackShelf
      tracks={[trilhaAtiva, trilhaNuncaAberta]}
      lessons={[]}
      activeTrackId={trilhaAtiva.id}
      activeProgressPercent={0}
      onTrackPress={() => {}}
    />,
  );

  // `@expo/vector-icons` carrega a fonte do ícone de forma assíncrona e chama
  // setState quando ela chega. Sem drenar essa microtarefa aqui, o update cai
  // fora de act() e polui a saída de todo teste que renderize um ícone.
  await act(async () => {});

  return utils;
}

/** Largura declarada no estilo do preenchimento, em porcentagem. */
function progressWidth(element: { props: { style: unknown } }): string {
  const flattened = ([] as Record<string, unknown>[]).concat(
    element.props.style as Record<string, unknown>[],
  );
  const withWidth = flattened.filter(Boolean).find((entry) => 'width' in entry);
  return String(withWidth?.width);
}

test('trilha que o aluno nunca abriu não exibe progresso concluído', async () => {
  const { getByTestId } = await renderShelf();

  const preenchimento = getByTestId(`journey-track-progress-${trilhaNuncaAberta.slug}`);

  expect(progressWidth(preenchimento)).toBe('0%');
});

test('trilha que o aluno nunca abriu não é anunciada como pronta ou concluída', async () => {
  const { getByTestId } = await renderShelf();

  const card = getByTestId(`journey-track-${trilhaNuncaAberta.slug}`);
  const rotulo = String(card.props.accessibilityLabel);

  expect(rotulo).toContain('Não iniciada');
  expect(rotulo).not.toContain('pronto');
});

test('trilha ativa em zero por cento desenha o trilho vazio, não um resto de barra', async () => {
  const { getByTestId } = await renderShelf();

  // `Math.max(8, progressPercent)` pintava 8% quando o valor era 0, e o rótulo
  // ao lado dizia "0%". A barra contradizia o número que ela mesma legendava.
  const preenchimento = getByTestId(`journey-track-progress-${trilhaAtiva.slug}`);

  expect(progressWidth(preenchimento)).toBe('0%');
});
