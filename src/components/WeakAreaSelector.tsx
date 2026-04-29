"use client";

import { useState } from 'react';
import { WeakArea } from '@/lib/types';
import { QuestionPaper } from './QuestionPaper';

interface WeakAreaSelectorProps {
  weakAreas: WeakArea[];
}

export function WeakAreaSelector({ weakAreas }: WeakAreaSelectorProps) {
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [showQuestionPaper, setShowQuestionPaper] = useState(false);

  const handleSubjectSelect = (subject: string) => {
    setSelectedSubject(subject);
    setShowQuestionPaper(true);
  };

  if (showQuestionPaper && selectedSubject) {
    return <QuestionPaper subject={selectedSubject} weakAreas={weakAreas} />;
  }

  if (weakAreas.length === 0) {
    return (
      <div className="card">
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Excellent Performance!</h2>
          <p className="text-gray-600">
            Great job! All your subjects are scoring above 60%. Keep up the good work!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Weak Areas</h2>
      <p className="text-gray-600 mb-6">
        Based on your mark sheet analysis, these subjects need improvement. Select one to generate a practice question paper.
      </p>

      <div className="space-y-4">
        {weakAreas.map((area, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors"
          >
            <div>
              <h3 className="font-semibold text-gray-900">{area.subject}</h3>
              <p className="text-sm text-gray-500">
                Current score: {area.percentage}%
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <span className="text-red-600 font-semibold text-sm">
                    {Math.round(area.percentage)}%
                  </span>
                </div>
              </div>
              <button
                onClick={() => handleSubjectSelect(area.subject)}
                className="btn-primary"
                aria-label={`Generate practice questions for ${area.subject}`}
              >
                Generate Questions
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start">
          <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <div>
            <h4 className="font-medium text-blue-900">How it works</h4>
            <p className="text-blue-700 text-sm">
              Each question paper contains 25 carefully selected questions targeting your weak areas. 
              You'll get immediate feedback and detailed explanations to help you learn.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}