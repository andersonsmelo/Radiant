import { duration, motionPreset, resolveMotionValue } from '../motion';

describe('motion tokens', () => {
    it('keeps durations in ascending order for predictable UI pacing', () => {
        expect(duration.micro).toBeLessThan(duration.ui);
        expect(duration.ui).toBeLessThan(duration.celebrate);
    });

    it('keeps micro interactions fast enough for tap feedback', () => {
        expect(duration.micro).toBeLessThanOrEqual(180);
    });

    it('keeps wave 1 motion presets aligned to the base pacing tokens', () => {
        expect(motionPreset.journeyEnter.duration).toBe(duration.ui);
        expect(motionPreset.lessonStepEnter.duration).toBe(duration.ui);
        expect(motionPreset.celebration.duration).toBe(duration.celebrate);
        expect(motionPreset.lessonStepEnter.translateY).toBeGreaterThan(motionPreset.journeyEnter.translateY);
    });

    it('resolves motion values when reduced motion is enabled', () => {
        expect(resolveMotionValue('animated', 'reduced', false)).toBe('animated');
        expect(resolveMotionValue('animated', 'reduced', true)).toBe('reduced');
    });
});
