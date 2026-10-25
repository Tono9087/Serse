import { Link } from "react-router-dom";
import { AlertCircle, ArrowLeft, Search } from "lucide-react";
import { usePageMeta } from "../hooks/usePageMeta.js";
import { useI18n } from "../i18n/I18nContext.jsx";
import { Container } from "../components/layout/Container.jsx";

export function NotFound() {
  const { t } = useI18n();

  usePageMeta({
    title: t("metaNotFoundTitle"),
    description: t("metaNotFoundDesc"),
  });

  return (
    <Container className="flex flex-col items-center justify-center py-20 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-lavender text-brand-900 border border-line">
        <AlertCircle className="h-7 w-7" aria-hidden="true" />
      </div>
      <h1 className="text-3xl font-bold text-brand-900 md:text-4xl">
        {t("notFoundTitle")}
      </h1>
      <p className="mt-2 max-w-md text-base text-muted">{t("notFoundDesc")}</p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <Link
          to="/"
          className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-lg border border-brand-700 bg-white px-4 py-2.5 text-sm font-semibold text-brand-700 transition duration-150 hover:bg-lavender focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-700"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          <span>{t("backToHome")}</span>
        </Link>
        <Link
          to="/catalogo"
          className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-lg bg-brand-700 px-4 py-2.5 text-sm font-semibold text-white transition duration-150 hover:bg-brand-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-700"
        >
          <Search className="h-4 w-4" aria-hidden="true" />
          <span>{t("viewCatalog")}</span>
        </Link>
      </div>
    </Container>
  );
}
