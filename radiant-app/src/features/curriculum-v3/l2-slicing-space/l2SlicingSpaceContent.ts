import type { L2AnswerOption, L2Challenge, L2SlicingSpaceLesson } from './l2SlicingSpace.types';

const option = (id: string, label: string, textDescription: string): L2AnswerOption => ({ id, label, textDescription });
const pair = (first: L2AnswerOption, second: L2AnswerOption): readonly L2AnswerOption[] => [first, second];
const item = (entry: L2Challenge): L2Challenge => entry;

const median = option('median', 'Opção 1', 'Uma placa vertical central que percorre o meio do corpo.');
const paramedian = option('sagittal-not-median', 'Opção 2', 'Uma placa vertical paralela, deslocada para um lado.');
const coronal = option('coronal', 'Opção 1', 'Uma placa vertical que separa uma porção da frente e outra das costas.');
const transverse = option('transverse', 'Opção 2', 'Uma placa horizontal que separa uma porção superior e outra inferior.');
const oblique = option('oblique', 'Opção 1', 'Uma placa inclinada em relação às placas de referência mostradas.');
const referencePlane = option('reference-plane', 'Opção 2', 'Uma placa alinhada a uma única orientação de referência.');
const regionWithThickness = option('region-with-nominal-thickness', 'Opção 1', 'Um volume delimitado em torno de uma placa, mostrado por duas faces e uma distância entre elas.');
const resultingImage = option('resulting-image', 'Opção 2', 'Um quadro plano que representa os dados depois da obtenção.');

export const L2_SLICING_SPACE: L2SlicingSpaceLesson = {
  id: 'lesson:v3:arc:spatial-orientation:l2-slicing-space',
  title: 'Cortando o espaço',
  audienceLabel: 'Prática de orientação espacial para o trabalho diário em radiologia',
  version: '1.0.0-draft',
  sources: [
    {
      id: 'fipat-ta2-part-1',
      title: 'Terminologia Anatomica, 2nd edition',
      authority: 'FIPAT / IFAA',
      edition: 'Terminologia Anatomica, 2nd edition (2019)',
      sections: ['Part 1, Chapter 1: 46 Plana referentiae; 48 Plana coronalia; 49 Plana sagittalia; 50 Planum medianum; 51 Planum paramedianum; 52 Plana transversa'],
      url: 'https://libraries.dal.ca/Fipat/ta2.html',
      consultedOn: '2026-08-28',
      use: 'Vocabulário anatômico normalizado; a redação em português é editorial, original e sujeita a revisão especializada.',
    },
    {
      id: 'ifaa-fipat-status',
      title: 'The IFAA Terminologies',
      authority: 'IFAA / FIPAT',
      edition: 'consulta web 2026-08-28',
      sections: ['Current Status — Terminologia Anatomica'],
      url: 'https://ifaa.net/committees/anatomical-terminology-fipat/fipat-ifaa-terminologies/',
      consultedOn: '2026-08-28',
      use: 'Proveniência da Terminologia Anatomica usada na lição.',
    },
    {
      id: 'dicom-ps3-3-slice-thickness',
      title: 'DICOM PS3.3 — Image Plane Module',
      authority: 'NEMA / DICOM Standards Committee',
      edition: 'PS3.3 2026c',
      sections: ['C.7.6.2 Image Plane Module — Slice Thickness (0018,0050)'],
      url: 'https://dicom.nema.org/medical/dicom/2026c/output/chtml/part03/sect_C.7.6.2.html',
      consultedOn: '2026-08-28',
      use: 'Sustenta somente o uso de espessura nominal quando o atributo é declarado; a L2 não generaliza aquisição ou reconstrução entre modalidades.',
    },
    {
      id: 'apple-hig-accessibility',
      title: 'Human Interface Guidelines — Accessibility',
      authority: 'Apple',
      edition: 'consulta web 2026-08-28',
      sections: ['Mobility: Offer alternatives to gestures', 'Vision: VoiceOver', 'Motion: Reduce Motion'],
      url: 'https://developer.apple.com/design/human-interface-guidelines/accessibility/',
      consultedOn: '2026-08-28',
      use: 'Controles equivalentes, rótulos para tecnologias assistivas e redução de movimento.',
    },
  ],
  objectives: [
    { id: 'l2-reference-planes', statement: 'Distinguir planos coronais, sagitais e transversais como referências geométricas.', misconception: 'E-PLN-SEC' },
    { id: 'l2-median-is-sagittal', statement: 'Reconhecer o plano mediano como caso específico entre planos sagitais.', misconception: 'E-PLN-MED' },
    { id: 'l2-obliquity', statement: 'Reconhecer um plano oblíquo pela inclinação em relação aos planos de referência.', misconception: 'E-PLN-OBL' },
    { id: 'l2-spatial-region-thickness-image', statement: 'Separar plano geométrico, região espacial, espessura nominal e imagem resultante.', misconception: 'E-PLN-SEC' },
  ],
  modelLayers: [
    { id: 'geometric-plane', label: 'Plano geométrico', explanation: 'Referência sem espessura usada para situar uma orientação.' },
    { id: 'sampled-region', label: 'Região espacial', explanation: 'Parte delimitada do corpo da qual os dados são obtidos.' },
    { id: 'nominal-thickness', label: 'Espessura nominal', explanation: 'Distância representada ao redor de uma referência, quando declarada.' },
    { id: 'resulting-image', label: 'Imagem resultante', explanation: 'Representação dos dados da região; não é o próprio plano geométrico.' },
  ],
  challenges: [
    item({
      id: 'l2-initial-median', objectiveId: 'l2-median-is-sagittal',
      prompt: 'No tórax, qual placa passa exatamente pela linha mediana e divide o corpo em metades direita e esquerda?',
      accessiblePrompt: 'No modelo do tórax há duas placas verticais. Escolha a opção que corresponde à condição descrita; os dados de posição são informados nas alternativas.',
      answerOptions: pair(median, paramedian), correctAnswerId: 'median', evidenceKind: 'initial_independent', awardsXp: false, misconception: 'E-PLN-MED',
      feedback: { correct: 'Certo. O plano mediano é sagital e coincide com a linha mediana.', incorrect: 'Um plano sagital pode ser paralelo à linha mediana sem coincidir com ela. Só o que passa pela linha mediana é mediano.' },
      remediationChallengeId: 'l2-assisted-sagittal', nextChallengeId: 'l2-independent-reference-plane', nextActionLabel: 'Continuar para referências', additionalRecoveryChallengeId: 'l2-median-recovery', reviewTargetId: 'review:l2:mediano-em-regiao-nova', visualScenarioId: 'thorax-midline', requiredPlane: 'median', requiredRegion: 'thorax', requiredThickness: 'thin',
    }),
    item({
      id: 'l2-assisted-sagittal', objectiveId: 'l2-median-is-sagittal',
      prompt: 'Com apoio: compare as placas. Qual é sagital, mas não é mediana?',
      accessiblePrompt: 'Compare uma placa central com outra paralela deslocada. Escolha a alternativa que atende à condição descrita.',
      answerOptions: pair(median, paramedian), correctAnswerId: 'sagittal-not-median', evidenceKind: 'assisted_practice', awardsXp: false, misconception: 'E-PLN-MED',
      feedback: { correct: 'Isso. A placa deslocada continua sagital; ela não é o caso mediano.', incorrect: 'Use a linha mediana como critério: paralelismo não basta para tornar um plano mediano.' },
      remediationChallengeId: 'l2-assisted-sagittal', nextChallengeId: 'l2-median-recovery', nextActionLabel: 'Tentar outro cenário sem apoio', reviewTargetId: 'review:l2:mediano-em-regiao-nova', visualScenarioId: 'thorax-paramedian', requiredPlane: 'sagittal', requiredRegion: 'thorax', requiredThickness: 'thin',
    }),
    item({
      id: 'l2-median-recovery', objectiveId: 'l2-median-is-sagittal',
      prompt: 'Agora na pelve, dois marcadores estão à mesma distância da linha central. Qual placa preserva essa simetria ao dividir o corpo?',
      accessiblePrompt: 'No modelo pélvico há marcadores equidistantes da linha central e duas placas verticais. Escolha a alternativa que atende à condição descrita, em novo cenário.',
      answerOptions: pair(paramedian, median), correctAnswerId: 'median', evidenceKind: 'later_independent_retrieval', awardsXp: true, misconception: 'E-PLN-MED',
      feedback: { correct: 'Recuperação nova correta: a placa mediana preserva a simetria por coincidir com a linha mediana.', incorrect: 'Os marcadores simétricos exigem que a placa coincida com a linha mediana; paralelismo não basta.' },
      remediationChallengeId: 'l2-assisted-sagittal', nextChallengeId: 'l2-independent-reference-plane', nextActionLabel: 'Continuar para referências', reviewTargetId: 'review:l2:mediano-em-regiao-nova', visualScenarioId: 'pelvis-symmetry', requiredPlane: 'median', requiredRegion: 'pelvis', requiredThickness: 'thin',
    }),
    item({
      id: 'l2-independent-reference-plane', objectiveId: 'l2-reference-planes',
      prompt: 'Qual placa separa uma porção superior e outra inferior do abdome?',
      accessiblePrompt: 'No modelo abdominal há duas placas. Escolha a alternativa que atende à relação espacial descrita.',
      answerOptions: pair(coronal, transverse), correctAnswerId: 'transverse', evidenceKind: 'initial_independent', awardsXp: false, misconception: 'E-PLN-SEC',
      feedback: { correct: 'Certo. A placa transversal organiza uma porção superior e outra inferior.', incorrect: 'Compare o que cada placa separa: frente e costas descrevem outra orientação; superior e inferior descrevem a transversal.' },
      remediationChallengeId: 'l2-assisted-reference-plane', nextChallengeId: 'l2-independent-oblique', nextActionLabel: 'Continuar para inclinação', additionalRecoveryChallengeId: 'l2-reference-plane-recovery', reviewTargetId: 'review:l2:coronal-transversal-em-regiao-nova', visualScenarioId: 'abdomen-transverse', requiredPlane: 'transverse', requiredRegion: 'abdomen', requiredThickness: 'thin',
    }),
    item({
      id: 'l2-assisted-reference-plane', objectiveId: 'l2-reference-planes',
      prompt: 'Com apoio: a placa horizontal organiza superior e inferior. Qual alternativa descreve essa placa?',
      accessiblePrompt: 'Compare as placas vertical e horizontal. Escolha a alternativa que corresponde à relação espacial explicada.',
      answerOptions: pair(coronal, transverse), correctAnswerId: 'transverse', evidenceKind: 'assisted_practice', awardsXp: false, misconception: 'E-PLN-SEC',
      feedback: { correct: 'Isso. A placa transversal separa uma porção superior de outra inferior.', incorrect: 'A orientação se define pelo que a placa separa; compare superior/inferior com frente/costas.' },
      remediationChallengeId: 'l2-assisted-reference-plane', nextChallengeId: 'l2-reference-plane-recovery', nextActionLabel: 'Tentar outra região sem apoio', reviewTargetId: 'review:l2:coronal-transversal-em-regiao-nova', visualScenarioId: 'abdomen-transverse-assisted', requiredPlane: 'transverse', requiredRegion: 'abdomen', requiredThickness: 'thin',
    }),
    item({
      id: 'l2-reference-plane-recovery', objectiveId: 'l2-reference-planes',
      prompt: 'Na pelve, qual placa separa uma porção anterior de outra posterior?',
      accessiblePrompt: 'No novo cenário pélvico, escolha a alternativa que atende à relação espacial descrita.',
      answerOptions: pair(transverse, coronal), correctAnswerId: 'coronal', evidenceKind: 'later_independent_retrieval', awardsXp: true, misconception: 'E-PLN-SEC',
      feedback: { correct: 'Recuperação nova correta: a placa coronal separa frente e costas também em outra região.', incorrect: 'A mudança de região não altera o critério; compare as porções anterior/posterior e superior/inferior.' },
      remediationChallengeId: 'l2-assisted-reference-plane', nextChallengeId: 'l2-independent-oblique', nextActionLabel: 'Continuar para inclinação', reviewTargetId: 'review:l2:coronal-transversal-em-regiao-nova', visualScenarioId: 'pelvis-coronal-recovery', requiredPlane: 'coronal', requiredRegion: 'pelvis', requiredThickness: 'thin',
    }),
    item({
      id: 'l2-independent-oblique', objectiveId: 'l2-obliquity',
      prompt: 'A placa no abdome está inclinada em relação às referências exibidas. Como ela é classificada?',
      accessiblePrompt: 'O modelo mostra duas opções de placa no abdome e informa suas relações geométricas. Escolha a classificação solicitada.',
      answerOptions: pair(oblique, referencePlane), correctAnswerId: 'oblique', evidenceKind: 'initial_independent', awardsXp: false, misconception: 'E-PLN-OBL',
      feedback: { correct: 'Certo. A obliquidade é reconhecida pela inclinação em relação aos planos de referência.', incorrect: 'A classificação depende da relação geométrica com as referências, não de a região parecer inclinada na tela.' },
      remediationChallengeId: 'l2-assisted-oblique', nextChallengeId: 'l2-independent-section', nextActionLabel: 'Continuar para região e espessura', additionalRecoveryChallengeId: 'l2-oblique-recovery', reviewTargetId: 'review:l2:obliquidade-em-regiao-nova', visualScenarioId: 'abdomen-oblique', requiredPlane: 'oblique', requiredRegion: 'abdomen', requiredThickness: 'nominal',
    }),
    item({
      id: 'l2-assisted-oblique', objectiveId: 'l2-obliquity',
      prompt: 'Com apoio: a placa inclinada não coincide com nenhum dos três planos de referência apresentados. Como ela é classificada?',
      accessiblePrompt: 'Compare uma placa inclinada com uma placa alinhada a uma referência. Escolha a classificação que corresponde à inclinação descrita.',
      answerOptions: pair(referencePlane, oblique), correctAnswerId: 'oblique', evidenceKind: 'assisted_practice', awardsXp: false, misconception: 'E-PLN-OBL',
      feedback: { correct: 'Isso. A inclinação relativa sustenta a classificação de oblíquo.', incorrect: 'Retome a comparação: estar em uma região não define a orientação; a relação com as referências define.' },
      remediationChallengeId: 'l2-assisted-oblique', nextChallengeId: 'l2-oblique-recovery', nextActionLabel: 'Tentar outra região sem apoio', reviewTargetId: 'review:l2:obliquidade-em-regiao-nova', visualScenarioId: 'abdomen-oblique-assisted', requiredPlane: 'oblique', requiredRegion: 'abdomen', requiredThickness: 'nominal',
    }),
    item({
      id: 'l2-oblique-recovery', objectiveId: 'l2-obliquity',
      prompt: 'No tórax, a placa continua inclinada em relação às referências. Qual classificação se mantém?',
      accessiblePrompt: 'Em novo modelo corporal, escolha a classificação indicada pela relação geométrica informada nas alternativas.',
      answerOptions: pair(oblique, coronal), correctAnswerId: 'oblique', evidenceKind: 'later_independent_retrieval', awardsXp: true, misconception: 'E-PLN-OBL',
      feedback: { correct: 'Recuperação nova correta: a obliquidade não depende de uma única região.', incorrect: 'Observe a relação com as referências, não apenas a aparência do tórax no desenho.' },
      remediationChallengeId: 'l2-assisted-oblique', nextChallengeId: 'l2-independent-section', nextActionLabel: 'Continuar para região e espessura', reviewTargetId: 'review:l2:obliquidade-em-regiao-nova', visualScenarioId: 'thorax-oblique-recovery', requiredPlane: 'oblique', requiredRegion: 'thorax', requiredThickness: 'nominal',
    }),
    item({
      id: 'l2-independent-section', objectiveId: 'l2-spatial-region-thickness-image',
      prompt: 'Qual opção representa dados de uma região espacial com espessura nominal, em vez de confundir a imagem com um plano geométrico?',
      accessiblePrompt: 'O modelo mostra um volume delimitado e um quadro plano. Escolha a alternativa que corresponde à formulação descrita.',
      answerOptions: pair(regionWithThickness, resultingImage), correctAnswerId: 'region-with-nominal-thickness', evidenceKind: 'initial_independent', awardsXp: false, misconception: 'E-PLN-SEC',
      feedback: { correct: 'Certo. A imagem seccional representa dados de uma região espacial, que pode ter espessura nominal.', incorrect: 'O plano geométrico é uma referência; a imagem é uma representação. Para esta formulação, a região espacial e a espessura precisam permanecer distintas da imagem.' },
      remediationChallengeId: 'l2-assisted-section', nextActionLabel: 'Praticar a separação com apoio', additionalRecoveryChallengeId: 'l2-section-recovery', reviewTargetId: 'review:l2:regiao-espessura-imagem', visualScenarioId: 'abdomen-region-thickness', requiredPlane: 'transverse', requiredRegion: 'abdomen', requiredThickness: 'nominal',
    }),
    item({
      id: 'l2-assisted-section', objectiveId: 'l2-spatial-region-thickness-image',
      prompt: 'Com apoio: qual elemento do modelo é a imagem resultante, e não a região espacial mostrada por um volume?',
      accessiblePrompt: 'Compare um volume delimitado e um quadro plano. Escolha o elemento solicitado; a resposta será explicada antes de uma nova tentativa.',
      answerOptions: pair(regionWithThickness, resultingImage), correctAnswerId: 'resulting-image', evidenceKind: 'assisted_practice', awardsXp: false, misconception: 'E-PLN-SEC',
      feedback: { correct: 'Isso. O quadro representa a imagem resultante; ele não substitui a ideia de região espacial.', incorrect: 'Retome as camadas: plano, região, espessura e imagem têm papéis diferentes.' },
      remediationChallengeId: 'l2-assisted-section', nextChallengeId: 'l2-section-recovery', nextActionLabel: 'Tentar outro cenário sem apoio', reviewTargetId: 'review:l2:regiao-espessura-imagem', visualScenarioId: 'abdomen-image-assisted', requiredPlane: 'transverse', requiredRegion: 'abdomen', requiredThickness: 'nominal',
    }),
    item({
      id: 'l2-section-recovery', objectiveId: 'l2-spatial-region-thickness-image',
      prompt: 'Na pelve, a região é representada por um volume fino ao redor da referência. Que informação adicional esse volume comunica?',
      accessiblePrompt: 'No novo cenário pélvico, compare um volume fino a um quadro plano. Escolha a opção que responde à pergunta sobre a informação adicional.',
      answerOptions: pair(regionWithThickness, resultingImage), correctAnswerId: 'region-with-nominal-thickness', evidenceKind: 'later_independent_retrieval', awardsXp: true, misconception: 'E-PLN-SEC',
      feedback: { correct: 'Recuperação nova correta: o volume comunica região espacial e espessura nominal sem transformar a imagem em plano.', incorrect: 'Procure a distância entre as faces do volume. Ela acrescenta espessura à região representada.' },
      remediationChallengeId: 'l2-assisted-section', reviewTargetId: 'review:l2:regiao-espessura-imagem', visualScenarioId: 'pelvis-region-thickness-recovery', requiredPlane: 'transverse', requiredRegion: 'pelvis', requiredThickness: 'thin',
    }),
  ],
  sequence: ['l2-initial-median', 'l2-independent-oblique', 'l2-independent-section'],
  synthesis: [
    'Planos coronais, sagitais e transversais são referências geométricas; o mediano é um caso particular de sagital.',
    'Oblíquo descreve a inclinação em relação aos planos de referência.',
    'Plano, região espacial, espessura nominal e imagem resultante têm funções diferentes no modelo.',
  ],
  reviewPlan: [
    'Agendar recuperação nova após dois outros nós para mediano, obliquidade e região/espessura/imagem.',
    'Reaplicar após cinco a oito nós com região, plano e modalidade diferentes, sem usar ajuda como prova de domínio.',
  ],
};
