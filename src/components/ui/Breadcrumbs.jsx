import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { useI18n } from "../../i18n/I18nContext.jsx";

/**
 * Breadcrumbs component
 * @param {{ items: Array<{ label: string, to?: string }> }} props
 */
export function Breadcrumbs({ items = [] }) {
  const { t } = useI18n();

  if (!items || items.length === 0) return null;

  return (
    <nav aria-label={t("breadcrumbsAria")} className="mb-4">
      <ol className="flex flex-wrap items-center gap-1.5 text-xs text-muted">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-1.5">
              {index > 0 && (
                <ChevronRight
                  className="h-3.5 w-3.5 flex-shrink-0 text-muted/60"
                  aria-hidden="true"
                />
              )}
              {isLast || !item.to ? (
                <span
                  aria-current="page"
                  className="font-semibold text-brand-900 max-w-[200px] sm:max-w-xs md:max-w-md truncate"
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  to={item.to}
                  className="transition duration-150 hover:text-brand-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-700 rounded"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
