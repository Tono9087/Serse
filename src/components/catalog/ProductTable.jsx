import { Link } from "react-router-dom";
import { ArrowDown, ArrowUpDown, Check, Minus, Plus } from "lucide-react";
import { useRfq } from "../../context/RfqContext.jsx";
import { useI18n } from "../../i18n/I18nContext.jsx";
import { Badge } from "../ui/Badge.jsx";
import { Button } from "../ui/Button.jsx";
import { ProductImage } from "../ui/ProductImage.jsx";

export function ProductTable({ products, from, sort, onSortChange }) {
  const { t } = useI18n();
  const { getQty, add, setQty, remove } = useRfq();

  function renderSortIcon(columnKey) {
    if (sort === columnKey) {
      return <ArrowDown className="h-3.5 w-3.5 text-brand-700" aria-hidden="true" />;
    }
    return <ArrowUpDown className="h-3.5 w-3.5 text-muted/60" aria-hidden="true" />;
  }

  function getAriaSort(columnKey) {
    if (sort === columnKey) return "ascending";
    return "none";
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-line bg-white shadow-sm">
      <table className="w-full text-left text-sm border-collapse min-w-[700px]">
        <caption className="sr-only">Resultados del catálogo</caption>
        <thead className="sticky top-0 z-20 border-b border-line bg-lavender text-xs uppercase tracking-wider text-brand-900">
          <tr>
            {/* 1. Thumbnail (sticky-left on mobile) */}
            <th
              scope="col"
              className="sticky left-0 z-20 bg-lavender px-3 py-3 w-14 text-center"
            >
              <span className="sr-only">{t("imageNotAvailable")}</span>
            </th>

            {/* 2. N/P (clickable sort, sticky-left on mobile after thumbnail) */}
            <th
              scope="col"
              aria-sort={getAriaSort("np")}
              className="sticky left-14 z-20 bg-lavender px-4 py-3 font-semibold min-w-[130px]"
            >
              <button
                type="button"
                onClick={() => onSortChange("np")}
                className="inline-flex items-center gap-1.5 hover:text-brand-700 focus:outline-none focus-visible:underline"
              >
                <span>{t("npLabel")}</span>
                {renderSortIcon("np")}
              </button>
            </th>

            {/* 3. Nombre (clickable sort) */}
            <th
              scope="col"
              aria-sort={getAriaSort("name")}
              className="px-4 py-3 font-semibold min-w-[220px]"
            >
              <button
                type="button"
                onClick={() => onSortChange("name")}
                className="inline-flex items-center gap-1.5 hover:text-brand-700 focus:outline-none focus-visible:underline"
              >
                <span>{t("fieldFullName") || "Nombre"}</span>
                {renderSortIcon("name")}
              </button>
            </th>

            {/* 4. Marca (clickable sort) */}
            <th
              scope="col"
              aria-sort={getAriaSort("brand")}
              className="px-4 py-3 font-semibold min-w-[120px]"
            >
              <button
                type="button"
                onClick={() => onSortChange("brand")}
                className="inline-flex items-center gap-1.5 hover:text-brand-700 focus:outline-none focus-visible:underline"
              >
                <span>{t("brandLabel")}</span>
                {renderSortIcon("brand")}
              </button>
            </th>

            {/* 5. Categoría */}
            <th scope="col" className="px-4 py-3 font-semibold min-w-[140px]">
              {t("categoryLabel")}
            </th>

            {/* 6. Acción */}
            <th scope="col" className="px-4 py-3 text-right font-semibold min-w-[160px]">
              <span className="sr-only">Acción</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {products.map((product) => {
            const qty = getQty(product.id);
            const inList = qty > 0;

            return (
              <tr
                key={product.id}
                className="odd:bg-white even:bg-lavender/40 hover:bg-lavender transition-colors duration-150 group"
              >
                {/* 1. Image thumbnail (sticky left) */}
                <td className="sticky left-0 z-10 bg-inherit px-3 py-2.5 text-center">
                  <Link
                    to={`/producto/${product.id}`}
                    state={{ from }}
                    className="inline-block h-12 w-12 overflow-hidden rounded-lg border border-line bg-lavender p-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-700"
                  >
                    <ProductImage
                      src={product.image}
                      alt={product.name}
                      width={48}
                      height={48}
                      className="h-full w-full object-contain"
                    />
                  </Link>
                </td>

                {/* 2. N/P (sticky left offset 48px/56px) */}
                <td className="sticky left-14 z-10 bg-inherit px-4 py-3 font-mono text-xs">
                  {product.np ? (
                    <code className="font-semibold text-brand-900 bg-lavender/70 px-1.5 py-0.5 rounded">
                      {product.np}
                    </code>
                  ) : (
                    <span className="text-muted">{t("npPending")}</span>
                  )}
                </td>

                {/* 3. Nombre (link to product page) */}
                <td className="px-4 py-3 font-semibold text-brand-900">
                  <Link
                    to={`/producto/${product.id}`}
                    state={{ from }}
                    className="hover:text-brand-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-700 rounded"
                  >
                    {product.name}
                  </Link>
                </td>

                {/* 4. Marca */}
                <td className="px-4 py-3">
                  {product.brand ? (
                    <Badge variant="brand">{product.brand}</Badge>
                  ) : (
                    <span className="text-xs text-muted">
                      {t("brandUnspecified")}
                    </span>
                  )}
                </td>

                {/* 5. Categoría */}
                <td className="px-4 py-3 text-xs text-muted">
                  <div className="flex flex-col">
                    <span className="font-medium text-brand-900">
                      {product.category}
                    </span>
                    {product.subcategory && (
                      <span className="text-[11px] text-muted">
                        {product.subcategory}
                      </span>
                    )}
                  </div>
                </td>

                {/* 6. Acción */}
                <td className="px-4 py-3 text-right">
                  {!inList ? (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => add(product.id, 1)}
                      className="text-xs whitespace-nowrap"
                    >
                      {t("addToQuote")}
                    </Button>
                  ) : (
                    <div className="inline-flex items-center justify-end gap-1.5 rounded-lg border border-brand-700/40 bg-lavender px-2 py-0.5">
                      <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-brand-900">
                        <Check className="h-3 w-3 text-success" aria-hidden="true" />
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
                          className="inline-flex h-7 w-7 items-center justify-center rounded-l text-brand-900 hover:bg-lavender focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-700"
                        >
                          <Minus className="h-3 w-3" aria-hidden="true" />
                        </button>
                        <span className="min-w-[1.75rem] px-1 text-center text-xs font-bold text-brand-900 font-mono">
                          {qty}
                        </span>
                        <button
                          type="button"
                          onClick={() => setQty(product.id, Math.min(9999, qty + 1))}
                          aria-label={t("increaseQtyAria", { name: product.name })}
                          className="inline-flex h-7 w-7 items-center justify-center rounded-r text-brand-900 hover:bg-lavender focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-700"
                        >
                          <Plus className="h-3 w-3" aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
