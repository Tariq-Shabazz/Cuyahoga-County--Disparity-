import React, { useState } from 'react';
import SummaryCards from './components/SummaryCards';
import DisparityIndexChart from './components/DisparityIndexChart';
import ContractAwardsChart from './components/ContractAwardsChart';
import TrendChart from './components/TrendChart';
import GroupComparisonChart from './components/GroupComparisonChart';
import { RACE_GROUPS } from './data/disparityData';

const TABS = ['Overview', 'Disparity Index', 'Contract Awards', 'Trends', 'Group Comparison'];

export default function App() {
  const [activeTab, setActiveTab] = useState('Overview');
  const [selectedGroup, setSelectedGroup] = useState('African American');
  const [selectedYear, setSelectedYear] = useState('2020');

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="header-inner">
          <div className="header-title-block">
            <div className="header-badge">Disparity Studies Dashboard</div>
            <h1 className="header-title">Cuyahoga County</h1>
            <p className="header-subtitle">
              Minority & Women Business Enterprise (M/WBE) Contracting Disparity Analysis — 2020 &amp; 2025
            </p>
          </div>
          <div className="header-meta">
            <p className="header-author">Research by Tariq Shabazz, M.P.P.</p>
            <p className="header-note">Data reflects county-wide procurement programs</p>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="nav">
        <div className="nav-inner">
          {TABS.map((tab) => (
            <button
              key={tab}
              className={`nav-tab ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
      </nav>

      {/* Main Content */}
      <main className="main">
        {activeTab === 'Overview' && (
          <section>
            <div className="section-header">
              <h2 className="section-title">Study Overview</h2>
              <p className="section-desc">
                Summary metrics from both the 2020 and 2025 Cuyahoga County Disparity Studies, examining M/WBE
                firm availability vs. utilization in county contracting.
              </p>
            </div>
            <SummaryCards />
            <div className="overview-grid">
              <ContractAwardsChart year="2020" />
              <ContractAwardsChart year="2025" />
            </div>
          </section>
        )}

        {activeTab === 'Disparity Index' && (
          <section>
            <div className="section-header">
              <h2 className="section-title">Disparity Index Analysis</h2>
              <p className="section-desc">
                The disparity index compares the share of contract dollars awarded to M/WBE firms against
                their market availability. An index below <strong>80</strong> indicates a statistically
                significant disparity per established federal methodology.
              </p>
            </div>
            <div className="controls-row">
              <label className="control-label">Select demographic group:</label>
              <div className="button-group">
                {RACE_GROUPS.map((g) => (
                  <button
                    key={g}
                    className={`group-btn ${selectedGroup === g ? 'active' : ''}`}
                    onClick={() => setSelectedGroup(g)}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>
            <DisparityIndexChart selectedGroup={selectedGroup} />
            <div className="info-box">
              <h4>Methodology Note</h4>
              <p>
                The disparity index is calculated as: <em>(utilization % ÷ availability %) × 100</em>.
                The availability percentage represents the share of qualified M/WBE firms in the relevant
                marketplace, while utilization represents actual contract dollars awarded. A score of 100
                indicates perfect parity.
              </p>
            </div>
          </section>
        )}

        {activeTab === 'Contract Awards' && (
          <section>
            <div className="section-header">
              <h2 className="section-title">Contract Award Distribution</h2>
              <p className="section-desc">
                Comparison of market availability (the proportion of qualified firms) versus actual contract
                dollar utilization for each M/WBE group.
              </p>
            </div>
            <div className="controls-row">
              <label className="control-label">Study year:</label>
              <div className="button-group">
                {['2020', '2025'].map((y) => (
                  <button
                    key={y}
                    className={`group-btn ${selectedYear === y ? 'active' : ''}`}
                    onClick={() => setSelectedYear(y)}
                  >
                    {y}
                  </button>
                ))}
              </div>
            </div>
            <ContractAwardsChart year={selectedYear} />
            <div className="info-box">
              <h4>Understanding the Gap</h4>
              <p>
                The gap between availability and utilization represents foregone economic opportunity for
                M/WBE businesses. Closing this gap is the primary goal of county M/WBE programs, which include
                goals-setting, outreach, and technical assistance components.
              </p>
            </div>
          </section>
        )}

        {activeTab === 'Trends' && (
          <section>
            <div className="section-header">
              <h2 className="section-title">Longitudinal Trend Analysis</h2>
              <p className="section-desc">
                Tracking the average disparity index across all M/WBE groups from 2015 to 2025, broken down
                by contract category. Rising indices indicate progress toward parity.
              </p>
            </div>
            <TrendChart />
            <div className="info-box">
              <h4>Interpreting Trends</h4>
              <p>
                Although disparity indices have improved across all categories from 2015 to 2025, all groups
                and categories remain significantly below the parity threshold of 80. Professional Services
                shows the highest indices, while Construction remains the most challenging area for M/WBE
                participation.
              </p>
            </div>
          </section>
        )}

        {activeTab === 'Group Comparison' && (
          <section>
            <div className="section-header">
              <h2 className="section-title">Cross-Group Comparison</h2>
              <p className="section-desc">
                Radar chart showing 2025 disparity indices for each demographic group across all four contract
                categories, enabling side-by-side comparison of relative disparities.
              </p>
            </div>
            <GroupComparisonChart />
            <div className="info-box">
              <h4>Key Takeaways</h4>
              <p>
                Native American-owned businesses face the most severe disparities across all categories,
                followed by African American and Hispanic American firms. Asian American firms and White
                Women-owned businesses show relatively higher indices but remain below the parity threshold.
                All groups show measurable improvement between the 2020 and 2025 studies.
              </p>
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="footer">
        <p>
          Cuyahoga County Disparity Studies Dashboard &mdash; Research by{' '}
          <strong>Tariq Shabazz, M.P.P.</strong> &mdash; Data reflects county procurement programs (2020 &amp; 2025)
        </p>
        <p style={{ fontSize: 11, marginTop: 4 }}>
          Disparity indices below 80 indicate statistically significant underutilization per federal methodology
        </p>
      </footer>
    </div>
  );
}
