import { X } from "lucide-react";
import { useI18n } from "../../i18n/I18nContext.jsx";

export function ActiveFilters({
  q,
  cat,
  sub,
  brands = [],
  onRemoveQ,
  onRemoveCat,
  onRemoveSub,
  onRemoveBrand,
  onClearAll,
}) {
  const { t } = useI18n();

  const chips = [];
  if (q) {
    chips.push({
      key: `q-${q}`,
      label: `«${q}»`,
      onRemove: onRemoveQ,
    });
  }
  if (cat) {
    chips.push({
      key: `cat-${cat}`,
      label: cat,
      onRemove: onRemoveCat,
    });
  }
  if (sub) {
    chips.push({
      key: `sub-${sub}`,
      label: sub,
      onRemove: onRemoveSub,
    });
  }
  for (const brand of brands) {
    chips.push({
      key: `brand-${brand}`,
      label: brand,
      onRemove: () => onRemoveBrand(brand),
    });
  }

  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 pt-2">
      {chips.map((chip) => (
        <span
          key={chip.key}
          className="inline-flex items-center gap-1.5 rounded-lg border border-brand-700/40 bg-lavender px-2.5 py-1 text-xs font-medium text-brand-900"
        >
          <span>{chip.label}</span>
          <button
            type="button"
            onClick={chip.onRemove}
            aria-label={t("removeFilterAria", { label: chip.label })}
            className="inline-flex h-4 w-4 items-center justify-center rounded text-muted hover:bg-brand-700 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-700"
          >
            <X className="h-3 w-3" aria-hidden="true" />
          </button>
        </span>
      ))}

      {chips.length > 1 && (
        <button
          type="button"
          onClick={onClearAll}
          className="text-xs font-semibold text-brand-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-700 rounded px-1.5 py-1"
        >
          {t("clearFilters")}
        </button>
      )}
    </div>
  );
}
