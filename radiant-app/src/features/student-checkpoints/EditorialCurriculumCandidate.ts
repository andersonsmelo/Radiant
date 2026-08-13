import {
    validateLearningActivity,
    type EvidenceKind,
    type LearningActivityV2,
    type LearningInteractionV2,
} from '../../types/learningActivity';

type ApprovalState = 'pending' | 'approved';
type ClaimKind = 'prompt' | 'correct-answer' | 'distractor' | 'feedback';
type ClaimProvenanceKind = 'source-backed' | 'authorial-distractor';

export type EditorialSourceV1 = Readonly<{
    id: string;
    title: string;
    attribution: string;
    url: string;
    license: Readonly<{ label: 'CC BY 4.0'; url: 'https://creativecommons.org/licenses/by/4.0/' }>;
    accessedAt: '2026-08-13';
    /**
     * Fingerprint histórico do corpo HTTPS recuperado. Identifica a captura,
     * mas HTML dinâmico pode mudar entre requisições; não prova sozinho deriva
     * editorial nem aprovação de direitos.
     */
    retrievedMaterialSha256: string;
    adaptationNotice: string;
}>;

export type CheckpointItemCandidateV1 = Readonly<{
    id: string;
    competencyIds: readonly string[];
    prompt: string;
    options: readonly Readonly<{ id: string; label: string }>[];
    correctOptionId: string;
    feedback: Readonly<{ correct: string; incorrect: string }>;
    sourceIds: readonly string[];
}>;

export type ClaimProvenanceV1 = Readonly<{
    claimId: string;
    claimKind: ClaimKind;
    provenanceKind: ClaimProvenanceKind;
    sourceIds: readonly string[];
}>;

export type EditorialCurriculumCandidateV1 = Readonly<{
    schemaVersion: 1;
    promotionState: 'human-gates-pending';
    trackId: string;
    unitId: string;
    contentVersion: string;
    competencyIds: readonly string[];
    sources: readonly EditorialSourceV1[];
    activities: readonly LearningActivityV2[];
    checkpoint: Readonly<{ id: string; targetScoreBasisPoints: 8000; items: readonly CheckpointItemCandidateV1[] }>;
    reinforcement: Readonly<{ cycles: readonly [{ cycle: 1; mode: 'guided-recovery' }, { cycle: 2; mode: 'different-context-retry' }] }>;
    approvals: Readonly<Record<'technical' | 'editorial' | 'accessibility' | 'rights' | 'schema' | 'product', ApprovalState>>;
    claimProvenance: readonly ClaimProvenanceV1[];
}>;

const LICENSE = { label: 'CC BY 4.0', url: 'https://creativecommons.org/licenses/by/4.0/' } as const;
const VERSION = 'h4-materia-energia-e-radiacao-candidate-2026-08-13';
const COMPETENCIES = [
    'competency:materia-energia-e-radiacao:estrutura-atomica-e-ionizacao',
    'competency:materia-energia-e-radiacao:ionizante-e-nao-ionizante',
    'competency:materia-energia-e-radiacao:frequencia-comprimento-e-energia',
    'competency:materia-energia-e-radiacao:raios-x-no-espectro',
    'competency:materia-energia-e-radiacao:atenuacao-como-ponte',
] as const;

const sources: readonly EditorialSourceV1[] = [
    { id: 'source:h4:s1', title: '1.1: Historical Development of Atomic Theory', attribution: 'Kai Landskron / Chemistry LibreTexts / Lehigh University', url: 'https://chem.libretexts.org/Bookshelves/Inorganic_Chemistry/Inorganic_Coordination_Chemistry_%28Landskron%29/01%3A_Atomic_Structure/1.01%3A_Historical_Development_of_Atomic_Theory', license: LICENSE, accessedAt: '2026-08-13', retrievedMaterialSha256: '692eb52f9934a34f9701c8517e2356be7f78bb84c9effcfd9625561f1cf51e52', adaptationNotice: 'Tradução/adaptação original em português; sem copiar mídia, tabelas ou diagramas.' },
    { id: 'source:h4:s2', title: 'Glossary — Chemistry 2e (OpenStax)', attribution: 'OpenStax via Chemistry LibreTexts', url: 'https://chem.libretexts.org/Bookshelves/General_Chemistry/Chemistry_2e_%28OpenStax%29/zz%3A_Back_Matter/20%3A_Glossary', license: LICENSE, accessedAt: '2026-08-13', retrievedMaterialSha256: '5aeda0c0b6a9e70d31baae98739c9b1f03b6ef95accdd23cdd23871df763944e', adaptationNotice: 'Tradução/adaptação original em português; sem copiar mídia, tabelas ou diagramas.' },
    { id: 'source:h4:s3', title: '11.3: The Wave Aspect of Light — Interference', attribution: 'OpenStax via Physics LibreTexts / Georgia State University', url: 'https://phys.libretexts.org/Courses/Georgia_State_University/GSU-TM-Introductory_Physics_II_%281112%29/11%3A_Physical_Optics/11.03%3A_The_Wave_Aspect_of_Light-_Interference', license: LICENSE, accessedAt: '2026-08-13', retrievedMaterialSha256: 'f83d9766bc297ebc607f1ddf96fc99d02c0ca18045e03ae16bf95b7e520cc1a2', adaptationNotice: 'Tradução/adaptação original em português; sem copiar mídia, tabelas ou diagramas.' },
    { id: 'source:h4:s4', title: '30.3: The Photoelectric Effect', attribution: 'Andrew Morrison / CARLI / Physics LibreTexts', url: 'https://phys.libretexts.org/Courses/Joliet_Junior_College/JJC_-_PHYS_110/College_Physics_for_Health_Professions/30%3A_Introduction_to_Quantum_Physics/30.03%3A_The_Photoelectric_Effect', license: LICENSE, accessedAt: '2026-08-13', retrievedMaterialSha256: '0bc4b4fbf2f786c2326414874289a72df488f3b086b0de0a32f8a44738e4fea9', adaptationNotice: 'Tradução/adaptação original em português; sem copiar mídia, tabelas ou diagramas.' },
    { id: 'source:h4:s5', title: '24.4: The Electromagnetic Spectrum', attribution: 'Andrew Morrison / CARLI / Physics LibreTexts', url: 'https://phys.libretexts.org/Courses/Joliet_Junior_College/JJC_-_PHYS_110/College_Physics_for_Health_Professions/24%3A_Electromagnetic_Waves/24.04%3A_The_Electromagnetic_Spectrum', license: LICENSE, accessedAt: '2026-08-13', retrievedMaterialSha256: '8da9698ec668edc7ab803fd1c4155915dafadae05a474943cffd652418e8c692', adaptationNotice: 'Tradução/adaptação original em português; sem copiar mídia, tabelas ou diagramas.' },
    { id: 'source:h4:s6', title: '6.1: X-ray Tube and Process', attribution: 'J. S. Ballard / Linn-Benton Community College / Medicine LibreTexts', url: 'https://med.libretexts.org/Bookshelves/Allied_Health/Radiation_Safety_%28Ballard%29/06%3A_X-ray/6.01%3A_X-ray_Tube_and_Process', license: LICENSE, accessedAt: '2026-08-13', retrievedMaterialSha256: 'ca8b9e62ee24c2f1b766c04bff09cee35d2b709cb9de4249b3e5865a75edeccf', adaptationNotice: 'Tradução/adaptação original em português; sem copiar mídia, tabelas ou diagramas.' },
    { id: 'source:h4:s7', title: '6.4: Glossary', attribution: 'J. S. Ballard / Linn-Benton Community College / Medicine LibreTexts', url: 'https://med.libretexts.org/Bookshelves/Allied_Health/Radiation_Safety_%28Ballard%29/06%3A_X-ray/6.04%3A_Glossary', license: LICENSE, accessedAt: '2026-08-13', retrievedMaterialSha256: '191a81978c1f55a2d6f4fa5e28316e81f3a46207ae89144379f10f59a1ab308a', adaptationNotice: 'Tradução/adaptação original em português; sem copiar mídia, tabelas ou diagramas.' },
    { id: 'source:h4:s8', title: '12.12: Dual energy X-ray absorptiometry (14.11)', attribution: 'Rosalind S. Gibson / University of Otago / Medicine LibreTexts', url: 'https://med.libretexts.org/Bookshelves/Nutrition/Principles_of_Nutritional_Assessment_3e_%28Gibson_et_al.%29/12%3A_Body_Composition-_Laboratory_Methods_%28Chapter_14%29/12.12%3A_Dual_energy_Xray_absorptiometry_%2814.11%29', license: LICENSE, accessedAt: '2026-08-13', retrievedMaterialSha256: '7fbb379cf18ffa743e14694a5ec725938e701689c9a296d2f04de89a38f41b75', adaptationNotice: 'Tradução/adaptação original em português; sem copiar mídia, tabelas ou diagramas.' },
];

type ActivityInput = Readonly<{ id: string; competencyId: string; evidenceKind: EvidenceKind; title: string; concept: string; prompt: string; options: readonly string[]; correct: number; feedback: readonly [string, string]; sourceIds: readonly string[] }>;
function activity(input: ActivityInput): LearningActivityV2 {
    const options = input.options.map((label, index) => ({ id: `${input.id}:option:${index + 1}`, label }));
    const interaction: LearningInteractionV2 = { id: `${input.id}:interaction`, type: 'multiple-choice', competencyIds: [input.competencyId], evidenceKind: input.evidenceKind, completionRule: 'answered', criticalSafety: false, feedback: { correct: input.feedback[0], incorrect: input.feedback[1] }, accessibility: { label: input.prompt, hint: 'Escolha uma alternativa; o feedback explica o conceito.' }, payload: { prompt: input.prompt, options, correctOptionId: options[input.correct].id } };
    return { id: input.id, competencyIds: [input.competencyId], provenance: { contentVersion: VERSION, sourceIds: [...input.sourceIds] }, steps: [
        { kind: 'presentation', id: `${input.id}:hook`, role: 'hook', payload: { title: input.title, body: input.concept } },
        { kind: 'interaction', interaction },
        { kind: 'presentation', id: `${input.id}:closing`, role: 'closing', payload: { title: 'Síntese', body: input.feedback[0] } },
    ] };
}

const activities: readonly LearningActivityV2[] = [
    activity({ id: 'activity:materia-energia-e-radiacao:01', competencyId: COMPETENCIES[0], evidenceKind: 'guided-practice', title: 'Estrutura e carga', concept: 'Um átomo neutro tem balanço entre cargas positivas e negativas; elétrons ocupam uma região eletrônica, não órbitas planetárias literais.', prompt: 'Qual partícula contribui com carga negativa?', options: ['Próton', 'Elétron', 'Nêutron', 'Núcleo inteiro'], correct: 1, feedback: ['Correto. Elétrons têm carga negativa.', 'Compare as cargas: prótons são positivos e nêutrons não têm carga líquida.'], sourceIds: ['source:h4:s1', 'source:h4:s7'] }),
    activity({ id: 'activity:materia-energia-e-radiacao:02', competencyId: COMPETENCIES[0], evidenceKind: 'independent-recall', title: 'Ionização', concept: 'Ionização requer energia para alterar a estrutura eletrônica; não descreve o núcleo como instável ou partido.', prompt: 'O que forma um íon positivo neste modelo?', options: ['Remover um elétron', 'Remover um próton', 'Adicionar um nêutron', 'Partir o núcleo'], correct: 0, feedback: ['Correto. Retirar carga negativa deixa excesso relativo positivo.', 'Ionização pode remover elétron sem mudar o núcleo.'], sourceIds: ['source:h4:s1', 'source:h4:s2'] }),
    activity({ id: 'activity:materia-energia-e-radiacao:03', competencyId: COMPETENCIES[0], evidenceKind: 'guided-practice', title: 'Balanço após interação', concept: 'Uma interação que remove elétron altera o balanço de cargas; o conceito é eletrônico e não um modelo planetário.', prompt: 'Após retirar uma carga negativa de um átomo neutro, o resultado fica:', options: ['Relativamente positivo', 'Relativamente negativo', 'Necessariamente sem carga', 'Com núcleo quebrado'], correct: 0, feedback: ['Correto. A carga positiva do núcleo permanece.', 'Siga o balanço de cargas, sem inferir alteração nuclear.'], sourceIds: ['source:h4:s1', 'source:h4:s2'] }),
    activity({ id: 'activity:materia-energia-e-radiacao:04', competencyId: COMPETENCIES[1], evidenceKind: 'guided-practice', title: 'Critério de ionização', concept: 'Classificar como ionizante depende de a interação ter energia suficiente para produzir ionização.', prompt: 'Qual critério classifica uma radiação como ionizante?', options: ['Ser visível', 'Ser produzida por aparelho', 'Produzir ionização', 'Ter muitos fótons'], correct: 2, feedback: ['Correto. O critério é a capacidade de ionizar.', 'Visibilidade, a natureza natural ou artificial da fonte e quantidade não substituem o critério de ionização.'], sourceIds: ['source:h4:s2', 'source:h4:s4'] }),
    activity({ id: 'activity:materia-energia-e-radiacao:05', competencyId: COMPETENCIES[1], evidenceKind: 'independent-recall', title: 'Energia por fóton', concept: 'Quantidade de fótons não é sinônimo de energia individual; para fótons, a energia se relaciona à frequência.', prompt: 'Aumentar somente o número de fótons torna cada fóton mais energético?', options: ['Sempre', 'Não — a quantidade de fótons não altera a energia de cada fóton.', 'Somente se forem raios X', 'Nunca há energia em fóton'], correct: 1, feedback: ['Correto. Energia individual e quantidade são grandezas diferentes.', 'Use a relação entre frequência e energia por fóton, não a contagem isolada.'], sourceIds: ['source:h4:s2', 'source:h4:s4'] }),
    activity({ id: 'activity:materia-energia-e-radiacao:06', competencyId: COMPETENCIES[2], evidenceKind: 'guided-practice', title: 'Frequência e onda', concept: 'No vácuo, frequência e comprimento de onda variam inversamente.', prompt: 'Se a frequência aumenta no vácuo, o comprimento de onda:', options: ['Aumenta', 'Diminui', 'Não muda', 'Deixa de existir'], correct: 1, feedback: ['Correto. c = fλ relaciona as duas grandezas.', 'Com c constante, maior frequência pede menor comprimento de onda.'], sourceIds: ['source:h4:s3'] }),
    activity({ id: 'activity:materia-energia-e-radiacao:07', competencyId: COMPETENCIES[2], evidenceKind: 'independent-recall', title: 'Frequência e energia', concept: 'A energia de um fóton cresce com sua frequência.', prompt: 'Qual fóton tem maior energia?', options: ['O de maior frequência', 'O de maior comprimento de onda', 'Ambos sempre igual', 'Não há relação'], correct: 0, feedback: ['Correto. E = hf torna a relação direta.', 'A energia por fóton acompanha a frequência.'], sourceIds: ['source:h4:s4'] }),
    activity({ id: 'activity:materia-energia-e-radiacao:08', competencyId: COMPETENCIES[2], evidenceKind: 'guided-practice', title: 'Duas relações', concept: 'Frequência maior significa comprimento menor e energia maior; não é necessário calcular valores.', prompt: 'Um fóton com comprimento de onda menor tem:', options: ['Menor frequência e menor energia', 'Maior frequência e maior energia', 'Mesma frequência', 'Energia ausente'], correct: 1, feedback: ['Correto. As duas relações apontam na mesma direção.', 'Menor comprimento implica maior frequência; maior frequência implica maior energia.'], sourceIds: ['source:h4:s3', 'source:h4:s4'] }),
    activity({ id: 'activity:materia-energia-e-radiacao:09', competencyId: COMPETENCIES[3], evidenceKind: 'guided-practice', title: 'Região do espectro', concept: 'Raios X são radiação eletromagnética de alta frequência. Os intervalos de raios X e gama podem se sobrepor; a denominação também depende da origem.', prompt: 'Qual sequência simplificada cresce em frequência sem usar a fronteira sobreposta entre raios X e gama?', options: ['Raios X, rádio, visível', 'Gama, raios X, rádio', 'Visível, rádio, raios X', 'Rádio, visível, ultravioleta, raios X'], correct: 3, feedback: ['Correto. Raios X ficam na região alta do espectro.', 'Localize primeiro rádio em baixa frequência e raios X após ultravioleta; não use raios gama para uma fronteira única.'], sourceIds: ['source:h4:s5'] }),
    activity({ id: 'activity:materia-energia-e-radiacao:10', competencyId: COMPETENCIES[3], evidenceKind: 'independent-recall', title: 'Natureza dos raios X', concept: 'Um raio X é fóton de radiação eletromagnética; não é o elétron que pode participar de sua produção.', prompt: 'Qual descrição corresponde a um raio X?', options: ['Próton nuclear', 'Elétron livre', 'Fóton eletromagnético ionizante', 'Onda sonora'], correct: 2, feedback: ['Correto. Raios X são fótons eletromagnéticos.', 'Não confunda a partícula carregada do processo com a radiação produzida.'], sourceIds: ['source:h4:s5', 'source:h4:s6'] }),
    activity({ id: 'activity:materia-energia-e-radiacao:11', competencyId: COMPETENCIES[4], evidenceKind: 'guided-practice', title: 'Atenuação e transmissão', concept: 'Absorção e espalhamento podem reduzir os fótons que seguem na direção original.', prompt: 'O que pode ocorrer com o feixe que continua no trajeto original?', options: ['Pode diminuir', 'Deve aumentar', 'Não pode mudar', 'Deixa de ser eletromagnético'], correct: 0, feedback: ['Correto. Interações podem reduzir a transmissão na direção considerada.', 'Um fóton espalhado pode existir, mas não permanecer no feixe original.'], sourceIds: ['source:h4:s6', 'source:h4:s7'] }),
    activity({ id: 'activity:materia-energia-e-radiacao:12', competencyId: COMPETENCIES[4], evidenceKind: 'applied-transfer', title: 'Ponte até o detector', concept: 'Trajetos com transmissões diferentes podem entregar quantidades diferentes de fótons ao detector; essa diferença contribui conceitualmente para o contraste, sem prescrever técnica.', prompt: 'Se dois trajetos transmitem quantidades diferentes ao detector, qual ideia é correta?', options: ['O sinal recebido pode diferir', 'O detector recebe obrigatoriamente o mesmo sinal', 'Isso escolhe técnica de exposição', 'Não há relação com contraste'], correct: 0, feedback: ['Correto. Transmissão diferencial cria diferença de sinal que contribui para contraste.', 'A ponte é conceitual: interação, transmissão diferencial, sinal e contraste; não é decisão clínica.'], sourceIds: ['source:h4:s6', 'source:h4:s7', 'source:h4:s8'] }),
];

function checkpointItem(id: string, competencyId: string, prompt: string, options: readonly string[], correct: number, sourceIds: readonly string[]): CheckpointItemCandidateV1 {
    const mapped = options.map((label, index) => ({ id: `${id}:option:${index + 1}`, label }));
    return { id, competencyIds: [competencyId], prompt, options: mapped, correctOptionId: mapped[correct].id, feedback: { correct: 'Correto. A resposta aplica a relação conceitual da competência.', incorrect: 'Revise a relação conceitual e compare cada alternativa com a fonte indicada.' }, sourceIds };
}
const checkpointItems = [
    checkpointItem('checkpoint:materia-energia-e-radiacao:01', COMPETENCIES[0], 'Uma estrutura neutra perde um elétron. Como fica sua carga relativa?', ['Mais negativa', 'Igual por definição', 'Mais positiva', 'Com núcleo destruído'], 2, ['source:h4:s1', 'source:h4:s2']),
    checkpointItem('checkpoint:materia-energia-e-radiacao:02', COMPETENCIES[0], 'Qual descrição relaciona ionização e estrutura corretamente?', ['Parte sempre o núcleo', 'Exige energia e altera a estrutura eletrônica sem declarar ruptura nuclear', 'Remove próton sem energia', 'Não altera carga'], 1, ['source:h4:s2']),
    checkpointItem('checkpoint:materia-energia-e-radiacao:03', COMPETENCIES[1], 'Qual situação é ionizante?', ['Qualquer luz visível', 'Qualquer fonte artificial', 'Interação capaz de remover elétron', 'Muitos fótons sem energia suficiente'], 2, ['source:h4:s2', 'source:h4:s4']),
    checkpointItem('checkpoint:materia-energia-e-radiacao:04', COMPETENCIES[1], 'Qual afirmação separa intensidade de energia individual?', ['São sempre a mesma grandeza', 'Aumentar a quantidade de fótons não altera a energia de cada fóton', 'Fótons não têm energia', 'Só vale para som'], 1, ['source:h4:s4']),
    checkpointItem('checkpoint:materia-energia-e-radiacao:05', COMPETENCIES[2], 'No vácuo, maior frequência corresponde a:', ['Maior comprimento e menor energia', 'Mesmos valores', 'Ausência de fóton', 'Menor comprimento e maior energia'], 3, ['source:h4:s3', 'source:h4:s4']),
    checkpointItem('checkpoint:materia-energia-e-radiacao:06', COMPETENCIES[2], 'Entre dois fótons, o de menor comprimento de onda tem:', ['Menor frequência', 'Maior frequência', 'Sempre mesma energia', 'Nenhuma relação'], 1, ['source:h4:s3']),
    checkpointItem('checkpoint:materia-energia-e-radiacao:07', COMPETENCIES[3], 'Qual afirmação é adequada sobre raios X e raios gama?', ['São definidos exclusivamente pela frequência', 'Podem se sobrepor em frequência; na mesma frequência, a distinção está no processo de produção', 'Raios X sempre têm frequência maior que raios gama', 'Raios gama são partículas carregadas'], 1, ['source:h4:s5']),
    checkpointItem('checkpoint:materia-energia-e-radiacao:08', COMPETENCIES[3], 'Qual diferença é correta?', ['São a mesma partícula', 'Raios X são som', 'Elétron é carregado; raio X é fóton eletromagnético', 'Fóton tem carga negativa'], 2, ['source:h4:s5', 'source:h4:s6']),
    checkpointItem('checkpoint:materia-energia-e-radiacao:09', COMPETENCIES[4], 'O trajeto A transmite mais fótons ao detector que B. Qual é a conclusão?', ['As interações foram idênticas', 'B ganhou frequência obrigatoriamente', 'Não há comparação', 'B teve maior redução do feixe original'], 3, ['source:h4:s6', 'source:h4:s7', 'source:h4:s8']),
    checkpointItem('checkpoint:materia-energia-e-radiacao:10', COMPETENCIES[4], 'Qual ponte conceitual é válida?', ['Interações podem mudar transmissão, sinal no detector e contraste', 'Atenuação escolhe técnica clínica', 'Espalhamento aumenta sempre o feixe original', 'Detector não recebe fótons transmitidos'], 0, ['source:h4:s6', 'source:h4:s7', 'source:h4:s8']),
] as const;

function claimsForActivity(value: LearningActivityV2): ClaimProvenanceV1[] {
    const interaction = value.steps.find((step) => step.kind === 'interaction');
    if (!interaction || interaction.kind !== 'interaction' || interaction.interaction.type !== 'multiple-choice') return [];
    const multipleChoice = interaction.interaction as Extract<LearningInteractionV2, { type: 'multiple-choice' }>;
    const sourceIds = value.provenance.sourceIds;
    return [
        { claimId: `${value.id}:prompt`, claimKind: 'prompt', provenanceKind: 'source-backed', sourceIds },
        ...multipleChoice.payload.options.map((option) => option.id === multipleChoice.payload.correctOptionId
            ? { claimId: option.id, claimKind: 'correct-answer' as const, provenanceKind: 'source-backed' as const, sourceIds }
            : { claimId: option.id, claimKind: 'distractor' as const, provenanceKind: 'authorial-distractor' as const, sourceIds: [] }),
        { claimId: `${value.id}:feedback:correct`, claimKind: 'feedback', provenanceKind: 'source-backed', sourceIds },
        { claimId: `${value.id}:feedback:incorrect`, claimKind: 'feedback', provenanceKind: 'source-backed', sourceIds },
    ];
}
function claimsForCheckpoint(value: CheckpointItemCandidateV1): ClaimProvenanceV1[] {
    return [{ claimId: `${value.id}:prompt`, claimKind: 'prompt', provenanceKind: 'source-backed', sourceIds: value.sourceIds }, ...value.options.map((option) => option.id === value.correctOptionId
        ? { claimId: option.id, claimKind: 'correct-answer' as const, provenanceKind: 'source-backed' as const, sourceIds: value.sourceIds }
        : { claimId: option.id, claimKind: 'distractor' as const, provenanceKind: 'authorial-distractor' as const, sourceIds: [] }), { claimId: `${value.id}:feedback:correct`, claimKind: 'feedback', provenanceKind: 'source-backed', sourceIds: value.sourceIds }, { claimId: `${value.id}:feedback:incorrect`, claimKind: 'feedback', provenanceKind: 'source-backed', sourceIds: value.sourceIds }];
}

export const MATERIA_ENERGIA_E_RADIACAO_CANDIDATE: EditorialCurriculumCandidateV1 = {
    schemaVersion: 1, promotionState: 'human-gates-pending', trackId: 'track:fundamentos-e-seguranca-radiologica', unitId: 'unit:materia-energia-e-radiacao', contentVersion: VERSION, competencyIds: COMPETENCIES, sources, activities,
    checkpoint: { id: 'checkpoint:materia-energia-e-radiacao', targetScoreBasisPoints: 8000, items: checkpointItems },
    reinforcement: { cycles: [{ cycle: 1, mode: 'guided-recovery' }, { cycle: 2, mode: 'different-context-retry' }] },
    approvals: { technical: 'pending', editorial: 'pending', accessibility: 'pending', rights: 'pending', schema: 'pending', product: 'pending' },
    claimProvenance: [...activities.flatMap(claimsForActivity), ...checkpointItems.flatMap(claimsForCheckpoint)],
};

export function validateEditorialCurriculumCandidate(candidate: EditorialCurriculumCandidateV1): string[] {
    const issues: string[] = [];
    const sourceIds = new Set(candidate.sources.map((source) => source.id));
    if (candidate.schemaVersion !== 1 || candidate.promotionState !== 'human-gates-pending') issues.push('candidate-must-remain-unpromotable');
    if (Object.values(candidate.approvals).some((approval) => approval !== 'pending')) issues.push('human-approval-must-remain-pending');
    if (candidate.sources.length !== 8 || candidate.sources.some((source) =>
        !/^https:/.test(source.url)
        || !/^[a-f0-9]{64}$/.test(source.retrievedMaterialSha256)
        || source.license.label !== LICENSE.label
        || source.license.url !== LICENSE.url
    )) issues.push('invalid-source-metadata');
    if (candidate.activities.length !== 12) issues.push('expected-twelve-activities');
    candidate.activities.forEach((value) => {
        if (validateLearningActivity(value).length > 0) issues.push(`invalid-activity:${value.id}`);
        const interaction = value.steps.find((step) => step.kind === 'interaction');
        if (!interaction || interaction.kind !== 'interaction' || interaction.interaction.criticalSafety || interaction.interaction.competencyIds.length !== 1 || value.provenance.sourceIds.some((id) => !sourceIds.has(id))) issues.push(`invalid-activity-contract:${value.id}`);
    });
    if (candidate.checkpoint.targetScoreBasisPoints !== 8000 || candidate.checkpoint.items.length !== 10) issues.push('invalid-checkpoint-shape');
    const correctPositions = new Set(candidate.checkpoint.items.map((item) => item.options.findIndex((option) => option.id === item.correctOptionId)));
    if (correctPositions.size !== 4) issues.push('checkpoint-answer-position-bias');
    COMPETENCIES.forEach((competencyId) => { if (candidate.checkpoint.items.filter((item) => item.competencyIds.includes(competencyId)).length !== 2) issues.push(`checkpoint-coverage:${competencyId}`); });
    const requiredClaims = [...candidate.activities.flatMap(claimsForActivity), ...candidate.checkpoint.items.flatMap(claimsForCheckpoint)];
    const suppliedClaims = new Map(candidate.claimProvenance.map((claim) => [claim.claimId, claim]));
    requiredClaims.forEach((claim) => {
        const supplied = suppliedClaims.get(claim.claimId);
        const distractor = claim.claimKind === 'distractor';
        if (!supplied || supplied.claimKind !== claim.claimKind || supplied.provenanceKind !== claim.provenanceKind || (distractor ? supplied.sourceIds.length !== 0 : supplied.sourceIds.length === 0) || supplied.sourceIds.some((id) => !sourceIds.has(id))) issues.push(`missing-claim-provenance:${claim.claimId}`);
    });
    return [...new Set(issues)];
}
