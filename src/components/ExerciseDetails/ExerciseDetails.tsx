import React from 'react';
import { Navigate, useParams } from 'react-router-dom';
import styles from './ExerciseDetails.module.scss';
import { ExerciseDetailsHistoryTable } from './ExerciseDetailsHistoryTable/ExerciseDetailsHistoryTable';
import { ExerciseDetailsImage } from './ExerciseDetailsImage/ExerciseDetailsImage';
import { ExerciseGroup } from '../../constants/ExercisesGroups';

import { Button, ConfigProvider, InputNumber, message } from 'antd';
import { SaveOutlined } from '@ant-design/icons';

import { child, get, getDatabase, push, ref, set } from 'firebase/database';
import { ExerciseDTO } from './ExerciseDetailsHistoryTable/types';
import { useAuth } from '../../context/AuthContext';
import { ExercisesItem } from '../ExercisesList/ExercisesList';

interface ExerciseDetailsInnerState {
  repeats: number;
  weight: number | null;
}

export const ExerciseDetails: React.FC = () => {
  const { userLoggedIn, currentUser } = useAuth();

  const [messageApi, contextHolder] = message.useMessage();

  const { id, group } = useParams();

  const [formState, setFormState] = React.useState<ExerciseDetailsInnerState>({
    weight: 4,
    repeats: 15,
  });
  const [exercise, setExercise] = React.useState<ExercisesItem>();

  const handleWeightChange = React.useCallback((value: unknown) => {
    if (typeof value === 'number') {
      setFormState((prev) => ({ ...prev, weight: value }));
    }
  }, []);

  const handleRepeatsChange = React.useCallback((value: unknown) => {
    if (typeof value === 'number') {
      setFormState((prev) => ({ ...prev, repeats: value }));
    }
  }, []);

  const handleFormSubmit = React.useCallback(() => {
    const db = getDatabase();
    const historyRecordsListRef = ref(db, `history/${currentUser.uid}/${id}`);
    const newHistoryRecordRef = push(historyRecordsListRef);

    set(newHistoryRecordRef, {
      date: Date.now(),
      repeats: formState.repeats,
      weight: formState.weight,
    }).catch((error) => {
      messageApi.open({
        type: 'error',
        content: error?.message || 'Something went wrong',
      });
      console.error(error);
    });
  }, [id, formState.repeats, formState.weight, messageApi]);

  React.useEffect(() => {
    const dbRef = ref(getDatabase());

    if (group) {
      get(child(dbRef, `exercises/${group}`))
        .then((snapshot) => {
          if (snapshot.exists()) {
            const exercisesInGroup: ExercisesItem[] = snapshot.val();
            const currentExercise = exercisesInGroup.find(
              (item) => item.id === id
            );

            setExercise(currentExercise);
            setFormState((prev) => ({
              ...prev,
              weight: currentExercise?.isNoWeight ? null : prev.weight,
            }));
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
    }

    // initially load list with records
    get(child(dbRef, `history/${currentUser.uid}/${id}`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          const uploadedList: Record<string, ExerciseDTO> = snapshot.val();
          console.log(uploadedList);
          const lastRecord = Object.values(uploadedList).pop();
          if (lastRecord) {
            const { weight, repeats } = lastRecord;
            setFormState((prev) => ({ ...prev, weight, repeats }));
          }
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
  }, []);

  return (
    <ConfigProvider
      theme={{
        components: {
          InputNumber: {
            addonBg: 'white', // Background color of addon
            paddingBlockLG: 25, // Vertical padding of large input
          },
        },
      }}
    >
      {!userLoggedIn && <Navigate to={'/auth'} replace={true} />}

      {contextHolder}

      <div className={styles.detailsContainer}>
        <ExerciseDetailsImage exerciseId={id} group={group as ExerciseGroup} />

        <div className={styles.formContainer}>
          <InputNumber
            size="large"
            min={1}
            max={100000}
            value={formState.repeats}
            addonBefore="n"
            onChange={handleRepeatsChange}
          />

          {!exercise?.isNoWeight && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                color: 'white',
              }}
            >
              <InputNumber
                size="large"
                min={1}
                max={100000}
                value={formState.weight}
                addonBefore="кг"
                onChange={handleWeightChange}
              />
              {exercise?.isDoubleSided ? '* на каждую из сторон' : null}
            </div>
          )}

          <Button
            type="primary"
            icon={<SaveOutlined />}
            size={'large'}
            onClick={handleFormSubmit}
          >
            Сохранить
          </Button>
        </div>

        {id && <ExerciseDetailsHistoryTable exerciseId={id} />}
      </div>
    </ConfigProvider>
  );
};
