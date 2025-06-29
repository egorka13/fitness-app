import React from 'react';
import styles from './ExercisesList.module.scss';
import { ExercisesListItem } from './ExercisesListItem/ExercisesListItem';
import { Button, Tag, message } from 'antd';
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
import { sortGroupedListByPopularFirst } from '../../utils/utils';
import { useAuthContext } from '../../context/AuthContext';

export type TExercisesList = Record<ExerciseGroup, any>;

export interface ExercisesItem {
  id: string;
  name: string;
  title: string;
  group: ExerciseGroup;
  imageUrl: string;
  isPopular?: boolean;
  isNoWeight?: boolean;
  isDoubleSided?: boolean;
}

export const ExercisesList: React.FC = () => {
  const { session } = useAuthContext();

  const [messageApi, contextHolder] = message.useMessage();

  const [defaultExerciseList, setDefaultExerciseList] = React.useState<
    ExercisesItem[]
  >([]);
  const [exerciseList, setExerciseList] = React.useState<ExercisesItem[]>([]);
  const [exerciseGroups, setExerciseGroups] = React.useState<ExerciseGroup[]>(
    DEFAULT_EXERCISE_GROUPS
  );

  React.useEffect(() => {
    fetch('http://localhost:8000/exercises', {
      headers: {
        Authorization: `Bearer ${session?.access_token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        const sortedFlatList = sortGroupedListByPopularFirst(data || []);

        setExerciseList(sortedFlatList);
        setDefaultExerciseList(sortedFlatList);
      })
      .catch((error) => {
        messageApi.open({
          type: 'error',
          content: error?.message || 'Something went wrong',
        });
        console.error(error);
      });
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
          // onClick={() =>
          //   doSignOut().then(() => {
          //     navigate('auth');
          //   })
          // }
        >
          Log out
        </Button>
      </div>
    </>
  );
};
