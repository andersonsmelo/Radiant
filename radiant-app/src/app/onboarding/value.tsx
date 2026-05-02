import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Animated, { useSharedValue, withTiming, withDelay, useAnimatedStyle } from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';
import { StarfieldBackground } from '../../ui/components/StarfieldBackground';
import { AppButton } from '../../components/ui/AppButton';
import { PixelIllustration } from '../../ui/characters/PixelIllustration';

const ITEMS = [
  {
    color: '#3DCAE8',
    title: 'Spaced, not crammed',
    sub: 'Adaptive review brings tough cases back at the right moment.',
  },
  {
    color: '#F5A623',
    title: 'Real radiology cases',
    sub: 'Plain films, CT, and MRI from real teaching libraries.',
  },
  {
    color: '#1A9C71',
    title: 'Five minutes a day',
    sub: 'Bite-sized sessions. Streaks. Visible progress.',
  },
];

function FeatureCard({ item, delay }: { item: typeof ITEMS[0]; delay: number }) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(16);

  useEffect(() => {
    opacity.value = withDelay(delay, withTiming(1, { duration: 600 }));
    translateY.value = withDelay(delay, withTiming(0, { duration: 600 }));
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View style={[styles.featureCard, animStyle]}>
      <View style={[styles.featureIcon, { borderColor: `${item.color}30` }]}>
        <Svg width={22} height={22} viewBox="0 0 24 24">
          <Path d="M12 2C12 2 9 8 9 12c0 1.66 1.34 3 3 3s3-1.34 3-3c0-1-1-3-1-4 0 0 4 2 4 7 0 3.31-2.69 6-6 6S6 18.31 6 15c0-5.5 4-9 6-13z" fill={item.color}/>
        </Svg>
      </View>
      <View style={{ flex: 1, paddingTop: 2 }}>
        <Text style={styles.featureTitle}>{item.title}</Text>
        <Text style={styles.featureSub}>{item.sub}</Text>
      </View>
    </Animated.View>
  );
}

export default function OnboardValueScreen() {
  return (
    <View style={styles.root}>
      <StarfieldBackground starCount={50} />
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>

        <View style={styles.header}>
          <Text style={styles.eyebrow}>WHY RADIANT</Text>
          <Text style={styles.headline}>Built for the way{'\n'}residents actually learn.</Text>
        </View>

        <View style={styles.cards}>
          {ITEMS.map((item, i) => (
            <FeatureCard key={i} item={item} delay={i * 120} />
          ))}
        </View>

        {/* Mini Pixel bottom-right */}
        <View style={styles.pixelMini}>
          <PixelIllustration state="happy" size="sm" />
        </View>

        <View style={styles.ctaBlock}>
          <AppButton
            label="Continue →"
            onPress={() => router.push('/onboarding/goal')}
            variant="galaxy"
            style={{ marginBottom: 14 }}
          />
          <View style={styles.dots}>
            {[0,1,2,3].map(i => (
              <View key={i} style={[styles.dot, i === 1 && styles.dotActive]} />
            ))}
          </View>
        </View>

      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#03030d' },
  safe: { flex: 1 },
  header: {
    paddingHorizontal: 24,
    paddingTop: 28,
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: '800',
    color: '#3DCAE8',
    letterSpacing: 0.18,
    textTransform: 'uppercase',
  },
  headline: {
    fontSize: 30,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: -0.025,
    lineHeight: 34,
    marginTop: 6,
  },
  cards: {
    position: 'absolute',
    top: 220,
    left: 20,
    right: 20,
    gap: 12,
    zIndex: 3,
  },
  featureCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
    borderRadius: 18,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
  },
  featureIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: -0.01,
  },
  featureSub: {
    fontSize: 13,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.62)',
    marginTop: 3,
    lineHeight: 18,
  },
  pixelMini: {
    position: 'absolute',
    right: 16,
    bottom: 156,
    zIndex: 4,
  },
  ctaBlock: {
    position: 'absolute',
    bottom: 56,
    left: 20,
    right: 20,
    zIndex: 4,
    alignItems: 'center',
  },
  dots: { flexDirection: 'row', gap: 6, marginBottom: 0 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.2)' },
  dotActive: { width: 22, backgroundColor: '#3DCAE8' },
});
