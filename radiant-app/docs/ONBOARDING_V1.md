# Onboarding v1

**Goal:** A calm, progressive onboarding experience for the first 7 days.
**Strategy:** "Show by doing", logic-driven, no blocking modals.

## Philosophy
1. **Autonomy:** User is never forced to click.
2. **Context:** Helpers appear only when relevant (e.g., after first quiz).
3. **Silence:** After Day 7, the system completely steps back.

## Stages

### Day 0: First Launch (Soft Introduction)
- **Trigger:** First strict app open.
- **UI:** Card on Home (below header).
- **Content:** Welcome message + "Começar" button.
- **Action:** Lead to Quiz.
- **Dismiss:** Permanent if "Pular" is clicked.

### Day 1-2: Guided First Actions
- **Trigger:** After first quiz completion.
- **UI:** Summary screen inline message.
- **Content:** "Esse XP constrói sua consistência."

### Day 3-4: Contextual Review
- **Trigger:** First time review items are due.
- **UI:** Inline helper on Home near review button.
- **Content:** "Revisões rápidas mantêm o conhecimento vivo."

### Day 5-6: Habit Reinforcement
- **Trigger:** Activity on ≥ 3 distinct days.
- **UI:** Summary screen inline message.
- **Content:** "Você está criando uma rotina sólida."

### Day 7: Closure
- **Trigger:** 7 days since first open.
- **UI:** Home banner.
- **Content:** "Agora o Radiant se adapta ao seu ritmo."
- **Result:** Onboarding flag set to `completed`.

## Technical Architecture

### `OnboardingService`
- **Storage:** `AsyncStorage` ('@radiant/onboarding')
- **State:**
  ```typescript
  interface OnboardingState {
    startedAt: number; // Timestamp
    dismissedIntro: boolean;
    hasCompletedFirstQuiz: boolean;
    hasCompletedFirstReview: boolean;
    activeDays: number;
    isCompleted: boolean;
  }
  ```
- **Methods:**
  - `init()`: Checks/creates start timestamp.
  - `getStage()`: Returns current strict stage (Day 0-7).
  - `shouldShowIntro()`: Boolean.
  - `markAction(action)`: Updates state and sends telemetry.

### Telemetry Events
- `onboarding_start`
- `onboarding_dismiss`
- `onboarding_step_complete` { step: 'first_quiz' | 'first_review' }
- `onboarding_complete`
