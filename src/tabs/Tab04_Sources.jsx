import React from 'react'

const sources = [
  {
    id: 1,
    org: 'Keen Independent Research',
    title: '2025 Cuyahoga County Disparity Study',
    year: '2025',
    details: 'Covers contracts FY2020–FY2024 · $506M prime spend · 5,731 contracts analyzed',
    url: 'https://fiscaloffice.cuyahogacounty.gov/',
    type: 'Disparity Study',
  },
  {
    id: 2,
    org: 'Griffin & Strong, P.C.',
    title: '2020 Cuyahoga County Disparity Study',
    year: '2020',
    details: 'Covers FY2014–FY2018 · $1.115B prime spend · All certified groups showed substantial disparity',
    url: 'https://fiscaloffice.cuyahogacounty.gov/',
    type: 'Disparity Study',
  },
  {
    id: 3,
    org: 'U.S. Census Bureau',
    title: 'American Community Survey 2019–2023, 5-Year Estimates, Table DP05',
    year: '2023',
    details: 'Cuyahoga County, Ohio (FIPS 39035) · Population and demographic characteristics',
    url: 'https://data.census.gov/',
    type: 'Census Data',
  },
  {
    id: 4,
    org: 'U.S. Supreme Court',
    title: 'City of Richmond v. J.A. Croson Co., 488 U.S. 469 (1989)',
    year: '1989',
    details: 'Legal standard for race-conscious government contracting programs · Establishes strict scrutiny and narrow-tailoring requirements',
    url: 'https://supreme.justia.com/cases/federal/us/488/469/',
    type: 'Case Law',
  },
  {
    id: 5,
    org: 'Darity, William A. Jr. & Mullen, A. Kirsten',
    title: 'From Here to Equality: Reparations for Black Americans in the Twenty-First Century',
    year: '2020',
    details: 'UNC Press, 2020 · Foundation for the Green Line Project\'s ADOS lineage framework · Defines eligibility criteria for reparative programs',
    url: 'https://uncpress.org/book/9781469654973/from-here-to-equality/',
    type: 'Academic',
  },
  {
    id: 6,
    org: 'Home Owners\' Loan Corporation (HOLC)',
    title: 'Residential Security Maps (Redlining Maps), 1935–1940',
    year: '1935–1940',
    details: 'Digital archives via Mapping Inequality, University of Richmond · HOLC grades C ("Declining") and D ("Hazardous") used in RCB certification',
    url: 'https://dsl.richmond.edu/panorama/redlining/',
    type: 'Historical Archive',
  },
  {
    id: 7,
    org: 'Cuyahoga County Fiscal Office',
    title: 'Official County Procurement and Contracting Data',
    year: 'Ongoing',
    details: 'Official county procurement and contracting data · MBE/WBE certification records and contract award databases',
    url: 'https://fiscaloffice.cuyahogacounty.gov/',
    type: 'Government Data',
  },
]

const typeColors = {
  'Disparity Study': '#1a7a4a',
  'Census Data': '#0f3460',
  'Case Law': '#6a3c9a',
  'Academic': '#c9a227',
  'Historical Archive': '#805020',
  'Government Data': '#1a5a7a',
}

export default function Tab04_Sources() {
  return (
    <div>
      <h2 className="section-title">Sources &amp; References</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '1.75rem', fontSize: '0.92rem', lineHeight: 1.7 }}>
        All data, findings, and legal frameworks presented in this dashboard are drawn from the following
        primary and secondary sources. Click any source link to visit the original.
      </p>

      {sources.map(src => (
        <div key={src.id} className="source-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap' }}>
            <div style={{ flex: 1 }}>
              <div className="source-org">{src.org}</div>
              <div className="source-title">{src.title}</div>
              <div className="source-desc">{src.details}</div>
              <a href={src.url} target="_blank" rel="noopener noreferrer">
                {src.url} ↗
              </a>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.4rem', flexShrink: 0 }}>
              <span style={{
                background: typeColors[src.type] ? `${typeColors[src.type]}33` : '#2a3a5c',
                border: `1px solid ${typeColors[src.type] || '#2a3a5c'}`,
                color: typeColors[src.type] || 'var(--text)',
                borderRadius: 999,
                padding: '0.2rem 0.65rem',
                fontSize: '0.72rem',
                fontWeight: 700,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
              }}>
                {src.type}
              </span>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{src.year}</span>
            </div>
          </div>
        </div>
      ))}

      <div className="insight-box" style={{ marginTop: '2rem' }}>
        <strong>Research Note:</strong> The disparity indices, utilization rates, and availability estimates
        presented in this dashboard are derived directly from the two commissioned disparity studies. Methodological
        details including market area definitions, industry classifications, and business availability survey
        procedures are documented within each study. All legal analysis references{' '}
        <em>Croson</em> (1989) as the controlling Supreme Court precedent for race-conscious municipal
        contracting programs.
      </div>
    </div>
  )
}
