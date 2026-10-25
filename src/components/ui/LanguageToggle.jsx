import { useI18n } from "../../i18n/I18nContext.jsx";

export function LanguageToggle({ className = "" }) {
  const { lang, setLang, t } = useI18n();

  return (
    <div
      role="group"
      aria-label={t("languageLabel")}
      className={`inline-flex items-center rounded-full bg-brand-950 p-1 text-xs font-semibold ${className}`}
    >
      <button
        type="button"
        onClick={() => setLang("es")}
        aria-pressed={lang === "es"}
        className={`px-2.5 py-1 rounded-full transition duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 ${
          lang === "es"
            ? "bg-brand-500 text-white font-bold"
            : "text-white hover:text-white/80"
        }`}
      >
        ES
      </button>
      <button
        type="button"
        onClick={() => setLang("en")}
        aria-pressed={lang === "en"}
        className={`px-2.5 py-1 rounded-full transition duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 ${
          lang === "en"
            ? "bg-brand-500 text-white font-bold"
            : "text-white hover:text-white/80"
        }`}
      >
        EN
      </button>
    </div>
  );
}
