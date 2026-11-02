import { useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, MessageSquare } from "lucide-react";
import catalog from "../data/catalog.json";
import { BRANDS } from "../config/brands.js";
import { WHATSAPP_NUMBER } from "../config/site.js";
import { buildBrandDirectory } from "../lib/brands.js";
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

  const { inStock, onDemand } = useMemo(
    () => buildBrandDirectory(BRANDS, catalog),
    []
  );

  const waHref = buildGenericGreetingUrl(WHATSAPP_NUMBER);

  return (
    <div className="bg-white py-16 md:py-24">
      <Container>
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-semibold tracking-tight text-brand-900 md:text-4xl">
            {t("brandsPageHeading")}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-muted sm:text-lg leading-relaxed">
            {t("brandsPageSub")}
          </p>
        </div>

        {/* 1. Brands with active products in catalog */}
        <section aria-labelledby="brands-in-catalog" className="mt-12">
          <div className="flex flex-col justify-between gap-2 border-b border-line pb-4 sm:flex-row sm:items-end">
            <div>
              <h2
                id="brands-in-catalog"
                className="text-xl font-semibold text-brand-900 sm:text-2xl"
              >
                {t("brandsInCatalogHeading")}
              </h2>
              <p className="mt-1 text-sm text-muted">
                {t("brandsInCatalogSub")}
              </p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4 xl:grid-cols-5">
            {inStock.map(({ brand, count }) => (
              <BrandCard key={brand.slug} brand={brand} count={count} />
            ))}
          </div>
        </section>

        {/* 2. Allied brands available on order / direct quote */}
        {onDemand.length > 0 && (
          <section aria-labelledby="brands-on-demand" className="mt-16">
            <div className="flex flex-col justify-between gap-2 border-b border-line pb-4 sm:flex-row sm:items-end">
              <div>
                <h2
                  id="brands-on-demand"
                  className="text-xl font-semibold text-brand-900 sm:text-2xl"
                >
                  {t("brandsOnDemandHeading")}
                </h2>
                <p className="mt-1 text-sm text-muted">
                  {t("brandsOnDemandSub")}
                </p>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4 xl:grid-cols-5">
              {onDemand.map(({ brand, count }) => (
                <BrandCard key={brand.slug} brand={brand} count={count} />
              ))}
            </div>
          </section>
        )}

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

            {WHATSAPP_NUMBER && (
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
