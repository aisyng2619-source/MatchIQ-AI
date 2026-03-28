import React from 'react'
import { modeColor } from '../utils/helpers'

export default function OverDecisionCard({ decisions = [] }) {
  return (
    <div className="space-y-3">
      {decisions.map((item, i) => {
        const mc = modeColor(item.mode)
        return (
          <div
            key={i}
            className="bg-surface-600 border border-surface-400 rounded-xl p-4 card-hover"
          >
            <div className="flex items-center justify-between gap-3 mb-2">
              <span className="font-mono text-xs text-slate-400">{item.over}</span>
              <span className={`text-xs font-mono px-2.5 py-1 rounded-full border font-600 ${mc}`}>
                {item.mode}
              </span>
            </div>
            <p className="text-sm text-slate-200 leading-relaxed font-body">{item.decision}</p>
          </div>
        )
      })}
    </div>
  )
}
