'use client';

import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface GradeTrendProps {
  data: { week: string; grade: number }[];
  color?: string;
  height?: number;
  showAxis?: boolean;
}

export default function GradeTrend({
  data,
  color = '#6366f1',
  height = 80,
  showAxis = false,
}: GradeTrendProps) {
  if (!data || data.length === 0) return null;

  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
          {showAxis && (
            <>
              <XAxis
                dataKey="week"
                tick={{ fontSize: 10, fill: '#94a3b8' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                domain={[0, 100]}
                tick={{ fontSize: 10, fill: '#94a3b8' }}
                axisLine={false}
                tickLine={false}
                width={30}
              />
            </>
          )}
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(15, 23, 42, 0.9)',
              border: 'none',
              borderRadius: '8px',
              color: '#fff',
              fontSize: '12px',
              padding: '6px 10px',
            }}
            formatter={(value: number) => [`${value}%`, 'Grade']}
          />
          <Line
            type="monotone"
            dataKey="grade"
            stroke={color}
            strokeWidth={2}
            dot={{ r: 3, fill: color, strokeWidth: 0 }}
            activeDot={{ r: 5, fill: color, strokeWidth: 2, stroke: '#fff' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
