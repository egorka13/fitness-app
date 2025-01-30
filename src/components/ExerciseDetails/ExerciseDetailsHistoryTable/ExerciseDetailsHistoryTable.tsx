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
import {
  AreaChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Area,
  Tooltip,
} from 'recharts';

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

  const graphData = [...records]
    .sort((a, b) => a.key - b.key)
    .map((record, index) => ({
      name: index + 1,
      uv: record.weight,
      // pv: record.repeats,
    }));

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

      {records.length >= 2 ? (
        <AreaChart
          width={document.body.clientWidth}
          height={200}
          data={graphData}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="name" />
          <YAxis />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="uv"
            stroke="#8884d8"
            fillOpacity={1}
            fill="url(#colorUv)"
          />
          <Area
            type="monotone"
            dataKey="pv"
            stroke="#82ca9d"
            fillOpacity={1}
            fill="url(#colorPv)"
          />
        </AreaChart>
      ) : null}

      <div className={styles.tableContainer}>
        <Table dataSource={records} columns={columns} pagination={false} />
      </div>
    </ConfigProvider>
  );
};
