import { Platform } from 'react-native';

import { AppConfig } from '../../config';
import type { HomePrimaryAction } from '../home/home.types';
import type { WidgetSource } from './widgetSnapshot';

/**
 * Ponte entre o estado local e os widgets do iOS (ADR 2026-11-15).
 *
 * Quem muda sequência, meta ou próxima aula chama `refreshWidgets()` depois de
 * gravar. A ponte lê o estado pelos mesmos serviços que a home usa, monta o
 * retrato e grava no App Group, e só então pede a recarga das timelines. Nunca
 * lança: widget desatualizado não pode derrubar o fim de uma aula.
 */
export const WIDGET_APP_GROUP = 'group.com.ascendcreative.radiant.widgets';

type WidgetTarget = { write(value: string): void; reload(): void };

type WidgetBridgeDependencies = {
    enabled: () => boolean;
    readSource: () => Promise<WidgetSource>;
    now: () => Date;
    /** `null` quando o binário não traz o módulo nativo (compilado sem a chave). */
    target: () => WidgetTarget | null;
};

export function createWidgetBridge(deps: WidgetBridgeDependencies) {
    // Uma atualização por vez, cada uma lendo o estado quando roda: sem a fila, uma leitura
    // antiga e lenta gravava por último e o widget ficava com a aula já concluída.
    let tail: Promise<void> = Promise.resolve();
    const run = async (): Promise<void> => {
        if (!deps.enabled()) return;
        const target = deps.target();
        if (!target) return;
        try {
            // Sob demanda: o retrato puxa o StreakFreezeService (e o AsyncStorage), e o `_layout` importa esta ponte.
            // eslint-disable-next-line @typescript-eslint/no-require-imports
            const { buildWidgetSnapshot } = require('./widgetSnapshot') as typeof import('./widgetSnapshot');
            const snapshot = buildWidgetSnapshot(await deps.readSource(), deps.now());
            target.write(JSON.stringify(snapshot));
            target.reload();
        } catch (error) {
            console.warn('[WidgetBridge] Retrato do widget não atualizado:', error);
        }
    };
    return {
        refresh(): Promise<void> {
            tail = tail.then(run);
            return tail;
        },
    };
}

/** A rota que o botão principal da home abriria (`HomeScreen`, `onMissionPress`). */
export function lessonUrl(action: HomePrimaryAction): string {
    if (action.kind === 'review') return 'radiantapp://review';
    if (action.kind === 'learn' && action.nodeId && action.blockId) {
        return `radiantapp://learn?nodeId=${encodeURIComponent(action.nodeId)}&blockId=${encodeURIComponent(action.blockId)}`;
    }
    return 'radiantapp://';
}

async function readLocalSource(): Promise<WidgetSource> {
    // Carregados aqui, e não no topo: os serviços que chamam a ponte estão no grafo da home.
    /* eslint-disable @typescript-eslint/no-require-imports */
    const { GamificationService } = require('../gamification/services/GamificationService') as typeof import('../gamification/services/GamificationService');
    const { StreakFreezeService } = require('../gamification/services/StreakFreezeService') as typeof import('../gamification/services/StreakFreezeService');
    const { DailyGoalService } = require('../daily-goal/services/DailyGoalService') as typeof import('../daily-goal/services/DailyGoalService');
    const { localHomeDashboardService } = require('../home/services/createLocalHomeDashboardService') as typeof import('../home/services/createLocalHomeDashboardService');
    /* eslint-enable @typescript-eslint/no-require-imports */
    const [gamification, freezes, goal, dashboard] = await Promise.all([
        GamificationService.getSnapshot(),
        StreakFreezeService.getFreezes(),
        DailyGoalService.getSnapshot(),
        localHomeDashboardService.getDashboard(),
    ]);
    const mission = dashboard.mission;
    return {
        streakDays: gamification.streakDays,
        lastActiveDate: gamification.lastActiveDate ?? null,
        freezes,
        goalCompleted: goal.completedToday,
        goalTarget: goal.goalPerDay,
        goalDateKey: goal.dateKey,
        nextLesson: mission ? { title: mission.title, url: lessonUrl(mission.action) } : null,
    };
}

const localBridge = createWidgetBridge({
    enabled: () => AppConfig.ENABLE_WIDGETS && Platform.OS === 'ios',
    readSource: readLocalSource,
    now: () => new Date(),
    target: () => {
        // O pod só entra na build com a chave ligada (podspec do módulo); sem ele, `RadiantWidgets` é `null`.
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const { RadiantWidgets } = require('../../../modules/radiant-widgets') as typeof import('../../../modules/radiant-widgets');
        if (!RadiantWidgets) return null;
        return {
            write: (value) => {
                if (!RadiantWidgets.write(WIDGET_APP_GROUP, value)) throw new Error('App Group indisponível');
            },
            reload: () => RadiantWidgets.reloadTimelines(),
        };
    },
});

/** Atualiza os widgets com o estado de agora. Sem efeito fora do iOS ou com `ENABLE_WIDGETS` desligada. */
export function refreshWidgets(): Promise<void> {
    return localBridge.refresh();
}
