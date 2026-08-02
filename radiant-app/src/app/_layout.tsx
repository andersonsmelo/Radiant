import { ThemeProvider } from '@react-navigation/native';
import { useFonts, Sora_400Regular, Sora_500Medium, Sora_600SemiBold, Sora_700Bold, Sora_800ExtraBold } from '@expo-google-fonts/sora';
import { router, Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect, useRef } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import 'react-native-reanimated';

import { BetaService } from '../features/beta/BetaService';
import BetaGateScreen from '../features/beta/screens/BetaGateScreen';
import { AuthService } from '../features/auth/AuthService';
import { LessonCatalogService } from '../features/content/services/LessonCatalogService';
import { FirstRunService } from '../features/first-run/FirstRunService';
import WelcomeFlowScreen from '../features/first-run/screens/WelcomeFlowScreen';
import { SyncQueueService } from '../features/sync/SyncQueueService';
import { TelemetryService } from '../features/telemetry/TelemetryService';
import {
  initializeObservability,
  wrapRootWithObservability,
} from '../features/telemetry/bootstrap';
import { AppConfig } from '../config';
import { AppButton } from '../components/ui/AppButton';
import { SurfaceCard } from '../components/ui/SurfaceCard';
import { galaxyColors, navigationTheme } from '../ui/theme';
import { layout, space, typography } from '../ui/styles';

initializeObservability();
SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  anchor: '(tabs)',
};

function RootLayout() {
  const [fontsLoaded] = useFonts({
    'Sora-Regular': Sora_400Regular,
    'Sora-Medium': Sora_500Medium,
    'Sora-SemiBold': Sora_600SemiBold,
    'Sora-Bold': Sora_700Bold,
    'Sora-ExtraBold': Sora_800ExtraBold,
  });

  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded]);

  const shouldEnforceBetaGate = AppConfig.ENABLE_BETA_GATE && !AppConfig.SHOW_DEV_TOOLS;
  const [isBetaUnlocked, setIsBetaUnlocked] = useState(false);
  const [startupPhase, setStartupPhase] = useState<'loading' | 'ready' | 'error'>('loading');
  const [startupError, setStartupError] = useState<string | null>(null);
  const [bootstrapAttempt, setBootstrapAttempt] = useState(0);
  const [showWelcome, setShowWelcome] = useState(false);
  const firstRunBootstrapRef = useRef<Promise<void> | null>(null);

  useEffect(() => {
    let active = true;

    const bootstrapApp = async () => {
      setStartupPhase('loading');
      setStartupError(null);

      try {
        const granted = shouldEnforceBetaGate ? await BetaService.checkAccess() : true;
        if (!active) {
          return;
        }

        setIsBetaUnlocked(granted);

        // FirstRunService.bootstrap() is cached in a ref rather than invoked
        // inline: a retry re-runs this effect, and calling bootstrap() again
        // before the first call's storage read resolves would fire a second
        // `first_run_started` telemetry event (bootstrap() only guards against
        // re-entrancy after it has already finished once).
        if (!firstRunBootstrapRef.current) {
          firstRunBootstrapRef.current = FirstRunService.bootstrap();
        }

        await Promise.all([
          AuthService.bootstrap(),
          LessonCatalogService.bootstrap(),
          firstRunBootstrapRef.current,
        ]);
        if (!active) {
          return;
        }

        setShowWelcome(FirstRunService.shouldShowWelcome());

        void SyncQueueService.flush();
        void TelemetryService.track('bootstrap_complete', {
          betaGateEnabled: shouldEnforceBetaGate,
        });
        setStartupPhase('ready');
      } catch (error) {
        console.error('[RootLayout] App bootstrap failed:', error);
        if (!active) {
          return;
        }

        void TelemetryService.track('bootstrap_failed', {
          phase: 'root_layout_bootstrap',
          betaGateEnabled: shouldEnforceBetaGate,
          message: error instanceof Error ? error.message : 'unknown_error',
        });
        void TelemetryService.captureError(error, {
          phase: 'root_layout_bootstrap',
          betaGateEnabled: shouldEnforceBetaGate,
        });
        setStartupError(error instanceof Error ? error.message : 'Falha ao iniciar o aplicativo.');
        setStartupPhase('error');
      }
    };

    bootstrapApp();

    return () => {
      active = false;
    };
  }, [bootstrapAttempt, shouldEnforceBetaGate]);

  if (!fontsLoaded) return null;

  if (startupPhase === 'loading') {
    return (
      <ThemeProvider value={navigationTheme}>
        <StartupScreen
          title="Preparando o Radiant"
          body="Carregando seu progresso local e validando o estado do aplicativo."
          tone="loading"
        />
        <StatusBar style="dark" />
      </ThemeProvider>
    );
  }

  if (startupPhase === 'error') {
    return (
      <ThemeProvider value={navigationTheme}>
        <StartupScreen
          title="Não foi possível iniciar"
          body={startupError ?? 'Tente novamente para restaurar o bootstrap do aplicativo.'}
          tone="error"
          onRetry={() => {
            setStartupPhase('loading');
            setStartupError(null);
            setIsBetaUnlocked(false);
            setBootstrapAttempt((current) => current + 1);
          }}
        />
        <StatusBar style="dark" />
      </ThemeProvider>
    );
  }

  if (shouldEnforceBetaGate && !isBetaUnlocked) {
    return (
      <ThemeProvider value={navigationTheme}>
        <BetaGateScreen onUnlock={() => setIsBetaUnlocked(true)} />
        <StatusBar style="dark" />
      </ThemeProvider>
    );
  }

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

  return (
    <ThemeProvider value={navigationTheme}>
      {/*
        Every screen here draws its own header, so hiding it is the default
        rather than something each route opts into. A route that is not
        declared below — e.g. `galaxy/[galaxyId]` — used to fall back to the
        native header, which renders its raw route path as the title and the
        previous route id as the back-button label. That leaks the route path
        and `(tabs)` both onto the screen and into the accessibility tree.
      */}
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="learn" />
        <Stack.Screen name="checkpoint" />
        <Stack.Screen name="reward" />
        <Stack.Screen name="quiz" />
        <Stack.Screen name="review" />
        <Stack.Screen name="telemetry" />
        <Stack.Screen
          name="modal"
          options={{ presentation: 'modal', title: 'Modal', headerShown: true }}
        />
      </Stack>
      <StatusBar style="dark" />
    </ThemeProvider>
  );
}

export default wrapRootWithObservability(RootLayout);

interface StartupScreenProps {
  title: string;
  body: string;
  tone: 'loading' | 'error';
  onRetry?: () => void;
}

function StartupScreen({ title, body, tone, onRetry }: StartupScreenProps) {
  return (
    <SafeAreaView style={styles.screen}>
      <View style={[layout.container, layout.center, styles.content]}>
        <SurfaceCard contentStyle={styles.cardContent} variant="galaxy" style={styles.card}>
          {tone === 'loading' ? <ActivityIndicator size="large" color={galaxyColors.ctaGradientEnd} /> : null}
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.body}>{body}</Text>
          {tone === 'error' && onRetry ? (
            <AppButton onPress={onRetry} style={styles.button}>
              Tentar novamente
            </AppButton>
          ) : null}
          {tone === 'error' && AppConfig.SHOW_DEV_TOOLS ? (
            <AppButton
              onPress={() => router.replace('/(tabs)')}
              style={styles.secondaryButton}
              textStyle={styles.secondaryButtonText}
              variant="secondary"
            >
              Continuar em modo local
            </AppButton>
          ) : null}
        </SurfaceCard>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: galaxyColors.background,
  },
  content: {
    flex: 1,
    padding: space.s3,
    width: '100%',
  },
  card: {
    width: '100%',
    maxWidth: 560,
  },
  cardContent: {
    alignItems: 'center',
    gap: space.s3,
  },
  title: {
    ...typography.h3,
    color: galaxyColors.textPrimary,
    textAlign: 'center',
  },
  body: {
    ...typography.bodyRegular,
    color: galaxyColors.textSecondary,
    textAlign: 'center',
  },
  button: {
    width: '100%',
    marginTop: space.s1,
  },
  secondaryButton: {
    width: '100%',
  },
  secondaryButtonText: {
    color: galaxyColors.textPrimary,
  },
});
