export type Question = {
  id: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};

export type Lesson = {
  id: string;
  order: number;
  title: string;
  estimatedMinutes: number;
  summary: string;
  contentStatus: 'ready' | 'import_pending';
  sections: { heading: string; points: string[] }[];
  questions: Question[];
};

export type Module = {
  id: string;
  order: number;
  level: 'foundation' | 'intermediate' | 'advanced' | 'management';
  title: string;
  description: string;
  passingScore: number;
  lessons: Lesson[];
  finalAssessment: Question[];
};
