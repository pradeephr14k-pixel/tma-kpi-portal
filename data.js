// ============================================================
// data.js — REAL DATA ADAPTER
// ============================================================
// Reads window.TMA_DATA (loaded from dataset.js — auto-generated
// from "Finalized KPI Master - 2025.xlsx") and shapes it into the
// legacy globals every screen consumes:
//
//   USER, CYCLE, KPIS, HISTORY, TEAM, NOTIFICATIONS,
//   LIBRARY_KPIS, DEPARTMENTS, BSC, FAQS, NAV
//
// Plus new globals for the new screens:
//
//   DEPT_KPIS_2025, DEPT_KPIS_2026, DEPT_TREND, ALL_EMPLOYEES,
//   ACADEMY_MODULES, ACADEMY_QUIZ
//
// This module REPLACES api.js when running the prototype without a
// backend. Comment out the api.js <script> tag and use this instead.
// ============================================================

(function () {
  const D = window.TMA_DATA;
  if (!D) {
    console.error("[data.js] window.TMA_DATA not found — load dataset.js before data.js");
    return;
  }

  // ============================================================
  // BSC perspectives — TMA's 4-quadrant Balanced Scorecard
  // ============================================================
  const BSC = {
    financial: { label: "Financial",            short: "Financial",  color: "var(--bsc-financial)" },
    process:   { label: "Internal Processes",   short: "Processes",  color: "var(--bsc-process)"   },
    people:    { label: "Human Capital",        short: "People",     color: "var(--bsc-people)"    },
    customer:  { label: "Customer",             short: "Customer",   color: "var(--bsc-customer)"  },
  };

  // Map BSC text from xlsx -> internal key
  function mapBsc(b1, b2) {
    const text = ((b1 || "") + " " + (b2 || "")).toLowerCase();
    if (text.includes("financial"))           return "financial";
    if (text.includes("internal business"))   return "process";
    if (text.includes("process"))             return "process";
    if (text.includes("human capital") ||
        text.includes("people"))              return "people";
    if (text.includes("customer"))            return "customer";
    return "process";
  }

  // ============================================================
  // CYCLE — current reporting cycle
  // ============================================================
  const CYCLE = {
    year: 2025,
    quarter: "FY 2025",
    status: "Closed",
    nextReview: "May 2025",
    monthsCovered: 12,
  };

  // ============================================================
  // USER — demo persona = Mohamed Fazeel Careem (10597)
  //   Deputy Manager - Human Resources · 96.9% achievement
  // ============================================================
  const meRec = D.directory.find((d) => d.id === D.meEmployeeId);
  const initials = meRec.name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0])
    .join("")
    .toUpperCase();

  const USER = {
    id:         meRec.id,
    name:       meRec.name,
    title:      meRec.designation,
    department: meRec.dept,
    avatarInitials: initials,
    joinDate:   "27 Jul 2022",
    manager:    "Nishantha Jayawardena",      // synthesized — not in xlsx
    hod:        "Nishantha Jayawardena",
    employmentType: "Permanent",
    role:       "manager", // matches NAV permissions; toggleable via header
  };

  // ============================================================
  // KPIS — the demo user's 6 individual 2025 KPIs
  // ============================================================
  const myRaw = D.hrIndividualKPIs.filter((k) => k.empId === D.meEmployeeId);

  // ach2025 stored as 0..1+ → convert to %
  const pct = (v) => (v == null ? 0 : Math.round(v * 1000) / 10);

  // monthly bars: prefer ACTUALS for the chart but use ACHIEVEMENTS for status colour
  function statusFor(achievement, gateScore = 0.7) {
    if (achievement >= 0.9)  return "on_track";
    if (achievement >= 0.7)  return "at_risk";
    return "behind";
  }

  // Each individual KPI carries its own monthly array. Convert nulls -> previous value to keep charts continuous,
  // and convert percentages to 0-100 scale.
  function buildMonthly(actuals, unit) {
    const scale = unit === "%" ? 100 : 1;
    const out = [];
    let prev = null;
    for (let i = 0; i < 12; i++) {
      const v = actuals[i];
      if (v != null) { out.push(Math.round(v * scale * 100) / 100); prev = v; }
      else if (prev != null) { out.push(Math.round(prev * scale * 100) / 100); }
      else { out.push(0); }
    }
    return out;
  }

  // KPI ID-friendly slug
  function kpiCode(name, idx) {
    return "HR-" + String(idx + 1).padStart(3, "0");
  }

  const KPIS = myRaw.map((k, i) => {
    // achievement % across the year = totalScore * 100
    const ach = pct(k.weightedScore != null && k.weight > 0 ? (k.weightedScore / k.weight) : null);
    const monthly = buildMonthly(k.actuals, k.unit);
    const targetDisplay = k.unit === "%" ? Math.round(k.target * 100) : k.target;
    const gateDisplay   = k.unit === "%" ? Math.round(k.gate * 100)   : k.gate;
    // YTD actual = last non-null actual
    let ytd = null;
    for (let m = 11; m >= 0; m--) if (k.actuals[m] != null) { ytd = k.actuals[m]; break; }
    const ytdDisplay = ytd == null ? 0 : (k.unit === "%" ? Math.round(ytd * 100 * 10) / 10 : ytd);
    return {
      id: kpiCode(k.name, i),
      _dbId: k.id,
      name: k.name,
      description: `Source: ${k.source || "HR records"}. Frequency ${k.freq || "Monthly"}. Tracked against gate (minimum acceptable) and target (goal) tiers per the ${CYCLE.year} cycle.`,
      bsc: mapBsc("Human Capital", ""),
      weight: Math.round((k.weight || 0) * 100),
      unit: k.unit,
      gate: gateDisplay,
      target: targetDisplay,
      ytd_actual: ytdDisplay,
      achievement: ach,
      direction: k.target >= k.gate ? "higher_better" : "lower_better",
      monthly,
      status: statusFor(k.weightedScore != null && k.weight > 0 ? (k.weightedScore / k.weight) : 0),
      frequency: (k.freq || "Monthly"),
      data_source: k.source || "HR records",
      calc_method: `Computed from ${k.source || "HR records"} on a ${k.freq || "Monthly"} cadence. Weighted score = (Actual ÷ Target) × Weight (${Math.round((k.weight||0)*100)}%). Below Gate (${k.unit === "%" ? Math.round(k.gate*100)+"%" : k.gate}) scores zero. ${k.target >= k.gate ? "Higher actual is better." : "Lower actual is better."}`,
      owner: USER.manager,
      lastUpdated: "31 Dec 2025",
      comments: [],
    };
  });

  // ============================================================
  // HISTORY — 2022-2025 from xlsx
  // perspectives + onTrack/atRisk/behind are synthesized using the
  // 2025 KPI mix as a proxy for prior years (xlsx didn't store
  // per-KPI history, only the year totals).
  // ============================================================
  const baseTotalKpis = Math.max(KPIS.length, 6);
  function synthesizePerspectives(overallPct) {
    // Distribute slightly above/below the overall by perspective so the
    // BSC table shows variation without inventing implausible spreads.
    const jitter = (seed) => ((Math.sin(seed * 12.9898) * 43758.5453) % 1 + 1) % 1; // 0..1
    const j1 = (jitter(overallPct + 1) - 0.5) * 6;
    const j2 = (jitter(overallPct + 2) - 0.5) * 6;
    const j3 = (jitter(overallPct + 3) - 0.5) * 6;
    const j4 = (jitter(overallPct + 4) - 0.5) * 6;
    const clamp = (x) => Math.max(0, Math.min(110, Math.round(x * 10) / 10));
    return {
      financial: clamp(overallPct + j1),
      process:   clamp(overallPct + j2),
      people:    clamp(overallPct + j3),
      customer:  clamp(overallPct + j4),
    };
  }
  const HISTORY_HEADLINES = {
    2022: "First full cycle as Deputy Manager — strong onboarding year.",
    2023: "Maintained ~98% — solid delivery on visa & ticketing SLAs.",
    2024: "Recovered to 99%+ — ticketing process improvements landed.",
    2025: "Strong close at 96.9% — visa SLAs and recruitment on target.",
  };
  const HISTORY = ["y2022", "y2023", "y2024", "y2025"]
    .map((k, i) => {
      const v = meRec.ach[k];
      if (v == null) return null;
      const year = 2022 + i;
      const overall = Math.round(v * 1000) / 10;
      // bucket counts from 2025 KPI mix (proxy for older years)
      const onTrack = KPIS.filter((kk) => kk.status === "on_track").length;
      const atRisk  = KPIS.filter((kk) => kk.status === "at_risk").length;
      const behind  = KPIS.filter((kk) => kk.status === "behind").length;
      // Older years had higher avg → shift mix slightly up for 2022-24
      const bias = year < 2025 ? 1 : 0;
      return {
        year,
        overall,
        quarter: `FY ${year}`,
        cycle: `${year} Cycle`,
        onTrack: Math.min(baseTotalKpis, onTrack + bias),
        atRisk:  Math.max(0, atRisk - (year < 2025 ? bias : 0)),
        behind:  behind,
        perspectives: synthesizePerspectives(overall),
        headline: HISTORY_HEADLINES[year] || "",
      };
    })
    .filter(Boolean);

  // ============================================================
  // TEAM — for HR demo, all other HR employees
  // ============================================================
  const TEAM = D.directory
    .filter((d) => d.dept === USER.department && d.active && d.id !== USER.id)
    .map((d) => {
      const ach = d.ach.y2025 != null ? Math.round(d.ach.y2025 * 1000) / 10 : 0;
      let status = "on_track";
      if (ach < 70)      status = "behind";
      else if (ach < 90) status = "at_risk";
      const kpiCount = D.hrIndividualKPIs.filter((k) => k.empId === d.id).length;
      const sub = ["y2022","y2023","y2024","y2025"]
        .map((k) => d.ach[k] == null ? 0 : Math.round(d.ach[k] * 100))
        .filter((v) => v > 0);
      return {
        id: d.id,
        name: d.name,
        title: d.designation,
        department: d.dept,
        achievement: ach,
        status,
        kpis: kpiCount,
        avatarInitials: d.name.split(/\s+/).filter(Boolean).slice(0,2).map(s=>s[0]).join("").toUpperCase(),
        trend: sub.length >= 2 ? sub : [ach, ach],
        category: d.category || "Administrative",
        joinDate: "—",
      };
    })
    .sort((a, b) => b.achievement - a.achievement);

  // ============================================================
  // DEPARTMENTS — derived from dept trend
  // ============================================================
  // 3-letter dept code generator (used in Library cards)
  function deptCode(name) {
    const map = {
      "Aircraft Maintenance Engineering": "AME",
      "Maldivian Aerospace Training": "MAT",
      "Marine Operations": "MAR",
      "Information Technology": "IT",
      "Internal Audit": "AUD",
      "Aviation Safety": "SAF",
      "Aviation Security": "SEC",
      "Quality Assurance": "QA",
      "Human Resources": "HR",
      "Finance": "FIN",
      "Customer Experience": "CX",
      "Flight Operations": "FLT",
      "Ground Operations": "GND",
      "Commercial": "COM",
      "Cabin Crew": "CAB",
      "Procurement": "PRC",
    };
    if (map[name]) return map[name];
    const words = name.split(/\s+/).filter(Boolean);
    if (words.length >= 3) return (words[0][0] + words[1][0] + words[2][0]).toUpperCase();
    if (words.length === 2) return (words[0][0] + words[1].slice(0,2)).toUpperCase();
    return name.slice(0,3).toUpperCase();
  }

  const DEPARTMENTS = D.deptTrend
    .map((t) => {
      const name = t.department.trim();
      const list = D.directory.filter((d) => d.dept === name);
      return {
        id: name.toLowerCase().replace(/\s+/g, "-"),
        name,
        code: deptCode(name),
        headcount: list.filter((e) => e.active).length,
        achievement: t.y2025 == null ? null : Math.round(t.y2025 * 1000) / 10,
        trend: ["y2022","y2023","y2024","y2025"].map(k => t[k] == null ? 0 : Math.round(t[k] * 100)),
      };
    })
    .sort((a, b) => (b.achievement || 0) - (a.achievement || 0));

  // ============================================================
  // LIBRARY_KPIS — Department KPI master list (2025 + 2026)
  // ============================================================
  const LIBRARY_KPIS = D.deptKPIs2025.map((k, i) => {
    const targetDisplay = k.unit === "%" ? Math.round((k.target || 0) * 100) : (k.target == null ? "—" : k.target);
    const gateDisplay   = k.unit === "%" ? Math.round((k.gate   || 0) * 100) : (k.gate   == null ? "—" : k.gate);
    const ytd = (function () {
      for (let m = 11; m >= 0; m--) if (k.actuals[m] != null) return k.actuals[m];
      return null;
    })();
    const ytdDisplay = ytd == null ? "—" : (k.unit === "%" ? Math.round(ytd * 100 * 10) / 10 : ytd);
    const achPct = k.totalScore != null ? Math.round(k.totalScore * 1000) / 10 : 0;
    const status = achPct >= 90 ? "on_track" : achPct >= 70 ? "at_risk" : "behind";
    return {
      id: `${k.department.replace(/\s+/g,"").slice(0,4).toUpperCase()}-${String(k.seq).padStart(2,"0")}`,
      department: k.department,
      year: 2025,
      seq: k.seq,
      name: k.kpiName,
      bsc: mapBsc(k.bsc1, k.bsc2),
      weight: Math.round((k.weight || 0) * 100),
      unit: k.unit,
      gate: gateDisplay,
      target: targetDisplay,
      ytd_actual: ytdDisplay,
      achievement: achPct,
      status,
      frequency: k.frequency || "Monthly",
      owner: k.dataSource || k.department,
      data_source: k.dataSource || "Department records",
      description: `2025 ${k.department} KPI · BSC: ${[k.bsc1, k.bsc2].filter(Boolean).join(" / ")}`,
      calc: `Tracked ${k.frequency || "Monthly"} from ${k.dataSource || "departmental records"}. Gate ${k.unit === "%" ? Math.round((k.gate||0)*100)+"%" : (k.gate ?? "—")} · Target ${k.unit === "%" ? Math.round((k.target||0)*100)+"%" : (k.target ?? "—")} · Weight ${Math.round((k.weight||0)*100)}%. ${(k.target||0) >= (k.gate||0) ? "Higher is better." : "Lower is better."}`,
      monthly: k.actuals.map((v) =>
        v == null ? 0 : (k.unit === "%" ? Math.round(v * 100 * 100) / 100 : v)
      ),
      direction: (k.target || 0) >= (k.gate || 0) ? "higher_better" : "lower_better",
      comments: [],
    };
  });

  // 2026 suggested
  const DEPT_KPIS_2026 = D.deptKPIs2026.map((k) => ({
    id: `${k.department.replace(/\s+/g,"").slice(0,4).toUpperCase()}-26-${String(k.seq).padStart(2,"0")}`,
    department: k.department,
    year: 2026,
    seq: k.seq,
    name: k.kpiName,
    bsc: mapBsc(k.bsc1, k.bsc2),
    bsc_label: [k.bsc1, k.bsc2].filter(Boolean).join(" / "),
    weight: Math.round((k.weight || 0) * 100),
    unit: k.unit,
    gate: k.unit === "%" ? Math.round((k.gate||0)*100) : k.gate,
    target: k.unit === "%" ? Math.round((k.target||0)*100) : k.target,
    frequency: k.frequency || "Monthly",
  }));

  const DEPT_KPIS_2025 = LIBRARY_KPIS;
  const DEPT_TREND = D.deptTrend.map((t) => ({
    department: t.department.trim(),
    y2022: t.y2022 == null ? null : Math.round(t.y2022 * 1000) / 10,
    y2023: t.y2023 == null ? null : Math.round(t.y2023 * 1000) / 10,
    y2024: t.y2024 == null ? null : Math.round(t.y2024 * 1000) / 10,
    y2025: t.y2025 == null ? null : Math.round(t.y2025 * 1000) / 10,
  }));

  // ============================================================
  // ALL_EMPLOYEES — full directory
  // ============================================================
  const ALL_EMPLOYEES = D.directory.map((d) => ({
    id: d.id,
    name: d.name,
    title: d.title,
    designation: d.designation,
    department: d.dept,
    active: d.active,
    achievement: d.ach.y2025 == null ? null : Math.round(d.ach.y2025 * 1000) / 10,
    history: ["y2022","y2023","y2024","y2025"].map(k => d.ach[k] == null ? null : Math.round(d.ach[k] * 1000) / 10),
    band: d.band,
    category: d.category,
  }));

  // ============================================================
  // NOTIFICATIONS — `type` + `time` are what existing screens read;
  // `severity` + `ts` are kept as aliases for newer code paths.
  // ============================================================
  const NOTIFICATIONS = [
    {
      id: "n1", unread: true, type: "cycle", severity: "info",
      title: "2025 KPI cycle closed",
      body: "Your final 2025 achievement of 96.9% is now visible in your Scorecard. Hard copy will be issued during the May 2025 review.",
      time: "2 days ago", ts: "2 days ago", icon: "calendar",
      kpiId: null, screen: "scorecard",
    },
    {
      id: "n2", unread: true, type: "deadline", severity: "warning",
      title: "Action required: Self-review for 2025",
      body: "Submit your 2025 self-review reflections by 15 May 2025. Your line manager will review before the FY26 KPI confirmation meeting.",
      time: "3 days ago", ts: "3 days ago", icon: "edit",
      kpiId: KPIS[0]?.id, screen: "my-kpis",
    },
    {
      id: "n3", unread: true, type: "approval", severity: "success",
      title: "Top Performer notification",
      body: "Congratulations — your 2024 + 2025 scores qualify you for the inaugural TMA Top Performer recognition. HR will be in touch.",
      time: "1 week ago", ts: "1 week ago", icon: "award",
      kpiId: null, screen: "history",
    },
    {
      id: "n4", unread: false, type: "cycle", severity: "info",
      title: "FY2026 KPIs published in Library",
      body: `${DEPT_KPIS_2026.length} suggested 2026 department KPIs are now available. Review the list before your FY26 KPI confirmation.`,
      time: "2 weeks ago", ts: "2 weeks ago", icon: "book",
      kpiId: null, screen: "library",
    },
    {
      id: "n5", unread: false, type: "system", severity: "info",
      title: "KPI Learning Academy launched",
      body: "Complete the 5-module e-learning to understand how KPIs work at TMA. Includes a final quiz and downloadable certificate.",
      time: "3 weeks ago", ts: "3 weeks ago", icon: "book",
      kpiId: null, screen: "academy",
    },
    {
      id: "n6", unread: false, type: "comment", severity: "info",
      title: "Manager comment on Visa SLAs",
      body: "Nishantha left a note on your visa-renewal KPI: \"Strong delivery — push for 100% in 2026 by automating CAA reminder lead time.\"",
      time: "1 month ago", ts: "1 month ago", icon: "comment",
      kpiId: KPIS[3]?.id, screen: "my-kpis",
    },
  ];

  // ============================================================
  // FAQs
  // ============================================================
  const FAQS = [
    {
      q: "How is my KPI score calculated?",
      a: "Each KPI has a Weight, Gate, and Target. Your weighted score = (Actual ÷ Target) × Weight. If your actual falls below the Gate, you score zero for that KPI. All weighted scores sum to your total achievement %.",
    },
    {
      q: "What do GREEN, AMBER, and RED mean?",
      a: "GREEN ≥ 90% (excellent), AMBER 70–89% (room to improve), RED < 70% (needs attention). Both individual KPIs and overall achievement use the same colour bands.",
    },
    {
      q: "How often is my data refreshed?",
      a: "Monthly KPI actuals are loaded by the 5th of the following month. Annual KPIs are settled at year-end. The dashboard timestamp shows the last refresh.",
    },
    {
      q: "What is the Gate?",
      a: "The Gate is the minimum acceptable level for a KPI. If your actual is below the Gate, you score zero for that KPI even if you came close. Gates are set by your HOD based on TMA's strategic risk appetite.",
    },
    {
      q: "Can I see other employees' scores?",
      a: "Employees see only their own data. Managers see direct reports. HR Admin sees the full organisation. The portal enforces role-based access on every request.",
    },
    {
      q: "What happens if my KPI score is consistently low?",
      a: "Low scores are a signal for support, not punishment. Your supervisor will discuss barriers and may recommend training. Focus on the highest-weighted KPI first — that has the biggest impact on your total.",
    },
    {
      q: "When are 2026 KPIs published?",
      a: "Suggested 2026 department KPIs are already in the Library tab. Individual cascade is finalised in the FY26 KPI confirmation meeting (typically Q1).",
    },
    {
      q: "How do I export my Scorecard?",
      a: "Open My Scorecard and press Cmd/Ctrl+P. The print stylesheet renders an A4 page suitable for the personnel file.",
    },
  ];

  // ============================================================
  // Navigation — used by sidebar/header
  // ============================================================
  const ROLE = { EMPLOYEE: "employee", MANAGER: "manager", HR_ADMIN: "hr_admin" };
  const ALL_ROLES = [ROLE.EMPLOYEE, ROLE.MANAGER, ROLE.HR_ADMIN];

  const NAV = [
    { id: "dashboard",     label: "Dashboard",            icon: "home",     roles: ALL_ROLES },
    { id: "my-kpis",       label: "My KPIs",              icon: "kpis",     roles: ALL_ROLES },
    { id: "scorecard",     label: "My Scorecard",         icon: "award",    roles: ALL_ROLES },
    { id: "history",       label: "Performance History",  icon: "trend",    roles: ALL_ROLES },
    { id: "team",          label: "Team View",            icon: "team",     roles: [ROLE.MANAGER, ROLE.HR_ADMIN] },
    { id: "library",       label: "KPI Library",          icon: "book",     roles: ALL_ROLES },
    { id: "academy",       label: "KPI Academy",          icon: "graduation", roles: ALL_ROLES },
    { id: "notifications", label: "Notifications",        icon: "bell",     roles: ALL_ROLES },
    { id: "help",          label: "Help & FAQs",          icon: "help",     roles: ALL_ROLES },
  ];

  // ============================================================
  // ASSIGN GLOBALS
  // ============================================================
  Object.assign(window, {
    USER, CYCLE, BSC, KPIS, HISTORY, TEAM, DEPARTMENTS,
    LIBRARY_KPIS, DEPT_KPIS_2025, DEPT_KPIS_2026, DEPT_TREND,
    ALL_EMPLOYEES, NOTIFICATIONS, FAQS, NAV, ROLE,
  });

  // Resolve apiReady so app.jsx can render without backend
  window.__apiReady = Promise.resolve();
  window.__apiError = null;

  // Stub api object so role-switcher in app.jsx doesn't crash
  window.api = window.api || {
    bootstrap: () => Promise.resolve({}),
    setRole:   () => Promise.resolve(),
    whoami:    () => Promise.resolve({ user: USER }),
  };
})();
