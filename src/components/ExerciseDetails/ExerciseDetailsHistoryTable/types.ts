export interface ExerciseDetailsHistoryTableProps {
  exerciseId: string;
}

// backend model
export interface ExerciseDTO {
  date: number;
  repeats: number;
  weight: number;
}

// frontend model
export interface ExerciseRecord {
  key: number;
  date: string;
  repeats: number;
  weight: number;
}
