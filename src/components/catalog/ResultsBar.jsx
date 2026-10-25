import { SlidersHorizontal } from "lucide-react";
import { useI18n } from "../../i18n/I18nContext.jsx";
import { Button } from "../ui/Button.jsx";
import { ActiveFilters } from "./ActiveFilters.jsx";

export function ResultsBar({
  totalCount,
  q,
  cat,
  sub,
  brands,
  size,
  sort,
  onSizeChange,
  onSortChange,
  onRemoveQ,
  onRemoveCat,
  onRemoveSub,
  onRemoveBrand,
  onClearAll,
  onOpenMobileFilters,
}) {
  const { t } = useI18n();

  const activeFilterCount =
    (q ? 1 : 0) + (cat ? 1 : 0) + (sub ? 1 : 0) + (brands?.length || 0);

  return (
    <div className="mb-6 rounded-lg border border-line bg-white p-3.5 sm:px-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            size="sm"
            onClick={onOpenMobileFilters}
            className="lg:hidden"
          >
            <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
            <span>{t("filtersButton")}</span>
            {activeFilterCount > 0 && (
              <span className="rounded-full bg-brand-700 px-1.5 py-0.5 text-xs font-bold text-white font-mono">
                {activeFilterCount}
              </span>
            )}
          </Button>

          <p
            aria-live="polite"
            aria-atomic="true"
            className="text-sm font-semibold text-brand-900"
          >
            {totalCount === 1
              ? t("resultsCountOne")
              : t("resultsCount", { n: totalCount })}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Page size select */}
          <div className="flex items-center gap-2 text-xs text-muted">
            <label htmlFor="catalog-page-size" className="font-medium">
              {t("pageSizeLabel")}:
            </label>
            <select
              id="catalog-page-size"
              value={size}
              onChange={(e) => onSizeChange(Number(e.target.value))}
              className="min-h-[38px] rounded-lg border border-line bg-white px-2.5 py-1.5 text-xs font-medium text-brand-900 focus:border-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-700"
            >
              <option value={12}>12 {t("perPageSuffix")}</option>
              <option value={24}>24 {t("perPageSuffix")}</option>
              <option value={48}>48 {t("perPageSuffix")}</option>
            </select>
          </div>

          {/* Sort select */}
          <div className="flex items-center gap-2 text-xs text-muted">
            <label htmlFor="catalog-sort" className="font-medium">
              {t("sortByLabel")}:
            </label>
            <select
              id="catalog-sort"
              value={sort}
              onChange={(e) => onSortChange(e.target.value)}
              className="min-h-[38px] rounded-lg border border-line bg-white px-2.5 py-1.5 text-xs font-medium text-brand-900 focus:border-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-700"
            >
              <option value="name">{t("sortByName")}</option>
              <option value="brand">{t("sortByBrand")}</option>
            </select>
          </div>
        </div>
      </div>

      <ActiveFilters
        q={q}
        cat={cat}
        sub={sub}
        brands={brands}
        onRemoveQ={onRemoveQ}
        onRemoveCat={onRemoveCat}
        onRemoveSub={onRemoveSub}
        onRemoveBrand={onRemoveBrand}
        onClearAll={onClearAll}
      />
    </div>
  );
}
