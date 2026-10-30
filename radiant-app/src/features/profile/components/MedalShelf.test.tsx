import React from 'react';
import { render, screen, within } from '@testing-library/react-native';
import { Circle } from 'react-native-svg';
import { medalColors } from '../../../ui/theme';
import type { JourneyUnit } from '../../../types/journey';
import { MedalShelf } from './MedalShelf';
import { ThemeIllustration } from '../../../ui/illustrations/ThemeIllustration';
jest.mock('react-native-reanimated', () => require('react-native-reanimated/mock'));
jest.mock('../../../ui/accessibility/useReducedMotionPreference', () => ({
  useReducedMotionPreference: () => true,
  useReducedMotionPreferenceState: () => ({ reducedMotionEnabled: true, resolved: true }),
}));
const unit: JourneyUnit = { id: 'u', title: 'Unidade atual', theme: 'tubo', nodes: [
  { id: 'done', unitId: 'u', type: 'lesson', lessonId: 'a', title: 'Concluída', status: 'completed' },
  { id: 'available', unitId: 'u', type: 'lesson', lessonId: 'b', title: 'Disponível', status: 'available' },
  { id: 'resumable', unitId: 'u', type: 'lesson', lessonId: 'c', title: 'Retomável', status: 'resumable', theme: 'protecao' },
  { id: 'locked', unitId: 'u', type: 'lesson', lessonId: 'd', title: 'Bloqueada', status: 'locked' },
  { id: 'review', unitId: 'u', type: 'review', title: 'Revisão interna', status: 'completed' },
] };
it('ouro só para conclusão real; available e resumable ficam silhuetas não interativas', () => {
  render(<MedalShelf unit={unit} starsByLessonId={{ a: 3, b: 2 }} />);
  const achieved = screen.getByLabelText('Concluída. Concluída. 3 estrelas.');
  const available = screen.getByLabelText('Disponível. Ainda não conquistada.');
  expect(achieved.findAllByType(Circle).some((circle: { props: { fill?: string } }) => circle.props.fill === medalColors.gold.face)).toBe(true);
  expect(available.findAllByType(Circle).some((circle: { props: { fill?: string } }) => circle.props.fill === medalColors.locked.face)).toBe(true);
  expect(screen.getByLabelText('Retomável. Ainda não conquistada.')).toBeTruthy();
  expect(screen.queryByLabelText(/Revisão interna/u)).toBeNull();
  expect(screen.queryByRole('button')).toBeNull();
  expect(screen.queryByTestId('journey-medal-pulse-ring')).toBeNull();
});
it('zero real não é undefined e estrelas de aula não concluída não viram conquista', () => {
  const two = { ...unit, nodes: [unit.nodes[0], { ...unit.nodes[1], status: 'completed' as const }, unit.nodes[2]] };
  render(<MedalShelf unit={two} starsByLessonId={{ a: 0, c: 3 }} />);
  expect(screen.getByLabelText('Concluída. Concluída. 0 estrelas.')).toBeTruthy();
  expect(screen.getByLabelText('Disponível. Concluída.')).toBeTruthy();
  expect(screen.getByLabelText('Retomável. Ainda não conquistada.')).toBeTruthy();
  expect(within(screen.getByLabelText('Disponível. Concluída.')).queryByTestId('journey-medal-star-off', { includeHiddenElements: true })).toBeNull();
});
it('temas usam a unidade como herança e respeitam a exceção da aula', () => {
  const result = render(<MedalShelf unit={unit} starsByLessonId={{}} />);
  const illustrations = result.UNSAFE_getAllByType(ThemeIllustration);
  expect(illustrations.map(illustration => illustration.props.theme)).toEqual(['tubo', 'tubo', 'protecao', 'tubo']);
});
it('sem currículo não mostra silhuetas falsas e falha de estrelas não remove ouro comprovado', () => {
  const result = render(<MedalShelf unit={null} starsByLessonId={null} />);
  expect(screen.getByText('Medalhas indisponíveis')).toBeTruthy();
  expect(screen.queryByRole('image')).toBeNull();
  result.rerender(<MedalShelf unit={unit} starsByLessonId={null} />);
  expect(screen.getByText('Estrelas indisponíveis')).toBeTruthy();
  expect(screen.getByLabelText('Concluída. Concluída.')).toBeTruthy();
});
it('carregando não produz aluno sem conquistas', () => {
  render(<MedalShelf unit={null} starsByLessonId={null} loading />);
  expect(screen.getByText('Carregando medalhas…')).toBeTruthy();
  expect(screen.queryByLabelText(/Ainda não conquistada/u)).toBeNull();
});
