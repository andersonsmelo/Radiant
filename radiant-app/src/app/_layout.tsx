import { ThemeProvider } from '@react-navigation/native';
import { useFonts, Sora_400Regular, Sora_500Medium, Sora_600SemiBold, Sora_700Bold, Sora_800ExtraBold } from '@expo-google-fonts/sora';
import { router, Stack, type Href } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import 'react-native-reanimated';

import { BetaService } from '../features/beta/BetaService';
import BetaGateScreen from '../features/beta/screens/BetaGateScreen';
import { AuthService } from '../features/auth/AuthService';
import { LessonCatalogService } from '../features/content/services/LessonCatalogService';
import { FirstRunService } from '../features/first-run/FirstRunService';
import WelcomeFlowScreen from '../features/first-run/screens/WelcomeFlowScreen';
import type { FirstRunExitReason } from '../features/first-run/first-run.types';
import { JourneyProgressService } from '../features/journey/services/JourneyProgressService';
import {
  canOpenJourneyNode,
  getJourneyNodeHref,
} from '../features/journey/services/JourneyNodeRouting';
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
import {
  getNativeActiveCheckpointRuntime,
  type ActiveResumeLaunch,
} from '../features/student-checkpoints/ActiveCheckpointRuntime';
import { firstFrameLaunchPhase, startupProbe } from '../features/student-checkpoints/CheckpointPerformance';
import { warmNativeStorage } from '../features/student-checkpoints/storage';
import { resolveStudentCheckpointRuntimeMode } from '../features/student-checkpoints/mode';
import { STUDENT_CHECKPOINT_SHADOW_CONTENT_VERSION } from '../features/student-checkpoints/ScreenCheckpointAdapters';

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
  const [pendingWelcomeHref, setPendingWelcomeHref] = useState<Href | null>(null);
  const [checkpointLaunch, setCheckpointLaunch] = useState<ActiveResumeLaunch>({ kind: 'none' });
  const [welcomeResume, setWelcomeResume] = useState<{ checkpointId: string; cursorId: string } | null>(null);
  const [pendingCheckpointHref, setPendingCheckpointHref] = useState<Href | null>(null);
  const firstRunBootstrapRef = useRef<Promise<void> | null>(null);
  const welcomeExitInFlightRef = useRef(false);

  // Estável de propósito: `WelcomeFlowScreen` tem esta função nas dependências
  // do `useEffect` que emite `first_run_step_viewed`. Como arrow inline, cada
  // render do `RootLayout` criava uma identidade nova e reemitia o evento do
  // MESMO passo. Hoje seria inócuo — o `RootLayout` não re-renderiza enquanto a
  // apresentação está montada e o projeto não usa `StrictMode` —, mas é o mesmo
  // risco de duplicata que o `useRef` acima existe para conter, e qualquer
  // estado novo aqui o acordaria.
  const handleStepViewed = useCallback((step: number) => {
    FirstRunService.markStepViewed(step);
  }, []);

  const handleWelcomeFinish = useCallback(
    async (reason: FirstRunExitReason, step: number) => {
      if (welcomeExitInFlightRef.current) {
        return;
      }

      welcomeExitInFlightRef.current = true;
      let nextHref: Href | null = null;

      try {
        // A apresentação continua montada até a saída local terminar. Além de
        // impedir o flash da Home, isso garante que dois toques não iniciem
        // duas persistências nem duas navegações concorrentes.
        await FirstRunService.markSeen(reason, step);

        if (reason === 'completed') {
          const snapshot = await JourneyProgressService.bootstrap();
          const nextNode = snapshot.nextRecommendedNode;

          if (nextNode && canOpenJourneyNode(nextNode)) {
            nextHref = getJourneyNodeHref(nextNode);
          }
        }
      } catch (error) {
        // Primeiro uso nunca vira um bloqueio de entrada. O destino nulo faz o
        // Stack abrir na Home, e a observabilidade recebe só fase e motivo.
        console.error('[RootLayout] Failed to finish first-run flow:', error);
        void TelemetryService.captureError(error, {
          phase: 'first_run_exit',
          reason,
        });
      } finally {
        setPendingWelcomeHref(nextHref);
        setWelcomeResume(null);
        setShowWelcome(false);
      }
    },
    [],
  );

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
        // re-entrancy after it has already finished once). On rejection the
        // ref is cleared before rethrowing, so a settled, failed promise is
        // never reused — a retry after a failed bootstrap calls it fresh
        // instead of being stuck replaying the same rejection forever.
        if (!firstRunBootstrapRef.current) {
          firstRunBootstrapRef.current = FirstRunService.bootstrap().catch((error) => {
            firstRunBootstrapRef.current = null;
            throw error;
          });
        }

        await Promise.all([
          AuthService.bootstrap(),
          LessonCatalogService.bootstrap(),
          firstRunBootstrapRef.current,
          // Independente do modo do kernel, de propósito. Num Dev Client a primeira
          // operação de storage resolve o AsyncStorage por chunk buscado por HTTP
          // (177–622 ms medidos em 2026-08-10), e como `inspectLaunch` em `off`
          // retorna antes de tocar o store, só o lado `active` pagava — o delta de
          // `first_frame` media essa assimetria em vez do kernel, que custa menos de
          // 2 ms. Aqui os dois modos pagam igual, e é isso que faz o delta voltar a
          // medir o kernel: `launch_inspection` em `active` caiu de 184–357 ms para
          // **1,0–1,9 ms**, e o delta de medianas de +344/+441 ms para −28,7 ms.
          //
          // **O que isso NÃO faz, medido:** esconder o custo. A suposição de que a
          // busca se sobreporia ao resto do bootstrap estava errada — o `Promise.all`
          // espera o mais lento, e a busca (191–662 ms) é mais lenta que o resto
          // (~232 ms), então ela passa a dominar a partida em vez de desaparecer:
          // `first_frame` em `off` subiu de ~232 ms para ~580 ms. O ganho é
          // simetria, não velocidade, e em desenvolvimento os dois modos ficaram
          // mais lentos. Em produção o custo é ~0, porque o bundle é único e o
          // `import()` não tem o que buscar.
          //
          // Não lê chave nenhuma, então `off` continua silencioso.
          warmNativeStorage(),
        ]);
        if (!active) {
          return;
        }

        const shouldShowWelcome = FirstRunService.shouldShowWelcome();
        setShowWelcome(shouldShowWelcome);
        const checkpointMode = resolveStudentCheckpointRuntimeMode(
          AppConfig.APP_ENV,
          process.env.EXPO_PUBLIC_STUDENT_CHECKPOINT_MODE,
        );
        // Medido nos dois modos de propósito. Esta é a única etapa do bootstrap
        // que se comporta de forma diferente entre `off` e `active`, e era a única
        // sem probe nenhum — foi por isso que os 9 ms de restauração nunca
        // contradisseram os ~440 ms que o piloto de `first_frame` achou. Com a
        // fronteira medida, o diagnóstico deixa de depender de hipótese: se o
        // custo estiver aqui, o remédio é este caminho; se não estiver, ele está
        // fora e procurar aqui seria perder tempo.
        const launch = await startupProbe.measure('launch_inspection', () => (
          getNativeActiveCheckpointRuntime(checkpointMode).inspectLaunch({
            contentVersion: STUDENT_CHECKPOINT_SHADOW_CONTENT_VERSION,
            firstRunAvailable: shouldShowWelcome,
          })
        ));
        if (!active) return;
        setCheckpointLaunch(launch);

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

  // A marca de primeiro frame útil do gate H3. `ready` é o ponto certo e não a
  // montagem: ele só acontece depois do bootstrap e, decisivamente, depois de
  // `inspectLaunch` do runtime de checkpoints — então a janela medida contém o
  // kernel, que é exatamente o que a duração de `launchApp` do Maestro não
  // continha. O `requestAnimationFrame` move a leitura para depois do frame ser
  // pintado, em vez de medir o commit do React.
  useEffect(() => {
    if (startupPhase !== 'ready') return;
    const frame = requestAnimationFrame(() => startupProbe.recordFirstFrame(
      firstFrameLaunchPhase(checkpointLaunch.kind),
    ));
    return () => cancelAnimationFrame(frame);
  }, [checkpointLaunch.kind, startupPhase]);

  useEffect(() => {
    if (showWelcome || !pendingWelcomeHref) {
      return;
    }

    // O Stack só existe no render posterior ao fim da apresentação. Consumir
    // o destino aqui evita chamar o router enquanto a árvore ainda contém
    // apenas o gate de primeiro uso.
    router.replace(pendingWelcomeHref);
    setPendingWelcomeHref(null);
  }, [pendingWelcomeHref, showWelcome]);

  useEffect(() => {
    if (!pendingCheckpointHref || checkpointLaunch.kind !== 'none' || showWelcome) return;
    router.replace(pendingCheckpointHref);
    setPendingCheckpointHref(null);
  }, [checkpointLaunch.kind, pendingCheckpointHref, showWelcome]);

  const handleResumeCheckpoint = useCallback(() => {
    if (checkpointLaunch.kind !== 'offer') return;
    if (checkpointLaunch.target.kind === 'first-run') {
      setWelcomeResume({
        checkpointId: checkpointLaunch.target.checkpointId,
        cursorId: checkpointLaunch.target.cursorId,
      });
      setShowWelcome(true);
    } else {
      setShowWelcome(false);
      setPendingCheckpointHref({
        pathname: checkpointLaunch.target.pathname,
        params: checkpointLaunch.target.params,
      } as Href);
    }
    setCheckpointLaunch({ kind: 'none' });
  }, [checkpointLaunch]);

  const handleCheckpointHome = useCallback(() => {
    setCheckpointLaunch({ kind: 'none' });
    setWelcomeResume(null);
    setShowWelcome(false);
  }, []);

  if (!fontsLoaded) return null;

  if (startupPhase === 'loading') {
    return (
      <ThemeProvider value={navigationTheme}>
        <StartupScreen
          title="Preparando o Radiant"
          body="Carregando seu progresso local e validando o estado do aplicativo."
          tone="loading"
        />
        <StatusBar style="light" />
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
        <StatusBar style="light" />
      </ThemeProvider>
    );
  }

  if (shouldEnforceBetaGate && !isBetaUnlocked) {
    return (
      <ThemeProvider value={navigationTheme}>
        <BetaGateScreen onUnlock={() => setIsBetaUnlocked(true)} />
        <StatusBar style="light" />
      </ThemeProvider>
    );
  }

  if (checkpointLaunch.kind === 'offer' || checkpointLaunch.kind === 'fallback') {
    return (
      <ThemeProvider value={navigationTheme}>
        <CheckpointResumeScreen
          canResume={checkpointLaunch.kind === 'offer'}
          onResume={handleResumeCheckpoint}
          onHome={handleCheckpointHome}
        />
        <StatusBar style="light" />
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
          onFinish={(reason, step) => void handleWelcomeFinish(reason, step)}
          onStepViewed={handleStepViewed}
          resumeCheckpointId={welcomeResume?.checkpointId}
          resumeCursorId={welcomeResume?.cursorId}
          onResumeFallback={handleCheckpointHome}
        />
        <StatusBar style="light" />
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
      <StatusBar style="light" />
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

function CheckpointResumeScreen({
  canResume,
  onResume,
  onHome,
}: {
  canResume: boolean;
  onResume: () => void;
  onHome: () => void;
}) {
  return (
    <SafeAreaView style={styles.screen}>
      {/*
        Rolável de propósito, e o contêiner de conteúdo cresce em vez de travar
        em `flex: 1`. Medido no simulador em 2026-08-10: a partir de
        `accessibility-extra-extra-large` o cartão passava a ser mais alto que a
        tela — título começando em y=-257 e corpo terminando em y=1066 numa tela
        de 874 pt — e os dois botões deixavam de ser renderizados. Sem rolagem,
        quem usa os dois maiores tamanhos de acessibilidade e tem um checkpoint
        salvo abria o app numa tela sem nenhuma saída. `flex: 1` aqui recriaria o
        defeito: ele impede o contêiner de passar da altura do viewport, que é
        exatamente o que precisa acontecer para os botões existirem.
      */}
      <ScrollView
        testID="checkpoint-resume-scroll"
        style={styles.screen}
        contentContainerStyle={[layout.container, styles.resumeScrollContent]}
      >
        <SurfaceCard contentStyle={styles.cardContent} variant="galaxy" style={styles.card}>
          <Text style={styles.title} accessibilityRole="header">
            {canResume ? 'Continuar de onde você parou?' : 'Vamos continuar pela jornada'}
          </Text>
          <Text style={styles.body}>
            {canResume
              ? 'Há uma etapa salva neste aparelho. Você escolhe se quer retomá-la agora.'
              : 'Não foi possível retomar esse ponto com segurança. Seu progresso confirmado foi preservado.'}
          </Text>
          {canResume ? (
            <AppButton onPress={onResume} style={styles.button} accessibilityLabel="Retomar estudo">
              Retomar estudo
            </AppButton>
          ) : null}
          <AppButton
            onPress={onHome}
            style={styles.secondaryButton}
            textStyle={styles.secondaryButtonText}
            variant="secondary"
            accessibilityLabel="Ir para a jornada"
          >
            Ir para a jornada
          </AppButton>
        </SurfaceCard>
      </ScrollView>
    </SafeAreaView>
  );
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
  // Espelha `content` + `layout.center`, trocando `flex: 1` por `flexGrow: 1`.
  // A troca é o ponto: num `contentContainerStyle`, `flex: 1` prende a altura ao
  // viewport e a rolagem nunca acontece; `flexGrow: 1` centraliza enquanto cabe
  // e deixa crescer quando não cabe mais.
  resumeScrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
