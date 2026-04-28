// ============================================================
// TMA KPI Portal — Runtime utilities (toast, CSV export, download)
// Load before components.jsx so every file has access.
// ============================================================
(function () {
  // ---------- Toast ----------
  const host = document.createElement("div");
  host.id = "toast-host";
  host.setAttribute("role", "status");
  host.setAttribute("aria-live", "polite");
  document.addEventListener("DOMContentLoaded", () => document.body.appendChild(host));

  let seq = 0;
  window.toast = function toast(message, variant) {
    variant = variant || "info"; // info | success | warn | error
    const id = ++seq;
    const el = document.createElement("div");
    el.className = "toast toast--" + variant;
    el.dataset.id = String(id);

    const icons = {
      info:    "ℹ",
      success: "✓",
      warn:    "!",
      error:   "✕",
    };
    el.innerHTML =
      '<span class="toast__ic">' + (icons[variant] || "•") + '</span>' +
      '<span class="toast__msg"></span>' +
      '<button class="toast__x" aria-label="Dismiss">×</button>';
    el.querySelector(".toast__msg").textContent = message;
    el.querySelector(".toast__x").onclick = () => dismiss(el);

    // Append only if host is attached
    (document.getElementById("toast-host") || host).appendChild(el);
    requestAnimationFrame(() => el.classList.add("in"));
    const t = setTimeout(() => dismiss(el), variant === "error" ? 5500 : 3500);
    el._t = t;
    return id;
  };
  function dismiss(el) {
    if (!el || !el.parentNode) return;
    clearTimeout(el._t);
    el.classList.remove("in");
    el.classList.add("out");
    setTimeout(() => el.parentNode && el.parentNode.removeChild(el), 240);
  }

  // ---------- Download helpers ----------
  window.downloadBlob = function (filename, blob) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = filename;
    document.body.appendChild(a); a.click();
    setTimeout(() => { URL.revokeObjectURL(url); a.remove(); }, 100);
  };

  // Export rows (array of objects) as CSV. Opens cleanly in Excel.
  window.exportCsv = function (filename, rows, columns) {
    if (!rows || !rows.length) {
      window.toast("Nothing to export — no rows match the current filter.", "warn");
      return;
    }
    const cols = columns || Object.keys(rows[0]);
    const esc = (v) => {
      if (v === null || v === undefined) return "";
      const s = String(v);
      return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
    };
    const lines = [cols.map(esc).join(",")];
    for (const r of rows) lines.push(cols.map((c) => esc(r[c])).join(","));
    // BOM so Excel detects UTF-8
    const csv = "\uFEFF" + lines.join("\n");
    window.downloadBlob(filename, new Blob([csv], { type: "text/csv;charset=utf-8" }));
    window.toast("Exported " + rows.length + " row" + (rows.length === 1 ? "" : "s") + " → " + filename, "success");
  };

  // Open print dialog with an optional toast hint
  window.printWithHint = function (hint) {
    if (hint) window.toast(hint, "info");
    setTimeout(() => window.print(), 120);
  };

  // Simple confirm wrapper — returns boolean
  window.confirmAction = function (message) {
    return window.confirm(message);
  };
})();
