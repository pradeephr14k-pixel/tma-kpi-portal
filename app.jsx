// ============================================================
// TMA KPI Portal — App root: routing, role switching, persistence
// ============================================================
const { useState: aUseState, useEffect: aUseEffect } = React;

function App() {
  const [booted, setBooted] = aUseState(() => localStorage.getItem("tma.booted") === "1");
  const [screen, setScreen] = aUseState(() => localStorage.getItem("tma.screen") || "dashboard");
  const [role, setRole] = aUseState(() => localStorage.getItem("tma.role") || "employee");
  const [kpiId, setKpiId] = aUseState(null);
  const [sideOpen, setSideOpen] = aUseState(false);

  aUseEffect(() => { localStorage.setItem("tma.screen", screen); }, [screen]);
  aUseEffect(() => { localStorage.setItem("tma.role", role); }, [role]);
  aUseEffect(() => { localStorage.setItem("tma.booted", booted ? "1" : "0"); }, [booted]);

  // If a manager-only screen is active and role changes to employee, bounce to dashboard
  aUseEffect(() => {
    const allowed = NAV.find((n) => n.id === screen)?.roles.includes(role);
    if (!allowed) setScreen("dashboard");
  }, [role, screen]);

  const goto = (id) => { setScreen(id); setSideOpen(false); };
  const openKpi = (id) => setKpiId(id);
  const closeKpi = () => setKpiId(null);

  const unread = NOTIFICATIONS.filter((n) => n.unread).length;

  if (!booted) return <LoginScreen onSignIn={() => setBooted(true)} />;

  let content = null;
  switch (screen) {
    case "dashboard":     content = <DashboardScreen goto={goto} openKpi={openKpi} />; break;
    case "my-kpis":       content = <MyKpisScreen openKpi={openKpi} />; break;
    case "scorecard":     content = <ScorecardScreen />; break;
    case "history":       content = <HistoryScreen />; break;
    case "team":          content = <TeamScreen viewEmployee={(t) => openKpi(KPIS[0].id)} />; break;
    case "library":       content = <LibraryScreen />; break;
    case "academy":       content = <AcademyScreen />; break;
    case "notifications": content = <NotificationsScreen openKpi={openKpi} />; break;
    case "help":          content = <HelpScreen />; break;
    default:              content = <DashboardScreen goto={goto} openKpi={openKpi} />;
  }

  return (
    <div className="app">
      <Header role={role} setRole={setRole} onMenu={() => setSideOpen(!sideOpen)}
              unread={unread} goto={goto} screen={screen} />
      <div className="body-split">
        <Sidebar screen={screen} goto={goto} role={role} unread={unread} open={sideOpen} />
        <main className="main">
          <div className="main-inner">
            {content}
          </div>
        </main>
      </div>
      {kpiId && <KpiDrawer kpiId={kpiId} onClose={closeKpi} />}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
