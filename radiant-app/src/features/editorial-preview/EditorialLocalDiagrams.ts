import type { ResolvedInteractionImage } from '../lesson-flow/renderers/InteractionImageSource';
import type { EditorialDiagramAssetV1 } from '../student-checkpoints/EditorialPilotContract';

const uri = (name: string) => `https://raw.githubusercontent.com/andersonsmelo/Radiant/refs/heads/claude/conteudo-reinicio-tecnologo/radiant-app/assets/content/rtg-2026/pilot/${name}.png`;

/** Trusted declarations; AST/byte tests bind every require, SHA-256 and dimension to the source manifest. */
export const EDITORIAL_LOCAL_DIAGRAMS = [
    { id: 'asset:rtg-2026:pilot:view-front', uri: uri('view-front'), sha256: '63e7e8ece236d87b41b7c8f04bb40f50af61da7393d031b3a36810297a41361f',
        source: require('../../../assets/content/rtg-2026/pilot/view-front.png'), width: 800, height: 1000 },
    { id: 'asset:rtg-2026:pilot:view-back', uri: uri('view-back'), sha256: '106cf74a072538ab0514666010b5d91c560078207c5bbf12562f51b5245e34d4',
        source: require('../../../assets/content/rtg-2026/pilot/view-back.png'), width: 800, height: 1000 },
    { id: 'asset:rtg-2026:pilot:marker-a', uri: uri('marker-a'), sha256: '46065fd10483173d88e26c521d73752bd7c8132803cebfa147f4fe8f334d1728',
        source: require('../../../assets/content/rtg-2026/pilot/marker-a.png'), width: 800, height: 1000 },
    { id: 'asset:rtg-2026:pilot:marker-b', uri: uri('marker-b'), sha256: '89e3da9cc7136483ee426df44ebaf1476eecc00eed389d4e672abd6e91de3ac3',
        source: require('../../../assets/content/rtg-2026/pilot/marker-b.png'), width: 800, height: 1000 },
] as const;

/** Metadata match, not runtime file hashing. No fetch, download or URI fallback is performed. */
export function resolveEditorialLocalDiagram(asset: Pick<EditorialDiagramAssetV1, 'id' | 'uri' | 'sha256'>): ResolvedInteractionImage | null {
    const local = EDITORIAL_LOCAL_DIAGRAMS.find(local => local.id === asset?.id && local.uri === asset.uri && local.sha256 === asset.sha256);
    return local ? { source: local.source, width: local.width, height: local.height } : null;
}
