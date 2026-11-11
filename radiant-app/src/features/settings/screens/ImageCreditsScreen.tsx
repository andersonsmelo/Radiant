import React from 'react';
import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { IconSymbol } from '../../../../components/ui/icon-symbol';
import { RTG_IMAGES } from '../../student-checkpoints/batches/rtgImages';
import { radius, space, typography } from '../../../ui/styles';
import { galaxyColors } from '../../../ui/theme';

/** CC BY exige o crédito: nenhuma build com imagem CC BY sai sem esta tela. */
export default function ImageCreditsScreen(): React.ReactElement {
  return <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
    <View style={styles.header}>
      <Pressable onPress={() => router.back()} accessibilityRole="button" accessibilityLabel="Voltar aos Ajustes" style={styles.back}>
        <IconSymbol name="chevron.left" size={20} color={galaxyColors.navBlue} />
        <Text style={styles.backLabel}>Ajustes</Text>
      </Pressable>
      <Text style={styles.title} accessibilityRole="header">Créditos das imagens</Text>
    </View>
    <ScrollView contentContainerStyle={styles.list}>
      {RTG_IMAGES.map((image, index) => <View key={image.id} style={styles.card}>
        <Text style={styles.name}>Radiografia {index + 1}</Text>
        <Text style={styles.detail}>{image.alt}</Text>
        <Text style={styles.detail}>Autoria: {image.author}</Text>
        <Text style={styles.detail}>Licença: {image.license}</Text>
        <Text style={styles.detail}>Modificação: {image.modification}</Text>
        <Pressable accessibilityRole="link" accessibilityLabel={`Abrir a página de origem da radiografia ${index + 1}`}
          onPress={() => { void Linking.openURL(image.sourcePage).catch(() => undefined); }} style={styles.link}>
          <Text style={styles.linkLabel}>Ver a página de origem</Text>
        </Pressable>
      </View>)}
    </ScrollView>
  </SafeAreaView>;
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: galaxyColors.background },
  header: { paddingHorizontal: space.s3, paddingTop: space.s1, paddingBottom: space.s3, gap: space.s2 },
  back: { minHeight: 48, flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', gap: space.s0 },
  backLabel: { ...typography.bodyRegular, lineHeight: undefined, color: galaxyColors.navBlue },
  title: { ...typography.h2, lineHeight: undefined, color: galaxyColors.textPrimary },
  list: { paddingHorizontal: space.s3, paddingBottom: space.s4, gap: space.s2 },
  card: { padding: space.s3, gap: space.s1, borderRadius: radius.rXl, borderWidth: 1, borderColor: galaxyColors.border, backgroundColor: galaxyColors.surfaceActive },
  name: { ...typography.bodyRegular, lineHeight: undefined, fontWeight: '700', color: galaxyColors.textPrimary },
  detail: { ...typography.bodyRegular, lineHeight: undefined, color: galaxyColors.textSecondary },
  link: { minHeight: 48, justifyContent: 'center', alignSelf: 'flex-start' },
  linkLabel: { ...typography.bodyRegular, lineHeight: undefined, color: galaxyColors.navBlue },
});
