import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ExercisesListItem.module.scss';
import { ExerciesItem } from '../ExercisesList';
import {
  ExcerciseGroupColorMapping,
  ExcerciseGroupMapping,
} from '../../../constants/ExercisesGroups';
import { Image, Skeleton, Tag, message } from 'antd';

import { getStorage, ref, getDownloadURL } from 'firebase/storage';

const BASE_IMAGE_URL = 'gs://fitness-app-56cf5.appspot.com';

export async function getImage(location: string) {
  const storage = getStorage();
  const ImageURL = await getDownloadURL(ref(storage, location));

  return await ImageURL;
}

interface ExercisesListItemProps {
  item: ExerciesItem;
}

export const ExercisesListItem: React.FC<ExercisesListItemProps> = ({
  item,
}) => {
  const [messageApi, contextHolder] = message.useMessage();

  const navigate = useNavigate();
  const [image, setImage] = React.useState('');

  React.useEffect(() => {
    let wasUnmounted = false;

    getImage(`${BASE_IMAGE_URL}/images/${item.id}.jpg`)
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

    return () => {
      wasUnmounted = true;
    };
    // eslint-disable-next-line
  }, []);

  const handleItemClick = React.useCallback(() => {
    navigate(`/exercise/${item.group}/${item.id}`);
  }, [navigate, item]);

  return (
    <>
      {contextHolder}

      <div className={styles.container}>
        <div className={styles.imageContainer}>
          {image ? (
            <Image width={100} height={100} src={image} />
          ) : (
            <div style={{ width: '100px', height: '100px' }}>
              <Skeleton.Image active={true} />
            </div>
          )}
        </div>

        <div className={styles.infoContainer} onClick={handleItemClick}>
          <div className={styles.infoTitle}>{item.name}</div>
          <div className={styles.infoSubTitle}>
            <Tag color={ExcerciseGroupColorMapping[item.group]}>
              {ExcerciseGroupMapping[item.group]}
            </Tag>
            {/* {ExcerciseGroupMapping[item.group]} */}
          </div>
        </div>
      </div>
    </>
  );
};
