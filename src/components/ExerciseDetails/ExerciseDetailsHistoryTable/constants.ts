import { ColumnsType } from 'antd/es/table';
import { ExerciseRecord } from './types';

export const columns: ColumnsType<ExerciseRecord> = [
  {
    title: 'Дата',
    dataIndex: 'createdAt',
    key: 'createdAt',
  },
  {
    title: 'Повторения',
    dataIndex: 'repsCustom',
    key: 'repsCustom',
  },
  {
    title: 'Вес, кг',
    dataIndex: 'weight',
    key: 'weight',
  },
];
