import { search } from "./search.js";
import { normalizeNp } from "./normalize.js";

function normalizeBrandsFilter(brands, brand) {
  const source = brands !== undefined ? brands : brand;
  if (!source) return [];
  if (Array.isArray(source)) {
    return source.map((b) => String(b).trim()).filter(Boolean);
  }
  if (typeof source === "string") {
    return source
      .split(",")
      .map((b) => b.trim())
      .filter(Boolean);
  }
  return [];
}

function compareByName(a, b) {
  const cmp = (a.name || "").localeCompare(b.name || "", "es", {
    sensitivity: "base",
  });
  if (cmp !== 0) return cmp;
  return (a.id || "").localeCompare(b.id || "");
}

function compareByBrand(a, b) {
  const aHasBrand = Boolean(a.brand);
  const bHasBrand = Boolean(b.brand);
  if (aHasBrand && !bHasBrand) return -1;
  if (!aHasBrand && bHasBrand) return 1;
  if (aHasBrand && bHasBrand) {
    const brandCmp = a.brand.localeCompare(b.brand, "es", {
      sensitivity: "base",
    });
    if (brandCmp !== 0) return brandCmp;
  }
  return compareByName(a, b);
}

function compareByNp(a, b) {
  const aNorm = normalizeNp(a.np);
  const bNorm = normalizeNp(b.np);
  if (aNorm && !bNorm) return -1;
  if (!aNorm && bNorm) return 1;
  if (aNorm && bNorm) {
    const cmp = aNorm.localeCompare(bNorm, "es");
    if (cmp !== 0) return cmp;
  }
  return compareByName(a, b);
}

function getNpMatchTier(product, qNp) {
  if (!qNp || qNp.length < 2) return 3;
  const npNorm = normalizeNp(product.np);
  if (!npNorm) return 3;
  if (npNorm === qNp) return 0;
  if (npNorm.startsWith(qNp)) return 1;
  if (npNorm.includes(qNp)) return 2;
  return 3;
}

/**
 * Applies category -> subcategory -> brands -> text -> sort filters.
 * @param {Array<Object>} products
 * @param {Object} filters
 * @returns {Array<Object>}
 */
export function applyFilters(products = [], filters = {}) {
  if (!Array.isArray(products)) return [];
  const { q = "", cat = "", sub = "", brands, brand, sort = "name" } = filters;
  const activeBrands = normalizeBrandsFilter(brands, brand);
  const brandSet = activeBrands.length > 0 ? new Set(activeBrands) : null;

  let result = products.filter((p) => {
    if (cat && p.category !== cat) return false;
    if (sub && p.subcategory !== sub) return false;
    if (brandSet && (!p.brand || !brandSet.has(p.brand))) return false;
    return true;
  });

  const trimmedQ = typeof q === "string" ? q.trim() : "";
  if (trimmedQ) {
    result = search(trimmedQ, result);
  } else {
    result = [...result];
  }

  const qNp = trimmedQ ? normalizeNp(trimmedQ) : "";

  if (sort === "brand") {
    result.sort(compareByBrand);
  } else if (sort === "np") {
    result.sort(compareByNp);
  } else if (sort === "name" || !trimmedQ) {
    if (trimmedQ && qNp.length >= 2) {
      result.sort((a, b) => {
        const tierA = getNpMatchTier(a, qNp);
        const tierB = getNpMatchTier(b, qNp);
        if (tierA !== tierB) return tierA - tierB;
        return compareByName(a, b);
      });
    } else {
      result.sort(compareByName);
    }
  }

  return result;
}

/**
 * Computes facet counts for categories, subcategories, and brands,
 * each with all other active filters applied.
 * @param {Array<Object>} products
 * @param {Object} filters
 */
export function facetCounts(products = [], filters = {}) {
  const { q = "", cat = "", sub = "", brands, brand } = filters;
  const activeBrands = normalizeBrandsFilter(brands, brand);

  const categories = {};
  const subcategories = {};
  const subcategoriesByCategory = {};
  const brandCounts = {};

  for (const p of products) {
    if (p.category) {
      if (!(p.category in categories)) categories[p.category] = 0;
      if (!subcategoriesByCategory[p.category]) {
        subcategoriesByCategory[p.category] = {};
      }
      if (p.subcategory) {
        if (!(p.subcategory in subcategories)) subcategories[p.subcategory] = 0;
        if (!(p.subcategory in subcategoriesByCategory[p.category])) {
          subcategoriesByCategory[p.category][p.subcategory] = 0;
        }
      }
    }
    if (p.brand !== null && p.brand !== undefined && p.brand !== "") {
      if (!(p.brand in brandCounts)) brandCounts[p.brand] = 0;
    }
  }

  // 1. Category counts: apply q + brands (ignore cat and sub)
  const forCategories = applyFilters(products, {
    q,
    brands: activeBrands,
  });
  for (const p of forCategories) {
    if (p.category) {
      categories[p.category] = (categories[p.category] || 0) + 1;
    }
  }

  // 2. Subcategory counts: apply q + cat + brands (ignore sub)
  for (const p of forCategories) {
    if (p.category && p.subcategory) {
      subcategoriesByCategory[p.category][p.subcategory] =
        (subcategoriesByCategory[p.category][p.subcategory] || 0) + 1;
    }
  }

  const forSubcategories = cat
    ? forCategories.filter((p) => p.category === cat)
    : forCategories;
  for (const p of forSubcategories) {
    if (p.subcategory) {
      subcategories[p.subcategory] = (subcategories[p.subcategory] || 0) + 1;
    }
  }

  // 3. Brand counts: apply q + cat + sub (ignore brands; exclude brand: null)
  const forBrands = applyFilters(products, {
    q,
    cat,
    sub,
  });
  for (const p of forBrands) {
    if (p.brand !== null && p.brand !== undefined && p.brand !== "") {
      brandCounts[p.brand] = (brandCounts[p.brand] || 0) + 1;
    }
  }

  return {
    categories,
    subcategories,
    subcategoriesByCategory,
    brands: brandCounts,
  };
}
