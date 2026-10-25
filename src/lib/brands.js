import { normalizeText } from "./normalize.js";

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
