import { ChevronLeft, ChevronRight } from "lucide-react";
import { getPageRange } from "../../lib/pagination.js";
import { useI18n } from "../../i18n/I18nContext.jsx";

export function Pagination({ page, totalPages, onPageChange }) {
  const { t } = useI18n();

  if (totalPages <= 1) return null;

  const range = getPageRange(page, totalPages);

  return (
    <nav
      aria-label={t("paginationAria")}
      className="mt-8 flex items-center justify-center"
    >
      <ul className="inline-flex flex-wrap items-center gap-1.5">
        <li>
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
            aria-label={t("prevPage")}
            className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg border border-line bg-white px-2.5 text-sm font-medium text-brand-900 transition duration-150 hover:border-brand-700 hover:bg-lavender focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-700 disabled:pointer-events-none disabled:opacity-40"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          </button>
        </li>

        {range.map((item, idx) => {
          if (item === "…") {
            return (
              <li
                key={`ellipsis-${idx}`}
                aria-hidden="true"
                className="px-2 text-sm text-muted select-none"
              >
                …
              </li>
            );
          }

          const isCurrent = item === page;
          return (
            <li key={item}>
              <button
                type="button"
                onClick={() => onPageChange(item)}
                aria-current={isCurrent ? "page" : undefined}
                aria-label={t("pageNumberAria", { page: item })}
                className={`inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg border px-3 text-sm font-semibold font-mono transition duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-700 ${
                  isCurrent
                    ? "border-brand-700 bg-brand-700 text-white"
                    : "border-line bg-white text-brand-900 hover:border-brand-700 hover:bg-lavender"
                }`}
              >
                {item}
              </button>
            </li>
          );
        })}

        <li>
          <button
            type="button"
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
            aria-label={t("nextPage")}
            className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg border border-line bg-white px-2.5 text-sm font-medium text-brand-900 transition duration-150 hover:border-brand-700 hover:bg-lavender focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-700 disabled:pointer-events-none disabled:opacity-40"
          >
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </li>
      </ul>
    </nav>
  );
}
