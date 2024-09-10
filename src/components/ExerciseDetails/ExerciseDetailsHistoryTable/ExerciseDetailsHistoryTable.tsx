import React from 'react';
import styles from '../ExerciseDetails.module.scss';
import { ConfigProvider, Table, message } from 'antd';
import { getDatabase, ref, child, get, onValue } from 'firebase/database';
import { columns } from './constants';
import {
  ExerciseDTO,
  ExerciseDetailsHistoryTableProps,
  ExerciseRecord,
} from './types';
import { useAuth } from '../../../context/AuthContext';

export const ExerciseDetailsHistoryTable: React.FC<
  ExerciseDetailsHistoryTableProps
> = ({ exerciseId }) => {
  const { currentUser } = useAuth();

  const [messageApi, contextHolder] = message.useMessage();

  const [records, setRecords] = React.useState<ExerciseRecord[]>([]);

  const handleListUpdate = React.useCallback(
    (newRecords: Record<string, ExerciseDTO>) => {
      if (!newRecords) return;

      const newList: ExerciseRecord[] = Object.values(newRecords)?.map(
        (record, index) => ({
          ...record,
          key: index,
          date: new Date(record.date).toLocaleString(),
        })
      );

      setRecords(newList.reverse());
    },
    []
  );

  React.useEffect(() => {
    const dbRef = ref(getDatabase());

    // initially load list with records
    get(child(dbRef, `history/${currentUser.uid}/${exerciseId}`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          const uploadedList: Record<string, ExerciseDTO> = snapshot.val();
          handleListUpdate(uploadedList);
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

    // subscribe on records list updates
    const db = getDatabase();
    const historyRef = ref(db, `history/${currentUser.uid}/${exerciseId}`);
    onValue(historyRef, (snapshot) => {
      const uploadedList: Record<string, ExerciseDTO> = snapshot.val();
      handleListUpdate(uploadedList);
    });
    // eslint-disable-next-line
  }, []);

  return (
    <ConfigProvider
      theme={{
        token: {
          colorText: 'white', // Default text color
          colorTextDisabled: 'white', // Control the color of text in disabled state.
          colorTextDescription: 'white', // Control the font color of text description.
          colorBgContainer: '#323F4B', // Container background color
        },
        components: {
          Table: {
            borderColor: 'white', // Border color of table
            headerBg: '#323F4B', // Background of table header
            headerColor: 'white', // Color of table header text
          },
        },
      }}
    >
      {contextHolder}

      <div className={styles.tableContainer}>
        <Table dataSource={records} columns={columns} pagination={false} />
      </div>
    </ConfigProvider>
  );
};
