
"use client"

import * as React from "react"
import { Bar, BarChart as BarChartComponent, CartesianGrid, Cell, Legend, Line, LineChart as LineChartComponent, Pie, PieChart as PieChartComponent, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

import { cn } from "@/lib/utils"

const chartColors = {
  slate: "hsl(215, 16%, 47%)",
  violet: "hsl(270, 70%, 63%)",
  indigo: "hsl(226, 70%, 55%)",
  blue: "hsl(210, 100%, 62%)",
  cyan: "hsl(190, 90%, 50%)",
  teal: "hsl(170, 75%, 41%)",
  green: "hsl(142, 71%, 45%)",
  yellow: "hsl(45, 100%, 51%)",
  amber: "hsl(32, 95%, 53%)",
  orange: "hsl(16, 100%, 54%)",
  red: "hsl(0, 91%, 64%)",
  pink: "hsl(330, 86%, 65%)",
  gray: "hsl(215, 16%, 47%)",
}

interface LineChartProps {
  data: Array<Record<string, any>>
  className?: string
  width?: number
  height?: number
  showLegend?: boolean
  showXAxis?: boolean
  showYAxis?: boolean
  showGrid?: boolean
  showTooltip?: boolean
  categories?: string[]
  colors?: string[]
  valueFormatter?: (value: number) => string
  index: string
  yAxisWidth?: number
  showAnimation?: boolean
  showGradient?: boolean
}

const LineChart = React.forwardRef<
  React.ElementRef<typeof LineChartComponent>,
  LineChartProps
>(
  (
    {
      data,
      className,
      width,
      height = 300,
      showLegend = true,
      showXAxis = true,
      showYAxis = true,
      showGrid = true,
      showTooltip = true,
      categories = ["value"],
      colors = ["blue", "violet", "cyan", "green", "yellow", "amber", "orange", "red", "pink", "indigo", "teal", "slate"],
      valueFormatter = (value: number) => `${value}`,
      index,
      yAxisWidth = 56,
      showAnimation = true,
      showGradient = true,
    },
    ref
  ) => {
    // Map color names to actual color values
    const mappedColors = colors.map((color) => {
      // @ts-ignore
      return chartColors[color] ?? color
    })

    const ids = React.useId()

    return (
      <div
        className={cn("w-full h-full text-sm", className)}
        style={{ width, height }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChartComponent
            ref={ref}
            data={data}
            margin={{
              top: 5,
              right: 10,
              left: 0,
              bottom: 0,
            }}
          >
            {showGrid && <CartesianGrid strokeDasharray="3 3" vertical={false} />}
            {showXAxis && (
              <XAxis
                dataKey={index}
                tick={{ transform: "translate(0, 6)" }}
                ticks={
                  data.length <= 7
                    ? data.map((d) => d[index])
                    : undefined
                }
                style={{
                  fontSize: "12px",
                  fontFamily: "inherit",
                }}
                tickLine={false}
                axisLine={false}
                interval="preserveStartEnd"
                minTickGap={8}
              />
            )}
            {showYAxis && (
              <YAxis
                width={yAxisWidth}
                axisLine={false}
                tickLine={false}
                style={{
                  fontSize: "12px",
                  fontFamily: "inherit",
                }}
                tickFormatter={valueFormatter}
              />
            )}
            {showTooltip && (
              <Tooltip
                formatter={(value: number) => {
                  return valueFormatter(value)
                }}
                contentStyle={{
                  backgroundColor: "var(--chart-tooltip-background)",
                  borderColor: "var(--chart-tooltip-border-color)",
                  borderRadius: "var(--radius)",
                  boxShadow: "var(--shadow)",
                }}
                itemStyle={{
                  color: "var(--chart-tooltip-color)",
                }}
                labelStyle={{
                  color: "var(--chart-tooltip-label-color)",
                }}
                cursor={{
                  stroke: "var(--chart-tooltip-cursor-color)",
                  strokeWidth: 1,
                  strokeDasharray: "4 4",
                }}
              />
            )}
            {showLegend && (
              <Legend
                verticalAlign="top"
                height={40}
                style={{
                  fontSize: "12px",
                  fontFamily: "inherit",
                }}
                formatter={(value) => (
                  <span className="text-muted-foreground">{value}</span>
                )}
              />
            )}
            {categories.map((category, index) => (
              <Line
                key={`${ids}-${index}`}
                type="monotone"
                dataKey={category}
                stroke={mappedColors[index % mappedColors.length]}
                activeDot={{ r: 4 }}
                isAnimationActive={showAnimation}
                strokeWidth={2}
              >
                {showGradient && (
                  <React.Fragment key={`${ids}-${index}-fragment`}>
                    <defs>
                      <linearGradient
                        id={`${ids}-gradient-${index}`}
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor={mappedColors[index % mappedColors.length]}
                          stopOpacity={0.2}
                        />
                        <stop
                          offset="95%"
                          stopColor={mappedColors[index % mappedColors.length]}
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <Line
                      type="monotone"
                      dataKey={category}
                      stroke={mappedColors[index % mappedColors.length]}
                      fill={`url(#${ids}-gradient-${index})`}
                      strokeWidth={2}
                      activeDot={{ r: 8 }}
                    />
                  </React.Fragment>
                )}
              </Line>
            ))}
          </LineChartComponent>
        </ResponsiveContainer>
      </div>
    )
  }
)
LineChart.displayName = "LineChart"

interface BarChartProps {
  data: Array<Record<string, any>>
  className?: string
  width?: number
  height?: number
  showLegend?: boolean
  showXAxis?: boolean
  showYAxis?: boolean
  showGrid?: boolean
  showTooltip?: boolean
  categories?: string[]
  colors?: string[]
  valueFormatter?: (value: number) => string
  index: string
  yAxisWidth?: number
  layout?: "horizontal" | "vertical"
  showAnimation?: boolean
}

const BarChart = React.forwardRef<
  React.ElementRef<typeof BarChartComponent>,
  BarChartProps
>(
  (
    {
      data,
      className,
      width,
      height = 300,
      showLegend = true,
      showXAxis = true,
      showYAxis = true,
      showGrid = true,
      showTooltip = true,
      categories = ["value"],
      colors = ["blue", "violet", "cyan", "green", "yellow", "amber", "orange", "red", "pink", "indigo", "teal", "slate"],
      valueFormatter = (value: number) => `${value}`,
      index,
      yAxisWidth = 56,
      layout = "horizontal",
      showAnimation = true,
    },
    ref
  ) => {
    // Map color names to actual color values
    const mappedColors = colors.map((color) => {
      // @ts-ignore
      return chartColors[color] ?? color
    })

    const ids = React.useId()

    return (
      <div
        className={cn("w-full h-full text-sm", className)}
        style={{ width, height }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChartComponent
            ref={ref}
            layout={layout}
            data={data}
            margin={{
              top: showLegend ? 30 : 5,
              right: 10,
              left: 0,
              bottom: 0,
            }}
          >
            {showGrid && <CartesianGrid strokeDasharray="3 3" vertical={false} />}
            {showXAxis && (
              <XAxis
                dataKey={layout === "horizontal" ? index : undefined}
                axisLine={false}
                tickLine={false}
                tick={{ transform: "translate(0, 6)" }}
                ticks={
                  data.length <= 7
                    ? data.map((d) => d[layout === "horizontal" ? index : categories[0]])
                    : undefined
                }
                style={{
                  fontSize: "12px",
                  fontFamily: "inherit",
                }}
                interval="preserveStartEnd"
                minTickGap={8}
                type={layout === "horizontal" ? "category" : "number"}
                height={layout === "horizontal" ? 22 : undefined}
                tickFormatter={layout === "vertical" ? valueFormatter : undefined}
              />
            )}
            {showYAxis && (
              <YAxis
                width={yAxisWidth}
                axisLine={false}
                tickLine={false}
                style={{
                  fontSize: "12px",
                  fontFamily: "inherit",
                }}
                dataKey={layout === "vertical" ? index : undefined}
                ticks={
                  layout === "vertical" && data.length <= 7
                    ? data.map((d) => d[index])
                    : undefined
                }
                type={layout === "vertical" ? "category" : "number"}
                tickFormatter={layout === "horizontal" ? valueFormatter : undefined}
              />
            )}
            {showTooltip && (
              <Tooltip
                formatter={(value: number) => {
                  return valueFormatter(value)
                }}
                contentStyle={{
                  backgroundColor: "var(--chart-tooltip-background)",
                  borderColor: "var(--chart-tooltip-border-color)",
                  borderRadius: "var(--radius)",
                  boxShadow: "var(--shadow)",
                }}
                itemStyle={{
                  color: "var(--chart-tooltip-color)",
                }}
                labelStyle={{
                  color: "var(--chart-tooltip-label-color)",
                }}
                cursor={{
                  fill: "var(--chart-tooltip-cursor-color)",
                  opacity: 0.1,
                }}
              />
            )}
            {showLegend && categories.length > 1 && (
              <Legend
                verticalAlign="top"
                height={30}
                style={{
                  fontSize: "12px",
                  fontFamily: "inherit",
                }}
                formatter={(value) => (
                  <span className="text-muted-foreground">{value}</span>
                )}
              />
            )}
            {categories.map((category, index) => (
              <Bar
                key={`${ids}-${index}`}
                dataKey={category}
                fill={
                  data.length === 1
                    ? mappedColors
                    : mappedColors[index % mappedColors.length]
                }
                isAnimationActive={showAnimation}
                {...(data.length === 1
                  ? {
                      stackId: "a",
                    }
                  : {})}
              >
                {data.length === 1 &&
                  data[0][category] !== undefined &&
                  typeof data[0][category] === "number" &&
                  data.map((_entry, index) => (
                    <Cell
                      key={`${ids}-cell-${index}`}
                      fill={mappedColors[index % mappedColors.length]}
                    />
                  ))}
              </Bar>
            ))}
          </BarChartComponent>
        </ResponsiveContainer>
      </div>
    )
  }
)
BarChart.displayName = "BarChart"

interface PieChartProps {
  data: Array<Record<string, any>>
  className?: string
  width?: number
  height?: number
  showLegend?: boolean
  showTooltip?: boolean
  showLabels?: boolean
  category: string
  index: string
  colors?: string[]
  valueFormatter?: (value: number) => string
}

const PieChart = React.forwardRef<
  React.ElementRef<typeof PieChartComponent>,
  PieChartProps
>(
  (
    {
      data,
      className,
      width,
      height = 300,
      showLegend = true,
      showTooltip = true,
      showLabels = false,
      category,
      index,
      colors = ["blue", "violet", "cyan", "green", "yellow", "amber", "orange", "red", "pink", "indigo", "teal", "slate"],
      valueFormatter = (value: number) => `${value}`,
    },
    ref
  ) => {
    // Combine the category and value to create a tooltip
    const createTooltipContent = (value: number, name: string) => {
      return `${name}: ${valueFormatter(value)}`
    }

    // Map color names to actual color values
    const mappedColors = colors.map((color) => {
      // @ts-ignore
      return chartColors[color] ?? color
    })

    // Calculate the total value of the category
    const total = React.useMemo(() => {
      return data.reduce((acc, curr) => {
        // Ensure numeric operation
        const numValue = Number(curr[category]) || 0;
        return acc + numValue;
      }, 0)
    }, [data, category])

    return (
      <div
        className={cn("w-full h-full text-sm", className)}
        style={{ width, height }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <PieChartComponent ref={ref}>
            <Pie
              data={data}
              dataKey={category}
              nameKey={index}
              cx="50%"
              cy="50%"
              outerRadius={showLegend ? "70%" : "90%"}
              innerRadius="0%"
              label={
                showLabels
                  ? ({ percent }) => {
                      // Ensure numeric operation
                      const numPercent = Number(percent) || 0;
                      return `${(numPercent * 100).toFixed(0)}%`
                    }
                  : false
              }
              labelLine={showLabels}
            >
              {data.map((_entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={mappedColors[index % mappedColors.length]}
                />
              ))}
            </Pie>
            {showLegend && (
              <Legend
                layout="horizontal"
                verticalAlign="bottom"
                align="center"
                formatter={(value, entry: any) => {
                  const numValue = Number(entry.payload[category]) || 0;
                  const numTotal = Number(total) || 0;
                  const percent = numTotal > 0 ? (numValue / numTotal) * 100 : 0;
                  return (
                    <span className="text-muted-foreground">
                      {value} ({percent.toFixed(0)}%)
                    </span>
                  )
                }}
              />
            )}
            {showTooltip && (
              <Tooltip
                formatter={(value: number, _name, props) => {
                  const entryName = props.payload[index]
                  return createTooltipContent(value, entryName)
                }}
                contentStyle={{
                  backgroundColor: "var(--chart-tooltip-background)",
                  borderColor: "var(--chart-tooltip-border-color)",
                  borderRadius: "var(--radius)",
                  boxShadow: "var(--shadow)",
                }}
                itemStyle={{
                  color: "var(--chart-tooltip-color)",
                }}
              />
            )}
          </PieChartComponent>
        </ResponsiveContainer>
      </div>
    )
  }
)
PieChart.displayName = "PieChart"

export { BarChart, LineChart, PieChart }
