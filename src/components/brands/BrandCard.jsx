import { useState } from "react";
import { Link } from "react-router-dom";
import { slugifyBrand } from "../../lib/normalize.js";
import { useI18n } from "../../i18n/I18nContext.jsx";

/**
 * BrandCard component
 * Displays a brand card with its official logo or a styled text fallback,
 * along with its product count, linking directly to the filtered catalog.
 */
export function BrandCard({ brand, count, className = "" }) {
  const { t } = useI18n();
  const slug = slugifyBrand(brand);

  // Logo fallback state machine: 'svg' -> 'png' -> 'fallback'
  const [imgFormat, setImgFormat] = useState(() => (slug ? "svg" : "fallback"));

  const handleImgError = () => {
    setImgFormat((current) => {
      if (current === "svg") return "png";
      return "fallback";
    });
  };

  return (
    <Link
      to={`/catalogo?brand=${encodeURIComponent(brand)}`}
      className={`group flex h-32 sm:h-36 flex-col items-center justify-center rounded-2xl bg-white p-4 shadow-md transition duration-150 hover:-translate-y-0.5 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-700 focus-visible:ring-offset-2 ${className}`}
    >
      <div className="flex flex-1 w-full min-h-0 items-center justify-center">
        {imgFormat !== "fallback" && slug ? (
          <img
            src={`/images/brands/${slug}.${imgFormat}`}
            alt={brand}
            loading="lazy"
            onError={handleImgError}
            className="max-h-16 max-w-[80%] object-contain"
          />
        ) : (
          <span className="line-clamp-2 text-center text-lg font-bold text-brand-900">
            {brand}
          </span>
        )}
      </div>

      {typeof count === "number" && (
        <span className="mt-2 font-mono text-xs text-muted">
          {count === 1
            ? t("categoryProductCountOne")
            : t("categoryProductCount", { count })}
        </span>
      )}
    </Link>
  );
}
