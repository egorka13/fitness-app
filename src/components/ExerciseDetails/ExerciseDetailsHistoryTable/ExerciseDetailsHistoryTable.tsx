import React from 'react';
import styles from '../ExerciseDetails.module.scss';
import { ConfigProvider, Table, message } from 'antd';
import { getDatabase, ref, child, get } from 'firebase/database';
import { columns } from './constants';
import {
  ExerciseDTO,
  ExerciseDetailsHistoryTableProps,
  ExerciseRecord,
} from './types';

export const ExerciseDetailsHistoryTable: React.FC<
  ExerciseDetailsHistoryTableProps
> = ({ exerciseId }) => {
  const [messageApi, contextHolder] = message.useMessage();

  const [records, setRecords] = React.useState<ExerciseRecord[]>([]);

  React.useEffect(() => {
    const dbRef = ref(getDatabase());

    get(child(dbRef, `history/${exerciseId}`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          const uploadedList: Record<string, ExerciseDTO> = snapshot.val();

          console.log(uploadedList);

          setRecords(
            Object.values(uploadedList)
              ?.map((record, index) => ({
                ...record,
                key: index,
                date: new Date(record.date).toLocaleString(),
              }))
              .reverse()
          );
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
