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

  const sideClass =
    position === "left"
      ? "left-0 border-r border-line"
      : "right-0 border-l border-line";

  const translateClass =
    position === "left"
      ? isOpen
        ? "translate-x-0"
        : "-translate-x-full"
      : isOpen
        ? "translate-x-0"
        : "translate-x-full";

  return (
    <div
      className={`fixed inset-0 z-50 flex transition-all duration-300 ease-out ${
        isOpen
          ? "visible pointer-events-auto"
          : "invisible pointer-events-none"
      }`}
    >
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-brand-950/60 transition-opacity duration-300 ease-out ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer panel */}
      <div
        ref={containerRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={`fixed inset-y-0 ${sideClass} z-10 flex w-full max-w-md flex-col bg-white shadow-2xl transition-transform duration-300 ease-out focus:outline-none ${translateClass}`}
      >
        <div className="flex items-center justify-between border-b border-line bg-brand-900 px-4 py-3.5 text-white sm:px-6">
          <h2 id={titleId} className="text-lg font-semibold text-white">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label={t("close")}
            className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg text-white hover:bg-brand-800 transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
