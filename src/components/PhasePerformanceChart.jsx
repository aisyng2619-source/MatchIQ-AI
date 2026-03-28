import React from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts'

const COLORS = ['#38bdf8', '#00e5a0', '#f43f5e']

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-surface-700 border border-surface-400 rounded-xl px-3 py-2 shadow-card">
      <p className="text-xs text-slate-400 font-mono mb-1">{label}</p>
      <p className="text-sm font-display font-700 text-brand">SR: {payload[0]?.value}</p>
      <p className="text-xs text-amber-400 font-mono">Avg: {payload[1]?.value}</p>
    </div>
  )
}

export default function PhasePerformanceChart({ data = [] }) {
  return (
    <ResponsiveContainer width="100%" height={180}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }} barGap={4}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1a2233" vertical={false} />
        <XAxis
          dataKey="phase"
          tick={{ fill: '#64748b', fontSize: 11, fontFamily: 'JetBrains Mono' }}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          tick={{ fill: '#64748b', fontSize: 11, fontFamily: 'JetBrains Mono' }}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="sr" radius={[4, 4, 0, 0]} maxBarSize={32}>
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} opacity={0.85} />
          ))}
        </Bar>
        <Bar dataKey="avg" radius={[4, 4, 0, 0]} fill="#fbbf24" opacity={0.5} maxBarSize={20} />
      </BarChart>
    </ResponsiveContainer>
  )
}
