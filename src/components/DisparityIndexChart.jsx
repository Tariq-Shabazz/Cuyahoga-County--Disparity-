import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
} from 'recharts';
import { CATEGORIES, disparityIndex2020, disparityIndex2025, RACE_GROUPS } from '../data/disparityData';

const COLORS_2020 = '#6366f1';
const COLORS_2025 = '#10b981';
const DISPARITY_THRESHOLD = 80;

function buildChartData(group) {
  return CATEGORIES.map((cat) => ({
    category: cat,
    '2020': disparityIndex2020[group][cat],
    '2025': disparityIndex2025[group][cat],
  }));
}

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
        <p style={{ fontWeight: 600, marginBottom: 6 }}>{label}</p>
        {payload.map((entry) => (
          <p key={entry.name} style={{ color: entry.color, margin: '3px 0' }}>
            {entry.name}: <strong>{entry.value}</strong>
            {entry.value < DISPARITY_THRESHOLD ? (
              <span style={{ color: '#f87171', marginLeft: 6, fontSize: 11 }}>⚠ Significant Disparity</span>
            ) : (
              <span style={{ color: '#4ade80', marginLeft: 6, fontSize: 11 }}>✓ Near Parity</span>
            )}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function DisparityIndexChart({ selectedGroup }) {
  const data = buildChartData(selectedGroup);

  return (
    <div className="chart-card">
      <h3 className="chart-title">Disparity Index by Category — {selectedGroup}</h3>
      <p className="chart-subtitle">
        Index below <strong>80</strong> indicates statistically significant disparity in contract utilization
      </p>
      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="category" tick={{ fill: '#94a3b8', fontSize: 12 }} />
          <YAxis domain={[0, 120]} tick={{ fill: '#94a3b8', fontSize: 12 }} />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ color: '#94a3b8', fontSize: 13 }} />
          <ReferenceLine
            y={DISPARITY_THRESHOLD}
            stroke="#f59e0b"
            strokeDasharray="6 3"
            label={{ value: 'Parity Threshold (80)', fill: '#f59e0b', fontSize: 11, position: 'insideTopRight' }}
          />
          <Bar dataKey="2020" fill={COLORS_2020} radius={[4, 4, 0, 0]} />
          <Bar dataKey="2025" fill={COLORS_2025} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
