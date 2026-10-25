import { useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, MessageSquare } from "lucide-react";
import catalog from "../data/catalog.json";
import { BRANDS } from "../config/brands.js";
import { SITE } from "../config/site.js";
import { getBrandProductCount } from "../lib/brands.js";
import { buildGenericGreetingUrl } from "../lib/whatsapp.js";
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

  // Filter out disabled brands and compute product counts from catalog
  const brandList = useMemo(() => {
    return BRANDS.filter((b) => b.enabled !== false).map((brand) => ({
      brand,
      count: getBrandProductCount(brand, catalog),
    }));
  }, []);

  const waHref = buildGenericGreetingUrl(SITE.whatsappNumber);

  return (
    <div className="bg-white py-16 md:py-24">
      <Container>
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-brand-900 md:text-4xl">
            {t("brandsPageHeading")}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-muted sm:text-lg leading-relaxed">
            {t("brandsPageSub")}
          </p>
        </div>

        {/* Logo Grid: 2 cols (<sm), 3 (sm), 4 (lg), 5 (xl and up) */}
        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4 xl:grid-cols-5">
          {brandList.map(({ brand, count }) => (
            <BrandCard key={brand.slug} brand={brand} count={count} />
          ))}
        </div>

        {/* Section Footer */}
        <div className="mt-16 text-center sm:mt-20">
          <p className="text-lg font-semibold text-brand-900">
            {t("lookingForAnotherBrand")}
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/catalogo"
              className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-lg border border-line bg-white px-5 py-2.5 text-sm font-semibold text-brand-900 transition duration-150 hover:bg-lavender hover:border-brand-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-700"
            >
              <span>{t("viewTheCatalog")}</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>

            {SITE.whatsappNumber && (
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full bg-brand-700 px-6 py-2.5 text-sm font-semibold text-white transition duration-150 hover:bg-brand-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-700"
              >
                <MessageSquare className="h-4 w-4" aria-hidden="true" />
                <span>{t("quoteViaWhatsApp")}</span>
              </a>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
}
