import React, { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useFocusEffect } from 'expo-router';

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
 * **A configuração não mora aqui.** Desde 2026-10-16 (FILA 32, decisão do
 * dono), assinatura, backup no iCloud, sons e vibração, conta, ajuda e a porta
 * do console de desenvolvimento ficam na tela Configuração, que a engrenagem do
 * cabeçalho abre. Os controles do console continuam fora de qualquer tela do
 * aluno: saíram da `ProgressScreen` para rota própria antes desta agregação.
 *
 * **Sem conta própria (spec 1.4 §1.2, decisão 4).** O cabeçalho não recebe
 * e-mail de sessão, e nenhuma palavra de infraestrutura chega à tela do aluno.
 */
export default function ProfileScreen() {
  const [streakDays, setStreakDays] = useState(0);
  const [totalXp, setTotalXp] = useState(0);

  useFocusEffect(
    useCallback(() => {
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
          <ProfileIdentityHeader
            email={null}
            streakDays={streakDays}
            totalXp={totalXp}
            onOpenSettings={() => router.push('/settings')}
          />
          <MissionsScreen embedded />
          <ProgressScreen embedded />
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
