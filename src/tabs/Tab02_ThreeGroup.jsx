import React from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ReferenceLine, ResponsiveContainer
} from 'recharts'

const keen2025Groups = [
  {
    group: 'Group A — White Women',
    util: 25.4,
    avail: 24.6,
    di: 1.03,
    status: 'ok',
    desc: 'Dominant beneficiary group alongside majority-owned firms',
  },
  {
    group: 'Group B — Black-Owned',
    util: 51.6,
    avail: 13.9,
    di: 3.71,
    status: 'over',
    desc: 'Most historically disadvantaged — yet over-represented in 2025 data',
  },
  {
    group: 'Group C — Remaining MBE',
    util: 5.3,
    avail: 8.3,
    di: 0.64,
    status: 'disparity',
    desc: 'Hispanic, Asian, Native American — substantially under-represented',
  },
]

const gspc2020Groups = [
  { group: 'White Women (WBE)', util: 8.2, avail: 19.4, di: 0.42, status: 'disparity' },
  { group: 'Black-Owned', util: 10.0, avail: 15.3, di: 0.65, status: 'disparity' },
  { group: 'Other MBE', util: 2.0, avail: 7.3, di: 0.27, status: 'disparity' },
]

const chartData = [
  { name: 'White Women / WBE', keen: 1.03, gspc: 0.42 },
  { name: 'Black-Owned', keen: 3.71, gspc: 0.65 },
  { name: 'Other MBE', keen: 0.64, gspc: 0.27 },
]

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

const GroupCard = ({ row }) => {
  const borderColor = row.status === 'over' ? '#c9a227' : row.status === 'ok' ? '#2ecc71' : '#e05252'
  return (
    <div style={{
      background: 'var(--card-bg)',
      border: `1px solid var(--border)`,
      borderTop: `3px solid ${borderColor}`,
      borderRadius: 8,
      padding: '1.25rem',
    }}>
      <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--text)', marginBottom: '0.35rem' }}>
        {row.group}
      </div>
      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
        {row.desc}
      </div>
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
        <div className="stat-chip"><strong>{row.util}%</strong>Utilization</div>
        <div className="stat-chip"><strong>{row.avail}%</strong>Availability</div>
        <div className="stat-chip"><strong style={{ color: borderColor }}>{row.di}</strong>DI</div>
      </div>
      <StatusBadge status={row.status} />
    </div>
  )
}

export default function Tab02_ThreeGroup() {
  return (
    <div>
      <h2 className="section-title">3-Group Analytical Framework</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.92rem', lineHeight: 1.7 }}>
        Tariq Shabazz's framework segments the MBE/WBE universe into three analytically distinct groups,
        exposing how aggregate metrics can mask fundamentally different underlying conditions.
      </p>

      {/* Keen 2025 */}
      <h3 className="section-subtitle">Keen 2025 — 3-Group Analysis</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        {keen2025Groups.map(row => <GroupCard key={row.group} row={row} />)}
      </div>

      <div className="insight-box">
        <strong>Key Insight:</strong> In the 2025 study, Black-owned firms are over-represented relative to
        availability (DI 3.71). This masks <strong>substantial under-representation</strong> of Hispanic, Asian,
        and Native American firms (Group C, DI 0.64). The aggregate "MBE" metric of 56.9% is driven entirely by
        Group B's over-representation — making it a misleading headline figure for policy purposes.
      </div>

      {/* GSPC 2020 */}
      <h3 className="section-subtitle">GSPC 2020 — 3-Group Analysis</h3>
      <table className="data-table" style={{ marginBottom: '1.5rem' }}>
        <thead>
          <tr>
            <th>Group</th>
            <th>Utilization %</th>
            <th>Availability %</th>
            <th>Disparity Index</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {gspc2020Groups.map(row => (
            <tr key={row.group}>
              <td style={{ fontWeight: 600 }}>{row.group}</td>
              <td>{row.util}%</td>
              <td>{row.avail}%</td>
              <td className="di-low">{row.di}</td>
              <td><StatusBadge status={row.status} /></td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Chart */}
      <div className="chart-container">
        <div className="chart-title">3-Group Disparity Index — Keen 2025 vs. GSPC 2020</div>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2a3a5c" />
            <XAxis dataKey="name" tick={{ fill: '#9aa3b5', fontSize: 11 }} />
            <YAxis tick={{ fill: '#9aa3b5', fontSize: 11 }} domain={[0, 4.2]} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ color: '#9aa3b5', fontSize: '0.82rem', paddingTop: '0.5rem' }} />
            <ReferenceLine y={0.80} stroke="#e05252" strokeDasharray="5 5"
              label={{ value: 'DI 0.80 threshold', fill: '#e05252', fontSize: 10, position: 'insideTopRight' }} />
            <ReferenceLine y={1.0} stroke="#2ecc71" strokeDasharray="3 3"
              label={{ value: 'Parity (1.0)', fill: '#2ecc71', fontSize: 10, position: 'insideBottomRight' }} />
            <Bar dataKey="keen" name="Keen 2025" fill="#1a7a4a" radius={[4, 4, 0, 0]} />
            <Bar dataKey="gspc" name="GSPC 2020" fill="#0f3460" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="insight-box">
        <strong>Analytical Conclusion:</strong> Across both studies, the 3-Group framework reveals that no single
        group tells the complete story. The 2020 study shows uniform disparity across all groups — demanding
        race-conscious remediation. The 2025 data's Black-owned over-representation warrants investigation into
        concentration of awards, set-aside program design, and whether Group C firms are being structurally
        excluded from certification pipelines.
      </div>
    </div>
  )
}
