import React from 'react';
import styles from '../ExerciseDetails.module.scss';
import { Image, Skeleton, Tag } from 'antd';
import { ExerciseDetailsImageProps } from './types';
import {
  ExcerciseGroupColorMapping,
  ExcerciseGroupMapping,
} from '../../../constants/ExercisesGroups';

export const ExerciseDetailsImage: React.FC<ExerciseDetailsImageProps> = ({
  exercise,
  exerciseId,
  group,
}) => {
  return (
    <>
      <div className={styles.detailsImageContainer}>
        {group && (
          <div className={styles.detailsCategory}>
            <Tag color={ExcerciseGroupColorMapping[group]}>
              {ExcerciseGroupMapping[group]}
            </Tag>
          </div>
        )}

        {exercise?.imageUrl ? (
          <Image
            width={'230px'}
            height={'100%'}
            src={exercise.imageUrl}
            preview={false}
            alt={exerciseId}
          />
        ) : (
          <Skeleton.Image active={true} />
        )}
      </div>
    </>
  );
};
