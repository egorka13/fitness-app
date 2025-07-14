import React from 'react';
import styles from '../ExerciseDetails.module.scss';
import { Badge, ConfigProvider, Table, message } from 'antd';
import { columns } from './constants';
import {
  ExerciseDTO,
  ExerciseDetailsHistoryTableProps,
  ExerciseRecord,
} from './types';
import { ExerciseDetailsGraph } from '../ExerciseDetailsGraph/ExerciseDetailsGraph';
import { useAuthContext } from '../../../context/AuthContext';
import { useApi } from '../../../hooks/useApi';

export const ExerciseDetailsHistoryTable: React.FC<
  ExerciseDetailsHistoryTableProps
> = ({ exerciseId }) => {
  const { session } = useAuthContext();

  const { get } = useApi(session);

  const [messageApi, contextHolder] = message.useMessage();

  const [records, setRecords] = React.useState<ExerciseRecord[]>([]);

  const handleListUpdate = React.useCallback((newRecords: ExerciseDTO[]) => {
    if (!newRecords) return;

    const newList: ExerciseRecord[] = newRecords?.map((record, index) => ({
      ...record,
      key: index,
      repsCustom: (
        <>
          {record.reps}{' '}
          {record.merged ? (
            <Badge
              color="green"
              count={`x${record.count}`}
              style={{ marginLeft: '8px' }}
            />
          ) : (
            ''
          )}
        </>
      ),
      createdAt: new Date(record.createdAt)
        .toISOString()
        .replace('T', ' ')
        .split('.')[0],
    }));

    setRecords(newList);
  }, []);

  React.useEffect(() => {
    get(`exercises/${exerciseId}/history`)
      .then((data: ExerciseDTO[]) => {
        if (data) {
          handleListUpdate(data);
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

      {records.length >= 2 ? <ExerciseDetailsGraph data={records} /> : null}

      <div className={styles.tableContainer}>
        <Table dataSource={records} columns={columns} pagination={false} />
      </div>
    </ConfigProvider>
  );
};
