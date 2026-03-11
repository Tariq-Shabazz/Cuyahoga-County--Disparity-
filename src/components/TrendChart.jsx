import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
} from 'recharts';
import { trendData } from '../data/disparityData';

const LINES = [
  { key: 'overall', label: 'Overall', color: '#f59e0b' },
  { key: 'construction', label: 'Construction', color: '#6366f1' },
  { key: 'professional', label: 'Professional Services', color: '#10b981' },
  { key: 'goods', label: 'Goods & Supplies', color: '#8b5cf6' },
  { key: 'services', label: 'Other Services', color: '#ec4899' },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: '#1e293b',
        border: '1px solid #334155',
        borderRadius: 8,
        padding: '10px 14px',
        color: '#f1f5f9',
        fontSize: 13,
      }}>
        <p style={{ fontWeight: 600, marginBottom: 6 }}>Year: {label}</p>
        {payload.map((entry) => (
          <p key={entry.name} style={{ color: entry.color, margin: '3px 0' }}>
            {entry.name}: <strong>{entry.value}</strong>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function TrendChart() {
  return (
    <div className="chart-card">
      <h3 className="chart-title">Disparity Index Trends (2015–2025)</h3>
      <p className="chart-subtitle">
        Average disparity index across all M/WBE groups over time — tracking progress toward parity
      </p>
      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={trendData} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="year" tick={{ fill: '#94a3b8', fontSize: 12 }} />
          <YAxis domain={[20, 90]} tick={{ fill: '#94a3b8', fontSize: 12 }} />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ color: '#94a3b8', fontSize: 13 }} />
          <ReferenceLine
            y={80}
            stroke="#f59e0b"
            strokeDasharray="6 3"
            label={{ value: 'Parity (80)', fill: '#f59e0b', fontSize: 11, position: 'insideTopRight' }}
          />
          {LINES.map((line) => (
            <Line
              key={line.key}
              type="monotone"
              dataKey={line.key}
              name={line.label}
              stroke={line.color}
              strokeWidth={2}
              dot={{ r: 4, fill: line.color }}
              activeDot={{ r: 6 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
