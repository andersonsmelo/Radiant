import type { ImageSourcePropType } from 'react-native';

/** `alt` é o texto alternativo do cadastro da imagem; quem chama pode trazer o próprio. */
export type ResolvedInteractionImage = Readonly<{ source: ImageSourcePropType; width: number; height: number; alt?: string }>;
/** Explicit resolver: null refuses an image; never fall back to its remote URI. */
export type InteractionImageResolver = (ref: string) => ResolvedInteractionImage | null;
/** Dimensions determine the image frame and normalized hit regions. */
export function isResolvedInteractionImage(value: ResolvedInteractionImage | null | undefined): value is ResolvedInteractionImage {
    return value != null && value.source != null && Number.isFinite(value.width) && value.width > 0
        && Number.isFinite(value.height) && value.height > 0;
}

