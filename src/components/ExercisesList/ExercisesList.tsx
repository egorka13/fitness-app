import React from 'react';
import styles from './ExercisesList.module.scss';
import { ExercisesListItem } from './ExercisesListItem/ExercisesListItem';
import { Button, Tag, message } from 'antd';
import { getDatabase, ref, child, get } from 'firebase/database';
import {
  DEFAULT_EXERCISE_GROUPS,
  ExcerciseGroupColorMapping,
  ExcerciseGroupShortMapping,
  ExerciseGroup,
} from '../../constants/ExercisesGroups';
import {
  CloseOutlined,
  LogoutOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import { doSignOut, useAuth } from '../../context/AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';

export type TExercisesList = Record<ExerciseGroup, any>;

export interface ExercisesItem {
  id: string;
  name: string;
  group: ExerciseGroup;
  isNoWeight?: boolean;
  isDoubleSided?: boolean;
}

export const ExercisesList: React.FC = () => {
  const navigate = useNavigate();
  const { userLoggedIn } = useAuth();

  const [messageApi, contextHolder] = message.useMessage();

  const [defaultExerciseList, setDefaultExerciseList] = React.useState<
    ExercisesItem[]
  >([]);
  const [exerciseList, setExerciseList] = React.useState<ExercisesItem[]>([]);
  const [exerciseGroups, setExerciseGroups] = React.useState<ExerciseGroup[]>(
    DEFAULT_EXERCISE_GROUPS
  );

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
          setDefaultExerciseList(flattenedList);
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
    // eslint-disable-next-line
  }, []);

  const handleFiltersReset = React.useCallback(() => {
    setExerciseList(defaultExerciseList);
    setExerciseGroups(DEFAULT_EXERCISE_GROUPS);
  }, [defaultExerciseList]);

  const handleGroupClick = React.useCallback(
    (event: React.MouseEvent, group: ExerciseGroup) => {
      event.stopPropagation();
      setExerciseList(
        defaultExerciseList.filter((item) => item.group === group)
      );
      setExerciseGroups([group]);
    },
    [defaultExerciseList]
  );

  const handleGroupClose = React.useCallback(
    (event: React.MouseEvent, group: ExerciseGroup) => {
      event.stopPropagation();
      setExerciseList((prev) => prev.filter((item) => item.group !== group));
      setExerciseGroups((prev) => prev.filter((item) => item !== group));
    },
    []
  );

  return (
    <>
      {!userLoggedIn && <Navigate to={'/auth'} replace={true} />}

      {contextHolder}

      <div className={styles.container}>
        <div className={styles.filterContainer}>
          <Button icon={<ReloadOutlined />} onClick={handleFiltersReset} />
          {exerciseGroups.map((group) => (
            <Tag
              key={group}
              className={styles.filterTag}
              bordered={false}
              color={ExcerciseGroupColorMapping[group]}
              onClick={(event) => handleGroupClick(event, group)}
            >
              {ExcerciseGroupShortMapping[group]}
              <CloseOutlined
                style={{ fontSize: '14px' }}
                onClick={(event) => handleGroupClose(event, group)}
              />
            </Tag>
          ))}
        </div>

        {exerciseList.map((item) => {
          return <ExercisesListItem key={item.id} item={item} />;
        })}

        <Button
          type="primary"
          icon={<LogoutOutlined />}
          size={'large'}
          onClick={() =>
            doSignOut().then(() => {
              navigate('auth');
            })
          }
        >
          Log out
        </Button>
      </div>
    </>
  );
};
