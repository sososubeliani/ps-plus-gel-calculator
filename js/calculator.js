import { calcWithRanges, calcBaseGel, matchRange } from "./calc.js";
import { loadConfig, isUsingDefaults } from "./state.js";

const config = loadConfig();

const panels = [
  {
    currency: "lira",
    label: "TRY",
    rate: config.currency.liraToLari,
    ranges: config.profitRanges.lira,
    inputId: "lira-input",
    baseId: "lira-base",
    markupId: "lira-markup",
    finalId: "lira-final",
  },
  {
    currency: "hryvnia",
    label: "UAH",
    rate: config.currency.hryvniaToLari,
    ranges: config.profitRanges.hryvnia,
    inputId: "hryvnia-input",
    baseId: "hryvnia-base",
    markupId: "hryvnia-markup",
    finalId: "hryvnia-final",
  },
];

function setEmpty(panel) {
  document.getElementById(panel.baseId).textContent = "—";
  document.getElementById(panel.markupId).textContent = "—";
  document.getElementById(panel.finalId).textContent = "—";
}

function update(panel, raw) {
  const input = raw.trim();
  if (input === "") {
    setEmpty(panel);
    return;
  }
  const price = Number(input);
  if (!Number.isFinite(price) || price < 0) {
    setEmpty(panel);
    return;
  }

  const base = calcBaseGel(price, panel.rate);
  const final = calcWithRanges(price, panel.ranges, panel.rate);
  const range = matchRange(price, panel.ranges);

  document.getElementById(panel.baseId).textContent = base;
  document.getElementById(panel.finalId).textContent = final;
  const markupEl = document.getElementById(panel.markupId);
  if (range) {
    markupEl.textContent = `+${range.value}% (range ${range.min}–${range.max})`;
    markupEl.classList.remove("muted");
  } else {
    markupEl.textContent = "no range matched — base only";
    markupEl.classList.add("muted");
  }
}

for (const panel of panels) {
  const el = document.getElementById(panel.inputId);
  el.addEventListener("input", (e) => update(panel, e.target.value));
}

const ratesLine = document.getElementById("rates-line");
const dirty = !isUsingDefaults();
ratesLine.innerHTML = `
  Rates in use:
  <strong>1 TRY = ${config.currency.liraToLari} GEL</strong>,
  <strong>1 UAH = ${config.currency.hryvniaToLari} GEL</strong>
  ${dirty ? '<span class="badge">session edits active</span>' : ""}
`;
