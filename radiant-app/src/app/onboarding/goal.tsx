import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { StarfieldBackground } from '../../ui/components/StarfieldBackground';
import { AppButton } from '../../components/ui/AppButton';

const SPECIALTIES = [
  { id: 0, label: 'Chest & thorax', sub: '120 cases', emoji: '🫁' },
  { id: 1, label: 'Neuroradiology', sub: '95 cases', emoji: '🧠' },
  { id: 2, label: 'Musculoskeletal', sub: '88 cases', emoji: '🦴' },
  { id: 3, label: 'Abdominal', sub: '76 cases', emoji: '🫀' },
  { id: 4, label: 'Cardiac imaging', sub: '62 cases', emoji: '❤️' },
];

const GOALS = [
  { id: 'l', label: '5 min', sub: 'Light' },
  { id: 'm', label: '10 min', sub: 'Steady' },
  { id: 'h', label: '20 min', sub: 'Intense' },
];

export default function OnboardGoalScreen() {
  const [picked, setPicked] = useState(1);
  const [goal, setGoal] = useState('m');

  return (
    <View style={styles.root}>
      <StarfieldBackground starCount={40} />
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

          <View style={styles.header}>
            <Text style={styles.eyebrow}>STEP 3 OF 4</Text>
            <Text style={styles.headline}>Where do you want{'\n'}to focus first?</Text>
            <Text style={styles.subtext}>You can switch tracks any time.</Text>
          </View>

          <View style={styles.specialtyList}>
            {SPECIALTIES.map(s => {
              const on = picked === s.id;
              return (
                <Pressable
                  key={s.id}
                  onPress={() => setPicked(s.id)}
                  accessibilityRole="radio"
                  accessibilityLabel={`${s.label}, ${s.sub}`}
                  accessibilityState={{ selected: on }}
                  style={[styles.specialtyItem, on && styles.specialtyItemActive]}
                >
                  <View style={[styles.specialtyEmoji, on && styles.specialtyEmojiActive]}>
                    <Text style={{ fontSize: 20 }}>{s.emoji}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.specialtyLabel}>{s.label}</Text>
                    <Text style={styles.specialtySub}>{s.sub}</Text>
                  </View>
                  {on && <View style={styles.selectedDot} />}
                </Pressable>
              );
            })}
          </View>

          <Text style={styles.goalLabel}>DAILY GOAL</Text>
          <View style={styles.goalRow}>
            {GOALS.map(g => {
              const on = goal === g.id;
              return (
                <Pressable
                  key={g.id}
                  onPress={() => setGoal(g.id)}
                  accessibilityRole="radio"
                  accessibilityLabel={`${g.label} por dia, ritmo ${g.sub}`}
                  accessibilityState={{ selected: on }}
                  style={[styles.goalOption, on && styles.goalOptionActive]}
                >
                  <Text style={[styles.goalTime, on && styles.goalTimeActive]}>{g.label}</Text>
                  <Text style={[styles.goalSub, on && styles.goalSubActive]}>{g.sub}</Text>
                </Pressable>
              );
            })}
          </View>

          <AppButton
            label="Build my plan →"
            onPress={() => router.replace('/(tabs)')}
            variant="galaxy"
            style={{ marginTop: 24 }}
          />

          <View style={[styles.dots, { marginTop: 16, alignSelf: 'center' }]}>
            {[0,1,2,3].map(i => (
              <View key={i} style={[styles.dot, i === 2 && styles.dotActive]} />
            ))}
          </View>

        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#03030d' },
  safe: { flex: 1 },
  content: { padding: 20, paddingBottom: 56 },
  header: { marginBottom: 20 },
  eyebrow: {
    fontSize: 11, fontWeight: '800', color: '#3DCAE8',
    letterSpacing: 0.18, textTransform: 'uppercase',
  },
  headline: {
    fontSize: 26, fontWeight: '800', color: '#fff',
    letterSpacing: -0.02, lineHeight: 30, marginTop: 4,
  },
  subtext: {
    fontSize: 13, fontWeight: '500',
    color: 'rgba(255,255,255,0.55)', marginTop: 6,
  },
  specialtyList: { gap: 8, marginBottom: 24 },
  specialtyItem: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
    borderRadius: 16,
    padding: 12,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  specialtyItemActive: {
    backgroundColor: 'rgba(33,85,255,0.18)',
    borderColor: '#3DCAE8',
    shadowColor: '#3DCAE8',
    shadowOpacity: 0.5,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 0 },
  },
  specialtyEmoji: {
    width: 40, height: 40, borderRadius: 11,
    backgroundColor: 'rgba(255,255,255,0.06)',
    alignItems: 'center', justifyContent: 'center',
  },
  specialtyEmojiActive: {
    backgroundColor: 'rgba(61,202,232,0.18)',
  },
  specialtyLabel: { fontSize: 15, fontWeight: '700', color: '#fff' },
  specialtySub: { fontSize: 12, fontWeight: '500', color: 'rgba(255,255,255,0.5)', marginTop: 1 },
  selectedDot: {
    width: 8, height: 8, borderRadius: 4,
    backgroundColor: '#3DCAE8',
  },
  goalLabel: {
    fontSize: 11, fontWeight: '800', color: 'rgba(255,255,255,0.5)',
    letterSpacing: 0.1, textTransform: 'uppercase', marginBottom: 8,
  },
  goalRow: { flexDirection: 'row', gap: 8 },
  goalOption: {
    flex: 1, borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.10)',
    paddingVertical: 12, alignItems: 'center',
  },
  goalOptionActive: {
    backgroundColor: 'rgba(33,85,255,0.22)',
    borderColor: '#3DCAE8',
  },
  goalTime: { fontSize: 18, fontWeight: '800', color: 'rgba(255,255,255,0.6)' },
  goalTimeActive: { color: '#fff' },
  goalSub: { fontSize: 11, fontWeight: '600', color: 'rgba(255,255,255,0.35)', marginTop: 2 },
  goalSubActive: { color: '#3DCAE8' },
  dots: { flexDirection: 'row', gap: 6 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.2)' },
  dotActive: { width: 22, backgroundColor: '#3DCAE8' },
});
