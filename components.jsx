// ============================================================
// TMA KPI Portal — Shared atoms: icons, badges, charts
// ============================================================
const { useState, useEffect, useMemo, useRef } = React;

// ---------- Icons (single-file SVG set) ----------
const Icon = ({ name, size = 16, color = "currentColor", stroke = 1.75 }) => {
  const p = {
    home: "M3 11l9-8 9 8M5 9v11h4v-6h6v6h4V9",
    kpis: "M4 19V5m0 14h16M8 15V9m4 6V6m4 9v-4",
    scorecard: "M6 3h12a1 1 0 0 1 1 1v16l-4-2-3 2-3-2-4 2V4a1 1 0 0 1 1-1zM8 8h8M8 12h6M8 16h4",
    library: "M4 5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16l-7-3-7 3V5zm4 2h6",
    history: "M3 12a9 9 0 1 0 3-6.7M3 4v5h5M12 7v5l3 2",
    team: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm13 10v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75",
    bell: "M18 16v-5a6 6 0 0 0-12 0v5l-2 2h16l-2-2zM10 20a2 2 0 0 0 4 0",
    help: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zm-1.5-8.5a1.5 2 0 1 1 2.5 1.5c-1 .5-1 1-1 2M12 17.5v.01",
    search: "M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm10 2l-4.3-4.3",
    download: "M12 3v12m-5-5l5 5 5-5M5 21h14",
    print: "M6 9V3h12v6M6 18H4a1 1 0 0 1-1-1v-5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v5a1 1 0 0 1-1 1h-2M6 14h12v7H6v-7z",
    filter: "M4 5h16l-6 8v6l-4 2v-8L4 5z",
    check: "M5 13l4 4L19 7",
    x: "M6 6l12 12M18 6L6 18",
    chev: "M9 6l6 6-6 6",
    chevd: "M6 9l6 6 6-6",
    chevu: "M6 15l6-6 6 6",
    up: "M12 19V5M5 12l7-7 7 7",
    down: "M12 5v14M5 12l7 7 7-7",
    right: "M5 12h14M13 5l7 7-7 7",
    calendar: "M8 3v4m8-4v4M3 9h18M5 5h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z",
    pencil: "M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z",
    file:  "M6 3h9l5 5v13a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zm9 0v5h5",
    comment: "M4 4h16v11H7l-3 3V4z",
    trend:   "M3 17l6-6 4 4 8-8M15 7h6v6",
    info:    "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zm0-13.5v.01M11 11h1v5h1",
    warn:    "M12 2l10 18H2L12 2zm0 7v5m0 3v.01",
    clock:   "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zm0-14v5l3 2",
    dot:     "M12 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2z",
    menu:    "M4 6h16M4 12h16M4 18h16",
    plane:   "M2 16l7-4-4-7 2-1 6 5 6-3 2 2-3 6 5 6-1 2-7-4-4 7H10l2-5-5-2z",
    settings:"M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm7-3l2-1-2-3-2 1a7 7 0 0 0-2-1V5h-4v2a7 7 0 0 0-2 1l-2-1-2 3 2 1a7 7 0 0 0 0 2l-2 1 2 3 2-1a7 7 0 0 0 2 1v2h4v-2a7 7 0 0 0 2-1l2 1 2-3-2-1a7 7 0 0 0 0-2z",
    approve: "M9 12l2 2 4-4M12 3l9 4v5a9 9 0 0 1-9 9 9 9 0 0 1-9-9V7l9-4z",
    logout:  "M15 17l5-5-5-5M20 12H9M13 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h8",
    excel:   "M6 3h9l5 5v13a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zM9 13l6 6m0-6l-6 6",
    sparkle: "M12 3l2 5 5 2-5 2-2 5-2-5-5-2 5-2 2-5z",
    book:    "M4 4h6a3 3 0 0 1 3 3v13a2 2 0 0 0-2-2H4V4zm16 0h-6a3 3 0 0 0-3 3v13a2 2 0 0 1 2-2h7V4z",
    award:   "M12 15a5 5 0 1 0 0-10 5 5 0 0 0 0 10zm-3 1l-1 6 4-2 4 2-1-6",
    edit:    "M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z",
    lock:    "M5 11h14v10H5V11zm2 0V8a5 5 0 0 1 10 0v3",
    graduation: "M2 9l10-5 10 5-10 5L2 9zm4 3v5c0 1.5 3 3 6 3s6-1.5 6-3v-5",
  }[name] || "";
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={p} />
    </svg>
  );
};

// ---------- Achievement badge ----------
const statusMeta = {
  on_track: { cls: "green", label: "On Track" },
  at_risk:  { cls: "amber", label: "At Risk"  },
  behind:   { cls: "red",   label: "Behind"   },
};
const AchBadge = ({ status, pct }) => {
  const m = statusMeta[status] || statusMeta.on_track;
  return (
    <span className={`ach ach--${m.cls}`}>
      <span className="dot" />
      {m.label}
      {pct !== undefined && <span style={{opacity:.7, marginLeft:2, fontWeight:600}}>· {pct.toFixed(0)}%</span>}
    </span>
  );
};

const bscColor = (k) => `var(--bsc-${k})`;
const BscBadge = ({ k, withLabel = false }) => (
  <span className="bsc-badge">
    <span className="bsc-dot" style={{ background: bscColor(k) }} />
    {withLabel ? window.BSC[k].label : k}
  </span>
);

// Derive status for an achievement %
const statusFor = (pct) => pct >= 90 ? "on_track" : pct >= 70 ? "at_risk" : "behind";
const colorFor = (pct) => pct >= 90 ? "var(--green)" : pct >= 70 ? "var(--amber)" : "var(--red)";

// ---------- Sparkline ----------
const Sparkline = ({ data, width = 90, height = 26, color = "var(--navy2)", gate, target }) => {
  const pts = data.filter((v) => v != null);
  if (!pts.length) return <span style={{ color: "var(--text3)", fontSize: 11 }}>—</span>;
  const min = Math.min(...pts, gate ?? Infinity, target ?? Infinity);
  const max = Math.max(...pts, gate ?? -Infinity, target ?? -Infinity);
  const range = max - min || 1;
  const xs = (i) => (i / Math.max(pts.length - 1, 1)) * (width - 4) + 2;
  const ys = (v) => height - 3 - ((v - min) / range) * (height - 6);
  const d = pts.map((v, i) => `${i === 0 ? "M" : "L"}${xs(i).toFixed(1)} ${ys(v).toFixed(1)}`).join(" ");
  const last = pts[pts.length - 1];
  return (
    <svg className="spark" width={width} height={height}>
      {target != null && <line x1="0" x2={width} y1={ys(target)} y2={ys(target)} stroke="var(--green)" strokeDasharray="2 2" strokeWidth="1" opacity=".5" />}
      {gate   != null && <line x1="0" x2={width} y1={ys(gate)}   y2={ys(gate)}   stroke="var(--amber)" strokeDasharray="2 2" strokeWidth="1" opacity=".5" />}
      <path d={d} fill="none" stroke={color} strokeWidth="1.5" />
      <circle cx={xs(pts.length - 1)} cy={ys(last)} r="2.2" fill={color} />
    </svg>
  );
};

// ---------- BSC pie chart ----------
const Pie = ({ data, size = 160, innerRatio = 0.55, showLegend = true }) => {
  // data: [{key, value, color, label}]
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  const r = size / 2, ri = r * innerRatio;
  let a0 = -Math.PI / 2;
  const arcs = data.map((d) => {
    const a1 = a0 + (d.value / total) * Math.PI * 2;
    const large = a1 - a0 > Math.PI ? 1 : 0;
    const x0 = r + r * Math.cos(a0), y0 = r + r * Math.sin(a0);
    const x1 = r + r * Math.cos(a1), y1 = r + r * Math.sin(a1);
    const xi0 = r + ri * Math.cos(a0), yi0 = r + ri * Math.sin(a0);
    const xi1 = r + ri * Math.cos(a1), yi1 = r + ri * Math.sin(a1);
    const path = `M ${x0} ${y0} A ${r} ${r} 0 ${large} 1 ${x1} ${y1} L ${xi1} ${yi1} A ${ri} ${ri} 0 ${large} 0 ${xi0} ${yi0} Z`;
    const seg = { path, color: d.color, label: d.label, value: d.value, key: d.key, pct: (d.value/total)*100 };
    a0 = a1;
    return seg;
  });
  return (
    <div style={{ display: "flex", gap: 18, alignItems: "center", flexWrap: "wrap" }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {arcs.map((a, i) => <path key={i} d={a.path} fill={a.color} stroke="#fff" strokeWidth="1.5" />)}
        <text x={r} y={r - 3} textAnchor="middle" fontFamily="Merriweather" fontWeight="900" fontSize={size/6.2} fill="var(--navy)">
          {total}%
        </text>
        <text x={r} y={r + size/12} textAnchor="middle" fontSize="9" letterSpacing="1" fill="var(--text3)" fontWeight="700">WEIGHT</text>
      </svg>
      {showLegend && (
        <div style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 12 }}>
          {arcs.map((a, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span className="bsc-dot" style={{ background: a.color }} />
              <span style={{ flex: 1, color: "var(--text2)" }}>{a.label}</span>
              <b style={{ fontVariantNumeric: "tabular-nums" }}>{a.value}%</b>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ---------- KPI Meter (horizontal bar with Gate & Target markers) ----------
const KpiMeter = ({ ytd, gate, target, direction = "higher_better", unit = "", size = "lg" }) => {
  // We scale relative to max(target, ytd) * 1.15 so all markers visible
  const maxRef = direction === "higher_better"
    ? Math.max(target, ytd, gate) * 1.15
    : Math.max(target, ytd, gate) * 1.15;
  const minRef = direction === "higher_better"
    ? 0
    : 0;
  const pct = (v) => Math.max(0, Math.min(1, (v - minRef) / (maxRef - minRef))) * 100;
  const achievement = direction === "higher_better"
    ? Math.min(100, (ytd / target) * 100)
    : Math.min(100, (target / Math.max(ytd, 0.0001)) * 100);

  return (
    <div style={{ width: "100%" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10 }}>
        <div>
          <span style={{ fontSize: 11, color: "var(--text3)", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".06em" }}>YTD Actual</span>
          <div className="serif" style={{ fontSize: size === "lg" ? 38 : 24, color: colorFor(achievement), lineHeight: 1 }}>
            {ytd}<span style={{ fontSize: 14, color: "var(--text3)", marginLeft: 4 }}>{unit}</span>
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <span style={{ fontSize: 11, color: "var(--text3)", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".06em" }}>Achievement</span>
          <div className="serif" style={{ fontSize: size === "lg" ? 30 : 20, color: "var(--navy)", lineHeight: 1 }}>
            {achievement.toFixed(1)}<span style={{ fontSize: 14, color: "var(--text3)" }}>%</span>
          </div>
        </div>
      </div>
      <div className="kpi-bar" style={{ marginBottom: 26 }}>
        <div className="kpi-bar__fill" style={{ width: `${pct(ytd)}%`, background: colorFor(achievement) }} />
        <div className="kpi-bar__mk" data-lbl={`Gate ${gate}${unit}`}
          style={{ left: `${pct(gate)}%`, background: "var(--amber)" }} />
        <div className="kpi-bar__mk" data-lbl={`Target ${target}${unit}`}
          style={{ left: `${pct(target)}%`, background: "var(--green)" }} />
      </div>
    </div>
  );
};

// ---------- Bar chart with Gate/Target reference lines ----------
const BarChart = ({ data, gate, target, unit, direction = "higher_better", height = 220 }) => {
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const vals = data.filter((v) => v != null);
  const allRef = [...vals, gate, target].filter((v) => v != null);
  const min = Math.min(...allRef, 0);
  const max = Math.max(...allRef) * 1.15;
  const W = 620, H = height, pad = { l: 36, r: 12, t: 14, b: 24 };
  const iw = W - pad.l - pad.r, ih = H - pad.t - pad.b;
  const bw = iw / 12 * 0.7;
  const gap = iw / 12;
  const y = (v) => pad.t + ih - ((v - min) / (max - min)) * ih;
  const x = (i) => pad.l + gap * i + (gap - bw) / 2;
  const ticks = 4;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: W }}>
      {/* grid */}
      {Array.from({ length: ticks + 1 }).map((_, i) => {
        const v = min + ((max - min) / ticks) * (ticks - i);
        return (
          <g key={i}>
            <line x1={pad.l} x2={W - pad.r} y1={y(v)} y2={y(v)} stroke="var(--border)" strokeWidth="1" />
            <text x={pad.l - 6} y={y(v) + 3} textAnchor="end" fontSize="9.5" fill="var(--text3)" fontVariantNumeric="tabular-nums">{Math.round(v)}</text>
          </g>
        );
      })}
      {/* bars */}
      {data.map((v, i) => {
        if (v == null) return <rect key={i} x={x(i)} y={y(0)-2} width={bw} height="2" fill="var(--border)" />;
        const ach = direction === "higher_better"
          ? (v / target) * 100
          : (target / v) * 100;
        const color = colorFor(Math.min(100, ach));
        const yv = y(v);
        return (
          <g key={i}>
            <rect x={x(i)} y={yv} width={bw} height={Math.max(1, y(min) - yv)} fill={color} rx="2" />
            <text x={x(i) + bw/2} y={yv - 3} textAnchor="middle" fontSize="9.5" fontWeight="700" fill="var(--text)">{v}</text>
          </g>
        );
      })}
      {/* target & gate lines */}
      <line x1={pad.l} x2={W - pad.r} y1={y(target)} y2={y(target)} stroke="var(--green)" strokeDasharray="4 3" strokeWidth="1.4" />
      <text x={W - pad.r - 4} y={y(target) - 4} textAnchor="end" fontSize="10" fontWeight="700" fill="var(--green)">TARGET {target}{unit}</text>
      <line x1={pad.l} x2={W - pad.r} y1={y(gate)} y2={y(gate)} stroke="var(--amber)" strokeDasharray="4 3" strokeWidth="1.4" />
      <text x={W - pad.r - 4} y={y(gate) - 4} textAnchor="end" fontSize="10" fontWeight="700" fill="var(--amber)">GATE {gate}{unit}</text>
      {/* x labels */}
      {months.map((m, i) => (
        <text key={m} x={x(i) + bw/2} y={H - 8} textAnchor="middle" fontSize="9.5" fill="var(--text3)">{m}</text>
      ))}
    </svg>
  );
};

// ---------- Line chart (multi-year) ----------
const LineChart = ({ rows, height = 220 }) => {
  // rows: [{ year, value }]
  const W = 620, H = height, pad = { l: 36, r: 14, t: 14, b: 26 };
  const iw = W - pad.l - pad.r, ih = H - pad.t - pad.b;
  const vals = rows.map((r) => r.value);
  const min = Math.max(0, Math.min(...vals) - 8);
  const max = Math.min(100, Math.max(...vals) + 6);
  const x = (i) => pad.l + (iw / Math.max(rows.length - 1, 1)) * i;
  const y = (v) => pad.t + ih - ((v - min) / (max - min)) * ih;
  const d = rows.map((r, i) => `${i === 0 ? "M" : "L"}${x(i)} ${y(r.value)}`).join(" ");
  const area = `${d} L ${x(rows.length - 1)} ${y(min)} L ${x(0)} ${y(min)} Z`;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: W }}>
      <defs>
        <linearGradient id="areaGrad" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="var(--gold)" stopOpacity=".35" />
          <stop offset="100%" stopColor="var(--gold)" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0, .25, .5, .75, 1].map((t, i) => {
        const v = min + (max - min) * (1 - t);
        return (
          <g key={i}>
            <line x1={pad.l} x2={W - pad.r} y1={pad.t + ih * t} y2={pad.t + ih * t} stroke="var(--border)" />
            <text x={pad.l - 6} y={pad.t + ih * t + 3} textAnchor="end" fontSize="9.5" fill="var(--text3)">{Math.round(v)}</text>
          </g>
        );
      })}
      <path d={area} fill="url(#areaGrad)" />
      <path d={d} fill="none" stroke="var(--navy)" strokeWidth="2.2" />
      {rows.map((r, i) => (
        <g key={r.year}>
          <circle cx={x(i)} cy={y(r.value)} r="4.5" fill="#fff" stroke="var(--navy)" strokeWidth="2" />
          <text x={x(i)} y={y(r.value) - 10} textAnchor="middle" fontSize="10.5" fontWeight="800" fill="var(--navy)">{r.value.toFixed(1)}%</text>
          <text x={x(i)} y={H - 8} textAnchor="middle" fontSize="10" fontWeight="700" fill="var(--text2)">{r.year}</text>
        </g>
      ))}
    </svg>
  );
};

Object.assign(window, { Icon, AchBadge, BscBadge, Sparkline, Pie, KpiMeter, BarChart, LineChart, statusFor, colorFor, bscColor });
