export const RFQ_STORAGE_KEY = "serse_rfq_v1";
export const LANG_STORAGE_KEY = "serse_lang";

export function clampQty(qty) {
  const parsed = Number.parseInt(qty, 10);
  if (Number.isNaN(parsed) || parsed < 1) return 1;
  if (parsed > 9999) return 9999;
  return parsed;
}

/**
 * Loads and validates RFQ items from localStorage.
 * Discards ids not present in validIds and malformed entries.
 * @param {Set<string>} validIds
 * @returns {Array<{id: string, qty: number}>}
 */
export function loadRfqItems(validIds) {
  try {
    if (typeof window === "undefined" || !window.localStorage) return [];
    const raw = window.localStorage.getItem(RFQ_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    const seen = new Set();
    const valid = [];

    for (const entry of parsed) {
      if (!entry || typeof entry !== "object") continue;
      const { id, qty } = entry;
      if (typeof id !== "string" || !id.trim()) continue;
      if (validIds && !validIds.has(id)) continue;
      if (seen.has(id)) continue;
      const numQty = Number(qty);
      if (!Number.isFinite(numQty) || numQty < 1) continue;
      seen.add(id);
      valid.push({ id, qty: clampQty(numQty) });
    }
    return valid;
  } catch {
    return [];
  }
}

/**
 * Saves RFQ items to localStorage safely.
 * @param {Array<{id: string, qty: number}>} items
 */
export function saveRfqItems(items) {
  try {
    if (typeof window === "undefined" || !window.localStorage) return;
    window.localStorage.setItem(RFQ_STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Ignore storage quota or private mode errors
  }
}

export function loadLanguage(defaultLang = "es") {
  try {
    if (typeof window === "undefined" || !window.localStorage) return defaultLang;
    const saved = window.localStorage.getItem(LANG_STORAGE_KEY);
    if (saved === "es" || saved === "en") return saved;
    return defaultLang;
  } catch {
    return defaultLang;
  }
}

export function saveLanguage(lang) {
  try {
    if (typeof window === "undefined" || !window.localStorage) return;
    window.localStorage.setItem(LANG_STORAGE_KEY, lang);
  } catch {
    // Ignore storage errors
  }
}
