/**
 * Character System Types
 */

export type CharacterState = 'idle' | 'thinking' | 'guide' | 'happy' | 'celebrate' | 'oops';
export type CharacterSize = 'sm' | 'md' | 'lg';
export type CharacterAlign = 'left' | 'right' | 'center';
export type CharacterTier = 'starter' | 'intermediate' | 'advanced';

export interface CharacterSpec {
    id: string;
    name: string;
    states: Record<CharacterState, any>; // Placeholder for asset references (e.g., ImageSourcePropType)
}

export interface CharacterSlotProps {
    /** The emotional state to display */
    state: CharacterState;
    /** Size of the character avatar (default: 'md') */
    size?: CharacterSize;
    /** Whether the character is currently visible (default: true) */
    visible?: boolean;
    /** Optional text bubble/caption to display alongside */
    text?: string;
    /** Alignment of the text relative to the character (default: 'right') */
    align?: CharacterAlign;
    /** Optional evolution tier for the mascot presentation */
    tier?: CharacterTier;
}
