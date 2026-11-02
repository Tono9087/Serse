import { useState } from "react";
import { Link } from "react-router-dom";
import { useI18n } from "../../i18n/I18nContext.jsx";
import { getBrandCatalogUrl } from "../../lib/brands.js";
import { buildBrandGreetingUrl } from "../../lib/whatsapp.js";

/**
 * BrandCard component
 * Displays a brand tile with logo (or typographic lockup) and clear inventory status.
 * Links to the filtered catalog when products exist, or opens a pre-filled WhatsApp quote
 * with a "Distribución bajo pedido / Cotización directa" badge when count is 0.
 */
export function BrandCard({ brand, count = 0, className = "" }) {
  const { t } = useI18n();

  const brandName = typeof brand === "object" ? brand.name : brand;
  const slug =
    typeof brand === "object"
      ? brand.slug
      : String(brand).toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const allowLogo = typeof brand === "object" ? brand.hasLogo !== false : true;

  // Logo fallback state machine: 'svg' -> 'png' -> 'webp' -> 'fallback'
  const [imgFormat, setImgFormat] = useState(() =>
    slug && allowLogo ? "svg" : "fallback"
  );

  const handleImgError = () => {
    setImgFormat((current) => {
      if (current === "svg") return "png";
      if (current === "png") return "webp";
      return "fallback";
    });
  };

  const hasProducts = count > 0;
  const countText =
    count === 1
      ? t("categoryProductCountOne")
      : t("categoryProductCount", { count });

  const accessibleLabel = hasProducts
    ? `${brandName}, ${countText}`
    : `${brandName}, ${t("brandOnDemandBadge")}`;

  const tileClasses = `group flex min-h-[140px] flex-col items-center justify-between rounded-xl border p-3.5 text-center transition duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-700 focus-visible:ring-offset-2 ${
    hasProducts
      ? "border-line bg-white hover:border-brand-700 hover:shadow-sm"
      : "border-line/80 bg-mist/60 hover:border-brand-700 hover:bg-white hover:shadow-sm"
  } ${className}`;

  const content = (
    <>
      <div className="flex h-14 w-full items-center justify-center px-2">
        {imgFormat !== "fallback" && slug ? (
          <img
            src={`/images/brands/${slug}.${imgFormat}`}
            alt={brandName}
            loading="lazy"
            onError={handleImgError}
            className="h-10 sm:h-12 w-auto max-h-12 max-w-[80%] object-contain grayscale opacity-80 transition duration-150 group-hover:grayscale-0 group-hover:opacity-100 group-focus-visible:grayscale-0 group-focus-visible:opacity-100"
          />
        ) : (
          <span className="line-clamp-2 text-center text-base font-bold tracking-tight text-brand-900 transition duration-150 group-hover:text-brand-700">
            {brandName}
          </span>
        )}
      </div>

      <div className="mt-2 flex flex-col items-center gap-1 text-xs">
        {hasProducts ? (
          <span className="inline-flex items-center rounded-full bg-lavender px-2.5 py-0.5 font-mono font-semibold text-brand-900">
            {countText}
          </span>
        ) : (
          <>
            <span className="inline-flex items-center rounded-full border border-brand-700/25 bg-lavender/70 px-2.5 py-0.5 text-[11px] font-medium text-brand-900">
              {t("brandOnDemandBadge")}
            </span>
            <span className="font-semibold text-brand-700 group-hover:underline">
              {t("quoteViaWhatsApp")}
            </span>
          </>
        )}
      </div>
    </>
  );

  if (hasProducts) {
    const catalogUrl =
      typeof brand === "object"
        ? getBrandCatalogUrl(brand)
        : `/catalogo?brand=${encodeURIComponent(brandName)}`;

    return (
      <Link to={catalogUrl} aria-label={accessibleLabel} className={tileClasses}>
        {content}
      </Link>
    );
  }

  const waUrl = buildBrandGreetingUrl(brandName);

  return (
    <a
      href={waUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={accessibleLabel}
      className={tileClasses}
    >
      {content}
    </a>
  );
}
