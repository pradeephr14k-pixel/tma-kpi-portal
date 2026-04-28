// ============================================================
// TMA KPI Portal — Screens (Dashboard, My KPIs, KPI Detail drawer, Scorecard,
// History, Team, Library, Notifications, Help)
// ============================================================
const { useState: sUseState, useMemo: sUseMemo } = React;

// Utility — compute rolled-up employee stats from KPIS
const rollup = () => {
  const overall = KPIS.reduce((s, k) => s + (k.achievement * k.weight) / 100, 0);
  const weightByBsc = KPIS.reduce((acc, k) => { acc[k.bsc] = (acc[k.bsc] || 0) + k.weight; return acc; }, {});
  const atRisk = KPIS.filter((k) => k.status === "at_risk").length;
  const behind = KPIS.filter((k) => k.status === "behind").length;
  const status = behind ? "Behind" : atRisk ? "At Risk" : "On Track";
  return { overall, weightByBsc, status, atRisk, behind };
};

// ============================================================
// DASHBOARD
// ============================================================
function DashboardScreen({ goto, openKpi }) {
  const { overall, weightByBsc, status } = sUseMemo(rollup, []);
  const pieData = Object.keys(BSC).map((k) => ({
    key: k, value: weightByBsc[k] || 0, color: `var(--bsc-${k})`, label: BSC[k].label,
  })).filter((d) => d.value > 0);

  const statusPill = status === "On Track" ? "green" : status === "At Risk" ? "amber" : "red";

  return (
    <div data-screen-label="02 Dashboard">
      <Breadcrumb trail={[{ label: "Home" }, { label: "Dashboard" }]} />
      <div className="welcome">
        <div style={{ position: "relative", zIndex: 1 }}>
          <span className="welcome__pill"><Icon name="calendar" size={11} color="var(--gold2)" /> {CYCLE.year} KPI Cycle · {CYCLE.quarter} {CYCLE.status}</span>
          <h2 style={{ marginTop: 8 }}>Welcome back, {USER.name.split(" ")[0]}.</h2>
          <p>Here's your performance snapshot as of May 2026. Next review scheduled for {CYCLE.nextReview}.</p>
        </div>
        <div className="welcome__actions">
          <button className="btn btn--gold" onClick={() => goto("scorecard")}><Icon name="scorecard" size={14}/> View Scorecard</button>
          <button className="btn btn--ghost" onClick={() => goto("scorecard")} style={{ background: "rgba(255,255,255,.1)", borderColor: "rgba(255,255,255,.2)", color: "#fff" }}>
            <Icon name="download" size={14}/> Download PDF
          </button>
        </div>
      </div>

      {/* 4 stat cards */}
      <div className="stat-row">
        <div className="stat">
          <div className="stat__icon"><Icon name="trend" size={18}/></div>
          <div className="stat__label">Overall Achievement</div>
          <div className="stat__value">{overall.toFixed(1)}<span style={{ fontSize: 18, color: "var(--text3)" }}>%</span></div>
          <div className="stat__sub">Weighted across {KPIS.length} KPIs · {CYCLE.year} YTD</div>
          <div className="stat__prog"><div style={{ width: `${Math.min(100, overall)}%` }}/></div>
        </div>
        <div className="stat">
          <div className="stat__icon"><Icon name="kpis" size={18}/></div>
          <div className="stat__label">KPIs Assigned</div>
          <div className="stat__value">{KPIS.length}</div>
          <div className="stat__sub">Cascaded from {USER.department} dept.</div>
          <div style={{ display: "flex", gap: 4, marginTop: 10 }}>
            {KPIS.map((k) => <span key={k.id} className="bsc-dot" style={{ background: bscColor(k.bsc), width: 14, height: 6, borderRadius: 3 }} />)}
          </div>
        </div>
        <div className="stat">
          <div className="stat__icon"><Icon name={status === "On Track" ? "check" : "warn"} size={18}/></div>
          <div className="stat__label">Cycle Status</div>
          <div className="stat__value" style={{ color: `var(--${statusPill})` }}>{status}</div>
          <div className="stat__sub">2 KPIs at risk · review monthly trends</div>
          <div style={{ marginTop: 8 }}><AchBadge status={status === "On Track" ? "on_track" : status === "At Risk" ? "at_risk" : "behind"} /></div>
        </div>
        <div className="stat">
          <div className="stat__icon"><Icon name="calendar" size={18}/></div>
          <div className="stat__label">Next Review</div>
          <div className="stat__value" style={{ fontSize: 24 }}>{CYCLE.nextReview}</div>
          <div className="stat__sub">Q2 manager check-in · Nishantha Jayawardena</div>
          <div style={{ marginTop: 10, display: "flex", gap: 6 }}>
            <span className="chip"><Icon name="clock" size={10}/> 38 days</span>
            <span className="chip">Self-review due 14 May</span>
          </div>
        </div>
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card__hd">
            <h3>Your KPIs — Current Cycle</h3>
            <button className="btn btn--ghost btn--sm" onClick={() => goto("my-kpis")}>View all <Icon name="right" size={12}/></button>
          </div>
          <div style={{ padding: "0 0 6px" }}>
            <table className="tbl">
              <thead>
                <tr>
                  <th style={{ width: 30 }}>BSC</th>
                  <th>KPI</th>
                  <th className="num">Weight</th>
                  <th className="num">Gate</th>
                  <th className="num">Target</th>
                  <th className="num">YTD</th>
                  <th className="num">Ach.</th>
                  <th>Trend</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {KPIS.map((k) => (
                  <tr key={k.id} onClick={() => openKpi(k.id)}>
                    <td><span className="bsc-dot" style={{ background: bscColor(k.bsc) }} /></td>
                    <td>
                      <b style={{ display: "block", fontSize: 12.5 }}>{k.name}</b>
                      <span style={{ color: "var(--text3)", fontSize: 10.5 }}>{k.id} · {k.frequency}</span>
                    </td>
                    <td className="num">{k.weight}%</td>
                    <td className="num">{k.gate}{k.unit === "%" ? "%" : ""}</td>
                    <td className="num">{k.target}{k.unit === "%" ? "%" : ""}</td>
                    <td className="num"><b>{k.ytd_actual}{k.unit === "%" ? "%" : ""}</b></td>
                    <td className="num" style={{ color: colorFor(k.achievement), fontWeight: 700 }}>{k.achievement.toFixed(1)}%</td>
                    <td><Sparkline data={k.monthly} gate={k.gate} target={k.target}/></td>
                    <td><AchBadge status={k.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="col">
          <div className="card">
            <div className="card__hd"><h3>BSC Weight Distribution</h3><span className="meta">2026 cycle</span></div>
            <div className="card__pad" style={{ display: "grid", placeItems: "center" }}>
              <Pie data={pieData} size={180} />
            </div>
          </div>

          <div className="card">
            <div className="card__hd"><h3>Recent Activity</h3><span className="meta">Last 5 updates</span></div>
            <div className="card__pad" style={{ paddingTop: 4 }}>
              {[
                { ic: "comment",  bg: "var(--gold-l)",   fg: "var(--gold)",  b: "Nishantha Jayawardena commented", p: "On HR-002 Time-to-Fill — \"April slipped to 48\"",       t: "2h" },
                { ic: "trend",    bg: "var(--green-bg)", fg: "var(--green)", b: "HR-001 actual posted",          p: "Engagement Index: 78 (vs Target 80, Gate 70)",           t: "1d" },
                { ic: "calendar", bg: "var(--amber-bg)", fg: "var(--amber)", b: "Self-review window opens",      p: "Submit Q2 reflections by 14 May for all 4 HR KPIs",      t: "3d" },
                { ic: "approve",  bg: "var(--green-bg)", fg: "var(--green)", b: "Q1 actuals approved",           p: "Nishantha Jayawardena approved your Q1 submission.",     t: "2w" },
                { ic: "file",     bg: "var(--bg)",       fg: "var(--text2)", b: "Scorecard PDF generated",       p: "Your March scorecard is available to download.",         t: "3w" },
              ].map((a, i) => (
                <div className="act" key={i}>
                  <div className="act__ic" style={{ background: a.bg, color: a.fg }}>
                    <Icon name={a.ic} size={14} color={a.fg} />
                  </div>
                  <div className="act__body">
                    <b>{a.b}</b>
                    <p>{a.p}</p>
                  </div>
                  <div className="act__time">{a.t}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// MY KPIs
// ============================================================
function MyKpisScreen({ openKpi }) {
  const [bsc, setBsc] = sUseState("all");
  const [status, setStatus] = sUseState("all");
  const [freq, setFreq] = sUseState("all");
  const [expanded, setExpanded] = sUseState(null);

  const rows = KPIS.filter((k) =>
    (bsc === "all" || k.bsc === bsc) &&
    (status === "all" || k.status === status) &&
    (freq === "all" || k.frequency === freq)
  );

  return (
    <div data-screen-label="03 My KPIs">
      <Breadcrumb trail={[{ label: "Home" }, { label: "My KPIs" }]} />
      <div className="ph">
        <div>
          <h1 className="serif">My KPIs</h1>
          <div className="ph__sub">{KPIS.length} KPIs assigned · {CYCLE.year} cycle · reporting as of May 2026</div>
        </div>
        <div className="ph__actions">
          <button className="btn btn--ghost" onClick={() => exportCsv(
            `TMA_Scorecard_${USER.id}_${CYCLE.year}_${CYCLE.quarter}.csv`,
            KPIS.map((k) => ({
              KPI_ID: k.id, KPI: k.name, BSC: BSC[k.bsc]?.label || k.bsc,
              Weight_pct: k.weight, Gate: k.gate, Target: k.target,
              YTD_Actual: k.ytd_actual, Achievement_pct: k.achievement,
              Status: k.status, Frequency: k.frequency,
            })))}><Icon name="excel" size={14}/> Export to Excel</button>
          <button className="btn btn--primary" onClick={() => printWithHint("Use your browser’s Save-as-PDF option in the print dialog.")}><Icon name="download" size={14}/> Download Scorecard</button>
        </div>
      </div>

      <div className="filters">
        <Icon name="filter" size={14} color="var(--text3)"/>
        <label>BSC</label>
        <select value={bsc} onChange={(e) => setBsc(e.target.value)}>
          <option value="all">All perspectives</option>
          {Object.keys(BSC).map((k) => <option key={k} value={k}>{BSC[k].label}</option>)}
        </select>
        <label>Status</label>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="all">All statuses</option>
          <option value="on_track">On Track</option>
          <option value="at_risk">At Risk</option>
          <option value="behind">Behind</option>
        </select>
        <label>Frequency</label>
        <select value={freq} onChange={(e) => setFreq(e.target.value)}>
          <option value="all">All frequencies</option>
          <option>Monthly</option>
          <option>Quarterly</option>
          <option>Annual</option>
        </select>
        <div className="filters__sp" />
        <button className="btn btn--ghost btn--sm" onClick={() => { setBsc("all"); setStatus("all"); setFreq("all"); }}>Clear filters</button>
        <span style={{ fontSize: 11.5, color: "var(--text3)" }}>{rows.length} of {KPIS.length}</span>
      </div>

      <div className="card">
        <table className="tbl">
          <thead>
            <tr>
              <th style={{ width: 30 }}></th>
              <th>KPI</th>
              <th>BSC</th>
              <th className="num">Weight</th>
              <th className="num">Gate</th>
              <th className="num">Target</th>
              <th className="num">YTD Actual</th>
              <th className="num">Ach.</th>
              <th>Trend</th>
              <th>Status</th>
              <th style={{ width: 30 }}></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((k) => (
              <React.Fragment key={k.id}>
                <tr className={expanded === k.id ? "expanded" : ""} onClick={() => setExpanded(expanded === k.id ? null : k.id)}>
                  <td><Icon name={expanded === k.id ? "chevd" : "chev"} size={12} color="var(--text3)" /></td>
                  <td>
                    <b style={{ display: "block" }}>{k.name}</b>
                    <span style={{ color: "var(--text3)", fontSize: 11 }}>{k.id} · {k.frequency} · {k.description.slice(0, 60)}…</span>
                  </td>
                  <td><BscBadge k={k.bsc} /></td>
                  <td className="num">{k.weight}%</td>
                  <td className="num">{k.gate}{k.unit === "%" ? "%" : ""}</td>
                  <td className="num">{k.target}{k.unit === "%" ? "%" : ""}</td>
                  <td className="num"><b>{k.ytd_actual}{k.unit === "%" ? "%" : ""}</b></td>
                  <td className="num" style={{ color: colorFor(k.achievement), fontWeight: 800 }}>{k.achievement.toFixed(1)}%</td>
                  <td><Sparkline data={k.monthly} gate={k.gate} target={k.target} width={80} height={22}/></td>
                  <td><AchBadge status={k.status} /></td>
                  <td><button className="btn btn--ghost btn--sm" onClick={(e) => { e.stopPropagation(); openKpi(k.id); }}>Open</button></td>
                </tr>
                {expanded === k.id && (
                  <tr className="tbl__exp">
                    <td colSpan="11">
                      <div className="tbl__exp-inner">
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 20 }}>
                          <div>
                            <div style={{ fontSize: 11, color: "var(--text3)", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 4 }}>Calculation method</div>
                            <div style={{ fontSize: 12.5, color: "var(--text2)", marginBottom: 10 }}>{k.calc_method}</div>
                            <div style={{ fontSize: 11, color: "var(--text3)", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 4 }}>Data source</div>
                            <div style={{ fontSize: 12.5, color: "var(--text2)" }}>{k.data_source}</div>
                          </div>
                          <div>
                            <div style={{ fontSize: 11, color: "var(--text3)", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 4 }}>Monthly actuals</div>
                            <MonthlyMiniTable data={k.monthly} target={k.target} gate={k.gate} unit={k.unit}/>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function MonthlyMiniTable({ data, target, gate, unit }) {
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: 4 }}>
      {data.map((v, i) => (
        <div key={i} style={{
          textAlign: "center", padding: "6px 2px", borderRadius: 4,
          background: v == null ? "var(--bg)" : (v >= target ? "var(--green-bg)" : v >= gate ? "var(--amber-bg)" : "var(--red-bg)"),
          border: "1px solid " + (v == null ? "var(--border)" : "transparent"),
        }}>
          <div style={{ fontSize: 9.5, color: "var(--text3)", fontWeight: 700, letterSpacing: ".04em" }}>{months[i].toUpperCase()}</div>
          <div style={{ fontSize: 12, fontWeight: 700, color: v == null ? "var(--text3)" : "var(--text)", fontVariantNumeric: "tabular-nums" }}>
            {v == null ? "—" : v}
          </div>
        </div>
      ))}
    </div>
  );
}

// ============================================================
// KPI DETAIL DRAWER
// ============================================================
function KpiDrawer({ kpiId, onClose }) {
  const k = KPIS.find((x) => x.id === kpiId);
  const [draft, setDraft] = sUseState("");
  if (!k) return null;
  const saveDraft = () => {
    if (!draft.trim()) { toast("Write a comment before saving as draft.", "warn"); return; }
    toast(`Draft saved for ${k.id} — ${k.name}`, "success");
  };
  const submitReview = () => {
    if (!draft.trim()) { toast("Add your self-review comment before submitting.", "warn"); return; }
    if (!confirmAction(`Submit your self-review for ${k.id} — ${k.name}?\n\nThis routes to your manager for approval.`)) return;
    setDraft("");
    toast(`Self-review for ${k.id} submitted to your manager.`, "success");
    onClose();
  };
  const exportHistory = () => exportCsv(
    `KPI_${k.id}_monthly_${CYCLE.year}.csv`,
    k.monthly.map((v, i) => ({
      Month: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][i],
      Actual: v, Gate: k.gate, Target: k.target, Unit: k.unit,
    }))
  );
  return (
    <>
      <div className="drawer-scrim" onClick={onClose} />
      <aside className="drawer" role="dialog" aria-labelledby="drw-title">
        <div className="drawer__hd">
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", gap: 8, marginBottom: 6 }}>
              <span style={{ fontSize: 11, fontWeight: 800, color: "var(--text3)", letterSpacing: ".06em" }}>{k.id}</span>
              <BscBadge k={k.bsc} withLabel />
              <span className="chip">{k.frequency}</span>
              <span className="chip">Weight {k.weight}%</span>
              <AchBadge status={k.status} />
            </div>
            <h2 id="drw-title" className="serif" style={{ margin: 0, fontSize: 22, color: "var(--navy)" }}>{k.name}</h2>
            <p style={{ margin: "6px 0 0", fontSize: 12.5, color: "var(--text2)", maxWidth: 620 }}>{k.description}</p>
          </div>
          <button className="x-btn" onClick={onClose} aria-label="Close"><Icon name="x" size={16}/></button>
        </div>
        <div className="drawer__body">
          <div className="card">
            <div className="card__pad">
              <KpiMeter ytd={k.ytd_actual} gate={k.gate} target={k.target} unit={k.unit === "%" ? "%" : ""} direction={k.direction} />
            </div>
          </div>

          <div className="card" style={{ marginTop: 14 }}>
            <div className="card__hd"><h3>Monthly Performance</h3><span className="meta">Jan–Dec {CYCLE.year}</span></div>
            <div className="card__pad">
              <BarChart data={k.monthly} gate={k.gate} target={k.target} unit={k.unit === "%" ? "%" : ""} direction={k.direction} />
            </div>
          </div>

          <div className="grid-2" style={{ marginTop: 14 }}>
            <div className="card">
              <div className="card__hd"><h3>Calculation method</h3></div>
              <div className="card__pad">
                <p style={{ margin: 0, fontSize: 12.5, color: "var(--text2)" }}>{k.calc_method}</p>
                <hr className="hr-line"/>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, fontSize: 12 }}>
                  <div><b style={{ display:"block", fontSize:10.5, color:"var(--text3)", textTransform:"uppercase", letterSpacing:".06em"}}>Data Source</b>{k.data_source}</div>
                  <div><b style={{ display:"block", fontSize:10.5, color:"var(--text3)", textTransform:"uppercase", letterSpacing:".06em"}}>Frequency</b>{k.frequency}</div>
                  <div><b style={{ display:"block", fontSize:10.5, color:"var(--text3)", textTransform:"uppercase", letterSpacing:".06em"}}>Owner</b>{k.owner}</div>
                  <div><b style={{ display:"block", fontSize:10.5, color:"var(--text3)", textTransform:"uppercase", letterSpacing:".06em"}}>Direction</b>{k.direction === "higher_better" ? "Higher is better" : "Lower is better"}</div>
                </div>
              </div>
            </div>
            <div className="card">
              <div className="card__hd"><h3>Manager comments</h3><span className="meta">{k.comments.length} threaded</span></div>
              <div className="card__pad">
                {k.comments.length === 0 && <p style={{ fontSize: 12.5, color: "var(--text3)" }}>No comments from your line manager yet.</p>}
                {k.comments.map((c, i) => (
                  <div className="comment" key={i}>
                    <b>{c.author}</b><small>{c.date}</small>
                    <p>{c.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="card" style={{ marginTop: 14 }}>
            <div className="card__hd"><h3>Self-review</h3><span className="meta">Q2 window closes 14 May</span></div>
            <div className="card__pad">
              <textarea
                value={draft} onChange={(e) => setDraft(e.target.value)}
                placeholder="Reflect on progress, challenges encountered, and plans for the next quarter. What actions are you taking to close the gap to target?"
                style={{ width: "100%", minHeight: 100, resize: "vertical", fontSize: 12.5, lineHeight: 1.5 }}
              />
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10, alignItems: "center" }}>
                <span style={{ fontSize: 11, color: "var(--text3)" }}>Saved automatically as draft · last edit just now</span>
                <div style={{ display: "flex", gap: 8 }}>
                  <button className="btn btn--ghost btn--sm" onClick={saveDraft}>Save draft</button>
                  <button className="btn btn--primary btn--sm" onClick={submitReview}>Submit for review</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="drawer__ft">
          <button className="btn btn--ghost" onClick={onClose}>Close</button>
          <button className="btn btn--gold" onClick={exportHistory}><Icon name="download" size={14}/> Export KPI history</button>
        </div>
      </aside>
    </>
  );
}

// ============================================================
// SCORECARD (print-friendly)
// ============================================================
function ScorecardScreen() {
  const { overall } = rollup();
  const pieData = Object.keys(BSC).map((k) => ({
    key: k,
    value: KPIS.filter((x) => x.bsc === k).reduce((s, x) => s + x.weight, 0),
    color: `var(--bsc-${k})`, label: BSC[k].label,
  })).filter((d) => d.value > 0);

  return (
    <div data-screen-label="05 Scorecard">
      <div className="no-print">
        <Breadcrumb trail={[{ label: "Home" }, { label: "My Scorecard" }]} />
        <div className="ph">
          <div>
            <h1 className="serif">My Scorecard</h1>
            <div className="ph__sub">Print-ready summary · A4 landscape · 2026 cycle YTD</div>
          </div>
          <div className="ph__actions">
            <button className="btn btn--ghost" onClick={() => window.print()}><Icon name="print" size={14}/> Print preview</button>
            <button className="btn btn--primary" onClick={() => window.print()}><Icon name="download" size={14}/> Download as PDF</button>
          </div>
        </div>
      </div>

      <div className="sc-page">
        <div className="sc-head">
          <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
            <div className="hdr__logo-mark" style={{ width: 52, height: 52, fontSize: 18 }}>T</div>
            <div>
              <div style={{ fontSize: 11, color: "var(--text3)", textTransform: "uppercase", letterSpacing: ".08em", fontWeight: 700 }}>Trans Maldivian Airways</div>
              <h1 className="serif">Employee KPI Scorecard · {CYCLE.year} Cycle</h1>
              <div style={{ fontSize: 11.5, color: "var(--text2)", marginTop: 2 }}>Balanced Scorecard · Gate & Target tiers · Report date May 2026</div>
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 10.5, color: "var(--text3)", textTransform: "uppercase", letterSpacing: ".06em" }}>Weighted Score YTD</div>
            <div className="serif" style={{ fontSize: 38, color: colorFor(overall), lineHeight: 1 }}>{overall.toFixed(1)}%</div>
            <AchBadge status={statusFor(overall)} />
          </div>
        </div>

        <div className="sc-meta">
          <div><b>Employee</b>{USER.name}</div>
          <div><b>Employee ID</b>{USER.id}</div>
          <div><b>Department</b>{USER.department}</div>
          <div><b>Date of Join</b>{USER.joinDate}</div>
          <div><b>Job Title</b>{USER.title}</div>
          <div><b>Line Manager</b>{USER.manager}</div>
          <div><b>HOD</b>{USER.hod}</div>
          <div><b>Cycle</b>{CYCLE.year} · {CYCLE.quarter} active</div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "2.4fr 1fr", gap: 18 }}>
          <div>
            <table className="tbl" style={{ border: "1px solid var(--border)", borderRadius: 6, overflow: "hidden" }}>
              <thead>
                <tr>
                  <th>KPI ID</th>
                  <th>KPI</th>
                  <th>BSC</th>
                  <th className="num">Weight</th>
                  <th className="num">Gate</th>
                  <th className="num">Target</th>
                  <th className="num">Actual</th>
                  <th className="num">Ach. %</th>
                  <th className="num">Weighted</th>
                </tr>
              </thead>
              <tbody>
                {KPIS.map((k) => (
                  <tr key={k.id}>
                    <td style={{ fontVariantNumeric: "tabular-nums", fontWeight: 700 }}>{k.id}</td>
                    <td><b>{k.name}</b><div style={{ color: "var(--text3)", fontSize: 10.5 }}>{k.frequency} · {k.owner}</div></td>
                    <td><BscBadge k={k.bsc} /></td>
                    <td className="num">{k.weight}%</td>
                    <td className="num">{k.gate}{k.unit === "%" ? "%" : ""}</td>
                    <td className="num">{k.target}{k.unit === "%" ? "%" : ""}</td>
                    <td className="num">{k.ytd_actual}{k.unit === "%" ? "%" : ""}</td>
                    <td className="num" style={{ color: colorFor(k.achievement), fontWeight: 800 }}>{k.achievement.toFixed(1)}%</td>
                    <td className="num"><b>{((k.achievement * k.weight) / 100).toFixed(2)}</b></td>
                  </tr>
                ))}
                <tr>
                  <td colSpan="3" style={{ background: "var(--navy)", color: "#fff", fontWeight: 700 }}>TOTAL WEIGHTED SCORE</td>
                  <td className="num" style={{ background: "var(--navy)", color: "#fff", fontWeight: 700 }}>100%</td>
                  <td colSpan="4" style={{ background: "var(--navy)" }}></td>
                  <td className="num" style={{ background: "var(--navy)", color: "var(--gold2)", fontWeight: 900, fontSize: 14 }}>{overall.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div>
            <div className="card" style={{ boxShadow: "none" }}>
              <div className="card__hd"><h3>BSC Weight Mix</h3></div>
              <div className="card__pad" style={{ display: "grid", placeItems: "center" }}>
                <Pie data={pieData} size={160}/>
              </div>
            </div>
          </div>
        </div>

        <div className="sc-sign">
          <div className="sc-sign__block"><b>Employee</b>{USER.name}<br/>Signature / Date</div>
          <div className="sc-sign__block"><b>Line Manager</b>{USER.manager}<br/>Signature / Date</div>
          <div className="sc-sign__block"><b>Head of Department</b>{USER.hod}<br/>Signature / Date</div>
        </div>

        <div style={{ marginTop: 26, fontSize: 10, color: "var(--text3)", textAlign: "center", letterSpacing: ".04em" }}>
          CONFIDENTIAL · Human Resources Department · Trans Maldivian Airways · Generated from TMA KPI Self-Service Portal
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { DashboardScreen, MyKpisScreen, KpiDrawer, ScorecardScreen, rollup });
