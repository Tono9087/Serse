import { useId } from "react";
import { X } from "lucide-react";
import { useFocusTrap } from "../../hooks/useFocusTrap.js";
import { useI18n } from "../../i18n/I18nContext.jsx";

export function Modal({ isOpen, onClose, title, children }) {
  const { t } = useI18n();
  const titleId = useId();
  const containerRef = useFocusTrap(isOpen, onClose);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div
        className="fixed inset-0 bg-brand-950/60 transition-opacity duration-150"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        ref={containerRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg border border-line bg-white focus:outline-none"
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-line bg-white px-4 py-3 sm:px-6">
          <h2 id={titleId} className="text-lg font-semibold text-brand-900">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label={t("close")}
            className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg text-brand-900 hover:bg-lavender focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-700"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
        <div className="p-4 sm:p-6">{children}</div>
      </div>
    </div>
  );
}
