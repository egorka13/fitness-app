import React from 'react';
import {
  AreaChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Area,
  Tooltip,
  ComposedChart,
  Legend,
  Bar,
  Line,
  Scatter,
} from 'recharts';
import { ExerciseDetailsGraphProps } from './types';

export const ExerciseDetailsGraph: React.FC<ExerciseDetailsGraphProps> = ({
  data,
}) => {
  const graphData = [...data]
    .sort((a, b) => a.key - b.key)
    .reverse()
    .map((record, index) => ({
      name: index + 1,
      weight: record.weight,
      reps: record.reps,
    }));

  return (
    <>
      {graphData.length >= 2 ? (
        <ComposedChart
          width={document.body.clientWidth}
          height={200}
          data={graphData}
          margin={{ top: 0, right: 30, left: -10, bottom: 0 }}
        >
          {/* <CartesianGrid stroke="#666666" /> */}
          <XAxis dataKey="name" scale="band" />
          <YAxis />
          <Legend />
          <Bar dataKey="reps" barSize={20} fill="#413ea0" />
          <Line type="monotone" dataKey="weight" stroke="#ff7300" />
        </ComposedChart>
      ) : null}
      {/* {graphData.length >= 2 ? (
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
            dataKey="weight"
            stroke="#8884d8"
            fillOpacity={1}
            fill="url(#colorUv)"
          />
          <Area
            type="monotone"
            dataKey="reps"
            stroke="#82ca9d"
            fillOpacity={1}
            fill="url(#colorPv)"
          />
        </AreaChart>
      ) : null} */}
    </>
  );
};
