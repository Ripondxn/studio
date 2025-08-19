'use client';

import { Bar, BarChart, XAxis, YAxis } from 'recharts';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

const chartData = [
  { status: 'Occupied', units: 85, fill: 'var(--color-occupied)' },
  { status: 'Vacant', units: 10, fill: 'var(--color-vacant)' },
  { status: 'Maintenance', units: 5, fill: 'var(--color-maintenance)' },
];

const chartConfig = {
  units: {
    label: 'Units',
  },
  occupied: {
    label: 'Occupied',
    color: 'hsl(var(--chart-1))',
  },
  vacant: {
    label: 'Vacant',
    color: 'hsl(var(--chart-2))',
  },
  maintenance: {
    label: 'Maintenance',
    color: 'hsl(var(--muted))',
  },
} satisfies ChartConfig;

export function OccupancyChart() {
  return (
    <ChartContainer config={chartConfig} className="min-h-[120px] w-full">
      <BarChart accessibilityLayer data={chartData} layout="vertical" margin={{ left: 0, top: 0, right: 0, bottom: 0}}>
        <XAxis type="number" hide />
        <YAxis
          dataKey="status"
          type="category"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          hide
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="dot" />}
        />
        <Bar dataKey="units" layout="vertical" stackId="a" radius={5} />
      </BarChart>
    </ChartContainer>
  );
}
