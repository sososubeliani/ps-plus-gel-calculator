import { DEFAULT_CONFIG } from "./config.js";

const STORAGE_KEY = "ps-plus-gel-calc:session-config";

function deepClone(value) {
  return JSON.parse(JSON.stringify(value));
}

export function loadConfig() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return deepClone(DEFAULT_CONFIG);
    const parsed = JSON.parse(raw);
    if (!parsed?.currency || !parsed?.profitRanges) return deepClone(DEFAULT_CONFIG);
    return parsed;
  } catch {
    return deepClone(DEFAULT_CONFIG);
  }
}

export function saveConfig(config) {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(config));
}

export function resetConfig() {
  sessionStorage.removeItem(STORAGE_KEY);
  return deepClone(DEFAULT_CONFIG);
}

export function isUsingDefaults() {
  return sessionStorage.getItem(STORAGE_KEY) === null;
}
