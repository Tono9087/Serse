import { normalizeText } from "./normalize.js";

function toSlug(value) {
  return normalizeText(value)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Calculates the total number of products in the catalog matching a brand configuration.
 * Compares product.brand against brand.match entries case-insensitively using normalizeText.
 * @param {{ match?: string[] }} brand
 * @param {Array<{ brand?: string }>} products
 * @returns {number}
 */
export function getBrandProductCount(brand, products) {
  if (!brand?.match || !Array.isArray(brand.match) || brand.match.length === 0) {
    return 0;
  }
  if (!Array.isArray(products) || products.length === 0) {
    return 0;
  }

  const matchSet = new Set(brand.match.map((m) => normalizeText(m)));
  let count = 0;
  for (const product of products) {
    if (product?.brand && matchSet.has(normalizeText(product.brand))) {
      count += 1;
    }
  }
  return count;
}

/**
 * Builds the catalog URL filtered by the brand's exact match strings.
 * Returns "/catalogo" if no match strings are configured.
 * @param {{ match?: string[] }} brand
 * @returns {string}
 */
export function getBrandCatalogUrl(brand) {
  if (!brand?.match || !Array.isArray(brand.match) || brand.match.length === 0) {
    return "/catalogo";
  }

  const encodedBrands = brand.match.map((m) => encodeURIComponent(m)).join(",");
  return `/catalogo?brand=${encodedBrands}`;
}

/**
 * Splits brands into two groups:
 * 1) inStock: brands that actually have products in the catalog (curated matches + any other
 *    brand strings present in catalog.json), sorted by product count desc then name A-Z.
 * 2) onDemand: enabled curated partner brands that currently have 0 products in catalog.json
 *    (supplied under direct quote / on-order distribution).
 * @param {Array<{ name: string, slug: string, match?: string[], enabled?: boolean }>} configuredBrands
 * @param {Array<{ brand?: string | null }>} products
 * @returns {{ inStock: Array<{ brand: object, count: number }>, onDemand: Array<{ brand: object, count: number }> }}
 */
export function buildBrandDirectory(configuredBrands = [], products = []) {
  const enabledCurated = configuredBrands.filter((b) => b.enabled !== false);
  const coveredNormalized = new Set();

  const inStock = [];
  const onDemand = [];

  for (const brand of enabledCurated) {
    for (const m of brand.match || []) {
      coveredNormalized.add(normalizeText(m));
    }
    const count = getBrandProductCount(brand, products);
    if (count > 0) {
      inStock.push({ brand, count });
    } else {
      onDemand.push({ brand, count: 0 });
    }
  }

  // Group remaining catalog brands that are not already covered by a curated entry
  const extraCounts = new Map();
  for (const product of products) {
    const raw = product?.brand ? String(product.brand).trim() : "";
    if (!raw) continue;
    const norm = normalizeText(raw);
    if (coveredNormalized.has(norm)) continue;
    const prev = extraCounts.get(norm);
    if (prev) {
      prev.count += 1;
    } else {
      extraCounts.set(norm, { name: raw, count: 1 });
    }
  }

  const usedSlugs = new Set(enabledCurated.map((b) => b.slug));
  for (const { name, count } of extraCounts.values()) {
    let slug = toSlug(name) || "brand";
    if (usedSlugs.has(slug)) {
      slug = `${slug}-cat`;
    }
    usedSlugs.add(slug);
    inStock.push({
      brand: { name, slug, match: [name], hasLogo: false },
      count,
    });
  }

  inStock.sort((a, b) => {
    if (b.count !== a.count) return b.count - a.count;
    return a.brand.name.localeCompare(b.brand.name, "es");
  });

  return { inStock, onDemand };
}
