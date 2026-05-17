import { loadConfig, saveConfig, resetConfig } from "./state.js";

let config = loadConfig();

const rateInputs = {
  lira: document.getElementById("rate-lira"),
  hryvnia: document.getElementById("rate-hryvnia"),
};
const tbodies = {
  lira: document.getElementById("lira-rows"),
  hryvnia: document.getElementById("hryvnia-rows"),
};

function renderRows(currency) {
  const rows = config.profitRanges[currency];
  const tbody = tbodies[currency];
  tbody.innerHTML = "";
  rows.forEach((range, idx) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td class="index">${idx + 1}.</td>
      <td><input type="number" min="0" step="1" inputmode="numeric" data-field="min" value="${range.min}" /></td>
      <td><input type="number" min="0" step="1" inputmode="numeric" data-field="max" value="${range.max}" /></td>
      <td><input type="number" min="0" step="1" inputmode="numeric" data-field="value" value="${range.value}" /></td>
      <td><button type="button" class="btn-icon" data-remove="${idx}" aria-label="Remove range ${idx + 1}">&times;</button></td>
    `;
    tr.querySelectorAll("input").forEach((input) => {
      input.addEventListener("input", (e) => {
        const field = e.target.dataset.field;
        const num = Number(e.target.value);
        config.profitRanges[currency][idx][field] = Number.isFinite(num) ? num : 0;
        saveConfig(config);
      });
    });
    tr.querySelector("[data-remove]").addEventListener("click", () => {
      config.profitRanges[currency].splice(idx, 1);
      saveConfig(config);
      renderRows(currency);
    });
    tbody.appendChild(tr);
  });
}

function renderAll() {
  rateInputs.lira.value = config.currency.liraToLari;
  rateInputs.hryvnia.value = config.currency.hryvniaToLari;
  renderRows("lira");
  renderRows("hryvnia");
}

rateInputs.lira.addEventListener("input", (e) => {
  const v = Number(e.target.value);
  config.currency.liraToLari = Number.isFinite(v) ? v : 0;
  saveConfig(config);
});
rateInputs.hryvnia.addEventListener("input", (e) => {
  const v = Number(e.target.value);
  config.currency.hryvniaToLari = Number.isFinite(v) ? v : 0;
  saveConfig(config);
});

document.querySelectorAll("[data-add]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const currency = btn.dataset.add;
    const rows = config.profitRanges[currency];
    const last = rows[rows.length - 1];
    const nextMin = last ? Number(last.max) + 1 : 1;
    rows.push({ min: nextMin, max: nextMin + 100, value: 20 });
    saveConfig(config);
    renderRows(currency);
  });
});

function formatRanges(rows) {
  if (!rows.length) return "      []";
  const widthMin = Math.max(...rows.map((r) => String(r.min).length));
  const widthMax = Math.max(...rows.map((r) => String(r.max).length));
  const inner = rows
    .map((r) => {
      const min = String(r.min).padEnd(widthMin);
      const max = String(r.max).padEnd(widthMax);
      return `      { min: ${min}, max: ${max}, value: ${r.value} },`;
    })
    .join("\n");
  return `[\n${inner}\n    ]`;
}

function buildConfigSnippet() {
  return `export const DEFAULT_CONFIG = {
  currency: {
    liraToLari: ${config.currency.liraToLari},
    hryvniaToLari: ${config.currency.hryvniaToLari},
  },
  profitRanges: {
    lira: ${formatRanges(config.profitRanges.lira)},
    hryvnia: ${formatRanges(config.profitRanges.hryvnia)},
  },
};
`;
}

const feedback = document.getElementById("copy-feedback");
function flashFeedback(message, tone = "ok") {
  feedback.textContent = message;
  feedback.dataset.tone = tone;
  setTimeout(() => {
    feedback.textContent = "";
    delete feedback.dataset.tone;
  }, 3000);
}

document.getElementById("copy-config").addEventListener("click", async () => {
  const snippet = buildConfigSnippet();
  try {
    await navigator.clipboard.writeText(snippet);
    flashFeedback("Copied! Paste into js/config.js to save permanently.");
  } catch {
    const ta = document.createElement("textarea");
    ta.value = snippet;
    ta.style.position = "fixed";
    ta.style.left = "-9999px";
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand("copy");
      flashFeedback("Copied! Paste into js/config.js to save permanently.");
    } catch {
      flashFeedback("Copy failed — open the console for the snippet.", "err");
      console.log(snippet);
    }
    document.body.removeChild(ta);
  }
});

document.getElementById("reset-config").addEventListener("click", () => {
  config = resetConfig();
  renderAll();
  flashFeedback("Reset to defaults.");
});

renderAll();
