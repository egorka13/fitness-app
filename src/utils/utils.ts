import { ExercisesItem } from '../components/ExercisesList/ExercisesList';
import { ExerciseGroup } from '../constants/ExercisesGroups';

export const sortGroupedListByPopularFirst = (items: ExercisesItem[]) => {
  const groupedItems = items.reduce((acc, item) => {
    if (!acc[item.group]) {
      acc[item.group] = [];
    }
    acc[item.group].push(item);
    return acc;
  }, {} as Record<ExerciseGroup, ExercisesItem[]>);

  (Object.keys(groupedItems) as ExerciseGroup[]).forEach(
    (group: ExerciseGroup) => {
      groupedItems[group].sort((a: ExercisesItem, b: ExercisesItem) => {
        // Sort by isPopular: true first, then false/undefined
        return (b.isPopular === true ? 1 : 0) - (a.isPopular === true ? 1 : 0);
      });
    }
  );

  // Step 3: Flatten the sorted groups back into a single array
  const sortedItems = Object.values(groupedItems).flat();

  return sortedItems;
};
