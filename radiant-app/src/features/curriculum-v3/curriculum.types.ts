/** Curriculum identity describes learning meaning, independently of storage schema. */
export type CurriculumId = 'curriculum:legacy' | 'curriculum:v3';

export type CurriculumArcId =
  | 'arc:foundations'
  | 'arc:radiography'
  | 'arc:mammography'
  | 'arc:computed-tomography'
  | 'arc:magnetic-resonance'
  | 'arc:nuclear-medicine'
  | 'arc:radiotherapy'
  | 'arc:other-specializations';

export type CurriculumArc = Readonly<{
  id: CurriculumArcId;
  title: string;
  pillars?: readonly ('anatomy' | 'physiology' | 'physics')[];
}>;
