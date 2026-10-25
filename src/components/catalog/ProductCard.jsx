import { Check, Minus, Plus } from "lucide-react";
import { useRfq } from "../../context/RfqContext.jsx";
import { useI18n } from "../../i18n/I18nContext.jsx";
import { Badge } from "../ui/Badge.jsx";
import { Button } from "../ui/Button.jsx";
import { ProductImage } from "../ui/ProductImage.jsx";

export function ProductCard({ product, onOpenModal }) {
  const { getQty, add, setQty, remove } = useRfq();
  const { t } = useI18n();

  const qty = getQty(product.id);
  const inList = qty > 0;

  return (
    <article className="flex flex-col rounded-xl border border-line bg-white transition duration-150 hover:border-brand-700 hover:shadow-sm">
      {/* 1. Image area (aspect 4/3, bg-lavender) */}
      <button
        type="button"
        onClick={() => onOpenModal(product.id)}
        aria-label={t("viewProductDetailsAria", { name: product.name })}
        className="group relative aspect-[4/3] w-full overflow-hidden rounded-t-xl bg-lavender p-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-700"
      >
        <ProductImage
          src={product.image}
          alt={product.name}
          width={400}
          height={300}
          className="h-full w-full transition duration-150"
        />
      </button>

      <div className="flex flex-1 flex-col p-4">
        {/* 2. Brand badge (if any; hidden when brand === null) */}
        <div className="min-h-[24px]">
          {product.brand && <Badge variant="brand">{product.brand}</Badge>}
        </div>

        {/* 3. Name (2-line clamp) */}
        <h3 className="mt-1.5 text-base font-semibold text-brand-900 leading-snug">
          <button
            type="button"
            onClick={() => onOpenModal(product.id)}
            className="line-clamp-2 text-left hover:text-brand-700 focus:outline-none focus-visible:underline"
          >
            {product.name}
          </button>
        </h3>

        {/* 4. N/P in monospace */}
        <p className="mt-2 text-xs font-mono text-muted">
          {product.np ? (
            <>
              <span>{t("npLabel")} </span>
              <code className="font-semibold text-ink">{product.np}</code>
            </>
          ) : (
            <span>{t("npPending")}</span>
          )}
        </p>

        {/* 5. Action area pushed to bottom */}
        <div className="mt-auto pt-4">
          {!inList ? (
            <Button
              variant="primary"
              className="w-full"
              onClick={() => add(product.id, 1)}
            >
              {t("addToQuote")}
            </Button>
          ) : (
            <div className="flex items-center justify-between gap-2 rounded-lg border border-brand-700/40 bg-lavender px-2.5 py-1">
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-brand-900">
                <Check className="h-3.5 w-3.5 text-success" aria-hidden="true" />
                {t("inYourList")}
              </span>
              <div className="inline-flex items-center rounded border border-line bg-white">
                <button
                  type="button"
                  onClick={() => {
                    if (qty <= 1) {
                      remove(product.id);
                    } else {
                      setQty(product.id, qty - 1);
                    }
                  }}
                  aria-label={t("decreaseQtyAria", { name: product.name })}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-l text-brand-900 hover:bg-lavender focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-700"
                >
                  <Minus className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
                <span className="min-w-[2.25rem] px-1 text-center text-sm font-bold text-brand-900 font-mono">
                  {qty}
                </span>
                <button
                  type="button"
                  onClick={() => setQty(product.id, Math.min(9999, qty + 1))}
                  aria-label={t("increaseQtyAria", { name: product.name })}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-r text-brand-900 hover:bg-lavender focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-700"
                >
                  <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
