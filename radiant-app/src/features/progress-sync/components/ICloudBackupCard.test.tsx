import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react-native';

import { ICloudBackupCard } from './ICloudBackupCard';

describe('ICloudBackupCard', () => {
    it('desligado: interruptor apagado e sem data', () => {
        const onToggle = jest.fn();
        render(<ICloudBackupCard state={{ enabled: false, lastBackupAt: null, lastError: null }} onToggle={onToggle} />);

        expect(screen.getByText('Backup no iCloud')).toBeTruthy();
        expect(screen.getByText('Nenhum backup ainda')).toBeTruthy();
        const interruptor = screen.getByLabelText('Backup no iCloud');
        expect(interruptor.props.value).toBe(false);
        fireEvent(interruptor, 'valueChange', true);
        expect(onToggle).toHaveBeenCalledWith(true);
    });

    it('ativo: mostra a data do último backup', () => {
        render(<ICloudBackupCard state={{ enabled: true, lastBackupAt: '2026-09-14T12:00:00.000Z', lastError: null }} onToggle={jest.fn()} />);

        expect(screen.getByLabelText('Backup no iCloud').props.value).toBe(true);
        expect(screen.getByText(/Último backup em 14\/09\/2026/u)).toBeTruthy();
    });

    it('erro: informa sem bloquear e mantém o interruptor', () => {
        render(<ICloudBackupCard state={{ enabled: true, lastBackupAt: null, lastError: 'cloud-unavailable' }} onToggle={jest.fn()} />);

        expect(screen.getByText(/ainda não está disponível nesta versão/u)).toBeTruthy();
        expect(screen.getByText(/continua salvo neste aparelho/u)).toBeTruthy();
        expect(screen.getByLabelText('Backup no iCloud').props.disabled).not.toBe(true);
    });

    it('falha genérica informa o que fazer', () => {
        render(<ICloudBackupCard state={{ enabled: true, lastBackupAt: '2026-09-13T12:00:00.000Z', lastError: 'failed' }} onToggle={jest.fn()} />);

        expect(screen.getByText(/Não foi possível fazer o backup agora/u)).toBeTruthy();
        expect(screen.getByText(/Último backup em 13\/09\/2026/u)).toBeTruthy();
    });

    it('enquanto carrega mostra esqueleto, nunca branco', () => {
        render(<ICloudBackupCard state={null} onToggle={jest.fn()} />);

        expect(screen.getByLabelText('Carregando o backup')).toBeTruthy();
    });
});

it('avisa que o backup é de uma versão mais nova sem sugerir nova tentativa', () => {
    // Estado novo depois do achado 1 da revisão do PR #14: registro remoto
    // presente e incompatível. O texto tem de dizer que ele está intacto, senão
    // o usuário acha que perdeu o backup.
    render(
        <ICloudBackupCard
            state={{ enabled: true, lastBackupAt: null, lastError: 'incompatible' }}
            onToggle={jest.fn()}
        />,
    );

    expect(screen.getByText(/versão mais nova do Radiant/i)).toBeTruthy();
    expect(screen.getByText(/guardado e intacto/i)).toBeTruthy();
    expect(screen.queryByText(/tento de novo na próxima lição/i)).toBeNull();
});
