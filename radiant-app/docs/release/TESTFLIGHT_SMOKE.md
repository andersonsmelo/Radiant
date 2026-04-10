# TestFlight Smoke

## Scenario 1: cold start offline

- launch the app in airplane mode
- expect startup to complete or degrade safely
- confirm the bootstrap screen remains readable and retryable if an error appears

## Scenario 2: auth bootstrap

- log in
- kill and relaunch the app
- expect session restore without manual re-authentication

## Scenario 3: quiz and review

- complete one quiz
- complete one review
- inspect `Progresso` for queue state and sync status

## Scenario 4: journey V2

- enable the V2 build or profile used for the journey rollout
- complete `Journey -> Lesson -> Checkpoint -> Reward`
- confirm the flow preserves state after a relaunch

## Scenario 5: paywall and review timing

- confirm the first useful experience happens before aggressive monetization
- confirm no review prompt appears before a real success moment
- if a paywall appears, verify it is contextual and not the first meaningful
  interaction

## Scenario 6: locale and listing coherence

- verify the build behavior still matches reviewer notes
- confirm the screenshots and captions planned for `pt-BR` and `en-US` still
  reflect the actual product flow
- confirm no debug-only surface appears in user-facing listing assets

## Evidence to capture

- cold-start screenshot
- auth restore screenshot
- quiz completion screenshot
- review completion screenshot
- journey completion screenshot
- paywall / no-paywall evidence for first-session value
- success moment evidence suitable for rating prompt timing review

## Pass criteria

- no crash during launch or relaunch
- offline mode does not block the local-first study flow
- sync queues drain or retry cleanly when connectivity returns
- the build still deserves the current metadata and reviewer notes
- first-session value is preserved before monetization pressure
