import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { sessions } from '@/db/schema';
import { getRandomQuestions } from '@/lib/question-generator';

export async function POST(request: NextRequest) {
  try {
    const { subject, weakAreas } = await request.json();
    
    if (!subject) {
      return NextResponse.json(
        { success: false, error: 'Subject is required' },
        { status: 400 }
      );
    }

    // Generate 25 random questions for the selected subject
    const questions = await getRandomQuestions(subject, 25);
    
    if (questions.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No questions available for this subject' },
        { status: 400 }
      );
    }

    // Create a new session to track this question paper
    const [session] = await db
      .insert(sessions)
      .values({
        selectedQuestions: questions,
        subject,
        weakAreas
      })
      .returning();

    return NextResponse.json({
      success: true,
      data: {
        sessionId: session.id,
        questions: questions.map(q => ({
          id: q.id,
          questionText: q.questionText,
          questionType: q.questionType,
          options: q.options
        })) // Don't send correct answers to client
      }
    });

  } catch (error) {
    console.error('Generate questions error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate questions. Please try again.' },
      { status: 500 }
    );
  }
}