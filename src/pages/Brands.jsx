import { useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Tag } from "lucide-react";
import catalog from "../data/catalog.json";
import { usePageMeta } from "../hooks/usePageMeta.js";
import { useI18n } from "../i18n/I18nContext.jsx";
import { Container } from "../components/layout/Container.jsx";

export function Brands() {
  const { t } = useI18n();

  usePageMeta({
    title: t("metaBrandsTitle"),
    description: t("metaBrandsDesc"),
  });

  const { brands, unspecifiedCount } = useMemo(() => {
    const counts = new Map();
    let nullCount = 0;

    for (const item of catalog) {
      if (item.brand) {
        counts.set(item.brand, (counts.get(item.brand) || 0) + 1);
      } else {
        nullCount += 1;
      }
    }

    const sortedBrands = Array.from(counts.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => {
        if (b.count !== a.count) return b.count - a.count;
        return a.name.localeCompare(b.name, "es");
      });

    return { brands: sortedBrands, unspecifiedCount: nullCount };
  }, []);

  return (
    <Container className="py-10">
      <div className="max-w-3xl">
        <h1 className="text-3xl font-bold text-brand-900 md:text-4xl">
          {t("brandsPageTitle")}
        </h1>
        <p className="mt-2 text-base text-muted">{t("brandsPageIntro")}</p>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5">
        {brands.map((brand) => (
          <Link
            key={brand.name}
            to={`/catalogo?brand=${encodeURIComponent(brand.name)}`}
            className="group flex flex-col justify-between rounded-xl border border-line bg-white p-5 transition duration-150 hover:border-brand-700 hover:bg-lavender hover:shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-700"
          >
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-lavender text-brand-900 group-hover:bg-brand-900 group-hover:text-white transition duration-150">
                  <Tag className="h-4 w-4" aria-hidden="true" />
                </span>
                <span className="rounded bg-lavender px-2 py-0.5 text-xs font-semibold font-mono text-muted">
                  {brand.count === 1
                    ? t("categoryProductCountOne")
                    : t("categoryProductCount", { count: brand.count })}
                </span>
              </div>
              <h2 className="mt-4 text-lg font-semibold text-brand-900 group-hover:text-brand-700">
                {brand.name}
              </h2>
            </div>

            <div className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-brand-700">
              <span>{t("viewBrandProducts")}</span>
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </div>
          </Link>
        ))}
      </div>

      {unspecifiedCount > 0 && (
        <div className="mt-8 rounded-xl border border-line bg-lavender p-4 text-sm text-brand-900">
          <Link
            to="/catalogo"
            className="inline-flex items-center gap-2 font-medium text-brand-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-700 rounded"
          >
            <span>
              {t("unspecifiedBrandNotice", { n: unspecifiedCount })}
            </span>
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      )}
    </Container>
  );
}
