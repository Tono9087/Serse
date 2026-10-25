import Fuse from "fuse.js";
import { normalizeNp, normalizeText } from "./normalize.js";

const indexCache = new WeakMap();

/**
 * Precomputes normalized fields per product and creates a single Fuse instance.
 * @param {Array<Object>} products
 */
export function buildSearchIndex(products = []) {
  if (Array.isArray(products) && indexCache.has(products)) {
    return indexCache.get(products);
  }

  const entries = products.map((product, originalIndex) => ({
    product,
    originalIndex,
    id: product.id,
    npNorm: normalizeNp(product.np),
    nameNorm: normalizeText(product.name),
    brandNorm: normalizeText(product.brand),
    categoryNorm: normalizeText(product.category),
  }));

  const fuse = new Fuse(entries, {
    keys: [
      { name: "nameNorm", weight: 0.5 },
      { name: "brandNorm", weight: 0.3 },
      { name: "categoryNorm", weight: 0.2 },
    ],
    threshold: 0.3,
    ignoreLocation: true,
    includeScore: true,
  });

  const index = { products, entries, fuse };
  if (Array.isArray(products)) {
    indexCache.set(products, index);
  }
  return index;
}

/**
 * Searches products by N/P first (exact > prefix > substring) and then Fuse fuzzy search.
 * @param {string} query
 * @param {Array<Object>} products
 * @param {Object} [precomputedIndex]
 * @returns {Array<Object>}
 */
export function search(query, products = [], precomputedIndex) {
  if (!Array.isArray(products)) return [];
  const trimmed = typeof query === "string" ? query.trim() : "";
  if (!trimmed) {
    return [...products];
  }

  const index =
    precomputedIndex && precomputedIndex.products === products
      ? precomputedIndex
      : buildSearchIndex(products);

  const qNp = normalizeNp(trimmed);
  const qText = normalizeText(trimmed);

  const seenIds = new Set();
  const exactHits = [];
  const prefixHits = [];
  const substringHits = [];

  if (qNp.length >= 2) {
    for (const entry of index.entries) {
      if (!entry.npNorm) continue;
      if (entry.npNorm === qNp) {
        exactHits.push(entry.product);
        seenIds.add(entry.id);
      } else if (entry.npNorm.startsWith(qNp)) {
        prefixHits.push(entry.product);
        seenIds.add(entry.id);
      } else if (entry.npNorm.includes(qNp)) {
        substringHits.push(entry.product);
        seenIds.add(entry.id);
      }
    }
  }

  const fuseHits = [];
  if (qText.length > 0) {
    const fuseResults = index.fuse.search(qText);
    for (const res of fuseResults) {
      const prod = res.item.product;
      if (!seenIds.has(prod.id)) {
        seenIds.add(prod.id);
        fuseHits.push(prod);
      }
    }
  }

  return [...exactHits, ...prefixHits, ...substringHits, ...fuseHits];
}
