export interface ExerciseDetailsHistoryTableProps {
  exerciseId: string;
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
