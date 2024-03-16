export type ExerciseGroup =
  | 'abs'
  | 'legs'
  | 'chest'
  | 'deltoids'
  | 'back'
  | 'gluteus'
  | 'biceps'
  | 'triceps';

export const ExcerciseGroupMapping: Record<ExerciseGroup, string> = {
  abs: 'Упражнение на мышцы пресса',
  legs: 'Упражнение на мышцы ног',
  deltoids: 'Упражнение на мышцы плеч',
  chest: 'Упражнение на мышцы груди',
  back: 'Упражнение на мышцы спины',
  gluteus: 'Упражнение на мышцы ягодиц',
  biceps: 'Упражнение на бицепс',
  triceps: 'Упражнение на трицепс',
};

// Available colors:
// #C06363 - red
// #215190 - dark blue
// #5099F4 - light blue
// #4B9BAE - grey blue
// #949398 - grey
// #1F2933 - dark grey
// #FFCF5C - yellow
export const ExcerciseGroupColorMapping: Record<ExerciseGroup, string> = {
  abs: '#C06363',
  legs: '#215190',
  deltoids: '#5099F4',
  chest: '#4B9BAE',
  back: '#949398',
  gluteus: '#1F2933',
  biceps: '#FFCF5C',
  triceps: 'rgb(10, 150, 100)',
};
