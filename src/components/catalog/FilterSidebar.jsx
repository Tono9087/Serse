import { useEffect, useId, useMemo, useState } from "react";
import { ChevronDown, ChevronRight, RotateCcw, Search, X } from "lucide-react";
import { normalizeText } from "../../lib/normalize.js";
import { useI18n } from "../../i18n/I18nContext.jsx";
import { Button } from "../ui/Button.jsx";

export function FilterSidebar({
  allCategories,
  allBrands,
  facets,
  q,
  cat,
  sub,
  brands = [],
  onChangeQ,
  onSelectCategory,
  onSelectSubcategory,
  onToggleBrand,
  onClearAll,
}) {
  const { t } = useI18n();
  const baseId = useId();

  const [expandedCats, setExpandedCats] = useState(() => {
    const set = new Set();
    if (cat) set.add(cat);
    return set;
  });

  const [brandQuery, setBrandQuery] = useState("");

  useEffect(() => {
    if (cat) {
      setExpandedCats((prev) => {
        if (prev.has(cat)) return prev;
        const next = new Set(prev);
        next.add(cat);
        return next;
      });
    }
  }, [cat]);

  function toggleCategoryExpand(categoryName) {
    setExpandedCats((prev) => {
      const next = new Set(prev);
      if (next.has(categoryName)) {
        next.delete(categoryName);
      } else {
        next.add(categoryName);
      }
      return next;
    });
  }

  const hasAnyFilter = Boolean(q || cat || sub || brands.length > 0);
  const selectedBrandSet = useMemo(() => new Set(brands), [brands]);

  const filteredBrands = useMemo(() => {
    const qNorm = normalizeText(brandQuery);
    if (!qNorm) return allBrands;
    return allBrands.filter((b) => normalizeText(b).includes(qNorm));
  }, [allBrands, brandQuery]);

  return (
    <aside aria-label={t("filtersButton")} className="space-y-6">
      {/* 1. Text filter bound to q */}
      <div>
        <label
          htmlFor={`${baseId}-q`}
          className="block text-xs font-semibold uppercase tracking-wider text-brand-900"
        >
          {t("filterInResults")}
        </label>
        <div className="relative mt-2">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
            aria-hidden="true"
          />
          <input
            id={`${baseId}-q`}
            type="text"
            value={q}
            onChange={(e) => onChangeQ(e.target.value)}
            placeholder={t("filterInResultsPlaceholder")}
            className="w-full rounded-lg border border-line bg-white py-2 pl-9 pr-8 text-sm text-ink placeholder:text-muted focus:border-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-700"
          />
          {q && (
            <button
              type="button"
              onClick={() => onChangeQ("")}
              aria-label={t("clearSearch")}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-muted hover:bg-lavender hover:text-brand-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-700"
            >
              <X className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          )}
        </div>
      </div>

      {/* 2. Category accordion with subcategories and counts */}
      <div className="border-t border-line pt-5">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-brand-900">
            {t("categoriesFilterTitle")}
          </h3>
          {cat && (
            <button
              type="button"
              onClick={() => onSelectCategory("")}
              className="text-xs font-medium text-brand-700 hover:underline focus:outline-none"
            >
              {t("allCategories")}
            </button>
          )}
        </div>

        <ul className="mt-2.5 space-y-1">
          {allCategories.map((categoryItem) => {
            const categoryName = categoryItem.name;
            const catCount = facets.categories[categoryName] ?? 0;
            const isSelectedCat = cat === categoryName;
            const isExpanded = expandedCats.has(categoryName);
            const subMap = facets.subcategoriesByCategory?.[categoryName] || {};

            return (
              <li key={categoryName} className="rounded-lg">
                <div
                  className={`flex items-center justify-between rounded-lg transition duration-150 ${
                    isSelectedCat && !sub
                      ? "bg-brand-700 text-white font-semibold"
                      : isSelectedCat
                      ? "bg-lavender text-brand-900 font-semibold"
                      : "text-ink hover:bg-lavender"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => {
                      if (isSelectedCat && !sub) {
                        onSelectCategory("");
                      } else {
                        onSelectCategory(categoryName);
                        setExpandedCats((prev) => new Set(prev).add(categoryName));
                      }
                    }}
                    className="flex flex-1 items-center justify-between px-2.5 py-2 text-left text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-700 rounded-l-lg"
                  >
                    <span className="truncate pr-2">{categoryName}</span>
                    <span
                      className={`rounded px-1.5 py-0.5 text-xs font-mono ${
                        isSelectedCat && !sub
                          ? "bg-white/20 text-white"
                          : "bg-lavender text-muted"
                      }`}
                    >
                      {catCount}
                    </span>
                  </button>

                  {categoryItem.subcategories.length > 0 && (
                    <button
                      type="button"
                      onClick={() => toggleCategoryExpand(categoryName)}
                      aria-expanded={isExpanded}
                      aria-label={
                        isExpanded
                          ? t("collapseCategoryAria", { category: categoryName })
                          : t("expandCategoryAria", { category: categoryName })
                      }
                      className={`p-2 rounded-r-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-700 ${
                        isSelectedCat && !sub
                          ? "text-white hover:bg-white/10"
                          : "text-muted hover:text-brand-900"
                      }`}
                    >
                      {isExpanded ? (
                        <ChevronDown className="h-4 w-4" aria-hidden="true" />
                      ) : (
                        <ChevronRight className="h-4 w-4" aria-hidden="true" />
                      )}
                    </button>
                  )}
                </div>

                {isExpanded && categoryItem.subcategories.length > 0 && (
                  <ul className="mt-1 ml-3 space-y-0.5 border-l border-line pl-2.5">
                    {categoryItem.subcategories.map((subName) => {
                      const subCount = subMap[subName] ?? 0;
                      const isSelectedSub =
                        isSelectedCat && sub === subName;
                      return (
                        <li key={subName}>
                          <button
                            type="button"
                            onClick={() => {
                              if (isSelectedSub) {
                                onSelectSubcategory(categoryName, "");
                              } else {
                                onSelectSubcategory(categoryName, subName);
                              }
                            }}
                            className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-left text-xs transition duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-700 ${
                              isSelectedSub
                                ? "bg-brand-700 text-white font-semibold"
                                : "text-ink hover:bg-lavender"
                            }`}
                          >
                            <span className="truncate pr-2">{subName}</span>
                            <span
                              className={`font-mono ${
                                isSelectedSub ? "text-white" : "text-muted"
                              }`}
                            >
                              {subCount}
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </div>

      {/* 3. Brand checkboxes with counts and search when > 10 brands */}
      <div className="border-t border-line pt-5">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-brand-900">
          {t("brandsFilterTitle")}
        </h3>

        {allBrands.length > 10 && (
          <div className="relative mt-2">
            <Search
              className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted"
              aria-hidden="true"
            />
            <input
              type="text"
              value={brandQuery}
              onChange={(e) => setBrandQuery(e.target.value)}
              placeholder={t("brandSearchPlaceholder")}
              aria-label={t("brandSearchPlaceholder")}
              className="w-full rounded-lg border border-line bg-white py-1.5 pl-8 pr-7 text-xs text-ink placeholder:text-muted focus:border-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-700"
            />
            {brandQuery && (
              <button
                type="button"
                onClick={() => setBrandQuery("")}
                aria-label={t("clearSearch")}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded p-0.5 text-muted hover:text-brand-900"
              >
                <X className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            )}
          </div>
        )}

        <div className="mt-2.5 max-h-72 overflow-y-auto pr-1">
          {filteredBrands.length > 0 ? (
            <ul className="space-y-1">
              {filteredBrands.map((brandName) => {
                const count = facets.brands[brandName] ?? 0;
                const checked = selectedBrandSet.has(brandName);
                return (
                  <li key={brandName}>
                    <label
                      className={`flex cursor-pointer items-center justify-between rounded-lg px-2 py-1.5 text-sm transition duration-150 ${
                        checked
                          ? "bg-lavender font-semibold text-brand-900"
                          : "text-ink hover:bg-lavender"
                      }`}
                    >
                      <span className="flex items-center gap-2.5 min-w-0 pr-2">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => onToggleBrand(brandName)}
                          className="h-4 w-4 rounded border-line text-brand-700 focus:ring-brand-700"
                        />
                        <span className="truncate">{brandName}</span>
                      </span>
                      <span className="text-xs font-mono text-muted">
                        {count}
                      </span>
                    </label>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="py-3 text-xs text-muted">{t("noBrandsFound")}</p>
          )}
        </div>
      </div>

      {/* 4. Clear filters button (visible only when any filter is active) */}
      {hasAnyFilter && (
        <div className="border-t border-line pt-4">
          <Button
            variant="secondary"
            size="sm"
            onClick={onClearAll}
            className="w-full"
          >
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            {t("clearFilters")}
          </Button>
        </div>
      )}
    </aside>
  );
}
