// ============================================================
// TMA KPI Portal — Design Tweaks Panel
// Floating overlay for reshaping the portal's feel (no-reload).
// Three expressive axes:
//   Density  — how tightly information is packed
//   Palette  — the primary colour identity
//   Type     — typographic character
// ============================================================
(function () {
  const PRESETS = {
    density: {
      compact: `
        .main-inner { padding: 12px 14px !important; gap: 10px !important; }
        .card__pad  { padding: 10px 14px !important; }
        .stat       { padding: 12px 16px !important; }
        .stat-row   { gap: 8px !important; }
        .welcome    { padding: 16px 22px !important; }
        .grid-2     { gap: 10px !important; }
        .tbl td, .tbl th { padding: 5px 8px !important; }
        .ph         { padding: 8px 0 12px !important; }
        .card__hd   { padding: 10px 14px 8px !important; }
        .side__item { padding: 6px 14px !important; }
      `,
      standard: `/* default */`,
      spacious: `
        .main-inner { padding: 28px 32px !important; gap: 22px !important; }
        .card__pad  { padding: 24px !important; }
        .stat       { padding: 24px !important; }
        .stat-row   { gap: 18px !important; }
        .welcome    { padding: 32px 40px !important; }
        .grid-2     { gap: 20px !important; }
        .tbl td, .tbl th { padding: 11px 14px !important; }
        .ph         { padding: 18px 0 24px !important; }
        .card__hd   { padding: 18px 20px 14px !important; }
        .side__item { padding: 10px 20px !important; }
      `,
    },

    palette: {
      navy: `/* default — TMA navy + gold */`,
      sky: `
        :root {
          --navy:   #0369a1 !important;
          --navy2:  #0284c7 !important;
          --gold:   #f59e0b !important;
          --gold2:  #fcd34d !important;
          --gold-l: #fef3c7 !important;
          --teal:   #0891b2 !important;
        }
        .hdr { border-bottom-color: #f59e0b !important; }
      `,
      forest: `
        :root {
          --navy:   #14532d !important;
          --navy2:  #166534 !important;
          --gold:   #84cc16 !important;
          --gold2:  #bef264 !important;
          --gold-l: #f7fee7 !important;
          --teal:   #0f766e !important;
        }
        .hdr { border-bottom-color: #84cc16 !important; }
        .login__wave path:first-child { fill: #0f766e !important; }
      `,
    },

    type: {
      crisp: `/* default — Inter 13px regular */`,
      comfortable: `
        body { font-size: 14px !important; line-height: 1.6 !important; }
        .tbl { font-size: 13.5px !important; }
        .stat__value { font-size: 30px !important; }
        input, select, textarea { font-size: 14px !important; }
      `,
      bold: `
        body { font-weight: 500 !important; }
        .card__hd h3 { font-weight: 800 !important; letter-spacing: -.02em !important; }
        .stat__value  { font-weight: 900 !important; letter-spacing: -.03em !important; }
        .tbl th       { font-weight: 700 !important; letter-spacing: .04em !important; text-transform: uppercase !important; font-size: 10px !important; }
        .side__item   { font-weight: 600 !important; }
      `,
    },
  };

  // Current state
  const state = { density: 'standard', palette: 'navy', type: 'crisp' };

  // Inject a <style> tag for tweaks overrides
  const styleEl = document.createElement('style');
  styleEl.id = 'tma-tweaks-css';
  document.head.appendChild(styleEl);

  function applyTweaks() {
    styleEl.textContent =
      (PRESETS.density[state.density] || '') + '\n' +
      (PRESETS.palette[state.palette] || '') + '\n' +
      (PRESETS.type[state.type]    || '');
  }

  // ---- Panel HTML + CSS ----
  const panelCSS = `
    #twk-toggle {
      position: fixed; bottom: 24px; right: 24px; z-index: 9000;
      width: 44px; height: 44px; border-radius: 50%;
      background: var(--navy, #162447); color: #fff;
      border: 2px solid var(--gold, #c8a951);
      box-shadow: 0 4px 20px rgba(22,36,71,.35);
      display: grid; place-items: center;
      cursor: pointer; font-size: 18px;
      transition: transform .18s, box-shadow .18s;
    }
    #twk-toggle:hover { transform: scale(1.1); box-shadow: 0 6px 24px rgba(22,36,71,.45); }
    #twk-panel {
      position: fixed; bottom: 80px; right: 24px; z-index: 9000;
      width: 280px; background: #fff;
      border-radius: 14px; border: 1px solid var(--border, #e2e5ea);
      box-shadow: 0 12px 40px rgba(22,36,71,.22), 0 2px 10px rgba(22,36,71,.1);
      padding: 18px 20px 20px;
      font-family: 'Inter', sans-serif; font-size: 13px; color: #1a1e2e;
      transform-origin: bottom right;
      transition: opacity .18s, transform .18s;
    }
    #twk-panel.twk-hidden { opacity: 0; transform: scale(.9) translateY(8px); pointer-events: none; }
    .twk-head {
      display: flex; align-items: center; justify-content: space-between;
      margin-bottom: 16px;
    }
    .twk-head b { font-size: 14px; font-weight: 700; color: var(--navy, #162447); }
    .twk-head span { font-size: 11px; color: #8891a5; }
    .twk-section { margin-bottom: 14px; }
    .twk-label {
      font-size: 10.5px; font-weight: 600; letter-spacing: .08em;
      text-transform: uppercase; color: #8891a5; margin-bottom: 6px;
    }
    .twk-pills { display: flex; gap: 6px; }
    .twk-pill {
      flex: 1; padding: 6px 0; border-radius: 8px; text-align: center;
      font-size: 12px; font-weight: 500; cursor: pointer;
      border: 1.5px solid var(--border, #e2e5ea);
      background: var(--bg, #f4f5f8); color: #4a5168;
      transition: all .14s;
    }
    .twk-pill:hover { border-color: var(--navy, #162447); color: var(--navy, #162447); }
    .twk-pill.active {
      background: var(--navy, #162447); color: #fff;
      border-color: var(--navy, #162447);
    }
    .twk-swatch-row { display: flex; gap: 8px; }
    .twk-swatch {
      width: 36px; height: 36px; border-radius: 50%; cursor: pointer;
      border: 3px solid transparent;
      transition: transform .14s, border-color .14s;
    }
    .twk-swatch:hover { transform: scale(1.1); }
    .twk-swatch.active { border-color: var(--gold, #c8a951); }
    .twk-swatch[data-palette="navy"]  { background: linear-gradient(135deg,#162447 50%,#c8a951 50%); }
    .twk-swatch[data-palette="sky"]   { background: linear-gradient(135deg,#0369a1 50%,#f59e0b 50%); }
    .twk-swatch[data-palette="forest"]{ background: linear-gradient(135deg,#14532d 50%,#84cc16 50%); }
    .twk-reset {
      width: 100%; margin-top: 14px; padding: 7px;
      border-radius: 8px; border: 1.5px solid var(--border,#e2e5ea);
      background: none; font-size: 12px; color: #8891a5; cursor: pointer;
      font-family: inherit; transition: color .14s, border-color .14s;
    }
    .twk-reset:hover { color: var(--navy,#162447); border-color: var(--navy,#162447); }
  `;

  const stylePanel = document.createElement('style');
  stylePanel.textContent = panelCSS;
  document.head.appendChild(stylePanel);

  // ---- DOM ----
  function buildPanel() {
    const btn = document.createElement('button');
    btn.id = 'twk-toggle';
    btn.title = 'Design Tweaks';
    btn.innerHTML = '⚙';
    btn.setAttribute('aria-label', 'Open design tweaks panel');

    const panel = document.createElement('div');
    panel.id = 'twk-panel';
    panel.classList.add('twk-hidden');
    panel.setAttribute('aria-label', 'Design tweaks panel');
    panel.innerHTML = `
      <div class="twk-head">
        <b>Design Tweaks</b>
        <span>reshapes the feel</span>
      </div>

      <div class="twk-section">
        <div class="twk-label">Density</div>
        <div class="twk-pills">
          <button class="twk-pill${state.density==='compact'?' active':''}"   data-axis="density" data-val="compact">Compact</button>
          <button class="twk-pill${state.density==='standard'?' active':''}"  data-axis="density" data-val="standard">Standard</button>
          <button class="twk-pill${state.density==='spacious'?' active':''}"  data-axis="density" data-val="spacious">Spacious</button>
        </div>
      </div>

      <div class="twk-section">
        <div class="twk-label">Palette</div>
        <div class="twk-swatch-row">
          <button class="twk-swatch${state.palette==='navy'?' active':''}"   data-axis="palette" data-val="navy"   data-palette="navy"   title="TMA Navy"></button>
          <button class="twk-swatch${state.palette==='sky'?' active':''}"    data-axis="palette" data-val="sky"    data-palette="sky"    title="Sky Blue"></button>
          <button class="twk-swatch${state.palette==='forest'?' active':''}" data-axis="palette" data-val="forest" data-palette="forest" title="Forest Green"></button>
        </div>
      </div>

      <div class="twk-section">
        <div class="twk-label">Typography</div>
        <div class="twk-pills">
          <button class="twk-pill${state.type==='crisp'?' active':''}"       data-axis="type" data-val="crisp">Crisp</button>
          <button class="twk-pill${state.type==='comfortable'?' active':''}" data-axis="type" data-val="comfortable">Airy</button>
          <button class="twk-pill${state.type==='bold'?' active':''}"        data-axis="type" data-val="bold">Bold</button>
        </div>
      </div>

      <button class="twk-reset">Reset to defaults</button>
    `;

    // Toggle open/close
    btn.addEventListener('click', () => panel.classList.toggle('twk-hidden'));

    // Click outside to close
    document.addEventListener('click', (e) => {
      if (!panel.contains(e.target) && e.target !== btn) {
        panel.classList.add('twk-hidden');
      }
    });

    // Pill / swatch clicks
    panel.addEventListener('click', (e) => {
      const el = e.target.closest('[data-axis]');
      if (el) {
        const axis = el.dataset.axis;
        const val  = el.dataset.val;
        state[axis] = val;
        // Update active classes in this section
        panel.querySelectorAll(`[data-axis="${axis}"]`).forEach((p) => p.classList.toggle('active', p.dataset.val === val));
        applyTweaks();
        return;
      }
      if (e.target.classList.contains('twk-reset')) {
        state.density = 'standard'; state.palette = 'navy'; state.type = 'crisp';
        panel.querySelectorAll('[data-axis]').forEach((p) => {
          p.classList.toggle('active',
            (p.dataset.axis === 'density' && p.dataset.val === 'standard') ||
            (p.dataset.axis === 'palette' && p.dataset.val === 'navy') ||
            (p.dataset.axis === 'type'    && p.dataset.val === 'crisp'));
        });
        applyTweaks();
      }
    });

    document.body.appendChild(btn);
    document.body.appendChild(panel);
  }

  // Initialise after DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', buildPanel);
  } else {
    buildPanel();
  }

  applyTweaks();
})();
