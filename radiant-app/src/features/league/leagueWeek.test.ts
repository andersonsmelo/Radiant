import { formatTimeLeft, weekStartUtc } from './leagueWeek';

describe('weekStartUtc — a semana do placar começa segunda 00:00 UTC', () => {
    it('segunda 00:00 UTC abre a semana dela mesma', () => {
        expect(weekStartUtc(new Date('2026-11-16T00:00:00Z'))).toBe('2026-11-16T00:00:00.000Z');
    });

    it('domingo 23:59 UTC ainda é a semana anterior', () => {
        expect(weekStartUtc(new Date('2026-11-15T23:59:59Z'))).toBe('2026-11-09T00:00:00.000Z');
    });

    it('domingo 21h30 em Brasília (-03) já é segunda em UTC: conta para a semana nova', () => {
        expect(weekStartUtc(new Date('2026-11-15T21:30:00-03:00'))).toBe('2026-11-16T00:00:00.000Z');
    });

    it('meio da semana cai na segunda anterior, atravessando o mês', () => {
        expect(weekStartUtc(new Date('2026-12-02T15:00:00Z'))).toBe('2026-11-30T00:00:00.000Z');
    });
});

describe('formatTimeLeft — tempo até o fim da semana, sem cronômetro de pressão', () => {
    const now = new Date('2026-11-13T12:00:00Z');

    it('dias e horas quando falta mais de um dia', () => {
        expect(formatTimeLeft('2026-11-16T00:00:00Z', now)).toBe('Termina em 2 dias e 12 h');
    });

    it('um dia no singular', () => {
        expect(formatTimeLeft('2026-11-14T12:00:00Z', now)).toBe('Termina em 1 dia');
    });

    it('só horas no último dia', () => {
        expect(formatTimeLeft('2026-11-13T17:30:00Z', now)).toBe('Termina em 5 h');
    });

    it('menos de uma hora', () => {
        expect(formatTimeLeft('2026-11-13T12:40:00Z', now)).toBe('Termina em menos de 1 h');
    });

    it('fim desconhecido ou já passado não inventa prazo', () => {
        expect(formatTimeLeft(null, now)).toBeNull();
        expect(formatTimeLeft('2026-11-13T11:00:00Z', now)).toBeNull();
        expect(formatTimeLeft('não é data', now)).toBeNull();
    });
});
