// ============================================================
// TMA KPI Portal — Screens C: Learning Academy (5 modules + quiz + cert)
// ============================================================
const { useState: cAUseState, useMemo: cAUseMemo, useRef: cAUseRef } = React;

// ============================================================
// Module content — 5 modules, conversational tone, real TMA examples
// ============================================================
const ACADEMY_MODULES = [
  {
    id: "m1",
    title: "What is a KPI, really?",
    minutes: 4,
    summary: "The 30-second version: a Key Performance Indicator is a measurable signal that tells you whether you're moving towards an outcome that matters. Not every number is a KPI — the 'K' is the bar.",
    sections: [
      {
        h: "Three things make a number a KPI",
        body: "It must be (1) tied to a strategic objective, (2) measurable on a clear cadence, and (3) actionable — meaning a person can change their behaviour to move it. \"Number of emails sent\" is a metric. \"Percentage of visa renewals completed before expiry\" is a KPI — it's strategic (compliance), measurable (monthly), and actionable (start the renewal earlier).",
      },
      {
        h: "Lagging vs leading",
        body: "Lagging KPIs tell you what already happened (annual revenue, end-of-year passenger satisfaction). Leading KPIs predict what will happen (on-time aircraft availability this week, training hours completed this quarter). The best scorecards mix both — leading KPIs for early warning, lagging KPIs for accountability.",
      },
      {
        h: "Why TMA uses them",
        body: "TMA's strategy lives in slide decks. KPIs translate that strategy into 56 specific things across 14 departments that everyone can see, measure, and own. When 96% of HR's KPIs hit target, it's not because someone wrote a great memo — it's because the work happened and the numbers prove it.",
      },
    ],
  },
  {
    id: "m2",
    title: "The Balanced Scorecard at TMA",
    minutes: 5,
    summary: "TMA organises every KPI under one of four BSC perspectives. This module shows what each one means and why we don't just measure money.",
    sections: [
      {
        h: "Four perspectives, one strategy",
        body: "Money matters, but it's a lagging signal. The Balanced Scorecard adds three more lenses: how customers experience us, how efficiently our processes run, and how our people grow. A department that hits its financial target by burning out its team or skipping safety reviews is not winning — the scorecard makes that visible.",
      },
      {
        h: "How TMA's KPIs map to perspectives",
        body: "Financial KPIs cover revenue, cost, and budget variance. Internal Process KPIs cover SLAs, audit findings, on-time performance. Customer KPIs cover NPS, complaint resolution, and on-time arrivals. Human Capital KPIs cover training hours, retention, succession readiness, and the wellbeing programmes HR runs.",
      },
      {
        h: "Why weights matter",
        body: "Each KPI carries a weight that reflects how much it contributes to your total achievement. A 30%-weighted KPI moves your score three times more than a 10%-weighted one. Weights are the strategic statement — \"this is what matters most this year\" — and they're set deliberately by HODs, not by you.",
      },
    ],
  },
  {
    id: "m3",
    title: "Gates, Targets & how scoring works",
    minutes: 6,
    summary: "The maths is simpler than it looks. Three numbers — Gate, Target, Actual — combine with one weight to produce your score for each KPI. Below the Gate, you score zero.",
    sections: [
      {
        h: "Gate is the floor, Target is the goal",
        body: "Gate = the minimum acceptable level. Target = the level we're trying to hit. If your Actual is at or above Target, you score full credit. If you're between Gate and Target, you get partial credit, scaled linearly. If you're below the Gate, you score zero on that KPI — even if you came close. That's intentional: Gate represents the line below which the outcome is no longer acceptable.",
      },
      {
        h: "The formula in one line",
        body: "Weighted Score = min(1, Actual ÷ Target) × Weight. If Actual ÷ Gate < 1 → Weighted Score = 0. Sum all weighted scores across your KPIs to get your overall %. Achievement above Target caps at 100% — there's no 'stretch' tier at TMA, so over-performing on one KPI does NOT compensate for under-performing on another.",
      },
      {
        h: "Worked example",
        body: "Visa-renewal SLA: Gate 90%, Target 100%, Weight 25%, Actual 98%. You're above Gate so you score. (98 ÷ 100) × 25% = 24.5%. Now imagine Actual was 88% — below the Gate. Score: 0%. The same 10-point swing produces a 24.5-point difference in your final achievement. That's the Gate doing its job.",
      },
      {
        h: "What about 'lower is better'?",
        body: "Some KPIs (audit findings, attrition rate, customer complaints) are inverted — lower actuals are better. The portal flips the maths automatically: Actual = 2 against Target = 5 produces full credit. The colour bands and Gate logic still apply.",
      },
    ],
  },
  {
    id: "m4",
    title: "Reading your Scorecard",
    minutes: 4,
    summary: "Once you know what KPIs are and how they're scored, your Scorecard becomes a tool for reflection rather than a verdict. This module walks through what to look at first and what to ignore.",
    sections: [
      {
        h: "Start with weight × gap, not just colour",
        body: "Three RED KPIs at 5% weight each cost you 15 points in the worst case. One AMBER at 30% weight can cost you 9 points easily. When prioritising what to fix, multiply each KPI's weight by the gap to Target — that tells you where the biggest score impact lives.",
      },
      {
        h: "BSC balance is the second thing to check",
        body: "If all four green KPIs are Process and your two Customer KPIs are red, you're doing efficient work that customers don't feel. The BSC pie chart on your Scorecard shows weight-by-perspective; the year-by-year BSC table on Performance History shows whether you're consistently strong somewhere and consistently weak somewhere else.",
      },
      {
        h: "The trend matters more than the snapshot",
        body: "A 92% in 2025 after a 99% in 2024 is a different conversation from a 92% in 2025 after an 85% in 2024. The Performance History screen exists for exactly this reason — your score is a story, not a snapshot. Bring the trend to your manager review, not just the headline number.",
      },
    ],
  },
  {
    id: "m5",
    title: "Self-review, disputes & next cycle",
    minutes: 5,
    summary: "The portal isn't a one-way street. Every cycle ends with a self-review you write, a manager comment you can respond to, and a dispute path if a number is wrong. Here's how to use them well.",
    sections: [
      {
        h: "Self-review: keep it specific",
        body: "When you submit your reflections at year-end, your manager reads them BEFORE the conversation. Write what you actually did against each KPI, what blocked you on the ones that fell short, and what you'd change in 2026. \"I did my best\" is not a review — \"the visa portal was down for three weeks in Q3 which is why we ran 92% instead of 98%\" is a review.",
      },
      {
        h: "Disputes: bring data, not feelings",
        body: "If a number on your Scorecard is wrong — wrong actual, wrong weight, KPI that didn't apply to you — raise it in the comments thread on that specific KPI. Include the period, the system you pulled the correct number from, and the screenshot. HR aims to resolve data disputes within 5 working days; methodology disputes go to your HOD.",
      },
      {
        h: "FY26 is being shaped now",
        body: "The Library tab already shows the proposed 2026 KPIs for your department. Read them before your FY26 KPI confirmation meeting and come with questions: do the weights reflect what we said matters? Are the Gates realistic given known resource constraints? This is your one chance to influence the year before it begins.",
      },
    ],
  },
];

// ============================================================
// Quiz — 8 questions, mostly methodology checks
// ============================================================
const ACADEMY_QUIZ = [
  {
    q: "Your Actual is 88% on a KPI with Gate 90% and Target 100%. What's your score on that KPI?",
    options: ["88%", "Partial credit (~88%)", "Zero — below the Gate", "100% because you came close"],
    answer: 2,
    why: "Anything below the Gate scores zero on that KPI, regardless of how close you came. That's the Gate's job — it's the floor below which the outcome is no longer acceptable.",
  },
  {
    q: "Two KPIs: A is 30% weight at 70% achievement, B is 5% weight at 60% achievement. Which has the bigger impact on your total score?",
    options: ["A — by far", "B — lower achievement matters more", "About the same", "Cannot be determined"],
    answer: 0,
    why: "A's gap is 30% × 30 pts = 9 pts of total score impact. B's gap is 5% × 40 pts = 2 pts. Always multiply weight × gap when prioritising what to fix.",
  },
  {
    q: "Which of these is NOT one of the four Balanced Scorecard perspectives at TMA?",
    options: ["Financial", "Customer", "Innovation", "Human Capital"],
    answer: 2,
    why: "TMA uses Financial, Internal Processes, Customer, and Human Capital. \"Innovation\" is part of some BSC variants but TMA's strategy doesn't carve it out as its own perspective.",
  },
  {
    q: "Your KPI achievement is 110% (you over-performed). What's recorded?",
    options: ["110% — over-performance is rewarded", "100% — there's no Stretch tier at TMA", "Whatever your manager decides", "Nothing — over-performance disqualifies the KPI"],
    answer: 1,
    why: "Achievement caps at 100% per KPI. TMA does not use a Stretch tier, so over-performing on one KPI cannot compensate for under-performing on another.",
  },
  {
    q: "A KPI for 'audit findings closed within 30 days' is a:",
    options: ["Higher-is-better KPI", "Lower-is-better KPI", "Trick question — it depends", "Not a KPI"],
    answer: 0,
    why: "Higher percentage closed = better. A KPI like 'open audit findings' would be lower-is-better. Read the unit and direction carefully.",
  },
  {
    q: "Where do you raise a dispute about an incorrect Actual on one of your KPIs?",
    options: ["Email HR", "Comment thread on that specific KPI", "Wait for the year-end review", "It can't be changed"],
    answer: 1,
    why: "Dispute on the KPI's own thread so the context is attached. Include the period, your source for the correct number, and a screenshot. HR targets 5 working days for data disputes.",
  },
  {
    q: "If all your green KPIs are Process and your Customer KPIs are red, what does that suggest?",
    options: ["You're doing fine", "Efficient internally but customers don't feel it", "The weights are wrong", "Process KPIs are easier"],
    answer: 1,
    why: "BSC balance matters. Internal efficiency that doesn't translate into customer outcomes is a strategic gap — exactly the imbalance the Balanced Scorecard is designed to surface.",
  },
  {
    q: "When are 2026 KPIs finalised at the individual level?",
    options: ["1 January 2026", "After the FY26 KPI confirmation meeting in Q1", "When you say so", "They're never finalised"],
    answer: 1,
    why: "Department-level 2026 KPIs are already in the Library. Individual cascade — your specific KPIs and weights — is locked in your FY26 KPI confirmation meeting with your line manager.",
  },
];

// ============================================================
// IMPACT MAP — How KPIs flow through the org
// ============================================================
function ImpactMap() {
  return (
    <div className="card">
      <div className="card__hd">
        <h3>How a KPI travels from strategy to your scorecard</h3>
        <span className="meta">Visualisation · click any node for detail</span>
      </div>
      <div className="card__pad">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 14, alignItems: "stretch", position: "relative" }}>
          {[
            { tag: "01 STRATEGY", title: "TMA Annual Plan", body: "Board approves yearly strategic objectives — e.g. 'expand resort coverage', 'reduce ground turnaround time', 'strengthen cabin safety culture'." },
            { tag: "02 BSC",       title: "Balanced Scorecard", body: "Every objective is sorted into one of four perspectives so the year is balanced across Financial, Process, Customer, and People." },
            { tag: "03 DEPARTMENT", title: "Department KPIs", body: "Each of TMA's 14 departments owns 3–5 KPIs that translate the strategy into measurable outcomes for that team — published in the Library." },
            { tag: "04 INDIVIDUAL", title: "Your scorecard", body: "Your line manager cascades the relevant department KPIs to you with specific weights, gates, and targets — that's what you see on My KPIs." },
          ].map((s, i) => (
            <div key={i} style={{ position: "relative" }}>
              <div style={{ background: "linear-gradient(135deg,#fff,var(--gold-l))", border: "1px solid var(--border)", borderRadius: 10, padding: 14, height: "100%", boxSizing: "border-box" }}>
                <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: ".12em", color: "var(--gold)", marginBottom: 4 }}>{s.tag}</div>
                <div className="serif" style={{ fontSize: 17, color: "var(--navy)", marginBottom: 6, lineHeight: 1.2 }}>{s.title}</div>
                <div style={{ fontSize: 12, color: "var(--text2)", lineHeight: 1.5 }}>{s.body}</div>
              </div>
              {i < 3 && (
                <div style={{ position: "absolute", top: "50%", right: -10, transform: "translateY(-50%)", color: "var(--gold)", zIndex: 2, pointerEvents: "none" }}>
                  <Icon name="chev" size={18} color="var(--gold)" />
                </div>
              )}
            </div>
          ))}
        </div>

        <div style={{ marginTop: 18, padding: "14px 16px", background: "var(--navy)", borderRadius: 10, color: "#fff", display: "flex", justifyContent: "space-between", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
          <div>
            <div style={{ fontSize: 10.5, color: "var(--gold2)", textTransform: "uppercase", letterSpacing: ".1em", fontWeight: 700, marginBottom: 2 }}>Worked example</div>
            <div className="serif" style={{ fontSize: 15 }}>"Reduce passenger complaints" → Customer perspective → CX Dept KPI #3 → cascaded to CX team leads with weight 20% each.</div>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            {Object.keys(BSC).map((k) => (
              <div key={k} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11.5, fontWeight: 600 }}>
                <span className="bsc-dot" style={{ background: bscColor(k) }}/>{BSC[k].label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// MODULE READER (expandable)
// ============================================================
function ModuleCard({ mod, idx, completed, expanded, onToggle, onComplete }) {
  return (
    <div className="card" style={{ overflow: "hidden" }}>
      <div className="card__hd"
           onClick={() => onToggle(mod.id)}
           style={{ cursor: "pointer", background: completed ? "var(--gold-l)" : "#fff" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1, minWidth: 0 }}>
          <div style={{
            width: 38, height: 38, borderRadius: 8,
            background: completed ? "var(--green)" : "var(--navy)",
            color: completed ? "#fff" : "var(--gold2)",
            display: "grid", placeItems: "center",
            fontFamily: "Merriweather, serif", fontWeight: 900, fontSize: 13,
          }}>
            {completed ? <Icon name="check" size={18} color="#fff"/> : (idx + 1)}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h3 style={{ margin: 0, fontSize: 14.5 }}>{mod.title}</h3>
            <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 1 }}>
              Module {idx + 1} of {ACADEMY_MODULES.length} · {mod.minutes} min read · {mod.sections.length} sections
            </div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {completed && <span className="ach ach--green"><span className="dot"/>Completed</span>}
          <Icon name={expanded ? "chevu" : "chevd"} size={14} color="var(--text2)"/>
        </div>
      </div>
      {expanded && (
        <div className="card__pad" style={{ borderTop: "1px solid var(--border)", background: "linear-gradient(180deg, var(--bg) 0%, #fff 60px)" }}>
          <p style={{ fontSize: 13.5, color: "var(--text2)", lineHeight: 1.6, margin: "0 0 14px", maxWidth: 720, fontStyle: "italic", borderLeft: "3px solid var(--gold)", paddingLeft: 12 }}>
            {mod.summary}
          </p>
          {mod.sections.map((s, j) => (
            <div key={j} style={{ marginBottom: 16, maxWidth: 760 }}>
              <h4 className="serif" style={{ margin: "0 0 6px", fontSize: 15, color: "var(--navy)" }}>{s.h}</h4>
              <p style={{ margin: 0, fontSize: 13, color: "var(--text2)", lineHeight: 1.65 }}>{s.body}</p>
            </div>
          ))}
          <div style={{ marginTop: 10, paddingTop: 14, borderTop: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
            <span style={{ fontSize: 12, color: "var(--text3)" }}>
              {completed ? "You've completed this module." : "Mark as read to track your progress."}
            </span>
            <div style={{ display: "flex", gap: 8 }}>
              {!completed && (
                <button className="btn btn--primary btn--sm" onClick={() => onComplete(mod.id)}>
                  <Icon name="check" size={13}/> Mark complete
                </button>
              )}
              {completed && (
                <button className="btn btn--ghost btn--sm" onClick={() => onComplete(mod.id, true)}>
                  Mark as unread
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// QUIZ
// ============================================================
function Quiz({ onPass }) {
  const [answers, setAnswers] = cAUseState({});
  const [submitted, setSubmitted] = cAUseState(false);
  const correct = Object.keys(answers).filter((i) => answers[i] === ACADEMY_QUIZ[i].answer).length;
  const total = ACADEMY_QUIZ.length;
  const pct = Math.round((correct / total) * 100);
  const passed = submitted && correct >= total - 1; // pass = 7/8 or better

  const submit = () => {
    if (Object.keys(answers).length < total) {
      toast(`Please answer all ${total} questions before submitting.`, "warn");
      return;
    }
    setSubmitted(true);
    if (correct >= total - 1) {
      toast(`Quiz passed — ${correct}/${total} correct. Certificate unlocked.`, "success");
      onPass && onPass();
    } else {
      toast(`Quiz scored ${correct}/${total}. Pass mark is ${total - 1}/${total} — review the modules and retry.`, "warn");
    }
  };

  const reset = () => { setAnswers({}); setSubmitted(false); };

  return (
    <div className="card">
      <div className="card__hd">
        <h3>Final knowledge check</h3>
        <span className="meta">{total} questions · pass mark {total - 1}/{total} · re-take any time</span>
      </div>
      <div className="card__pad" style={{ paddingTop: 4 }}>
        {ACADEMY_QUIZ.map((q, i) => {
          const picked = answers[i];
          const isRight = picked === q.answer;
          return (
            <div key={i} style={{ borderBottom: i < total - 1 ? "1px solid var(--border)" : 0, padding: "14px 0" }}>
              <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                <div style={{ width: 22, height: 22, borderRadius: 11, background: "var(--navy)", color: "var(--gold2)", display: "grid", placeItems: "center", fontSize: 11, fontWeight: 800, flexShrink: 0, marginTop: 1 }}>{i + 1}</div>
                <b style={{ fontSize: 13.5, lineHeight: 1.4 }}>{q.q}</b>
              </div>
              <div style={{ display: "grid", gap: 6, marginTop: 10, marginLeft: 32 }}>
                {q.options.map((opt, j) => {
                  const sel = picked === j;
                  let bg = "#fff", border = "1px solid var(--border)", color = "var(--text1)";
                  if (submitted) {
                    if (j === q.answer) { bg = "rgba(34,197,94,.08)"; border = "1px solid var(--green)"; color = "var(--green)"; }
                    else if (sel)        { bg = "rgba(239,68,68,.05)"; border = "1px solid var(--red)";   color = "var(--red)"; }
                  } else if (sel) { bg = "var(--gold-l)"; border = "1px solid var(--gold)"; }
                  return (
                    <label key={j} style={{
                      display: "flex", alignItems: "center", gap: 8, padding: "9px 12px",
                      border, borderRadius: 7, background: bg, color, cursor: submitted ? "default" : "pointer",
                      fontSize: 12.5, fontWeight: sel ? 600 : 400,
                    }}>
                      <input type="radio" name={`q${i}`} disabled={submitted} checked={sel} onChange={() => setAnswers({ ...answers, [i]: j })} style={{ margin: 0 }}/>
                      {opt}
                      {submitted && j === q.answer && <Icon name="check" size={13} color="var(--green)"/>}
                    </label>
                  );
                })}
              </div>
              {submitted && (
                <div style={{ marginLeft: 32, marginTop: 8, padding: 10, background: isRight ? "rgba(34,197,94,.06)" : "var(--gold-l)", borderRadius: 6, fontSize: 12, color: "var(--text2)", lineHeight: 1.55 }}>
                  <b style={{ color: isRight ? "var(--green)" : "var(--gold)" }}>{isRight ? "Correct." : "Why the right answer:"}</b> {q.why}
                </div>
              )}
            </div>
          );
        })}

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 16, paddingTop: 14, borderTop: "2px solid var(--navy)", flexWrap: "wrap", gap: 12 }}>
          <div>
            <div className="serif" style={{ fontSize: 22, color: submitted ? (passed ? "var(--green)" : "var(--amber)") : "var(--text3)" }}>
              {submitted ? `${correct} / ${total}` : `Answered ${Object.keys(answers).length} / ${total}`}
              {submitted && <span style={{ fontSize: 14, fontWeight: 600, color: "var(--text2)", marginLeft: 8 }}>({pct}%)</span>}
            </div>
            <div style={{ fontSize: 11.5, color: "var(--text3)" }}>
              {submitted ? (passed ? "Passed — certificate unlocked below." : `Pass mark is ${total - 1}/${total}. Review the modules and retry.`) : "Submit when you've answered every question."}
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {!submitted && <button className="btn btn--primary" onClick={submit}><Icon name="check" size={14}/> Submit answers</button>}
            {submitted && <button className="btn btn--ghost" onClick={reset}>Retake quiz</button>}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// CERTIFICATE
// ============================================================
function Certificate({ unlocked }) {
  const today = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  const certNo = `TMA-KPI-${USER.id}-${new Date().getFullYear()}`;

  if (!unlocked) {
    return (
      <div className="card" style={{ background: "linear-gradient(135deg, var(--bg), #fff)", border: "1px dashed var(--border)" }}>
        <div className="card__pad" style={{ display: "flex", alignItems: "center", gap: 14, padding: 24 }}>
          <div style={{ width: 56, height: 56, borderRadius: 12, background: "var(--bg)", display: "grid", placeItems: "center", color: "var(--text3)" }}>
            <Icon name="award" size={28}/>
          </div>
          <div style={{ flex: 1 }}>
            <h3 style={{ margin: 0 }}>Certificate of Completion</h3>
            <p style={{ margin: "4px 0 0", fontSize: 12.5, color: "var(--text3)" }}>
              Complete all 5 modules and pass the quiz to unlock your certificate.
            </p>
          </div>
          <span className="ach" style={{ background: "var(--bg)", color: "var(--text3)" }}><span className="dot" style={{ background: "var(--text3)" }}/>Locked</span>
        </div>
      </div>
    );
  }

  return (
    <div className="card cert-wrap" style={{ overflow: "hidden" }}>
      <div className="card__hd no-print">
        <h3>Your certificate</h3>
        <button className="btn btn--primary btn--sm" onClick={() => printWithHint("Use Save-as-PDF in the print dialog. The certificate prints on a single A4 landscape page.")}>
          <Icon name="download" size={13}/> Download / Print
        </button>
      </div>
      <div className="cert" style={{
        margin: 16, padding: "32px 36px", border: "8px double var(--gold)",
        background: "linear-gradient(135deg, #fff 0%, var(--gold-l) 100%)",
        borderRadius: 4, textAlign: "center", position: "relative",
      }}>
        {/* corner ornaments */}
        {[
          { top: 6, left: 6 }, { top: 6, right: 6 },
          { bottom: 6, left: 6 }, { bottom: 6, right: 6 },
        ].map((s, i) => (
          <div key={i} style={{ position: "absolute", ...s, width: 22, height: 22, color: "var(--navy)" }}>
            <svg viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M2 2v8M2 2h8M20 20v-8M20 20h-8" strokeLinecap="round"/>
              <circle cx="2" cy="2" r="1.5" fill="currentColor"/><circle cx="20" cy="20" r="1.5" fill="currentColor"/>
            </svg>
          </div>
        ))}
        <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: ".25em", color: "var(--gold)", marginBottom: 6 }}>TRANS MALDIVIAN AIRWAYS</div>
        <div style={{ fontSize: 11, color: "var(--text3)", letterSpacing: ".2em", marginBottom: 18 }}>HUMAN RESOURCES · LEARNING & DEVELOPMENT</div>

        <h2 className="serif" style={{ margin: 0, fontSize: 32, color: "var(--navy)" }}>Certificate of Completion</h2>
        <div style={{ fontSize: 12, color: "var(--text2)", marginTop: 4, fontStyle: "italic" }}>This is to certify that</div>

        <div className="serif" style={{ fontSize: 28, color: "var(--navy)", margin: "18px 0 4px", borderBottom: "1px solid var(--gold)", paddingBottom: 8, display: "inline-block", minWidth: 360 }}>
          {USER.name}
        </div>
        <div style={{ fontSize: 11, color: "var(--text3)" }}>{USER.title} · Employee {USER.id}</div>

        <div style={{ fontSize: 13, color: "var(--text2)", margin: "20px auto", maxWidth: 540, lineHeight: 1.6 }}>
          has successfully completed the <b>TMA KPI Self-Service Portal Learning Programme</b>, comprising five modules on the Balanced Scorecard methodology, Gate/Target scoring, scorecard reading, and the FY26 cycle, and has passed the final knowledge check.
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: 36, paddingTop: 12, gap: 30 }}>
          <div style={{ flex: 1, textAlign: "center" }}>
            <div className="serif" style={{ fontSize: 22, color: "var(--navy)", fontStyle: "italic", borderBottom: "1px solid var(--text2)", paddingBottom: 4, marginBottom: 4 }}>Nishantha&nbsp;Jayawardena</div>
            <div style={{ fontSize: 10.5, color: "var(--text3)", letterSpacing: ".06em" }}>HEAD OF HUMAN RESOURCES</div>
          </div>
          <div style={{ flex: 1, textAlign: "center" }}>
            <div style={{ fontFamily: "Merriweather, serif", fontSize: 13, color: "var(--text1)", borderBottom: "1px solid var(--text2)", paddingBottom: 4, marginBottom: 4 }}>{today}</div>
            <div style={{ fontSize: 10.5, color: "var(--text3)", letterSpacing: ".06em" }}>DATE OF COMPLETION</div>
          </div>
          <div style={{ flex: 1, textAlign: "center" }}>
            <div style={{ fontFamily: "Merriweather, serif", fontSize: 13, color: "var(--text1)", borderBottom: "1px solid var(--text2)", paddingBottom: 4, marginBottom: 4, fontVariantNumeric: "tabular-nums" }}>{certNo}</div>
            <div style={{ fontSize: 10.5, color: "var(--text3)", letterSpacing: ".06em" }}>CERTIFICATE NUMBER</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// MAIN ACADEMY SCREEN
// ============================================================
function AcademyScreen() {
  const STORAGE_KEY = "tma_academy_progress_v1";
  const persisted = (() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}"); } catch (e) { return {}; }
  })();

  const [completed, setCompleted] = cAUseState(new Set(persisted.completed || []));
  const [expanded, setExpanded]   = cAUseState(persisted.expanded || ACADEMY_MODULES[0].id);
  const [quizPassed, setQuizPassed] = cAUseState(!!persisted.quizPassed);

  const persist = (next) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        completed: [...(next.completed ?? completed)],
        expanded:  next.expanded ?? expanded,
        quizPassed: next.quizPassed ?? quizPassed,
      }));
    } catch (e) {}
  };

  const toggle = (id) => {
    const nx = expanded === id ? null : id;
    setExpanded(nx);
    persist({ expanded: nx });
  };

  const markComplete = (id, undo) => {
    const next = new Set(completed);
    if (undo) next.delete(id); else next.add(id);
    setCompleted(next);
    persist({ completed: next });
    if (!undo) toast(`Module marked complete (${next.size} of ${ACADEMY_MODULES.length})`, "success");
  };

  const allRead = completed.size === ACADEMY_MODULES.length;
  const certUnlocked = allRead && quizPassed;

  return (
    <div data-screen-label="11 Academy">
      <Breadcrumb trail={[{ label: "Home" }, { label: "KPI Academy" }]}/>
      <div className="ph">
        <div>
          <h1 className="serif">KPI Learning Academy</h1>
          <div className="ph__sub">Five short modules + quiz · ~24 min · understand how KPIs work at TMA before your FY26 confirmation</div>
        </div>
        <div className="ph__actions">
          {certUnlocked && <span className="ach ach--green"><span className="dot"/>Programme complete</span>}
        </div>
      </div>

      {/* PROGRESS HERO */}
      <div className="card" style={{ marginBottom: 14, background: "linear-gradient(135deg, var(--navy) 0%, var(--navy2) 100%)", color: "#fff", border: "none", overflow: "hidden", position: "relative" }}>
        <div style={{ position: "absolute", inset: 0, opacity: 0.05, background: "radial-gradient(circle at 80% 20%, var(--gold) 0, transparent 50%)" }}/>
        <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr 1fr", gap: 0, position: "relative" }}>
          <div style={{ padding: "20px 22px", borderRight: "1px solid rgba(255,255,255,.1)" }}>
            <div style={{ fontSize: 10.5, color: "var(--gold2)", textTransform: "uppercase", letterSpacing: ".12em", fontWeight: 700 }}>Your progress</div>
            <div className="serif" style={{ fontSize: 28, marginTop: 2 }}>
              {completed.size} <span style={{ fontSize: 16, color: "rgba(255,255,255,.6)" }}>/ {ACADEMY_MODULES.length} modules</span>
            </div>
            <div style={{ height: 6, background: "rgba(255,255,255,.15)", borderRadius: 3, marginTop: 10, overflow: "hidden" }}>
              <div style={{ width: `${(completed.size / ACADEMY_MODULES.length) * 100}%`, height: "100%", background: "var(--gold)", transition: "width .4s" }}/>
            </div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,.55)", marginTop: 6 }}>
              {allRead ? "All modules read — take the quiz." : "Read all modules to unlock the quiz."}
            </div>
          </div>
          <div style={{ padding: "20px 22px", borderRight: "1px solid rgba(255,255,255,.1)" }}>
            <div style={{ fontSize: 10.5, color: "var(--gold2)", textTransform: "uppercase", letterSpacing: ".12em", fontWeight: 700 }}>Modules</div>
            <div className="serif" style={{ fontSize: 28, marginTop: 2 }}>{ACADEMY_MODULES.length}</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,.55)" }}>{ACADEMY_MODULES.reduce((s, m) => s + m.minutes, 0)} min total reading</div>
          </div>
          <div style={{ padding: "20px 22px", borderRight: "1px solid rgba(255,255,255,.1)" }}>
            <div style={{ fontSize: 10.5, color: "var(--gold2)", textTransform: "uppercase", letterSpacing: ".12em", fontWeight: 700 }}>Quiz</div>
            <div className="serif" style={{ fontSize: 28, marginTop: 2, color: quizPassed ? "var(--green)" : "#fff" }}>
              {quizPassed ? "Passed" : `${ACADEMY_QUIZ.length} Qs`}
            </div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,.55)" }}>Pass mark {ACADEMY_QUIZ.length - 1}/{ACADEMY_QUIZ.length}</div>
          </div>
          <div style={{ padding: "20px 22px" }}>
            <div style={{ fontSize: 10.5, color: "var(--gold2)", textTransform: "uppercase", letterSpacing: ".12em", fontWeight: 700 }}>Certificate</div>
            <div className="serif" style={{ fontSize: 28, marginTop: 2, color: certUnlocked ? "var(--green)" : "rgba(255,255,255,.5)" }}>
              {certUnlocked ? "Unlocked" : "Locked"}
            </div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,.55)" }}>Print-ready A4 landscape</div>
          </div>
        </div>
      </div>

      {/* IMPACT MAP */}
      <div style={{ marginBottom: 14 }}>
        <ImpactMap />
      </div>

      {/* MODULES */}
      <div className="ph" style={{ marginBottom: 12 }}>
        <div>
          <h2 className="serif" style={{ fontSize: 20, margin: 0 }}>Modules</h2>
          <div className="ph__sub">Click any module to expand · mark complete to track progress</div>
        </div>
        <div className="ph__actions">
          <button className="btn btn--ghost btn--sm" onClick={() => {
            const all = new Set(ACADEMY_MODULES.map((m) => m.id));
            setCompleted(all);
            persist({ completed: all });
            toast("All modules marked complete.", "success");
          }}>Mark all complete</button>
          <button className="btn btn--ghost btn--sm" onClick={() => {
            if (!confirmAction("Reset all academy progress (modules, quiz, certificate)?")) return;
            setCompleted(new Set()); setQuizPassed(false);
            persist({ completed: new Set(), quizPassed: false });
            toast("Academy progress reset.", "info");
          }}>Reset progress</button>
        </div>
      </div>

      <div className="col">
        {ACADEMY_MODULES.map((m, i) => (
          <ModuleCard
            key={m.id} mod={m} idx={i}
            completed={completed.has(m.id)}
            expanded={expanded === m.id}
            onToggle={toggle}
            onComplete={markComplete}
          />
        ))}
      </div>

      {/* QUIZ */}
      <div style={{ marginTop: 18 }}>
        {!allRead ? (
          <div className="card" style={{ background: "var(--bg)", border: "1px dashed var(--border)" }}>
            <div className="card__pad" style={{ display: "flex", alignItems: "center", gap: 12, padding: 20 }}>
              <div style={{ width: 44, height: 44, borderRadius: 8, background: "#fff", border: "1px solid var(--border)", display: "grid", placeItems: "center", color: "var(--text3)" }}>
                <Icon name="lock" size={20}/>
              </div>
              <div style={{ flex: 1 }}>
                <b style={{ fontSize: 14 }}>Quiz locked</b>
                <div style={{ fontSize: 12, color: "var(--text3)", marginTop: 2 }}>
                  Complete all {ACADEMY_MODULES.length} modules to unlock the final knowledge check. ({completed.size} of {ACADEMY_MODULES.length} done)
                </div>
              </div>
            </div>
          </div>
        ) : (
          <Quiz onPass={() => { setQuizPassed(true); persist({ quizPassed: true }); }}/>
        )}
      </div>

      {/* CERTIFICATE */}
      <div style={{ marginTop: 14 }}>
        <Certificate unlocked={certUnlocked} />
      </div>

      {/* FOOTNOTE */}
      <div style={{ marginTop: 14, padding: "12px 14px", fontSize: 11.5, color: "var(--text3)", textAlign: "center" }}>
        Programme designed by HR Learning & Development · Content reviewed by HOD-HR · Questions? Contact <a href="mailto:hr.learning@tma.mv" style={{ color: "var(--navy)" }}>hr.learning@tma.mv</a>
      </div>
    </div>
  );
}

Object.assign(window, { AcademyScreen, ACADEMY_MODULES, ACADEMY_QUIZ });
