import { Session } from '@supabase/supabase-js';

export interface ExerciseDetailsHistoryTableProps {
  exerciseId: string;
  session: Session;
}

// backend model
export interface ExerciseDTO {
  createdAt: string;
  reps: number;
  weight: string;
}

// frontend model
export interface ExerciseRecord {
  key: number;
  createdAt: string;
  reps: number;
  weight: string;
}
