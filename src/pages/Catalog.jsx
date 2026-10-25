import { useMemo, useRef, useState } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import { ArrowRight, MessageSquare, PackageSearch, RotateCcw } from "lucide-react";
import catalog from "../data/catalog.json";
import { SITE } from "../config/site.js";
import { applyFilters, facetCounts } from "../lib/filters.js";
import { paginate } from "../lib/pagination.js";
import { buildGenericGreetingUrl } from "../lib/whatsapp.js";
import { usePageMeta } from "../hooks/usePageMeta.js";
import { useI18n } from "../i18n/I18nContext.jsx";
import { FilterSidebar } from "../components/catalog/FilterSidebar.jsx";
import { ResultsBar } from "../components/catalog/ResultsBar.jsx";
import { ProductGrid } from "../components/catalog/ProductGrid.jsx";
import { ProductTable } from "../components/catalog/ProductTable.jsx";
import { Pagination } from "../components/catalog/Pagination.jsx";
import { Breadcrumbs } from "../components/ui/Breadcrumbs.jsx";
import { Drawer } from "../components/ui/Drawer.jsx";
import { Button } from "../components/ui/Button.jsx";
import { Container } from "../components/layout/Container.jsx";
import { BrandCard } from "../components/brands/BrandCard.jsx";

const VALID_SIZES = new Set([12, 24, 48]);
const VALID_SORTS = new Set(["relevance", "name", "brand", "np"]);
const VALID_VIEWS = new Set(["grid", "table"]);

export function Catalog() {
  const { t } = useI18n();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const resultsTopRef = useRef(null);

  // Derive full category tree and brand list from catalog data at runtime
  const { allCategories, validCategorySet, validSubcategorySet, allBrands, validBrandSet } =
    useMemo(() => {
      const catMap = new Map();
      const subSet = new Set();
      const brandSet = new Set();

      for (const item of catalog) {
        if (item.category) {
          if (!catMap.has(item.category)) {
            catMap.set(item.category, new Set());
          }
          if (item.subcategory) {
            catMap.get(item.category).add(item.subcategory);
            subSet.add(item.subcategory);
          }
        }
        if (item.brand) {
          brandSet.add(item.brand);
        }
      }

      const categoriesArr = Array.from(catMap.entries())
        .map(([name, subs]) => ({
          name,
          subcategories: Array.from(subs).sort((a, b) =>
            a.localeCompare(b, "es")
          ),
        }))
        .sort((a, b) => a.name.localeCompare(b.name, "es"));

      const brandsArr = Array.from(brandSet).sort((a, b) =>
        a.localeCompare(b, "es")
      );

      return {
        allCategories: categoriesArr,
        validCategorySet: new Set(catMap.keys()),
        validSubcategorySet: subSet,
        allBrands: brandsArr,
        validBrandSet: brandSet,
      };
    }, []);

  // Top 12 brands for the landing strip
  const top12Brands = useMemo(() => {
    const counts = new Map();
    for (const item of catalog) {
      if (!item.brand) continue;
      counts.set(item.brand, (counts.get(item.brand) || 0) + 1);
    }
    return Array.from(counts.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => {
        if (b.count !== a.count) return b.count - a.count;
        return a.name.localeCompare(b.name, "es");
      })
      .slice(0, 12);
  }, []);

  // Parse and validate URL search params
  const q = searchParams.get("q") || "";
  const rawCat = searchParams.get("cat") || "";
  const cat = validCategorySet.has(rawCat) ? rawCat : "";

  const rawSub = searchParams.get("sub") || "";
  const sub = validSubcategorySet.has(rawSub) ? rawSub : "";

  const brands = useMemo(() => {
    const rawList = searchParams.getAll("brand");
    const parsed = [];
    const seen = new Set();
    for (const entry of rawList) {
      for (const part of entry.split(",")) {
        const trimmed = part.trim();
        if (trimmed && validBrandSet.has(trimmed) && !seen.has(trimmed)) {
          seen.add(trimmed);
          parsed.push(trimmed);
        }
      }
    }
    return parsed;
  }, [searchParams, validBrandSet]);

  const rawSize = Number.parseInt(searchParams.get("size") || "24", 10);
  const size = VALID_SIZES.has(rawSize) ? rawSize : 24;

  const rawSort = searchParams.get("sort");
  const defaultSort = q ? "relevance" : "name";
  let sort = rawSort && VALID_SORTS.has(rawSort) ? rawSort : defaultSort;
  if (!q && sort === "relevance") {
    sort = "name";
  }

  const rawView = searchParams.get("view") || "grid";
  const view = VALID_VIEWS.has(rawView) ? rawView : "grid";

  const rawPage = Number.parseInt(searchParams.get("page") || "1", 10);
  const pageParam = Number.isFinite(rawPage) && rawPage >= 1 ? rawPage : 1;

  // Breadcrumbs items for Catalog
  const breadcrumbItems = useMemo(() => {
    const items = [
      { label: t("navHome"), to: "/" },
      { label: t("navCatalog"), to: cat ? "/catalogo" : undefined },
    ];
    if (cat) {
      items.push({
        label: cat,
        to: sub ? `/catalogo?cat=${encodeURIComponent(cat)}` : undefined,
      });
    }
    if (sub) {
      items.push({ label: sub });
    }
    return items;
  }, [t, cat, sub]);

  // Dynamic page title per Section 10
  const pageTitle = useMemo(() => {
    const base = t("metaCatalogTitle");
    if (cat && brands.length === 0) {
      return `${base} — ${cat}`;
    }
    if (brands.length === 1 && !cat) {
      return `${base} — ${brands[0]}`;
    }
    return base;
  }, [t, cat, brands]);

  usePageMeta({
    title: pageTitle,
    description: t("metaCatalogDesc"),
  });

  // Compute filtered list & facets with useMemo
  const filteredProducts = useMemo(() => {
    return applyFilters(catalog, { q, cat, sub, brands, sort });
  }, [q, cat, sub, brands, sort]);

  const facets = useMemo(() => {
    return facetCounts(catalog, { q, cat, sub, brands });
  }, [q, cat, sub, brands]);

  const pagination = useMemo(() => {
    return paginate(filteredProducts, pageParam, size);
  }, [filteredProducts, pageParam, size]);

  const showBrandStrip = !q && !cat && !sub && brands.length === 0;

  // Helper to update URL params cleanly
  function updateParams(updates, { resetPage = true } = {}) {
    const next = new URLSearchParams(searchParams);

    for (const [key, value] of Object.entries(updates)) {
      next.delete(key);
      if (Array.isArray(value)) {
        for (const item of value) {
          if (item) next.append(key, item);
        }
      } else if (value !== undefined && value !== null && value !== "") {
        next.set(key, String(value));
      }
    }

    if (resetPage) {
      next.delete("page");
    }

    if (next.get("page") === "1") next.delete("page");
    if (next.get("size") === "24") next.delete("size");
    if (next.get("view") === "grid") next.delete("view");

    const currentQ = next.get("q")?.trim();
    const currentDefaultSort = currentQ ? "relevance" : "name";
    if (next.get("sort") === currentDefaultSort) {
      next.delete("sort");
    }
    if (!currentQ && next.get("sort") === "relevance") {
      next.delete("sort");
    }

    setSearchParams(next);
  }

  function handleChangeQ(nextQ) {
    updateParams({ q: nextQ }, { resetPage: true });
  }

  function handleSelectCategory(nextCat) {
    updateParams({ cat: nextCat, sub: "" }, { resetPage: true });
  }

  function handleSelectSubcategory(parentCat, nextSub) {
    updateParams({ cat: parentCat, sub: nextSub }, { resetPage: true });
  }

  function handleToggleBrand(brandName) {
    const exists = brands.includes(brandName);
    const nextBrands = exists
      ? brands.filter((b) => b !== brandName)
      : [...brands, brandName];
    updateParams({ brand: nextBrands }, { resetPage: true });
  }

  function handleClearAll() {
    const next = new URLSearchParams();
    if (size !== 24) next.set("size", String(size));
    if (sort !== "name" && sort !== "relevance") next.set("sort", sort);
    if (view !== "grid") next.set("view", view);
    setSearchParams(next);
  }

  function handlePageChange(nextPage) {
    updateParams({ page: nextPage }, { resetPage: false });
    if (resultsTopRef.current) {
      resultsTopRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  function handleViewChange(nextView) {
    updateParams({ view: nextView }, { resetPage: false });
  }

  const currentFromUrl = `${location.pathname}${location.search}`;
  const waHref = buildGenericGreetingUrl(SITE.whatsappNumber);

  return (
    <Container className="py-8">
      <div ref={resultsTopRef} className="mb-6">
        <Breadcrumbs items={breadcrumbItems} />
        <h1 className="text-3xl font-bold text-brand-900 md:text-4xl">
          {t("catalogTitle")}
        </h1>
        <p className="mt-1.5 text-sm text-muted">{t("catalogIntro")}</p>
      </div>

      <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
        {/* Desktop Sidebar (w-72 on lg, w-80 on 2xl) */}
        <div className="hidden w-72 2xl:w-80 flex-shrink-0 rounded-xl border border-line bg-white p-5 lg:block shadow-sm">
          <FilterSidebar
            allCategories={allCategories}
            allBrands={allBrands}
            facets={facets}
            q={q}
            cat={cat}
            sub={sub}
            brands={brands}
            onChangeQ={handleChangeQ}
            onSelectCategory={handleSelectCategory}
            onSelectSubcategory={handleSelectSubcategory}
            onToggleBrand={handleToggleBrand}
            onClearAll={handleClearAll}
          />
        </div>

        {/* Mobile Filter Drawer */}
        <Drawer
          isOpen={mobileFiltersOpen}
          onClose={() => setMobileFiltersOpen(false)}
          title={t("filtersButton")}
          position="left"
        >
          <div className="p-4 sm:p-6">
            <FilterSidebar
              allCategories={allCategories}
              allBrands={allBrands}
              facets={facets}
              q={q}
              cat={cat}
              sub={sub}
              brands={brands}
              onChangeQ={handleChangeQ}
              onSelectCategory={handleSelectCategory}
              onSelectSubcategory={handleSelectSubcategory}
              onToggleBrand={handleToggleBrand}
              onClearAll={handleClearAll}
            />
          </div>
        </Drawer>

        {/* Main Results Column */}
        <div className="min-w-0 flex-1">
          {showBrandStrip && (
            <div className="mb-8">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-bold text-brand-900">
                  {t("navBrands")}
                </h2>
                <Link
                  to="/marcas"
                  className="inline-flex items-center gap-1 rounded text-sm font-semibold text-brand-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-700"
                >
                  <span>{t("viewAll")}</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>

              <div className="flex gap-3 overflow-x-auto pb-2 snap-x md:grid md:grid-cols-4 md:gap-4 md:overflow-visible md:pb-0 xl:grid-cols-6">
                {top12Brands.map((brand) => (
                  <BrandCard
                    key={brand.name}
                    brand={brand.name}
                    count={brand.count}
                    className="w-40 shrink-0 snap-start md:w-auto md:shrink"
                  />
                ))}
              </div>
            </div>
          )}

          <ResultsBar
            totalCount={filteredProducts.length}
            q={q}
            cat={cat}
            sub={sub}
            brands={brands}
            size={size}
            sort={sort}
            view={view}
            onViewChange={handleViewChange}
            onSizeChange={(nextSize) =>
              updateParams({ size: nextSize }, { resetPage: true })
            }
            onSortChange={(nextSort) =>
              updateParams({ sort: nextSort }, { resetPage: true })
            }
            onRemoveQ={() => handleChangeQ("")}
            onRemoveCat={() => handleSelectCategory("")}
            onRemoveSub={() => handleSelectSubcategory(cat, "")}
            onRemoveBrand={(b) => handleToggleBrand(b)}
            onClearAll={handleClearAll}
            onOpenMobileFilters={() => setMobileFiltersOpen(true)}
          />

          {pagination.items.length > 0 ? (
            <>
              {view === "table" ? (
                <ProductTable
                  products={pagination.items}
                  from={currentFromUrl}
                  sort={sort}
                  onSortChange={(nextSort) =>
                    updateParams({ sort: nextSort }, { resetPage: true })
                  }
                />
              ) : (
                <ProductGrid
                  products={pagination.items}
                  from={currentFromUrl}
                />
              )}

              <Pagination
                page={pagination.currentPage}
                totalPages={pagination.totalPages}
                onPageChange={handlePageChange}
              />
            </>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-xl border border-line bg-lavender px-6 py-16 text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white text-brand-700 border border-line">
                <PackageSearch className="h-7 w-7" aria-hidden="true" />
              </div>
              <h2 className="text-xl font-semibold text-brand-900">
                {t("emptyCatalogTitle")}
              </h2>
              <p className="mt-1.5 max-w-md text-sm text-muted">
                {t("emptyCatalogSub")}
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <Button variant="secondary" onClick={handleClearAll}>
                  <RotateCcw className="h-4 w-4" aria-hidden="true" />
                  {t("clearFilters")}
                </Button>
                {SITE.whatsappNumber && (
                  <a
                    href={waHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-lg bg-brand-700 px-4 py-2.5 text-sm font-semibold text-white transition duration-150 hover:bg-brand-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-700"
                  >
                    <MessageSquare className="h-4 w-4" aria-hidden="true" />
                    <span>{t("quoteViaWhatsApp")}</span>
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </Container>
  );
}
