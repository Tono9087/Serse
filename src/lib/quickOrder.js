import { normalizeNp } from "./normalize.js";

/**
 * Clamps quantity to an integer between 1 and 9999.
 * If raw is missing, 0, or not a number, returns 1.
 * @param {any} raw
 * @returns {number}
 */
export function parseQty(raw) {
  if (raw === null || raw === undefined || raw === "") return 1;
  const parsed = Number.parseInt(String(raw).trim(), 10);
  if (Number.isNaN(parsed) || parsed < 1) return 1;
  if (parsed > 9999) return 9999;
  return parsed;
}

/**
 * Parses raw text lines for quick quote order.
 * @param {string} text
 * @param {Array<Object>} products
 * @returns {{
 *   matched: Array<{ line: string, np: string, product: Object, qty: number }>,
 *   unmatched: Array<{ line: string, np: string, qty: number }>,
 *   ambiguous: Array<{ line: string, np: string, candidates: Array<Object>, selectedId: string, qty: number }>,
 *   extraCount: number,
 *   totalLines: number
 * }}
 */
export function parseQuickOrder(text = "", products = []) {
  if (!text || typeof text !== "string") {
    return {
      matched: [],
      unmatched: [],
      ambiguous: [],
      extraCount: 0,
      totalLines: 0,
    };
  }

  // Pre-index catalog products by normalizeNp
  const npMap = new Map();
  for (const product of products) {
    if (!product || !product.np) continue;
    const norm = normalizeNp(product.np);
    if (!norm) continue;
    if (!npMap.has(norm)) {
      npMap.set(norm, []);
    }
    npMap.get(norm).push(product);
  }

  // Ignore blank lines and lines starting with '#'
  const allLines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0 && !l.startsWith("#"));

  const MAX_LINES = 200;
  const processLines = allLines.slice(0, MAX_LINES);
  const extraCount = Math.max(0, allLines.length - MAX_LINES);

  const matched = [];
  const unmatched = [];
  const ambiguous = [];

  for (const line of processLines) {
    let npCandidate = "";
    let rawQty = null;

    // (1) If normalizeNp(line) equals exactly one product's npNorm -> qty 1
    const fullNorm = normalizeNp(line);
    if (fullNorm && npMap.has(fullNorm) && npMap.get(fullNorm).length === 1) {
      const product = npMap.get(fullNorm)[0];
      matched.push({
        line,
        np: product.np || line,
        product,
        qty: 1,
      });
      continue;
    }

    // (2) Else split at first tab, semicolon, or comma into [np, qty]
    const delimMatch = line.match(/^([^,\t;]+)[,\t;](.*)$/);
    if (delimMatch) {
      npCandidate = delimMatch[1].trim();
      rawQty = delimMatch[2].trim();
    } else {
      // (3) Else split at trailing integer: ^(.*?)\s+[xX×]?\s*(\d{1,4})$
      const trailingMatch = line.match(/^(.*?)\s+[xX×]?\s*(\d{1,4})$/);
      if (trailingMatch) {
        npCandidate = trailingMatch[1].trim();
        rawQty = trailingMatch[2].trim();
      } else {
        npCandidate = line;
        rawQty = 1;
      }
    }

    const qty = parseQty(rawQty);
    const norm = normalizeNp(npCandidate);
    const candidates = norm ? npMap.get(norm) || [] : [];

    if (candidates.length === 1) {
      matched.push({
        line,
        np: npCandidate,
        product: candidates[0],
        qty,
      });
    } else if (candidates.length > 1) {
      ambiguous.push({
        line,
        np: npCandidate,
        candidates,
        selectedId: candidates[0].id,
        qty,
      });
    } else {
      unmatched.push({
        line,
        np: npCandidate,
        qty,
      });
    }
  }

  return {
    matched,
    unmatched,
    ambiguous,
    extraCount,
    totalLines: processLines.length,
  };
}
