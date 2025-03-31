
import React from "react";
import {
  Bar,
  BarChart as RechartsBarChart,
  Line,
  LineChart as RechartsLineChart,
  Pie,
  PieChart as RechartsPieChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Cell,
  CartesianGrid,
  PieLabel,
  PieLabelRenderProps,
} from "recharts";

// Define reasonable chart colors
const defaultColors = [
  "#0ea5e9", // blue
  "#22c55e", // green
  "#f59e0b", // amber
  "#ef4444", // red
  "#8b5cf6", // violet
  "#ec4899", // pink
  "#06b6d4", // cyan
  "#14b8a6", // teal
  "#f97316", // orange
  "#6366f1"  // indigo
];

type ChartProps = {
  data: any[];
  height?: number;
  width?: number;
  categories: string[];
  index: string;
  colors?: string[];
  valueFormatter?: (value: number) => string;
  showYAxis?: boolean;
  showXAxis?: boolean;
  showLegend?: boolean;
  showTooltip?: boolean;
  showGrid?: boolean;
};

export const BarChart = ({
  data,
  height = 300,
  width,
  categories,
  index,
  colors = defaultColors,
  valueFormatter = (value) => `${value}`,
  showYAxis = true,
  showXAxis = true,
  showLegend = true,
  showTooltip = true,
  showGrid = true,
  layout = "vertical",
}: ChartProps & { layout?: "horizontal" | "vertical" }) => {
  // Ensure we have data
  if (!data || data.length === 0) return null;

  const isVertical = layout === "vertical";
  
  return (
    <ResponsiveContainer width={width || "100%"} height={height}>
      <RechartsBarChart
        data={data}
        layout={layout}
        margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
      >
        {showGrid && <CartesianGrid strokeDasharray="3 3" opacity={0.2} />}
        
        {showXAxis && (
          <XAxis
            type={isVertical ? "category" : "number"}
            dataKey={isVertical ? index : undefined}
            tick={{ fontSize: 12 }}
            axisLine={{ strokeWidth: 0.5 }}
            tickLine={{ strokeWidth: 0.5 }}
          />
        )}
        
        {showYAxis && (
          <YAxis
            type={isVertical ? "number" : "category"} 
            dataKey={!isVertical ? index : undefined}
            tick={{ fontSize: 12 }}
            axisLine={{ strokeWidth: 0.5 }}
            tickLine={{ strokeWidth: 0.5 }}
            width={60}
            tickFormatter={isVertical ? valueFormatter : undefined}
          />
        )}
        
        {showTooltip && (
          <Tooltip
            formatter={valueFormatter}
            contentStyle={{ 
              borderRadius: "4px", 
              padding: "8px", 
              backgroundColor: "white", 
              border: "1px solid #e2e8f0" 
            }}
          />
        )}
        
        {showLegend && <Legend />}
        
        {categories.map((category, index) => (
          <Bar 
            key={category}
            dataKey={category} 
            fill={colors[index % colors.length]}
            radius={[4, 4, 0, 0]}
          />
        ))}
      </RechartsBarChart>
    </ResponsiveContainer>
  );
};

export const LineChart = ({
  data,
  height = 300,
  width,
  categories,
  index,
  colors = defaultColors,
  valueFormatter = (value) => `${value}`,
  showYAxis = true,
  showXAxis = true,
  showLegend = true,
  showTooltip = true,
  showGrid = true,
}: ChartProps) => {
  // Ensure we have data
  if (!data || data.length === 0) return null;
  
  return (
    <ResponsiveContainer width={width || "100%"} height={height}>
      <RechartsLineChart
        data={data}
        margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
      >
        {showGrid && <CartesianGrid strokeDasharray="3 3" opacity={0.2} />}
        
        {showXAxis && (
          <XAxis
            dataKey={index}
            tick={{ fontSize: 12 }}
            axisLine={{ strokeWidth: 0.5 }}
            tickLine={{ strokeWidth: 0.5 }}
          />
        )}
        
        {showYAxis && (
          <YAxis 
            tickFormatter={valueFormatter}
            tick={{ fontSize: 12 }}
            axisLine={{ strokeWidth: 0.5 }}
            tickLine={{ strokeWidth: 0.5 }}
          />
        )}
        
        {showTooltip && (
          <Tooltip
            formatter={valueFormatter}
            contentStyle={{ 
              borderRadius: "4px", 
              padding: "8px", 
              backgroundColor: "white", 
              border: "1px solid #e2e8f0" 
            }}
          />
        )}
        
        {showLegend && <Legend />}
        
        {categories.map((category, index) => (
          <Line
            key={category}
            type="monotone"
            dataKey={category}
            stroke={colors[index % colors.length]}
            strokeWidth={2}
            activeDot={{ r: 6 }}
            dot={{ strokeWidth: 1, r: 4 }}
          />
        ))}
      </RechartsLineChart>
    </ResponsiveContainer>
  );
};

export const PieChart = ({
  data,
  height = 300,
  width,
  category,
  index,
  colors = defaultColors,
  valueFormatter = (value) => `${value}`,
  showLegend = true,
  showTooltip = true,
}: {
  data: any[];
  height?: number;
  width?: number;
  category: string;
  index: string;
  colors?: string[];
  valueFormatter?: (value: number) => string;
  showLegend?: boolean;
  showTooltip?: boolean;
}) => {
  // Ensure we have data
  if (!data || data.length === 0) return null;
  
  // Filter out data points where the category value is 0
  const filteredData = data.filter(item => item[category] > 0);
  
  if (filteredData.length === 0) return null;
  
  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }: PieLabelRenderProps) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    
    return percent < 0.05 ? null : (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize={12}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };
  
  return (
    <ResponsiveContainer width={width || "100%"} height={height}>
      <RechartsPieChart margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
        <Pie
          data={filteredData}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          dataKey={category}
          nameKey={index}
          label={renderCustomLabel}
        >
          {filteredData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Pie>
        
        {showLegend && <Legend />}
        
        {showTooltip && (
          <Tooltip
            formatter={valueFormatter}
            contentStyle={{ 
              borderRadius: "4px", 
              padding: "8px", 
              backgroundColor: "white", 
              border: "1px solid #e2e8f0" 
            }}
          />
        )}
      </RechartsPieChart>
    </ResponsiveContainer>
  );
};
