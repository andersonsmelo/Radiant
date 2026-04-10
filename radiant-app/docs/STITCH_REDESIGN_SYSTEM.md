# Radiant Stitch Redesign System

## Status

Validated design direction for UI redesign using Google Stitch.

## Implementation Status

This document started as design-only guidance, but part of the direction is now implemented in the Expo app.

Implemented in `radiant-app`:

- foundation visual V2 with centralized tokens, motion, shadows and light surfaces
- official mascot system using `Lux`
- `Journey Home` in the `Radiology Journey` direction
- `Lesson Flow` with diagnostic-image-first composition
- dedicated `Checkpoint` screen and route
- `Review` and `Quiz` migrated to the same bright progression system

Still pending in this design family:

- dedicated `Reward` flow
- expansion of the V2 visual system to all secondary screens
- final iPhone simulator visual QA pass with spacing refinements

## Purpose

Define the branding, layout system, button system, and Stitch prompting strategy for the next full visual redesign of Radiant.

This document remains the source of truth for visual direction, even though a first implementation slice already exists.

## Understanding Summary

- Radiant is a mobile-first radiology learning app with a local-first product architecture.
- The redesign must make the product feel more professional, polished, and game-informed without becoming childish.
- The emotional direction is progress energizing.
- The product position is "Duolingo for radiology" with highly visible progression.
- Gamification should remain light, not casino-like and not visually noisy.
- The main experience should be journey-first, centered on the next learning step.
- The redesign must feel trustworthy for a medical-learning context while avoiding the look of a cold clinical tool.

## Assumptions

- The Learning Road is the correct foundation for the visual redesign and should become the main structural anchor.
- The existing character system can be evolved rather than replaced.
- The new design system must be maintainable by a founder plus AI workflow with low design-ops overhead.
- The first Stitch pass should prioritize mobile iPhone-first screens.
- Performance must remain disciplined on mobile, allowing only selective high-impact motion.
- A future implementation will need a compact component system with strong visual consistency and limited special cases.

## Decision Log

- Emotional direction: progress energizing
- Aesthetic base: strategic game
- Positioning: Duolingo for radiology
- Gamification level: light
- Professional vs playful balance: 50 / 50
- Primary brand anchor: mascot
- Mascot role: primary guide
- Mascot personality: energy and encouragement
- Primary color direction: electric blue plus cyan
- Main structure: journey-first
- Primary surface focus: journey and lesson
- Platform guide: mobile-first native iPhone reference
- Performance stance: balanced
- Density level: medium
- Trust signal: reliable health and medicine learning product
- Scale assumption: consumer app ready to grow
- Maintenance model: founder plus AI
- Primary anti-goal: avoid cold clinical app feeling
- Recommended design direction: Tactical Bright Learning

## Recommended Design Direction

### Name

Tactical Bright Learning

### Thesis

Radiant should feel like an intelligent learning companion for radiology mastery. The interface must transform progress into visible energy while preserving enough seriousness to remain credible in a medical education context.

It should not feel like:

- a hospital dashboard
- a generic SaaS template
- a toy-like educational game

It should feel like:

- focused
- motivating
- premium
- bright
- progression-driven

## DFII

- Aesthetic Impact: 4
- Context Fit: 5
- Implementation Feasibility: 5
- Performance Safety: 4
- Consistency Risk: 2

DFII: 13/15

## Brand System

### Brand Personality

- Energetic progress
- Friendly competence
- Reward without excess
- Clear before flashy

### Differentiation Anchor

If someone sees a screenshot without the logo, they should recognize Radiant by:

- a bright electric blue and cyan identity
- a journey-centered progression structure
- a mascot acting as a motivating guide
- action-first mobile composition rather than dashboard-first composition

### Color Story

#### Primary

- Electric blue
- Cyan accent

#### Supporting Neutrals

- Cool graphite
- Blue-gray surfaces
- Soft off-white with slight blue cast

#### Semantic

- Success: mint green
- Warning: controlled amber
- Error: restrained red, not alarmist

### Color Intent

- Blue builds trust and technical credibility.
- Cyan introduces motion, progress, and feedback energy.
- Mint marks completion and reward.

### Typography Direction

The product should use one expressive display direction and one restrained body direction.

Recommended tone:

- Display: geometric, assertive, slightly futuristic
- Body: highly legible, neutral, modern, not corporate-generic

Suggested font exploration for Stitch and later implementation:

- Display candidates: Space Grotesk, Sora, Orbitron-lite direction, Exo 2
- Body candidates: Manrope, Plus Jakarta Sans, IBM Plex Sans, Outfit

Selection rule:

- titles must feel active and confident
- body text must feel medically trustworthy and fast to read

### Mascot System

#### Role

The mascot is the main guide, not a decoration.

#### Jobs

- welcome the user into the session
- encourage next-step continuation
- celebrate completion and streak recovery
- soften friction after interruption or missed days

#### Placement Rules

- onboarding
- journey intro
- checkpoint moments
- completion moments
- recovery states

#### Avoid

- constant presence on every screen
- oversized mascot blocks
- childish reaction spam

## Layout Architecture

### Core UX Principle

Every screen answers one dominant question.

- Journey: what is my next step?
- Lesson: what do I do now?
- Checkpoint: what did I unlock or complete?
- Review: what should I reinforce?
- Profile: how am I evolving?

### Primary Screen Hierarchy

1. Journey Home
2. Lesson Flow
3. Checkpoint / Reward
4. Review
5. Profile / Progress

### Current rollout status

- `Journey Home`: implemented
- `Lesson Flow`: implemented
- `Checkpoint`: implemented
- `Review`: implemented
- `Quiz`: visually aligned with this system even though it is not listed above as a primary redesign surface
- `Reward`: pending
- `Profile / Progress`: pending migration

### Journey Home

This becomes the product center of gravity.

It should include:

- compact top context
- visible journey track or node sequence
- one dominant next-step CTA
- macro progress signals
- limited distractions outside the study loop

It should avoid:

- equal-weight cards competing for attention
- dashboard-first information architecture
- large analytics blocks before action

### Lesson Flow

This must be the cleanest screen family in the app.

Rules:

- short content blocks
- persistent sense of forward movement
- minimal chrome
- one primary action
- high text legibility

### Checkpoint / Reward

This surface carries emotional reinforcement.

Rules:

- celebratory, but brief
- visually distinct from normal learning screens
- framed as earned progress, not random reward

Implementation note:

- `Checkpoint` is now a dedicated screen in the app
- `Reward` is still pending and should not be conflated with `Checkpoint`

### Review

The review experience should feel like maintenance of mastery, not punishment.

Rules:

- lighter and sharper than lesson mode
- easy triage of what needs attention
- quick restart into active review

Implementation note:

- `ReviewScreen` and `ReviewCard` already use the V2 primitives and bright surfaces
- the interaction model remains the existing one-question review loop

## Spatial Composition

- medium density
- vertical rhythm with clear segmenting
- asymmetry allowed in hero and journey compositions
- cards only when they carry narrative structure
- progress bars, node chains, and segmented tracks should be recurring motifs

## Button System

The button system must be small, explicit, and durable.

### 1. Primary Button

Use:

- next lesson
- continue
- start review
- complete checkpoint

Visual behavior:

- filled surface
- strong electric blue base
- cyan energy edge or highlight
- confident rounded geometry

Emotional job:

- move the user forward immediately

### 2. Secondary Button

Use:

- alternative actions
- supporting navigation
- less critical flow branches

Visual behavior:

- dark translucent or muted filled surface
- technical border or controlled contrast
- clearly subordinate to primary

### 3. Tertiary Button

Use:

- small actions
- text-only interactions
- low-visual-weight utilities

### 4. Reward CTA

Use sparingly for:

- claim progress
- continue after success
- unlock next segment

Visual behavior:

- a celebratory primary variant
- more luminous than standard primary
- no gambling aesthetics

### Required States

- default
- pressed
- disabled
- loading
- success

### Rules

- only one dominant CTA per screen
- icons only when clarity improves
- touch targets must remain mobile-native friendly
- motion must be short and purposeful

## Signature Components

### Journey Node

This is the signature component of the system.

It should communicate:

- current position
- locked vs unlocked
- next action
- completion status

### Progress Strip

Compact progression feedback for:

- lesson completion
- weekly advancement
- streak continuity

### Mascot Prompt Card

Short contextual guidance surface used selectively.

### Lesson Card

Used for structured micro-content and lightweight segmentation.

### Checkpoint Banner

Short celebratory surface for completion and earned advancement.

## Motion Philosophy

- sparse
- high-signal
- progress-oriented

Recommended motion moments:

- first load of journey hero
- node activation
- CTA press
- checkpoint completion

Avoid:

- ambient looping animation everywhere
- decorative bounce spam
- slow transitions that block flow

## Accessibility and Trust Constraints

- strong contrast in educational reading surfaces
- obvious focus and pressed states
- no low-contrast cyan on white for critical controls
- reward color usage must not reduce clarity
- copy and visuals must keep enough seriousness for health education

## Anti-Goals

Avoid at all costs:

- cold clinical dashboard look
- childish edtech tone
- generic SaaS card stack
- over-gamified visual noise
- purple-on-white template aesthetics

## Stitch Workflow

Use Stitch in controlled rounds.

### Round 1: Brand and Core Experience

Goal:

- validate the visual language
- validate journey-first hierarchy
- validate mascot role

Priority screens:

1. Journey Home
2. Lesson Flow
3. Checkpoint / Reward

### Round 2: System Expansion

Goal:

- extend approved style to broader product surfaces

Screens:

1. Review Screen
2. Profile / Progress
3. Onboarding Intro

### Round 3: Refinement

Goal:

- tune hierarchy
- tune density
- tune button behavior
- tune mascot presence

## Stitch Prompt Master

```text
Design a mobile iPhone-first app interface for Radiant, a radiology learning app for students and trainees.

The design direction is Tactical Bright Learning: energetic progress-first, strategically game-inspired, but still trustworthy for a medical education product.

Core product qualities:
- local-first learning app
- visible progression
- light gamification
- journey-first experience
- mascot as a motivating guide
- professional but lively

Visual direction:
- electric blue and cyan as primary brand colors
- cool graphite and blue-gray neutral surfaces
- medium information density
- clean but dynamic layout
- premium mobile-native feel
- strong CTA hierarchy

Important constraints:
- avoid cold clinical dashboard feeling
- avoid childish edtech style
- avoid generic SaaS card layout
- avoid over-gamified or casino-like reward styling

The interface should feel like Duolingo for radiology, but more polished, more credible, and more premium.
```

## Stitch Prompt: Journey Home

```text
Create the main home screen for Radiant, a mobile radiology learning app.

This is a journey-first screen. The user should instantly understand their next learning step.

Include:
- a compact top section with greeting, daily context, and mascot guidance
- a visible progression map or structured journey path
- one dominant primary CTA for the next lesson
- progress signals such as streak, unit progress, and current stage
- light supporting elements only if they help continuation

Visual style:
- electric blue and cyan brand palette
- premium strategic game-inspired UI
- energetic but medically trustworthy
- medium density
- mobile native iPhone feel

Avoid:
- dashboard-heavy metrics
- too many equal-weight cards
- childish visuals
- sterile clinical layout
```

## Stitch Prompt: Lesson Flow

```text
Create a lesson flow screen for Radiant, a radiology microlearning app.

This screen must feel focused, fast, and motivating. It should emphasize clear reading and visible progress through a lesson.

Include:
- a minimal header with lesson context
- clear content blocks for microlearning
- a visible progress indicator
- one dominant continue CTA
- optional mascot support only if it helps motivation without interrupting reading

Visual style:
- clean, bright, confident, premium
- electric blue and cyan accents
- medium density
- high legibility
- subtle game-inspired progression cues

Avoid:
- clutter
- too many decorative cards
- cold educational software appearance
- toy-like learning app styling
```

## Stitch Prompt: Checkpoint / Reward

```text
Create a checkpoint completion screen for Radiant, a radiology learning app with light gamification.

This screen should celebrate progress in a short, elegant, motivating way.

Include:
- clear completion message
- visible earned progress or unlocked next step
- mascot as encouraging guide
- one primary CTA to continue
- optional secondary CTA for reviewing progress

Visual style:
- celebratory but disciplined
- electric blue, cyan, and a controlled mint reward accent
- premium mobile game-inspired energy
- not flashy, not childish

Avoid:
- casino reward aesthetics
- confetti overload
- cartoon-heavy visuals
- low-trust educational style
```

## Stitch Prompt: Review Screen

```text
Create a review screen for Radiant, a radiology learning app.

The review surface should feel like reinforcement of mastery, not punishment.

Include:
- clear review queue or next review item
- visible count or urgency signal
- one strong start review CTA
- progress reinforcement with calm confidence

Visual style:
- same Tactical Bright Learning system
- professional and motivating
- cleaner and sharper than the main journey screen
- mobile-first iPhone layout

Avoid:
- intimidating backlog presentation
- dashboard-style clutter
- clinical coldness
```

## Stitch Prompt: Profile / Progress

```text
Create a profile and progress screen for Radiant, a radiology learning app.

This screen should express mastery, continuity, and earned progress.

Include:
- user identity area
- streak and progress summary
- unit or track advancement
- earned badges or achievements in a restrained format
- lightweight settings entry points

Visual style:
- premium, energetic, and clean
- electric blue and cyan identity
- medium density
- progression-oriented layout

Avoid:
- corporate analytics dashboard feel
- cluttered gamification wall
- childish badge presentation
```

## Stitch Evaluation Checklist

Use this checklist to select the best variants:

- Does the screen feel like progress is the product?
- Does it avoid cold clinical software vibes?
- Does it avoid childish edtech visuals?
- Is there one dominant action per screen?
- Is the mascot helpful rather than decorative?
- Is the electric blue and cyan system memorable?
- Does the layout feel mobile-native instead of generic app-template?
- Would this still be maintainable as a compact design system?

## Next Handoff

Once a Stitch direction is selected:

1. choose the strongest visual variant
2. extract colors, typography, button logic, and component motifs
3. convert the result into implementation-ready UI tokens and screen specs
4. map the new visual system onto the existing `journey`, `lesson-flow`, `review`, and `progress` surfaces
