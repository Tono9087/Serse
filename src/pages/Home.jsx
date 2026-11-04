import { Link } from "react-router-dom";
import { ArrowRight, Mail, MapPin, MessageSquare, Phone } from "lucide-react";
import { BUSINESS_NAME, WHATSAPP_NUMBER, PHONE_DISPLAY, PHONE_HREF, EMAIL_CONTACT, SITE } from "../config/site.js";
import { buildGenericGreetingUrl } from "../lib/whatsapp.js";
import { usePageMeta } from "../hooks/usePageMeta.js";
import { useI18n } from "../i18n/I18nContext.jsx";
import { SearchBox } from "../components/search/SearchBox.jsx";
import { Container } from "../components/layout/Container.jsx";
import { ParallaxHero } from "../components/ui/ParallaxHero.jsx";
import { CategoryShowcase } from "../components/home/CategoryShowcase.jsx";
import { ClientsSection } from "../components/clients/ClientsSection.jsx";

export function Home() {
  const { t } = useI18n();

  usePageMeta({
    title: t("metaHomeTitle"),
    description: t("metaHomeDesc"),
  });

  const waHref = buildGenericGreetingUrl(WHATSAPP_NUMBER);

  return (
    <div>
      {/* 1. Hero (reduced vertical padding, full-bleed with Container) */}
      <ParallaxHero
        imageSrc="/images/banner_bg.webp"
        bottomFade={false}
        overlayClassName="bg-gradient-to-r from-brand-950/90 via-brand-950/80 to-brand-900/70"
        className="py-12 sm:py-16"
      >
        <Container>
          <div className="max-w-3xl">
            <span className="inline-flex items-center rounded-full bg-brand-500 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">
              {BUSINESS_NAME} · {SITE.badge}
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

              {WHATSAPP_NUMBER && (
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
      </ParallaxHero>

      {/* 1b. Featured categories showcase */}
      <CategoryShowcase limit={8} />

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
              {PHONE_DISPLAY && (
                <a
                  href={PHONE_HREF}
                  className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full border border-brand-700 bg-white px-5 py-2.5 text-sm font-semibold text-brand-700 transition duration-150 hover:bg-lavender focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-700"
                >
                  <Phone className="h-4 w-4" aria-hidden="true" />
                  <span className="font-mono">{PHONE_DISPLAY}</span>
                </a>
              )}

              {WHATSAPP_NUMBER && (
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

              {EMAIL_CONTACT && (
                <a
                  href={`mailto:${EMAIL_CONTACT}`}
                  className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full border border-line bg-white px-5 py-2.5 text-sm font-semibold text-brand-900 transition duration-150 hover:bg-lavender focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-700"
                >
                  <Mail className="h-4 w-4" aria-hidden="true" />
                  <span>{EMAIL_CONTACT}</span>
                </a>
              )}
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
