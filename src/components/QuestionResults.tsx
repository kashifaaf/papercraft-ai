"use client";

import { useState } from 'react';
import { generateQuestionPaperPDF } from '@/lib/pdf-generator';

interface QuestionResultsProps {
  results: {
    score: number;
    totalQuestions: number;
    correctAnswers: number;
    questions: any[];
    results: Array<{
      questionId: string;
      isCorrect: boolean;
      userAnswer: string;
      correctAnswer: string;
      explanation: string;
    }>;
  };
  subject: string;
}

export function QuestionResults({ results, subject }: QuestionResultsProps) {
  const [showExplanations, setShowExplanations] = useState<Record<string, boolean>>({});
  const [downloadingPDF, setDownloadingPDF] = useState(false);

  const toggleExplanation = (questionId: string) => {
    setShowExplanations(prev => ({
      ...prev,
      [questionId]: !prev[questionId]
    }));
  };

  const handleDownloadPDF = () => {
    try {
      setDownloadingPDF(true);
      
      // Create user answers object for PDF
      const userAnswers: Record<string, string> = {};
      results.results.forEach(result => {
        userAnswers[result.questionId] = result.userAnswer;
      });
      
      generateQuestionPaperPDF(subject, results.questions, userAnswers, results);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setDownloadingPDF(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getScoreMessage = (score: number) => {
    if (score >= 80) return 'Excellent work! You have a strong understanding of this subject.';
    if (score >= 60) return 'Good job! Review the explanations to strengthen your understanding.';
    return 'Keep practicing! Focus on the explanations to improve your understanding.';
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Results Summary */}
      <div className="card">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {subject} - Results
          </h1>
          <div className={`inline-flex items-center px-6 py-3 rounded-full text-2xl font-bold ${getScoreColor(results.score)}`}>
            {results.score}%
          </div>
          <p className="text-lg text-gray-600 mt-4">
            You answered {results.correctAnswers} out of {results.totalQuestions} questions correctly
          </p>
          <p className="text-gray-600 mt-2">
            {getScoreMessage(results.score)}
          </p>
        </div>

        <div className="flex justify-center space-x-4">
          <button
            onClick={handleDownloadPDF}
            disabled={downloadingPDF}
            className="btn-primary disabled:opacity-50 flex items-center"
          >
            {downloadingPDF ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating PDF...
              </>
            ) : (
              <>
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                Download PDF
              </>
            )}
          </button>
          
          <button
            onClick={() => window.location.href = '/'}
            className="btn-secondary"
          >
            Start New Test
          </button>
        </div>
      </div>

      {/* Detailed Results */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">Detailed Review</h2>
        
        {results.questions.map((question, index) => {
          const result = results.results.find(r => r.questionId === question.id);
          if (!result) return null;

          return (
            <div key={question.id} className="card">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-4 flex-shrink-0 mt-1 ${
                    result.isCorrect ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                  }`}>
                    {result.isCorrect ? (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900 mb-3">
                      Q{index + 1}: {question.questionText}
                    </h3>

                    {question.questionType === 'MCQ' && question.options && (
                      <div className="mb-4 space-y-2">
                        {question.options.map((option: string, optionIndex: number) => (
                          <div key={optionIndex} className={`p-2 rounded border ${
                            option === result.correctAnswer 
                              ? 'border-green-500 bg-green-50' 
                              : option === result.userAnswer && !result.isCorrect
                              ? 'border-red-500 bg-red-50'
                              : 'border-gray-200'
                          }`}>
                            {String.fromCharCode(65 + optionIndex)}. {option}
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="space-y-2 text-sm">
                      <div className="flex">
                        <span className="font-medium text-gray-700 w-24">Your answer:</span>
                        <span className={result.isCorrect ? 'text-green-600' : 'text-red-600'}>
                          {result.userAnswer || 'No answer provided'}
                        </span>
                      </div>
                      
                      {!result.isCorrect && (
                        <div className="flex">
                          <span className="font-medium text-gray-700 w-24">Correct answer:</span>
                          <span className="text-green-600">{result.correctAnswer}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <button
                  onClick={() => toggleExplanation(question.id)}
                  className="flex items-center text-primary-600 hover:text-primary-700 font-medium"
                >
                  {showExplanations[question.id] ? (
                    <>
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                      </svg>
                      Hide Explanation
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                      Show Explanation
                    </>
                  )}
                </button>
                
                {showExplanations[question.id] && (
                  <div className="mt-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">Explanation:</h4>
                    <p className="text-blue-800 text-sm leading-relaxed">
                      {result.explanation}
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}