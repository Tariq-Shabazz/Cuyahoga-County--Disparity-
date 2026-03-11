import React, { useState } from 'react'
import Tab01_MBEWBE from './tabs/Tab01_MBEWBE.jsx'
import Tab02_ThreeGroup from './tabs/Tab02_ThreeGroup.jsx'
import Tab03_GSPC2020 from './tabs/Tab03_GSPC2020.jsx'
import Tab04_Sources from './tabs/Tab04_Sources.jsx'
import Tab05_GreenLine from './tabs/Tab05_GreenLine.jsx'

const TABS = [
  { id: 'tab01', label: '01 · MBE/WBE', component: Tab01_MBEWBE },
  { id: 'tab02', label: '02 · 3-Group', component: Tab02_ThreeGroup },
  { id: 'tab03', label: '03 · GSPC 2020', component: Tab03_GSPC2020 },
  { id: 'tab04', label: '04 · Sources', component: Tab04_Sources },
  { id: 'tab05', label: '05 · Green Line Project', component: Tab05_GreenLine },
]

export default function App() {
  const [activeTab, setActiveTab] = useState('tab01')
  const ActiveComponent = TABS.find(t => t.id === activeTab)?.component

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header className="app-header">
        <h1>Cuyahoga County Disparity Dashboard</h1>
        <span className="subtitle">Research &amp; Analysis by Tariq Shabazz M.P.P.</span>
      </header>

      <nav className="tab-nav" role="tablist">
        {TABS.map(tab => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeTab === tab.id}
            className={`tab-btn${activeTab === tab.id ? ' active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <main className="tab-content" role="tabpanel">
        {ActiveComponent && <ActiveComponent />}
      </main>
    </div>
  )
}
