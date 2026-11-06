/** Test-only symbols and control exercises. Never imported by application catalogs. */
import type { QuizLesson } from '../../types/quiz';
import type { LessonBlock } from '../../types/lessonFlow';
import type { JourneyTrackDefinition } from '../../types/journey';
import type { LearningActivityV2 } from '../../types/learningActivity';
export const LESSONS: QuizLesson[] = [1, 2].map(n => ({
  id: `lesson-${n}`, title: `Símbolos ${n}`, difficulty: 'beginner',
  questions: [0,1,2].map(i => ({ id: `l${n}-q${i+1}`, type: 'multiple-choice', prompt: `Escolha a forma ${i+1}.`,
    options: [{label:'Círculo'}, {label:'Quadrado'}, {label:'Triângulo'}], correctAnswerIndex:i, explanation:'Compare o contorno.' })),
}));
export const LESSON_CATALOG = { version: 'synthetic.v1', initialLessonId: 'lesson-1',
  tracks: [{ id: 'track-radiology-foundations', slug: 'symbols', title: 'Símbolos', description: 'Somente teste.', lessonIds: LESSONS.map(lesson => lesson.id) }],
  lessons: LESSONS.map((lesson, i) => ({ id: lesson.id, title: lesson.title, slug: lesson.id, difficulty: lesson.difficulty, trackId: 'track-radiology-foundations', order: i + 1 })),
};
export const DEFAULT_LESSON_BLOCKS: LessonBlock[] = LESSONS.map(lesson => ({
  id: `block:${lesson.id}:intro`, lessonId: lesson.id,
  steps: [
    {contract:{id:`${lesson.id}-context`,type:'context',completionRule:'displayed',retryRule:'allow_continue',branching:'none'},step:{type:'context',payload:{title:'Observe',body:'Uma forma abstrata.'}}},
    {contract:{id:`${lesson.id}-question`,type:'multiple-choice',completionRule:'answered',retryRule:'allow_continue',branching:'none'},step:{type:'multiple-choice',payload:{prompt:'Qual forma?',options:[{id:'a',label:'Círculo'},{id:'b',label:'Quadrado'}],correctOptionId:'a',explanation:'Observe o contorno.'}}},
    {contract:{id:`${lesson.id}-advance`,type:'advance',completionRule:'confirmed',retryRule:'allow_continue',branching:'none'},step:{type:'advance',payload:{title:'Concluído'}}},
  ],
}));
export const DEFAULT_JOURNEY_TRACK_DEFINITION: JourneyTrackDefinition = {
 id:'track-radiology-foundations',title:'Símbolos',initialUnitId:'unit:foundations',units:[{id:'unit:foundations',title:'Formas',nodes:[
  {id:'node:lesson-1',unitId:'unit:foundations',type:'lesson',title:'Forma um',lessonId:'lesson-1',blockId:'block:lesson-1:intro'},
  {id:'node:review:lesson-1',unitId:'unit:foundations',type:'review',title:'Revisão um',lessonId:'lesson-1',blockId:'block:review:lesson-1',unlockRule:{requiresNodeIds:['node:lesson-1']}},
  {id:'node:checkpoint:foundations',unitId:'unit:foundations',type:'checkpoint',title:'Verifique',unlockRule:{requiresNodeIds:['node:lesson-1']}},
  {id:'node:lesson-2',unitId:'unit:foundations',type:'lesson',title:'Forma dois',lessonId:'lesson-2',blockId:'block:lesson-2:intro',unlockRule:{requiresNodeIds:['node:checkpoint:foundations']}},
  {id:'node:review:lesson-2',unitId:'unit:foundations',type:'review',title:'Revisão dois',lessonId:'lesson-2',blockId:'block:review:lesson-2',unlockRule:{requiresNodeIds:['node:lesson-2']}},
  {id:'node:reward:foundations',unitId:'unit:foundations',type:'reward',title:'Conquista',unlockRule:{requiresNodeIds:['node:lesson-2']}},
 ]}],
};
const common = {competencyIds:['competency:synthetic:control'],evidenceKind:'guided-practice' as const,completionRule:'answered' as const,criticalSafety:false,accessibility:{label:'Controle de teste'},feedback:{correct:'Alvo atingido.',incorrect:'Ajuste novamente.'}};
const bench = (id:string,mode:'explore'|'challenge',initial:number): LearningActivityV2['steps'][number] => ({kind:'interaction',interaction:{...common,id,type:'bench',payload:{simulator:'exposure',mode,prompt:'Ajuste o controle até 70.',controls:[{id:'kv',label:'Tensão',unit:'kV',min:40,max:120,step:10,initial}],goal:{kind:'match',reference:{kv:70,mas:10},tolerance:0},phantomLabel:'Fantoma sintético',hints:{tooLow:'Aumente o controle.',tooHigh:'Diminua o controle.'}}}});
export const EXPOSICAO: LearningActivityV2 = {id:'bancada:synthetic',theme:'tubo',competencyIds:common.competencyIds,provenance:{contentVersion:'synthetic.v1',sourceIds:['synthetic']},steps:[
 {kind:'presentation',id:'synthetic:intro',role:'hook',payload:{title:'Controle abstrato',body:'Explore o valor.'}},
 bench('synthetic:explore','explore',70),bench('synthetic:challenge','challenge',110),
 {kind:'interaction',interaction:{...common,id:'synthetic:reading',type:'multiple-choice',payload:{prompt:'Qual forma?',options:[{id:'a',label:'Círculo'},{id:'b',label:'Quadrado'}],correctOptionId:'a'}}},
 bench('synthetic:repair','challenge',40),
 {kind:'presentation',id:'synthetic:closing',role:'closing',payload:{title:'Fim da sequência',body:'O controle respondeu.'}},
]};
