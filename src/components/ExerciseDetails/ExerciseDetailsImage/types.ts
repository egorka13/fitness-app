import { ExerciseGroup } from '../../../constants/ExercisesGroups';
import { ExercisesItem } from '../../ExercisesList/ExercisesList';

export interface ExerciseDetailsImageProps {
  exercise?: ExercisesItem;
  exerciseId?: string;
  group?: ExerciseGroup;
}
