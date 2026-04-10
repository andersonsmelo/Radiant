# iOS Soft Launch Checklist

## HIG acceptance

- typography scales without clipping on iPhone and iPad
- controls have accessible labels and clear hit targets
- content respects safe areas in portrait and landscape
- loading and error states are calm, legible and retryable
- iPad layouts avoid stretched single-column dead space
- quick win is visible before monetization pressure
- review prompt timing respects real success moments

## Release checklist

- EAS authenticated
- development-simulator build created for runtime validation
- preview build created
- production build created
- TestFlight internal smoke passed
- App Store metadata reviewed
- `pt-BR` metadata reviewed
- `en-US` metadata reviewed
- privacy answers reviewed
- push permission copy reviewed
- iPad layout smoke passed
- offline bootstrap smoke passed
- auth and sync smoke passed against public API
- App Store Impact block documented
- post-release reading owner assigned
- containment / rollback rule documented

## Preflight notes

- `preview` is the internal QA and soft-launch validation profile
- `production` is the App Store candidate profile after checklist sign-off
- `development-simulator` is the fallback path when the app still has no Apple Developer team available
- `preview` and `production` both require a valid Apple Developer team
- build notes and reviewer-facing copy live in `APP_STORE_METADATA.md`
- reviewer notes, listing matrix and timing policy must stay aligned with the
  runtime behavior of the candidate build

## Sign-off

- Release owner:
- Date:
- Build number:
- Notes:
