import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { galaxyColors } from '../../../ui/theme';
import { radius, space, typography } from '../../../ui/styles';

type ProfileIdentityHeaderProps = {
  /** E-mail da sessão, ou `null` quando o estudo é local, sem conta. */
  email: string | null;
  streakDays: number;
  totalXp: number;
};

/**
 * O cabeçalho do Perfil: quem é o aluno e dois números que ele reconhece.
 *
 * **O que a referência tem e este cabeçalho não:** seguidores, "encontre novos
 * amigos", chats e liga entre pessoas. Nada disso é omissão de escopo — o
 * `STUDENT_CHECKPOINT_PRIVACY_CONTRACT` não admite comparação entre alunos, e a
 * decisão registrada em 2026-08-15 é que a liga vira métrica local, o aluno
 * comparado com ele mesmo. Um perfil social exigiria revisar o contrato antes,
 * não depois.
 *
 * **O avatar é do aluno, não do mascote.** A tentação era pôr o Pixel aqui — ele
 * é a marca e já está em seis telas. Mas na referência o avatar é a foto que a
 * pessoa escolheu, e trocar isso pelo mascote confunde quem estuda com o app que
 * ensina. Enquanto não houver avatar escolhido pelo aluno, a inicial do nome
 * ocupa o lugar e não promete nada que não existe.
 *
 * **Sem conta é um estado legítimo, não um erro.** O app é local-first: o aluno
 * estuda, acumula XP e sequência sem nunca se autenticar. O cabeçalho nomeia
 * esse estado em vez de mostrar um vazio ou empurrar login.
 */
export function ProfileIdentityHeader({
  email,
  streakDays,
  totalXp,
}: ProfileIdentityHeaderProps) {
  const displayName = email ? email.split('@')[0] : 'Estudante';
  const accountLabel = email ?? 'Estudo local, sem conta';

  return (
    <View style={styles.header}>
      <View style={styles.identityRow}>
        <View style={styles.avatar} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
          <Text style={styles.avatarInitial}>{displayName.charAt(0).toUpperCase()}</Text>
        </View>

        <View style={styles.identityText}>
          <Text style={styles.name} accessibilityRole="header" numberOfLines={1}>
            {displayName}
          </Text>
          <Text style={styles.account} numberOfLines={1}>
            {accountLabel}
          </Text>
        </View>
      </View>

      <View style={styles.metricRow}>
        <Metric label="Sequência" value={`${streakDays}`} suffix={streakDays === 1 ? 'dia' : 'dias'} />
        <Metric label="XP total" value={`${totalXp}`} suffix="XP" />
      </View>
    </View>
  );
}

function Metric({ label, value, suffix }: { label: string; value: string; suffix: string }) {
  return (
    <View
      style={styles.metric}
      accessible
      // Peça por peça o leitor de tela leria "Sequência", "7", "dias" — três
      // paradas para um número.
      accessibilityLabel={`${label}: ${value} ${suffix}.`}
    >
      <Text style={styles.metricLabel}>{label.toUpperCase()}</Text>
      <View style={styles.metricValueRow}>
        <Text style={styles.metricValue}>{value}</Text>
        <Text style={styles.metricSuffix}>{suffix}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { gap: space.s3, paddingBottom: space.s2 },
  identityRow: { flexDirection: 'row', alignItems: 'center', gap: space.s3 },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    backgroundColor: galaxyColors.surface,
    borderWidth: 1,
    borderColor: galaxyColors.border,
  },
  avatarInitial: {
    ...typography.h2,
    color: galaxyColors.textPrimary,
    fontWeight: '800',
  },
  identityText: { flex: 1, gap: space.s0 },
  name: { ...typography.h3, color: galaxyColors.textPrimary, fontWeight: '800' },
  account: { ...typography.bodyRegular, color: galaxyColors.textSecondary },
  metricRow: { flexDirection: 'row', gap: space.s2 },
  metric: {
    flex: 1,
    gap: space.s1,
    padding: space.s3,
    borderRadius: radius.rLg,
    borderWidth: 1,
    borderColor: galaxyColors.border,
    backgroundColor: galaxyColors.surface,
  },
  metricLabel: {
    ...typography.micro,
    color: galaxyColors.textTertiary,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  metricValueRow: { flexDirection: 'row', alignItems: 'baseline', gap: space.s0 },
  metricValue: { ...typography.h2, color: galaxyColors.textPrimary, fontWeight: '800' },
  metricSuffix: { ...typography.label, color: galaxyColors.textSecondary },
});
