# Radiant Motion System

This document defines the motion design tokens and animation presets for the Radiant application.

## Philosophy

Motion in Radiant serves three purposes:
1. **Guide attention** - Direct users to important information
2. **Provide feedback** - Confirm actions and communicate state changes
3. **Enhance delight** - Create moments of joy and celebration

All animations use the React Native Animated API with native driver support for optimal performance.

---

## Duration Tokens

Duration values are defined in milliseconds and should be used consistently across the app.

| Token | Value | Usage |
|-------|-------|-------|
| `duration.fast` | 200ms | Quick micro-interactions, hover states, simple fades |
| `duration.base` | 300ms | Standard transitions, most UI state changes |
| `duration.slow` | 400ms | Smooth, deliberate state changes |
| `duration.celebrate` | 600ms | Success animations, rewards, XP awards |

### Usage Example

```typescript
import { duration } from '../ui/motion';

Animated.timing(opacity, {
  toValue: 1,
  duration: duration.fast,
  useNativeDriver: true,
}).start();
```

---

## Easing Functions

Easing functions control the acceleration curve of animations.

| Function | Curve | Usage |
|----------|-------|-------|
| `easing.standard` | Ease in-out | Balanced, general-purpose animations |
| `easing.enter` | Ease out | Elements entering the screen |
| `easing.exit` | Ease in | Elements leaving the screen |
| `easing.spring` | Bouncy bezier | Playful, attention-grabbing effects |
| `easing.decelerate` | Cubic out | Sharp deceleration, settling into place |

### Usage Example

```typescript
import { easing } from '../ui/motion';

Animated.timing(translateY, {
  toValue: 0,
  duration: 300,
  easing: easing.enter,
  useNativeDriver: true,
}).start();
```

---

## Animation Presets

Pre-built animation functions for common patterns. All presets return an `Animated.CompositeAnimation` that can be started with `.start()`.

### fadeInUp

Fade in with upward slide - common for content appearing from below.

**Parameters:**
- `opacity: Animated.Value` - Opacity value (0 → 1)
- `translateY: Animated.Value` - Vertical position (initial → 0)
- `config?: { duration?: number; delay?: number }` - Optional configuration

**Example:**
```typescript
import { fadeInUp } from '../ui/motion';

const opacity = useRef(new Animated.Value(0)).current;
const translateY = useRef(new Animated.Value(20)).current;

useEffect(() => {
  fadeInUp(opacity, translateY, { duration: 300 }).start();
}, []);

// In render:
<Animated.View style={{ opacity, transform: [{ translateY }] }}>
  {/* content */}
</Animated.View>
```

---

### scalePop

Scale pop animation for success states and appearing elements.

**Parameters:**
- `scale: Animated.Value` - Scale value (fromScale → 1)
- `opacity: Animated.Value` - Opacity value (0 → 1)
- `config?: { duration?: number; fromScale?: number }` - Optional configuration (default fromScale: 0.95)

**Example:**
```typescript
import { scalePop } from '../ui/motion';

const scale = useRef(new Animated.Value(0.95)).current;
const opacity = useRef(new Animated.Value(0)).current;

useEffect(() => {
  if (showSuccess) {
    scalePop(scale, opacity).start();
  }
}, [showSuccess]);

// In render:
<Animated.View style={{ opacity, transform: [{ scale }] }}>
  {/* success content */}
</Animated.View>
```

**Used in:**
- XP award display (QuizScreen)
- Correct answer feedback (QuizFeedback)

---

### pulse

Pulse animation for drawing attention to elements.

**Parameters:**
- `scale: Animated.Value` - Scale value (1 → toScale → 1)
- `config?: { duration?: number; toScale?: number }` - Optional configuration (default toScale: 1.05)

**Example:**
```typescript
import { pulse } from '../ui/motion';

const scale = useRef(new Animated.Value(1)).current;

const handlePulse = () => {
  pulse(scale, { toScale: 1.08 }).start();
};

// In render:
<Animated.View style={{ transform: [{ scale }] }}>
  {/* pulsing element */}
</Animated.View>
```

---

### shakeError

Horizontal shake animation for error states.

**Parameters:**
- `translateX: Animated.Value` - Horizontal position (0 → -distance → distance → 0)
- `config?: { duration?: number; distance?: number }` - Optional configuration (default distance: 10)

**Example:**
```typescript
import { shakeError } from '../ui/motion';

const translateX = useRef(new Animated.Value(0)).current;

useEffect(() => {
  if (hasError) {
    shakeError(translateX).start();
  }
}, [hasError]);

// In render:
<Animated.View style={{ transform: [{ translateX }] }}>
  {/* error content */}
</Animated.View>
```

**Used in:**
- Incorrect answer feedback (QuizFeedback)

---

### glowSuccess

Subtle scale + opacity for success feedback.

**Parameters:**
- `scale: Animated.Value` - Scale value (0.98 → 1)
- `opacity: Animated.Value` - Opacity value (0 → 1)
- `config?: { duration?: number }` - Optional configuration

**Example:**
```typescript
import { glowSuccess } from '../ui/motion';

const scale = useRef(new Animated.Value(0.98)).current;
const opacity = useRef(new Animated.Value(0)).current;

useEffect(() => {
  if (goalCompleted) {
    glowSuccess(scale, opacity).start();
  }
}, [goalCompleted]);

// In render:
<Animated.View style={{ opacity, transform: [{ scale }] }}>
  {/* goal completion banner */}
</Animated.View>
```

**Used in:**
- Daily goal completion banner (QuizScreen)

---

### fadeIn

Simple fade in for general content appearing.

**Parameters:**
- `opacity: Animated.Value` - Opacity value (0 → 1)
- `config?: { duration?: number; delay?: number }` - Optional configuration

**Example:**
```typescript
import { fadeIn } from '../ui/motion';

const opacity = useRef(new Animated.Value(0)).current;

useEffect(() => {
  fadeIn(opacity, { duration: 200, delay: 100 }).start();
}, []);

// In render:
<Animated.View style={{ opacity }}>
  {/* content */}
</Animated.View>
```

---

## Best Practices

### 1. Use Native Driver
Always set `useNativeDriver: true` for transform and opacity animations:
```typescript
// ✅ Good
Animated.timing(opacity, {
  toValue: 1,
  duration: duration.fast,
  useNativeDriver: true, // Runs on native thread
}).start();

// ❌ Bad
Animated.timing(opacity, {
  toValue: 1,
  duration: duration.fast,
  useNativeDriver: false, // Runs on JS thread
}).start();
```

### 2. Reset Values Before Animating
Always reset animated values to their initial state before starting:
```typescript
// ✅ Good
useEffect(() => {
  opacity.setValue(0);
  fadeIn(opacity).start();
}, [dependency]);

// ❌ Bad - may not animate if already at target value
useEffect(() => {
  fadeIn(opacity).start();
}, [dependency]);
```

### 3. Choose Appropriate Durations
- **fast** (200ms): Simple fades, quick feedback
- **base** (300ms): Most transitions
- **slow** (400ms): Complex state changes
- **celebrate** (600ms): Rewards, achievements

### 4. Match Easing to Context
- **enter**: Elements appearing
- **exit**: Elements disappearing
- **spring**: Playful, attention-grabbing
- **decelerate**: Settling into final position

### 5. Combine Animations Thoughtfully
Use `Animated.parallel()` for simultaneous animations:
```typescript
Animated.parallel([
  fadeIn(opacity),
  Animated.timing(translateY, { /* ... */ }),
]).start();
```

Use `Animated.sequence()` for sequential animations:
```typescript
Animated.sequence([
  pulse(scale),
  fadeIn(opacity),
]).start();
```

---

## Performance Considerations

1. **Limit simultaneous animations** - Too many concurrent animations can cause jank
2. **Use native driver** - Offloads animation to native thread
3. **Avoid animating layout properties** - Stick to transform and opacity
4. **Clean up animations** - Stop animations in cleanup functions:

```typescript
useEffect(() => {
  const animation = fadeIn(opacity).start();

  return () => {
    animation.stop();
  };
}, []);
```

---

## Future Enhancements

Potential additions to the motion system:
- Gesture-based animations (swipe, drag)
- Spring physics animations
- Stagger animations for lists
- Page transition presets
- Loading state animations
