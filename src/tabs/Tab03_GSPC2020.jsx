import React from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ReferenceLine, ResponsiveContainer
} from 'recharts'

const sectorData = [
  { sector: 'Construction', spend: '$682M', mbeUtil: 12.4, mbeAvail: 18.2, di: 0.68 },
  { sector: 'Professional Services', spend: '$215M', mbeUtil: 8.1, mbeAvail: 14.7, di: 0.55 },
  { sector: 'Other Services', spend: '$148M', mbeUtil: 6.3, mbeAvail: 12.8, di: 0.49 },
  { sector: 'Goods / Supplies', spend: '$70M', mbeUtil: 4.2, mbeAvail: 8.9, di: 0.47 },
]

const groupData = [
  { group: 'Black-Owned', util: 10.0, avail: 15.3, di: 0.65 },
  { group: 'Hispanic', util: 1.3, avail: 4.6, di: 0.28 },
  { group: 'Asian', util: 0.5, avail: 2.2, di: 0.23 },
  { group: 'Native American', util: 0.2, avail: 0.5, di: 0.40 },
  { group: 'Women (WBE)', util: 8.2, avail: 19.4, di: 0.42 },
]

const chartData = groupData.map(r => ({
  name: r.group,
  'Utilization %': r.util,
  'Availability %': r.avail,
  'Disparity Index': r.di,
}))

const diChartData = groupData.map(r => ({ name: r.group, di: r.di }))

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: '#1e2a42', border: '1px solid #2a3a5c', borderRadius: 6, padding: '0.75rem 1rem', fontSize: '0.82rem' }}>
        <p style={{ color: '#c9a227', fontWeight: 700, marginBottom: 4 }}>{label}</p>
        {payload.map(p => (
          <p key={p.name} style={{ color: p.color }}>
            {p.name}: <strong>{p.value}</strong>
          </p>
        ))}
      </div>
    )
  }
  return null
}

export default function Tab03_GSPC2020() {
  return (
    <div>
      <h2 className="section-title">GSPC 2020 — Griffin &amp; Strong P.C. Full Detail</h2>

      {/* Study metadata */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div className="card-header">Study Overview</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem', marginTop: '0.5rem' }}>
          {[
            { label: 'Study Period', val: 'FY2014–FY2018' },
            { label: 'Prime Contract Spend', val: '$1.115 Billion' },
            { label: 'Industry Sectors', val: '4 Major Sectors' },
            { label: 'Groups Analyzed', val: '5 Certified Groups' },
            { label: 'Result', val: 'All Groups — Substantial Disparity' },
          ].map(item => (
            <div key={item.label} className="stat-chip">
              <strong>{item.val}</strong>
              {item.label}
            </div>
          ))}
        </div>
      </div>

      {/* Sector table */}
      <h3 className="section-subtitle">By Industry Sector</h3>
      <div className="card">
        <table className="data-table">
          <thead>
            <tr>
              <th>Industry Sector</th>
              <th>Total Spend</th>
              <th>MBE Util %</th>
              <th>MBE Avail %</th>
              <th>Disparity Index</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {sectorData.map(row => (
              <tr key={row.sector}>
                <td style={{ fontWeight: 600 }}>{row.sector}</td>
                <td style={{ color: 'var(--gold)' }}>{row.spend}</td>
                <td>{row.mbeUtil}%</td>
                <td>{row.mbeAvail}%</td>
                <td className="di-low">{row.di}</td>
                <td><span className="badge badge-disparity">Substantial Disparity</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Race/ethnicity table */}
      <h3 className="section-subtitle">By Race / Ethnicity</h3>
      <div className="card">
        <table className="data-table">
          <thead>
            <tr>
              <th>Group</th>
              <th>Utilization %</th>
              <th>Availability %</th>
              <th>Disparity Index</th>
              <th>Gap (Avail − Util)</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {groupData.map(row => (
              <tr key={row.group}>
                <td style={{ fontWeight: 600 }}>{row.group}</td>
                <td>{row.util}%</td>
                <td>{row.avail}%</td>
                <td className="di-low">{row.di}</td>
                <td style={{ color: 'var(--danger)' }}>−{(row.avail - row.util).toFixed(1)}%</td>
                <td><span className="badge badge-disparity">Substantial Disparity</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Util vs Avail chart */}
      <div className="chart-container">
        <div className="chart-title">Utilization vs. Availability by Group — GSPC 2020</div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2a3a5c" />
            <XAxis dataKey="name" tick={{ fill: '#9aa3b5', fontSize: 11 }} />
            <YAxis tick={{ fill: '#9aa3b5', fontSize: 11 }} unit="%" />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ color: '#9aa3b5', fontSize: '0.82rem', paddingTop: '0.5rem' }} />
            <Bar dataKey="Availability %" fill="#0f3460" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Utilization %" fill="#1a7a4a" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* DI chart */}
      <div className="chart-container">
        <div className="chart-title">Disparity Index by Group — GSPC 2020</div>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={diChartData} margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2a3a5c" />
            <XAxis dataKey="name" tick={{ fill: '#9aa3b5', fontSize: 11 }} />
            <YAxis tick={{ fill: '#9aa3b5', fontSize: 11 }} domain={[0, 1.1]} />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine y={0.80} stroke="#e05252" strokeDasharray="5 5"
              label={{ value: 'DI 0.80 threshold', fill: '#e05252', fontSize: 10, position: 'insideTopRight' }} />
            <ReferenceLine y={1.0} stroke="#2ecc71" strokeDasharray="3 3"
              label={{ value: 'Parity (1.0)', fill: '#2ecc71', fontSize: 10, position: 'insideBottomRight' }} />
            <Bar dataKey="di" name="Disparity Index" fill="#c9a227" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="insight-box">
        <strong>Key Finding:</strong> All 5 certified groups showed substantial disparity (DI &lt; 0.80) in the
        GSPC 2020 study. Every major industry sector — from Construction ($682M) to Goods/Supplies ($70M) — showed
        significant under-utilization. This uniform finding across sectors and groups constitutes a strong
        evidentiary basis for a race-conscious contracting program under{' '}
        <em>City of Richmond v. J.A. Croson Co.</em>, 488 U.S. 469 (1989).
      </div>
    </div>
  )
}
