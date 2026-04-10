import { ThemeProvider } from '@react-navigation/native';
import { router, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import 'react-native-reanimated';

import { BetaService } from '../features/beta/BetaService';
import BetaGateScreen from '../features/beta/screens/BetaGateScreen';
import { AuthService } from '../features/auth/AuthService';
import { LessonCatalogService } from '../features/content/services/LessonCatalogService';
import { SyncQueueService } from '../features/sync/SyncQueueService';
import { TelemetryService } from '../features/telemetry/TelemetryService';
import {
  initializeObservability,
  wrapRootWithObservability,
} from '../features/telemetry/bootstrap';
import { AppConfig } from '../config';
import { AppButton } from '../components/ui/AppButton';
import { SurfaceCard } from '../components/ui/SurfaceCard';
import { colors, navigationTheme } from '../ui/theme';
import { layout, space, typography } from '../ui/styles';

initializeObservability();

export const unstable_settings = {
  anchor: '(tabs)',
};

function RootLayout() {
  const shouldEnforceBetaGate = AppConfig.ENABLE_BETA_GATE && !AppConfig.SHOW_DEV_TOOLS;
  const [isBetaUnlocked, setIsBetaUnlocked] = useState(false);
  const [startupPhase, setStartupPhase] = useState<'loading' | 'ready' | 'error'>('loading');
  const [startupError, setStartupError] = useState<string | null>(null);
  const [bootstrapAttempt, setBootstrapAttempt] = useState(0);

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

        await Promise.all([
          AuthService.bootstrap(),
          LessonCatalogService.bootstrap(),
        ]);
        if (!active) {
          return;
        }

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

  return (
    <ThemeProvider value={navigationTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="learn" options={{ headerShown: false }} />
        <Stack.Screen name="checkpoint" options={{ headerShown: false }} />
        <Stack.Screen name="reward" options={{ headerShown: false }} />
        <Stack.Screen name="quiz" options={{ headerShown: false }} />
        <Stack.Screen name="review" options={{ headerShown: false }} />
        <Stack.Screen name="telemetry" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
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
        <SurfaceCard contentStyle={styles.cardContent} variant="glass" style={styles.card}>
          {tone === 'loading' ? <ActivityIndicator size="large" color={colors.primary} /> : null}
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
    backgroundColor: colors.background,
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
    color: colors.textPrimary,
    textAlign: 'center',
  },
  body: {
    ...typography.bodyRegular,
    color: colors.textSecondary,
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
    color: colors.textPrimary,
  },
});
