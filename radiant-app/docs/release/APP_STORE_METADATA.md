# App Store Metadata

## Uso deste documento

Este arquivo resume a camada operacional de metadata e aponta para a matriz
bilíngue oficial.

- matriz canônica:
  [`APP_STORE_LISTING_MATRIX.md`](APP_STORE_LISTING_MATRIX.md)
- política de timing de review e monetização:
  [`RATING_AND_PAYWALL_TIMING.md`](RATING_AND_PAYWALL_TIMING.md)

## Metadata base `pt-BR`

- Subtitle:
  `Estudo diário de radiologia com quiz e revisão`
- Promo text:
  `Crie um hábito consistente de estudo em radiologia com lições curtas, feedback imediato e revisão espaçada.`
- Keywords:
  `radiologia,estudo,imagem medica,quiz,flashcards,revisao,habito`

## Metadata base `en-US`

- Subtitle:
  `Daily radiology study with quiz and review`
- Promo text:
  `Build a daily radiology study habit with short lessons, instant quiz feedback and spaced review.`
- Keywords:
  `radiology,study,medical imaging,quiz,flashcards,review,habit`

## Review notes base

`This build preserves the local-first study flow, supports account login, retries sync when connectivity returns and keeps technical/debug surfaces restricted by build configuration.`

## ASO alignment

- target keyword cluster: radiology study, quiz, review
- screenshots must show quiz, review and journey
- the promo text should stay aligned with the learning habit promise, not acquisition hype
- metadata changes must declare hypothesis, locale and reading window

## Store hygiene

- confirm subtitle length on both iPhone and iPad listing previews
- confirm keyword order against the final ASO plan before submission
- keep reviewer notes in sync with the current beta gate and auth state
- validate both `pt-BR` and `en-US` before release sign-off
