import type { DiagramSpec } from './diagramTypes';
import { tuboRaiosX } from './specs/tubo-raios-x';
import { colimadorAbrindo } from './specs/colimador-abrindo';

export const DIAGRAMS: Record<string, DiagramSpec> = {
  [tuboRaiosX.id]: tuboRaiosX,
  [colimadorAbrindo.id]: colimadorAbrindo,
};

export const DIAGRAM_IDS: readonly string[] = Object.keys(DIAGRAMS);

const PREFIX = 'diagram:';

/** O valor de `imageRef` de uma figura que é diagrama. */
export function diagramRef(id: string): string {
  return `${PREFIX}${id}`;
}

export function parseDiagramRef(ref: string): string | null {
  return ref.startsWith(PREFIX) && ref.length > PREFIX.length ? ref.slice(PREFIX.length) : null;
}
