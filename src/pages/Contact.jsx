import { ClipboardList, Mail, MapPin, MessageSquare, Phone } from "lucide-react";
import { SITE } from "../config/site.js";
import { buildGenericGreetingUrl } from "../lib/whatsapp.js";
import { useRfq } from "../context/RfqContext.jsx";
import { usePageMeta } from "../hooks/usePageMeta.js";
import { useI18n } from "../i18n/I18nContext.jsx";
import { Button } from "../components/ui/Button.jsx";
import { Container } from "../components/layout/Container.jsx";

export function Contact() {
  const { t } = useI18n();
  const { open } = useRfq();

  usePageMeta({
    title: t("metaContactTitle"),
    description: t("metaContactDesc"),
  });

  const waHref = buildGenericGreetingUrl(SITE.whatsappNumber);
  const telHref = `tel:${SITE.phoneDisplay.replace(/[^\d+]/g, "")}`;

  return (
    <Container className="py-10">
      <div className="max-w-3xl">
        <h1 className="text-3xl font-bold text-brand-900 md:text-4xl">
          {t("contactPageTitle")}
        </h1>
        <p className="mt-2 text-base text-muted">{t("contactPageIntro")}</p>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* WhatsApp Card */}
        {SITE.whatsappNumber && (
          <div className="flex flex-col justify-between rounded-xl border border-line bg-white p-6 shadow-sm">
            <div>
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-brand-900 text-white">
                <MessageSquare className="h-5 w-5" aria-hidden="true" />
              </div>
              <h2 className="mt-4 text-xl font-semibold text-brand-900">
                {t("whatsappChannelTitle")}
              </h2>
              <p className="mt-1.5 text-sm text-muted">
                {t("whatsappChannelDesc")}
              </p>
            </div>
            <div className="mt-6">
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-lg bg-brand-700 px-4 py-2.5 text-sm font-semibold text-white transition duration-150 hover:bg-brand-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-700"
              >
                <MessageSquare className="h-4 w-4" aria-hidden="true" />
                <span>{t("quoteViaWhatsApp")}</span>
              </a>
            </div>
          </div>
        )}

        {/* Phone Card */}
        {SITE.phoneDisplay && (
          <div className="flex flex-col justify-between rounded-xl border border-line bg-white p-6 shadow-sm">
            <div>
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-brand-900 text-white">
                <Phone className="h-5 w-5" aria-hidden="true" />
              </div>
              <h2 className="mt-4 text-xl font-semibold text-brand-900">
                {t("phoneChannelTitle")}
              </h2>
              <p className="mt-1.5 text-sm text-muted">
                {t("phoneChannelDesc")}
              </p>
            </div>
            <div className="mt-6">
              <a
                href={telHref}
                className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-lg border border-brand-700 bg-white px-4 py-2.5 text-sm font-semibold text-brand-700 font-mono transition duration-150 hover:bg-lavender focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-700"
              >
                <Phone className="h-4 w-4" aria-hidden="true" />
                <span>{SITE.phoneDisplay}</span>
              </a>
            </div>
          </div>
        )}

        {/* Email Card (only if SITE.email is set) */}
        {SITE.email && (
          <div className="flex flex-col justify-between rounded-xl border border-line bg-white p-6 shadow-sm">
            <div>
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-brand-900 text-white">
                <Mail className="h-5 w-5" aria-hidden="true" />
              </div>
              <h2 className="mt-4 text-xl font-semibold text-brand-900">
                {t("emailChannelTitle")}
              </h2>
              <p className="mt-1.5 text-sm text-muted">
                {t("emailChannelDesc")}
              </p>
            </div>
            <div className="mt-6">
              <a
                href={`mailto:${SITE.email}`}
                className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-lg border border-brand-700 bg-white px-4 py-2.5 text-sm font-semibold text-brand-700 transition duration-150 hover:bg-lavender focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-700"
              >
                <Mail className="h-4 w-4" aria-hidden="true" />
                <span>{SITE.email}</span>
              </a>
            </div>
          </div>
        )}

        {/* Location Card */}
        {SITE.location && (
          <div className="flex flex-col justify-between rounded-xl border border-line bg-white p-6 shadow-sm">
            <div>
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-brand-900 text-white">
                <MapPin className="h-5 w-5" aria-hidden="true" />
              </div>
              <h2 className="mt-4 text-xl font-semibold text-brand-900">
                {t("locationChannelTitle")}
              </h2>
              <p className="mt-2 text-base font-medium text-ink">
                {SITE.location}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* "¿Buscas una pieza específica?" Card */}
      <div className="mt-8 rounded-xl border border-line bg-lavender p-6 sm:p-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-2xl font-semibold text-brand-900">
              {t("specificPartCardTitle")}
            </h2>
            <p className="mt-1 text-sm text-muted">
              {t("specificPartCardDesc")}
            </p>
          </div>
          <div className="flex-shrink-0">
            <Button variant="primary" size="lg" onClick={open} className="rounded-full">
              <ClipboardList className="h-5 w-5" aria-hidden="true" />
              <span>{t("openQuoteList")}</span>
            </Button>
          </div>
        </div>
      </div>
    </Container>
  );
}
