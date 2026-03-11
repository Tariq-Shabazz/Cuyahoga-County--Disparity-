import React from 'react'

export default function Tab05_GreenLine() {
  return (
    <div>
      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, var(--green-dark) 0%, var(--accent) 100%)',
        border: '1px solid var(--green)',
        borderRadius: 10,
        padding: '2rem',
        marginBottom: '2rem',
        textAlign: 'center',
      }}>
        <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--green-light)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
          Policy Framework
        </div>
        <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#fff', marginBottom: '0.4rem' }}>
          The Green Line Project
        </h2>
        <p style={{ fontSize: '1rem', color: 'var(--gold)', fontStyle: 'italic', marginBottom: '1.25rem' }}>
          A Lineage-Based Disparity Remediation Framework
        </p>
        <p style={{ fontSize: '0.92rem', color: 'var(--text)', maxWidth: 700, margin: '0 auto', lineHeight: 1.75 }}>
          The Green Line Project introduces a dual-pillar approach to contracting equity — one designed to
          address both the specific historical injustice of American chattel slavery and the geographic legacy
          of redlining, while creating a legally defensible, evidence-based remediation structure.
        </p>
      </div>

      {/* Pillars */}
      <div className="two-col">
        {/* Pillar I */}
        <div className="pillar-card">
          <div className="pillar-title">Pillar I — ADOS Lineage</div>
          <div className="pillar-subtitle">American-Descended Business Enterprise (ABE)</div>

          <h4 style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
            Certification Criteria
          </h4>
          <ul className="criteria-list">
            <li>Business owner must be a descendant of persons enslaved in the United States prior to 1865</li>
            <li>Documentation: genealogical records, family history, or self-attestation under penalty of perjury</li>
            <li>Business must be majority-owned (&gt;51%) by qualifying ADOS individual(s)</li>
            <li>Business must be domiciled in Cuyahoga County or contracting region</li>
          </ul>

          <div className="why-matters">
            <h4>Why This Matters</h4>
            <ul>
              <li>Addresses the specific $14 trillion wealth gap created by 246 years of chattel slavery</li>
              <li>Distinguishes ADOS from recent African immigrants — who face discrimination but not this specific historical harm</li>
              <li>Creates targeted redress consistent with <em>Croson</em>'s requirement for specific evidence of past discrimination</li>
            </ul>
          </div>
        </div>

        {/* Pillar II */}
        <div className="pillar-card" style={{ borderTopColor: 'var(--gold)' }}>
          <div className="pillar-title" style={{ color: 'var(--gold)' }}>Pillar II — Redline Geography</div>
          <div className="pillar-subtitle" style={{ color: 'var(--text-muted)' }}>Redlined Community Business (RCB)</div>

          <h4 style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
            Certification Criteria
          </h4>
          <ul className="criteria-list">
            <li>Business headquartered in a census tract HOLC-graded C ("Declining") or D ("Hazardous") in 1930s–1940s redlining maps</li>
            <li>OR business owner must reside in such a census tract</li>
            <li>Provides a race-neutral supplemental mechanism for geographic equity</li>
          </ul>

          <div className="why-matters">
            <h4>Why This Matters</h4>
            <ul>
              <li>Redlined areas in Cuyahoga County — Cleveland's east side, East Cleveland, Warrensville Heights — still show concentrated poverty 80+ years later</li>
              <li>Race-neutral tier provides legal resilience if race-conscious provisions are challenged</li>
              <li>Grounded in HOLC archival maps, now digitized via Mapping Inequality (U. of Richmond)</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Legal Foundation */}
      <h3 className="section-subtitle">Legal Foundation</h3>
      <div className="legal-grid">
        <div className="legal-item">
          <h4>Croson (1989)</h4>
          <p>Requires specific, identified discrimination evidence. The GSPC 2020 and Keen 2025 studies provide exactly this — sector-specific, contemporaneous evidence of substantial disparity across all certified groups.</p>
        </div>
        <div className="legal-item">
          <h4>Narrow Tailoring</h4>
          <p>ABE and RCB certifications are narrowly tailored to specific harms: chattel slavery lineage and geographic redlining injury. Neither is a broad racial preference.</p>
        </div>
        <div className="legal-item">
          <h4>Sunset Provisions</h4>
          <p>5-year review cycles recommended. Each cycle triggers a new disparity analysis. If disparity is remediated, the program sunsets or is recalibrated accordingly.</p>
        </div>
        <div className="legal-item">
          <h4>Evidentiary Record</h4>
          <p>Two independent disparity studies spanning FY2014–FY2024, covering over $1.6B in prime contract spend, provide a robust statistical and anecdotal evidentiary record.</p>
        </div>
      </div>

      {/* Policy Goals */}
      <h3 className="section-subtitle">Policy Goals</h3>
      <div className="goal-grid">
        <div className="goal-item">
          <div className="goal-pct">25%</div>
          <div className="goal-label">Contract dollars to ABE-certified firms within 5 years</div>
        </div>
        <div className="goal-item">
          <div className="goal-pct">15%</div>
          <div className="goal-label">Contract dollars to RCB-certified firms within 5 years</div>
        </div>
        <div className="goal-item">
          <div className="goal-pct" style={{ fontSize: '1.4rem' }}>Annual</div>
          <div className="goal-label">Disparity index reporting and program recalibration</div>
        </div>
        <div className="goal-item">
          <div className="goal-pct" style={{ fontSize: '1.4rem' }}>5-yr</div>
          <div className="goal-label">Review cycles with new disparity analysis required</div>
        </div>
      </div>

      {/* Study evidence summary */}
      <h3 className="section-subtitle">Evidentiary Basis Summary</h3>
      <div className="card">
        <table className="data-table">
          <thead>
            <tr>
              <th>Study</th>
              <th>Period</th>
              <th>Spend Analyzed</th>
              <th>Key Finding</th>
              <th>Supports Green Line</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ fontWeight: 600 }}>GSPC 2020</td>
              <td>FY2014–FY2018</td>
              <td style={{ color: 'var(--gold)' }}>$1.115B</td>
              <td>All 5 groups DI &lt; 0.80</td>
              <td style={{ color: 'var(--success)', fontWeight: 700 }}>✓ ABE + RCB</td>
            </tr>
            <tr>
              <td style={{ fontWeight: 600 }}>Keen 2025</td>
              <td>FY2020–FY2024</td>
              <td style={{ color: 'var(--gold)' }}>$506M</td>
              <td>Hispanic, Asian, Native Am. DI &lt; 0.80; Black-owned over-represented</td>
              <td style={{ color: 'var(--success)', fontWeight: 700 }}>✓ RCB (+ targeted ABE review)</td>
            </tr>
            <tr>
              <td style={{ fontWeight: 600 }}>Combined Record</td>
              <td>FY2014–FY2024</td>
              <td style={{ color: 'var(--gold)' }}>$1.621B+</td>
              <td>Persistent, documented disparity across decade of contracting</td>
              <td style={{ color: 'var(--success)', fontWeight: 700 }}>✓ Strong Croson basis</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Quote */}
      <div className="quote-block">
        "Reparations are a program of acknowledgment, redress, and closure for a grievous injustice."
        <cite>— Darity &amp; Mullen, <em>From Here to Equality</em> (2020)</cite>
      </div>

      <div className="insight-box">
        <strong>Framework Summary:</strong> The Green Line Project is not a generic set-aside program. It is a
        precisely calibrated, evidence-based remediation framework that draws a clear line between general racial
        preference and specific historical injury. By grounding ABE certification in documented chattel slavery
        lineage and RCB certification in HOLC archival geography, the framework creates a legally defensible,
        morally serious, and administratively tractable path toward genuine contracting equity in Cuyahoga County.
      </div>
    </div>
  )
}
