import { useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import catalog from "../data/catalog.json";
import { usePageMeta } from "../hooks/usePageMeta.js";
import { useI18n } from "../i18n/I18nContext.jsx";
import { Container } from "../components/layout/Container.jsx";
import { BrandCard } from "../components/brands/BrandCard.jsx";

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
    <div>
      {/* Header band */}
      <section className="bg-gradient-to-b from-brand-800 to-brand-700 py-12 text-center text-white sm:py-16">
        <Container>
          <h1 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
            {t("brandsPageTitle")}
          </h1>
          <p className="mt-2 text-base text-white/90 sm:text-lg">
            {t("brandsSubtitle")}
          </p>
        </Container>
      </section>

      {/* Brands Grid Section */}
      <section className="bg-lavender py-10 sm:py-14">
        <Container>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 2xl:grid-cols-5">
            {brands.map((brand) => (
              <BrandCard
                key={brand.name}
                brand={brand.name}
                count={brand.count}
              />
            ))}
          </div>

          {unspecifiedCount > 0 && (
            <div className="mt-8 rounded-xl border border-line bg-white p-4 text-sm text-brand-900 shadow-xs">
              <Link
                to="/catalogo"
                className="inline-flex items-center gap-2 rounded font-medium text-brand-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-700"
              >
                <span>
                  {t("unspecifiedBrandNotice", { n: unspecifiedCount })}
                </span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          )}
        </Container>
      </section>
    </div>
  );
}
