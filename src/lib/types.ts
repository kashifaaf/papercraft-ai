export interface ActionResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface MarkSheetData {
  subject: string;
  marks: number;
  maxMarks: number;
  percentage: number;
}

export interface WeakArea {
  subject: string;
  percentage: number;
}

export interface QuestionData {
  id: string;
  subject: string;
  questionText: string;
  questionType: 'MCQ' | 'short';
  options?: string[];
  correctAnswer: string;
  explanation: string;
}

export interface UserAnswer {
  questionId: string;
  answer: string;
  isCorrect: boolean;
}