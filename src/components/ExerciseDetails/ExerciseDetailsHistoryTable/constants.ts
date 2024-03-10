import { ColumnsType } from 'antd/es/table';
import { ExerciseRecord } from './types';

export const columns: ColumnsType<ExerciseRecord> = [
  {
    title: 'Дата',
    dataIndex: 'date',
    key: 'date',
  },
  {
    title: 'Повторения',
    dataIndex: 'repeats',
    key: 'age',
  },
  {
    title: 'Вес, кг',
    dataIndex: 'weight',
    key: 'weight',
  },
];
