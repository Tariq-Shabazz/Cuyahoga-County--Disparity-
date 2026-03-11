import React from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ReferenceLine, ResponsiveContainer, Cell
} from 'recharts'

const keen2025 = [
  { group: 'African American', util: 51.6, avail: 13.9, di: 3.71, status: 'over' },
  { group: 'Hispanic American', util: 4.3, avail: 5.7, di: 0.75, status: 'disparity' },
  { group: 'Asian American', util: 0.9, avail: 2.4, di: 0.38, status: 'disparity' },
  { group: 'Native American', util: 0.1, avail: 0.2, di: 0.50, status: 'disparity' },
  { group: 'White Women', util: 25.4, avail: 24.6, di: 1.03, status: 'ok' },
  { group: 'Overall MBE\n(excl. White Women)', util: 56.9, avail: 22.2, di: 2.56, status: 'over' },
]

const gspc2020 = [
  { group: 'Black-Owned', util: 10.0, avail: 15.3, di: 0.65, status: 'disparity' },
  { group: 'Hispanic-Owned', util: 1.3, avail: 4.6, di: 0.28, status: 'disparity' },
  { group: 'Asian-Owned', util: 0.5, avail: 2.2, di: 0.23, status: 'disparity' },
  { group: 'Native American-Owned', util: 0.2, avail: 0.5, di: 0.40, status: 'disparity' },
  { group: 'Women-Owned (WBE)', util: 8.2, avail: 19.4, di: 0.42, status: 'disparity' },
]

const chartData = [
  { name: 'African Am.', keen: 3.71 },
  { name: 'Hispanic Am.', keen: 0.75, gspc: 0.28 },
  { name: 'Asian Am.', keen: 0.38, gspc: 0.23 },
  { name: 'Native Am.', keen: 0.50, gspc: 0.40 },
  { name: 'White Women', keen: 1.03, gspc: 0.42 },
  { name: 'Black-Owned', gspc: 0.65 },
]

const diColor = (status) => {
  if (status === 'over') return '#c9a227'
  if (status === 'ok') return '#2ecc71'
  return '#e05252'
}

const StatusBadge = ({ status }) => {
  if (status === 'over') return <span className="badge badge-over">Over-Represented</span>
  if (status === 'ok') return <span className="badge badge-ok">No Disparity</span>
  return <span className="badge badge-disparity">Substantial Disparity</span>
}

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
        <p style={{ color: '#9aa3b5', marginTop: 4, fontSize: '0.75rem' }}>{'< 0.80 = Substantial Disparity'}</p>
      </div>
    )
  }
  return null
}

export default function Tab01_MBEWBE() {
  return (
    <div>
      <h2 className="section-title">MBE/WBE Study Framework — Side-by-Side Comparison</h2>

      <div className="two-col">
        {/* Keen 2025 */}
        <div className="card">
          <div className="card-header">Keen Independent Research (2025)</div>
          <div className="card-meta">
            Period: 2020–2024 &nbsp;·&nbsp; Prime Spend: $506M &nbsp;·&nbsp; Contracts: 5,731
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Group</th>
                <th>Util %</th>
                <th>Avail %</th>
                <th>DI</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {keen2025.map(row => (
                <tr key={row.group}>
                  <td>{row.group}</td>
                  <td>{row.util}%</td>
                  <td>{row.avail}%</td>
                  <td className={row.status === 'disparity' ? 'di-low' : row.status === 'over' ? 'di-high' : 'di-ok'}>
                    {row.di}
                  </td>
                  <td><StatusBadge status={row.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
            * Disparity Index = Utilization % ÷ Availability % &nbsp;·&nbsp; DI &lt; 0.80 = Substantial Disparity
          </p>
        </div>

        {/* GSPC 2020 */}
        <div className="card">
          <div className="card-header">Griffin &amp; Strong P.C. (2020)</div>
          <div className="card-meta">
            Period: FY2014–FY2018 &nbsp;·&nbsp; Prime Spend: $1.115B
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Group</th>
                <th>Util %</th>
                <th>Avail %</th>
                <th>DI</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {gspc2020.map(row => (
                <tr key={row.group}>
                  <td>{row.group}</td>
                  <td>{row.util}%</td>
                  <td>{row.avail}%</td>
                  <td className="di-low">{row.di}</td>
                  <td><StatusBadge status={row.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
            * All certified groups showed substantial disparity in GSPC 2020.
          </p>
        </div>
      </div>

      {/* Chart */}
      <div className="chart-container">
        <div className="chart-title">Disparity Index Comparison — Keen 2025 vs. GSPC 2020</div>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2a3a5c" />
            <XAxis dataKey="name" tick={{ fill: '#9aa3b5', fontSize: 11 }} />
            <YAxis tick={{ fill: '#9aa3b5', fontSize: 11 }} domain={[0, 4.2]} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ color: '#9aa3b5', fontSize: '0.82rem', paddingTop: '0.5rem' }} />
            <ReferenceLine y={0.80} stroke="#e05252" strokeDasharray="5 5" label={{ value: 'DI 0.80 threshold', fill: '#e05252', fontSize: 10 }} />
            <ReferenceLine y={1.0} stroke="#2ecc71" strokeDasharray="3 3" label={{ value: 'Parity (1.0)', fill: '#2ecc71', fontSize: 10 }} />
            <Bar dataKey="keen" name="Keen 2025" fill="#1a7a4a" radius={[4, 4, 0, 0]} />
            <Bar dataKey="gspc" name="GSPC 2020" fill="#0f3460" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="insight-box">
        <strong>Key Observation:</strong> The Keen 2025 study shows African American-owned firms at a disparity
        index of 3.71 — substantially over-represented relative to availability — while Hispanic, Asian, and
        Native American firms remain well below the 0.80 threshold. The GSPC 2020 study paints a more uniform
        picture of disparity, with <em>all five certified groups</em> showing substantial under-utilization.
      </div>
    </div>
  )
}
