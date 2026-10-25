import { useState } from "react";
import { Link } from "react-router-dom";
import { useI18n } from "../../i18n/I18nContext.jsx";
import { getBrandCatalogUrl } from "../../lib/brands.js";
import { buildBrandGreetingUrl } from "../../lib/whatsapp.js";

/**
 * BrandCard component
 * Displays a curated brand tile with grayscale-to-color logo transition.
 * Links to filtered catalog if products exist, or opens a pre-filled WhatsApp quote request.
 */
export function BrandCard({ brand, count = 0, className = "" }) {
  const { t } = useI18n();

  const brandName = typeof brand === "object" ? brand.name : brand;
  const slug =
    typeof brand === "object"
      ? brand.slug
      : String(brand).toLowerCase().replace(/[^a-z0-9]+/g, "-");

  // Logo fallback state machine: 'svg' -> 'png' -> 'webp' -> 'fallback'
  const [imgFormat, setImgFormat] = useState(() => (slug ? "svg" : "fallback"));

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
    : `${brandName}, ${t("quoteViaWhatsApp")}`;

  const tileClasses = `group flex h-32 flex-col items-center justify-center rounded-xl border border-transparent bg-white p-3 text-center transition duration-150 hover:border-line hover:shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-700 focus-visible:ring-offset-2 ${className}`;

  const content = (
    <>
      <div className="flex h-16 w-full items-center justify-center px-3">
        {imgFormat !== "fallback" && slug ? (
          <img
            src={`/images/brands/${slug}.${imgFormat}`}
            alt={brandName}
            loading="lazy"
            onError={handleImgError}
            className="h-10 sm:h-12 w-auto max-h-12 max-w-[80%] object-contain grayscale opacity-80 transition duration-150 group-hover:grayscale-0 group-hover:opacity-100 group-focus-visible:grayscale-0 group-focus-visible:opacity-100"
          />
        ) : (
          <span className="line-clamp-2 text-center text-base font-bold text-brand-900 transition duration-150 group-hover:text-brand-700">
            {brandName}
          </span>
        )}
      </div>

      <div className="mt-2 text-xs">
        {hasProducts ? (
          <span className="font-mono text-muted">{countText}</span>
        ) : (
          <span className="font-medium text-brand-700">{t("quoteViaWhatsApp")}</span>
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
