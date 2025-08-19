
'use client';

import { Funnel, FunnelChart, LabelList, Legend, Tooltip } from 'recharts';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltipContent,
} from '@/components/ui/chart';

const chartData = [
  { value: 1, name: '2 BHK', fill: 'hsl(var(--chart-1))' },
];

const chartConfig = {
  value: {
    label: 'Units',
  },
  '2 BHK': {
    label: '2 BHK',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig;

export function ReservedUnitsChart() {
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
