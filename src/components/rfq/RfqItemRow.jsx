import { Minus, Plus, Trash2 } from "lucide-react";
import { useI18n } from "../../i18n/I18nContext.jsx";
import { Badge } from "../ui/Badge.jsx";

export function RfqItemRow({ line, onUpdateQty, onRemove }) {
  const { t } = useI18n();
  const { id, name, brand, np, qty } = line;

  return (
    <li className="flex flex-col gap-2.5 border-b border-line py-3.5 last:border-b-0">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          {brand && (
            <div className="mb-1">
              <Badge variant="brand">{brand}</Badge>
            </div>
          )}
          <p className="text-sm font-semibold text-brand-900 leading-snug">{name}</p>
          <p className="mt-0.5 text-xs font-mono text-muted">
            {np ? (
              <>
                {t("npLabel")} <code className="text-ink">{np}</code>
              </>
            ) : (
              t("npPending")
            )}
          </p>
        </div>
        <button
          type="button"
          onClick={() => onRemove(id)}
          aria-label={t("rfqItemRemoveAria", { name })}
          className="inline-flex min-h-[38px] min-w-[38px] items-center justify-center rounded-lg text-muted hover:bg-lavender hover:text-danger focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-700"
        >
          <Trash2 className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-xs text-muted">{t("unitPzas")}</span>
        <div className="inline-flex items-center rounded-lg border border-line bg-white">
          <button
            type="button"
            onClick={() => onUpdateQty(id, Math.max(1, qty - 1))}
            disabled={qty <= 1}
            aria-label={t("decreaseQtyAria", { name })}
            className="inline-flex h-9 w-9 items-center justify-center rounded-l-lg text-brand-900 hover:bg-lavender focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-700 disabled:opacity-40"
          >
            <Minus className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
          <input
            type="number"
            min={1}
            max={9999}
            value={qty}
            aria-label={t("quantityInputAria", { name })}
            onChange={(e) => {
              const raw = e.target.value;
              if (raw === "") return;
              onUpdateQty(id, Number.parseInt(raw, 10) || 1);
            }}
            className="h-9 w-14 border-x border-line text-center text-sm font-semibold text-brand-900 font-mono focus:outline-none focus:ring-1 focus:ring-brand-700"
          />
          <button
            type="button"
            onClick={() => onUpdateQty(id, Math.min(9999, qty + 1))}
            disabled={qty >= 9999}
            aria-label={t("increaseQtyAria", { name })}
            className="inline-flex h-9 w-9 items-center justify-center rounded-r-lg text-brand-900 hover:bg-lavender focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-700 disabled:opacity-40"
          >
            <Plus className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </li>
  );
}
