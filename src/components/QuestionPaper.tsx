"use client";

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { WeakArea, ActionResult } from '@/lib/types';
import { QuestionResults } from './QuestionResults';

interface Question {
  id: string;
  questionText: string;
  questionType: 'MCQ' | 'short';
  options?: string[];
}

interface QuestionPaperProps {
  subject: string;
  weakAreas: WeakArea[];
}

export function QuestionPaper({ subject, weakAreas }: QuestionPaperProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [sessionId, setSessionId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string>('');
  const [results, setResults] = useState<any>(null);
  
  const { register, handleSubmit, watch } = useForm();
  const watchedAnswers = watch();

  useEffect(() => {
    generateQuestions();
  }, [subject]);

  const generateQuestions = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/generate-questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subject,
          weakAreas
        }),
      });

      const result = await response.json() as ActionResult<{
        sessionId: string;
        questions: Question[];
      }>;

      if (result.success && result.data) {
        setQuestions(result.data.questions);
        setSessionId(result.data.sessionId);
      } else {
        setError(result.error || 'Failed to generate questions');
      }
    } catch (error) {
      setError('Failed to load questions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: any) => {
    try {
      setSubmitting(true);
      const response = await fetch('/api/submit-answers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
          userAnswers: data
        }),
      });

      const result = await response.json() as ActionResult<any>;

      if (result.success && result.data) {
        setResults(result.data);
      } else {
        setError(result.error || 'Failed to submit answers');
      }
    } catch (error) {
      setError('Failed to submit answers. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (results) {
    return <QuestionResults results={results} subject={subject} />;
  }

  if (loading) {
    return (
      <div className="card">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Generating Questions</h2>
          <p className="text-gray-600">
            Creating a personalized question paper for {subject}...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card">
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Questions</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button onClick={generateQuestions} className="btn-primary">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Calculate completion progress
  const answeredQuestions = Object.keys(watchedAnswers).filter(
    key => watchedAnswers[key] && watchedAnswers[key].toString().trim() !== ''
  ).length;
  const progressPercent = (answeredQuestions / questions.length) * 100;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{subject} - Practice Questions</h1>
            <p className="text-gray-600">Answer all 25 questions to get your results</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500">Progress</div>
            <div className="text-lg font-semibold text-gray-900">
              {answeredQuestions}/{questions.length}
            </div>
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-primary-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
      </div>

      {/* Questions */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {questions.map((question, index) => (
          <div key={question.id} className="card">
            <div className="flex items-start mb-4">
              <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0 mt-1">
                <span className="text-primary-600 font-semibold text-sm">{index + 1}</span>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  {question.questionText}
                </h3>

                {question.questionType === 'MCQ' && question.options ? (
                  <div className="space-y-3">
                    {question.options.map((option, optionIndex) => (
                      <label key={optionIndex} className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          value={option}
                          {...register(question.id, { required: true })}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                        />
                        <span className="ml-3 text-gray-700">
                          {String.fromCharCode(65 + optionIndex)}. {option}
                        </span>
                      </label>
                    ))}
                  </div>
                ) : (
                  <textarea
                    {...register(question.id, { required: true })}
                    rows={4}
                    className="input-field resize-none"
                    placeholder="Write your answer here..."
                  />
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Submit button */}
        <div className="card">
          <div className="text-center">
            <button
              type="submit"
              disabled={submitting || answeredQuestions < questions.length}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed px-8 py-3 text-lg"
            >
              {submitting ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting Answers...
                </span>
              ) : (
                'Submit Answers'
              )}
            </button>
            
            {answeredQuestions < questions.length && (
              <p className="text-sm text-gray-500 mt-2">
                Please answer all questions before submitting ({questions.length - answeredQuestions} remaining)
              </p>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}