import React from 'react';
import styles from '../ExerciseDetails.module.scss';
import { Image, Skeleton, Tag, message } from 'antd';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import { ExerciseDetailsImageProps } from './types';
import {
  ExcerciseGroupColorMapping,
  ExcerciseGroupMapping,
} from '../../../constants/ExercisesGroups';

const BASE_IMAGE_URL = 'gs://fitness-app-56cf5.appspot.com';

export async function getImage(location: string) {
  const storage = getStorage();
  const ImageURL = await getDownloadURL(ref(storage, location));

  return await ImageURL;
}

export const ExerciseDetailsImage: React.FC<ExerciseDetailsImageProps> = ({
  exerciseId,
  group,
}) => {
  const [messageApi, contextHolder] = message.useMessage();

  const [image, setImage] = React.useState('');

  React.useEffect(() => {
    let wasUnmounted = false;

    getImage(`${BASE_IMAGE_URL}/full-images/${exerciseId}-full.jpg`)
      .then((image) => {
        if (wasUnmounted) return;
        setImage(image);
      })
      .catch((error) => {
        getImage(`${BASE_IMAGE_URL}/images/${exerciseId}.jpg`)
          .then((image) => {
            if (wasUnmounted) return;
            setImage(image);
          })
          .catch((error) => {
            messageApi.open({
              type: 'error',
              content: error?.message || 'Something went wrong',
            });
            console.error(error);
          });
      });

    return () => {
      wasUnmounted = true;
    };
    // eslint-disable-next-line
  }, []);

  return (
    <>
      {contextHolder}

      <div className={styles.detailsImageContainer}>
        {group && (
          <div className={styles.detailsCategory}>
            <Tag color={ExcerciseGroupColorMapping[group]}>
              {ExcerciseGroupMapping[group]}
            </Tag>
          </div>
        )}

        {image ? (
          <Image height={'100%'} src={image} preview={false} alt={exerciseId} />
        ) : (
          <Skeleton.Image active={true} />
        )}
      </div>
    </>
  );
};
