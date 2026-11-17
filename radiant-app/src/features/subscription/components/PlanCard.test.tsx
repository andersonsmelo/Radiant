import React from 'react';
import { StyleSheet } from 'react-native';
import { fireEvent, render, screen } from '@testing-library/react-native';

import { galaxyColors, medalColors } from '../../../ui/theme';
import { typography } from '../../../ui/styles';
import { PlanCard } from './PlanCard';

const lipColor = () => StyleSheet.flatten(screen.getByTestId('plan-card-lip').props.style).backgroundColor;
const faceStyle = (name: RegExp) => StyleSheet.flatten(screen.getByRole('radio', { name }).props.style);

describe('PlanCard', () => {
    it('é um botão de escolha lido como "título, preço, período, detalhe", com o estado de seleção', () => {
        const onPress = jest.fn();
        render(<PlanCard title="Anual" price="R$ 149,90" period="por ano" detail="R$ 12,49 por mês" selected tone="gold" onPress={onPress} testID="plano" />);

        const card = screen.getByRole('radio', { name: 'Anual, R$ 149,90, por ano, R$ 12,49 por mês' });
        expect(card.props.accessibilityState).toEqual({ selected: true, disabled: false });
        expect(screen.getByText('R$ 149,90')).toBeTruthy();
        expect(screen.getByTestId('plano')).toBe(card);
        fireEvent.press(card);
        expect(onPress).toHaveBeenCalledTimes(1);
    });

    it('o período fica numa linha própria em bodyRegular, separado do valor por mês em caption secundário', () => {
        render(<PlanCard title="Anual" price="R$ 149,90" period="por ano" detail="R$ 12,49 por mês" selected tone="gold" onPress={jest.fn()} />);
        const period = StyleSheet.flatten(screen.getByText('por ano').props.style);
        expect(period.fontSize).toBe(typography.bodyRegular.fontSize);
        expect(period.fontFamily).toBe(typography.bodyRegular.fontFamily);
        const detail = StyleSheet.flatten(screen.getByText('R$ 12,49 por mês').props.style);
        expect(detail.fontSize).toBe(typography.caption.fontSize);
        expect(detail.color).toBe(galaxyColors.textSecondary);
    });

    it('sem detalhe, lê só título, preço e período, e não desenha linha vazia', () => {
        render(<PlanCard title="Mensal" price="R$ 19,90" period="por mês" selected={false} tone="neutral" onPress={jest.fn()} />);
        expect(screen.getByRole('radio', { name: 'Mensal, R$ 19,90, por mês' })).toBeTruthy();
        expect(screen.getAllByText(/./u)).toHaveLength(3);
    });

    it('não selecionado anuncia selected falso', () => {
        render(<PlanCard title="Mensal" price="R$ 19,90" period="por mês" selected={false} tone="neutral" onPress={jest.fn()} />);
        expect(screen.getByRole('radio', { name: 'Mensal, R$ 19,90, por mês' }).props.accessibilityState.selected).toBe(false);
    });

    it('ouro selecionado tem borda e lábio de ouro; neutro selecionado, borda de navegação e lábio da unidade', () => {
        const { rerender } = render(<PlanCard title="Anual" price="x" period="y" selected tone="gold" onPress={jest.fn()} />);
        expect(faceStyle(/Anual/u).borderColor).toBe(medalColors.gold.face);
        expect(lipColor()).toBe(medalColors.gold.lip);

        rerender(<PlanCard title="Mensal" price="x" period="y" selected tone="neutral" onPress={jest.fn()} />);
        expect(faceStyle(/Mensal/u).borderColor).toBe(galaxyColors.navBlue);
        expect(lipColor()).toBe(medalColors.unit.lip);
    });

    it('fora da seleção volta ao repouso, nos dois tons', () => {
        for (const tone of ['gold', 'neutral'] as const) {
            const view = render(<PlanCard title="Plano" price="x" period="y" selected={false} tone={tone} onPress={jest.fn()} />);
            expect(faceStyle(/Plano/u).borderColor).toBe(galaxyColors.border);
            expect(lipColor()).toBe(galaxyColors.backgroundAlt);
            view.unmount();
        }
    });

    it('desabilitado não chama onPress e anuncia o bloqueio', () => {
        const onPress = jest.fn();
        render(<PlanCard title="Anual" price="x" period="y" selected tone="gold" onPress={onPress} disabled />);
        const card = screen.getByRole('radio', { name: /Anual/u });
        expect(card.props.accessibilityState.disabled).toBe(true);
        fireEvent.press(card);
        expect(onPress).not.toHaveBeenCalled();
    });
});
