import type { QuizLesson } from '../types/quiz';

export const LESSON_CATALOG_VERSION = 'v1-local-seed';

export const LESSONS: QuizLesson[] = [
  {
    id: 'lesson-1',
    title: 'Fundamentos de Radiologia',
    difficulty: 'beginner',
    journey: {
      intro: {
        questionIndex: 0,
        contextBody:
          'Você vai começar pelo papel dos raios-X e pelo raciocínio básico de contraste e radiopacidade.',
        teachBody:
          'Radiologia diagnóstica existe para tornar estruturas internas visíveis de modo comparável, útil e clinicamente interpretável.',
        reinforceBody:
          'O valor do exame está em distinguir estruturas internas com contraste suficiente para guiar decisão clínica.',
      },
      review: {
        questionIndex: 1,
        contextBody: 'Retome rapidamente o conceito central antes de seguir adiante.',
        reinforceBody:
          'Quando a densidade sobe, a estrutura tende a absorver mais raios-X e aparecer mais radiopaca.',
      },
    },
    questions: [
      {
        id: 'q1',
        type: 'multiple-choice',
        prompt: 'Qual é a principal função dos raios-X na radiologia diagnóstica?',
        options: [
          { label: 'Tratamento de tumores' },
          { label: 'Visualização de estruturas internas' },
          { label: 'Esterilização de equipamentos' },
          { label: 'Aquecimento de tecidos' },
        ],
        correctAnswerIndex: 1,
        explanation:
          'Os raios-X são usados principalmente para criar imagens de estruturas internas do corpo, permitindo o diagnóstico de diversas condições médicas.',
      },
      {
        id: 'q2',
        type: 'multiple-choice',
        prompt: 'Qual estrutura é mais radiopaca em uma radiografia?',
        options: [
          { label: 'Ar' },
          { label: 'Gordura' },
          { label: 'Osso' },
          { label: 'Músculo' },
        ],
        correctAnswerIndex: 2,
        explanation:
          'O osso é a estrutura mais radiopaca devido à sua alta densidade e conteúdo de cálcio, que absorve mais raios-X.',
      },
      {
        id: 'q3',
        type: 'multiple-choice',
        prompt: 'O que significa o termo "contraste" em radiologia?',
        options: [
          { label: 'Brilho da imagem' },
          { label: 'Diferença de densidade entre estruturas' },
          { label: 'Tamanho da imagem' },
          { label: 'Velocidade do exame' },
        ],
        correctAnswerIndex: 1,
        explanation:
          'Contraste refere-se à diferença de densidade entre diferentes estruturas, permitindo distingui-las na imagem radiográfica.',
      },
    ],
  },
  {
    id: 'lesson-2',
    title: 'Princípios de Tomografia Computadorizada',
    difficulty: 'beginner',
    journey: {
      intro: {
        questionIndex: 2,
        contextBody:
          'Agora você entra no raciocínio seccional da tomografia e nas diferenças entre voxel, atenuação e sobreposição.',
        teachBody:
          'A tomografia reduz a sobreposição anatômica ao gerar cortes, o que muda a clareza com que enxergamos estruturas internas.',
        reinforceBody:
          'Cada corte melhora a leitura anatômica ao reduzir a mistura de estruturas no mesmo plano de imagem.',
      },
      review: {
        questionIndex: 0,
        contextBody: 'Faça uma verificação rápida do conceito mais importante desta etapa.',
        reinforceBody:
          'Voxel é a unidade volumétrica que sustenta a leitura seccional da tomografia.',
      },
    },
    questions: [
      {
        id: 'ct-q1',
        type: 'multiple-choice',
        prompt: 'Na tomografia computadorizada, o que representa um voxel?',
        options: [
          { label: 'Um pixel bidimensional apenas da tela' },
          { label: 'Uma unidade volumétrica de imagem' },
          { label: 'Um marcador de contraste intravenoso' },
          { label: 'Uma medida de radiação absorvida' },
        ],
        correctAnswerIndex: 1,
        explanation:
          'Voxel é a menor unidade volumétrica da imagem tomográfica, equivalente tridimensional do pixel.',
      },
      {
        id: 'ct-q2',
        type: 'multiple-choice',
        prompt: 'Qual estrutura costuma apresentar atenuação mais baixa na TC sem contraste?',
        options: [
          { label: 'Osso cortical' },
          { label: 'Ar' },
          { label: 'Sangue' },
          { label: 'Parênquima hepático' },
        ],
        correctAnswerIndex: 1,
        explanation:
          'O ar apresenta atenuação muito baixa na tomografia e, por isso, aparece com densidade bastante escura.',
      },
      {
        id: 'ct-q3',
        type: 'multiple-choice',
        prompt: 'A principal vantagem da TC em relação à radiografia simples é:',
        options: [
          { label: 'Menor custo operacional em todos os cenários' },
          { label: 'Ausência total de radiação ionizante' },
          { label: 'Aquisição seccional com menos sobreposição anatômica' },
          { label: 'Substituir completamente a ultrassonografia' },
        ],
        correctAnswerIndex: 2,
        explanation:
          'A TC produz cortes seccionais, reduzindo a sobreposição anatômica e melhorando a avaliação de estruturas internas.',
      },
    ],
  },
];
