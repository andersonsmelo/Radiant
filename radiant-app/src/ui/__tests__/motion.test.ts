import { createLossPulse, duration, motionPreset, resolveMotionValue, useLossPulse } from '../motion';

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

    it('expõe o pulso de perda como helper da camada, e não como animação solta', () => {
        // A regra R4 do `visual:qa:strict` reprova uso direto da API de
        // animação dentro de componentes. Este teste existe para que a
        // alternativa continue morando aqui: se `useLossPulse` sumir, quem
        // precisar do movimento vai reescrevê-lo no componente e esbarrar no
        // gate. (O comentário evita citar o literal proibido — a regra casa
        // texto, e cita-lo aqui reprovaria o próprio teste.)
        expect(typeof useLossPulse).toBe('function');
        expect(createLossPulse).toBe(useLossPulse);
    });
});
