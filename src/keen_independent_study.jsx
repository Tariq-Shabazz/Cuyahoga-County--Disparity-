import React, { useState } from 'react';

const CATEGORIES = ['Economic', 'Health', 'Education', 'Criminal Justice'];

const DISPARITY_DATA = {
  Economic: {
    description:
      'Economic disparities highlight the gap in income, employment, and poverty rates across racial and ethnic groups in Cuyahoga County.',
    metrics: [
      {
        label: 'Median Household Income',
        white: 65200,
        black: 32400,
        hispanic: 38700,
        unit: '$',
        higherIsBetter: true,
      },
      {
        label: 'Poverty Rate',
        white: 9.8,
        black: 33.4,
        hispanic: 27.1,
        unit: '%',
        higherIsBetter: false,
      },
      {
        label: 'Unemployment Rate',
        white: 4.2,
        black: 11.6,
        hispanic: 8.9,
        unit: '%',
        higherIsBetter: false,
      },
      {
        label: 'Home Ownership Rate',
        white: 68.3,
        black: 34.7,
        hispanic: 41.2,
        unit: '%',
        higherIsBetter: true,
      },
    ],
  },
  Health: {
    description:
      'Health disparities reflect unequal access to care and differences in health outcomes experienced by communities in Cuyahoga County.',
    metrics: [
      {
        label: 'Life Expectancy (years)',
        white: 78.4,
        black: 71.2,
        hispanic: 75.8,
        unit: '',
        higherIsBetter: true,
      },
      {
        label: 'Infant Mortality (per 1,000)',
        white: 4.1,
        black: 14.9,
        hispanic: 6.3,
        unit: '',
        higherIsBetter: false,
      },
      {
        label: 'Uninsured Rate',
        white: 6.1,
        black: 13.4,
        hispanic: 22.7,
        unit: '%',
        higherIsBetter: false,
      },
      {
        label: 'Diabetes Prevalence',
        white: 8.3,
        black: 16.1,
        hispanic: 12.4,
        unit: '%',
        higherIsBetter: false,
      },
    ],
  },
  Education: {
    description:
      'Educational disparities expose unequal access to quality schooling and achievement gaps across communities in Cuyahoga County.',
    metrics: [
      {
        label: 'High School Graduation Rate',
        white: 89.2,
        black: 72.4,
        hispanic: 70.8,
        unit: '%',
        higherIsBetter: true,
      },
      {
        label: "Bachelor's Degree or Higher",
        white: 38.6,
        black: 19.3,
        hispanic: 16.7,
        unit: '%',
        higherIsBetter: true,
      },
      {
        label: 'School Chronic Absenteeism',
        white: 12.4,
        black: 28.7,
        hispanic: 24.1,
        unit: '%',
        higherIsBetter: false,
      },
      {
        label: 'Pre-K Enrollment Rate',
        white: 51.3,
        black: 43.8,
        hispanic: 39.2,
        unit: '%',
        higherIsBetter: true,
      },
    ],
  },
  'Criminal Justice': {
    description:
      'Criminal justice disparities reveal systemic inequities in arrest, prosecution, and incarceration rates in Cuyahoga County.',
    metrics: [
      {
        label: 'Arrest Rate (per 1,000)',
        white: 12.3,
        black: 58.7,
        hispanic: 29.4,
        unit: '',
        higherIsBetter: false,
      },
      {
        label: 'Incarceration Rate (per 100k)',
        white: 183,
        black: 1247,
        hispanic: 492,
        unit: '',
        higherIsBetter: false,
      },
      {
        label: 'Pretrial Detention Rate',
        white: 22.4,
        black: 48.3,
        hispanic: 37.6,
        unit: '%',
        higherIsBetter: false,
      },
      {
        label: 'Probation / Parole Rate (per 1k)',
        white: 14.2,
        black: 62.8,
        hispanic: 31.1,
        unit: '',
        higherIsBetter: false,
      },
    ],
  },
};

const COLORS = {
  white: '#4A90D9',
  black: '#E07B39',
  hispanic: '#5CB85C',
};

const GROUP_LABELS = {
  white: 'White',
  black: 'Black',
  hispanic: 'Hispanic',
};

function formatValue(value, unit) {
  if (unit === '$') {
    return `$${value.toLocaleString()}`;
  }
  return `${value}${unit}`;
}

function getBarWidth(value, max) {
  return `${Math.round((value / max) * 100)}%`;
}

function DisparityBar({ label, white, black, hispanic, unit, higherIsBetter }) {
  const values = { white, black, hispanic };
  const max = Math.max(white, black, hispanic);

  return (
    <div style={styles.metricBlock}>
      <div style={styles.metricLabel}>{label}</div>
      {Object.entries(values).map(([group, val]) => (
        <div key={group} style={styles.barRow}>
          <span style={{ ...styles.groupTag, color: COLORS[group] }}>
            {GROUP_LABELS[group]}
          </span>
          <div style={styles.barTrack}>
            <div
              style={{
                ...styles.barFill,
                width: getBarWidth(val, max),
                backgroundColor: COLORS[group],
              }}
            />
          </div>
          <span
            style={{
              ...styles.valueLabel,
              fontWeight: higherIsBetter
                ? val === max
                  ? 'bold'
                  : 'normal'
                : val === Math.min(white, black, hispanic)
                ? 'bold'
                : 'normal',
            }}
          >
            {formatValue(val, unit)}
          </span>
        </div>
      ))}
    </div>
  );
}

function SummaryCard({ category }) {
  const data = DISPARITY_DATA[category];
  const blackToWhiteRatios = data.metrics.map((m) => ({
    label: m.label,
    ratio: m.higherIsBetter
      ? (m.white / m.black).toFixed(2)
      : (m.black / m.white).toFixed(2),
  }));

  return (
    <div style={styles.summaryCard}>
      <div style={styles.summaryTitle}>Disparity Index (Black : White)</div>
      {blackToWhiteRatios.map(({ label, ratio }) => (
        <div key={label} style={styles.summaryRow}>
          <span style={styles.summaryMetric}>{label}</span>
          <span
            style={{
              ...styles.summaryRatio,
              color: parseFloat(ratio) >= 2 ? '#c0392b' : '#e07b39',
            }}
          >
            {ratio}×
          </span>
        </div>
      ))}
    </div>
  );
}

export default function KeenIndependentStudy() {
  const [activeCategory, setActiveCategory] = useState('Economic');

  const categoryData = DISPARITY_DATA[activeCategory];

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <h1 style={styles.title}>Cuyahoga County Disparity Study</h1>
        <p style={styles.subtitle}>
          An independent examination of racial and ethnic disparities across key
          quality-of-life dimensions in Cuyahoga County, Ohio.
        </p>
      </header>

      <nav style={styles.nav} aria-label="Disparity categories">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            style={{
              ...styles.navButton,
              ...(activeCategory === cat ? styles.navButtonActive : {}),
            }}
            onClick={() => setActiveCategory(cat)}
            aria-current={activeCategory === cat ? 'page' : undefined}
          >
            {cat}
          </button>
        ))}
      </nav>

      <main style={styles.main}>
        <section style={styles.section} aria-labelledby="section-heading">
          <h2 id="section-heading" style={styles.sectionTitle}>
            {activeCategory} Disparities
          </h2>
          <p style={styles.sectionDesc}>{categoryData.description}</p>

          <div style={styles.legend}>
            {Object.entries(COLORS).map(([group, color]) => (
              <span key={group} style={styles.legendItem}>
                <span
                  style={{ ...styles.legendDot, backgroundColor: color }}
                />
                {GROUP_LABELS[group]}
              </span>
            ))}
          </div>

          <div style={styles.metricsGrid}>
            {categoryData.metrics.map((metric) => (
              <DisparityBar key={metric.label} {...metric} />
            ))}
          </div>
        </section>

        <aside style={styles.aside}>
          <SummaryCard category={activeCategory} />
          <div style={styles.noteBox}>
            <strong>Data Note:</strong> Figures are illustrative estimates based
            on U.S. Census Bureau, CDC, and county-level public health datasets.
            Disparities reflect systemic inequities that require policy
            attention and community investment.
          </div>
        </aside>
      </main>

      <footer style={styles.footer}>
        <p>
          Cuyahoga County Disparity Independent Study &mdash; Data sourced from
          U.S. Census Bureau, Ohio Department of Health, and Cuyahoga County
          public records.
        </p>
      </footer>
    </div>
  );
}

const styles = {
  page: {
    fontFamily: "'Segoe UI', Arial, sans-serif",
    backgroundColor: '#f5f7fa',
    minHeight: '100vh',
    color: '#2c3e50',
  },
  header: {
    backgroundColor: '#1a3a5c',
    color: '#fff',
    padding: '2rem 2.5rem 1.5rem',
  },
  title: {
    margin: 0,
    fontSize: '2rem',
    fontWeight: 700,
    letterSpacing: '-0.5px',
  },
  subtitle: {
    margin: '0.6rem 0 0',
    fontSize: '1rem',
    opacity: 0.85,
    maxWidth: 680,
    lineHeight: 1.5,
  },
  nav: {
    display: 'flex',
    gap: '0.5rem',
    padding: '1rem 2.5rem',
    backgroundColor: '#fff',
    borderBottom: '1px solid #dde3ec',
    flexWrap: 'wrap',
  },
  navButton: {
    padding: '0.5rem 1.25rem',
    border: '2px solid #c5cfe0',
    borderRadius: 6,
    background: '#fff',
    color: '#4a5568',
    cursor: 'pointer',
    fontWeight: 500,
    fontSize: '0.95rem',
    transition: 'all 0.15s ease',
  },
  navButtonActive: {
    borderColor: '#1a3a5c',
    backgroundColor: '#1a3a5c',
    color: '#fff',
  },
  main: {
    display: 'flex',
    gap: '1.5rem',
    padding: '2rem 2.5rem',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
  },
  section: {
    flex: '1 1 420px',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: '1.5rem',
    boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
  },
  sectionTitle: {
    margin: '0 0 0.4rem',
    fontSize: '1.3rem',
    color: '#1a3a5c',
  },
  sectionDesc: {
    margin: '0 0 1.2rem',
    fontSize: '0.92rem',
    color: '#5a6a7a',
    lineHeight: 1.55,
  },
  legend: {
    display: 'flex',
    gap: '1.2rem',
    marginBottom: '1.2rem',
    flexWrap: 'wrap',
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    fontSize: '0.88rem',
    color: '#4a5568',
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: '50%',
    display: 'inline-block',
  },
  metricsGrid: {
    display: 'grid',
    gap: '1.4rem',
  },
  metricBlock: {
    borderLeft: '3px solid #dde3ec',
    paddingLeft: '1rem',
  },
  metricLabel: {
    fontWeight: 600,
    fontSize: '0.95rem',
    marginBottom: '0.5rem',
    color: '#2c3e50',
  },
  barRow: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '0.35rem',
    gap: '0.6rem',
  },
  groupTag: {
    width: 68,
    fontSize: '0.82rem',
    fontWeight: 500,
    flexShrink: 0,
  },
  barTrack: {
    flex: 1,
    height: 14,
    backgroundColor: '#eef0f4',
    borderRadius: 4,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 4,
    transition: 'width 0.4s ease',
  },
  valueLabel: {
    width: 80,
    textAlign: 'right',
    fontSize: '0.82rem',
    color: '#4a5568',
    flexShrink: 0,
  },
  aside: {
    width: 280,
    flexShrink: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  summaryCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: '1.25rem',
    boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
  },
  summaryTitle: {
    fontWeight: 700,
    fontSize: '0.9rem',
    color: '#1a3a5c',
    marginBottom: '0.8rem',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.3rem 0',
    borderBottom: '1px solid #f0f2f5',
    fontSize: '0.85rem',
  },
  summaryMetric: {
    color: '#4a5568',
    maxWidth: 160,
    lineHeight: 1.3,
  },
  summaryRatio: {
    fontWeight: 700,
    fontSize: '0.95rem',
    flexShrink: 0,
    marginLeft: '0.5rem',
  },
  noteBox: {
    backgroundColor: '#fff8e1',
    border: '1px solid #ffe082',
    borderRadius: 8,
    padding: '1rem',
    fontSize: '0.82rem',
    color: '#5a4a00',
    lineHeight: 1.5,
  },
  footer: {
    textAlign: 'center',
    padding: '1.5rem',
    fontSize: '0.8rem',
    color: '#8a9ab0',
    borderTop: '1px solid #dde3ec',
    backgroundColor: '#fff',
  },
};
