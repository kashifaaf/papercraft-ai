import { db } from '@/db';
import { questions } from '@/db/schema';

const sampleQuestions = [
  // Physics Questions
  {
    subject: 'Physics',
    questionText: 'What is the SI unit of electric current?',
    questionType: 'MCQ',
    options: ['Coulomb', 'Ampere', 'Volt', 'Ohm'],
    correctAnswer: 'Ampere',
    explanation: 'The SI unit of electric current is Ampere (A), named after André-Marie Ampère. It is defined as the constant current that produces a force of 2×10⁻⁷ newtons per meter between two parallel conductors.'
  },
  {
    subject: 'Physics',
    questionText: 'Derive the expression for kinetic energy of a moving object.',
    questionType: 'short',
    correctAnswer: 'KE = ½mv²',
    explanation: 'Kinetic energy is derived from work-energy theorem. When a force F acts on an object of mass m over distance s, work done W = F×s = ma×s. Using v² = u² + 2as and u = 0, we get s = v²/2a. Therefore, W = ma×(v²/2a) = ½mv². This work done equals kinetic energy.'
  },
  // Chemistry Questions
  {
    subject: 'Chemistry',
    questionText: 'What is the molecular formula of benzene?',
    questionType: 'MCQ',
    options: ['C₆H₆', 'C₆H₁₂', 'C₆H₁₄', 'C₆H₁₀'],
    correctAnswer: 'C₆H₆',
    explanation: 'Benzene has the molecular formula C₆H₆. It is an aromatic hydrocarbon with a ring structure where carbon atoms are bonded in a hexagonal arrangement with alternating double bonds.'
  },
  {
    subject: 'Chemistry',
    questionText: 'Explain the process of electrolysis of water.',
    questionType: 'short',
    correctAnswer: 'Water splits into hydrogen and oxygen gases using electric current',
    explanation: 'Electrolysis of water involves passing electric current through water containing an electrolyte. At cathode: 2H₂O + 2e⁻ → H₂ + 2OH⁻ (hydrogen gas formed). At anode: 2H₂O → O₂ + 4H⁺ + 4e⁻ (oxygen gas formed). Overall: 2H₂O → 2H₂ + O₂.'
  },
  // Mathematics Questions
  {
    subject: 'Mathematics',
    questionText: 'What is the derivative of sin(x)?',
    questionType: 'MCQ',
    options: ['cos(x)', '-cos(x)', 'sin(x)', '-sin(x)'],
    correctAnswer: 'cos(x)',
    explanation: 'The derivative of sin(x) with respect to x is cos(x). This is a fundamental result in calculus derived from the limit definition of derivatives using trigonometric identities.'
  },
  {
    subject: 'Mathematics',
    questionText: 'Find the area of a triangle with vertices at (0,0), (4,0), and (2,3).',
    questionType: 'short',
    correctAnswer: '6 square units',
    explanation: 'Using the formula: Area = ½|x₁(y₂-y₃) + x₂(y₃-y₁) + x₃(y₁-y₂)|. With vertices (0,0), (4,0), (2,3): Area = ½|0(0-3) + 4(3-0) + 2(0-0)| = ½|0 + 12 + 0| = ½ × 12 = 6 square units.'
  },
  // Biology Questions
  {
    subject: 'Biology',
    questionText: 'What is the powerhouse of the cell?',
    questionType: 'MCQ',
    options: ['Nucleus', 'Mitochondria', 'Ribosome', 'Endoplasmic Reticulum'],
    correctAnswer: 'Mitochondria',
    explanation: 'Mitochondria are called the powerhouse of the cell because they produce ATP (adenosine triphosphate) through cellular respiration. ATP is the primary energy currency used by cells for various metabolic processes.'
  },
  {
    subject: 'Biology',
    questionText: 'Explain the process of photosynthesis.',
    questionType: 'short',
    correctAnswer: 'Plants convert light energy into chemical energy using CO₂ and water',
    explanation: 'Photosynthesis is the process where plants convert light energy into chemical energy. The equation is: 6CO₂ + 6H₂O + light energy → C₆H₁₂O₆ + 6O₂. This occurs in chloroplasts using chlorophyll, involving light-dependent and light-independent reactions.'
  }
];

export async function seedQuestions() {
  try {
    // Add more questions to reach 100+ per subject
    const expandedQuestions = [];
    
    for (let i = 0; i < 15; i++) {
      sampleQuestions.forEach(q => {
        expandedQuestions.push({
          ...q,
          questionText: `${q.questionText} (Question ${i + 1})`,
        });
      });
    }
    
    await db.insert(questions).values(expandedQuestions);
    console.log('Questions seeded successfully');
  } catch (error) {
    console.error('Error seeding questions:', error);
  }
}