export interface ExerciseDetailsHistoryTableProps {
  exerciseId: string;
}

// backend model
export interface ExerciseDTO {
  id: number;
  exerciseId: number;
  userId: string;
  reps: number;
  weight: string; // i.e. "30.00"
  createdAt: string;
  count?: number; // for merged sets
  merged?: boolean; // indicates if this record is a merged set
}

// frontend model
export interface ExerciseRecord extends ExerciseDTO {
  key: number;
}
