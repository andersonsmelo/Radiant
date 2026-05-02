import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { BlurView } from 'expo-blur';
import { StarfieldBackground } from '../../ui/components/StarfieldBackground';
import { AppButton } from '../../components/ui/AppButton';
import { PixelIllustration } from '../../ui/characters/PixelIllustration';

export default function OnboardWelcomeScreen() {
  return (
    <View style={styles.root}>
      <StarfieldBackground starCount={80} />
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>

        {/* Pixel hero centered */}
        <View style={styles.pixelContainer}>
          <PixelIllustration state="guide" size="lg" />
        </View>

        {/* Speech bubble */}
        <BlurView intensity={14} tint="dark" style={styles.speechBubble}>
          <Text style={styles.speechText}>Hi, I'm Pixel — your study companion</Text>
        </BlurView>

        {/* Title block */}
        <View style={styles.titleBlock}>
          <Text style={styles.eyebrow}>WELCOME TO RADIANT</Text>
          <Text style={styles.headline}>Read like a{'\n'}radiologist</Text>
          <Text style={styles.subtext}>Five minutes a day. Real cases. Spaced repetition that sticks.</Text>
        </View>

        {/* CTA + dots */}
        <View style={styles.ctaBlock}>
          <AppButton
            label="Get started →"
            onPress={() => router.push('/onboarding/value')}
            variant="galaxy"
            style={{ marginBottom: 14 }}
          />
          <View style={styles.dots}>
            {[0,1,2,3].map(i => (
              <View key={i} style={[styles.dot, i === 0 && styles.dotActive]} />
            ))}
          </View>
          <Pressable onPress={() => router.replace('/(tabs)')}>
            <Text style={styles.signinText}>
              Already have an account? <Text style={styles.signinLink}>Sign in</Text>
            </Text>
          </Pressable>
        </View>

      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#03030d' },
  safe: { flex: 1 },
  pixelContainer: {
    position: 'absolute',
    top: 90,
    alignSelf: 'center',
    zIndex: 4,
  },
  speechBubble: {
    position: 'absolute',
    top: 320,
    alignSelf: 'center',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    zIndex: 5,
    overflow: 'hidden',
  },
  speechText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: -0.005,
  },
  titleBlock: {
    position: 'absolute',
    top: 420,
    left: 28,
    right: 28,
    alignItems: 'center',
    zIndex: 4,
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: '800',
    color: '#3DCAE8',
    letterSpacing: 0.18,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  headline: {
    fontSize: 34,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: -0.025,
    lineHeight: 38,
    textAlign: 'center',
  },
  subtext: {
    fontSize: 15,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.62)',
    marginTop: 10,
    lineHeight: 22,
    textAlign: 'center',
  },
  ctaBlock: {
    position: 'absolute',
    bottom: 56,
    left: 20,
    right: 20,
    zIndex: 4,
    alignItems: 'center',
  },
  dots: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 14,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  dotActive: {
    width: 22,
    backgroundColor: '#3DCAE8',
  },
  signinText: {
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.5)',
    textAlign: 'center',
  },
  signinLink: {
    color: '#3DCAE8',
    fontWeight: '700',
  },
});
