import { useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Eye, MessageSquare, ShieldCheck, Target } from "lucide-react";
import { ABOUT } from "../config/about.js";
import { SITE } from "../config/site.js";
import { buildGenericGreetingUrl } from "../lib/whatsapp.js";
import { usePageMeta } from "../hooks/usePageMeta.js";
import { useI18n } from "../i18n/I18nContext.jsx";
import { Container } from "../components/layout/Container.jsx";
import { CategoryGrid } from "../components/catalog/CategoryGrid.jsx";
import { ClientsSection } from "../components/clients/ClientsSection.jsx";

const PILLAR_ICONS = {
  commitment: ShieldCheck,
  vision: Eye,
  mission: Target,
};

export function About() {
  const { language, t } = useI18n();

  // Resolve bilingual content with fallback to Spanish
  const content = useMemo(() => {
    const isEn = language === "en";
    const intro =
      isEn && ABOUT.intro.en && ABOUT.intro.en.length > 0
        ? ABOUT.intro.en
        : ABOUT.intro.es;

    const pillars = ABOUT.pillars.map((pillar) => {
      const pLang =
        isEn && pillar.en?.title && pillar.en?.text ? pillar.en : pillar.es;
      return {
        key: pillar.key,
        title: pLang.title || pillar.es.title,
        text: pLang.text || pillar.es.text,
      };
    });

    return { intro, pillars };
  }, [language]);

  usePageMeta({
    title: t("metaAboutTitle"),
    description: content.intro[0] || t("metaAboutDesc"),
  });

  const waHref = buildGenericGreetingUrl(SITE.whatsappNumber);

  return (
    <div>
      {/* 1. Header band */}
      <section className="bg-gradient-to-b from-brand-950 via-brand-900 to-brand-800 py-16 text-white md:py-24">
        <Container>
          <div className="max-w-3xl">
            <h1 className="text-3xl font-bold tracking-tight text-white md:text-5xl">
              {t("aboutPageTitle")}
            </h1>
            <div className="mt-6 space-y-4 text-base text-white/90 sm:text-lg leading-relaxed">
              {content.intro.map((paragraph, index) => (
                <p key={`intro-${index}`}>{paragraph}</p>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* 2. Pillars section */}
      <section className="bg-lavender py-16 sm:py-20">
        <Container>
          <div className="text-center">
            <h2 className="text-2xl font-bold tracking-tight text-brand-900 md:text-3xl">
              {t("aboutPillarsHeading")}
            </h2>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-3">
            {content.pillars.map((pillar) => {
              const IconComponent = PILLAR_ICONS[pillar.key] || ShieldCheck;
              return (
                <div
                  key={pillar.key}
                  className="flex flex-col items-center rounded-2xl bg-white p-8 text-center shadow-md"
                >
                  <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-lavender text-brand-700">
                    <IconComponent className="h-8 w-8" aria-hidden="true" />
                  </div>
                  <h3 className="text-xl font-semibold text-brand-900">
                    {pillar.title}
                  </h3>
                  <p className="mt-3 text-sm sm:text-base leading-relaxed text-ink">
                    {pillar.text}
                  </p>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* 3. What we supply */}
      <section className="bg-white py-16 sm:py-20">
        <Container>
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-brand-900 md:text-3xl">
              {t("aboutSupplyHeading")}
            </h2>
            <p className="mt-2 text-base text-muted">
              {t("aboutSupplySub")}
            </p>
          </div>

          <CategoryGrid />
        </Container>
      </section>

      {/* 4. Clients section */}
      <ClientsSection />

      {/* 5. CTA band */}
      <section className="bg-brand-800 py-16 text-center text-white">
        <Container>
          <h2 className="text-2xl font-bold tracking-tight text-white md:text-3xl">
            {t("aboutCtaHeading")}
          </h2>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            {SITE.whatsappNumber && (
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-base font-semibold text-brand-900 transition duration-150 hover:bg-lavender focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand-800 shadow-sm"
              >
                <MessageSquare className="h-5 w-5" aria-hidden="true" />
                <span>{t("requestQuote")}</span>
              </a>
            )}
            <Link
              to="/catalogo"
              className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full border border-white bg-transparent px-6 py-3 text-base font-semibold text-white transition duration-150 hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand-800"
            >
              <span>{t("viewCatalog")}</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </Container>
      </section>
    </div>
  );
}
