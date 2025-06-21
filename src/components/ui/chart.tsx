
import React from 'react';
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart as RechartsBarChart, Bar, PieChart as RechartsPieChart, Pie, Cell } from 'recharts';

interface ChartProps {
  data: any[];
  height: number;
  categories?: string[];
  index: string;
  colors?: string[];
  valueFormatter?: (value: any) => string;
  category?: string;
  layout?: 'vertical' | 'horizontal';
}

export const LineChart: React.FC<ChartProps> = ({ 
  data, 
  height, 
  categories = [], 
  index, 
  colors = ['#3b82f6', '#f59e0b'], 
  valueFormatter = (value) => value.toString() 
}) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsLineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={index} />
        <YAxis />
        <Tooltip formatter={valueFormatter} />
        <Legend />
        {categories.map((category, idx) => (
          <Line 
            key={category} 
            type="monotone" 
            dataKey={category} 
            stroke={colors[idx % colors.length]} 
          />
        ))}
      </RechartsLineChart>
    </ResponsiveContainer>
  );
};

export const BarChart: React.FC<ChartProps> = ({ 
  data, 
  height, 
  categories = [], 
  index, 
  colors = ['#3b82f6'], 
  valueFormatter = (value) => value.toString(),
  layout = 'horizontal'
}) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsBarChart data={data} layout={layout}>
        <CartesianGrid strokeDasharray="3 3" />
        {layout === 'vertical' ? (
          <>
            <XAxis type="number" />
            <YAxis dataKey={index} type="category" />
          </>
        ) : (
          <>
            <XAxis dataKey={index} />
            <YAxis />
          </>
        )}
        <Tooltip formatter={valueFormatter} />
        <Legend />
        {categories.map((category, idx) => (
          <Bar 
            key={category} 
            dataKey={category} 
            fill={colors[idx % colors.length]} 
          />
        ))}
      </RechartsBarChart>
    </ResponsiveContainer>
  );
};

export const PieChart: React.FC<ChartProps> = ({ 
  data, 
  height, 
  category = 'value', 
  index, 
  valueFormatter = (value) => value.toString() 
}) => {
  const COLORS = ['#3b82f6', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6'];

  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsPieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, value }) => `${name}: ${valueFormatter(value)}`}
          outerRadius={80}
          fill="#8884d8"
          dataKey={category}
          nameKey={index}
        >
          {data.map((entry, idx) => (
            <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={valueFormatter} />
      </RechartsPieChart>
    </ResponsiveContainer>
  );
};
