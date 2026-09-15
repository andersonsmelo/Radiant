import AsyncStorage from '@react-native-async-storage/async-storage';

import { GamificationService } from './GamificationService';

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
