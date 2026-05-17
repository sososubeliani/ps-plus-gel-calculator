// Copied verbatim from ps-plus-georgia/cms-backend/utils/recomputeCombined.js
// to guarantee parity with production pricing.
export function calcWithRanges(price, ranges, rate) {
  const p = Number(price || 0);
  for (const r of ranges || []) {
    if (p >= r.min && p <= r.max) {
      return Math.ceil((p + p * (r.value / 100)) * rate);
    }
  }
  return Math.ceil(p * rate);
}

export function calcBaseGel(price, rate) {
  return Math.ceil(Number(price || 0) * rate);
}

export function matchRange(price, ranges) {
  const p = Number(price || 0);
  for (const r of ranges || []) {
    if (p >= r.min && p <= r.max) return r;
  }
  return null;
}
