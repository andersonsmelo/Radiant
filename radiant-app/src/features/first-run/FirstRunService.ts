import AsyncStorage from '@react-native-async-storage/async-storage';
import type { FirstRunExitReason, FirstRunState } from './first-run.types';
import { TelemetryService } from '../telemetry/TelemetryService';
import { resolveAppStoreProps } from '../telemetry/appStoreProps';
import { OnboardingService } from '../onboarding/OnboardingService';

const STORE_KEY = '@radiant/first_run_v1';
const ENTRY_SURFACE = 'first_run';

const DEFAULT_STATE: FirstRunState = {
    seenAt: null,
    exitedAt: null,
    exitReason: null,
    exitStep: null,
};

class FirstRunServiceImpl {
    private state: FirstRunState = { ...DEFAULT_STATE };
    private initialized = false;

    /**
     * A AUSÊNCIA da chave é o gatilho. É isso que faz uma instalação antiga —
     * que já tem estado de onboarding gravado, mas nunca teve esta chave —
     * ver a apresentação exatamente uma vez, sem código de migração.
     */
    async bootstrap(): Promise<void> {
        if (this.initialized) return;

        try {
            const stored = await AsyncStorage.getItem(STORE_KEY);
            if (stored) {
                this.state = { ...DEFAULT_STATE, ...(JSON.parse(stored) as Partial<FirstRunState>) };
            } else {
                this.state = { ...DEFAULT_STATE };
            }
        } catch (error) {
            // Falha de leitura não pode travar a abertura do app. Tratar como
            // não vista é o lado seguro: no pior caso a pessoa vê de novo.
            console.error('[FirstRunService] Falha ao ler o estado:', error);
            this.state = { ...DEFAULT_STATE };
        }

        this.initialized = true;

        if (this.shouldShowWelcome()) {
            void TelemetryService.track('first_run_started', resolveAppStoreProps(ENTRY_SURFACE));
        }
    }

    shouldShowWelcome(): boolean {
        return this.state.exitedAt === null;
    }

    markStepViewed(step: number): void {
        void TelemetryService.track('first_run_step_viewed', {
            ...resolveAppStoreProps(ENTRY_SURFACE),
            step,
        });
    }

    async markSeen(reason: FirstRunExitReason, step: number): Promise<void> {
        const now = Date.now();
        this.state = {
            seenAt: this.state.seenAt ?? now,
            exitedAt: now,
            exitReason: reason,
            exitStep: step,
        };

        try {
            await AsyncStorage.setItem(STORE_KEY, JSON.stringify(this.state));
        } catch (error) {
            console.error('[FirstRunService] Falha ao gravar o estado:', error);
        }

        // dismissIntro() grava this.state direto em disco. Sem init() antes,
        // this.state ainda é o DEFAULT_STATE (startedAt: null), e essa gravação
        // seria a primeira da vida do app na chave do onboarding — sequestrando
        // o "first launch ever" que o init() detecta e derrubando onboarding_start,
        // getStage() e o encerramento de Dia 7 para sempre.
        await OnboardingService.init();

        // O card Day-0 da Learning Road dá as mesmas boas-vindas. Sem isto, quem
        // acabou de ver a apresentação é recebido de novo com a mesma frase.
        await OnboardingService.dismissIntro();

        void TelemetryService.track(
            reason === 'completed' ? 'first_run_completed' : 'first_run_skipped',
            { ...resolveAppStoreProps(ENTRY_SURFACE), step }
        );
    }

    async resetForTests(): Promise<void> {
        this.state = { ...DEFAULT_STATE };
        this.initialized = false;
        try {
            await AsyncStorage.removeItem(STORE_KEY);
        } catch {
            // Dublês de teste nem sempre devolvem Promise; ignorar a limpeza.
        }
    }
}

export const FirstRunService = new FirstRunServiceImpl();
