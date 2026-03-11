import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { contractAwards2020, contractAwards2025 } from '../data/disparityData';

const MWBEColors = {
  'African American': '#6366f1',
  'Hispanic American': '#f59e0b',
  'Asian American': '#10b981',
  'Native American': '#ef4444',
  'White Women': '#8b5cf6',
  'Non-M/WBE': '#475569',
};

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
            {entry.name}: <strong>{entry.value.toFixed(1)}%</strong>
          </p>
        ))}
        {payload.length === 2 && (
          <p style={{ color: '#94a3b8', marginTop: 6, fontSize: 11 }}>
            Gap: <strong style={{ color: Math.abs(payload[0].value - payload[1].value) > 3 ? '#f87171' : '#94a3b8' }}>
              {Math.abs(payload[0].value - payload[1].value).toFixed(1)}%
            </strong>
          </p>
        )}
      </div>
    );
  }
  return null;
};

export default function ContractAwardsChart({ year }) {
  const data = year === '2020' ? contractAwards2020 : contractAwards2025;

  const chartData = data
    .filter((d) => d.group !== 'Non-M/WBE')
    .map((d) => ({
      group: d.group,
      Availability: d.availability,
      Utilization: d.utilization,
    }));

  return (
    <div className="chart-card">
      <h3 className="chart-title">Availability vs. Utilization — {year} Study</h3>
      <p className="chart-subtitle">
        Percentage of total contract dollars: market availability compared to actual award utilization
      </p>
      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 40 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis
            dataKey="group"
            tick={{ fill: '#94a3b8', fontSize: 11 }}
            angle={-20}
            textAnchor="end"
            interval={0}
          />
          <YAxis
            tick={{ fill: '#94a3b8', fontSize: 12 }}
            tickFormatter={(v) => `${v}%`}
            domain={[0, 25]}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ color: '#94a3b8', fontSize: 13, paddingTop: 8 }} />
          <Bar dataKey="Availability" fill="#6366f1" radius={[4, 4, 0, 0]} />
          <Bar dataKey="Utilization" fill="#10b981" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
