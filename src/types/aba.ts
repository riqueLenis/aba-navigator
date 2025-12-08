export interface Therapist {
  id: string;
  name: string;
  email: string;
  phone: string;
  specialty: string;
  createdAt: string;
}

export interface Patient {
  id: string;
  name: string;
  dateOfBirth: string;
  guardianName: string;
  guardianPhone: string;
  therapistId: string;
  diagnosis: string;
  notes: string;
  createdAt: string;
}

export interface Program {
  id: string;
  patientId: string;
  name: string;
  description: string;
  category: ProgramCategory;
  targetBehavior: string;
  currentCriteria: string;
  status: 'active' | 'paused' | 'completed';
  createdAt: string;
}

export type ProgramCategory = 
  | 'communication'
  | 'motor_skills'
  | 'social_skills'
  | 'daily_living'
  | 'play'
  | 'academic';

export interface Session {
  id: string;
  programId: string;
  patientId: string;
  therapistId: string;
  date: string;
  trials: number;
  successes: number;
  notes: string;
  createdAt: string;
}

export interface TherapeuticPlan {
  id: string;
  patientId: string;
  title: string;
  goals: string[];
  startDate: string;
  endDate: string;
  status: 'active' | 'completed' | 'draft';
  createdAt: string;
}

export interface CriteriaEvolution {
  id: string;
  programId: string;
  previousCriteria: string;
  newCriteria: string;
  changedAt: string;
  reason: string;
}