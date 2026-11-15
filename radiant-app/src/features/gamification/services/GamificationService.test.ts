import AsyncStorage from '@react-native-async-storage/async-storage';

import { GamificationService } from './GamificationService';
import { GAMIFICATION_STORAGE_KEY } from '../../../constants/gamification';
import { STORAGE_KEYS } from '../../../constants/storageKeys';
import type { QuizResult } from '../../../types/quiz';

jest.mock('@react-native-async-storage/async-storage', () =>
    require('@react-native-async-storage/async-storage/jest/async-storage-mock'));

describe('GamificationService.absorbBackup', () => {
    beforeEach(async () => {
        await AsyncStorage.clear();
        await GamificationService.reset();
    });

    it('fica com o maior XP e a maior sequência entre o local e o backup', async () => {
        await GamificationService.addManualXp(120);

        const snapshot = await GamificationService.absorbBackup({ totalXp: 90, streakDays: 9 });

        expect(snapshot.totalXp).toBe(120);
        expect(snapshot.streakDays).toBe(9);
        expect((await GamificationService.getSnapshot()).streakDays).toBe(9);
    });

    it('não rebaixa nada quando o backup é menor', async () => {
        await GamificationService.addManualXp(300);

        const snapshot = await GamificationService.absorbBackup({ totalXp: 10, streakDays: 0 });

        expect(snapshot.totalXp).toBe(300);
        expect(snapshot.streakDays).toBe(1);
    });
});

// O contador de vidas que este serviço guardava ao lado do `heartsRepository`
// foi aposentado em 2026-09-23: nunca soube da assinatura, e o caminho vivo
// nunca o descontava. Quem instalou a 1.3.1 ainda tem os campos gravados.
describe('GamificationService — vidas aposentadas', () => {
    const legado = {
        totalXp: 120,
        streakDays: 4,
        lastActiveDate: null,
        updatedAt: '2026-09-14T10:00:00.000Z',
        hearts: 2,
        maxHearts: 5,
        heartsLastRefillAt: '2026-09-14T10:00:00.000Z',
    };

    // Instância nova a cada teste: o serviço guarda o store em memória depois
    // da primeira leitura, e aqui o que se testa é justamente a leitura do disco.
    function servicoNovo(): typeof GamificationService {
        let servico!: typeof GamificationService;
        jest.isolateModules(() => {
            servico = require('./GamificationService').GamificationService;
        });
        return servico;
    }

    beforeEach(async () => {
        await AsyncStorage.clear();
        await AsyncStorage.setItem(GAMIFICATION_STORAGE_KEY, JSON.stringify(legado));
    });

    it('o snapshot não expõe mais vidas', async () => {
        const snapshot = await servicoNovo().getSnapshot();

        expect(snapshot).not.toHaveProperty('hearts');
        expect(snapshot).not.toHaveProperty('maxHearts');
        expect(snapshot).not.toHaveProperty('heartsNextRefillAt');
        expect(snapshot.totalXp).toBe(120);
    });

    it('os campos legados já gravados sobrevivem a uma gravação: voltar à 1.3.1 não perde nada', async () => {
        await servicoNovo().addManualXp(10);

        const gravado = JSON.parse((await AsyncStorage.getItem(GAMIFICATION_STORAGE_KEY)) ?? '{}');
        expect(gravado).toMatchObject({
            totalXp: 130,
            hearts: 2,
            maxHearts: 5,
            heartsLastRefillAt: '2026-09-14T10:00:00.000Z',
        });
    });
});

// A sequência é calculada num lugar só: `recordQuizCompletion`. As datas são
// construídas no calendário local (ano, mês, dia), como o relógio do aparelho.
describe('GamificationService: sequência com proteção', () => {
    const estudo = (year: number, month: number, day: number): QuizResult =>
        ({ totalQuestions: 5, correctAnswers: 5, answeredAt: new Date(year, month - 1, day, 21, 30) }) as QuizResult;

    beforeEach(async () => {
        await AsyncStorage.clear();
        await GamificationService.reset();
    });

    it('dias seguidos somam na sequência, em qualquer fuso (à noite, no horário de Brasília)', async () => {
        await GamificationService.recordQuizCompletion(estudo(2026, 11, 4));
        const { snapshot } = await GamificationService.recordQuizCompletion(estudo(2026, 11, 5));
        expect(snapshot).toMatchObject({ streakDays: 2, lastActiveDate: '2026-11-05' });
    });

    it('um dia perdido gasta a proteção ganha no sétimo dia; o segundo dia perdido recomeça a sequência', async () => {
        for (let day = 1; day <= 7; day += 1) await GamificationService.recordQuizCompletion(estudo(2026, 11, day));
        expect(JSON.parse((await AsyncStorage.getItem(STORAGE_KEYS.STREAK_FREEZE))!).freezes).toBe(1);

        const coberto = await GamificationService.recordQuizCompletion(estudo(2026, 11, 9));
        expect(coberto.snapshot.streakDays).toBe(8);
        expect(JSON.parse((await AsyncStorage.getItem(STORAGE_KEYS.STREAK_FREEZE))!).freezes).toBe(0);

        const semProtecao = await GamificationService.recordQuizCompletion(estudo(2026, 11, 11));
        expect(semProtecao.snapshot.streakDays).toBe(1);
    });
});

// A liga semanal (ADR 2026-11-13) soma o XP ganho na semana. O ganho passa só
// por `recordQuizCompletion` e `addManualXp`; restaurar backup e zerar não são
// ganho e não podem inflar a liga.
describe('GamificationService.onXpEarned — o XP ganho que a liga soma', () => {
    const quiz = (answeredAt: Date): QuizResult => ({
        lessonId: 'licao-liga', totalQuestions: 5, correctAnswers: 5, answeredAt,
    } as unknown as QuizResult);

    beforeEach(async () => {
        await AsyncStorage.clear();
        await GamificationService.reset();
    });

    it('avisa o XP da aula concluída, com o instante da resposta', async () => {
        const ganhos: [number, string][] = [];
        const parar = GamificationService.onXpEarned((xp, at) => { ganhos.push([xp, at.toISOString()]); });
        const at = new Date('2026-11-13T15:00:00Z');

        const { award } = await GamificationService.recordQuizCompletion(quiz(at));
        parar();

        expect(ganhos).toEqual([[award.totalXpAwarded, at.toISOString()]]);
    });

    it('aula da rota legada /quiz (countsForLeague: false) soma no XP, mas não avisa a liga', async () => {
        const ganhos: number[] = [];
        const parar = GamificationService.onXpEarned(xp => { ganhos.push(xp); });
        const { snapshot, award } = await GamificationService.recordQuizCompletion(quiz(new Date('2026-11-13T15:00:00Z')), { countsForLeague: false });
        parar();
        expect(snapshot.totalXp).toBe(award.totalXpAwarded);
        expect(ganhos).toEqual([]);
    });

    it('avisa o XP manual (revisão, missão)', async () => {
        const ganhos: number[] = [];
        const parar = GamificationService.onXpEarned(xp => { ganhos.push(xp); });

        await GamificationService.addManualXp(5);
        parar();

        expect(ganhos).toEqual([5]);
    });

    it('restaurar backup e zerar não são ganho', async () => {
        const ganhos: number[] = [];
        const parar = GamificationService.onXpEarned(xp => { ganhos.push(xp); });

        await GamificationService.absorbBackup({ totalXp: 900, streakDays: 3 });
        await GamificationService.reset();
        parar();

        expect(ganhos).toEqual([]);
    });

    it('quem para de ouvir não recebe mais, e um ouvinte que falha não derruba o XP', async () => {
        const ganhos: number[] = [];
        const pararQuebrado = GamificationService.onXpEarned(() => { throw new Error('liga fora'); });
        const parar = GamificationService.onXpEarned(xp => { ganhos.push(xp); });

        const snapshot = await GamificationService.addManualXp(7);
        parar();
        pararQuebrado();
        await GamificationService.addManualXp(3);

        expect(snapshot.totalXp).toBe(7);
        expect(ganhos).toEqual([7]);
    });
});
