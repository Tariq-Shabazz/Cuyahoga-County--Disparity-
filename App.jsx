import { useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, ReferenceLine
} from "recharts";

// ═══════════════════════════════════════════════════════════════════════════════
// DATA — KEEN 2025  (exact figures from uploaded PDF)
// CuyahogaCounty_FinalSummaryReport_10292025.pdf
// Disparity Index = (Utilization ÷ Availability) × 100  [Fig. 27, p.53]
// <80 = Substantial Disparity  |  80–99 = Mild  |  ≥100 = Parity
// ═══════════════════════════════════════════════════════════════════════════════

// Fig. 27 — Overall (prime + subcontracts)
const KEEN_OVERALL = [
  { id:"black",    label:"Black American",   cat:"black",      util:7.01,  avail:15.92, idx:44,  dollars:35523,  n:257  },
  { id:"asian",    label:"Asian American",   cat:"asian",      util:0.72,  avail:0.72,  idx:101, dollars:3649,   n:46   },
  { id:"hispanic", label:"Hispanic American",cat:"hispanic",   util:1.04,  avail:1.84,  idx:57,  dollars:5284,   n:92   },
  { id:"indian",   label:"American Indian",  cat:"indian",     util:0.01,  avail:0.39,  idx:1,   dollars:28,     n:1    },
  { id:"mena",     label:"MENA American",    cat:"mena",       util:0.27,  avail:0.92,  idx:29,  dollars:1359,   n:22   },
  { id:"wbe",      label:"White Woman-Owned",cat:"whiteWomen", util:11.94, avail:12.81, idx:93,  dollars:60451,  n:816  },
  { id:"majority", label:"Majority-Owned",   cat:"majority",   util:79.01, avail:67.39, idx:117, dollars:400115, n:4497 },
];

// Fig. 28 — Construction
const KEEN_CONSTRUCTION = [
  { id:"black",    label:"Black American",   cat:"black",      util:10.04, avail:17.08, idx:59  },
  { id:"asian",    label:"Asian American",   cat:"asian",      util:0.99,  avail:0.22,  idx:200 },
  { id:"hispanic", label:"Hispanic American",cat:"hispanic",   util:1.31,  avail:0.47,  idx:200 },
  { id:"indian",   label:"American Indian",  cat:"indian",     util:0.01,  avail:0.16,  idx:8   },
  { id:"mena",     label:"MENA American",    cat:"mena",       util:0.04,  avail:0.28,  idx:14  },
  { id:"wbe",      label:"White Woman-Owned",cat:"whiteWomen", util:12.25, avail:9.36,  idx:131 },
  { id:"majority", label:"Majority-Owned",   cat:"majority",   util:75.35, avail:72.41, idx:104 },
];

// Fig. 31 — Professional Services
const KEEN_PROFSVCS = [
  { id:"black",    label:"Black American",   cat:"black",      util:5.44,  avail:13.79, idx:39  },
  { id:"asian",    label:"Asian American",   cat:"asian",      util:0.86,  avail:0.63,  idx:135 },
  { id:"hispanic", label:"Hispanic American",cat:"hispanic",   util:0.64,  avail:4.21,  idx:15  },
  { id:"indian",   label:"American Indian",  cat:"indian",     util:0.00,  avail:0.27,  idx:0   },
  { id:"mena",     label:"MENA American",    cat:"mena",       util:0.18,  avail:0.68,  idx:27  },
  { id:"wbe",      label:"White Woman-Owned",cat:"whiteWomen", util:12.13, avail:11.82, idx:103 },
  { id:"majority", label:"Majority-Owned",   cat:"majority",   util:80.76, avail:68.58, idx:118 },
];

// Fig. 34 — Goods
const KEEN_GOODS = [
  { id:"black",    label:"Black American",   cat:"black",      util:5.38,  avail:13.18, idx:41  },
  { id:"asian",    label:"Asian American",   cat:"asian",      util:0.41,  avail:0.55,  idx:75  },
  { id:"hispanic", label:"Hispanic American",cat:"hispanic",   util:0.48,  avail:2.37,  idx:20  },
  { id:"indian",   label:"American Indian",  cat:"indian",     util:0.00,  avail:0.19,  idx:0   },
  { id:"mena",     label:"MENA American",    cat:"mena",       util:1.15,  avail:3.33,  idx:35  },
  { id:"wbe",      label:"White Woman-Owned",cat:"whiteWomen", util:6.16,  avail:19.75, idx:31  },
  { id:"majority", label:"Majority-Owned",   cat:"majority",   util:86.42, avail:60.64, idx:143 },
];

// Fig. 35 — Other Services
const KEEN_OTHER = [
  { id:"black",    label:"Black American",   cat:"black",      util:2.16,  avail:19.23, idx:11  },
  { id:"asian",    label:"Asian American",   cat:"asian",      util:0.05,  avail:2.62,  idx:2   },
  { id:"hispanic", label:"Hispanic American",cat:"hispanic",   util:1.58,  avail:1.65,  idx:95  },
  { id:"indian",   label:"American Indian",  cat:"indian",     util:0.00,  avail:1.56,  idx:0   },
  { id:"mena",     label:"MENA American",    cat:"mena",       util:0.00,  avail:0.24,  idx:0   },
  { id:"wbe",      label:"White Woman-Owned",cat:"whiteWomen", util:18.00, avail:16.39, idx:110 },
  { id:"majority", label:"Majority-Owned",   cat:"majority",   util:78.21, avail:58.32, idx:134 },
];

const INDUSTRY_SETS = [
  { key:"overall",      label:"Overall",        fig:"27", page:53, data:KEEN_OVERALL      },
  { key:"construction", label:"Construction",   fig:"28", page:54, data:KEEN_CONSTRUCTION },
  { key:"profsvcs",     label:"Prof. Services", fig:"31", page:57, data:KEEN_PROFSVCS     },
  { key:"goods",        label:"Goods",          fig:"34", page:60, data:KEEN_GOODS        },
  { key:"other",        label:"Other Services", fig:"35", page:61, data:KEEN_OTHER        },
];

// ═══════════════════════════════════════════════════════════════════════════════
// DATA — GSPC 2020  (from GSPC 2020 report)
// ═══════════════════════════════════════════════════════════════════════════════
const GSPC_AVAIL = {
  construction:  { black:14.87, asian:2.84, hispanic:3.41, indian:0.11, wbe:17.14, totalMBE:21.23, totalMWBE:41.20 },
  profServices:  { black:8.43,  asian:1.83, hispanic:0.95, indian:0.00, wbe:6.67,  totalMBE:11.22, totalMWBE:19.06 },
  otherServices: { black:7.36,  asian:1.72, hispanic:1.06, indian:0.00, wbe:5.96,  totalMBE:10.14, totalMWBE:17.16 },
  ae:            { black:7.52,  asian:7.52, hispanic:1.31, indian:0.00, wbe:10.46, totalMBE:16.34, totalMWBE:28.10 },
  goods:         { black:4.29,  asian:0.69, hispanic:0.51, indian:0.06, wbe:4.94,  totalMBE:5.54,  totalMWBE:10.71 },
};
const GSPC_UTIL = {
  construction:  { black:0.38, asian:0.78, hispanic:0.00, indian:0.00, wbe:6.18,  totalMBE:1.16, totalMWBE:7.34  },
  profServices:  { black:0.02, asian:0.03, hispanic:0.00, indian:0.00, wbe:0.12,  totalMBE:0.05, totalMWBE:0.17  },
  otherServices: { black:0.52, asian:0.42, hispanic:0.14, indian:0.00, wbe:15.80, totalMBE:1.07, totalMWBE:16.87 },
  ae:            { black:2.91, asian:3.14, hispanic:0.00, indian:0.00, wbe:0.00,  totalMBE:6.05, totalMWBE:6.05  },
  goods:         { black:0.28, asian:0.36, hispanic:0.07, indian:0.00, wbe:2.67,  totalMBE:0.71, totalMWBE:3.38  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// DESIGN SYSTEM — POLICY BROADSHEET
// Aesthetic: Institutional authority. Think federal research brief meets The Economist.
// Warm ivory paper · deep charcoal ink · burgundy + antique gold accents
// Fonts: Playfair Display (headlines) · IBM Plex Sans (body) · IBM Plex Mono (data)
// ═══════════════════════════════════════════════════════════════════════════════
const C = {
  // Paper surfaces
  bg:        "#F2EDE3",   // warm ivory — aged document paper
  bgStripe:  "#EDE7DB",   // alternating row tint
  card:      "#F8F4ED",   // lifted card
  cardSunk:  "#E8E2D6",   // recessed / header areas
  border:    "#C8BFAA",   // warm rule
  borderFine:"#DDD5C4",   // hairline rule

  // Ink
  ink:       "#1C1710",   // near-black charcoal
  inkMid:    "#4A4235",   // body copy
  inkLight:  "#7A7060",   // captions / labels
  inkFaint:  "#A89E8E",   // very faint — metadata

  // Accent — policy instrument colors
  burgundy:  "#6B1A2A",   // authority / urgency — alert
  burgundyBg:"#F5ECED",   // burgundy tinted background
  gold:      "#8A6B20",   // distinction / data callout
  goldBg:    "#F6F0E4",   // gold tinted background
  slate:     "#1E3D5C",   // links / reference / keen
  slateBg:   "#EAF0F6",   // slate tinted background
  forest:    "#1E4D30",   // green line / GSPC
  forestBg:  "#E8F2EC",   // forest tinted

  // Data group colors — print-ink palette, readable on ivory
  black:       "#1E3D5C",   // steel blue for Black American group
  blackDark:   "#0F2238",
  whiteWomen:  "#8A6B20",   // antique gold for WBE
  whiteWomenDark:"#5A4510",
  majority:    "#5C5248",   // warm gray for majority
  majorityDark:"#3A3228",
  hispanic:    "#7A3018",   // terracotta
  asian:       "#1E5858",   // deep teal
  indian:      "#6A4818",   // warm brown
  mena:        "#6A3A28",   // copper clay
  remainingMBE:"#7A3018",

  // Status
  parity:    "#1E4D30",   // forest green
  parityBg:  "#E8F2EC",
  alert:     "#6B1A2A",   // burgundy
  alertBg:   "#F5ECED",
  warn:      "#8A6B20",   // gold
  warnBg:    "#F6F0E4",

  method:    "#3A2A6A",   // indigo — methodology
  gspc:      "#1E4D30",   // forest — GSPC study
  keen:      "#1E3D5C",   // slate — Keen study
};

const CAT_COLOR = {
  black:C.black, asian:C.asian, hispanic:C.hispanic,
  indian:C.indian, mena:C.mena, whiteWomen:C.whiteWomen, majority:C.majority
};

// ═══════════════════════════════════════════════════════════════════════════════
// SHARED COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════

const Label = ({ ch, col, sz=9 }) => (
  <span style={{
    fontFamily:"'IBM Plex Mono',monospace", fontSize:sz,
    color:col||C.inkLight, letterSpacing:"0.06em", textTransform:"uppercase"
  }}>{ch}</span>
);

const idxColor  = (i) => i >= 100 ? C.parity  : i < 80 ? C.alert  : C.warn;
const idxBgColor= (i) => i >= 100 ? C.parityBg: i < 80 ? C.alertBg: C.warnBg;

const Badge = ({ idx }) => {
  const n   = idx >= 200 ? "200+" : idx;
  const col = idxColor(idx);
  const bg  = idxBgColor(idx);
  return (
    <span style={{
      background:bg, color:col, padding:"2px 8px", borderRadius:3,
      fontSize:8, fontFamily:"'IBM Plex Mono',monospace", fontWeight:600,
      border:`1px solid ${col}40`, whiteSpace:"nowrap"
    }}>
      {idx >= 100 ? "Parity" : idx < 80 ? "Substantial" : "Mild"} · {n}
    </span>
  );
};

const Tip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background:C.card, border:`1px solid ${C.border}`, borderRadius:6,
      padding:"10px 14px", fontFamily:"'IBM Plex Mono',monospace", fontSize:10,
      boxShadow:"0 4px 20px rgba(0,0,0,0.12)"
    }}>
      <div style={{ color:C.ink, fontWeight:700, marginBottom:6,
        fontFamily:"'IBM Plex Sans',sans-serif" }}>{label}</div>
      {payload.map((p,i) => (
        <div key={i} style={{ color:C.inkMid, marginBottom:3 }}>
          <span style={{ color:p.color||C.inkLight }}>{p.name}:</span>{" "}
          <strong style={{ color:C.ink }}>
            {typeof p.value === "number" ? p.value.toFixed(2)+"%" : p.value}
          </strong>
        </div>
      ))}
    </div>
  );
};

const KEEN_PDF_PATH = "https://uploadfile.anthropic.com/CuyahogaCounty_FinalSummaryReport_10292025.pdf";

const PDFLink = ({ page="", compact=false }) => {
  const lbl = page ? `Keen 2025 — p.${page}` : "Keen 2025 Study (PDF)";
  return (
    <span
      title={`Keen Independent 2025 Cuyahoga County Disparity Study${page ? " · page " + page : ""}`}
      style={{
        display:"inline-flex", alignItems:"center", gap:5,
        background:C.slateBg, border:`1px solid ${C.slate}40`,
        borderRadius:3, padding:compact?"2px 8px":"3px 11px", cursor:"default"
      }}>
      <span style={{ fontSize:compact?7:9, color:C.slate,
        fontFamily:"'IBM Plex Mono',monospace", letterSpacing:"0.04em" }}>
        ↗ {lbl}
      </span>
    </span>
  );
};

const WebLink = ({ url, label, compact=false }) => (
  <a href={url} target="_blank" rel="noopener noreferrer"
    style={{
      display:"inline-flex", alignItems:"center", gap:4,
      background:C.slateBg, border:`1px solid ${C.slate}40`,
      borderRadius:3, padding:compact?"2px 7px":"3px 10px", textDecoration:"none"
    }}
    onMouseEnter={e=>{ e.currentTarget.style.background=C.slate; e.currentTarget.querySelector("span").style.color="#fff"; }}
    onMouseLeave={e=>{ e.currentTarget.style.background=C.slateBg; e.currentTarget.querySelector("span").style.color=C.slate; }}>
    <span style={{ fontSize:compact?7:8, color:C.slate,
      fontFamily:"'IBM Plex Mono',monospace", letterSpacing:"0.04em",
      transition:"color 0.15s" }}>
      ↗ {label}
    </span>
  </a>
);

const StudyChip = ({ s }) => (
  <span style={{
    display:"inline-flex", alignItems:"center", gap:5,
    background:s==="gspc"?C.forestBg:C.slateBg,
    border:`1px solid ${s==="gspc"?C.forest:C.slate}40`,
    borderRadius:3, padding:"2px 8px"
  }}>
    <div style={{ width:5,height:5,borderRadius:1,background:s==="gspc"?C.gspc:C.keen }} />
    <span style={{ fontSize:7, color:s==="gspc"?C.gspc:C.keen,
      fontFamily:"'IBM Plex Mono',monospace", letterSpacing:"0.05em", textTransform:"uppercase" }}>
      {s==="gspc"?"GSPC 2020":"Keen 2025"}
    </span>
  </span>
);

const SecHead = ({ n, title, sub }) => (
  <div style={{ marginBottom:24, paddingBottom:14, borderBottom:`2px solid ${C.ink}` }}>
    <div style={{ display:"flex", alignItems:"baseline", gap:12 }}>
      <span style={{
        fontFamily:"'IBM Plex Mono',monospace", fontSize:10,
        color:C.inkFaint, letterSpacing:"0.1em"
      }}>{String(n).padStart(2,"0")}</span>
      <h2 style={{
        fontFamily:"'Playfair Display',serif", fontSize:22, fontWeight:700,
        color:C.ink, margin:0, letterSpacing:"-0.01em", lineHeight:1.2
      }}>{title}</h2>
    </div>
    {sub && <p style={{
      color:C.inkLight, fontSize:10, margin:"6px 0 0 30px",
      fontFamily:"'IBM Plex Mono',monospace", lineHeight:1.6
    }}>{sub}</p>}
  </div>
);

const Stat = ({ lbl, val, sub, col }) => (
  <div style={{
    background:C.card, border:`1px solid ${C.border}`,
    borderRadius:6, padding:"12px 16px", flex:1, minWidth:130,
    borderTop:`3px solid ${col||C.inkFaint}`
  }}>
    <Label ch={lbl} col={C.inkLight} sz={7} />
    <div style={{
      fontFamily:"'Playfair Display',serif", fontSize:20, fontWeight:700,
      color:col||C.ink, margin:"4px 0 3px", lineHeight:1.1
    }}>{val}</div>
    {sub && <Label ch={sub} col={C.inkFaint} sz={7} />}
  </div>
);

const MethodBox = () => (
  <div style={{
    background:C.cardSunk, border:`1px solid ${C.border}`,
    borderRadius:6, padding:"14px 18px", marginBottom:22,
    borderLeft:`4px solid ${C.method}`
  }}>
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center",
      flexWrap:"wrap", gap:8, marginBottom:12 }}>
      <span style={{
        fontFamily:"'Playfair Display',serif", fontSize:13, fontWeight:700,
        color:C.method, fontStyle:"italic"
      }}>
        Disparity Index Methodology — Identical in Both Studies
      </span>
      <div style={{ display:"flex", gap:6 }}>
        <WebLink url="https://supreme.justia.com/cases/federal/us/488/469/" label="Croson (1989)" compact />
        <StudyChip s="gspc" /><StudyChip s="keen" />
      </div>
    </div>
    <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))", gap:8 }}>
      {[
        ["FORMULA",   "(Utilization ÷ Availability) × 100",  "Same formula — both studies",           C.method  ],
        ["≥ 100",     "At / Above Parity",                   "Utilization meets availability",         C.parity  ],
        ["80 – 99",   "Mild Disparity",                      "Some gap, not legally substantial",      C.warn    ],
        ["< 80",      "Substantial Disparity",               "Legally significant — Croson threshold", C.alert   ],
      ].map(([h,v,n,col])=>(
        <div key={h} style={{ background:C.card, borderRadius:4, padding:"9px 12px",
          borderTop:`2px solid ${col}` }}>
          <Label ch={h} col={C.inkFaint} sz={7} />
          <div style={{
            fontFamily:"'IBM Plex Sans',sans-serif", fontSize:12, fontWeight:700,
            color:col, marginTop:4
          }}>{v}</div>
          <Label ch={n} col={C.inkFaint} sz={7} />
        </div>
      ))}
    </div>
  </div>
);

// ─── DISPARITY TABLE ──────────────────────────────────────────────────────────
const DispTable = ({ data, title, page }) => (
  <div style={{
    background:C.card, border:`1px solid ${C.border}`,
    borderRadius:6, overflow:"hidden", marginBottom:16
  }}>
    <div style={{
      padding:"10px 16px", background:C.cardSunk,
      borderBottom:`1px solid ${C.border}`,
      display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:6
    }}>
      <span style={{
        fontFamily:"'IBM Plex Sans',sans-serif", fontSize:11, fontWeight:600, color:C.ink
      }}>{title}</span>
      <PDFLink page={page} compact />
    </div>
    <div style={{ overflowX:"auto" }}>
      <table style={{ width:"100%", borderCollapse:"collapse", minWidth:520 }}>
        <thead>
          <tr style={{ background:C.bgStripe }}>
            {["Group","Utilization %","Availability %","Gap (pp)","Index","Status"].map(h=>(
              <th key={h} style={{
                padding:"8px 14px", textAlign:"left",
                fontFamily:"'IBM Plex Mono',monospace", fontSize:7, color:C.inkLight,
                letterSpacing:"0.1em", textTransform:"uppercase", whiteSpace:"nowrap",
                borderBottom:`1px solid ${C.border}`
              }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((g,i) => (
            <tr key={g.id} style={{
              borderBottom:`1px solid ${C.borderFine}`,
              background:g.id==="black"?C.slateBg:i%2===0?C.card:C.bg
            }}>
              <td style={{ padding:"8px 14px" }}>
                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <div style={{ width:8,height:8,borderRadius:2,flexShrink:0,
                    background:CAT_COLOR[g.cat]||C.inkLight }} />
                  <span style={{
                    fontSize:10, color:C.ink,
                    fontFamily:"'IBM Plex Sans',sans-serif",
                    fontWeight:g.id==="black"?700:400
                  }}>{g.label}</span>
                </div>
              </td>
              <td style={{ padding:"8px 14px", fontFamily:"'IBM Plex Mono',monospace",
                fontSize:10, color:C.inkMid }}>{g.util.toFixed(2)}%</td>
              <td style={{ padding:"8px 14px", fontFamily:"'IBM Plex Mono',monospace",
                fontSize:10, color:C.inkLight }}>{g.avail.toFixed(2)}%</td>
              <td style={{ padding:"8px 14px", fontFamily:"'IBM Plex Mono',monospace",
                fontSize:10, color:g.util<g.avail?C.alert:C.parity, fontWeight:600 }}>
                {(g.util-g.avail).toFixed(2)}
              </td>
              <td style={{ padding:"8px 14px" }}>
                <span style={{
                  fontFamily:"'Playfair Display',serif", fontSize:16, fontWeight:700,
                  color:idxColor(g.idx)
                }}>{g.idx>=200?"200+":g.idx}</span>
              </td>
              <td style={{ padding:"8px 14px" }}><Badge idx={g.idx} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

// ─── INDEX BAR ROW ─────────────────────────────────────────────────────────────
const IndexBars = ({ data, page }) => (
  <div style={{
    background:C.card, border:`1px solid ${C.border}`,
    borderRadius:6, padding:"18px 20px", marginBottom:16
  }}>
    <div style={{ display:"flex", justifyContent:"space-between", marginBottom:16,
      flexWrap:"wrap", gap:8, alignItems:"center" }}>
      <Label ch="Disparity Index  =  (Utilization ÷ Availability) × 100  ·  Parity at 100" col={C.inkLight} sz={8} />
      <PDFLink page={page} compact />
    </div>
    {data.filter(g=>g.id!=="majority").map(g=>{
      const col = idxColor(g.idx);
      const bg  = idxBgColor(g.idx);
      const displayIdx = g.idx >= 200 ? 200 : g.idx;
      const pct = Math.min(displayIdx / 200 * 100, 100);
      const parityPct = 100 / 200 * 100;
      return (
        <div key={g.id} style={{ marginBottom:12 }}>
          <div style={{ display:"flex", justifyContent:"space-between",
            alignItems:"center", marginBottom:4 }}>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <div style={{ width:7,height:7,borderRadius:2,
                background:CAT_COLOR[g.cat]||C.inkLight, flexShrink:0 }} />
              <span style={{ fontFamily:"'IBM Plex Sans',sans-serif",
                fontSize:10, color:C.inkMid }}>{g.label}</span>
            </div>
            <span style={{
              fontFamily:"'Playfair Display',serif", fontSize:15, fontWeight:700, color:col
            }}>{g.idx>=200?"200+":g.idx}</span>
          </div>
          <div style={{
            height:6, background:C.bgStripe, borderRadius:3,
            overflow:"hidden", position:"relative",
            border:`1px solid ${C.borderFine}`
          }}>
            <div style={{ position:"absolute", left:`${parityPct}%`, top:0, bottom:0,
              width:1, background:C.parity, opacity:0.5, zIndex:2 }} />
            <div style={{ height:"100%", width:`${pct}%`, background:col, borderRadius:3 }} />
          </div>
          <div style={{ display:"flex", justifyContent:"space-between", marginTop:2 }}>
            <Label ch={`util ${g.util.toFixed(2)}%`} col={C.inkFaint} sz={7} />
            <Label ch={`avail ${g.avail.toFixed(2)}%`} col={C.inkFaint} sz={7} />
          </div>
        </div>
      );
    })}
    <Label ch="← Parity line at 100 · Scale 0–200+ · Source: Keen Independent 2025 Disparity Study" col={C.inkFaint} sz={7} />
  </div>
);

// chart axis/grid shared props
const axProps = {
  tick:{ fill:C.inkLight, fontSize:9, fontFamily:"'IBM Plex Mono',monospace" },
};
const gridProps = { strokeDasharray:"2 4", stroke:C.borderFine, vertical:false };
const legendStyle = { fontFamily:"'IBM Plex Mono',monospace", fontSize:9, color:C.inkLight };

// ═══════════════════════════════════════════════════════════════════════════════
// PANEL A
// ═══════════════════════════════════════════════════════════════════════════════
function PanelViewA() {
  const [activeInd, setActiveInd] = useState("overall");
  const activeSet = INDUSTRY_SETS.find(s=>s.key===activeInd);
  const data = activeSet.data;

  const stackData = INDUSTRY_SETS.map(s=>{
    const d = {};
    s.data.forEach(g=>{ d[g.id]=g.util; });
    return { name:s.label, ...d };
  });

  const uvData = data.map(g=>({ name:g.label, Utilization:g.util, Availability:g.avail }));

  return (
    <div>
      <SecHead n={1} title="View A — Study Framework: MBE / WBE as Defined"
        sub="Mirrors exact groupings from Keen 2025 and GSPC 2020 · MBE = Black + Hispanic + Asian + AIAN + MENA · WBE = White Women" />
      <MethodBox />

      <div style={{ display:"flex", gap:10, flexWrap:"wrap", marginBottom:22 }}>
        <Stat lbl="Total Spend (2020–2024)" val="$506M" sub="5,731 contract elements" col={C.slate} />
        <Stat lbl="Total MBE Util." val="9.05%" sub="vs. 19.80% avail — index 46" col={C.alert} />
        <Stat lbl="WBE Util." val="11.94%" sub="vs. 12.81% avail — index 93" col={C.warn} />
        <Stat lbl="Majority Util." val="79.01%" sub="vs. 67.39% avail — index 117" col={C.majority} />
      </div>

      <div style={{ background:C.card, border:`1px solid ${C.border}`,
        borderRadius:6, padding:"18px 20px", marginBottom:16 }}>
        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:14,
          flexWrap:"wrap", gap:8, alignItems:"center" }}>
          <Label ch="Utilization % by Industry — Stacked (Study Groupings)" col={C.inkLight} sz={8} />
          <PDFLink page="34–43" compact />
        </div>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={stackData} margin={{ top:5,right:10,left:0,bottom:5 }} barCategoryGap="28%">
            <CartesianGrid {...gridProps} />
            <XAxis dataKey="name" {...axProps} />
            <YAxis {...axProps} tickFormatter={v=>v+"%"} domain={[0,100]} />
            <Tooltip content={<Tip />} />
            <Legend wrapperStyle={legendStyle} />
            <Bar dataKey="majority"  name="Majority-Owned"    stackId="a" fill={C.majority}    />
            <Bar dataKey="wbe"       name="White Women (WBE)" stackId="a" fill={C.whiteWomen}  />
            <Bar dataKey="black"     name="Black American"    stackId="a" fill={C.black}        />
            <Bar dataKey="hispanic"  name="Hispanic American" stackId="a" fill={C.hispanic}     />
            <Bar dataKey="asian"     name="Asian American"    stackId="a" fill={C.asian}        />
            <Bar dataKey="indian"    name="American Indian"   stackId="a" fill={C.indian}       />
            <Bar dataKey="mena"      name="MENA American"     stackId="a" fill={C.mena} radius={[3,3,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div style={{ display:"flex", gap:7, flexWrap:"wrap", marginBottom:16 }}>
        {INDUSTRY_SETS.map(s=>(
          <button key={s.key} onClick={()=>setActiveInd(s.key)} style={{
            padding:"5px 13px", fontFamily:"'IBM Plex Mono',monospace", fontSize:9,
            color:activeInd===s.key?C.card:C.inkMid,
            background:activeInd===s.key?C.slate:"transparent",
            border:`1px solid ${activeInd===s.key?C.slate:C.border}`,
            borderRadius:4, cursor:"pointer", transition:"all 0.15s"
          }}>
            Fig.{s.fig} · {s.label}
          </button>
        ))}
      </div>

      <div style={{ background:C.card, border:`1px solid ${C.border}`,
        borderRadius:6, padding:"18px 20px", marginBottom:16 }}>
        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:14,
          flexWrap:"wrap", gap:8, alignItems:"center" }}>
          <Label ch={`Utilization vs. Availability — ${activeSet.label}`} col={C.inkLight} sz={8} />
          <PDFLink page={String(activeSet.page)} compact />
        </div>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={uvData} margin={{ top:5,right:10,left:0,bottom:60 }} barCategoryGap="28%">
            <CartesianGrid {...gridProps} />
            <XAxis dataKey="name" {...axProps} angle={-30} textAnchor="end" interval={0} />
            <YAxis {...axProps} tickFormatter={v=>v+"%"} />
            <Tooltip content={<Tip />} />
            <Legend wrapperStyle={legendStyle} />
            <Bar dataKey="Utilization"  fill={C.slate}     radius={[3,3,0,0]} />
            <Bar dataKey="Availability" fill={C.cardSunk}  radius={[3,3,0,0]}
              stroke={C.border} strokeWidth={1} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <DispTable data={data}
        title={`Figure ${activeSet.fig} — ${activeSet.label} Disparity Analysis (Keen 2025)`}
        page={String(activeSet.page)} />
      <IndexBars data={data} page={String(activeSet.page)} />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PANEL B — Three-group research framework
// ═══════════════════════════════════════════════════════════════════════════════
function collapseToThree(rows) {
  const wbe  = rows.find(r=>r.id==="wbe");
  const maj  = rows.find(r=>r.id==="majority");
  const blk  = rows.find(r=>r.id==="black");
  const rest = rows.filter(r=>!["wbe","majority","black"].includes(r.id));

  const wbeMaj_util  = (wbe?.util||0)  + (maj?.util||0);
  const wbeMaj_avail = (wbe?.avail||0) + (maj?.avail||0);
  const wbeMaj_idx   = wbeMaj_avail > 0 ? Math.round(wbeMaj_util / wbeMaj_avail * 100) : 0;

  const rest_util  = rest.reduce((s,r)=>s+r.util, 0);
  const rest_avail = rest.reduce((s,r)=>s+r.avail, 0);
  const rest_idx   = rest_avail > 0 ? Math.round(rest_util / rest_avail * 100) : 0;

  return [
    { id:"wbeMaj",       label:"White Women + Majority", cat:"whiteWomen", util:wbeMaj_util,  avail:wbeMaj_avail, idx:wbeMaj_idx  },
    { id:"black",        label:"Black-Owned",            cat:"black",      util:blk?.util||0, avail:blk?.avail||0,idx:blk?.idx||0 },
    { id:"remainingMBE", label:"Remaining MBE",          cat:"hispanic",   util:rest_util,    avail:rest_avail,   idx:rest_idx    },
  ];
}

const THREE_GROUP_COLOR = {
  wbeMaj:      C.whiteWomen,
  black:       C.black,
  remainingMBE:C.hispanic,
};

function PanelViewB() {
  const [activeInd, setActiveInd] = useState("overall");
  const activeSet = INDUSTRY_SETS.find(s=>s.key===activeInd);

  const stackData = INDUSTRY_SETS.map(s=>{
    const three = collapseToThree(s.data);
    const d = {};
    three.forEach(g=>{ d[g.id]=g.util; });
    return { name:s.label, ...d };
  });

  const stackAvailData = INDUSTRY_SETS.map(s=>{
    const three = collapseToThree(s.data);
    const d = {};
    three.forEach(g=>{ d[g.id]=g.avail; });
    return { name:s.label, ...d };
  });

  const activeThree = collapseToThree(activeSet.data);
  const uvData = activeThree.map(g=>({ name:g.label, Utilization:g.util, Availability:g.avail }));

  const idxCross = INDUSTRY_SETS.map(s=>{
    const three = collapseToThree(s.data);
    const d = { name:s.label };
    three.forEach(g=>{ d[g.label]=g.idx>=200?200:g.idx; });
    return d;
  });

  return (
    <div>
      <SecHead n={2} title="View B — Research Framework: 3-Group Analysis"
        sub="White Women + Majority · Black-Owned · Remaining MBE · Tariq Shabazz research design" />
      <MethodBox />

      <div style={{
        background:C.slateBg, border:`1px solid ${C.slate}40`,
        borderRadius:6, padding:"12px 18px", marginBottom:20,
        fontFamily:"'IBM Plex Sans',sans-serif", fontSize:10, color:C.inkMid, lineHeight:1.8,
        borderLeft:`4px solid ${C.slate}`
      }}>
        <strong style={{ color:C.slate, fontFamily:"'IBM Plex Mono',monospace",
          fontSize:9, letterSpacing:"0.06em", textTransform:"uppercase" }}>Framework Logic — </strong>
        WBEs received <strong style={{ color:C.whiteWomen }}>$60.5M</strong> vs. all MBEs combined at{" "}
        <strong style={{ color:C.black }}>$45.8M</strong>. Grouping White Women with Majority reveals
        the dominant receiving cohort. Black-owned firms are disaggregated as the primary focus group
        (index: 44, most severe disparity). Remaining MBE = Hispanic (57) + Asian (101) + AIAN (1) + MENA (29).
        <div style={{ marginTop:8 }}>
          <PDFLink page="34–53" compact />
        </div>
      </div>

      <div style={{ display:"flex", gap:10, flexWrap:"wrap", marginBottom:22 }}>
        <Stat lbl="White Women + Majority" val="90.95%" sub="$460.6M · index 113 combined" col={C.whiteWomen} />
        <Stat lbl="Black-Owned" val="7.01%" sub="$35.5M · index 44 — SUBSTANTIAL" col={C.alert} />
        <Stat lbl="Remaining MBE" val="2.04%" sub="Hispanic + Asian + AIAN + MENA" col={C.hispanic} />
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:16 }}>
        <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:6, padding:"16px 18px" }}>
          <Label ch="Utilization % — Three Groups (Stacked)" col={C.inkLight} sz={8} />
          <PDFLink page="34–43" compact />
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={stackData} margin={{ top:10,right:5,left:0,bottom:5 }} barCategoryGap="30%">
              <CartesianGrid {...gridProps} />
              <XAxis dataKey="name" {...axProps} />
              <YAxis {...axProps} tickFormatter={v=>v+"%"} domain={[0,100]} />
              <Tooltip content={<Tip />} />
              <Legend wrapperStyle={legendStyle} />
              <Bar dataKey="wbeMaj"       name="White Women + Majority" stackId="a" fill={C.whiteWomen} />
              <Bar dataKey="black"        name="Black-Owned"            stackId="a" fill={C.black}      />
              <Bar dataKey="remainingMBE" name="Remaining MBE"          stackId="a" fill={C.hispanic} radius={[3,3,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:6, padding:"16px 18px" }}>
          <Label ch="Availability % — Three Groups (Stacked)" col={C.inkLight} sz={8} />
          <PDFLink page="47–51" compact />
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={stackAvailData} margin={{ top:10,right:5,left:0,bottom:5 }} barCategoryGap="30%">
              <CartesianGrid {...gridProps} />
              <XAxis dataKey="name" {...axProps} />
              <YAxis {...axProps} tickFormatter={v=>v+"%"} domain={[0,100]} />
              <Tooltip content={<Tip />} />
              <Legend wrapperStyle={legendStyle} />
              <Bar dataKey="wbeMaj"       name="White Women + Majority (Avail)" stackId="a" fill={C.whiteWomenDark} stroke={C.whiteWomen} strokeWidth={1} />
              <Bar dataKey="black"        name="Black-Owned (Avail)"            stackId="a" fill={C.blackDark}      stroke={C.black}      strokeWidth={1} />
              <Bar dataKey="remainingMBE" name="Remaining MBE (Avail)"          stackId="a" fill={C.hispanic}       opacity={0.5} radius={[3,3,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={{ display:"flex", gap:7, flexWrap:"wrap", marginBottom:14 }}>
        {INDUSTRY_SETS.map(s=>(
          <button key={s.key} onClick={()=>setActiveInd(s.key)} style={{
            padding:"5px 13px", fontFamily:"'IBM Plex Mono',monospace", fontSize:9,
            color:activeInd===s.key?C.card:C.inkMid,
            background:activeInd===s.key?C.slate:"transparent",
            border:`1px solid ${activeInd===s.key?C.slate:C.border}`,
            borderRadius:4, cursor:"pointer", transition:"all 0.15s"
          }}>
            {s.label}
          </button>
        ))}
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:16 }}>
        <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:6, padding:"16px 18px" }}>
          <Label ch={`Util vs. Avail — ${activeSet.label}`} col={C.inkLight} sz={8} />
          <ResponsiveContainer width="100%" height={210}>
            <BarChart data={uvData} margin={{ top:10,right:5,left:0,bottom:30 }} barCategoryGap="28%">
              <CartesianGrid {...gridProps} />
              <XAxis dataKey="name" {...axProps} angle={-20} textAnchor="end" interval={0} />
              <YAxis {...axProps} tickFormatter={v=>v+"%"} />
              <Tooltip content={<Tip />} />
              <Legend wrapperStyle={legendStyle} />
              <Bar dataKey="Utilization"  fill={C.slate}    radius={[3,3,0,0]} />
              <Bar dataKey="Availability" fill={C.cardSunk} radius={[3,3,0,0]} stroke={C.border} strokeWidth={1} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:6, padding:"16px 18px" }}>
          <Label ch="Disparity Index — Cross-Industry (3 Groups)" col={C.inkLight} sz={8} />
          <ResponsiveContainer width="100%" height={210}>
            <BarChart data={idxCross} margin={{ top:10,right:5,left:0,bottom:5 }} barCategoryGap="22%">
              <CartesianGrid {...gridProps} />
              <XAxis dataKey="name" {...axProps} />
              <YAxis {...axProps} domain={[0,220]} />
              <Tooltip content={<Tip />} />
              <Legend wrapperStyle={legendStyle} />
              <ReferenceLine y={100} stroke={C.parity}   strokeDasharray="4 4" label={{ value:"Parity",  fill:C.parity,  fontSize:8, fontFamily:"'IBM Plex Mono',monospace" }} />
              <ReferenceLine y={80}  stroke={C.warn}     strokeDasharray="4 4" label={{ value:"Croson",  fill:C.warn,    fontSize:8, fontFamily:"'IBM Plex Mono',monospace" }} />
              <Bar dataKey="White Women + Majority" fill={C.whiteWomen} radius={[3,3,0,0]} />
              <Bar dataKey="Black-Owned"            fill={C.black}      radius={[3,3,0,0]} />
              <Bar dataKey="Remaining MBE"          fill={C.hispanic}   radius={[3,3,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <DispTable data={activeThree}
        title={`Three-Group Analysis — ${activeSet.label} (Keen 2025, Figure ${activeSet.fig})`}
        page={String(activeSet.page)} />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PANEL GSPC 2020
// ═══════════════════════════════════════════════════════════════════════════════
function PanelGSPC() {
  const industries = ["construction","profServices","otherServices","ae","goods"];
  const labels     = ["Construction","Prof. Svcs","Other Svcs","A&E","Goods"];

  const availData = industries.map((k,i)=>({
    industry: labels[i],
    Black:      GSPC_AVAIL[k].black,
    Hispanic:   GSPC_AVAIL[k].hispanic,
    Asian:      GSPC_AVAIL[k].asian,
    "White Women": GSPC_AVAIL[k].wbe,
  }));

  const utilData = industries.map((k,i)=>({
    industry: labels[i],
    Black:      GSPC_UTIL[k].black,
    Hispanic:   GSPC_UTIL[k].hispanic,
    Asian:      GSPC_UTIL[k].asian,
    "White Women": GSPC_UTIL[k].wbe,
  }));

  return (
    <div>
      <SecHead n={3} title="2020 Study — Griffin & Strong, P.C."
        sub="FY2014–FY2018 · $1.115B prime spend · Race-neutral remediation found INSUFFICIENT" />
      <MethodBox />

      <div style={{ display:"flex", gap:10, flexWrap:"wrap", marginBottom:22 }}>
        <Stat lbl="Total Prime Spend" val="$1.115B" sub="FY2014–FY2018 relevant markets" col={C.slate} />
        <Stat lbl="MWBE Prime Util." val="4.62%" sub="WBE 4.03% · MBE only 0.59%" col={C.alert} />
        <Stat lbl="Study Conclusion" val="Insufficient" sub="Race-neutral did not work" col={C.alert} />
      </div>

      <div style={{ background:C.card, border:`1px solid ${C.border}`,
        borderRadius:6, padding:"18px 20px", marginBottom:16 }}>
        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:14,
          flexWrap:"wrap", gap:8 }}>
          <Label ch="Table 2 — Availability by Industry & Group (GSPC 2020)" col={C.inkLight} sz={8} />
          <WebLink url="https://cuyahogacounty.gov/docs/default-source/council/synapse/idlt_323538_file_100021777_20210408-ccwhl-agendattach.pdf" label="GSPC 2020 PDF" compact />
        </div>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={availData} margin={{ top:5,right:10,left:0,bottom:5 }} barCategoryGap="22%">
            <CartesianGrid {...gridProps} />
            <XAxis dataKey="industry" {...axProps} />
            <YAxis {...axProps} tickFormatter={v=>v+"%"} />
            <Tooltip content={<Tip />} />
            <Legend wrapperStyle={legendStyle} />
            <Bar dataKey="Black"       fill={C.black}      radius={[3,3,0,0]} />
            <Bar dataKey="Hispanic"    fill={C.hispanic}   radius={[3,3,0,0]} />
            <Bar dataKey="Asian"       fill={C.asian}      radius={[3,3,0,0]} />
            <Bar dataKey="White Women" fill={C.whiteWomen} radius={[3,3,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div style={{ background:C.card, border:`1px solid ${C.border}`,
        borderRadius:6, padding:"18px 20px", marginBottom:16 }}>
        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:14,
          flexWrap:"wrap", gap:8 }}>
          <Label ch="Table 3 — Prime Utilization % by Industry & Group (GSPC 2020)" col={C.inkLight} sz={8} />
          <WebLink url="https://cuyahogacounty.gov/docs/default-source/council/synapse/idlt_323538_file_100021777_20210408-ccwhl-agendattach.pdf" label="GSPC 2020 Table 3" compact />
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={utilData} margin={{ top:5,right:10,left:0,bottom:5 }} barCategoryGap="22%">
            <CartesianGrid {...gridProps} />
            <XAxis dataKey="industry" {...axProps} />
            <YAxis {...axProps} tickFormatter={v=>v+"%"} />
            <Tooltip content={<Tip />} />
            <Legend wrapperStyle={legendStyle} />
            <Bar dataKey="Black"       fill={C.black}      radius={[3,3,0,0]} />
            <Bar dataKey="Hispanic"    fill={C.hispanic}   radius={[3,3,0,0]} />
            <Bar dataKey="Asian"       fill={C.asian}      radius={[3,3,0,0]} />
            <Bar dataKey="White Women" fill={C.whiteWomen} radius={[3,3,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div style={{ background:C.forestBg, border:`1px solid ${C.forest}50`,
        borderRadius:6, padding:"16px 18px", borderLeft:`4px solid ${C.forest}` }}>
        <Label ch="Central Finding — GSPC 2020" col={C.forest} sz={8} />
        <div style={{ fontFamily:"'IBM Plex Sans',sans-serif", fontSize:10.5, color:C.inkMid,
          lineHeight:1.85, marginTop:10 }}>
          Despite race-neutral remediation since 2016, Black and Hispanic firms had statistically significant
          underutilization in <strong style={{ color:C.forest }}>all five work categories</strong>.
          African American prime utilization ranged <strong style={{ color:C.forest }}>0.02%–2.91%</strong> against
          availability of 4.29%–14.87%. GSPC recommended a{" "}
          <strong style={{ color:C.forest }}>race and gender-conscious program</strong> — the first time in
          Cuyahoga County's history.
        </div>
        <div style={{ marginTop:12 }}>
          <WebLink url="https://cuyahogacounty.gov/docs/default-source/council/synapse/idlt_323538_file_100021777_20210408-ccwhl-agendattach.pdf"
            label="Full GSPC 2020 Report PDF" compact />
        </div>
      </div>
    </div>
  );
}

// ─── PANEL SOURCES ────────────────────────────────────────────────────────────
function PanelSources() {
  return (
    <div>
      <SecHead n={4} title="Source Directory" sub="All figures verified against primary source documents" />
      {[
        { cat:"Primary Studies", items:[
          { type:"pdf",  label:"Keen Independent 2025 — CuyahogaCounty_FinalSummaryReport_10292025.pdf (uploaded)", url:"", note:"2020–2024 · $506M · 5,731 contracts · Keen Independent Research LLC · October 2025 · 79 pages" },
          { type:"web",  label:"Keen Independent 2025 — County Official Page", url:"https://cuyahogacounty.gov/government/divisions-and-offices/office-of-procurement-and-diversity/disparity-study", note:"Cuyahoga County Office of Procurement and Diversity" },
          { type:"web",  label:"Griffin & Strong, P.C. 2020 — GSPC Report PDF (County Council)", url:"https://cuyahogacounty.gov/docs/default-source/council/synapse/idlt_323538_file_100021777_20210408-ccwhl-agendattach.pdf", note:"FY2014–FY2018 · $1.115B prime spend · Presented April 8, 2021" },
        ]},
        { cat:"Legal Foundation — Disparity Index Methodology", items:[
          { type:"web", label:"Croson v. City of Richmond, 488 U.S. 469 (1989)", url:"https://supreme.justia.com/cases/federal/us/488/469/", note:"<80 threshold · strict scrutiny · disparity index framework" },
          { type:"web", label:"Adarand Constructors v. Pena, 515 U.S. 200 (1995)", url:"https://supreme.justia.com/cases/federal/us/515/200/", note:"Extended strict scrutiny to federal programs" },
          { type:"web", label:"Assoc. Gen. Contractors v. Drabik, 214 F.3d 730 (6th Cir. 2000)", url:"https://law.justia.com/cases/federal/appellate-courts/F3/214/730/519736/", note:"Controlling 6th Circuit precedent for Cuyahoga County" },
        ]},
        { cat:"Census — Population Layer (ACS DP05 2023)", items:[
          { type:"web", label:"ACS 2019-2023 Table DP05 — Cuyahoga County FIPS 39035", url:"https://data.census.gov/table/ACSDP5Y2023.DP05?g=050XX00US39035", note:"Total pop 1,249,418 · White NH 57.0% · Black NH 28.6% · Hispanic 6.8%" },
          { type:"web", label:"Census Bureau — About Race (no standalone MENA category)", url:"https://www.census.gov/topics/population/race/about.html", note:"MENA proxy: Some Other Race alone NH = 0.5% (DP05 Row 92)" },
        ]},
        { cat:"Green Line Project — Intellectual Foundation", items:[
          { type:"web", label:"From Here to Equality (2nd ed.) — Dr. William A. Darity Jr. & A. Kirsten Mullen", url:"https://uncpress.org/9781469671208/from-here-to-equality-second-edition/", note:"UNC Press, 2020 (1st ed.) / 2022 (2nd ed.) · Samuel DuBois Cook Professor of Public Policy, Duke University · Intellectual foundation of the local atonement measure in the Green Line Project" },
        ]},
      ].map(({ cat, items })=>(
        <div key={cat} style={{ background:C.card, border:`1px solid ${C.border}`,
          borderRadius:6, overflow:"hidden", marginBottom:14 }}>
          <div style={{
            padding:"8px 16px", background:C.cardSunk,
            borderBottom:`1px solid ${C.border}`,
            fontFamily:"'IBM Plex Mono',monospace", fontSize:8, color:C.inkLight,
            letterSpacing:"0.1em", textTransform:"uppercase"
          }}>{cat}</div>
          <div style={{ padding:"14px 16px", display:"flex", flexDirection:"column", gap:14 }}>
            {items.map(src=>(
              <div key={src.label}>
                {src.type==="pdf"
                  ? <PDFLink />
                  : <a href={src.url} target="_blank" rel="noopener noreferrer"
                      style={{ fontFamily:"'IBM Plex Sans',sans-serif", fontSize:10.5,
                        color:C.slate, textDecoration:"none",
                        borderBottom:`1px solid ${C.slate}40` }}
                      onMouseEnter={e=>e.currentTarget.style.color=C.burgundy}
                      onMouseLeave={e=>e.currentTarget.style.color=C.slate}>
                      {src.label}
                    </a>
                }
                <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:8,
                  color:C.inkFaint, marginTop:4, lineHeight:1.6 }}>→ {src.note}</div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PANEL — GREEN LINE PROJECT
// ═══════════════════════════════════════════════════════════════════════════════

const GL     = "#1E4D30";   // deep forest — professional, not neon
const GL_ACC = "#2A6A42";   // lighter forest accent
const GL_BG  = "#EBF2ED";   // forest-tinted ivory
const GL_MID = "#E0EDE4";

const GL_EVIDENCE = [
  { industry:"Overall",        util:7.01,  avail:15.92, idx:44,  gap:8.91  },
  { industry:"Construction",   util:10.04, avail:17.08, idx:59,  gap:7.04  },
  { industry:"Prof. Services", util:5.44,  avail:13.79, idx:39,  gap:8.35  },
  { industry:"Goods",          util:5.38,  avail:13.18, idx:41,  gap:7.80  },
  { industry:"Other Services", util:2.16,  avail:19.23, idx:11,  gap:17.07 },
];

const GL_PILLARS = [
  {
    id:"chattel",
    icon:"⛓",
    title:"Pillar I — Descendants of U.S. Chattel Slavery",
    short:"ADOS Lineage",
    col:GL,
    evidence:[
      "Black American-owned firms hold the single most severe disparity index of any group in the Keen 2025 study — index 44 overall, index 11 in Other Services.",
      "Despite 10+ years of disparity study findings, MBE programs have failed to close the gap. GSPC 2020 found <1% MBE prime utilization; Keen 2025 shows only 7.01%.",
      "The GSPC 2020 study found statistically significant underutilization in all 5 industries for Black-owned firms — the only group with that distinction.",
      "Black Americans are 28.6% of Cuyahoga County's population (ACS DP05 2023) yet received $35.5M of $506M in contracts — 7.01%.",
      "General MBE programs dilute remediation. WBEs alone received $60.5M — more than all MBE groups combined ($45.8M) — despite MBEs facing substantially greater disparities.",
    ],
    remedy:"A dedicated ADOS Business Enterprise (ABE) certification tier that tracks lineage to U.S. chattel slavery, separate from and additive to the existing MBE umbrella. Modeled on the narrow tailoring requirements of Croson while addressing the specific historical harm.",
  },
  {
    id:"redline",
    icon:"🗺",
    title:"Pillar II — Redlined Neighborhood Geographic Lineage",
    short:"Redline Geography",
    col:C.gold,
    evidence:[
      "Historic redlining in Cleveland concentrated disinvestment in majority-Black east-side neighborhoods, creating compounding barriers to business formation, capital access, and bonding capacity.",
      "Keen 2025 documents substantially lower bid capacity, higher business closure rates, and significantly lower business earnings for Black American-owned firms — consistent with redlining's documented downstream economic effects.",
      "Keen 2025 (p.18) shows Black Americans face mortgage denial rates three times higher than non-Hispanic whites in Cuyahoga County — directly constraining business capitalization.",
      "GSPC 2020 recommended reducing bonding and insurance barriers — structural disadvantages disproportionately rooted in redlined neighborhoods where capital is scarce.",
      "Geographic targeting creates a race-neutral supplemental mechanism: firms headquartered or majority-employing in historically redlined census tracts receive enhanced program access regardless of owner race.",
    ],
    remedy:"A Redlined Community Business (RCB) preference tier: firms physically rooted in HOLC-graded C/D census tracts receive enhanced scoring, extended bonding support, and sheltered-market set-asides. Race-neutral framing satisfies rational-basis review while achieving racially equitable outcomes.",
  },
];

const GL_ARCHITECTURE = [
  { n:"01", label:"ABE Certification Tier",    desc:"American-Descended Business Enterprise — lineage to U.S. chattel slavery. Separate from general MBE. Additive goals layer on all contracts over $250K.", col:GL },
  { n:"02", label:"RCB Geographic Tier",       desc:"Redlined Community Business — firms headquartered in HOLC C/D tracts. Race-neutral mechanism. Enhanced bonding assistance, extended advertising windows.", col:C.gold },
  { n:"03", label:"Dual-Track Goals",          desc:"Contracts set both a general MBE/WBE goal AND a specific ABE/RCB goal. ABE/RCB compliance counts toward but does not satisfy the general MBE goal.", col:C.method },
  { n:"04", label:"Utilization Monitoring",    desc:"Monthly reporting of ABE and RCB utilization separate from aggregate MBE data. Prevents dilution of Black-firm tracking within the MBE umbrella.", col:C.slate },
  { n:"05", label:"Capital Access Bridge",     desc:"County-backed bonding assistance and prompt-pay enforcement (within 15 days prime-to-sub) specifically for ABE/RCB certified firms.", col:C.asian },
  { n:"06", label:"Sunset Evaluation",         desc:"Formal disparity re-analysis every 5 years. ABE/RCB tiers sunset when disparity index reaches ≥80 sustained over two consecutive study periods.", col:C.gspc },
];

const GL_LEGAL = [
  { case:"Croson v. Richmond, 488 U.S. 469 (1989)",              note:"Strict scrutiny — compelling interest requires documented discrimination. Both GSPC 2020 and Keen 2025 provide that evidentiary foundation for a targeted program." },
  { case:"Adarand Constructors v. Pena, 515 U.S. 200 (1995)",    note:"Narrow tailoring required. Green Line's lineage + geographic dual-pillar structure is designed to be narrowly tailored to the specific documented harm." },
  { case:"Drabik, 214 F.3d 730 (6th Cir. 2000)",                 note:"6th Circuit controlling precedent. Disparity index methodology used in both studies is court-approved. Index of 44 for Black-owned firms well below the legally significant <80 threshold." },
  { case:"H.R. 40 — Commission to Study Reparation Proposals",   note:"Legally distinct from a federal reparations bill. The Green Line Project is a local atonement measure — a contracting equity instrument — not a cash transfer program. H.R. 40 provides the legislative discourse context; the Green Line operationalizes the principle at the county procurement level." },
  { case:"Darity & Mullen — From Here to Equality (2020, UNC Press)", note:"Intellectual foundation of the local atonement mechanism. Darity and Mullen establish the dual eligibility standard: (1) lineage — documented descent from at least one person enslaved in the United States; (2) identity — self-identification as Black American for at least 12 years prior to program enactment. The Green Line Project applies this framework as a local contracting certification standard, translating national reparations theory into municipal procurement policy." },
];

function PanelGreenLine() {
  const [activePillar, setActivePillar] = useState("chattel");
  const pillar = GL_PILLARS.find(p=>p.id===activePillar);

  const gapData = GL_EVIDENCE.map(e=>({
    name:e.industry,
    "Black-Owned Util.":e.util,
    "Availability Benchmark":e.avail,
    "Gap":e.gap,
  }));

  return (
    <div>
      {/* Header */}
      <div style={{ background:GL_BG, border:`1px solid ${GL}40`,
        borderRadius:8, padding:"24px 26px", marginBottom:24,
        borderTop:`4px solid ${GL}` }}>
        <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between",
          flexWrap:"wrap", gap:12, marginBottom:14 }}>
          <div>
            <Label ch="Policy Framework · Tariq Shabazz M.P.P. · Cuyahoga County" col={GL} sz={8} />
            <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:28, fontWeight:700,
              color:C.ink, margin:"6px 0 4px", letterSpacing:"-0.01em" }}>
              The Green Line Project
            </h2>
            <div style={{ fontFamily:"'IBM Plex Sans',sans-serif", fontSize:11, color:GL_ACC,
              fontStyle:"italic" }}>
              A Lineage-Based Disparity Remediation Program for Cuyahoga County
            </div>
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:5, alignItems:"flex-end" }}>
            <span style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:8, color:C.inkFaint,
              letterSpacing:"0.06em", textTransform:"uppercase" }}>Campaign / Platform Policy</span>
            <span style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:8, color:C.inkFaint }}>
              Local Atonement Measure
            </span>
            <span style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:8, color:C.inkFaint }}>
              Inspired by Dr. William Darity Jr.
            </span>
          </div>
        </div>
        <p style={{ fontFamily:"'IBM Plex Sans',sans-serif", fontSize:11, color:C.inkMid,
          lineHeight:1.85, margin:0, maxWidth:780 }}>
          The Green Line Project is a targeted contracting equity framework authored by Tariq Shabazz M.P.P.
          It argues that race-neutral SBE programs and general MBE umbrellas are structurally insufficient
          to address the concentrated, historically documented harm experienced by{" "}
          <strong style={{ color:GL }}>descendants of U.S. chattel slavery</strong> and residents of{" "}
          <strong style={{ color:C.gold }}>historically redlined neighborhoods</strong> in Cuyahoga County.
        </p>
      </div>

      {/* Intellectual Foundation — Darity */}
      <div style={{ background:C.card, border:`1px solid ${C.border}`,
        borderRadius:7, padding:"20px 22px", marginBottom:22,
        borderLeft:`4px solid ${C.method}` }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start",
          flexWrap:"wrap", gap:10, marginBottom:16 }}>
          <div>
            <Label ch="Intellectual Foundation — Local Atonement Measure" col={C.method} sz={8} />
            <div style={{ fontFamily:"'Playfair Display',serif", fontSize:15, fontWeight:700,
              color:C.ink, marginTop:5, fontStyle:"italic" }}>
              Inspired by Dr. William A. Darity Jr. &amp; A. Kirsten Mullen
            </div>
            <div style={{ fontFamily:"'IBM Plex Sans',sans-serif", fontSize:10, color:C.inkMid, marginTop:2 }}>
              From Here to Equality: Reparations for Black Americans in the Twenty-First Century
            </div>
            <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:8, color:C.inkFaint, marginTop:2 }}>
              UNC Press, 2020 (1st ed.) · 2022 (2nd ed.) · Samuel DuBois Cook Professor, Duke University
            </div>
          </div>
          <WebLink url="https://uncpress.org/9781469671208/from-here-to-equality-second-edition/"
            label="From Here to Equality (UNC Press)" compact />
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
          <div>
            <Label ch="Darity & Mullen — National Framework" col={C.inkLight} sz={8} />
            <div style={{ marginTop:10, display:"flex", flexDirection:"column", gap:10 }}>
              {[
                { h:"Three Eras of Injustice", b:"Darity and Mullen document how chattel slavery, Jim Crow, and modern discrimination compound across generations — producing the racial wealth gap and the systemic exclusion visible in Cuyahoga County's contract data." },
                { h:"Dual Eligibility Standard", b:"(1) Lineage standard — documented descent from at least one person enslaved in the United States. (2) Identity standard — self-identification as Black American on an official document for at least 12 years before program enactment." },
                { h:"Acknowledgment · Redress · Closure", b:"Darity and Mullen define reparations as requiring all three: formal acknowledgment of the harm, concrete redress, and a mechanism for closure once the debt is met." },
                { h:"Local Atonement Rationale", b:"While Darity and Mullen argue that only the federal government can deliver full reparations, they acknowledge local atonement measures. The Green Line Project is precisely that — a county-level instrument." },
              ].map((r,i)=>(
                <div key={i} style={{ display:"flex", gap:10 }}>
                  <span style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:9,
                    color:C.method, flexShrink:0, marginTop:1, opacity:0.5 }}>
                    {String(i+1).padStart(2,"0")}
                  </span>
                  <div>
                    <div style={{ fontFamily:"'IBM Plex Sans',sans-serif", fontSize:10, fontWeight:700,
                      color:C.method, marginBottom:2 }}>{r.h}</div>
                    <div style={{ fontFamily:"'IBM Plex Sans',sans-serif", fontSize:9.5,
                      color:C.inkMid, lineHeight:1.75 }}>{r.b}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label ch="Shabazz — Local Translation (Green Line Project)" col={C.inkLight} sz={8} />
            <div style={{ marginTop:10, display:"flex", flexDirection:"column", gap:10 }}>
              {[
                { h:"From National Theory → County Procurement", b:"The Green Line Project takes Darity's eligibility framework and applies it as a procurement certification standard — targeting the exact domain where Keen 2025 documents the most severe and persistent harm." },
                { h:"Lineage Standard → ABE Certification", b:"Darity's lineage standard maps directly onto the proposed American-Descended Business Enterprise (ABE) tier. A firm owner must document descent from at least one person enslaved in the United States." },
                { h:"Geographic Redlining → RCB Tier", b:"The Green Line adds a second mechanism: the Redlined Community Business (RCB) geographic tier — a race-neutral instrument addressing the capital and bonding barriers that redlining created." },
                { h:"Why County Action Now", b:"Cuyahoga County has two successive disparity studies (2020, 2025) documenting the exact harm that the Green Line proposes to remedy, providing the narrow-tailoring evidentiary foundation Croson requires." },
              ].map((r,i)=>(
                <div key={i} style={{ display:"flex", gap:10 }}>
                  <span style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:9,
                    color:C.gold, flexShrink:0, marginTop:1, opacity:0.5 }}>
                    {String(i+1).padStart(2,"0")}
                  </span>
                  <div>
                    <div style={{ fontFamily:"'IBM Plex Sans',sans-serif", fontSize:10, fontWeight:700,
                      color:C.gold, marginBottom:2 }}>{r.h}</div>
                    <div style={{ fontFamily:"'IBM Plex Sans',sans-serif", fontSize:9.5,
                      color:C.inkMid, lineHeight:1.75 }}>{r.b}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ marginTop:16, background:C.bg, border:`1px solid ${C.border}`,
          borderRadius:5, padding:"12px 16px",
          fontFamily:"'IBM Plex Sans',sans-serif", fontSize:9.5, color:C.inkMid, lineHeight:1.85 }}>
          <strong style={{ color:C.method, fontFamily:"'IBM Plex Mono',monospace", fontSize:8,
            letterSpacing:"0.06em", textTransform:"uppercase" }}>Critical Distinction — </strong>
          Darity and Mullen are explicit that local measures, while meaningful acts of atonement,
          cannot substitute for a comprehensive federal reparations program.
          The Green Line Project does not claim to deliver reparations.
          It claims to deliver <strong style={{ color:C.gold }}>measurable, narrowly-tailored
          remediation</strong> within the domain of county contracting —
          the specific arena where Keen 2025 and GSPC 2020 have documented statistically significant,
          legally cognizable harm to Black American-owned firms.
        </div>
      </div>

      {/* Evidentiary basis chart */}
      <div style={{ background:C.card, border:`1px solid ${C.border}`,
        borderRadius:7, padding:"18px 20px", marginBottom:20 }}>
        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:14,
          flexWrap:"wrap", gap:8, alignItems:"center" }}>
          <div>
            <Label ch="Evidentiary Basis — Black-Owned Firm Disparity Gap by Industry (Keen 2025)" col={C.inkLight} sz={8} />
            <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:8, color:C.inkFaint, marginTop:3 }}>
              Utilization vs. availability benchmark · Keen 2025 Figures 27–35
            </div>
          </div>
          <PDFLink page="52–64" compact />
        </div>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={gapData} margin={{ top:5,right:10,left:0,bottom:5 }} barCategoryGap="28%">
            <CartesianGrid {...gridProps} />
            <XAxis dataKey="name" {...axProps} />
            <YAxis {...axProps} tickFormatter={v=>v+"%"} domain={[0,25]} />
            <Tooltip content={<Tip />} />
            <Legend wrapperStyle={legendStyle} />
            <Bar dataKey="Black-Owned Util."       fill={C.black}    radius={[3,3,0,0]} />
            <Bar dataKey="Availability Benchmark"  fill={C.cardSunk} radius={[3,3,0,0]} stroke={C.border} strokeWidth={1} />
            <Bar dataKey="Gap"                     fill={C.burgundy} radius={[3,3,0,0]} opacity={0.8} />
          </BarChart>
        </ResponsiveContainer>
        <div style={{ display:"flex", gap:10, flexWrap:"wrap", marginTop:14 }}>
          {GL_EVIDENCE.map(e=>(
            <div key={e.industry} style={{ flex:1, minWidth:90, background:C.bg,
              borderRadius:5, padding:"9px 12px",
              borderTop:`3px solid ${idxColor(e.idx)}` }}>
              <Label ch={e.industry} col={C.inkFaint} sz={7} />
              <div style={{ fontFamily:"'Playfair Display',serif", fontSize:17, fontWeight:700,
                color:idxColor(e.idx), marginTop:3 }}>{e.idx}</div>
              <Label ch={`Gap: ${e.gap.toFixed(1)}pp`} col={C.inkFaint} sz={7} />
            </div>
          ))}
        </div>
      </div>

      {/* Two Pillars */}
      <div style={{ marginBottom:8 }}>
        <Label ch="The Two Pillars of Lineage-Based Targeting" col={C.inkLight} sz={8} />
      </div>
      <div style={{ display:"flex", gap:8, marginBottom:16 }}>
        {GL_PILLARS.map(p=>(
          <button key={p.id} onClick={()=>setActivePillar(p.id)} style={{
            flex:1, padding:"11px 16px", fontFamily:"'IBM Plex Sans',sans-serif", fontSize:10,
            fontWeight:600,
            color:activePillar===p.id?C.card:C.inkMid,
            background:activePillar===p.id?p.col:"transparent",
            border:`1px solid ${activePillar===p.id?p.col:C.border}`,
            borderRadius:5, cursor:"pointer", textAlign:"left", transition:"all 0.15s" }}>
            <span style={{ fontSize:15, marginRight:8 }}>{p.icon}</span>
            {p.short}
          </button>
        ))}
      </div>

      <div style={{ background:C.card, border:`1px solid ${pillar.col}50`,
        borderRadius:7, padding:"20px 22px", marginBottom:20,
        borderTop:`3px solid ${pillar.col}` }}>
        <div style={{ fontFamily:"'Playfair Display',serif", fontSize:15, fontWeight:700,
          color:pillar.col, marginBottom:16, fontStyle:"italic" }}>{pillar.title}</div>

        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:16 }}>
          <div>
            <Label ch="Evidentiary Support" col={C.inkLight} sz={8} />
            <div style={{ marginTop:10, display:"flex", flexDirection:"column", gap:9 }}>
              {pillar.evidence.map((e,i)=>(
                <div key={i} style={{ display:"flex", gap:8 }}>
                  <span style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:9,
                    color:pillar.col, flexShrink:0, marginTop:1, opacity:0.6 }}>
                    {String(i+1).padStart(2,"0")}
                  </span>
                  <span style={{ fontFamily:"'IBM Plex Sans',sans-serif", fontSize:9.5,
                    color:C.inkMid, lineHeight:1.75 }}>{e}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label ch="Proposed Remedy" col={C.inkLight} sz={8} />
            <div style={{ marginTop:10, background:C.bg, borderRadius:6, padding:"14px 16px",
              border:`1px solid ${pillar.col}30` }}>
              <div style={{ width:30, height:3, borderRadius:2,
                background:pillar.col, marginBottom:10 }} />
              <p style={{ fontFamily:"'IBM Plex Sans',sans-serif", fontSize:10,
                color:C.inkMid, lineHeight:1.85, margin:0 }}>
                {pillar.remedy}
              </p>
            </div>

            {pillar.id==="chattel" && (
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginTop:12 }}>
                {[
                  { lbl:"Black pop. share", val:"28.6%", note:"ACS DP05 2023" },
                  { lbl:"Contract share",   val:"7.01%", note:"Keen 2025 Fig. 27" },
                  { lbl:"Disparity Index",  val:"44",    note:"Most severe — all industries" },
                  { lbl:"Dollar gap",       val:"$44.1M",note:"vs. proportional parity" },
                ].map(s=>(
                  <div key={s.lbl} style={{ background:C.bg, borderRadius:5, padding:"8px 11px",
                    borderTop:`2px solid ${GL}` }}>
                    <Label ch={s.lbl} col={C.inkFaint} sz={7} />
                    <div style={{ fontFamily:"'Playfair Display',serif", fontSize:15, fontWeight:700,
                      color:GL, marginTop:3 }}>{s.val}</div>
                    <Label ch={s.note} col={C.inkFaint} sz={7} />
                  </div>
                ))}
              </div>
            )}
            {pillar.id==="redline" && (
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginTop:12 }}>
                {[
                  { lbl:"Mortgage denial rate", val:"3×",     note:"Black vs. white — Keen 2025 p.18" },
                  { lbl:"Business closure rate", val:"Higher", note:"Black-owned — SBA data cited Keen" },
                  { lbl:"Bid capacity gap",      val:"Lower",  note:"MBEs vs. majority" },
                  { lbl:"Legal standard",        val:"Rational basis", note:"Geographic = race-neutral" },
                ].map(s=>(
                  <div key={s.lbl} style={{ background:C.bg, borderRadius:5, padding:"8px 11px",
                    borderTop:`2px solid ${C.gold}` }}>
                    <Label ch={s.lbl} col={C.inkFaint} sz={7} />
                    <div style={{ fontFamily:"'Playfair Display',serif", fontSize:13, fontWeight:700,
                      color:C.gold, marginTop:3 }}>{s.val}</div>
                    <Label ch={s.note} col={C.inkFaint} sz={7} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Program Architecture */}
      <div style={{ marginBottom:8 }}>
        <Label ch="Program Architecture — Green Line Project" col={C.inkLight} sz={8} />
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",
        gap:10, marginBottom:20 }}>
        {GL_ARCHITECTURE.map(a=>(
          <div key={a.n} style={{ background:C.card, border:`1px solid ${C.border}`,
            borderRadius:6, padding:"14px 16px", borderTop:`3px solid ${a.col}` }}>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
              <Label ch={a.n} col={C.inkFaint} sz={8} />
              <span style={{ fontFamily:"'IBM Plex Sans',sans-serif", fontSize:11, fontWeight:700,
                color:C.ink }}>{a.label}</span>
            </div>
            <div style={{ fontFamily:"'IBM Plex Sans',sans-serif", fontSize:9.5, color:C.inkMid, lineHeight:1.7 }}>
              {a.desc}
            </div>
          </div>
        ))}
      </div>

      {/* Legal Framework */}
      <div style={{ background:C.card, border:`1px solid ${C.border}`,
        borderRadius:7, padding:"18px 20px", marginBottom:20,
        borderLeft:`4px solid ${C.method}` }}>
        <Label ch="Legal Framework — Narrow Tailoring Architecture" col={C.method} sz={8} />
        <div style={{ display:"flex", flexDirection:"column", gap:12, marginTop:14 }}>
          {GL_LEGAL.map(l=>(
            <div key={l.case} style={{ display:"flex", gap:14, paddingBottom:12,
              borderBottom:`1px solid ${C.borderFine}` }}>
              <div style={{ width:3, flexShrink:0, background:C.method, borderRadius:2,
                alignSelf:"stretch", opacity:0.3 }} />
              <div>
                <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:8.5,
                  color:C.method, marginBottom:4, fontWeight:500 }}>{l.case}</div>
                <div style={{ fontFamily:"'IBM Plex Sans',sans-serif", fontSize:9.5,
                  color:C.inkMid, lineHeight:1.75 }}>{l.note}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Central argument */}
      <div style={{ background:GL_BG, border:`1px solid ${GL}40`,
        borderRadius:7, padding:"18px 20px" }}>
        <Label ch="Central Argument — Why General MBE is Structurally Insufficient" col={GL} sz={8} />
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",
          gap:10, marginTop:14 }}>
          {[
            { h:"Dilution Effect", body:"WBEs alone received $60.5M — more than all MBE groups combined ($45.8M). A single MBE goal does not differentiate the severity of disparity (index 44 for Black-owned vs. index 101 for Asian-owned).", col:C.gold },
            { h:"10-Year Persistence", body:"GSPC 2020 documented the problem in FY2014–18. Keen 2025 documents FY2020–24. A decade of MBE programs produced 7.01% utilization against 15.92% availability. Race-neutral remediation was found insufficient in 2020 and the general approach has not resolved the disparity.", col:C.burgundy },
            { h:"Lineage = Specificity", body:"The Croson narrow-tailoring requirement demands programs match the documented harm. The harm is rooted in chattel slavery → redlining → capital exclusion → bid capacity gap. A lineage/geography mechanism matches the causal chain more precisely than a broad racial category.", col:GL },
            { h:"Population vs. Availability Gap", body:"Black Americans are 28.6% of Cuyahoga County's population. They received 7.01% of contracts. Even measured against qualified availability (15.92%), the index is 44. No other group in the study has both population weight and disparity severity at this magnitude.", col:C.slate },
          ].map(r=>(
            <div key={r.h} style={{ background:C.card, border:`1px solid ${r.col}30`,
              borderRadius:6, padding:"13px 15px", borderTop:`3px solid ${r.col}` }}>
              <div style={{ fontFamily:"'IBM Plex Sans',sans-serif", fontSize:11, fontWeight:700,
                color:r.col, marginBottom:8 }}>{r.h}</div>
              <div style={{ fontFamily:"'IBM Plex Sans',sans-serif", fontSize:9.5,
                color:C.inkMid, lineHeight:1.75 }}>{r.body}</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop:16, fontFamily:"'IBM Plex Mono',monospace", fontSize:8,
          color:C.inkFaint, borderTop:`1px solid ${C.border}`, paddingTop:12 }}>
          Framework authored by Tariq Shabazz M.P.P. · Local atonement measure inspired by Dr. William A. Darity Jr. &amp; A. Kirsten Mullen, From Here to Equality (UNC Press, 2020) ·
          Evidentiary basis: Keen Independent 2025 (Figures 27–35) + Griffin &amp; Strong P.C. 2020 (Tables 2–5) ·
          Legal architecture: Croson (1989) · Adarand (1995) · Drabik (6th Cir. 2000)
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PANEL NARRATIVE
// ═══════════════════════════════════════════════════════════════════════════════
function PanelNarrative() {
  const hrStyle = {
    border:"none", borderTop:`1px solid ${C.border}`,
    margin:"32px 0"
  };
  const h2Style = {
    fontFamily:"'Playfair Display',serif", fontSize:18, fontWeight:700,
    color:C.ink, margin:"28px 0 10px", letterSpacing:"-0.01em", lineHeight:1.3
  };
  const pStyle = {
    fontFamily:"'IBM Plex Sans',sans-serif", fontSize:12, color:C.inkMid,
    lineHeight:1.85, margin:"0 0 14px"
  };
  const codeStyle = {
    display:"block", fontFamily:"'IBM Plex Mono',monospace", fontSize:11,
    background:C.cardSunk, border:`1px solid ${C.border}`,
    borderRadius:4, padding:"10px 16px", margin:"12px 0",
    color:C.inkMid, lineHeight:1.7
  };
  const refStyle = {
    fontFamily:"'IBM Plex Sans',sans-serif", fontSize:11, color:C.inkMid,
    lineHeight:1.7, margin:"0 0 8px", paddingLeft:20, textIndent:"-20px"
  };

  return (
    <div style={{ maxWidth:760, margin:"0 auto" }}>

      {/* Title block */}
      <div style={{
        background:C.card, border:`1px solid ${C.border}`,
        borderRadius:6, padding:"28px 32px", marginBottom:28,
        borderTop:`4px solid ${C.ink}`
      }}>
        <h1 style={{
          fontFamily:"'Playfair Display',serif", fontSize:26, fontWeight:900,
          color:C.ink, margin:"0 0 8px", letterSpacing:"-0.02em", lineHeight:1.2
        }}>
          Disparities in Public Procurement:
        </h1>
        <h2 style={{
          fontFamily:"'Playfair Display',serif", fontSize:17, fontWeight:400,
          fontStyle:"italic", color:C.inkMid, margin:"0 0 20px", lineHeight:1.4
        }}>
          A Secondary Analysis of Contract Distribution in Cuyahoga County, Ohio
          and the Green Line Project Policy Framework
        </h2>
        <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
          <span style={{
            fontFamily:"'IBM Plex Sans',sans-serif", fontSize:12,
            fontWeight:600, color:C.ink
          }}>Tariq K. Shabazz, M.P.P.</span>
          <span style={{
            fontFamily:"'IBM Plex Mono',monospace", fontSize:10, color:C.inkLight
          }}>Shabazz Research</span>
          <a href="https://shabazzresearch.com" target="_blank" rel="noopener noreferrer"
            style={{
              fontFamily:"'IBM Plex Mono',monospace", fontSize:10,
              color:C.slate, textDecoration:"none"
            }}>
            shabazzresearch.com
          </a>
        </div>
      </div>

      {/* Abstract */}
      <div style={{
        background:C.cardSunk, border:`1px solid ${C.border}`,
        borderRadius:6, padding:"20px 24px", marginBottom:28,
        borderLeft:`4px solid ${C.inkMid}`
      }}>
        <div style={{
          fontFamily:"'IBM Plex Mono',monospace", fontSize:9,
          color:C.inkFaint, letterSpacing:"0.12em", textTransform:"uppercase",
          marginBottom:10
        }}>Abstract</div>
        <p style={pStyle}>
          Public procurement represents one of the primary mechanisms through which local governments
          distribute economic opportunity. Governments frequently commission disparity studies to
          determine whether firms owned by minorities and women receive public contracts at rates
          proportional to their availability in the marketplace. This study presents a secondary
          analysis of two disparity datasets examining public contracting in Cuyahoga County, Ohio.
        </p>
        <p style={pStyle}>
          Across the datasets examined, approximately <strong>$1,620,965,288</strong> in county
          contracting activity is analyzed. Using the standard disparity-study framework comparing
          marketplace availability with contract utilization, this research estimates the economic
          magnitude of contracting disparities affecting Black American–owned firms.
        </p>
        <p style={pStyle}>
          The analysis finds that Black-owned firms received approximately{" "}
          <strong>$38,193,772.82</strong> in contracts, while availability-based modeling indicates
          that approximately <strong>$183,604,870.47</strong> would be expected if utilization
          reflected marketplace availability. This difference represents an estimated
          availability-based contracting opportunity gap of approximately{" "}
          <strong>$145,411,097.65</strong>.
        </p>
        <p style={pStyle}>
          A population-based allocation model derived from demographic data reported in the American
          Community Survey further indicates that approximately{" "}
          <strong>$491,152,482.26</strong> in contracts would correspond to the Black share of the
          county population if procurement participation reflected population distribution.
        </p>
        <p style={{ ...pStyle, marginBottom:0 }}>
          The study proposes the Green Line Project, a structural policy framework designed to address
          disparities affecting Black Americans. Within this framework, one central pillar focuses on
          restructuring county contracting and procurement systems to address disparities identified
          in this analysis.
        </p>
      </div>

      {/* Introduction */}
      <h2 style={h2Style}>Introduction</h2>
      <p style={pStyle}>
        Public procurement programs distribute substantial public funds to private firms responsible
        for infrastructure development, services, and operational support across local economies.
        Because these programs influence access to economic opportunity, governments frequently
        commission disparity studies to evaluate whether firms owned by minorities and women
        participate in contracting systems at rates proportional to their availability in the
        marketplace.
      </p>
      <p style={pStyle}>
        Cuyahoga County has conducted disparity studies examining the distribution of county
        contracting expenditures. These studies provide empirical evidence used to evaluate
        procurement participation and inform policy decisions.
      </p>
      <p style={pStyle}>
        This study presents a secondary analysis of those datasets and introduces an analytical
        framework designed to further examine participation patterns affecting Black Americans in
        county contracting systems.
      </p>

      <hr style={hrStyle} />

      {/* Legal and Analytical Framework */}
      <h2 style={h2Style}>Legal and Analytical Framework</h2>
      <p style={pStyle}>
        Disparity studies evaluate procurement participation using the disparity index:
      </p>
      <code style={codeStyle}>Disparity Index = (Utilization ÷ Availability) × 100</code>
      <p style={pStyle}>
        A disparity index of 100 indicates parity between contract utilization and marketplace
        availability. Values below 80 are commonly interpreted as evidence of substantial disparity.
      </p>
      <p style={pStyle}>
        This analytical framework reflects the evidentiary standard established by the United States
        Supreme Court decision in{" "}
        <em>City of Richmond v. J.A. Croson Co.</em> (1989), which requires governments to
        demonstrate empirical evidence of disparity before implementing race-conscious procurement
        programs.
      </p>

      <hr style={hrStyle} />

      {/* Data Sources */}
      <h2 style={h2Style}>Data Sources</h2>

      <div style={{
        background:C.forestBg, border:`1px solid ${C.forest}40`,
        borderRadius:6, padding:"16px 20px", marginBottom:16,
        borderLeft:`4px solid ${C.forest}`
      }}>
        <div style={{
          fontFamily:"'IBM Plex Mono',monospace", fontSize:9, color:C.forest,
          letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:10
        }}>Griffin &amp; Strong Disparity Study</div>
        <p style={pStyle}>
          The Griffin &amp; Strong disparity study examined approximately{" "}
          <strong>$1,114,965,288</strong> in prime contracting expenditures.
        </p>
        <p style={{ ...pStyle, marginBottom:8 }}>
          Category-level utilization tables indicate that Black-owned firms received the following
          prime contract amounts:
        </p>
        <ul style={{
          fontFamily:"'IBM Plex Mono',monospace", fontSize:10, color:C.inkMid,
          lineHeight:1.9, margin:"0 0 12px", paddingLeft:20
        }}>
          <li>Construction — $830,461.50</li>
          <li>Professional Services — $145,372.00</li>
          <li>Other Services — $944,336.44</li>
          <li>Architecture &amp; Engineering — $600,000.00</li>
          <li>Goods &amp; Supplies — $193,002.88</li>
        </ul>
        <p style={{ ...pStyle, marginBottom:0 }}>
          These values produce a combined Black prime contract total of{" "}
          <strong>$2,713,172.82</strong> (Griffin &amp; Strong, 2020, pp. 61–72). The same section
          of the report provides marketplace availability estimates used to calculate expected
          participation levels.
        </p>
      </div>

      <div style={{
        background:C.slateBg, border:`1px solid ${C.slate}40`,
        borderRadius:6, padding:"16px 20px", marginBottom:16,
        borderLeft:`4px solid ${C.slate}`
      }}>
        <div style={{
          fontFamily:"'IBM Plex Mono',monospace", fontSize:9, color:C.slate,
          letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:10
        }}>Cuyahoga County 2025 Disparity Study</div>
        <p style={pStyle}>
          The second dataset examined in this research is drawn from the Cuyahoga County 2025
          Disparity Study Final Summary Report prepared by Keen Independent Research LLC.
        </p>
        <p style={{ ...pStyle, marginBottom:8 }}>
          This dataset examined approximately <strong>$506,000,000</strong> in procurement activity
          across 5,731 procurement elements.
        </p>
        <ul style={{
          fontFamily:"'IBM Plex Mono',monospace", fontSize:10, color:C.inkMid,
          lineHeight:1.9, margin:"0 0 0", paddingLeft:20
        }}>
          <li>Black firm availability: 15.92%</li>
          <li>Black firm utilization: 7.01%</li>
        </ul>
        <p style={{ ...pStyle, marginTop:8, marginBottom:0, fontSize:10, color:C.inkLight }}>
          (Keen Independent Research LLC, 2025)
        </p>
      </div>

      <div style={{
        background:C.card, border:`1px solid ${C.border}`,
        borderRadius:6, padding:"14px 20px", marginBottom:20
      }}>
        <div style={{
          fontFamily:"'IBM Plex Mono',monospace", fontSize:9, color:C.inkLight,
          letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:8
        }}>Total Procurement Analyzed</div>
        <code style={{ ...codeStyle, margin:0 }}>
          $1,114,965,288 + $506,000,000 = $1,620,965,288
        </code>
      </div>

      <hr style={hrStyle} />

      {/* Methodology */}
      <h2 style={h2Style}>Methodology</h2>
      <p style={pStyle}>
        This study performs a secondary analysis of disparity datasets by restructuring ownership
        categories in order to isolate participation patterns affecting Black Americans.
      </p>
      <p style={{ ...pStyle, marginBottom:8 }}>
        The analytical framework groups firms into three categories:
      </p>
      <ol style={{
        fontFamily:"'IBM Plex Sans',sans-serif", fontSize:12, color:C.inkMid,
        lineHeight:1.9, margin:"0 0 14px", paddingLeft:22
      }}>
        <li>Majority-owned firms and White women-owned firms (aggregated)</li>
        <li>Black American–owned firms (disaggregated from the broader Minority Business Enterprise category)</li>
        <li>Remaining minority ownership categories</li>
      </ol>
      <p style={pStyle}>
        This restructuring is applied solely for analytical interpretation and does not alter the
        underlying disparity-study calculations.
      </p>

      <hr style={hrStyle} />

      {/* Opportunity Gap Analysis */}
      <h2 style={h2Style}>Availability-Based Opportunity Gap Analysis</h2>
      <p style={pStyle}>
        To estimate the economic magnitude of disparities, utilization and availability percentages
        are translated into contract dollar values.
      </p>
      <code style={codeStyle}>Expected Contracts = Availability × Total Contract Value</code>
      <code style={codeStyle}>Opportunity Gap = Expected − Actual</code>

      <div style={{
        display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, margin:"20px 0"
      }}>
        <div style={{
          background:C.forestBg, border:`1px solid ${C.forest}40`,
          borderRadius:6, padding:"16px 20px",
          borderTop:`3px solid ${C.forest}`
        }}>
          <div style={{
            fontFamily:"'IBM Plex Mono',monospace", fontSize:9, color:C.forest,
            letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:10
          }}>Griffin &amp; Strong Opportunity Gap</div>
          <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:10,
            color:C.inkMid, lineHeight:1.9 }}>
            <div>Expected: <strong style={{ color:C.ink }}>$103,049,670.47</strong></div>
            <div>Actual: <strong style={{ color:C.ink }}>$2,713,172.82</strong></div>
            <div style={{ marginTop:6, color:C.alert }}>
              Gap: <strong>$100,336,497.65</strong>
            </div>
          </div>
        </div>
        <div style={{
          background:C.slateBg, border:`1px solid ${C.slate}40`,
          borderRadius:6, padding:"16px 20px",
          borderTop:`3px solid ${C.slate}`
        }}>
          <div style={{
            fontFamily:"'IBM Plex Mono',monospace", fontSize:9, color:C.slate,
            letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:10
          }}>Keen 2025 Opportunity Gap</div>
          <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:10,
            color:C.inkMid, lineHeight:1.9 }}>
            <div>Expected: <strong style={{ color:C.ink }}>$80,555,200.00</strong></div>
            <div>Actual: <strong style={{ color:C.ink }}>$35,480,600.00</strong></div>
            <div style={{ marginTop:6, color:C.alert }}>
              Gap: <strong>$45,074,600.00</strong>
            </div>
          </div>
        </div>
      </div>

      <div style={{
        background:C.alertBg, border:`1px solid ${C.alert}40`,
        borderRadius:6, padding:"16px 20px", marginBottom:20,
        borderTop:`3px solid ${C.alert}`
      }}>
        <div style={{
          fontFamily:"'IBM Plex Mono',monospace", fontSize:9, color:C.alert,
          letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:10
        }}>Combined Availability-Based Gap</div>
        <div style={{ display:"flex", gap:24, flexWrap:"wrap" }}>
          {[
            ["Expected Black Participation", "$183,604,870.47"],
            ["Actual Black Contracts",        "$38,193,772.82" ],
            ["Availability-Based Gap",        "$145,411,097.65"],
          ].map(([lbl, val]) => (
            <div key={lbl}>
              <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:8,
                color:C.inkFaint, letterSpacing:"0.06em", textTransform:"uppercase",
                marginBottom:4 }}>{lbl}</div>
              <div style={{ fontFamily:"'Playfair Display',serif", fontSize:18,
                fontWeight:700, color:C.alert }}>{val}</div>
            </div>
          ))}
        </div>
      </div>

      <hr style={hrStyle} />

      {/* Population-Based Allocation Model */}
      <h2 style={h2Style}>Population-Based Allocation Model</h2>
      <p style={pStyle}>
        Population estimates for Cuyahoga County are derived from the American Community Survey
        DP05 dataset. Total county population: <strong>1,240,594</strong>. Black population
        share: <strong>30.3%</strong> (U.S. Census Bureau, 2023).
      </p>
      <code style={codeStyle}>0.303 × $1,620,965,288 = $491,152,482.26</code>

      <div style={{
        background:C.goldBg, border:`1px solid ${C.gold}40`,
        borderRadius:6, padding:"16px 20px", marginBottom:20,
        borderTop:`3px solid ${C.gold}`
      }}>
        <div style={{ display:"flex", gap:24, flexWrap:"wrap" }}>
          {[
            ["Expected (Population Model)", "$491,152,482.26", C.gold],
            ["Actual Contracts Received",   "$38,193,772.82",  C.inkMid],
            ["Population-Based Gap",        "$452,958,709.44", C.alert],
          ].map(([lbl, val, col]) => (
            <div key={lbl}>
              <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:8,
                color:C.inkFaint, letterSpacing:"0.06em", textTransform:"uppercase",
                marginBottom:4 }}>{lbl}</div>
              <div style={{ fontFamily:"'Playfair Display',serif", fontSize:18,
                fontWeight:700, color:col }}>{val}</div>
            </div>
          ))}
        </div>
      </div>

      <hr style={hrStyle} />

      {/* Interactive Analytical Model */}
      <h2 style={h2Style}>Interactive Analytical Model</h2>
      <p style={pStyle}>
        An interactive analytical model accompanying this research is available at{" "}
        <a href="https://shabazzresearch.com" target="_blank" rel="noopener noreferrer"
          style={{ color:C.slate }}>ShabazzResearch.com</a>.
      </p>
      <p style={pStyle}>
        The model allows users to examine contract totals, availability estimates, utilization rates,
        expected contract values, and opportunity gap calculations derived from the datasets analyzed
        in this study.
      </p>
      <p style={pStyle}>
        The model functions as a transparent computational extension of the analysis presented in
        this paper.
      </p>

      <hr style={hrStyle} />

      {/* Policy Implications */}
      <h2 style={h2Style}>Policy Implications: The Green Line Project</h2>
      <div style={{
        background:C.forestBg, border:`1px solid ${C.forest}40`,
        borderRadius:6, padding:"16px 20px", marginBottom:16,
        borderLeft:`4px solid ${C.forest}`
      }}>
        <p style={pStyle}>
          The Green Line Project is a structural policy framework designed to address disparities
          affecting Black Americans.
        </p>
        <p style={pStyle}>
          Within this framework, one central pillar focuses specifically on overhauling county
          contracting and procurement systems. The goal of this pillar is to address disparities in
          contracting participation identified through the availability-based analysis presented in
          this research.
        </p>
        <p style={{ ...pStyle, marginBottom:0 }}>
          Because public procurement represents a major channel through which governments distribute
          economic opportunity, reforms in contracting systems have the potential to significantly
          influence the distribution of economic resources within the county.
        </p>
      </div>

      <hr style={hrStyle} />

      {/* Conclusion */}
      <h2 style={h2Style}>Conclusion</h2>
      <p style={pStyle}>
        This study presents a secondary analysis of two disparity datasets examining approximately
        $1.62 billion in county contracting activity.
      </p>
      <p style={pStyle}>
        Across these datasets, Black-owned firms received approximately $38.19 million in contracts,
        while availability-based modeling suggests that approximately $183.60 million would be
        expected if participation reflected marketplace availability.
      </p>
      <p style={pStyle}>
        This difference represents an estimated availability-based contracting opportunity gap of
        approximately $145.41 million.
      </p>
      <p style={pStyle}>
        A population-based allocation model further indicates that approximately $491.15 million in
        contracts would correspond to the Black share of the county population.
      </p>
      <p style={pStyle}>
        These findings indicate that structural policy responses may be warranted to address
        persistent disparities in public procurement participation. The Green Line Project is proposed
        as one framework through which these disparities may be addressed.
      </p>

      <hr style={hrStyle} />

      {/* References */}
      <h2 style={h2Style}>References</h2>
      <div style={{ marginTop:12 }}>
        <p style={refStyle}>
          Griffin &amp; Strong, P.C. (2020). <em>Cuyahoga County disparity study.</em> Prepared for
          Cuyahoga County.
        </p>
        <p style={refStyle}>
          Keen Independent Research LLC. (2025). <em>Cuyahoga County 2025 disparity study: Final
          summary report.</em> Prepared for Cuyahoga County.
        </p>
        <p style={refStyle}>
          U.S. Census Bureau. (2023). <em>American Community Survey DP05: Demographic and housing
          estimates.</em>{" "}
          <a href="https://data.census.gov/table/ACSDP5Y2023.DP05" target="_blank"
            rel="noopener noreferrer" style={{ color:C.slate, wordBreak:"break-all" }}>
            https://data.census.gov/table/ACSDP5Y2023.DP05
          </a>
        </p>
      </div>

    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SHELL
// ═══════════════════════════════════════════════════════════════════════════════
const TABS = [
  { id:"narrative", label:"00 · Narrative"                        },
  { id:"viewA",     label:"01 · MBE/WBE Study Framework"        },
  { id:"viewB",     label:"02 · 3-Group Research Framework"      },
  { id:"gspc",      label:"03 · GSPC 2020"                       },
  { id:"greenline", label:"04 · Green Line Project"              },
  { id:"sources",   label:"05 · Sources"                         },
];

export default function App() {
  const [tab, setTab] = useState("narrative");
  const panels = {
    narrative:<PanelNarrative/>,
    viewA:<PanelViewA/>, viewB:<PanelViewB/>, gspc:<PanelGSPC/>,
    greenline:<PanelGreenLine/>, sources:<PanelSources/>
  };

  return (
    <div style={{ background:C.bg, minHeight:"100vh", color:C.ink }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,900;1,400;1,700&family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        ::-webkit-scrollbar{width:6px;height:6px;}
        ::-webkit-scrollbar-track{background:${C.bgStripe};}
        ::-webkit-scrollbar-thumb{background:${C.border};border-radius:3px;}
        a{transition:color 0.12s;}
        button{transition:all 0.15s;}
        body{font-family:'IBM Plex Sans',sans-serif;}
      `}</style>

      {/* Header */}
      <div style={{
        background:C.ink, color:C.bg,
        padding:"22px 36px 18px",
        borderBottom:`1px solid ${C.inkMid}`
      }}>
        {/* Masthead rule */}
        <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:14 }}>
          <div style={{ flex:1, height:1, background:C.inkMid }} />
          <span style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:8,
            color:C.inkLight, letterSpacing:"0.2em", textTransform:"uppercase",
            whiteSpace:"nowrap" }}>
            Disparity Index = (Utilization ÷ Availability) × 100
          </span>
          <div style={{ flex:1, height:1, background:C.inkMid }} />
        </div>

        <div style={{ display:"flex", alignItems:"flex-end", justifyContent:"space-between",
          flexWrap:"wrap", gap:12, marginBottom:14 }}>
          <div>
            <h1 style={{
              fontFamily:"'Playfair Display',serif", fontSize:26, fontWeight:900,
              color:C.bg, margin:0, letterSpacing:"-0.02em", lineHeight:1.1
            }}>
              Cuyahoga County Disparity Studies
            </h1>
            <div style={{ fontFamily:"'Playfair Display',serif", fontSize:14, fontStyle:"italic",
              color:C.inkLight, marginTop:4 }}>2020 &amp; 2025 · Research Analysis</div>
          </div>
          <div style={{ textAlign:"right" }}>
            <div style={{ fontFamily:"'IBM Plex Sans',sans-serif", fontSize:11,
              fontWeight:600, color:C.bg }}>Tariq Shabazz, M.P.P.</div>
            <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:8,
              color:C.inkLight, marginTop:2 }}>Cuyahoga County, Ohio</div>
          </div>
        </div>

        <div style={{ display:"flex", gap:8, flexWrap:"wrap", alignItems:"center" }}>
          <PDFLink />
          <WebLink url="https://cuyahogacounty.gov/docs/default-source/council/synapse/idlt_323538_file_100021777_20210408-ccwhl-agendattach.pdf"
            label="GSPC 2020 Study PDF" compact />
          <WebLink url="https://supreme.justia.com/cases/federal/us/488/469/"
            label="Croson (1989)" compact />
          <WebLink url="https://data.census.gov/table/ACSDP5Y2023.DP05?g=050XX00US39035"
            label="ACS DP05 2023" compact />
        </div>
      </div>

      {/* Tabs */}
      <div style={{
        display:"flex", gap:0, padding:"0 36px",
        background:C.cardSunk, borderBottom:`2px solid ${C.ink}`,
        overflowX:"auto"
      }}>
        {TABS.map(t=>{
          const a = tab===t.id;
          const isGL = t.id==="greenline";
          return (
            <button key={t.id} onClick={()=>setTab(t.id)} style={{
              padding:"10px 18px",
              fontFamily:"'IBM Plex Mono',monospace", fontSize:9,
              fontWeight:a?600:400,
              color: a ? C.ink : isGL ? GL : C.inkLight,
              background:a?C.bg:"transparent",
              border:"none",
              borderTop:a?`3px solid ${isGL?GL:C.ink}`:"3px solid transparent",
              borderBottom:"none",
              cursor:"pointer", whiteSpace:"nowrap",
              letterSpacing:"0.03em"
            }}>{t.label}</button>
          );
        })}
      </div>

      {/* Content */}
      <div style={{ padding:"30px 36px", maxWidth:1080, margin:"0 auto" }}>
        {panels[tab]}
      </div>

      {/* Footer */}
      <div style={{
        padding:"14px 36px",
        borderTop:`1px solid ${C.border}`,
        background:C.cardSunk,
        display:"flex", gap:10, flexWrap:"wrap", alignItems:"center"
      }}>
        <PDFLink compact />
        <WebLink url="https://cuyahogacounty.gov/docs/default-source/council/synapse/idlt_323538_file_100021777_20210408-ccwhl-agendattach.pdf"
          label="GSPC 2020" compact />
        <span style={{
          fontFamily:"'IBM Plex Mono',monospace", fontSize:8,
          color:C.inkFaint, marginLeft:"auto"
        }}>
          Analysis: Tariq Shabazz M.P.P. · Figures verified against source documents
        </span>
      </div>
    </div>
  );
}
