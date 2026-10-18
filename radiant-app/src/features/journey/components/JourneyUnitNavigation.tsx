import React from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { galaxyColors } from '../../../ui/theme';
import { radius, space, typography } from '../../../ui/styles';

export type JourneyUnitDestination = {
  key: string; unitId: string; title: string; trackTitle: string;
  unitNumber: number; unitCount: number; itemIndex: number;
};
type Props = { destinations: JourneyUnitDestination[]; onSelect: (itemIndex: number) => void };

/** Navega para o contexto da unidade, inclusive bloqueada, sem abrir atividade. */
export function JourneyUnitNavigation({ destinations, onSelect }: Props) {
  return (
    <View style={styles.section}>
      <Text accessibilityRole="header" style={styles.heading}>Unidades</Text>
      <FlatList
        testID="journey-unit-navigation"
        horizontal
        data={destinations}
        keyExtractor={item => item.key}
        initialNumToRender={4}
        windowSize={3}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Ver unidade ${item.unitNumber} de ${item.unitCount}: ${item.title}. ${item.trackTitle}`}
            onPress={() => onSelect(item.itemIndex)}
            style={styles.button}
          >
            <Text style={styles.area}>{item.trackTitle}</Text>
            <Text style={styles.title}>{item.unitNumber}. {item.title}</Text>
          </Pressable>
        )}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  section: { gap: space.s1, paddingVertical: space.s2 },
  heading: { ...typography.label, color: galaxyColors.textPrimary },
  list: { gap: space.s1 },
  button: { width: space.s6 * 6, minHeight: space.s6 + space.s2, padding: space.s2, borderRadius: radius.rMd, backgroundColor: galaxyColors.surface, borderWidth: 1, borderColor: galaxyColors.border },
  area: { ...typography.micro, color: galaxyColors.textSecondary },
  title: { ...typography.label, color: galaxyColors.textPrimary },
});
