import React, { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useFocusEffect } from 'expo-router';

import { AppConfig } from '../../../config';
import { AppButton } from '../../../components/ui/AppButton';
import { AuthService } from '../../auth/AuthService';
import { GamificationService } from '../../gamification/services/GamificationService';
import MissionsScreen from '../../missions/screens/MissionsScreen';
import ProgressScreen from '../../progress/screens/ProgressScreen';
import { StarfieldBackground } from '../../../ui/components/StarfieldBackground';
import { galaxyColors } from '../../../ui/theme';
import { space, tabBarClearance } from '../../../ui/styles';
import { ProfileIdentityHeader } from '../components/ProfileIdentityHeader';

/**
 * A aba Perfil — a segunda e última da barra.
 *
 * Agrega o que eram três abas separadas: a identidade do aluno como cabeçalho,
 * as Missões inteiras e o Progresso inteiro. A ordem não é arbitrária: quem é o
 * aluno, o que ele tem para fazer hoje, e como ele vem indo. Do mais imediato
 * para o mais retrospectivo.
 *
 * **A rolagem é daqui.** As duas telas agregadas entram em modo embutido,
 * porque duas `ScrollView` aninhadas na vertical brigam pelo gesto — a de dentro
 * consome o arrasto e a de fora trava, e o aluno não alcança o que está embaixo.
 *
 * **Os controles do console não entram, e nunca podem entrar.** Learning Road,
 * Beta Gate, reset de estado local — tudo isso saiu da `ProgressScreen` para
 * rota própria antes desta agregação existir, e a ordem foi essa de propósito.
 *
 * O que entra é uma **porta**, não os controles: até 2026-08-21 a rota
 * `/dev-console` não tinha nenhuma entrada in-app e só abria por deep link,
 * embora o checklist de release registre que a homologação em aparelho depende
 * dela. A porta fica atrás de `SHOW_DEV_TOOLS` — que é `__DEV__ ||
 * EXPO_PUBLIC_ENABLE_DEV_TOOLS` —, então no build do aluno ela não existe. Não
 * é um botão desabilitado, que ainda contaria uma história a quem não deveria
 * ouvi-la.
 */
export default function ProfileScreen() {
  const [email, setEmail] = useState<string | null>(null);
  const [streakDays, setStreakDays] = useState(0);
  const [totalXp, setTotalXp] = useState(0);

  useFocusEffect(
    useCallback(() => {
      void AuthService.bootstrap().then((session) => setEmail(session?.user.email ?? null));
      void GamificationService.getSnapshot().then((snapshot) => {
        setStreakDays(snapshot.streakDays);
        setTotalXp(snapshot.totalXp);
      });
    }, []),
  );

  return (
    <View style={styles.root}>
      <StarfieldBackground backgroundColor={galaxyColors.background} starCount={120} />
      <SafeAreaView style={styles.safe} edges={['top']}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <ProfileIdentityHeader email={email} streakDays={streakDays} totalXp={totalXp} />
          <MissionsScreen embedded />
          <ProgressScreen embedded />

          {AppConfig.SHOW_DEV_TOOLS ? (
            <AppButton
              variant="ghost"
              onPress={() => router.push('/dev-console')}
              accessibilityLabel="Abrir o console de desenvolvimento"
              accessibilityHint="Ferramentas de homologação. Não aparece no build do aluno."
            >
              Console de desenvolvimento
            </AppButton>
          ) : null}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: galaxyColors.background },
  safe: { flex: 1 },
  scroll: { flex: 1 },
  content: {
    paddingHorizontal: space.s3,
    gap: space.s3,
    // A tab bar é cartão flutuante e cobre o fim do conteúdo sem esta reserva.
    paddingBottom: tabBarClearance,
  },
});
