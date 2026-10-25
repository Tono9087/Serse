import { useMemo, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Check,
  ChevronRight,
  Copy,
  MessageSquare,
  Minus,
  Plus,
} from "lucide-react";
import catalog from "../data/catalog.json";
import { SITE } from "../config/site.js";
import { buildWhatsAppUrl } from "../lib/whatsapp.js";
import { useRfq } from "../context/RfqContext.jsx";
import { usePageMeta } from "../hooks/usePageMeta.js";
import { useI18n } from "../i18n/I18nContext.jsx";
import { Breadcrumbs } from "../components/ui/Breadcrumbs.jsx";
import { Badge } from "../components/ui/Badge.jsx";
import { Button } from "../components/ui/Button.jsx";
import { ProductImage } from "../components/ui/ProductImage.jsx";
import { ProductCard } from "../components/catalog/ProductCard.jsx";
import { Container } from "../components/layout/Container.jsx";
import { NotFound } from "./NotFound.jsx";

const productById = new Map(catalog.map((p) => [p.id, p]));

export function ProductPage() {
  const { id } = useParams();
  const location = useLocation();
  const { t } = useI18n();
  const { getQty, add, setQty, remove } = useRfq();

  const product = productById.get(id);

  // Read `from` state passed from Catalog to restore previous search/filter state on Back
  const fromUrl = location.state?.from || "/catalogo";

  // Dynamic meta tags per Section A.4
  const metaTitle = product ? `${product.name} | SERSE Industrial` : "";
  const metaDesc = product
    ? `${product.name} (N/P: ${product.np || "por confirmar"}, Marca: ${
        product.brand || "Industrial"
      }). Cotiza suministros industriales MRO en Chihuahua.`
    : "";

  usePageMeta({
    title: metaTitle,
    description: metaDesc,
  });

  const [copied, setCopied] = useState(false);

  // Related products from same category per Section A.3 (up to 4, excluding current product)
  const relatedProducts = useMemo(() => {
    if (!product || !product.category) return [];
    return catalog
      .filter((p) => p.category === product.category && p.id !== product.id)
      .slice(0, 4);
  }, [product]);

  if (!product) {
    return <NotFound />;
  }

  const qty = getQty(product.id);
  const inList = qty > 0;

  // Breadcrumbs items per Section A.4
  const breadcrumbItems = [
    { label: t("navHome"), to: "/" },
    { label: t("navCatalog"), to: "/catalogo" },
  ];
  if (product.category) {
    breadcrumbItems.push({
      label: product.category,
      to: `/catalogo?cat=${encodeURIComponent(product.category)}`,
    });
  }
  if (product.subcategory) {
    breadcrumbItems.push({
      label: product.subcategory,
      to: `/catalogo?cat=${encodeURIComponent(
        product.category
      )}&sub=${encodeURIComponent(product.subcategory)}`,
    });
  }
  breadcrumbItems.push({ label: product.name });

  async function handleCopyNp() {
    if (!product.np) return;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(product.np);
      } else {
        throw new Error("Clipboard API unavailable");
      }
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = product.np;
      textarea.setAttribute("readonly", "");
      textarea.style.position = "fixed";
      textarea.style.left = "-9999px";
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand("copy");
      } finally {
        document.body.removeChild(textarea);
      }
    }
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  }

  // Inquiry message text per Section A.3
  const inquiryMessage = `Hola, quisiera información sobre: ${
    product.name
  } (Marca: ${product.brand || "no especificada"}, N/P: ${
    product.np || "por confirmar"
  }).`;
  const inquiryUrl = buildWhatsAppUrl(SITE.whatsappNumber, inquiryMessage);

  return (
    <Container className="py-8">
      {/* Back link & Breadcrumbs */}
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <Link
          to={fromUrl}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-700 rounded w-fit"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          <span>{t("backToResults")}</span>
        </Link>
        <Breadcrumbs items={breadcrumbItems} />
      </div>

      {/* Main product presentation: 2 columns from md; at 2xl: image 5/12 and info 7/12 */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 2xl:grid-cols-12 md:gap-12">
        {/* Left: Large Image (5/12 on 2xl) */}
        <div className="2xl:col-span-5">
          <div className="flex aspect-[4/3] items-center justify-center overflow-hidden rounded-2xl border border-line bg-lavender p-8 shadow-sm">
            <ProductImage
              src={product.image}
              alt={product.name}
              width={600}
              height={450}
              className="h-full w-full object-contain"
            />
          </div>
        </div>

        {/* Right: Product details (7/12 on 2xl) */}
        <div className="flex flex-col 2xl:col-span-7">
          {product.brand && (
            <div className="mb-2">
              <Badge variant="brand">{product.brand}</Badge>
            </div>
          )}

          <h1 className="text-2xl font-bold text-brand-900 sm:text-3xl lg:text-4xl leading-tight">
            {product.name}
          </h1>

          {/* N/P with Copy button */}
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center gap-2 rounded-lg border border-line bg-lavender px-3.5 py-2 font-mono text-sm">
              <span className="text-muted">{t("npLabel")}</span>
              {product.np ? (
                <code className="font-bold text-brand-900">{product.np}</code>
              ) : (
                <span className="text-muted">{t("npPending")}</span>
              )}
            </div>

            {product.np && (
              <button
                type="button"
                onClick={handleCopyNp}
                className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg border border-line bg-white px-3 py-2 text-xs font-semibold text-brand-900 hover:border-brand-700 hover:bg-lavender focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-700 transition duration-150"
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-success" aria-hidden="true" />
                    <span className="text-success">{t("copiedMessage")}</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5 text-muted" aria-hidden="true" />
                    <span>{t("copyNp")}</span>
                  </>
                )}
              </button>
            )}
          </div>

          {/* Category › Subcategory links */}
          <div className="mt-4 flex flex-wrap items-center gap-1.5 text-xs text-muted">
            <span className="font-medium text-muted">{t("categoryLabel")}:</span>
            <Link
              to={`/catalogo?cat=${encodeURIComponent(product.category)}`}
              className="font-semibold text-brand-700 hover:underline"
            >
              {product.category}
            </Link>
            {product.subcategory && (
              <>
                <ChevronRight className="h-3.5 w-3.5 text-muted/60" aria-hidden="true" />
                <Link
                  to={`/catalogo?cat=${encodeURIComponent(
                    product.category
                  )}&sub=${encodeURIComponent(product.subcategory)}`}
                  className="font-semibold text-brand-700 hover:underline"
                >
                  {product.subcategory}
                </Link>
              </>
            )}
          </div>

          {/* Add to quote control & WhatsApp inquiry */}
          <div className="mt-8 space-y-3.5 border-t border-line pt-6">
            {!inList ? (
              <Button
                variant="primary"
                size="lg"
                className="w-full text-base"
                onClick={() => add(product.id, 1)}
              >
                {t("addToQuote")}
              </Button>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center justify-between rounded-xl border border-brand-700/40 bg-lavender px-4 py-3">
                  <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-900">
                    <Check className="h-4 w-4 text-success" aria-hidden="true" />
                    {t("inYourList")}
                  </span>
                  <div className="inline-flex items-center rounded-lg border border-line bg-white shadow-xs">
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
                      className="inline-flex h-10 w-10 items-center justify-center rounded-l-lg text-brand-900 hover:bg-lavender focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-700"
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
                      className="h-10 w-16 border-x border-line text-center text-sm font-bold text-brand-900 font-mono focus:outline-none focus:ring-1 focus:ring-brand-700"
                    />
                    <button
                      type="button"
                      onClick={() => setQty(product.id, Math.min(9999, qty + 1))}
                      aria-label={t("increaseQtyAria", { name: product.name })}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-r-lg text-brand-900 hover:bg-lavender focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-700"
                    >
                      <Plus className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {SITE.whatsappNumber && (
              <a
                href={inquiryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-lg border border-brand-700 bg-white px-4 py-3 text-sm font-semibold text-brand-700 transition duration-150 hover:bg-lavender focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-700"
              >
                <MessageSquare className="h-4 w-4" aria-hidden="true" />
                <span>{t("askAboutProduct")}</span>
              </a>
            )}
          </div>
        </div>
      </div>

      {/* "Más de esta categoría" section */}
      {relatedProducts.length > 0 && (
        <section className="mt-16 border-t border-line pt-10">
          <h2 className="text-2xl font-bold text-brand-900">
            {t("moreFromCategory")}
          </h2>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 sm:gap-6">
            {relatedProducts.map((relProduct) => (
              <ProductCard
                key={relProduct.id}
                product={relProduct}
                from={`/producto/${product.id}`}
              />
            ))}
          </div>
        </section>
      )}
    </Container>
  );
}
