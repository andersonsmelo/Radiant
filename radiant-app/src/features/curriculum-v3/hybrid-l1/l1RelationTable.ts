import type { L1Misconception } from '../l1-body-reference/l1BodyReference.types';
import type { RelationId } from './hybridItem.types';

export type RelationTerm = Readonly<{ id: string; landmarkId: string; question: string; claim: string }>;

export type RelationEntry = Readonly<{
  relation: RelationId;
  objectiveId: string;
  misconception: L1Misconception;
  optionLabel: 'Marcador' | 'Superfície';
  optionNoun: 'marcador' | 'superfície';
  optionArticle: 'a' | 'o';
  terms: readonly [RelationTerm, RelationTerm];
  feedback: Readonly<{ correct: string; incorrect: string }>;
  hint: string;
}>;

/**
 * A verdade técnica da L1 em forma de tabela. **O dono revisa este arquivo**
 * (spec §5.3): cada par diz qual landmark responde a qual pergunta. O gabarito
 * dos itens sai daqui, nunca do texto.
 */
export const L1_RELATION_TABLE: readonly RelationEntry[] = [
  {
    relation: 'superior-inferior', objectiveId: 'O-L1-superior-inferior', misconception: 'E-REL',
    optionLabel: 'Marcador', optionNoun: 'marcador', optionArticle: 'o',
    terms: [
      { id: 'superior', landmarkId: 'head-marker', question: 'qual marcador está mais próximo da cabeça?', claim: 'está mais próximo da cabeça' },
      { id: 'inferior', landmarkId: 'foot-marker', question: 'qual marcador está mais próximo dos pés?', claim: 'está mais próximo dos pés' },
    ],
    feedback: { correct: 'Superior descreve proximidade da cabeça, não a parte mais alta da tela.', incorrect: 'Use a referência cabeça–pés do corpo, não a altura do quadro.' },
    hint: 'Superior é perto da cabeça, não o alto da tela.',
  },
  {
    relation: 'medial-lateral', objectiveId: 'O-L1-medial-lateral', misconception: 'E-REL',
    optionLabel: 'Marcador', optionNoun: 'marcador', optionArticle: 'o',
    terms: [
      { id: 'medial', landmarkId: 'midline-marker', question: 'qual marcador está mais próximo da linha mediana?', claim: 'está mais próximo da linha mediana' },
      { id: 'lateral', landmarkId: 'outer-arm-marker', question: 'qual marcador está mais afastado da linha mediana?', claim: 'está mais afastado da linha mediana' },
    ],
    feedback: { correct: 'Medial é a relação com a linha mediana.', incorrect: 'Compare cada marcador com a linha mediana, não com a borda da tela.' },
    hint: 'Medial é perto da linha mediana, não da borda.',
  },
  {
    relation: 'proximal-distal', objectiveId: 'O-L1-proximal-distal', misconception: 'E-REL',
    optionLabel: 'Marcador', optionNoun: 'marcador', optionArticle: 'o',
    terms: [
      { id: 'proximal', landmarkId: 'shoulder-marker', question: 'qual marcador está mais perto da ligação do braço com o tronco?', claim: 'está mais perto da ligação do braço com o tronco' },
      { id: 'distal', landmarkId: 'wrist-marker', question: 'qual marcador está mais longe da ligação do braço com o tronco?', claim: 'está mais longe da ligação do braço com o tronco' },
    ],
    feedback: { correct: 'Proximal se aproxima da ligação do membro.', incorrect: 'Use a ligação com o tronco como referência do membro.' },
    hint: 'Proximal é perto da ligação com o tronco.',
  },
  {
    relation: 'superficial-deep', objectiveId: 'O-L1-superficial-deep', misconception: 'E-REL',
    optionLabel: 'Marcador', optionNoun: 'marcador', optionArticle: 'o',
    terms: [
      { id: 'superficial', landmarkId: 'outer-layer', question: 'qual marcador está na camada mais perto da superfície do corpo?', claim: 'está na camada mais perto da superfície do corpo' },
      { id: 'deep', landmarkId: 'inner-layer', question: 'qual marcador está na camada mais profunda?', claim: 'está na camada mais profunda' },
    ],
    feedback: { correct: 'Superficial está mais perto da superfície.', incorrect: 'Compare as duas camadas locais, não a altura delas no quadro.' },
    hint: 'Superficial é a camada mais externa.',
  },
  {
    relation: 'anterior-posterior', objectiveId: 'O-L1-referencia-sob-mudanca-de-postura', misconception: 'E-GRV',
    optionLabel: 'Superfície', optionNoun: 'superfície', optionArticle: 'a',
    terms: [
      { id: 'anterior', landmarkId: 'anterior-thorax', question: 'qual superfície do tórax é a anterior?', claim: 'é a anterior' },
      { id: 'posterior', landmarkId: 'posterior-thorax', question: 'qual superfície do tórax é a posterior?', claim: 'é a posterior' },
    ],
    feedback: { correct: 'Anterior continua sendo a frente do corpo; a referência anatômica não vira cima ou baixo quando a pessoa deita.', incorrect: 'Não use a gravidade como referência. Anterior e posterior permanecem definidos pelo corpo, mesmo em outra postura.' },
    hint: 'Anterior é a frente do corpo, mesmo deitado.',
  },
];

export const LATERALITY_ENTRY = {
  objectiveId: 'O-L1-lateralidade-corpo-observador',
  misconception: 'E-LAT-OBS',
  feedback: { correct: 'Você tomou o corpo examinado como referência, não o seu lado da tela.', incorrect: 'O lado direito ou esquerdo pertence ao corpo descrito. Troque a perspectiva do observador pela referência anatômica.' },
  hint: 'Você usou o seu lado, não o da pessoa.',
} as const;

/** Descrições acessíveis aprovadas no parecer v4. Não altere sem nova revisão. */
export const LANDMARK_DESCRIPTIONS: Readonly<Record<string, string>> = {
  'head-marker': 'Marcador junto à extremidade da cabeça.',
  'foot-marker': 'Marcador junto à extremidade dos pés.',
  'midline-marker': 'Marcador junto à linha tracejada central.',
  'outer-arm-marker': 'Marcador junto ao contorno externo do braço.',
  'shoulder-marker': 'Marcador junto à ligação do braço com o tronco.',
  'wrist-marker': 'Marcador junto ao punho.',
  'outer-layer': 'Marcador no contorno sólido mais externo.',
  'inner-layer': 'Marcador na camada tracejada interna.',
  'anterior-thorax': 'Painel com contorno contínuo.',
  'posterior-thorax': 'Painel com traço pontilhado.',
};

export function relationEntry(relation: RelationId): RelationEntry {
  const entry = L1_RELATION_TABLE.find((candidate) => candidate.relation === relation);
  if (!entry) throw new Error(`UNKNOWN_RELATION:${relation}`);
  return entry;
}
