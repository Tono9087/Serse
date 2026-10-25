import { Check, ChevronRight, Minus, Plus } from "lucide-react";
import { useRfq } from "../../context/RfqContext.jsx";
import { useI18n } from "../../i18n/I18nContext.jsx";
import { Modal } from "../ui/Modal.jsx";
import { Badge } from "../ui/Badge.jsx";
import { Button } from "../ui/Button.jsx";
import { ProductImage } from "../ui/ProductImage.jsx";

export function ProductModal({ product, isOpen, onClose }) {
  const { getQty, add, setQty, remove } = useRfq();
  const { t } = useI18n();

  if (!product) return null;

  const qty = getQty(product.id);
  const inList = qty > 0;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t("modalProductDetails")}
    >
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="flex aspect-[4/3] items-center justify-center overflow-hidden rounded-lg border border-line bg-lavender p-4">
          <ProductImage
            src={product.image}
            alt={product.name}
            width={400}
            height={300}
            className="h-full w-full"
          />
        </div>

        <div className="flex flex-col">
          {/* Category > Subcategory */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs font-medium text-muted">
            <Badge variant="category">{product.category}</Badge>
            {product.subcategory && (
              <>
                <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
                <span>{product.subcategory}</span>
              </>
            )}
          </div>

          {/* Product Name */}
          <h3 className="mt-3 text-xl font-bold text-brand-900 leading-snug">
            {product.name}
          </h3>

          {/* Brand */}
          <div className="mt-3 text-sm">
            {product.brand ? (
              <div className="flex items-center gap-2">
                <span className="text-muted">{t("brandLabel")}:</span>
                <Badge variant="brand">{product.brand}</Badge>
              </div>
            ) : (
              <p className="text-muted">{t("brandUnspecifiedWithLabel")}</p>
            )}
          </div>

          {/* Part Number (N/P) */}
          <div className="mt-2 rounded-lg border border-line bg-lavender px-3 py-2 text-sm font-mono">
            {product.np ? (
              <>
                <span className="text-muted">{t("npLabel")} </span>
                <code className="font-bold text-brand-900">{product.np}</code>
              </>
            ) : (
              <span className="text-muted">{t("npPending")}</span>
            )}
          </div>

          {/* Add to quote control */}
          <div className="mt-auto pt-6">
            {!inList ? (
              <Button
                variant="primary"
                size="lg"
                className="w-full"
                onClick={() => add(product.id, 1)}
              >
                {t("addToQuote")}
              </Button>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center justify-between rounded-lg border border-brand-700/40 bg-lavender px-3.5 py-2">
                  <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-900">
                    <Check
                      className="h-4 w-4 text-success"
                      aria-hidden="true"
                    />
                    {t("inYourList")}
                  </span>
                  <div className="inline-flex items-center rounded-lg border border-line bg-white">
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
                      className="inline-flex h-9 w-9 items-center justify-center rounded-l-lg text-brand-900 hover:bg-lavender focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-700"
                    >
                      <Minus className="h-4 w-4" aria-hidden="true" />
                    </button>
                    <input
                      type="number"
                      min={1}
                      max={9999}
                      value={qty}
                      aria-label={t("quantityInputAria", { name: product.name })}
                      onChange={(e) => {
                        const raw = e.target.value;
                        if (raw === "") return;
                        setQty(product.id, Number.parseInt(raw, 10) || 1);
                      }}
                      className="h-9 w-16 border-x border-line text-center text-sm font-bold text-brand-900 font-mono focus:outline-none focus:ring-1 focus:ring-brand-700"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setQty(product.id, Math.min(9999, qty + 1))
                      }
                      aria-label={t("increaseQtyAria", { name: product.name })}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-r-lg text-brand-900 hover:bg-lavender focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-700"
                    >
                      <Plus className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}
