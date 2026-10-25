import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ClipboardList,
  Cog,
  Cpu,
  Gauge,
  Mail,
  MapPin,
  MessageSquare,
  Package,
  PackageCheck,
  Phone,
  Search,
  ShieldAlert,
  Tag,
  Wind,
  Wrench,
} from "lucide-react";
import catalog from "../data/catalog.json";
import { SITE } from "../config/site.js";
import { buildGenericGreetingUrl } from "../lib/whatsapp.js";
import { usePageMeta } from "../hooks/usePageMeta.js";
import { useI18n } from "../i18n/I18nContext.jsx";
import { SearchBox } from "../components/search/SearchBox.jsx";

const CATEGORY_ICON_MAP = {
  Herramienta: Wrench,
  Neumática: Wind,
  "Mantenimiento y consumibles": PackageCheck,
  "Eléctrico y electrónica": Cpu,
  "Etiquetado e identificación": Tag,
  Medición: Gauge,
  "Mecánica y lubricación": Cog,
  "Seguridad industrial": ShieldAlert,
};

function ClientsSection() {
  const { t } = useI18n();
  const [loadedMap, setLoadedMap] = useState({});

  if (!SITE.clients || SITE.clients.length === 0) return null;

  const anyLoaded = Object.values(loadedMap).some(Boolean);

  return (
    <>
      {/* Invisible test images to detect if local files exist */}
      <div className="sr-only" aria-hidden="true">
        {SITE.clients.map((client) => (
          <img
            key={`preload-${client.name}`}
            src={client.logo}
            alt=""
            onLoad={() =>
              setLoadedMap((prev) => ({ ...prev, [client.name]: true }))
            }
            onError={() =>
              setLoadedMap((prev) => ({ ...prev, [client.name]: false }))
            }
          />
        ))}
      </div>

      {anyLoaded && (
        <section className="border-t border-line bg-white py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-center text-xs font-semibold uppercase tracking-wider text-muted">
              {t("clientsHeading")}
            </h2>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-6 sm:gap-10">
              {SITE.clients.map((client) => {
                if (!loadedMap[client.name]) return null;
                return (
                  <div
                    key={client.name}
                    className="flex h-16 items-center justify-center rounded-xl border border-line bg-lavender/40 px-6 py-2 shadow-xs"
                  >
                    <img
                      src={client.logo}
                      alt={client.name}
                      className="max-h-10 w-auto object-contain"
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </>
  );
}

export function Home() {
  const { t } = useI18n();

  usePageMeta({
    title: t("metaHomeTitle"),
    description: t("metaHomeDesc"),
  });

  const categories = useMemo(() => {
    const counts = new Map();
    for (const item of catalog) {
      if (!item.category) continue;
      counts.set(item.category, (counts.get(item.category) || 0) + 1);
    }
    return Array.from(counts.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => a.name.localeCompare(b.name, "es"));
  }, []);

  const topBrands = useMemo(() => {
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

  const waHref = buildGenericGreetingUrl(SITE.whatsappNumber);
  const telHref = `tel:${SITE.phoneDisplay.replace(/[^\d+]/g, "")}`;

  return (
    <div>
      {/* 1. Hero (bg-gradient from-brand-950 via-brand-900 to-brand-700) */}
      <section className="bg-gradient-to-r from-brand-950 via-brand-900 to-brand-700 py-14 text-white sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="inline-flex items-center rounded-full bg-brand-500 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">
              {SITE.name} · {SITE.badge}
            </span>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-white md:text-4xl">
              {t("heroTagline")}
            </h1>
            <p className="mt-3 text-base text-white/90 sm:text-lg">
              {t("catalogIntro")}
            </p>

            <div className="mt-6 max-w-2xl">
              <SearchBox size="lg" />
            </div>

            {/* Hero and CTA buttons use rounded-full */}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link
                to="/catalogo"
                className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-brand-700 px-6 py-3 text-base font-semibold text-white transition duration-150 hover:bg-brand-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand-900"
              >
                <span>{t("viewCatalog")}</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>

              {SITE.whatsappNumber && (
                <a
                  href={waHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full border border-white bg-transparent px-6 py-3 text-base font-semibold text-white transition duration-150 hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                >
                  <MessageSquare className="h-4 w-4" aria-hidden="true" />
                  <span>{t("quoteViaWhatsApp")}</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 2. Categories grid */}
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
            <div>
              <h2 className="text-2xl font-semibold text-brand-900">
                {t("categoriesHeading")}
              </h2>
              <p className="mt-1 text-sm text-muted">
                {t("categoriesSubheading")}
              </p>
            </div>
            <Link
              to="/catalogo"
              className="inline-flex items-center gap-1 text-sm font-semibold text-brand-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-700 rounded"
            >
              <span>{t("viewCatalog")}</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((cat) => {
              const IconComponent = CATEGORY_ICON_MAP[cat.name] || Package;
              return (
                <Link
                  key={cat.name}
                  to={`/catalogo?cat=${encodeURIComponent(cat.name)}`}
                  className="group flex items-start gap-4 rounded-xl border border-line bg-white p-5 transition duration-150 hover:border-brand-700 hover:bg-lavender hover:shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-700"
                >
                  <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-lavender text-brand-900 group-hover:bg-gradient-to-r group-hover:from-brand-700 group-hover:to-brand-500 group-hover:text-white transition duration-150">
                    <IconComponent className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-base font-semibold text-brand-900 group-hover:text-brand-700">
                      {cat.name}
                    </h3>
                    <p className="mt-1 text-xs font-mono text-muted">
                      {cat.count === 1
                        ? t("categoryProductCountOne")
                        : t("categoryProductCount", { count: cat.count })}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. How to quote (3 steps) */}
      <section className="border-y border-line bg-lavender py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold text-brand-900">
            {t("howToQuoteHeading")}
          </h2>

          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="rounded-xl border border-line bg-white p-6 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-900 text-white">
                <Search className="h-5 w-5" aria-hidden="true" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-brand-900">
                {t("step1Title")}
              </h3>
              <p className="mt-1.5 text-sm text-muted">{t("step1Desc")}</p>
            </div>

            <div className="rounded-xl border border-line bg-white p-6 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-900 text-white">
                <ClipboardList className="h-5 w-5" aria-hidden="true" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-brand-900">
                {t("step2Title")}
              </h3>
              <p className="mt-1.5 text-sm text-muted">{t("step2Desc")}</p>
            </div>

            <div className="rounded-xl border border-line bg-white p-6 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-900 text-white">
                <MessageSquare className="h-5 w-5" aria-hidden="true" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-brand-900">
                {t("step3Title")}
              </h3>
              <p className="mt-1.5 text-sm text-muted">{t("step3Desc")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Brands strip */}
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
            <h2 className="text-2xl font-semibold text-brand-900">
              {t("brandsHeading")}
            </h2>
            <Link
              to="/marcas"
              className="inline-flex items-center gap-1 text-sm font-semibold text-brand-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-700 rounded"
            >
              <span>{t("viewAllBrands")}</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>

          <div className="mt-6 flex flex-wrap gap-2.5">
            {topBrands.map((brand) => (
              <Link
                key={brand.name}
                to={`/catalogo?brand=${encodeURIComponent(brand.name)}`}
                className="inline-flex min-h-[44px] items-center gap-2 rounded-lg border border-line bg-white px-4 py-2 text-sm font-semibold text-brand-900 transition duration-150 hover:border-brand-700 hover:bg-lavender hover:shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-700"
              >
                <span>{brand.name}</span>
                <span className="rounded bg-lavender px-1.5 py-0.5 text-xs font-mono text-muted">
                  {brand.count}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Clients strip (Section D) */}
      <ClientsSection />

      {/* 6. Contact strip */}
      <section className="border-t border-line bg-lavender py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-6 rounded-xl border border-line bg-white p-6 lg:flex-row lg:items-center">
            <div>
              <h2 className="text-2xl font-semibold text-brand-900">
                {t("contactStripHeading")}
              </h2>
              <p className="mt-1 text-sm text-muted">{t("contactStripSub")}</p>
              {SITE.location && (
                <p className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-muted">
                  <MapPin className="h-4 w-4 text-brand-700" aria-hidden="true" />
                  <span>{SITE.location}</span>
                </p>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {SITE.phoneDisplay && (
                <a
                  href={telHref}
                  className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full border border-brand-700 bg-white px-5 py-2.5 text-sm font-semibold text-brand-700 transition duration-150 hover:bg-lavender focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-700"
                >
                  <Phone className="h-4 w-4" aria-hidden="true" />
                  <span className="font-mono">{SITE.phoneDisplay}</span>
                </a>
              )}

              {SITE.whatsappNumber && (
                <a
                  href={waHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full bg-brand-700 px-5 py-2.5 text-sm font-semibold text-white transition duration-150 hover:bg-brand-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-700"
                >
                  <MessageSquare className="h-4 w-4" aria-hidden="true" />
                  <span>{t("quoteViaWhatsApp")}</span>
                </a>
              )}

              {SITE.email && (
                <a
                  href={`mailto:${SITE.email}`}
                  className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full border border-line bg-white px-5 py-2.5 text-sm font-semibold text-brand-900 transition duration-150 hover:bg-lavender focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-700"
                >
                  <Mail className="h-4 w-4" aria-hidden="true" />
                  <span>{SITE.email}</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
