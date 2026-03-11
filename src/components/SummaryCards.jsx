import React from 'react';
import { keyFindings } from '../data/disparityData';

const DISPARITY_THRESHOLD = 80;

function StatCard({ label, value, sub, highlight }) {
  return (
    <div style={{
      background: '#1e293b',
      borderRadius: 10,
      padding: '16px 20px',
      minWidth: 140,
      flex: 1,
      borderLeft: `4px solid ${highlight || '#6366f1'}`,
    }}>
      <div style={{ fontSize: 22, fontWeight: 700, color: '#f1f5f9', marginBottom: 4 }}>{value}</div>
      <div style={{ fontSize: 12, color: '#94a3b8' }}>{label}</div>
      {sub && <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>{sub}</div>}
    </div>
  );
}

export default function SummaryCards() {
  const f2020 = keyFindings[0];
  const f2025 = keyFindings[1];

  const indexChange = f2025.overallDisparityIndex - f2020.overallDisparityIndex;
  const indexColor = indexChange > 0 ? '#10b981' : '#ef4444';

  return (
    <div className="summary-section">
      {[f2020, f2025].map((f) => (
        <div key={f.year} className="summary-year-block">
          <h3 className="summary-year-label">{f.year} Study</h3>
          <div className="summary-cards-row">
            <StatCard
              label="Total Contracts Analyzed"
              value={f.totalContractsAnalyzed}
              highlight="#6366f1"
            />
            <StatCard
              label="M/WBE Utilization Rate"
              value={f.mwbeUtilizationRate}
              sub="Share of contract dollars awarded"
              highlight="#10b981"
            />
            <StatCard
              label="M/WBE Availability Rate"
              value={f.mwbeAvailabilityRate}
              sub="Market share of qualified firms"
              highlight="#f59e0b"
            />
            <StatCard
              label="Overall Disparity Index"
              value={f.overallDisparityIndex}
              sub={f.overallDisparityIndex < DISPARITY_THRESHOLD ? '⚠ Significant disparity' : '✓ Near parity'}
              highlight={f.overallDisparityIndex < DISPARITY_THRESHOLD ? '#ef4444' : '#10b981'}
            />
          </div>
          <div style={{ marginTop: 10 }}>
            <span style={{ fontSize: 12, color: '#94a3b8' }}>Groups with significant disparity: </span>
            {f.significantDisparityGroups.map((g) => (
              <span key={g} style={{
                display: 'inline-block',
                background: '#ef4444',
                color: '#fff',
                borderRadius: 4,
                padding: '2px 8px',
                fontSize: 11,
                marginRight: 6,
                marginTop: 4,
              }}>{g}</span>
            ))}
          </div>
        </div>
      ))}
      <div className="summary-year-block" style={{ background: '#0f172a' }}>
        <h3 className="summary-year-label" style={{ color: '#f59e0b' }}>Change: 2020 → 2025</h3>
        <div className="summary-cards-row">
          <StatCard
            label="Disparity Index Change"
            value={`+${indexChange}`}
            sub="Improvement in overall parity"
            highlight={indexColor}
          />
          <StatCard
            label="Utilization Rate Change"
            value={`+${(parseFloat(f2025.mwbeUtilizationRate) - parseFloat(f2020.mwbeUtilizationRate)).toFixed(1)}%`}
            sub="More contract dollars reaching M/WBEs"
            highlight="#10b981"
          />
          <StatCard
            label="Contracts Analyzed"
            value="+$0.7B"
            sub="Growth in county contract portfolio"
            highlight="#6366f1"
          />
        </div>
      </div>
    </div>
  );
}
