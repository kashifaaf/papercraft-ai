import { db } from '@/db';
import { questions } from '@/db/schema';
import { eq, sql } from 'drizzle-orm';
import { QuestionData } from './types';

export async function getRandomQuestions(subject: string, count: number = 25): Promise<QuestionData[]> {
  try {
    const result = await db
      .select()
      .from(questions)
      .where(eq(questions.subject, subject))
      .orderBy(sql`RANDOM()`)
      .limit(count);

    return result.map(q => ({
      id: q.id,
      subject: q.subject,
      questionText: q.questionText,
      questionType: q.questionType as 'MCQ' | 'short',
      options: q.options as string[] | undefined,
      correctAnswer: q.correctAnswer,
      explanation: q.explanation
    }));
  } catch (error) {
    console.error('Error fetching questions:', error);
    throw new Error('Failed to generate questions');
  }
}

export function calculateScore(questions: QuestionData[], userAnswers: Record<string, string>): {
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  results: Array<{
    questionId: string;
    isCorrect: boolean;
    userAnswer: string;
    correctAnswer: string;
    explanation: string;
  }>;
} {
  let correctAnswers = 0;
  const results = [];

  for (const question of questions) {
    const userAnswer = userAnswers[question.id] || '';
    const isCorrect = userAnswer.toLowerCase().trim() === question.correctAnswer.toLowerCase().trim();
    
    if (isCorrect) {
      correctAnswers++;
    }

    results.push({
      questionId: question.id,
      isCorrect,
      userAnswer,
      correctAnswer: question.correctAnswer,
      explanation: question.explanation
    });
  }

  const score = Math.round((correctAnswers / questions.length) * 100);

  return {
    score,
    totalQuestions: questions.length,
    correctAnswers,
    results
  };
}