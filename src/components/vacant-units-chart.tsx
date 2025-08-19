
'use client';

import * as React from 'react';
import { Pie, PieChart, Legend, Tooltip } from 'recharts';

import {
  ChartConfig,
  ChartContainer,
  ChartTooltipContent,
} from '@/components/ui/chart';

const chartData = [
    { name: '2 BHK', value: 223, fill: 'hsl(var(--chart-5))' },
    { name: '1 BHK', value: 106, fill: 'hsl(var(--chart-1))' },
    { name: '3 BHK', value: 41, fill: 'hsl(var(--chart-2))' },
    { name: '4 BHK', value: 1, fill: 'hsl(var(--chart-3))' },
];

const chartConfig = {
  value: {
    label: 'Units',
  },
  '1 BHK': {
    label: '1 BHK',
    color: 'hsl(var(--chart-1))',
  },
  '2 BHK': {
    label: '2 BHK',
    color: 'hsl(var(--chart-5))',
  },
  '3 BHK': {
    label: '3 BHK',
    color: 'hsl(var(--chart-2))',
  },
  '4 BHK': {
    label: '4 BHK',
    color: 'hsl(var(--chart-3))',
  },
} satisfies ChartConfig;

export function VacantUnitsChart() {
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
          strokeWidth={5}
        />
      </PieChart>
    </ChartContainer>
  );
}
