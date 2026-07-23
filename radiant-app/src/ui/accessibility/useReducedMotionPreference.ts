import { useEffect, useState } from 'react';
import { AccessibilityInfo } from 'react-native';

/**
 * Keeps motion behavior aligned with the device accessibility preference.
 *
 * `AccessibilityInfo` reports the initial value asynchronously and can notify
 * us when a person changes it while the app is open.
 */
export function useReducedMotionPreference(): boolean {
  const [reducedMotionEnabled, setReducedMotionEnabled] = useState(false);

  useEffect(() => {
    let mounted = true;

    AccessibilityInfo.isReduceMotionEnabled()
      .then((enabled) => {
        if (mounted) {
          setReducedMotionEnabled(enabled);
        }
      })
      .catch(() => {
        if (mounted) {
          setReducedMotionEnabled(false);
        }
      });

    const subscription = AccessibilityInfo.addEventListener('reduceMotionChanged', setReducedMotionEnabled);

    return () => {
      mounted = false;
      subscription.remove();
    };
  }, []);

  return reducedMotionEnabled;
}
