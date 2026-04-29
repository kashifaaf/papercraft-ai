import { pgTable, text, integer, timestamp, uuid, jsonb, decimal } from 'drizzle-orm/pg-core';

export const questions = pgTable('questions', {
  id: uuid('id').defaultRandom().primaryKey(),
  subject: text('subject').notNull(),
  questionText: text('question_text').notNull(),
  questionType: text('question_type').notNull(), // 'MCQ' or 'short'
  options: jsonb('options'), // for MCQ questions
  correctAnswer: text('correct_answer').notNull(),
  explanation: text('explanation').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const sessions = pgTable('sessions', {
  id: uuid('id').defaultRandom().primaryKey(),
  selectedQuestions: jsonb('selected_questions').notNull(),
  userAnswers: jsonb('user_answers'),
  score: decimal('score'),
  subject: text('subject').notNull(),
  weakAreas: jsonb('weak_areas'), // extracted from mark sheet
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export type Question = typeof questions.$inferSelect;
export type Session = typeof sessions.$inferSelect;