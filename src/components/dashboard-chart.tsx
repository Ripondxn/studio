
'use client';

import { Bar, BarChart, CartesianGrid, Pie, PieChart, Legend, Tooltip, XAxis, YAxis, ResponsiveContainer, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';

interface DashboardChartProps {
  data: any[];
  type: 'bar' | 'pie';
}

const COLORS = ['hsl(var(--primary))', 'hsl(var(--muted))'];

export function DashboardChart({ data, type }: DashboardChartProps) {
  if (type === 'bar') {
    return (
      <div className="h-[300px] w-full">
        <ResponsiveContainer>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis tickFormatter={(value) => `$${value/1000}k`} />
            <Tooltip
              cursor={{ fill: 'hsl(var(--muted))' }}
              contentStyle={{
                  background: 'hsl(var(--background))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: 'var(--radius)',
              }}
            />
            <Bar dataKey="totalRent" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }

  if (type === 'pie') {
    return (
       <div className="h-[300px] w-full">
        <ResponsiveContainer>
            <PieChart>
            <Pie
                data={data}
                dataKey="value"
                nameKey="status"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="hsl(var(--primary))"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
                {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
            </Pie>
            <Tooltip
                 contentStyle={{
                  background: 'hsl(var(--background))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: 'var(--radius)',
              }}
            />
            <Legend />
            </PieChart>
        </ResponsiveContainer>
      </div>
    );
  }

  return null;
}
