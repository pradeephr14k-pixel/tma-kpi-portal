// ============================================================
// TMA KPI Portal — Screens B: History, Team, Library, Notifications, Help
// ============================================================
const { useState: bUseState, useMemo: bUseMemo } = React;

// ============================================================
// PERFORMANCE HISTORY
// ============================================================
function HistoryScreen() {
  const lineRows = HISTORY.map((h) => ({ year: h.year, value: h.overall }));
  const best = [...KPIS].sort((a, b) => b.achievement - a.achievement)[0];
  const worst = [...KPIS].sort((a, b) => a.achievement - b.achievement)[0];

  return (
    <div data-screen-label="06 History">
      <Breadcrumb trail={[{ label: "Home" }, { label: "Performance History" }]}/>
      <div className="ph">
        <div>
          <h1 className="serif">Performance History</h1>
          <div className="ph__sub">Year-over-year comparison · 2022 — 2025 · {USER.name}</div>
        </div>
        <div className="ph__actions">
          <button className="btn btn--ghost" onClick={() => exportCsv(
            `TMA_Performance_History_${USER.id}.csv`,
            HISTORY.map((h) => ({
              Cycle: h.year, Overall_pct: h.overall,
              On_Track: h.onTrack, At_Risk: h.atRisk, Behind: h.behind,
              Headline: h.headline || "",
            })))}><Icon name="excel" size={14}/> Export</button>
        </div>
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card__hd"><h3>Overall Achievement Trend</h3><span className="meta">Weighted · all cycles</span></div>
          <div className="card__pad"><LineChart rows={lineRows} /></div>
        </div>
        <div className="card">
          <div className="card__hd"><h3>Year-over-Year Delta</h3><span className="meta">% point change</span></div>
          <div className="card__pad" style={{ padding: 0 }}>
            <table className="tbl">
              <thead><tr><th>Cycle</th><th>Overall</th><th className="num">Δ YoY</th><th>Headline</th></tr></thead>
              <tbody>
                {HISTORY.map((h, i) => {
                  const prev = HISTORY[i - 1];
                  const delta = prev ? h.overall - prev.overall : null;
                  return (
                    <tr key={h.year}>
                      <td><b>{h.year}</b></td>
                      <td style={{ fontWeight: 700, color: colorFor(h.overall) }}>{h.overall.toFixed(1)}%</td>
                      <td className="num">
                        {delta == null ? <span style={{ color: "var(--text3)" }}>—</span> :
                          <span style={{ color: delta > 0 ? "var(--green)" : delta < 0 ? "var(--red)" : "var(--text2)", fontWeight: 700, display: "inline-flex", alignItems: "center", gap: 4 }}>
                            <Icon name={delta > 0 ? "up" : delta < 0 ? "down" : "right"} size={12}/> {delta > 0 ? "+" : ""}{delta.toFixed(1)}
                          </span>}
                      </td>
                      <td style={{ fontSize: 12, color: "var(--text2)" }}>{h.headline}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="grid-2" style={{ marginTop: 14 }}>
        <div className="card">
          <div className="card__hd"><h3>BSC Perspective — Year by Year</h3></div>
          <div className="card__pad" style={{ padding: 0 }}>
            <table className="tbl">
              <thead>
                <tr><th>Cycle</th>{Object.keys(BSC).map((k) => (
                  <th key={k} className="num"><span className="bsc-dot" style={{ background: bscColor(k), marginRight: 4 }} />{BSC[k].label}</th>
                ))}</tr>
              </thead>
              <tbody>
                {HISTORY.map((h) => (
                  <tr key={h.year}>
                    <td><b>{h.year}</b></td>
                    {Object.keys(BSC).map((k) => {
                      const v = h.perspectives[k];
                      return <td key={k} className="num" style={{ color: colorFor(v), fontWeight: 700 }}>{v}%</td>;
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="col">
          <div className="card">
            <div className="card__hd"><h3>Best Performing KPI · 2025</h3><span className="meta">FY 2025</span></div>
            <div className="card__pad">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
                <div>
                  <BscBadge k={best.bsc} />
                  <div className="serif" style={{ fontSize: 18, marginTop: 6, color: "var(--navy)" }}>{best.name}</div>
                  <div style={{ fontSize: 11.5, color: "var(--text3)", marginTop: 2 }}>{best.id} · Gate {best.gate} · Target {best.target}</div>
                </div>
                <div className="serif" style={{ fontSize: 30, color: "var(--green)" }}>{best.achievement.toFixed(1)}%</div>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="card__hd"><h3>Needs Attention · 2025</h3><span className="meta">FY 2025</span></div>
            <div className="card__pad">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
                <div>
                  <BscBadge k={worst.bsc} />
                  <div className="serif" style={{ fontSize: 18, marginTop: 6, color: "var(--navy)" }}>{worst.name}</div>
                  <div style={{ fontSize: 11.5, color: "var(--text3)", marginTop: 2 }}>{worst.id} · Gate {worst.gate} · Target {worst.target}</div>
                </div>
                <div className="serif" style={{ fontSize: 30, color: colorFor(worst.achievement) }}>{worst.achievement.toFixed(1)}%</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* All-departments trend, 2022-2025 — sourced from xlsx Annual Performance sheet */}
      <div className="card" style={{ marginTop: 14 }}>
        <div className="card__hd">
          <h3>How TMA's departments compared · 2022 – 2025</h3>
          <span className="meta">Annual achievement % · sorted by 2025 result · source: HR Annual Performance ledger</span>
        </div>
        <div className="card__pad" style={{ padding: 0 }}>
          <table className="tbl">
            <thead>
              <tr>
                <th>Department</th>
                <th className="num">2022</th>
                <th className="num">2023</th>
                <th className="num">2024</th>
                <th className="num">2025</th>
                <th className="num">Δ vs 2024</th>
                <th>2025 vs Org</th>
              </tr>
            </thead>
            <tbody>
              {(window.DEPT_TREND || []).map((t) => {
                const orgAvg = (window.DEPT_TREND.reduce((s, x) => s + (x.y2025 || 0), 0) / window.DEPT_TREND.filter((x) => x.y2025 != null).length) || 0;
                const delta = t.y2025 != null && t.y2024 != null ? +(t.y2025 - t.y2024).toFixed(1) : null;
                const isMine = t.department === USER.department;
                const cell = (v) => v == null
                  ? <span style={{ color: "var(--text3)" }}>—</span>
                  : <span style={{ color: colorFor(v), fontWeight: 700 }}>{v.toFixed(1)}%</span>;
                return (
                  <tr key={t.department} style={isMine ? { background: "var(--gold-l)" } : {}}>
                    <td>
                      <b>{t.department}</b>
                      {isMine && <span style={{ marginLeft: 8, fontSize: 10, fontWeight: 800, color: "var(--gold)", letterSpacing: ".06em" }}>· YOUR DEPT</span>}
                    </td>
                    <td className="num">{cell(t.y2022)}</td>
                    <td className="num">{cell(t.y2023)}</td>
                    <td className="num">{cell(t.y2024)}</td>
                    <td className="num">{cell(t.y2025)}</td>
                    <td className="num">
                      {delta == null ? <span style={{ color: "var(--text3)" }}>—</span> :
                        <span style={{ color: delta > 0 ? "var(--green)" : delta < 0 ? "var(--red)" : "var(--text2)", fontWeight: 700, display: "inline-flex", alignItems: "center", gap: 3 }}>
                          <Icon name={delta > 0 ? "up" : delta < 0 ? "down" : "right"} size={11}/> {delta > 0 ? "+" : ""}{delta.toFixed(1)}
                        </span>}
                    </td>
                    <td style={{ minWidth: 160 }}>
                      <div className="kpi-bar" style={{ height: 6, background: "var(--bg)" }}>
                        <div className="kpi-bar__fill" style={{
                          width: `${Math.min(100, t.y2025 || 0)}%`,
                          background: colorFor(t.y2025 || 0),
                        }} />
                        <div style={{ position: "absolute", left: `${Math.min(100, orgAvg)}%`, top: -2, width: 1.5, height: 10, background: "var(--navy)" }} title={`Org avg ${orgAvg.toFixed(1)}%`}/>
                      </div>
                      <div style={{ fontSize: 10, color: "var(--text3)", marginTop: 2, display: "flex", justifyContent: "space-between" }}>
                        <span>Org avg {orgAvg.toFixed(1)}%</span>
                        <span style={{ color: t.y2025 != null && t.y2025 >= orgAvg ? "var(--green)" : "var(--amber)" }}>
                          {t.y2025 != null ? `${(t.y2025 - orgAvg).toFixed(1)} pts ${t.y2025 >= orgAvg ? "above" : "below"}` : ""}
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
// ============================================================
// TEAM VIEW (Manager / HR Admin)
// ============================================================
function TeamScreen({ viewEmployee }) {
  const deptAvg = TEAM.reduce((s, t) => s + t.achievement, 0) / TEAM.length;
  const onTrack = TEAM.filter((t) => t.status === "on_track").length;
  const atRisk = TEAM.filter((t) => t.status === "at_risk").length;
  const behind = TEAM.filter((t) => t.status === "behind").length;

  return (
    <div data-screen-label="07 Team">
      <Breadcrumb trail={[{ label: "Home" }, { label: "Team View" }]} />
      <div className="ph">
        <div>
          <h1 className="serif">Team View</h1>
          <div className="ph__sub">HR Department · {TEAM.length} direct reports · reporting to Nishantha Jayawardena</div>
        </div>
        <div className="ph__actions">
          <button className="btn btn--ghost" onClick={() => exportCsv(
            `HR_Team_Rollup_${CYCLE.year}_${CYCLE.quarter}.csv`,
            TEAM.map((t) => ({
              Employee_ID: t.id, Name: t.name, Title: t.title,
              Achievement_pct: t.achievement, Status: t.status, KPIs: t.kpis,
            })))}><Icon name="excel" size={14}/> Export roll-up</button>
          <button className="btn btn--gold" onClick={() => {
            if (!confirmAction(`Approve monthly actuals for ${TEAM.length} direct reports?\n\nThis locks ${CYCLE.quarter} submissions for the HR roll-up.`)) return;
            toast(`Monthly actuals approved for ${TEAM.length} reports — roll-up locked.`, "success");
          }}><Icon name="approve" size={14}/> Approve monthly actuals</button>
        </div>
      </div>

      {/* Department roll-up */}
      <div className="card" style={{ marginBottom: 14 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr 1fr 1fr", gap: 0 }}>
          <div style={{ padding: "18px 20px", borderRight: "1px solid var(--border)", background: "var(--navy)", color: "#fff", borderRadius: "10px 0 0 10px" }}>
            <div style={{ fontSize: 10.5, color: "var(--gold2)", textTransform: "uppercase", letterSpacing: ".1em", fontWeight: 700 }}>Department Roll-up</div>
            <div className="serif" style={{ fontSize: 22, marginTop: 4 }}>{USER.department}</div>
            <div style={{ fontSize: 11.5, color: "rgba(255,255,255,.6)", marginTop: 2 }}>Head of Dept: {USER.hod}</div>
          </div>
          <div style={{ padding: "18px 20px", borderRight: "1px solid var(--border)" }}>
            <div className="stat__label">Team Average</div>
            <div className="serif" style={{ fontSize: 26, color: colorFor(deptAvg), marginTop: 2 }}>{deptAvg.toFixed(1)}%</div>
            <div style={{ fontSize: 11, color: "var(--text3)" }}>Weighted YTD</div>
          </div>
          <div style={{ padding: "18px 20px", borderRight: "1px solid var(--border)" }}>
            <div className="stat__label">On Track</div>
            <div className="serif" style={{ fontSize: 26, color: "var(--green)", marginTop: 2 }}>{onTrack}</div>
            <div style={{ fontSize: 11, color: "var(--text3)" }}>of {TEAM.length} reports</div>
          </div>
          <div style={{ padding: "18px 20px", borderRight: "1px solid var(--border)" }}>
            <div className="stat__label">At Risk</div>
            <div className="serif" style={{ fontSize: 26, color: "var(--amber)", marginTop: 2 }}>{atRisk}</div>
            <div style={{ fontSize: 11, color: "var(--text3)" }}>coaching required</div>
          </div>
          <div style={{ padding: "18px 20px" }}>
            <div className="stat__label">Behind</div>
            <div className="serif" style={{ fontSize: 26, color: "var(--red)", marginTop: 2 }}>{behind}</div>
            <div style={{ fontSize: 11, color: "var(--text3)" }}>intervention needed</div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card__hd"><h3>Direct Reports</h3><span className="meta">Click any report to view scorecard (read-only)</span></div>
        <table className="tbl">
          <thead>
            <tr>
              <th style={{ width: 40 }}></th>
              <th>Employee</th>
              <th>Role</th>
              <th className="num">KPIs</th>
              <th>Progress</th>
              <th className="num">Achievement</th>
              <th>Status</th>
              <th style={{ width: 40 }}></th>
            </tr>
          </thead>
          <tbody>
            {TEAM.map((t) => (
              <tr key={t.id} onClick={() => viewEmployee(t)}>
                <td><div className="avatar" style={{ width: 28, height: 28, fontSize: 10 }}>
                  {t.name.split(" ").map((p) => p[0]).join("").slice(0, 2)}
                </div></td>
                <td>
                  <b>{t.name}</b>
                  <div style={{ color: "var(--text3)", fontSize: 11 }}>{t.id}</div>
                </td>
                <td style={{ color: "var(--text2)" }}>{t.title}</td>
                <td className="num">{t.kpis}</td>
                <td style={{ minWidth: 180 }}>
                  <div className="kpi-bar" style={{ height: 8 }}>
                    <div className="kpi-bar__fill" style={{ width: `${Math.min(100, t.achievement)}%`, background: colorFor(t.achievement) }} />
                  </div>
                </td>
                <td className="num" style={{ color: colorFor(t.achievement), fontWeight: 800 }}>{t.achievement.toFixed(1)}%</td>
                <td><AchBadge status={t.status} /></td>
                <td><Icon name="chev" size={14} color="var(--text3)"/></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ============================================================
// KPI LIBRARY — 2025 (with achievements) + 2026 (proposed)
// ============================================================
function LibraryScreen() {
  const [year, setYear] = bUseState(2025);
  const [q, setQ] = bUseState("");
  const [bsc, setBsc] = bUseState("all");
  const [openDepts, setOpenDepts] = bUseState(() => new Set([USER.department]));

  const source = year === 2025 ? LIBRARY_KPIS : (window.DEPT_KPIS_2026 || []);
  const yearLabel = year === 2025 ? "2025 · Closed cycle (with results)" : "2026 · Proposed cycle (under review)";

  const byDept = bUseMemo(() => {
    const term = q.toLowerCase().trim();
    const filtered = source.filter((k) =>
      (bsc === "all" || k.bsc === bsc) &&
      (!term || k.name.toLowerCase().includes(term) || k.department.toLowerCase().includes(term) || k.id.toLowerCase().includes(term) || (k.calc || "").toLowerCase().includes(term))
    );
    const grouped = {};
    filtered.forEach((k) => { (grouped[k.department] ||= []).push(k); });
    return grouped;
  }, [q, bsc, year, source]);

  const depts = Object.keys(byDept);

  const toggle = (d) => {
    const n = new Set(openDepts);
    n.has(d) ? n.delete(d) : n.add(d);
    setOpenDepts(n);
  };

  return (
    <div data-screen-label="08 Library">
      <Breadcrumb trail={[{ label: "Home" }, { label: "KPI Library" }]}/>
      <div className="ph">
        <div>
          <h1 className="serif">KPI Library</h1>
          <div className="ph__sub">{source.length} Department KPIs · {DEPARTMENTS.length} departments · Balanced Scorecard · {yearLabel}</div>
        </div>
        <div className="ph__actions">
          <div className="seg" style={{ display: "inline-flex", border: "1px solid var(--border)", borderRadius: 8, overflow: "hidden", background: "#fff" }}>
            {[2025, 2026].map((y) => (
              <button key={y} onClick={() => setYear(y)}
                className="btn btn--sm"
                style={{
                  background: year === y ? "var(--navy)" : "#fff",
                  color: year === y ? "#fff" : "var(--text2)",
                  border: 0, borderRadius: 0, padding: "8px 16px", fontWeight: 700,
                }}>
                FY {y}{y === 2026 && <span style={{ marginLeft: 6, fontSize: 9.5, padding: "1px 5px", borderRadius: 8, background: year === y ? "var(--gold)" : "var(--gold-l)", color: year === y ? "var(--navy)" : "var(--gold)", letterSpacing: ".06em" }}>NEW</span>}
              </button>
            ))}
          </div>
          <button className="btn btn--ghost" onClick={() => setOpenDepts(new Set(depts))}>Expand all</button>
          <button className="btn btn--ghost" onClick={() => setOpenDepts(new Set())}>Collapse all</button>
        </div>
      </div>

      <div className="filters">
        <Icon name="search" size={14} color="var(--text3)"/>
        <input placeholder="Search KPI name, department, calculation method…" value={q} onChange={(e) => setQ(e.target.value)} style={{ flex: 1, minWidth: 280 }} />
        <label>BSC</label>
        <select value={bsc} onChange={(e) => setBsc(e.target.value)}>
          <option value="all">All perspectives</option>
          {Object.keys(BSC).map((k) => <option key={k} value={k}>{BSC[k].label}</option>)}
        </select>
        <span style={{ fontSize: 11.5, color: "var(--text3)" }}>{Object.values(byDept).flat().length} KPIs</span>
      </div>

      <div className="col">
        {depts.map((d) => {
          const items = byDept[d];
          const isOpen = openDepts.has(d);
          const deptCode = DEPARTMENTS.find((x) => x.name === d)?.code || "—";
          // dept-level 2025 achievement (from DEPT_TREND) for context
          const deptAch = (window.DEPT_TREND || []).find((t) => t.department === d)?.[`y${year === 2025 ? 2025 : 2024}`];
          const deptAchPct = deptAch == null ? null : deptAch;
          const totalWeight = items.reduce((s, k) => s + (k.weight || 0), 0);
          return (
            <div className="card" key={d}>
              <div className="card__hd" onClick={() => toggle(d)} style={{ cursor: "pointer" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 7, background: "var(--navy)", color: "var(--gold2)", display: "grid", placeItems: "center", fontFamily: "Merriweather, serif", fontWeight: 900, fontSize: 11, letterSpacing: ".04em" }}>
                    {deptCode}
                  </div>
                  <div>
                    <h3 style={{ margin: 0 }}>{d}</h3>
                    <div style={{ fontSize: 11, color: "var(--text3)" }}>
                      {items.length} KPIs · {totalWeight}% total weight
                      {deptAchPct != null && year === 2025 && <span> · 2025 result <b style={{ color: colorFor(deptAchPct) }}>{deptAchPct.toFixed(1)}%</b></span>}
                    </div>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ display: "flex", gap: 4 }}>
                    {Object.keys(BSC).map((k) => {
                      const c = items.filter((x) => x.bsc === k).length;
                      if (!c) return null;
                      return (
                        <span key={k} className="chip" style={{ background: "var(--bg)" }}>
                          <span className="bsc-dot" style={{ background: bscColor(k) }}/> {BSC[k].short} · {c}
                        </span>
                      );
                    })}
                  </div>
                  <Icon name={isOpen ? "chevu" : "chevd"} size={14} color="var(--text2)"/>
                </div>
              </div>
              {isOpen && (
                <div className="card__pad">
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 10 }}>
                    {items.map((k) => {
                      const isClosed = year === 2025 && k.achievement != null;
                      return (
                        <div key={k.id} style={{ border: "1px solid var(--border)", borderRadius: 8, padding: 12, background: "#fff" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10, marginBottom: 6 }}>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 2 }}>
                                <BscBadge k={k.bsc}/>
                                <span style={{ fontSize: 10.5, color: "var(--text3)", fontWeight: 700, letterSpacing: ".06em" }}>{k.id}</span>
                                {year === 2026 && <span style={{ fontSize: 9.5, padding: "1px 5px", borderRadius: 4, background: "var(--gold-l)", color: "var(--gold)", fontWeight: 800, letterSpacing: ".06em" }}>PROPOSED</span>}
                              </div>
                              <b style={{ fontSize: 13, lineHeight: 1.35, display: "block" }}>{k.name}</b>
                            </div>
                            {isClosed && (
                              <div style={{ textAlign: "right", flexShrink: 0 }}>
                                <div className="serif" style={{ fontSize: 18, color: colorFor(k.achievement), fontWeight: 900 }}>{k.achievement.toFixed(0)}%</div>
                                <div style={{ fontSize: 9.5, color: "var(--text3)", letterSpacing: ".06em" }}>2025 RESULT</div>
                              </div>
                            )}
                          </div>
                          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 4, fontSize: 11, marginTop: 8, padding: "6px 0", borderTop: "1px solid var(--border)" }}>
                            <div><span style={{ color: "var(--text3)" }}>Weight</span><br/><b>{k.weight}%</b></div>
                            <div><span style={{ color: "var(--text3)" }}>Gate</span><br/><b>{k.gate}{k.unit === "%" ? "%" : ""}</b></div>
                            <div><span style={{ color: "var(--text3)" }}>Target</span><br/><b>{k.target}{k.unit === "%" ? "%" : ""}</b></div>
                            <div><span style={{ color: "var(--text3)" }}>Cadence</span><br/><b>{k.frequency}</b></div>
                          </div>
                          {k.calc && (
                            <>
                              <div style={{ fontSize: 10, color: "var(--text3)", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".06em", marginTop: 6 }}>Calculation</div>
                              <div style={{ fontSize: 11.5, color: "var(--text2)", lineHeight: 1.5 }}>{k.calc}</div>
                            </>
                          )}
                          {year === 2026 && k.bsc_label && (
                            <>
                              <div style={{ fontSize: 10, color: "var(--text3)", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".06em", marginTop: 6 }}>BSC mapping</div>
                              <div style={{ fontSize: 11.5, color: "var(--text2)" }}>{k.bsc_label}</div>
                            </>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
        {depts.length === 0 && (
          <div className="card">
            <div className="card__pad" style={{ textAlign: "center", padding: 40, color: "var(--text3)" }}>
              No KPIs match your filters.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================
// NOTIFICATIONS
// ============================================================
function NotificationsScreen({ openKpi }) {
  const [filter, setFilter] = bUseState("all");
  const [items, setItems] = bUseState(NOTIFICATIONS);
  const visible = items.filter((n) => filter === "all" || (filter === "unread" ? n.unread : n.type === filter));
  const unread = items.filter((n) => n.unread).length;

  const iconFor = (t) => ({
    comment: "comment", deadline: "clock", update: "trend", cycle: "calendar", system: "file", approval: "approve",
  }[t] || "info");
  const colorForType = (t) => ({
    comment: "var(--gold)", deadline: "var(--amber)", update: "var(--green)", cycle: "var(--navy2)", system: "var(--text2)", approval: "var(--green)",
  }[t] || "var(--text2)");

  return (
    <div data-screen-label="09 Notifications">
      <Breadcrumb trail={[{ label: "Home" }, { label: "Notifications" }]}/>
      <div className="ph">
        <div>
          <h1 className="serif">Notifications</h1>
          <div className="ph__sub">{unread} unread of {items.length} total</div>
        </div>
        <div className="ph__actions">
          <button className="btn btn--ghost" onClick={() => setItems(items.map((n) => ({ ...n, unread: false })))}>Mark all as read</button>
        </div>
      </div>

      <div className="filters">
        {[
          ["all", "All"], ["unread", "Unread"], ["comment", "Comments"],
          ["deadline", "Deadlines"], ["update", "KPI updates"], ["approval", "Approvals"], ["cycle", "Cycle"], ["system", "System"],
        ].map(([v, l]) => (
          <button key={v} onClick={() => setFilter(v)}
            className="btn btn--sm"
            style={{
              background: filter === v ? "var(--navy)" : "#fff",
              color: filter === v ? "#fff" : "var(--text2)",
              border: "1px solid " + (filter === v ? "var(--navy)" : "var(--border)"),
            }}>
            {l}{v === "unread" && unread > 0 && ` · ${unread}`}
          </button>
        ))}
      </div>

      <div className="card">
        {visible.length === 0 && <div style={{ padding: 40, textAlign: "center", color: "var(--text3)" }}>No notifications matching your filter.</div>}
        {visible.map((n, i) => (
          <div key={n.id} onClick={() => setItems(items.map((x) => x.id === n.id ? { ...x, unread: false } : x))}
            style={{
              display: "flex", gap: 12, padding: "14px 18px",
              borderBottom: i < visible.length - 1 ? "1px solid var(--border)" : 0,
              background: n.unread ? "var(--gold-l)" : "#fff", cursor: "pointer",
            }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: "#fff", border: "1px solid var(--border)", display: "grid", placeItems: "center" }}>
              <Icon name={iconFor(n.type)} size={16} color={colorForType(n.type)}/>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "baseline" }}>
                <b style={{ fontSize: 13 }}>{n.title}</b>
                <span style={{ fontSize: 11, color: "var(--text3)", whiteSpace: "nowrap" }}>{n.time}</span>
              </div>
              <p style={{ margin: "2px 0 0", fontSize: 12, color: "var(--text2)", lineHeight: 1.5 }}>{n.body}</p>
            </div>
            {n.unread && <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--gold)", alignSelf: "center", flexShrink: 0 }} />}
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// HELP & FAQS
// ============================================================
function HelpScreen() {
  const [open, setOpen] = bUseState(0);
  return (
    <div data-screen-label="10 Help">
      <Breadcrumb trail={[{ label: "Home" }, { label: "Help & FAQs" }]}/>
      <div className="ph">
        <div>
          <h1 className="serif">Help & FAQs</h1>
          <div className="ph__sub">How the portal works · KPI methodology · dispute process</div>
        </div>
        <div className="ph__actions">
          <button className="btn btn--primary" onClick={() => {
            window.location.href = "mailto:hr.support@tma.mv?subject=KPI%20Portal%20%E2%80%94%20question%20from%20" + encodeURIComponent(USER.name) + "%20(" + USER.id + ")";
            toast("Opening your mail client… hr.support@tma.mv", "info");
          }}><Icon name="comment" size={14}/> Contact HR</button>
        </div>
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card__hd"><h3>Frequently asked questions</h3><span className="meta">{FAQS.length} articles</span></div>
          <div style={{ padding: "4px 16px 12px" }}>
            {FAQS.map((f, i) => (
              <div key={i} className="acc-item" data-open={open === i}>
                <button onClick={() => setOpen(open === i ? -1 : i)}>
                  <span>{f.q}</span>
                  <Icon name={open === i ? "chevu" : "chevd"} size={14} color="var(--text3)"/>
                </button>
                {open === i && <div className="acc-body">{f.a}</div>}
              </div>
            ))}
          </div>
        </div>
        <div className="col">
          <div className="card">
            <div className="card__hd"><h3>Quick reference</h3></div>
            <div className="card__pad" style={{ fontSize: 12.5, color: "var(--text2)", lineHeight: 1.6 }}>
              <b style={{ color: "var(--navy)" }}>Scoring tiers</b>
              <div style={{ marginTop: 4, display: "flex", gap: 6, flexWrap: "wrap" }}>
                <span className="ach ach--green"><span className="dot"/>≥ 90% · On Track</span>
                <span className="ach ach--amber"><span className="dot"/>70–89% · At Risk</span>
                <span className="ach ach--red"><span className="dot"/>&lt; 70% · Behind</span>
              </div>
              <hr className="hr-line"/>
              <b style={{ color: "var(--navy)" }}>BSC perspectives</b>
              <div style={{ marginTop: 4, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4 }}>
                {Object.keys(BSC).map((k) => (
                  <div key={k} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span className="bsc-dot" style={{ background: bscColor(k) }}/>
                    <span>{BSC[k].label}</span>
                  </div>
                ))}
              </div>
              <hr className="hr-line"/>
              <b style={{ color: "var(--navy)" }}>Tier model</b>
              <p style={{ margin: "4px 0 0" }}>TMA uses <b>Gate</b> and <b>Target</b> only — there is no Stretch tier. Achievement above Target caps at 100% for weighted score purposes.</p>
            </div>
          </div>
          <div className="card">
            <div className="card__hd"><h3>Contact</h3></div>
            <div className="card__pad" style={{ fontSize: 12.5 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <div className="avatar avatar--lg">NJ</div>
                <div>
                  <b>{USER.manager}</b>
                  <div style={{ color: "var(--text3)", fontSize: 11 }}>Your Line Manager · HR</div>
                </div>
              </div>
              <div style={{ color: "var(--text2)" }}>
                <div>HR Helpdesk · <a>hr@tma.mv</a></div>
                <div>Portal support · <a>itservicedesk@tma.mv</a></div>
                <div>Raise a dispute · include KPI ID and period</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { HistoryScreen, TeamScreen, LibraryScreen, NotificationsScreen, HelpScreen });
