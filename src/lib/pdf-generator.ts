"use client";

import jsPDF from 'jspdf';

export function generateQuestionPaperPDF(
  subject: string,
  questions: any[],
  userAnswers: Record<string, string>,
  results: any
) {
  const pdf = new jsPDF();
  
  // Title
  pdf.setFontSize(20);
  pdf.text(`${subject} - Question Paper Results`, 20, 30);
  
  // Score summary
  pdf.setFontSize(14);
  pdf.text(`Score: ${results.score}% (${results.correctAnswers}/${results.totalQuestions})`, 20, 50);
  
  let yPosition = 70;
  
  questions.forEach((question, index) => {
    // Check if we need a new page
    if (yPosition > 250) {
      pdf.addPage();
      yPosition = 30;
    }
    
    // Question number and text
    pdf.setFontSize(12);
    pdf.text(`Q${index + 1}: ${question.questionText}`, 20, yPosition);
    yPosition += 10;
    
    // Options for MCQ
    if (question.questionType === 'MCQ' && question.options) {
      question.options.forEach((option: string, optIndex: number) => {
        const letter = String.fromCharCode(65 + optIndex); // A, B, C, D
        pdf.text(`${letter}) ${option}`, 30, yPosition);
        yPosition += 8;
      });
    }
    
    // User answer
    const userAnswer = userAnswers[question.id] || 'No answer';
    pdf.text(`Your Answer: ${userAnswer}`, 30, yPosition);
    yPosition += 8;
    
    // Correct answer and result
    const result = results.results.find((r: any) => r.questionId === question.id);
    const status = result?.isCorrect ? '✓ Correct' : '✗ Incorrect';
    pdf.text(`${status} - Correct Answer: ${question.correctAnswer}`, 30, yPosition);
    yPosition += 8;
    
    // Explanation
    const explanation = question.explanation;
    if (explanation) {
      pdf.text(`Explanation: ${explanation}`, 30, yPosition);
      yPosition += 10;
    }
    
    yPosition += 5; // Space between questions
  });
  
  // Download the PDF
  pdf.save(`${subject}_Question_Paper_Results.pdf`);
}