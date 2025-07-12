import React from 'react';
import { useParams } from 'react-router-dom';
import styles from './ExerciseDetails.module.scss';
import { ExerciseDetailsHistoryTable } from './ExerciseDetailsHistoryTable/ExerciseDetailsHistoryTable';
import { ExerciseDetailsImage } from './ExerciseDetailsImage/ExerciseDetailsImage';
import { ExerciseGroup } from '../../constants/ExercisesGroups';

import { Button, ConfigProvider, InputNumber, message } from 'antd';
import { SaveOutlined } from '@ant-design/icons';

import { ExerciseDTO } from './ExerciseDetailsHistoryTable/types';
import { ExercisesItem } from '../ExercisesList/ExercisesList';
import { useAuthContext } from '../../context/AuthContext';
import { useApi } from '../../hooks/useApi';

interface ExerciseDetailsInnerState {
  reps: number;
  weight: number | null;
}

export const ExerciseDetails: React.FC = () => {
  const { session } = useAuthContext();

  const [messageApi, contextHolder] = message.useMessage();

  const { id, group } = useParams();

  const { get, post } = useApi(session);

  const [formState, setFormState] = React.useState<ExerciseDetailsInnerState>({
    weight: 4,
    reps: 15,
  });
  const [exercise, setExercise] = React.useState<ExercisesItem>();

  const handleWeightChange = React.useCallback((value: unknown) => {
    if (typeof value === 'number') {
      setFormState((prev) => ({ ...prev, weight: value }));
    }
  }, []);

  const handleRepeatsChange = React.useCallback((value: unknown) => {
    if (typeof value === 'number') {
      setFormState((prev) => ({ ...prev, reps: value }));
    }
  }, []);

  const handleFormSubmit = React.useCallback(() => {
    post(`exercises/${id}/history`, {
      repeats: formState.reps,
      weight: formState.weight,
    })
      .then(() => {
        window.location.reload();
        messageApi.open({
          type: 'success',
          content: 'Successfully saved',
        });
      })
      .catch((error) => {
        messageApi.open({
          type: 'error',
          content: error?.message || 'Something went wrong',
        });
        console.error(error);
      });
  }, [id, formState.reps, formState.weight, messageApi]);

  React.useEffect(() => {
    if (group) {
      get(`exercises/${id}`)
        .then((data: ExercisesItem) => {
          if (data) {
            setExercise(data);
            setFormState((prev) => ({
              ...prev,
              weight: data?.isNoWeight ? null : prev.weight,
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

    get(`exercises/${id}/history`)
      .then((data: ExerciseDTO[]) => {
        if (data) {
          const lastRecord = data[0];
          if (lastRecord) {
            const { weight, reps } = lastRecord;
            setFormState((prev) => ({
              ...prev,
              weight: Number(weight),
              reps: reps,
            }));
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
      {contextHolder}

      <div className={styles.detailsContainer}>
        <ExerciseDetailsImage
          exerciseId={id}
          group={group as ExerciseGroup}
          exercise={exercise}
        />

        <div className={styles.formContainer}>
          <InputNumber
            size="large"
            min={1}
            max={100000}
            value={formState.reps}
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
                value={Number(formState.weight)}
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
