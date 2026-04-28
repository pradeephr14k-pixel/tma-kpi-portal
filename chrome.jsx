// ============================================================
// TMA KPI Portal — Chrome (header, sidebar, welcome) + Login
// ============================================================
const { useState: cUseState } = React;

const NAV = [
  { id: "dashboard",    label: "Dashboard",          icon: "home",      roles: ["employee", "manager", "hr_admin"] },
  { id: "my-kpis",      label: "My KPIs",            icon: "kpis",      roles: ["employee", "manager", "hr_admin"] },
  { id: "scorecard",    label: "My Scorecard",       icon: "scorecard", roles: ["employee", "manager", "hr_admin"] },
  { id: "history",      label: "Performance History",icon: "history",   roles: ["employee", "manager", "hr_admin"] },
  { id: "team",         label: "Team View",          icon: "team",      roles: ["manager", "hr_admin"] },
  { id: "library",      label: "KPI Library",        icon: "library",   roles: ["employee", "manager", "hr_admin"] },
  { id: "academy",      label: "KPI Academy",        icon: "graduation",roles: ["employee", "manager", "hr_admin"] },
  { id: "notifications",label: "Notifications",      icon: "bell",      roles: ["employee", "manager", "hr_admin"] },
  { id: "help",         label: "Help & FAQs",        icon: "help",      roles: ["employee", "manager", "hr_admin"] },
];

const ROLE_LABEL = {
  employee: "Employee View",
  manager:  "Manager View",
  hr_admin: "HR Admin View",
};

function Header({ role, setRole, onMenu, unread, goto, screen }) {
  const [userOpen, setUserOpen] = cUseState(false);
  return (
    <header className="hdr">
      <button className="hdr__icon-btn no-print" onClick={onMenu} aria-label="Menu" style={{display:"none"}}>
        <Icon name="menu" size={18} />
      </button>
      <div className="hdr__logo">
        <div className="hdr__logo-mark">T</div>
        <div className="hdr__title">
          <b>KPI Self-Service Portal</b>
          <span>Trans Maldivian Airways</span>
        </div>
      </div>
      <div className="hdr__spacer" />
      <div className="hdr__search" role="search">
        <Icon name="search" size={14} color="rgba(255,255,255,.7)" />
        <input placeholder="Search KPIs, departments, colleagues…" />
      </div>
      {/* Role switcher — simulates Entra ID role-based access */}
      <div className="hdr__role" title="Simulated role (maps to Entra ID web roles in production)">
        <Icon name="settings" size={13} color="var(--gold2)" stroke={2}/>
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="employee">Employee</option>
          <option value="manager">Manager</option>
          <option value="hr_admin">HR Admin</option>
        </select>
      </div>
      <button className="hdr__icon-btn" onClick={() => goto("notifications")} aria-label="Notifications">
        <Icon name="bell" size={17} />
        {unread > 0 && <span className="dot" />}
      </button>
      <button className="hdr__user" onClick={() => setUserOpen((v) => !v)} aria-haspopup="menu">
        <div className="avatar">{USER.avatarInitials}</div>
        <div style={{ textAlign: "left" }}>
          <span>{USER.name.split(" ")[0]}</span>
          <small>{USER.department}</small>
        </div>
        <Icon name="chevd" size={14} color="rgba(255,255,255,.6)" />
      </button>
      {userOpen && (
        <div onClick={() => setUserOpen(false)} style={{ position:"fixed", inset:0, zIndex:50 }}>
          <div style={{ position:"absolute", top:52, right:18, background:"#fff", borderRadius:10, boxShadow:"var(--shadow-lg)", padding:"8px", minWidth:240, border:"1px solid var(--border)" }}>
            <div style={{ padding:"8px 10px", borderBottom:"1px solid var(--border)", marginBottom:6 }}>
              <b style={{ fontSize:13 }}>{USER.name}</b>
              <div style={{ fontSize:11, color:"var(--text3)" }}>{USER.id} · {USER.title}</div>
            </div>
            {[
              ["Profile settings", "settings", () => toast("Profile settings live in Entra ID \u2014 opens in production.", "info")],
              ["My scorecard", "scorecard", () => { setUserOpen(false); goto("scorecard"); }],
              ["Notification preferences", "bell", () => toast("Notification preferences \u2014 coming in the next release.", "info")],
              ["Help & FAQs", "help", () => { setUserOpen(false); goto("help"); }],
            ].map(([lbl, ic, fn]) => (
              <button key={lbl} className="side__item" style={{ width:"100%", justifyContent:"flex-start" }}
                onClick={fn}>
                <Icon name={ic} size={14} color="var(--text2)" />
                {lbl}
              </button>
            ))}
            <hr className="hr-line" style={{ margin:"6px 0" }} />
            <button className="side__item" style={{ width:"100%", color:"var(--red)" }}
              onClick={() => { localStorage.removeItem("tma.screen"); location.reload(); }}>
              <Icon name="logout" size={14} color="var(--red)" /> Sign out
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

function Sidebar({ screen, goto, role, unread, open }) {
  const items = NAV.filter((n) => n.roles.includes(role));
  const pri = items.filter((n) => !["library","academy","notifications","help"].includes(n.id));
  const sec = items.filter((n) => ["library","academy","notifications","help"].includes(n.id));
  return (
    <aside className={`side no-print ${open ? "open" : ""}`}>
      <div className="side__sec">Workspace</div>
      {pri.map((n) => (
        <div key={n.id} className={`side__item ${screen === n.id ? "active" : ""}`} onClick={() => goto(n.id)}>
          <Icon name={n.icon} size={16} color={screen === n.id ? "var(--navy)" : "var(--text2)"} />
          {n.label}
        </div>
      ))}
      <div className="side__sec">Resources</div>
      {sec.map((n) => (
        <div key={n.id} className={`side__item ${screen === n.id ? "active" : ""}`} onClick={() => goto(n.id)}>
          <Icon name={n.icon} size={16} color={screen === n.id ? "var(--navy)" : "var(--text2)"} />
          {n.label}
          {n.id === "notifications" && unread > 0 && <span className="badge-count">{unread}</span>}
        </div>
      ))}
      <div className="side__foot">
        <b style={{ color: "var(--navy)", display: "block", marginBottom: 2 }}>Cycle {CYCLE.year} · {CYCLE.quarter}</b>
        Next review {CYCLE.nextReview}<br/>
        <span style={{ color: "var(--text2)" }}>Role: {ROLE_LABEL[role]}</span>
      </div>
    </aside>
  );
}

function Breadcrumb({ trail }) {
  return (
    <div className="crumb">
      {trail.map((t, i) => (
        <React.Fragment key={i}>
          {i > 0 && <span className="sep">/</span>}
          {i === trail.length - 1
            ? <span className="cur">{t.label}</span>
            : <a onClick={t.onClick} style={{ cursor: t.onClick ? "pointer" : "default" }}>{t.label}</a>}
        </React.Fragment>
      ))}
    </div>
  );
}

// ---------- Login Screen ----------
function LoginScreen({ onSignIn }) {
  return (
    <div className="login" data-screen-label="01 Login">
      {/* Seaplane silhouette watermark */}
      <svg className="login__plane" viewBox="0 0 680 340" aria-hidden="true">
        <g fill="#c8a951" stroke="none">
          {/* Stylised seaplane silhouette */}
          <path d="M100 190 L540 150 L600 158 L612 170 L608 182 L540 200 L420 210 L300 208 L180 200 L120 198 Z" />
          <path d="M320 150 L340 100 L360 150 Z" />
          <path d="M280 200 L200 240 L210 250 L300 220 Z" opacity=".8"/>
          <path d="M420 200 L510 240 L500 250 L410 220 Z" opacity=".8"/>
          <rect x="360" y="196" width="120" height="4" />
          <rect x="480" y="150" width="60" height="2" opacity=".7" />
          {/* Pontoon */}
          <path d="M180 226 L520 220 L540 232 L200 238 Z" />
          <path d="M210 226 L210 218 M250 224 L250 216 M290 222 L290 214 M330 220 L330 212 M370 218 L370 210 M410 218 L410 210 M450 218 L450 210 M490 220 L490 212" stroke="#c8a951" strokeWidth="2" />
        </g>
      </svg>
      <svg className="login__wave" viewBox="0 0 1440 120" preserveAspectRatio="none" width="100%" height="120">
        <path d="M0,60 C240,120 480,0 720,60 C960,120 1200,0 1440,60 L1440,120 L0,120 Z" fill="#0e7c6b" />
        <path d="M0,80 C240,140 480,20 720,80 C960,140 1200,20 1440,80 L1440,120 L0,120 Z" fill="#162447" opacity=".5" />
      </svg>

      <div className="login__card">
        <div className="login__brand">
          <div className="login__brand-mark">T</div>
          <div>
            <h1 className="serif">Trans Maldivian Airways</h1>
            <p>Internal Systems</p>
          </div>
        </div>
        <h2>KPI Self-Service Portal</h2>
        <p className="desc">Track your personal KPIs, monthly actuals, and scorecards against the 2025 Balanced Scorecard cycle.</p>
        <button className="login__sso" onClick={onSignIn}>
          {/* Microsoft 4-square logo */}
          <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
            <rect x="1"  y="1"  width="7" height="7" fill="#F25022"/>
            <rect x="10" y="1"  width="7" height="7" fill="#7FBA00"/>
            <rect x="1"  y="10" width="7" height="7" fill="#00A4EF"/>
            <rect x="10" y="10" width="7" height="7" fill="#FFB900"/>
          </svg>
          Sign in with Microsoft
        </button>
        <div className="login__meta">
          Authenticated via Entra ID · TMA corporate account required
        </div>
      </div>
      <div className="login__foot">
        Human Resources Department  ·  Trans Maldivian Airways  ·  Internal Use Only
      </div>
    </div>
  );
}

Object.assign(window, { Header, Sidebar, Breadcrumb, LoginScreen, NAV, ROLE_LABEL });
