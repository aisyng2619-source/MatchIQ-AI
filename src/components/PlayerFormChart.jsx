import React from 'react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-surface-700 border border-surface-400 rounded-xl px-3 py-2 shadow-card">
      <p className="text-xs text-slate-400 font-mono mb-1">Innings {label}</p>
      <p className="text-sm font-display font-700 text-brand">{payload[0]?.value} runs</p>
      {payload[1] && (
        <p className="text-xs text-amber-400 font-mono">SR: {payload[1]?.value}</p>
      )}
    </div>
  )
}

export default function PlayerFormChart({ data = [] }) {
  return (
    <ResponsiveContainer width="100%" height={180}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="runsGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor="#00e5a0" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#00e5a0" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#1a2233" vertical={false} />
        <XAxis
          dataKey="innings"
          tick={{ fill: '#64748b', fontSize: 11, fontFamily: 'JetBrains Mono' }}
          tickLine={false}
          axisLine={false}
          label={{ value: 'Innings', position: 'insideBottom', offset: -2, fill: '#475569', fontSize: 10 }}
        />
        <YAxis
          tick={{ fill: '#64748b', fontSize: 11, fontFamily: 'JetBrains Mono' }}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip content={<CustomTooltip />} />
        <Area
          type="monotone"
          dataKey="runs"
          stroke="#00e5a0"
          strokeWidth={2}
          fill="url(#runsGrad)"
          dot={{ fill: '#00e5a0', r: 4, strokeWidth: 0 }}
          activeDot={{ r: 6, fill: '#00e5a0', stroke: '#07090f', strokeWidth: 2 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
