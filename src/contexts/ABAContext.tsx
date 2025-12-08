import React, { createContext, useContext, ReactNode } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Therapist, Patient, Program, Session, TherapeuticPlan, CriteriaEvolution } from '@/types/aba';

interface ABAContextType {
  therapists: Therapist[];
  patients: Patient[];
  programs: Program[];
  sessions: Session[];
  therapeuticPlans: TherapeuticPlan[];
  criteriaEvolutions: CriteriaEvolution[];
  addTherapist: (therapist: Omit<Therapist, 'id' | 'createdAt'>) => void;
  updateTherapist: (id: string, therapist: Partial<Therapist>) => void;
  deleteTherapist: (id: string) => void;
  addPatient: (patient: Omit<Patient, 'id' | 'createdAt'>) => void;
  updatePatient: (id: string, patient: Partial<Patient>) => void;
  deletePatient: (id: string) => void;
  addProgram: (program: Omit<Program, 'id' | 'createdAt'>) => void;
  updateProgram: (id: string, program: Partial<Program>) => void;
  deleteProgram: (id: string) => void;
  addSession: (session: Omit<Session, 'id' | 'createdAt'>) => void;
  addTherapeuticPlan: (plan: Omit<TherapeuticPlan, 'id' | 'createdAt'>) => void;
  updateTherapeuticPlan: (id: string, plan: Partial<TherapeuticPlan>) => void;
  deleteTherapeuticPlan: (id: string) => void;
  addCriteriaEvolution: (evolution: Omit<CriteriaEvolution, 'id'>) => void;
  getTherapistById: (id: string) => Therapist | undefined;
  getPatientById: (id: string) => Patient | undefined;
  getProgramsByPatient: (patientId: string) => Program[];
  getSessionsByProgram: (programId: string) => Session[];
}

const ABAContext = createContext<ABAContextType | undefined>(undefined);

export function ABAProvider({ children }: { children: ReactNode }) {
  const [therapists, setTherapists] = useLocalStorage<Therapist[]>('aba-therapists', []);
  const [patients, setPatients] = useLocalStorage<Patient[]>('aba-patients', []);
  const [programs, setPrograms] = useLocalStorage<Program[]>('aba-programs', []);
  const [sessions, setSessions] = useLocalStorage<Session[]>('aba-sessions', []);
  const [therapeuticPlans, setTherapeuticPlans] = useLocalStorage<TherapeuticPlan[]>('aba-therapeutic-plans', []);
  const [criteriaEvolutions, setCriteriaEvolutions] = useLocalStorage<CriteriaEvolution[]>('aba-criteria-evolutions', []);

  const generateId = () => crypto.randomUUID();

  const addTherapist = (therapist: Omit<Therapist, 'id' | 'createdAt'>) => {
    const newTherapist: Therapist = {
      ...therapist,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    setTherapists(prev => [...prev, newTherapist]);
  };

  const updateTherapist = (id: string, therapist: Partial<Therapist>) => {
    setTherapists(prev => prev.map(t => t.id === id ? { ...t, ...therapist } : t));
  };

  const deleteTherapist = (id: string) => {
    setTherapists(prev => prev.filter(t => t.id !== id));
  };

  const addPatient = (patient: Omit<Patient, 'id' | 'createdAt'>) => {
    const newPatient: Patient = {
      ...patient,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    setPatients(prev => [...prev, newPatient]);
  };

  const updatePatient = (id: string, patient: Partial<Patient>) => {
    setPatients(prev => prev.map(p => p.id === id ? { ...p, ...patient } : p));
  };

  const deletePatient = (id: string) => {
    setPatients(prev => prev.filter(p => p.id !== id));
  };

  const addProgram = (program: Omit<Program, 'id' | 'createdAt'>) => {
    const newProgram: Program = {
      ...program,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    setPrograms(prev => [...prev, newProgram]);
  };

  const updateProgram = (id: string, program: Partial<Program>) => {
    setPrograms(prev => prev.map(p => p.id === id ? { ...p, ...program } : p));
  };

  const deleteProgram = (id: string) => {
    setPrograms(prev => prev.filter(p => p.id !== id));
  };

  const addSession = (session: Omit<Session, 'id' | 'createdAt'>) => {
    const newSession: Session = {
      ...session,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    setSessions(prev => [...prev, newSession]);
  };

  const addTherapeuticPlan = (plan: Omit<TherapeuticPlan, 'id' | 'createdAt'>) => {
    const newPlan: TherapeuticPlan = {
      ...plan,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    setTherapeuticPlans(prev => [...prev, newPlan]);
  };

  const updateTherapeuticPlan = (id: string, plan: Partial<TherapeuticPlan>) => {
    setTherapeuticPlans(prev => prev.map(p => p.id === id ? { ...p, ...plan } : p));
  };

  const deleteTherapeuticPlan = (id: string) => {
    setTherapeuticPlans(prev => prev.filter(p => p.id !== id));
  };

  const addCriteriaEvolution = (evolution: Omit<CriteriaEvolution, 'id'>) => {
    const newEvolution: CriteriaEvolution = {
      ...evolution,
      id: generateId(),
    };
    setCriteriaEvolutions(prev => [...prev, newEvolution]);
  };

  const getTherapistById = (id: string) => therapists.find(t => t.id === id);
  const getPatientById = (id: string) => patients.find(p => p.id === id);
  const getProgramsByPatient = (patientId: string) => programs.filter(p => p.patientId === patientId);
  const getSessionsByProgram = (programId: string) => sessions.filter(s => s.programId === programId);

  return (
    <ABAContext.Provider value={{
      therapists,
      patients,
      programs,
      sessions,
      therapeuticPlans,
      criteriaEvolutions,
      addTherapist,
      updateTherapist,
      deleteTherapist,
      addPatient,
      updatePatient,
      deletePatient,
      addProgram,
      updateProgram,
      deleteProgram,
      addSession,
      addTherapeuticPlan,
      updateTherapeuticPlan,
      deleteTherapeuticPlan,
      addCriteriaEvolution,
      getTherapistById,
      getPatientById,
      getProgramsByPatient,
      getSessionsByProgram,
    }}>
      {children}
    </ABAContext.Provider>
  );
}

export function useABA() {
  const context = useContext(ABAContext);
  if (context === undefined) {
    throw new Error('useABA must be used within an ABAProvider');
  }
  return context;
}