import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ExercisesListItem.module.scss';
import { ExercisesItem } from '../ExercisesList';
import {
  ExcerciseGroupColorMapping,
  ExcerciseGroupMapping,
} from '../../../constants/ExercisesGroups';
import { Image, Skeleton, Tag } from 'antd';

interface ExercisesListItemProps {
  item: ExercisesItem;
}

export const ExercisesListItem: React.FC<ExercisesListItemProps> = ({
  item,
}) => {
  const navigate = useNavigate();

  const handleItemClick = React.useCallback(() => {
    navigate(`/exercise/${item.group}/${item.id}`);
  }, [navigate, item]);

  return (
    <>
      <div className={styles.container}>
        <div className={styles.imageContainer}>
          {item.imageUrl ? (
            <Image
              style={{ borderRadius: '5px' }}
              width={100}
              height={100}
              src={item.imageUrl}
              alt={item.name}
            />
          ) : (
            <div style={{ width: '100px', height: '100px' }}>
              <Skeleton.Image active={true} />
            </div>
          )}
        </div>

        <div className={styles.infoContainer} onClick={handleItemClick}>
          <div className={styles.infoTitle}>{item.title}</div>
          <div className={styles.infoSubTitle}>
            <Tag color={ExcerciseGroupColorMapping[item.group]}>
              {ExcerciseGroupMapping[item.group]}
            </Tag>
          </div>
        </div>
      </div>
    </>
  );
};
