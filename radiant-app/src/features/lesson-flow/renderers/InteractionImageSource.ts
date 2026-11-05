import type { ImageSourcePropType } from 'react-native';

export type ResolvedInteractionImage = Readonly<{ source: ImageSourcePropType; width: number; height: number }>;
/** Explicit resolver: null refuses an image; never fall back to its remote URI. */
export type InteractionImageResolver = (ref: string) => ResolvedInteractionImage | null;
/** Dimensions determine the image frame and normalized hit regions. */
export function isResolvedInteractionImage(value: ResolvedInteractionImage | null | undefined): value is ResolvedInteractionImage {
    return value != null && value.source != null && Number.isFinite(value.width) && value.width > 0
        && Number.isFinite(value.height) && value.height > 0;
}

