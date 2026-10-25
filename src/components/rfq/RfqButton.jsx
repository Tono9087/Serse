import { ClipboardList } from "lucide-react";
import { useRfq } from "../../context/RfqContext.jsx";
import { useI18n } from "../../i18n/I18nContext.jsx";

export function RfqButton({ className = "" }) {
  const { count, open } = useRfq();
  const { t } = useI18n();

  return (
    <button
      type="button"
      onClick={open}
      className={`inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-brand-700 px-3.5 py-2 text-sm font-semibold text-white transition duration-150 hover:bg-brand-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand-900 ${className}`}
    >
      <ClipboardList className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
      <span className="hidden sm:inline">{t("rfqButtonLabel")}</span>
      {count > 0 && (
        <span
          aria-label={`${count}`}
          className="inline-flex min-w-[22px] items-center justify-center rounded-full bg-brand-950 px-1.5 py-0.5 text-xs font-bold text-white font-mono"
        >
          {count}
        </span>
      )}
    </button>
  );
}
