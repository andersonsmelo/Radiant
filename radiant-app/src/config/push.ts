import { readBooleanFlag } from './contracts';

export const PushConfig = {
    ENABLE_PUSH: readBooleanFlag(process.env.EXPO_PUBLIC_ENABLE_PUSH, true),
    PUSH_SHADOW_MODE: true, // start true, schedule disabled (logging only)
    PUSH_WINDOW_START_HOUR: 18, // local time
    PUSH_WINDOW_END_HOUR: 21,   // local time
};
