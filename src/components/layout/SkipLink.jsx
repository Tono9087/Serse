import { useI18n } from "../../i18n/I18nContext.jsx";

export function SkipLink() {
  const { t } = useI18n();

  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-brand-700 focus:px-4 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-white focus:outline-none focus:ring-2 focus:ring-white"
    >
      {t("skipToContent")}
    </a>
  );
}
