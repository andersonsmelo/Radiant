import React from 'react';
import { DiagramView } from '../../../ui/diagrams/DiagramView';
import { DIAGRAMS } from '../../../ui/diagrams/diagramRegistry';

/** O diagrama do conceito. Não é enfeite: o leitor de tela lê a descrição dele. Id fora do registro não desenha nada. */
export function ConceptVisual({ id }: { id: string }) {
    return Object.hasOwn(DIAGRAMS, id) ? <DiagramView id={id} /> : null;
}
