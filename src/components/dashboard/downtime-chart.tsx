"use client"

import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"

interface DowntimeChartProps {
    data: { name: string; downtime: number; percentage: number }[]
}

export function DowntimeChart({ data }: DowntimeChartProps) {
    return (
        <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis
                    dataKey="name"
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                />
                <YAxis
                    yAxisId="left"
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value}m`}
                />
                <YAxis
                    yAxisId="right"
                    orientation="right"
                    stroke="#82ca9d"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value}%`}
                />
                <Tooltip
                    cursor={{ stroke: '#2563eb', strokeWidth: 2 }}
                    contentStyle={{ background: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }}
                    formatter={(value: any, name: any) => {
                        if (name === 'downtime') return [`${value} min`, 'Downtime'];
                        if (name === 'percentage') return [`${value}%`, 'Impact'];
                        return [value, name];
                    }}
                />
                <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="downtime"
                    stroke="#2563eb"
                    strokeWidth={2}
                    activeDot={{ r: 8 }}
                    dot={{ r: 4, fill: '#2563eb' }}
                />
                <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="percentage"
                    stroke="#82ca9d"
                    strokeWidth={2}
                    dot={{ r: 4, fill: '#82ca9d' }}
                />
            </LineChart>
        </ResponsiveContainer>
    )
}
