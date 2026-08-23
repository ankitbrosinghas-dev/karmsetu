export type Role = 'LEARNER' | 'MANAGER' | 'ADMIN';

export interface User {
  id: string;
  name: string;
  role: Role;
  department: string;
  designation: string;
}

export interface Competency {
  id: string;
  name: string;
  category: string;
  mastery: number; // 0-100
  prerequisites: string[]; // array of competency ids
  status: 'Critical Gap' | 'Needs Attention' | 'Developing' | 'Strong';
}

export interface TrainingModule {
  id: string;
  title: string;
  duration: string;
  difficulty: string;
  competencyId: string;
}

export interface Question {
  id: string;
  competencyId: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

// Initial Demo Data
export const DEMO_USER: User = {
  id: 'u1',
  name: 'Aarav Sharma',
  role: 'LEARNER',
  department: 'Statistical Operations',
  designation: 'Statistical Officer',
};

export const DEMO_COMPETENCIES: Record<string, Competency> = {
  'c_data_collection': { id: 'c_data_collection', name: 'Data Collection', category: 'Operations', mastery: 82, prerequisites: [], status: 'Strong' },
  'c_data_validation': { id: 'c_data_validation', name: 'Data Validation', category: 'Operations', mastery: 67, prerequisites: ['c_data_collection'], status: 'Developing' },
  'c_basic_stats': { id: 'c_basic_stats', name: 'Basic Statistics', category: 'Analytics', mastery: 85, prerequisites: [], status: 'Strong' },
  'c_probability': { id: 'c_probability', name: 'Probability Fundamentals', category: 'Analytics', mastery: 38, prerequisites: ['c_basic_stats'], status: 'Critical Gap' },
  'c_sampling_fundamentals': { id: 'c_sampling_fundamentals', name: 'Sampling Fundamentals', category: 'Methodology', mastery: 52, prerequisites: ['c_basic_stats'], status: 'Needs Attention' },
  'c_sampling_methods': { id: 'c_sampling_methods', name: 'Sampling Methods', category: 'Methodology', mastery: 44, prerequisites: ['c_probability', 'c_sampling_fundamentals'], status: 'Needs Attention' },
  'c_survey_design': { id: 'c_survey_design', name: 'Survey Design', category: 'Methodology', mastery: 0, prerequisites: ['c_sampling_methods'], status: 'Critical Gap' }, // Not started
  'c_analysis': { id: 'c_analysis', name: 'Statistical Analysis', category: 'Analytics', mastery: 73, prerequisites: ['c_basic_stats'], status: 'Developing' },
};

export const DEMO_MODULES: TrainingModule[] = [
  { id: 'm_prob', title: 'Probability Fundamentals for Official Statistics', duration: '45 min', difficulty: 'Beginner', competencyId: 'c_probability' },
  { id: 'm_samp_fund', title: 'Introduction to Sampling', duration: '30 min', difficulty: 'Beginner', competencyId: 'c_sampling_fundamentals' },
  { id: 'm_samp_meth', title: 'Advanced Sampling Methods', duration: '60 min', difficulty: 'Intermediate', competencyId: 'c_sampling_methods' },
];

export const DEMO_QUESTIONS: Question[] = [
  // Probability
  { id: 'q1', competencyId: 'c_probability', difficulty: 'Beginner', question: 'If a coin is tossed, what is the probability of getting a head?', options: ['0.25', '0.50', '0.75', '1.0'], correctAnswer: 1, explanation: 'A fair coin has 2 sides, so the probability of one specific side is 1/2 or 0.50.' },
  { id: 'q2', competencyId: 'c_probability', difficulty: 'Beginner', question: 'What is the sum of all probabilities in a probability distribution?', options: ['0', '0.5', '1', '100'], correctAnswer: 2, explanation: 'The sum of all mutually exclusive exhaustive events is always 1.' },
  { id: 'q3', competencyId: 'c_probability', difficulty: 'Intermediate', question: 'Two independent events A and B have probabilities 0.4 and 0.5. What is P(A and B)?', options: ['0.9', '0.1', '0.2', '0.45'], correctAnswer: 2, explanation: 'For independent events, P(A and B) = P(A) * P(B) = 0.4 * 0.5 = 0.2.' },
  
  // Sampling Methods (Need a bunch for the 20-q practice demo, but we will reuse or generate mock ones on the fly for length, let's provide a few core ones)
  { id: 'q4', competencyId: 'c_sampling_methods', difficulty: 'Beginner', question: 'Which sampling method gives every member of the population an equal chance of being selected?', options: ['Quota Sampling', 'Convenience Sampling', 'Simple Random Sampling', 'Snowball Sampling'], correctAnswer: 2, explanation: 'Simple Random Sampling ensures every individual has an equal, non-zero probability of selection.' },
  { id: 'q5', competencyId: 'c_sampling_methods', difficulty: 'Intermediate', question: 'Dividing a population into distinct subgroups and then sampling from each is called:', options: ['Cluster Sampling', 'Stratified Sampling', 'Systematic Sampling', 'Multi-stage Sampling'], correctAnswer: 1, explanation: 'Stratified sampling involves dividing the population into homogeneous strata and sampling from each.' },
  { id: 'q6', competencyId: 'c_sampling_methods', difficulty: 'Advanced', question: 'In cluster sampling, what is the primary source of sampling error?', options: ['Within-cluster variance', 'Between-cluster variance', 'Measurement error', 'Non-response bias'], correctAnswer: 1, explanation: 'In cluster sampling, the variance between different clusters is the main driver of standard error, especially if clusters are internally homogeneous.' },
];

// Helper to calculate status based on mastery
export function calculateStatus(mastery: number): Competency['status'] {
  if (mastery >= 75) return 'Strong';
  if (mastery >= 60) return 'Developing';
  if (mastery >= 40) return 'Needs Attention';
  return 'Critical Gap';
}
