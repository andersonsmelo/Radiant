import { useEffect, useState } from 'react';
import { PixelMood, type PixelMoodResult } from './PixelMood';

export type SporadicSpeechTiming = {
  initialMinMs: number;
  initialMaxMs: number;
  visibleMs: number;
  intervalMinMs: number;
  intervalMaxMs: number;
};

export const SPORADIC_SPEECH_TIMING: SporadicSpeechTiming = {
  initialMinMs: 1_200,
  initialMaxMs: 2_600,
  visibleMs: 6_500,
  intervalMinMs: 28_000,
  intervalMaxMs: 45_000,
};

type SporadicSpeechOptions = {
  enabled?: boolean;
  random?: () => number;
  timing?: SporadicSpeechTiming;
};

function between(min: number, max: number, random: () => number): number {
  return Math.round(min + (max - min) * random());
}

/**
 * Mantém o Pixel vivo sem transformar sua fala em bloqueio ou ruído contínuo:
 * entrada curta, seis segundos visível e pelo menos 28 segundos de silêncio.
 */
export function useSporadicPixelSpeech({
  enabled = true,
  random = Math.random,
  timing = SPORADIC_SPEECH_TIMING,
}: SporadicSpeechOptions = {}): PixelMoodResult | null {
  const [speech, setSpeech] = useState<PixelMoodResult | null>(null);

  useEffect(() => {
    if (!enabled) {
      setSpeech(null);
      return undefined;
    }

    let cancelled = false;
    let showTimer: ReturnType<typeof setTimeout> | undefined;
    let hideTimer: ReturnType<typeof setTimeout> | undefined;

    const schedule = (delay: number) => {
      showTimer = setTimeout(() => {
        void PixelMood.resolveSporadic('abriu-o-app')
          .then((nextSpeech) => {
            if (cancelled) return;
            setSpeech(nextSpeech);
            hideTimer = setTimeout(() => {
              if (cancelled) return;
              setSpeech(null);
              schedule(between(timing.intervalMinMs, timing.intervalMaxMs, random));
            }, timing.visibleMs);
          })
          .catch(() => {
            if (!cancelled) {
              schedule(between(timing.intervalMinMs, timing.intervalMaxMs, random));
            }
          });
      }, delay);
    };

    schedule(between(timing.initialMinMs, timing.initialMaxMs, random));

    return () => {
      cancelled = true;
      if (showTimer) clearTimeout(showTimer);
      if (hideTimer) clearTimeout(hideTimer);
    };
  }, [enabled, random, timing]);

  return speech;
}
