
'use client';

import * as React from 'react';
import { Pie, PieChart, Legend, Tooltip } from 'recharts';

import {
  ChartConfig,
  ChartContainer,
  ChartTooltipContent,
} from '@/components/ui/chart';

const chartData = [
  { name: '2 BHK', value: 250, fill: 'hsl(var(--chart-1))' },
  { name: '1 BHK', value: 100, fill: 'hsl(var(--chart-2))' },
  { name: '3 BHK', value: 75, fill: 'hsl(var(--chart-3))' },
  { name: '4 BHK', value: 27, fill: 'hsl(var(--chart-4))' },
];

const chartConfig = {
  value: {
    label: 'Units',
  },
  '1 BHK': {
    label: '1 BHK',
    color: 'hsl(var(--chart-2))',
  },
  '2 BHK': {
    label: '2 BHK',
    color: 'hsl(var(--chart-1))',
  },
  '3 BHK': {
    label: '3 BHK',
    color: 'hsl(var(--chart-3))',
  },
  '4 BHK': {
    label: '4 BHK',
    color: 'hsl(var(--chart-4))',
  },
} satisfies ChartConfig;

export function TotalUnitsChart() {
  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <PieChart>
        <Tooltip
          content={<ChartTooltipContent nameKey="name" hideLabel />}
        />
        <Legend />
        <Pie
          data={chartData}
          dataKey="value"
          nameKey="name"
          innerRadius={60}
          strokeWidth={5}
        />
      </PieChart>
    </ChartContainer>
  );
}
