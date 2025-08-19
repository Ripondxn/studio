
'use client';

import { Funnel, FunnelChart, LabelList, Legend, Tooltip } from 'recharts';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltipContent,
} from '@/components/ui/chart';

const chartData = [
  { value: 36, name: '1 BHK', fill: 'hsl(var(--chart-1))' },
  { value: 14, name: '3 BHK', fill: 'hsl(var(--chart-2))' },
  { value: 3, name: '2 BHK', fill: 'hsl(var(--chart-3))' },
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
    color: 'hsl(var(--chart-3))',
  },
  '3 BHK': {
    label: '3 BHK',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig;

export function ActiveUnitsChart() {
  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <FunnelChart layout="vertical" data={chartData}>
        <Tooltip
          content={<ChartTooltipContent indicator="dot" />}
        />
        <Legend />
        <Funnel dataKey="value" nameKey="name" isAnimationActive>
          <LabelList
            position="center"
            fill="#fff"
            stroke="none"
            dataKey="value"
          />
        </Funnel>
      </FunnelChart>
    </ChartContainer>
  );
}
