import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { sessions } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { calculateScore } from '@/lib/question-generator';

export async function POST(request: NextRequest) {
  try {
    const { sessionId, userAnswers } = await request.json();
    
    if (!sessionId || !userAnswers) {
      return NextResponse.json(
        { success: false, error: 'Session ID and answers are required' },
        { status: 400 }
      );
    }

    // Get the session with questions
    const [session] = await db
      .select()
      .from(sessions)
      .where(eq(sessions.id, sessionId));

    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Session not found' },
        { status: 404 }
      );
    }

    const questions = session.selectedQuestions as any[];
    
    // Calculate score and results
    const results = calculateScore(questions, userAnswers);
    
    // Update session with answers and score
    await db
      .update(sessions)
      .set({
        userAnswers,
        score: results.score.toString()
      })
      .where(eq(sessions.id, sessionId));

    return NextResponse.json({
      success: true,
      data: {
        ...results,
        questions // Include full questions with explanations for results display
      }
    });

  } catch (error) {
    console.error('Submit answers error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to submit answers. Please try again.' },
      { status: 500 }
    );
  }
}