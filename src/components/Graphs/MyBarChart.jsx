import React from 'react';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const MyBarChart = ({counts}) => {
  const data = [
    { name: 'Low', count: counts["low"] },
    { name: 'Medium', count: counts["medium"] },
    { name: 'High', count: counts["high"] },
  ];

  const COLORS = ['#00C49F', '#0088FE', '#EE4B2B'];

  return (
    <ResponsiveContainer width="100%" height="100%">
        <BarChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 50,
            right: 30,
            left: 20,
            bottom: 5,
          }}
          
        >
          
          <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count"> {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))} </Bar> 
        </BarChart>
      </ResponsiveContainer>
  );
};

export default MyBarChart;