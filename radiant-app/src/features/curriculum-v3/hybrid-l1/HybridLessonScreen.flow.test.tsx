import React from 'react';
import { fireEvent, screen, within } from '@testing-library/react-native';
import { renderWithProviders } from '../../../test/renderWithProviders';
import { HybridLessonScreen } from './HybridLessonScreen';
import { buildL1HybridPlan } from './l1HybridLessonPlan';
import type { HybridItem } from './hybridItem.types';
import type { HeartsSnapshot } from '../../hearts/hearts.types';

jest.mock('@react-native-async-storage/async-storage', () => require('@react-native-async-storage/async-storage/jest/async-storage-mock'));

const plan = buildL1HybridPlan();
const FULL: HeartsSnapshot = { count: 5, status: 'full', nextRefillAt: null, unlimitedUntil: null };

function makeDeps(spendResult: HeartsSnapshot = { count: 4, status: 'recovering', nextRefillAt: null, unlimitedUntil: null }) {
  const events: string[] = [];
  return {
    events,
    hearts: { getSnapshot: jest.fn().mockResolvedValue(FULL), spend: jest.fn().mockResolvedValue(spendResult) },
    feedback: { emit: (event: string) => { events.push(event); } },
    metrics: { append: jest.fn().mockResolvedValue(undefined) },
    onExit: jest.fn(),
  };
}

function pressOption(item: HybridItem, optionId: string) {
  const option = item.options.find((candidate) => candidate.id === optionId)!;
  if (item.format === 'tap') fireEvent.press(screen.getByTestId(`landmark-${option.landmarkId}`));
  else fireEvent.press(screen.getByTestId(`hybrid-option-${option.id}`));
}

function currentItem(): HybridItem {
  // O id fica escondido da acessibilidade; a consulta precisa incluí-lo.
  const id = screen.getByTestId('hybrid-item-id', { includeHiddenElements: true }).props.children as string;
  const found = [...plan, ...plan.map((item) => ({ ...item, id: `${item.id}-v` }))].find((item) => item.id === id);
  if (found) return found;
  throw new Error(`item fora do plano: ${id}`);
}

function renderScreen(deps: ReturnType<typeof makeDeps>) {
  renderWithProviders(<HybridLessonScreen plan={plan} hearts={deps.hearts} feedback={deps.feedback} metrics={deps.metrics} onExit={deps.onExit} />);
}

beforeAll(() => {
  // Estreia da árvore fora da janela do findBy (lição de 2026-09-23).
  const warm = makeDeps();
  const { unmount } = renderWithProviders(<HybridLessonScreen plan={plan} hearts={warm.hearts} feedback={warm.feedback} metrics={warm.metrics} onExit={warm.onExit} />);
  unmount();
});

describe('lição híbrida na tela', () => {
  it('percorre a lição acertando tudo e mostra o resumo', async () => {
    const deps = makeDeps();
    renderScreen(deps);
    fireEvent.press(screen.getByText('Começar'));
    for (const item of plan) {
      expect(screen.getByText(item.prompt)).toBeTruthy();
      pressOption(item, item.correctOptionId);
      fireEvent.press(await screen.findByText('Continuar'));
    }
    expect(await screen.findByText('Lição concluída')).toBeTruthy();
    expect(screen.getByText('+18 XP')).toBeTruthy();
    expect(screen.getByText('Precisão 100%')).toBeTruthy();
    expect(deps.hearts.spend).not.toHaveBeenCalled();
    expect(deps.events.filter((event) => event === 'streak')).toHaveLength(2);
    expect(deps.events[deps.events.length - 1]).toBe('lesson_complete');
  });

  // Revisão no simulador (iPhone 17, iOS 26.5), 2026-09-23: o retorno aparecia
  // abaixo da dobra, a rolagem não voltava ao topo e o mapa carregava textos
  // técnicos que empurravam tudo para baixo.
  it('o retorno fica no rodapé fixo, fora da rolagem', async () => {
    const deps = makeDeps();
    renderScreen(deps);
    fireEvent.press(within(screen.getByTestId('hybrid-footer')).getByText('Começar'));
    const first = plan[0];
    pressOption(first, first.options.find((option) => option.id !== first.correctOptionId)!.id);
    await screen.findByText('Tentar de novo');
    expect(within(screen.getByTestId('hybrid-footer')).getByText('Tentar de novo')).toBeTruthy();
    expect(within(screen.getByTestId('hybrid-scroll')).queryByText('Tentar de novo')).toBeNull();
  });

  it('a rolagem recomeça a cada item novo', async () => {
    const deps = makeDeps();
    renderScreen(deps);
    fireEvent.press(screen.getByText('Começar'));
    const before = screen.getByTestId('hybrid-scroll');
    pressOption(plan[0], plan[0].correctOptionId);
    fireEvent.press(await screen.findByText('Continuar'));
    expect(screen.getByTestId('hybrid-scroll')).not.toBe(before);
  });

  it('o mapa da lição vem sem os textos técnicos', () => {
    const deps = makeDeps();
    renderScreen(deps);
    expect(screen.queryByText(/Modelo 2\.5D/)).toBeNull();
    fireEvent.press(screen.getByText('Começar'));
    expect(screen.queryByText(/Modelo 2\.5D/)).toBeNull();
    expect(screen.queryByText(/Linha tracejada/)).toBeNull();
  });

  it('a descrição da opção fica só no rótulo acessível: o texto visível não entrega a resposta', () => {
    // h03 é escolha de relação: "qual marcador está mais próximo da cabeça?".
    // Mostrar "Marcador junto à extremidade da cabeça" no botão respondia pelo
    // aluno — revisão local de 2026-09-23.
    const deps = makeDeps();
    const choiceItem = plan[2];
    renderWithProviders(<HybridLessonScreen plan={plan.slice(2)} hearts={deps.hearts} feedback={deps.feedback} metrics={deps.metrics} onExit={deps.onExit} />);
    fireEvent.press(screen.getByText('Começar'));
    expect(choiceItem.format).toBe('choice');
    for (const option of choiceItem.options) {
      expect(screen.queryByText(option.textDescription)).toBeNull();
      expect(screen.getByTestId(`hybrid-option-${option.id}`).props.accessibilityLabel).toBe(`${option.label}. ${option.textDescription}`);
    }
  });

  it('erro de primeiro contato não custa vida, mostra a dica e deixa tentar de novo', async () => {
    const deps = makeDeps();
    renderScreen(deps);
    fireEvent.press(screen.getByText('Começar'));
    const first = plan[0];
    pressOption(first, first.options.find((option) => option.id !== first.correctOptionId)!.id);
    expect(await screen.findByText('Tentar de novo')).toBeTruthy();
    expect(screen.getByText(first.hint)).toBeTruthy();
    expect(deps.hearts.spend).not.toHaveBeenCalled();
    fireEvent.press(screen.getByText('Tentar de novo'));
    expect(screen.getByText(first.prompt)).toBeTruthy();
  });

  it('erro de desafio gasta uma vida e o item volta no fim', async () => {
    const deps = makeDeps();
    renderScreen(deps);
    fireEvent.press(screen.getByText('Começar'));
    for (const item of plan.slice(0, 4)) {
      pressOption(item, item.correctOptionId);
      fireEvent.press(await screen.findByText('Continuar'));
    }
    const challenge = plan[4];
    pressOption(challenge, challenge.options.find((option) => option.id !== challenge.correctOptionId)!.id);
    fireEvent.press(await screen.findByText('Continuar'));
    expect(deps.hearts.spend).toHaveBeenCalledTimes(1);
    expect(deps.events).toContain('heart_lost');
    expect(screen.getByText('6 de 13')).toBeTruthy();
  });

  it('sem vidas, a lição para e explica quando elas voltam', async () => {
    const deps = makeDeps({ count: 0, status: 'empty', nextRefillAt: null, unlimitedUntil: null });
    renderScreen(deps);
    fireEvent.press(screen.getByText('Começar'));
    for (const item of plan.slice(0, 4)) {
      pressOption(item, item.correctOptionId);
      fireEvent.press(await screen.findByText('Continuar'));
    }
    const challenge = currentItem();
    pressOption(challenge, challenge.options.find((option) => option.id !== challenge.correctOptionId)!.id);
    expect(await screen.findByText('Suas vidas acabaram.')).toBeTruthy();
  });

  it('grava a sessão concluída no aparelho', async () => {
    const deps = makeDeps();
    renderScreen(deps);
    fireEvent.press(screen.getByText('Começar'));
    for (const item of plan) {
      pressOption(item, item.correctOptionId);
      fireEvent.press(await screen.findByText('Continuar'));
    }
    await screen.findByText('Lição concluída');
    expect(deps.metrics.append).toHaveBeenCalledWith(expect.objectContaining({ outcome: 'completed', abandonedAtItemId: null }));
  });

  it('sair no meio grava o abandono e o item em que parou', async () => {
    const deps = makeDeps();
    const { unmount } = renderWithProviders(<HybridLessonScreen plan={plan} hearts={deps.hearts} feedback={deps.feedback} metrics={deps.metrics} onExit={deps.onExit} />);
    fireEvent.press(screen.getByText('Começar'));
    unmount();
    expect(deps.metrics.append).toHaveBeenCalledWith(expect.objectContaining({ outcome: 'abandoned', abandonedAtItemId: plan[0].id }));
  });
});
