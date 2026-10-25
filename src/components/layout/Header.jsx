import { useState } from "react";
import { Link, NavLink, useSearchParams } from "react-router-dom";
import { FileText, Mail, Menu, MessageSquare, Phone, X } from "lucide-react";
import { SITE } from "../../config/site.js";
import { buildGenericGreetingUrl } from "../../lib/whatsapp.js";
import { useI18n } from "../../i18n/I18nContext.jsx";
import { SearchBox } from "../search/SearchBox.jsx";
import { RfqButton } from "../rfq/RfqButton.jsx";
import { LanguageToggle } from "../ui/LanguageToggle.jsx";

export function LogoLockup({ className = "" }) {
  return (
    <Link
      to="/"
      aria-label={`${SITE.name} ${SITE.badge}`}
      className={`inline-flex items-center gap-2 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 ${className}`}
    >
      <span className="text-xl font-bold tracking-tight text-white">SERSE</span>
      <span className="text-lg font-normal text-white">Industrial</span>
      <span className="rounded bg-brand-500 px-1.5 py-0.5 text-xs font-bold uppercase tracking-wider text-white">
        {SITE.badge}
      </span>
    </Link>
  );
}

export function Header() {
  const { t } = useI18n();
  const [searchParams] = useSearchParams();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const currentQ = searchParams.get("q") || "";
  const telHref = `tel:${SITE.phoneDisplay.replace(/[^\d+]/g, "")}`;
  const waHref = buildGenericGreetingUrl(SITE.whatsappNumber);

  const navItems = [
    { to: "/", label: t("navHome"), end: true },
    { to: "/catalogo", label: t("navCatalog") },
    { to: "/cotizacion-rapida", label: t("navQuickOrder") },
    { to: "/marcas", label: t("navBrands") },
    { to: "/contacto", label: t("navContact") },
  ];

  return (
    <header className="sticky top-0 z-30 shadow-sm">
      {/* 1. Top utility strip (bg-brand-950) */}
      <div className="border-b border-white/10 bg-brand-950 text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-1.5 text-xs sm:px-6 lg:px-8">
          <div className="flex items-center gap-5">
            {SITE.phoneDisplay && (
              <a
                href={telHref}
                className="inline-flex items-center gap-1.5 text-white hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 rounded"
              >
                <Phone className="h-3.5 w-3.5" aria-hidden="true" />
                <span className="font-mono">{SITE.phoneDisplay}</span>
              </a>
            )}
            {SITE.whatsappNumber && (
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-white hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 rounded"
              >
                <MessageSquare className="h-3.5 w-3.5" aria-hidden="true" />
                <span>WhatsApp</span>
              </a>
            )}
            {SITE.email && (
              <a
                href={`mailto:${SITE.email}`}
                className="inline-flex items-center gap-1.5 text-white hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 rounded"
              >
                <Mail className="h-3.5 w-3.5" aria-hidden="true" />
                <span>{SITE.email}</span>
              </a>
            )}
            {/* Quick order in utility strip */}
            <Link
              to="/cotizacion-rapida"
              className="inline-flex items-center gap-1.5 text-white/90 hover:text-white hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 rounded"
            >
              <FileText className="h-3.5 w-3.5 text-brand-500" aria-hidden="true" />
              <span>{t("navQuickOrder")}</span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-white/80 hidden sm:inline">{SITE.location}</span>
            <LanguageToggle />
          </div>
        </div>
      </div>

      {/* 2. Main brand bar (bg-gradient from-brand-950 via-brand-900 to-brand-700) */}
      <div className="bg-gradient-to-r from-brand-950 via-brand-900 to-brand-700 text-white border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setMobileMenuOpen((prev) => !prev)}
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-nav-menu"
                aria-label={mobileMenuOpen ? t("closeMenu") : t("openMenu")}
                className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg text-white hover:bg-brand-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 lg:hidden"
              >
                {mobileMenuOpen ? (
                  <X className="h-5 w-5" aria-hidden="true" />
                ) : (
                  <Menu className="h-5 w-5" aria-hidden="true" />
                )}
              </button>

              <LogoLockup />
            </div>

            {/* SearchBox on desktop */}
            <div className="hidden md:block md:flex-1 md:max-w-md lg:max-w-lg">
              <SearchBox initialValue={currentQ} />
            </div>

            <div className="flex items-center gap-2">
              <RfqButton />
            </div>
          </div>

          {/* SearchBox on mobile */}
          <div className="mt-3 md:hidden">
            <SearchBox initialValue={currentQ} />
          </div>
        </div>
      </div>

      {/* 3. Navigation bar (bg-mist, bold ink links, hover/active text-brand-700 with 2px underline) */}
      <div className="bg-mist border-b border-line">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav
            aria-label={t("mainNavLabel")}
            className="hidden lg:flex lg:items-center lg:gap-6"
          >
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `inline-flex items-center py-2.5 text-sm font-bold transition duration-150 border-b-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-700 ${
                    isActive
                      ? "text-brand-700 border-brand-700"
                      : "text-ink border-transparent hover:text-brand-700 hover:border-brand-700"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <nav
            id="mobile-nav-menu"
            aria-label={t("mainNavLabel")}
            className="border-t border-line px-4 py-3 bg-mist lg:hidden"
          >
            <ul className="space-y-1">
              {navItems.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    end={item.end}
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `block rounded-lg px-3 py-2 text-sm font-bold transition duration-150 border-l-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-700 ${
                        isActive
                          ? "bg-lavender text-brand-700 border-brand-700"
                          : "text-ink border-transparent hover:bg-lavender hover:text-brand-700"
                      }`
                    }
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>
    </header>
  );
}
