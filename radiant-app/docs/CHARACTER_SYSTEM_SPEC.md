# Character System Specification (MVP)

## Vision & Purpose
The Radiant Character System ("Pixel") is designed to provide emotional guidance, celebration, and calm reinforcement inside a premium medical learning product. It acts as a companion, not a distraction. The tone is **Medical-Tech Premium** - calm, confident, and encouraging, never childish or overly cartoonish.

## Character Roster (MVP)
- **Pixel**: The primary mascot and study guide.
  - **Core Metaphor**: Enlightenment, clarity, "shedding light on knowledge."
- **Variants**: None for MVP. Single character, multiple emotional states.

## Emotional States
The character expresses 5 distinct states through static assets (MVP) or subtle animations (Future).

1.  **Idle**: Neutral, calm, ready. Used for headers or standard presence.
2.  **Thinking**: Pondering, processing. Used during complex questions or loading.
3.  **Happy**: Mild positive reinforcement. Used for correct answers or streak updates.
4.  **Celebrate**: High energy, glowing. Used for lesson completion, level up, or perfect scores.
5.  **Oops**: Empathetic, supportive (never mocking). Used for incorrect answers or missed goals.

## Placement Rules
- **Home Screen**: Optional small presence in the top header (idle state).
- **Quiz Summary**: Prominent appearance near XP/Result card (Celebrate or Happy).
- **Quiz Feedback**: Small appearance near feedback text (Happy or Oops).
- **Review Complete**: Celebrate state.

## Frequency & behavior
- **Max 1 Per Screen**: Never clutter the UI with multiple instances.
- **Auto-Hide**:
  - On scroll down (if in header).
  - If screen density is high (prioritize content).
- **Non-Blocking**: Reviewing content always takes precedence over character animations.

## Accessibility Rules
- **Alt Text**: Every character instance must have a descriptive `accessibilityLabel` (e.g., "Pixel comemorando seu progresso").
- **Redundancy**: Never convey success/failure *only* via the character. Always pair with text ("Correto", "Incorreto") and color markers.
- **Motion Reduction**: Respect user's `reduceMotion` preference (disable entry animations).

## Asset Strategy (MVP)
- **Current Phase**: Placeholder implementation.
  - **Visual**: clean circle with gradient background + state initials (e.g., "😊", "🤔").
- **Future Phase**: SVG/PNG assets.
  - Style: Flat, vector-based, utilizing the `primary` (Blue) and `warning` (Yellow) palette.
