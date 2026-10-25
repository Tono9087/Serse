import { useId } from "react";
import { X } from "lucide-react";
import { useFocusTrap } from "../../hooks/useFocusTrap.js";
import { useI18n } from "../../i18n/I18nContext.jsx";

export function Drawer({
  isOpen,
  onClose,
  title,
  position = "right",
  children,
}) {
  const { t } = useI18n();
  const titleId = useId();
  const containerRef = useFocusTrap(isOpen, onClose);

  if (!isOpen) return null;

  const sideClass =
    position === "left"
      ? "left-0 border-r border-line"
      : "right-0 border-l border-line";

  return (
    <div className="fixed inset-0 z-50 flex">
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
        className={`fixed inset-y-0 ${sideClass} z-10 flex w-full max-w-md flex-col bg-white focus:outline-none`}
      >
        <div className="flex items-center justify-between border-b border-line bg-brand-900 px-4 py-3.5 text-white sm:px-6">
          <h2 id={titleId} className="text-lg font-semibold text-white">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label={t("close")}
            className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg text-white hover:bg-brand-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
