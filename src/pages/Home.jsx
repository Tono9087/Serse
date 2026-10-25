import { Link } from "react-router-dom";
import { ArrowRight, Mail, MapPin, MessageSquare, Phone } from "lucide-react";
import { SITE } from "../config/site.js";
import { buildGenericGreetingUrl } from "../lib/whatsapp.js";
import { usePageMeta } from "../hooks/usePageMeta.js";
import { useI18n } from "../i18n/I18nContext.jsx";
import { SearchBox } from "../components/search/SearchBox.jsx";
import { Container } from "../components/layout/Container.jsx";
import { CategoryGrid } from "../components/catalog/CategoryGrid.jsx";
import { ClientsSection } from "../components/clients/ClientsSection.jsx";

export function Home() {
  const { t } = useI18n();

  usePageMeta({
    title: t("metaHomeTitle"),
    description: t("metaHomeDesc"),
  });

  const waHref = buildGenericGreetingUrl(SITE.whatsappNumber);
  const telHref = `tel:${SITE.phoneDisplay.replace(/[^\d+]/g, "")}`;

  return (
    <div>
      {/* 1. Hero (reduced vertical padding, full-bleed with Container) */}
      <section className="relative overflow-hidden bg-brand-950 py-12 text-white sm:py-16">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/images/banner_bg.jpg')" }}
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-brand-950/90 via-brand-950/80 to-brand-900/70"
          aria-hidden="true"
        />
        <Container className="relative z-10">
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

            {/* Hero and CTA buttons */}
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
        </Container>
      </section>

      {/* 2. Categories grid: 2 cols mobile, 4 on lg, keep 4 on 2xl */}
      <section className="py-12 sm:py-16">
        <Container>
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
              className="inline-flex items-center gap-1 rounded text-sm font-semibold text-brand-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-700"
            >
              <span>{t("viewCatalog")}</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>

          <CategoryGrid />
        </Container>
      </section>

      {/* 3. Clients strip */}
      <ClientsSection />

      {/* 4. Contact strip */}
      <section className="border-t border-line bg-lavender py-10">
        <Container>
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
        </Container>
      </section>
    </div>
  );
}
