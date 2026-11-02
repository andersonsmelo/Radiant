import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { Card } from '../components/ui/Card';
import { PrimaryButton } from '../components/ui/PrimaryButton';
import { galaxyColors } from '../ui/theme';
import { layout, space, typography } from '../ui/styles';

// Piloto da lição híbrida (spec 2026-09-23). O gate vive na rota, como no
// console: o V3 não está ativado, e o aluno não alcança esta tela.
export default function HybridLessonRoute() {
    return (
      <SafeAreaView style={styles.root}>
        <View style={[layout.screen, layout.container, layout.center]}>
          <Card style={styles.card}>
            <Text style={styles.title}>Conteúdo em preparação</Text>
            <Text style={styles.body}>As aulas anteriores foram retiradas para o novo planejamento.</Text>
            <PrimaryButton onPress={() => router.replace('/(tabs)')} style={styles.button}>Voltar</PrimaryButton>
          </Card>
        </View>
      </SafeAreaView>
    );

}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: galaxyColors.background },
  card: { width: '100%', maxWidth: 420, alignItems: 'center', gap: space.s3 },
  title: { ...typography.h3, color: galaxyColors.textPrimary, textAlign: 'center' },
  body: { ...typography.caption, color: galaxyColors.textSecondary, textAlign: 'center' },
  button: { width: '100%' },
});
