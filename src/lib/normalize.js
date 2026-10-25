/**
 * Normalizes general text: lowercase, strip accents (NFD), trim, collapse whitespace.
 * @param {string | null | undefined} s
 * @returns {string}
 */
export function normalizeText(s) {
  if (s === null || s === undefined) return "";
  return String(s)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ");
}

/**
 * Normalizes part numbers (N/P): lowercase and remove every character that is not an ASCII letter or digit.
 * Example: "PC 3/8-01", "pc3/8-01", "PC38 01" -> "pc3801"
 * @param {string | null | undefined} s
 * @returns {string}
 */
export function normalizeNp(s) {
  if (s === null || s === undefined) return "";
  return String(s)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}
