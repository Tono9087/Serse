/**
 * Paginates an array of items.
 * @param {Array} items
 * @param {number} page - 1-based page index
 * @param {number} size - items per page
 */
export function paginate(items = [], page = 1, size = 24) {
  const safeItems = Array.isArray(items) ? items : [];
  const safeSize = Math.max(1, Number.parseInt(size, 10) || 24);
  const totalItems = safeItems.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / safeSize));
  const rawPage = Number.parseInt(page, 10) || 1;
  const currentPage = Math.min(Math.max(1, rawPage), totalPages);

  const start = (currentPage - 1) * safeSize;
  const pagedItems = safeItems.slice(start, start + safeSize);

  return {
    items: pagedItems,
    page: currentPage,
    currentPage,
    size: safeSize,
    total: totalItems,
    totalItems,
    totalPages,
  };
}

/**
 * Returns an array of page numbers and "…" ellipsis markers.
 * Shows all pages when totalPages <= 7.
 * @param {number} page
 * @param {number} totalPages
 * @returns {Array<number | string>}
 */
export function getPageRange(page = 1, totalPages = 1) {
  const total = Math.max(1, Number.parseInt(totalPages, 10) || 1);
  const current = Math.min(Math.max(1, Number.parseInt(page, 10) || 1), total);

  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  if (current <= 4) {
    return [1, 2, 3, 4, 5, "…", total];
  }

  if (current >= total - 3) {
    return [1, "…", total - 4, total - 3, total - 2, total - 1, total];
  }

  return [1, "…", current - 1, current, current + 1, "…", total];
}
