import React, { useCallback, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useFocusEffect } from 'expo-router';

import { IconSymbol } from '../../../../components/ui/icon-symbol';
import { StarfieldBackground } from '../../../ui/components/StarfieldBackground';
import { radius, space, typography } from '../../../ui/styles';
import { galaxyColors } from '../../../ui/theme';
import { DECORATIONS, DECORATION_SLOTS, type Decoration } from '../catalog';
import { DecorationsService, type DecorationsState } from '../DecorationsService';
import { availableIds, howToEarn } from '../unlocks';
import { DecorationBadge, cardStyle, frameStyles } from '../components/DecorationArt';

type Reading = { state: 'loading' } | { state: 'ready'; data: DecorationsState } | { state: 'unavailable' };

// Moldura é feminina; selo e cartão, masculinos. O estado é escrito, não só cor.
const words = (item: Decoration) => item.slot === 'moldura'
    ? { earned: 'Ganha', equipped: 'Equipada', locked: 'Bloqueada', exclusive: 'Exclusiva' }
    : { earned: 'Ganho', equipped: 'Equipado', locked: 'Bloqueado', exclusive: 'Exclusivo' };

function Preview({ item }: { item: Decoration }) {
  if (item.art.type === 'selo') return <DecorationBadge item={item} size={28} />;
  if (item.art.type === 'cartao') return <View style={[styles.swatch, cardStyle(item), styles.swatchCard]} />;
  const frame = frameStyles(item)!;
  return <View style={frame.outer}><View style={frame.inner}><View style={styles.swatchAvatar} /></View></View>;
}

/** Escolher e equipar decorações, na rota `/decoracoes` (F6). Nada aqui muda o estudo. */
export default function DecorationsScreen() {
  const [reading, setReading] = useState<Reading>({ state: 'loading' });
  const [equippedIds, setEquippedIds] = useState<Record<string, string | undefined>>({});
  const busy = useRef(false);

  const load = useCallback(() => {
    let alive = true;
    DecorationsService.sync().then(data => {
      if (!alive) return;
      setReading({ state: 'ready', data });
      setEquippedIds(Object.fromEntries(Object.entries(data.equipped).map(([slot, item]) => [slot, item?.id])));
    }, () => { if (alive) setReading({ state: 'unavailable' }); });
    return () => { alive = false; };
  }, []);
  useFocusEffect(load);

  const toggle = useCallback(async (item: Decoration, isEquipped: boolean) => {
    if (busy.current) return;
    busy.current = true;
    try {
      if (await DecorationsService.equip(item.slot, isEquipped ? null : item.id)) {
        setEquippedIds(current => ({ ...current, [item.slot]: isEquipped ? undefined : item.id }));
      }
    } finally {
      busy.current = false;
    }
  }, []);

  const available = reading.state === 'ready' ? availableIds(reading.data.unlocked, reading.data.subscriber) : new Set<string>();

  return (
    <View style={styles.root}>
      <StarfieldBackground backgroundColor={galaxyColors.background} starCount={120} />
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} accessibilityRole="button" accessibilityLabel="Voltar" hitSlop={space.s1}
            style={({ pressed }) => [styles.back, pressed && styles.pressed]}>
            <IconSymbol name="chevron.left" size={20} color={galaxyColors.navBlue} />
            <Text style={styles.backLabel}>Voltar</Text>
          </Pressable>
          <Text style={styles.title} accessibilityRole="header">Decorações</Text>
          <Text style={styles.detail}>Enfeites do seu perfil, ganhos pelo estudo. Não mudam XP, vidas nem aulas.</Text>
        </View>
        <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {reading.state === 'loading' ? <Text style={styles.detail}>Carregando decorações…</Text>
            : reading.state === 'unavailable' ? <Text style={styles.detail} accessibilityRole="alert">Não foi possível ler as decorações agora. Tente de novo em instantes.</Text>
              : DECORATION_SLOTS.map(({ slot, title }) => <View key={slot} style={styles.section}>
                <Text style={styles.sectionTitle} accessibilityRole="header">{title}</Text>
                {DECORATIONS.filter(d => d.slot === slot).map(item => {
                  const w = words(item);
                  const isEquipped = equippedIds[slot] === item.id && available.has(item.id);
                  const exclusiveLocked = !available.has(item.id) && item.rule.kind === 'assinante';
                  const body = <>
                    <View style={styles.preview}><Preview item={item} /></View>
                    <View style={styles.itemText}>
                      <Text style={styles.itemName}>{item.name}</Text>
                      <Text style={styles.detail}>{item.description}</Text>
                      <Text style={[styles.status, isEquipped && styles.statusOn]}>
                        {isEquipped ? `${w.equipped}. Toque para tirar.`
                          : available.has(item.id) ? `${w.earned}. Toque para equipar.`
                            : exclusiveLocked ? `${w.exclusive} do Radiant Ilimitado. Toque para conhecer.`
                              : `${w.locked}: ${howToEarn(item.rule)}`}
                      </Text>
                    </View>
                  </>;
                  if (!available.has(item.id) && !exclusiveLocked) {
                    return <View key={item.id} style={[styles.item, styles.itemLocked]} accessible
                      accessibilityLabel={`${item.name}. ${w.locked}. ${howToEarn(item.rule)}.`}>{body}</View>;
                  }
                  const label = isEquipped ? `${item.name}. ${w.equipped}. Toque para tirar.`
                    : exclusiveLocked ? `${item.name}. ${w.exclusive} do Radiant Ilimitado. Toque para conhecer.`
                      : `${item.name}. ${w.earned}. Toque para equipar.`;
                  return <Pressable key={item.id} accessibilityRole="button" accessibilityLabel={label}
                    accessibilityState={{ selected: isEquipped }}
                    onPress={() => exclusiveLocked ? router.push('/subscription') : void toggle(item, isEquipped)}
                    style={({ pressed }) => [styles.item, isEquipped && styles.itemEquipped, pressed && styles.pressed]}>
                    {body}
                  </Pressable>;
                })}
              </View>)}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: galaxyColors.background },
  safe: { flex: 1 },
  header: { paddingHorizontal: space.s3, paddingTop: space.s1, paddingBottom: space.s3, gap: space.s2 },
  back: { minHeight: 48, flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', gap: space.s0 },
  pressed: { opacity: 0.7 },
  backLabel: { ...typography.bodyRegular, lineHeight: undefined, color: galaxyColors.navBlue },
  title: { ...typography.h2, lineHeight: undefined, color: galaxyColors.textPrimary },
  detail: { ...typography.bodyRegular, lineHeight: undefined, color: galaxyColors.textSecondary },
  scroll: { flex: 1 },
  content: { paddingHorizontal: space.s3, paddingBottom: space.s6, gap: space.s5 },
  section: { gap: space.s2 },
  sectionTitle: { ...typography.bodyStrong, lineHeight: undefined, color: galaxyColors.textSecondary },
  item: { minHeight: 72, flexDirection: 'row', alignItems: 'center', gap: space.s3, padding: space.s3, borderRadius: radius.rMd,
    backgroundColor: galaxyColors.surface, borderWidth: 1, borderColor: galaxyColors.border },
  itemEquipped: { borderWidth: 2, borderColor: galaxyColors.navBlue },
  itemLocked: { backgroundColor: galaxyColors.backgroundAlt },
  preview: { width: 48, height: 48, alignItems: 'center', justifyContent: 'center' },
  swatch: { width: 44, height: 32 },
  swatchCard: { padding: 0, borderRadius: radius.rMd / 2 },
  swatchAvatar: { width: 28, height: 28, borderRadius: 999, backgroundColor: galaxyColors.surfaceMuted },
  itemText: { flex: 1, minWidth: 0, gap: space.s0 },
  itemName: { ...typography.bodyStrong, lineHeight: undefined, color: galaxyColors.textPrimary },
  status: { ...typography.caption, lineHeight: undefined, color: galaxyColors.textSecondary },
  statusOn: { color: galaxyColors.textPrimary },
});
