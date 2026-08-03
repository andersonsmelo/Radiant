# Primeiro uso (Pixel + tutorial) — Plano de implementação

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fazer a primeira abertura do app apresentar o mascote Pixel e explicar o método de estudo em três telas puláveis, antes da Learning Road.

**Architecture:** Um domínio novo `src/features/first-run/`, separado do `onboarding/` (que é coach de 7 dias, não primeiro uso). O `_layout.tsx` curto-circuita o `<Stack>` para renderizar a apresentação, no mesmo padrão que ele já usa para o `BetaGateScreen`. A ausência da chave `@radiant/first_run_v1` no AsyncStorage é o gatilho, o que faz instalações já existentes verem a apresentação uma vez sem nenhum código de migração.

**Tech Stack:** React Native + Expo (expo-router), TypeScript, AsyncStorage, react-native-reanimated, Jest + @testing-library/react-native, Maestro para E2E.

**Spec de origem:** [`2026-08-02-primeiro-uso-e-conta-design.md`](../specs/2026-08-02-primeiro-uso-e-conta-design.md). Este plano cobre **apenas a Parte 1**. A Parte 2 (conta, login, Google/Apple) é especificação e não entra aqui.

## Global Constraints

- **Diretório de trabalho:** todos os comandos rodam de `radiant-app/`.
- **Testes:** `EXPO_NO_DOTENV=1 CI=1 npm test -- --runInBand --no-cache`. Um teste isolado: acrescente `-t "<nome do teste>"`.
- **Cópia em pt-BR, verbatim do spec.** Nenhuma frase pode ser reescrita "para ficar melhor" — a cópia foi alinhada à ficha da loja e divergência entre app e ficha é o que a revisão das lojas compara.
- **Nenhuma promessa que o binário não cumpre.** Nada de conta, login, cadastro, premium ou sincronização nas três telas.
- **Movimento:** a apresentação **não anima nada** — a troca de tela é uma troca de estado, sem transição. É assim que ela satisfaz Reduce Motion por construção, já que a verificação é por estabilidade de quadros (screenshots consecutivos byte-idênticos). Se alguém acrescentar movimento depois, aí sim é obrigatório usar o hook existente `useReducedMotionPreference` de `src/ui/accessibility/useReducedMotionPreference` para desligá-lo — e acrescentar um teste que prove o desligamento.
- **Alvo de toque:** o botão "Pular" tem alvo mínimo de 44pt. Discreto no visual, nunca no alvo.
- **Indentação:** 4 espaços em `src/features/**`, 2 espaços em `src/app/**` e `src/components/**` — é o que cada árvore já usa.
- **`AppButton`** vem de `src/components/ui/AppButton` e recebe `label`, `onPress`, `variant` (`'primary' | 'galaxy' | 'secondary' | 'ghost'`), `fullWidth`, `accessibilityLabel`.
- **`renderWithProviders`** vem de `src/test/renderWithProviders` e é obrigatório em teste de componente — ele injeta o `SafeAreaProvider`.
- **Loop:** cada task é um run próprio (`loop run start` → `context build` → `step begin --files ...` → editar → `loop validate` → `step finish` → `run close`). Declare **todos** os arquivos da task, inclusive os que serão criados.

---

### Task 1: Helper compartilhado de props de loja

O `OnboardingService` tem `getAppStoreProps` privado, e o `FirstRunService` precisa das mesmas props. Copiar criaria duas listas que precisam concordar e não têm dono. Extrair primeiro, para que a Task 2 já consuma o helper.

**Files:**
- Create: `src/features/telemetry/appStoreProps.ts`
- Create: `src/features/telemetry/appStoreProps.test.ts`
- Modify: `src/features/onboarding/OnboardingService.ts` (remove os três métodos privados `getAppStoreProps`, `resolveLocale`, `resolveMarket` e passa a importar o helper)

**Interfaces:**
- Consumes: nada.
- Produces: `resolveAppStoreProps(entrySurface: string): Record<string, string>` — devolve `{ locale, market, entry_surface, build_channel }` usando as chaves de `TelemetryPropKeys`.

- [ ] **Step 1: Escrever o teste que falha**

Crie `src/features/telemetry/appStoreProps.test.ts`:

```ts
import { resolveAppStoreProps } from './appStoreProps';

describe('resolveAppStoreProps', () => {
    it('devolve locale, market, entry_surface e build_channel', () => {
        const props = resolveAppStoreProps('first_run');

        expect(props).toEqual(
            expect.objectContaining({
                entry_surface: 'first_run',
                build_channel: expect.any(String),
                locale: expect.any(String),
                market: expect.any(String),
            })
        );
    });

    it('deriva o market da região do locale', () => {
        const spy = jest
            .spyOn(Intl, 'DateTimeFormat')
            .mockReturnValue({
                resolvedOptions: () => ({ locale: 'pt-BR' }),
            } as unknown as Intl.DateTimeFormat);

        expect(resolveAppStoreProps('first_run').market).toBe('BR');

        spy.mockRestore();
    });

    it('não quebra quando o locale não tem região', () => {
        const spy = jest
            .spyOn(Intl, 'DateTimeFormat')
            .mockReturnValue({
                resolvedOptions: () => ({ locale: 'pt' }),
            } as unknown as Intl.DateTimeFormat);

        expect(resolveAppStoreProps('first_run').market).toBe('unknown');

        spy.mockRestore();
    });
});
```

- [ ] **Step 2: Rodar e ver falhar**

```bash
EXPO_NO_DOTENV=1 CI=1 npm test -- --runInBand --no-cache -t "resolveAppStoreProps"
```

Esperado: FAIL — `Cannot find module './appStoreProps'`.

- [ ] **Step 3: Implementar o helper**

Crie `src/features/telemetry/appStoreProps.ts`:

```ts
import { TelemetryPropKeys } from './telemetry.constants';
import { AppConfig } from '../../config';

function resolveLocale(): string {
    try {
        return Intl.DateTimeFormat().resolvedOptions().locale || 'unknown';
    } catch {
        return 'unknown';
    }
}

function resolveMarket(locale: string): string {
    const [, region] = locale.split('-');
    return region?.toUpperCase() ?? 'unknown';
}

/**
 * Props de loja anexadas a eventos de superfícies de aquisição.
 * Vive aqui, e não dentro de um serviço, porque mais de uma superfície
 * precisa da mesma lista — duas cópias iguais é a forma de elas divergirem.
 */
export function resolveAppStoreProps(entrySurface: string): Record<string, string> {
    const locale = resolveLocale();

    return {
        [TelemetryPropKeys.LOCALE]: locale,
        [TelemetryPropKeys.MARKET]: resolveMarket(locale),
        [TelemetryPropKeys.ENTRY_SURFACE]: entrySurface,
        [TelemetryPropKeys.BUILD_CHANNEL]: AppConfig.APP_ENV,
    };
}
```

- [ ] **Step 4: Rodar e ver passar**

```bash
EXPO_NO_DOTENV=1 CI=1 npm test -- --runInBand --no-cache -t "resolveAppStoreProps"
```

Esperado: PASS, 3 testes.

- [ ] **Step 5: Migrar o OnboardingService para o helper**

Em `src/features/onboarding/OnboardingService.ts`: acrescente `import { resolveAppStoreProps } from '../telemetry/appStoreProps';`, apague os métodos privados `getAppStoreProps`, `resolveLocale` e `resolveMarket`, e troque as **quatro** chamadas `this.getAppStoreProps('onboarding')` por `resolveAppStoreProps('onboarding')`. Remova o import agora órfão de `TelemetryPropKeys` e o de `AppConfig` **apenas se** nenhum outro ponto do arquivo os usar.

- [ ] **Step 6: Rodar a suíte inteira**

```bash
EXPO_NO_DOTENV=1 CI=1 npm test -- --runInBand --no-cache
```

Esperado: PASS. O teste existente `OnboardingService.test.ts` já afirma `entry_surface: 'onboarding'` e `build_channel`, então ele é a rede que prova que a extração não mudou comportamento.

- [ ] **Step 7: Commit**

```bash
git add src/features/telemetry/appStoreProps.ts src/features/telemetry/appStoreProps.test.ts src/features/onboarding/OnboardingService.ts
git commit -m "refactor(telemetry): extrai props de loja para helper compartilhado"
```

---

### Task 2: FirstRunService

**Files:**
- Create: `src/features/first-run/first-run.types.ts`
- Create: `src/features/first-run/FirstRunService.ts`
- Create: `src/features/first-run/FirstRunService.test.ts`

**Interfaces:**
- Consumes: `resolveAppStoreProps(entrySurface: string)` da Task 1; `OnboardingService.dismissIntro(): Promise<void>` (já existe).
- Produces:
  - `type FirstRunExitReason = 'completed' | 'skipped'`
  - `interface FirstRunState { seenAt: number | null; exitedAt: number | null; exitReason: FirstRunExitReason | null; exitStep: number | null }`
  - `FirstRunService.bootstrap(): Promise<void>`
  - `FirstRunService.shouldShowWelcome(): boolean`
  - `FirstRunService.markStepViewed(step: number): void`
  - `FirstRunService.markSeen(reason: FirstRunExitReason, step: number): Promise<void>`
  - `FirstRunService.resetForTests(): Promise<void>`

- [ ] **Step 1: Escrever os tipos**

Crie `src/features/first-run/first-run.types.ts`:

```ts
/** Como a pessoa saiu da apresentação de primeiro uso. */
export type FirstRunExitReason = 'completed' | 'skipped';

export interface FirstRunState {
    /** Quando a apresentação foi vista pela primeira vez. */
    seenAt: number | null;

    /** Quando a pessoa saiu (concluindo ou pulando). */
    exitedAt: number | null;

    /** Concluiu as três telas ou pulou. */
    exitReason: FirstRunExitReason | null;

    /** Em qual tela (1..3) a pessoa saiu. Mede a cópia. */
    exitStep: number | null;
}
```

- [ ] **Step 2: Escrever o teste que falha**

Crie `src/features/first-run/FirstRunService.test.ts`:

```ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FirstRunService } from './FirstRunService';
import { TelemetryService } from '../telemetry/TelemetryService';
import { OnboardingService } from '../onboarding/OnboardingService';

jest.mock('@react-native-async-storage/async-storage', () => ({
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
}));

jest.mock('../telemetry/TelemetryService', () => ({
    TelemetryService: { track: jest.fn() },
}));

jest.mock('../onboarding/OnboardingService', () => ({
    OnboardingService: { dismissIntro: jest.fn().mockResolvedValue(undefined) },
}));

const mockedStorage = AsyncStorage as jest.Mocked<typeof AsyncStorage>;
const telemetryTrack = TelemetryService.track as jest.MockedFunction<typeof TelemetryService.track>;
const dismissIntro = OnboardingService.dismissIntro as jest.MockedFunction<
    typeof OnboardingService.dismissIntro
>;

describe('FirstRunService', () => {
    beforeEach(async () => {
        jest.clearAllMocks();
        mockedStorage.getItem.mockResolvedValue(null);
        mockedStorage.setItem.mockResolvedValue();
        mockedStorage.removeItem.mockResolvedValue();
        await FirstRunService.resetForTests();
    });

    it('mostra a apresentação quando a chave não existe', async () => {
        await FirstRunService.bootstrap();

        expect(FirstRunService.shouldShowWelcome()).toBe(true);
        expect(telemetryTrack).toHaveBeenCalledWith(
            'first_run_started',
            expect.objectContaining({ entry_surface: 'first_run' })
        );
    });

    it('não mostra de novo depois de concluir', async () => {
        await FirstRunService.bootstrap();
        await FirstRunService.markSeen('completed', 3);

        expect(FirstRunService.shouldShowWelcome()).toBe(false);
        expect(mockedStorage.setItem).toHaveBeenCalledWith(
            '@radiant/first_run_v1',
            expect.stringContaining('"exitReason":"completed"')
        );
        expect(telemetryTrack).toHaveBeenCalledWith(
            'first_run_completed',
            expect.objectContaining({ step: 3 })
        );
    });

    it('não mostra de novo depois de pular, e registra o passo', async () => {
        await FirstRunService.bootstrap();
        await FirstRunService.markSeen('skipped', 1);

        expect(FirstRunService.shouldShowWelcome()).toBe(false);
        expect(telemetryTrack).toHaveBeenCalledWith(
            'first_run_skipped',
            expect.objectContaining({ step: 1 })
        );
    });

    it('dispensa o card Day-0 ao sair, para não dar boas-vindas duas vezes', async () => {
        await FirstRunService.bootstrap();
        await FirstRunService.markSeen('completed', 3);

        expect(dismissIntro).toHaveBeenCalledTimes(1);
    });

    it('mostra uma vez para instalação antiga, que não tem a chave nova', async () => {
        mockedStorage.getItem.mockResolvedValue(null);

        await FirstRunService.bootstrap();

        expect(FirstRunService.shouldShowWelcome()).toBe(true);
    });

    it('não mostra quando a chave já existe com saída registrada', async () => {
        mockedStorage.getItem.mockResolvedValue(
            JSON.stringify({ seenAt: 1, exitedAt: 2, exitReason: 'skipped', exitStep: 2 })
        );

        await FirstRunService.bootstrap();

        expect(FirstRunService.shouldShowWelcome()).toBe(false);
    });

    it('não trava a abertura quando a leitura do armazenamento falha', async () => {
        mockedStorage.getItem.mockRejectedValue(new Error('storage indisponível'));

        await expect(FirstRunService.bootstrap()).resolves.toBeUndefined();
        expect(FirstRunService.shouldShowWelcome()).toBe(true);
    });

    it('emite um evento por tela vista', async () => {
        await FirstRunService.bootstrap();
        FirstRunService.markStepViewed(2);

        expect(telemetryTrack).toHaveBeenCalledWith(
            'first_run_step_viewed',
            expect.objectContaining({ step: 2 })
        );
    });
});
```

- [ ] **Step 3: Rodar e ver falhar**

```bash
EXPO_NO_DOTENV=1 CI=1 npm test -- --runInBand --no-cache -t "FirstRunService"
```

Esperado: FAIL — `Cannot find module './FirstRunService'`.

- [ ] **Step 4: Implementar o serviço**

Crie `src/features/first-run/FirstRunService.ts`:

```ts
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
```

- [ ] **Step 5: Rodar e ver passar**

```bash
EXPO_NO_DOTENV=1 CI=1 npm test -- --runInBand --no-cache -t "FirstRunService"
```

Esperado: PASS, 8 testes.

- [ ] **Step 6: Commit**

```bash
git add src/features/first-run/
git commit -m "feat(first-run): registra o estado da apresentacao de primeiro uso"
```

---

### Task 3: WelcomeFlowScreen e WelcomeSlide

A tela é **componente puro de apresentação**: não lê nem grava estado, só chama `onFinish`. É isso que permite montá-la em dois lugares (o gate do `_layout` e o "Rever apresentação" em Progresso) sem duplicar código.

**Files:**
- Create: `src/features/first-run/components/WelcomeSlide.tsx`
- Create: `src/features/first-run/screens/WelcomeFlowScreen.tsx`
- Create: `src/features/first-run/screens/WelcomeFlowScreen.flow.test.tsx`

**Interfaces:**
- Consumes: `FirstRunExitReason` da Task 2; `AppButton` de `src/components/ui/AppButton`; `PixelIllustration` e `CharacterSize` de `src/ui/characters/`; `space`, `typography` de `src/ui/styles`; `galaxyColors` de `src/ui/theme`.
- Produces: `WelcomeFlowScreen({ onFinish, onStepViewed }: { onFinish: (reason: FirstRunExitReason, step: number) => void; onStepViewed?: (step: number) => void })`.

- [ ] **Step 1: Escrever o teste que falha**

Crie `src/features/first-run/screens/WelcomeFlowScreen.flow.test.tsx`:

```tsx
import React from 'react';
import { fireEvent, screen } from '@testing-library/react-native';
import { renderWithProviders } from '../../../test/renderWithProviders';
import WelcomeFlowScreen from './WelcomeFlowScreen';

describe('WelcomeFlowScreen', () => {
    it('abre na apresentação do Pixel', () => {
        renderWithProviders(<WelcomeFlowScreen onFinish={jest.fn()} />);

        expect(screen.getByText('Oi, eu sou o Pixel.')).toBeTruthy();
    });

    it('avança pelas três telas até o botão Começar', () => {
        renderWithProviders(<WelcomeFlowScreen onFinish={jest.fn()} />);

        fireEvent.press(screen.getByLabelText('Continuar'));
        expect(screen.getByText('Trilha, quiz e revisão.')).toBeTruthy();

        fireEvent.press(screen.getByLabelText('Continuar'));
        expect(screen.getByText('Funciona offline, sem conta.')).toBeTruthy();
        expect(screen.getByLabelText('Começar')).toBeTruthy();
    });

    it('mostra o disclaimer educacional na última tela', () => {
        renderWithProviders(<WelcomeFlowScreen onFinish={jest.fn()} />);

        fireEvent.press(screen.getByLabelText('Continuar'));
        fireEvent.press(screen.getByLabelText('Continuar'));

        expect(
            screen.getByText(
                'Radiant é um app educacional. Não substitui avaliação, diagnóstico ou conduta médica profissional.'
            )
        ).toBeTruthy();
    });

    it('conclui com o motivo completed no passo 3', () => {
        const onFinish = jest.fn();
        renderWithProviders(<WelcomeFlowScreen onFinish={onFinish} />);

        fireEvent.press(screen.getByLabelText('Continuar'));
        fireEvent.press(screen.getByLabelText('Continuar'));
        fireEvent.press(screen.getByLabelText('Começar'));

        expect(onFinish).toHaveBeenCalledWith('completed', 3);
    });

    it('pula da primeira tela registrando o passo 1', () => {
        const onFinish = jest.fn();
        renderWithProviders(<WelcomeFlowScreen onFinish={onFinish} />);

        fireEvent.press(screen.getByLabelText('Pular apresentação'));

        expect(onFinish).toHaveBeenCalledWith('skipped', 1);
    });

    it('pula da última tela registrando o passo 3', () => {
        const onFinish = jest.fn();
        renderWithProviders(<WelcomeFlowScreen onFinish={onFinish} />);

        fireEvent.press(screen.getByLabelText('Continuar'));
        fireEvent.press(screen.getByLabelText('Continuar'));
        fireEvent.press(screen.getByLabelText('Pular apresentação'));

        expect(onFinish).toHaveBeenCalledWith('skipped', 3);
    });

    it('avisa cada tela vista, para a telemetria medir onde a pessoa sai', () => {
        const onStepViewed = jest.fn();
        renderWithProviders(<WelcomeFlowScreen onFinish={jest.fn()} onStepViewed={onStepViewed} />);

        expect(onStepViewed).toHaveBeenCalledWith(1);

        fireEvent.press(screen.getByLabelText('Continuar'));
        expect(onStepViewed).toHaveBeenCalledWith(2);
    });
});
```

- [ ] **Step 2: Rodar e ver falhar**

```bash
EXPO_NO_DOTENV=1 CI=1 npm test -- --runInBand --no-cache -t "WelcomeFlowScreen"
```

Esperado: FAIL — `Cannot find module './WelcomeFlowScreen'`.

- [ ] **Step 3: Implementar o slide**

Crie `src/features/first-run/components/WelcomeSlide.tsx`:

```tsx
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { PixelIllustration } from '../../../ui/characters/PixelIllustration';
import type { CharacterSize } from '../../../ui/characters/types';
import { space, typography } from '../../../ui/styles';
import { galaxyColors } from '../../../ui/theme';

interface WelcomeSlideProps {
    title: string;
    body: string;
    /** Texto legal opcional, menor e secundário. */
    footnote?: string;
    pixelSize: CharacterSize;
    pixelAccessibilityLabel: string;
    stepLabel: string;
}

export function WelcomeSlide({
    title,
    body,
    footnote,
    pixelSize,
    pixelAccessibilityLabel,
    stepLabel,
}: WelcomeSlideProps) {
    return (
        <View style={styles.slide} accessible accessibilityLabel={stepLabel}>
            <PixelIllustration
                state="guide"
                size={pixelSize}
                tier="starter"
                accessibilityLabel={pixelAccessibilityLabel}
            />
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.body}>{body}</Text>
            {footnote ? <Text style={styles.footnote}>{footnote}</Text> : null}
        </View>
    );
}

const styles = StyleSheet.create({
    slide: {
        alignItems: 'center',
        gap: space.s2,
        paddingHorizontal: space.s3,
    },
    title: {
        ...typography.h2,
        color: galaxyColors.textPrimary,
        textAlign: 'center',
    },
    body: {
        ...typography.bodyRegular,
        color: galaxyColors.textSecondary,
        textAlign: 'center',
    },
    footnote: {
        ...typography.micro,
        color: galaxyColors.textSecondary,
        textAlign: 'center',
        marginTop: space.s2,
    },
});
```

- [ ] **Step 4: Implementar a tela**

Crie `src/features/first-run/screens/WelcomeFlowScreen.tsx`. A cópia é verbatim do spec — não reescreva:

```tsx
import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WelcomeSlide } from '../components/WelcomeSlide';
import type { FirstRunExitReason } from '../first-run.types';
import { AppButton } from '../../../components/ui/AppButton';
import type { CharacterSize } from '../../../ui/characters/types';
import { space, typography } from '../../../ui/styles';
import { galaxyColors } from '../../../ui/theme';

interface SlideSpec {
    title: string;
    body: string;
    footnote?: string;
    cta: string;
    pixelSize: CharacterSize;
    pixelAccessibilityLabel: string;
}

// Cópia alinhada à ficha das lojas (docs/store/textos-loja-pt-BR.md). Alterar
// aqui sem alterar lá cria divergência entre o app e o que a revisão de loja lê.
const SLIDES: SlideSpec[] = [
    {
        title: 'Oi, eu sou o Pixel.',
        body: 'Vou estudar radiologia com você, em sessões curtas e no seu ritmo.',
        cta: 'Continuar',
        pixelSize: 'lg',
        pixelAccessibilityLabel: 'Pixel, o mascote do Radiant, acenando',
    },
    {
        title: 'Trilha, quiz e revisão.',
        body:
            'Você segue uma trilha guiada, responde quizzes curtos, e o que ainda não fixou volta na hora certa para revisar.',
        cta: 'Continuar',
        pixelSize: 'md',
        pixelAccessibilityLabel: 'Pixel apontando para a trilha de estudo',
    },
    {
        title: 'Funciona offline, sem conta.',
        body: 'Seu progresso fica no seu aparelho. Comece agora, sem cadastro.',
        footnote:
            'Radiant é um app educacional. Não substitui avaliação, diagnóstico ou conduta médica profissional.',
        cta: 'Começar',
        pixelSize: 'md',
        pixelAccessibilityLabel: 'Pixel pronto para começar',
    },
];

interface WelcomeFlowScreenProps {
    onFinish: (reason: FirstRunExitReason, step: number) => void;
    onStepViewed?: (step: number) => void;
}

export default function WelcomeFlowScreen({ onFinish, onStepViewed }: WelcomeFlowScreenProps) {
    const [index, setIndex] = useState(0);
    const step = index + 1;
    const slide = SLIDES[index];
    const isLast = index === SLIDES.length - 1;

    useEffect(() => {
        onStepViewed?.(step);
    }, [step, onStepViewed]);

    const handleAdvance = () => {
        if (isLast) {
            onFinish('completed', step);
            return;
        }
        setIndex((current) => current + 1);
    };

    return (
        <SafeAreaView style={styles.screen}>
            <View style={styles.header}>
                <Pressable
                    onPress={() => onFinish('skipped', step)}
                    accessibilityRole="button"
                    accessibilityLabel="Pular apresentação"
                    hitSlop={{ top: 12, bottom: 12, left: 16, right: 16 }}
                    style={styles.skip}
                >
                    <Text style={styles.skipLabel}>Pular</Text>
                </Pressable>
            </View>

            <View style={styles.content}>
                <WelcomeSlide
                    title={slide.title}
                    body={slide.body}
                    footnote={slide.footnote}
                    pixelSize={slide.pixelSize}
                    pixelAccessibilityLabel={slide.pixelAccessibilityLabel}
                    stepLabel={`Tela ${step} de ${SLIDES.length}`}
                />
            </View>

            <View style={styles.footer}>
                <View style={styles.dots} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
                    {SLIDES.map((item, dotIndex) => (
                        <View
                            key={item.title}
                            style={[styles.dot, dotIndex === index && styles.dotActive]}
                        />
                    ))}
                </View>
                <AppButton label={slide.cta} onPress={handleAdvance} variant="galaxy" />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: galaxyColors.background,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingHorizontal: space.s3,
        paddingTop: space.s2,
    },
    skip: {
        // 44pt de alvo, independente do tamanho do texto: discreto no visual,
        // nunca no alvo de toque.
        minHeight: 44,
        minWidth: 44,
        alignItems: 'flex-end',
        justifyContent: 'center',
    },
    skipLabel: {
        ...typography.caption,
        color: galaxyColors.textSecondary,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
    },
    footer: {
        gap: space.s3,
        paddingHorizontal: space.s3,
        paddingBottom: space.s3,
    },
    dots: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: space.s1,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: galaxyColors.textSecondary,
        opacity: 0.35,
    },
    dotActive: {
        opacity: 1,
    },
});
```

- [ ] **Step 5: Rodar e ver passar**

```bash
EXPO_NO_DOTENV=1 CI=1 npm test -- --runInBand --no-cache -t "WelcomeFlowScreen"
```

Esperado: PASS, 7 testes.

Os tokens usados acima foram verificados no repositório e existem com estes nomes exatos: `typography.h2`, `typography.bodyRegular`, `typography.caption`, `typography.micro`, `space.s1`, `space.s2`, `space.s3`, `galaxyColors.background`, `galaxyColors.textPrimary`, `galaxyColors.textSecondary`. Não substitua nenhum por valor literal.

- [ ] **Step 6: Commit**

```bash
git add src/features/first-run/components/ src/features/first-run/screens/
git commit -m "feat(first-run): apresenta o Pixel e o metodo em tres telas pulaveis"
```

---

### Task 4: Gate no `_layout`

**Files:**
- Modify: `src/app/_layout.tsx`

**Interfaces:**
- Consumes: `FirstRunService` (Task 2) e `WelcomeFlowScreen` (Task 3).
- Produces: nada para tasks seguintes.

- [ ] **Step 1: Ligar o bootstrap**

Em `src/app/_layout.tsx`, acrescente os imports:

```tsx
import { FirstRunService } from '../features/first-run/FirstRunService';
import WelcomeFlowScreen from '../features/first-run/screens/WelcomeFlowScreen';
```

Acrescente o estado, junto dos outros `useState` já existentes:

```tsx
const [showWelcome, setShowWelcome] = useState(false);
```

Dentro de `bootstrapApp`, inclua o serviço no `Promise.all` que já existe e leia o resultado logo depois:

```tsx
await Promise.all([
  AuthService.bootstrap(),
  LessonCatalogService.bootstrap(),
  FirstRunService.bootstrap(),
]);
if (!active) {
  return;
}

setShowWelcome(FirstRunService.shouldShowWelcome());
```

- [ ] **Step 2: Inserir o gate na ordem certa**

Logo **depois** do bloco `if (shouldEnforceBetaGate && !isBetaUnlocked)` e **antes** do `return` que monta o `<Stack>`, insira:

```tsx
  // Ordem: loading → error → beta gate → apresentação → Stack. O beta gate vem
  // antes porque é controle de acesso: não se apresenta o produto a quem ainda
  // não foi liberado a entrar.
  if (showWelcome) {
    return (
      <ThemeProvider value={navigationTheme}>
        <WelcomeFlowScreen
          onFinish={(reason, step) => {
            void FirstRunService.markSeen(reason, step);
            setShowWelcome(false);
          }}
          onStepViewed={(step) => FirstRunService.markStepViewed(step)}
        />
        <StatusBar style="dark" />
      </ThemeProvider>
    );
  }
```

- [ ] **Step 3: Rodar a suíte inteira**

```bash
EXPO_NO_DOTENV=1 CI=1 npm test -- --runInBand --no-cache
```

Esperado: PASS. Se algum teste de tela quebrar aqui, é sinal de que ele montava o `_layout` — leia a falha antes de mudar qualquer coisa.

- [ ] **Step 4: Rodar lint e tipos**

```bash
EXPO_NO_DOTENV=1 CI=1 npm run quality
```

Esperado: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/app/_layout.tsx
git commit -m "feat(first-run): intercepta a abertura com a apresentacao do Pixel"
```

---

### Task 5: Reentrada em Progresso e regressão do card Day-0

**Files:**
- Modify: `src/features/progress/screens/ProgressScreen.tsx`
- Create: `src/features/first-run/screens/WelcomeFlowReentry.test.tsx`

**Interfaces:**
- Consumes: `WelcomeFlowScreen` (Task 3).
- Produces: nada.

- [ ] **Step 1: Escrever o teste de regressão que falha**

Crie `src/features/first-run/screens/WelcomeFlowReentry.test.tsx`:

```tsx
import React from 'react';
import { fireEvent, screen } from '@testing-library/react-native';
import { renderWithProviders } from '../../../test/renderWithProviders';
import WelcomeFlowScreen from './WelcomeFlowScreen';

describe('Rever apresentação', () => {
    it('não grava estado ao ser revista: quem chama decide o que fazer no fim', () => {
        const onFinish = jest.fn();
        renderWithProviders(<WelcomeFlowScreen onFinish={onFinish} />);

        fireEvent.press(screen.getByLabelText('Pular apresentação'));

        // A tela é apresentação pura: o único efeito é o callback. É isso que
        // permite montá-la no gate (que grava) e em Progresso (que não grava).
        expect(onFinish).toHaveBeenCalledTimes(1);
        expect(onFinish).toHaveBeenCalledWith('skipped', 1);
    });
});
```

- [ ] **Step 2: Rodar e ver passar**

```bash
EXPO_NO_DOTENV=1 CI=1 npm test -- --runInBand --no-cache -t "Rever apresentação"
```

Esperado: PASS — este teste passa de primeira porque trava por escrito a propriedade que a Task 3 já entregou. Ele existe para que uma refatoração futura que faça a tela gravar estado sozinha quebre aqui, e não em produção.

- [ ] **Step 3: Adicionar a entrada em Progresso**

Em `src/features/progress/screens/ProgressScreen.tsx`, acrescente os imports:

```tsx
import { Modal } from 'react-native';
import WelcomeFlowScreen from '../../first-run/screens/WelcomeFlowScreen';
```

Acrescente o estado junto dos demais `useState` da tela:

```tsx
const [showWelcomeReplay, setShowWelcomeReplay] = useState(false);
```

Dentro do conteúdo da tela, na seção onde já ficam as ações de conta/ajustes, acrescente o botão e o modal:

```tsx
<AppButton
  label="Rever apresentação"
  variant="ghost"
  onPress={() => setShowWelcomeReplay(true)}
/>

<Modal
  visible={showWelcomeReplay}
  animationType="slide"
  onRequestClose={() => setShowWelcomeReplay(false)}
>
  {/* Aqui `onFinish` só fecha: rever não pode reescrever o estado de primeiro uso. */}
  <WelcomeFlowScreen onFinish={() => setShowWelcomeReplay(false)} />
</Modal>
```

- [ ] **Step 4: Rodar a suíte inteira**

```bash
EXPO_NO_DOTENV=1 CI=1 npm test -- --runInBand --no-cache
```

Esperado: PASS. O `ProgressScreen.flow.test.tsx` já existe e é a rede que prova que a tela continua montando.

- [ ] **Step 5: Rodar lint e tipos**

```bash
EXPO_NO_DOTENV=1 CI=1 npm run quality
```

Esperado: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/features/progress/screens/ProgressScreen.tsx src/features/first-run/screens/WelcomeFlowReentry.test.tsx
git commit -m "feat(first-run): permite rever a apresentacao pela aba de progresso"
```

---

### Task 6: Adaptar os flows Maestro

Os quatro flows existentes rodam `clearState: true` e passam a bater no gate. Sem esta task, os quatro quebram na primeira asserção — e a quebra seria lida como regressão, não como consequência prevista.

**Files:**
- Create: `.maestro/subflows/dismiss-first-run.yaml`
- Create: `.maestro/first-run.yaml`
- Modify: `.maestro/boot-to-home.yaml` (nome e passo)
- Modify: `.maestro/learning-critical-path.yaml` (passo)
- Modify: `.maestro/offline-relaunch.yaml` (passo)
- Modify: `.maestro/store-capture.yaml` (passo)

**Interfaces:**
- Consumes: os rótulos de acessibilidade da Task 3 — `Pular apresentação`, `Continuar`, `Começar`.
- Produces: nada.

- [ ] **Step 1: Criar o subflow de dispensa**

Crie `.maestro/subflows/dismiss-first-run.yaml`:

```yaml
appId: com.ascendcreative.radiant
name: Dispensa a apresentação de primeiro uso
---
# Condicional de propósito: os flows que já rodaram uma vez sem clearState não
# veem a apresentação, e um tapOn incondicional falharia neles.
- runFlow:
    when:
      visible: 'Pular apresentação'
    commands:
      - tapOn: 'Pular apresentação'
```

- [ ] **Step 2: Incluir o subflow nos quatro flows**

Em **cada um** de `boot-to-home.yaml`, `learning-critical-path.yaml`, `offline-relaunch.yaml` e `store-capture.yaml`, logo **depois** do bloco que trata o menu de desenvolvedor e **antes** da primeira asserção do flow, insira:

```yaml
- runFlow: subflows/dismiss-first-run.yaml
```

- [ ] **Step 3: Renomear o flow que ficou falso**

Em `.maestro/boot-to-home.yaml`, troque a linha `name:`:

```yaml
name: Clean install passes through the first-run welcome and reaches the local-first home
```

O nome antigo — *"Clean install boots straight to the local-first home"* — afirmava que a instalação limpa ia **direto** para a home. Isso deixou de ser verdade sobre o binário, e um nome falso num flow verde é pior que um flow vermelho.

- [ ] **Step 4: Criar o flow dedicado do primeiro uso**

Crie `.maestro/first-run.yaml`:

```yaml
appId: com.ascendcreative.radiant
name: First-run welcome presents Pixel and reaches the home
tags:
  - smoke
  - first-run
---
- launchApp:
    clearState: true
    permissions:
      all: deny
- runFlow:
    when:
      visible: 'http://localhost:8081'
    commands:
      - tapOn: 'http://localhost:8081'
- runFlow:
    when:
      visible: 'This is the developer menu. It gives you access to useful tools in your development builds.'
    commands:
      - tapOn: Continue
- assertVisible: 'Oi, eu sou o Pixel.'
- tapOn: 'Continuar'
- assertVisible: 'Trilha, quiz e revisão.'
- tapOn: 'Continuar'
- assertVisible: 'Funciona offline, sem conta.'
- assertVisible: 'Radiant é um app educacional. Não substitui avaliação, diagnóstico ou conduta médica profissional.'
- tapOn: 'Começar'
- assertNotVisible: 'Oi, eu sou o Pixel.'
```

> **Correção de 2026-08-02 — não acrescente a asserção do card Day-0.**
> Uma versão anterior deste passo mandava fechar o flow com
> `assertNotVisible: 'Bem-vindo ao Radiant'`, apresentada como prova de ponta a
> ponta de que o card Day-0 não recebe a pessoa uma segunda vez. Medição
> posterior mostrou que essa asserção **passaria vacuamente**:
> `ENABLE_LEARNING_ROAD` é `true` por default e nos quatro perfis do `eas.json`,
> então a `HomeScreen` clássica — única consumidora do card — nunca renderiza. O
> texto não estaria na tela porque a tela inteira não existe, e não porque a
> apresentação o dispensou. Uma asserção que passa pelo motivo errado é pior que
> nenhuma: cria confiança sem cobertura. Se essa proteção for desejada no futuro,
> ela exige um caso que force `ENABLE_LEARNING_ROAD=false`. Ver
> [`ADR-2026-08-02`](../../adr/ADR-2026-08-02-apresentacao-de-primeiro-uso.md).

- [ ] **Step 5: Rodar os flows**

Do diretório `radiant-app/`, com um emulador/simulador ativo, seguindo o [`E2E_RUNBOOK.md`](../../../radiant-app/docs/E2E_RUNBOOK.md). Rode **sequencialmente**, nunca em paralelo — suítes de automação de dispositivo concorrendo no mesmo host produzem flakiness por contenção.

Esperado: os cinco flows passam.

- [ ] **Step 6: Commit**

```bash
git add .maestro/
git commit -m "test(e2e): adapta os flows a apresentacao de primeiro uso"
```

---

## Depois do plano

Quando as seis tasks fecharem, o trabalho ainda **não está sinalizado**. O `AGENTS.md` deste projeto é explícito: trabalho não sinalizado é tratado como não feito pelas próximas sessões de IA. Antes de encerrar:

1. Marcar o item correspondente no roadmap ativo, no mesmo run que entrega o trabalho.
2. Registrar em `docs/EXECUTION_STATUS_<data>.md` que a abertura do app mudou, dizendo qual documento isso substitui.
3. Considerar um ADR: a decisão de **reintroduzir uma apresentação de primeiro uso** contraria a recomendação registrada na B6 (que mandou remover o wizard e ficar só com o onboarding suave). A B6 pedia confirmação do dono, e a confirmação aconteceu nesta sessão — mas ela precisa existir em documento, não só no histórico da conversa.
