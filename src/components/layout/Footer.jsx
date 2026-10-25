import { Link } from "react-router-dom";
import { Mail, MapPin, MessageSquare, Phone } from "lucide-react";
import { SITE } from "../../config/site.js";
import { buildGenericGreetingUrl } from "../../lib/whatsapp.js";
import { useI18n } from "../../i18n/I18nContext.jsx";
import { LogoLockup } from "./Header.jsx";
import { Container } from "./Container.jsx";

export function Footer() {
  const { t } = useI18n();
  const currentYear = new Date().getFullYear();
  const telHref = `tel:${SITE.phoneDisplay.replace(/[^\d+]/g, "")}`;
  const waHref = buildGenericGreetingUrl(SITE.whatsappNumber);

  return (
    <footer className="bg-brand-950 text-white border-t border-white/10">
      <Container className="py-10">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Brand column */}
          <div>
            <LogoLockup />
            <p className="mt-3 max-w-sm text-sm text-white/85 leading-relaxed">
              {SITE.tagline}
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-white">
              {t("footerQuickLinks")}
            </h2>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link
                  to="/"
                  className="text-white/85 hover:text-white hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 rounded"
                >
                  {t("navHome")}
                </Link>
              </li>
              <li>
                <Link
                  to="/catalogo"
                  className="text-white/85 hover:text-white hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 rounded"
                >
                  {t("navCatalog")}
                </Link>
              </li>
              <li>
                <Link
                  to="/marcas"
                  className="text-white/85 hover:text-white hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 rounded"
                >
                  {t("navBrands")}
                </Link>
              </li>
              <li>
                <Link
                  to="/contacto"
                  className="text-white/85 hover:text-white hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 rounded"
                >
                  {t("navContact")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact details from config */}
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-white">
              {t("footerContactHeading")}
            </h2>
            <ul className="mt-3 space-y-2.5 text-sm text-white/90">
              {SITE.phoneDisplay && (
                <li>
                  <a
                    href={telHref}
                    className="inline-flex items-center gap-2 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 rounded"
                  >
                    <Phone className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
                    <span className="font-mono">{SITE.phoneDisplay}</span>
                  </a>
                </li>
              )}
              {SITE.whatsappNumber && (
                <li>
                  <a
                    href={waHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 rounded"
                  >
                    <MessageSquare
                      className="h-4 w-4 flex-shrink-0"
                      aria-hidden="true"
                    />
                    <span>{t("quoteViaWhatsApp")}</span>
                  </a>
                </li>
              )}
              {SITE.email && (
                <li>
                  <a
                    href={`mailto:${SITE.email}`}
                    className="inline-flex items-center gap-2 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 rounded"
                  >
                    <Mail className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
                    <span>{SITE.email}</span>
                  </a>
                </li>
              )}
              {SITE.location && (
                <li className="inline-flex items-center gap-2 text-white/85">
                  <MapPin className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
                  <span>{SITE.location}</span>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-white/15 pt-6 text-xs text-white/80 sm:flex-row">
          <p>{t("footerCopyright", { year: currentYear })}</p>
          {SITE.privacyUrl && (
            <a
              href={SITE.privacyUrl}
              className="hover:text-white hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 rounded"
            >
              {t("footerPrivacyLink")}
            </a>
          )}
        </div>
      </Container>
    </footer>
  );
}
