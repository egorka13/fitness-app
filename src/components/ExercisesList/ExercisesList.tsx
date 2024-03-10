import React from 'react';
import styles from './ExercisesList.module.scss';
import { ExercisesListItem } from './ExercisesListItem/ExercisesListItem';
import { message } from 'antd';
import { getDatabase, ref, child, get } from 'firebase/database';
import { ExerciseGroup } from '../../constants/ExercisesGroups';

export type TExercisesList = Record<ExerciseGroup, any>;

export interface ExerciesItem {
  id: string;
  name: string;
  group: ExerciseGroup;
}

export const ExercisesList: React.FC = () => {
  const [messageApi, contextHolder] = message.useMessage();

  const [exerciseList, setExerciseList] = React.useState<ExerciesItem[]>([]);

  React.useEffect(() => {
    const dbRef = ref(getDatabase());

    get(child(dbRef, 'exercises'))
      .then((snapshot) => {
        if (snapshot.exists()) {
          const uploadedList: TExercisesList = snapshot.val();
          const flattenedList = [].concat.apply(
            [],
            Object.values(uploadedList)
          );

          setExerciseList(flattenedList);
        } else {
          console.log('No data available');
        }
      })
      .catch((error) => {
        messageApi.open({
          type: 'error',
          content: error?.message || 'Something went wrong',
        });
        console.error(error);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {contextHolder}

      <div className={styles.container}>
        {exerciseList.map((item) => {
          return <ExercisesListItem key={item.id} item={item} />;
        })}
      </div>
    </>
  );
};
