import React from 'react';
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { CATEGORIES, disparityIndex2020, disparityIndex2025 } from '../data/disparityData';

export default function GroupComparisonChart() {
  const groups = ['African American', 'Hispanic American', 'Asian American', 'White Women'];

  const radarData = CATEGORIES.map((cat) => {
    const entry = { category: cat };
    groups.forEach((g) => {
      entry[`${g} 2020`] = disparityIndex2020[g][cat];
      entry[`${g} 2025`] = disparityIndex2025[g][cat];
    });
    return entry;
  });

  const colors = ['#6366f1', '#f59e0b', '#10b981', '#8b5cf6'];

  return (
    <div className="chart-card">
      <h3 className="chart-title">Cross-Group Disparity Comparison — 2025</h3>
      <p className="chart-subtitle">
        Radar view of 2025 disparity indices across all contract categories by demographic group
      </p>
      <ResponsiveContainer width="100%" height={360}>
        <RadarChart data={radarData} margin={{ top: 10, right: 40, left: 40, bottom: 10 }}>
          <PolarGrid stroke="#334155" />
          <PolarAngleAxis dataKey="category" tick={{ fill: '#94a3b8', fontSize: 12 }} />
          <PolarRadiusAxis
            angle={30}
            domain={[0, 100]}
            tick={{ fill: '#64748b', fontSize: 10 }}
          />
          <Tooltip
            contentStyle={{
              background: '#1e293b',
              border: '1px solid #334155',
              borderRadius: 8,
              color: '#f1f5f9',
              fontSize: 13,
            }}
          />
          <Legend wrapperStyle={{ color: '#94a3b8', fontSize: 12 }} />
          {groups.map((g, i) => (
            <Radar
              key={g}
              name={g}
              dataKey={`${g} 2025`}
              stroke={colors[i]}
              fill={colors[i]}
              fillOpacity={0.12}
              strokeWidth={2}
            />
          ))}
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
