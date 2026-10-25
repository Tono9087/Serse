import { useEffect, useRef } from "react";

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

/**
 * Traps keyboard focus inside containerRef when isOpen is true,
 * closes on Escape, locks body scroll, and restores focus on close.
 * @param {boolean} isOpen
 * @param {() => void} onClose
 */
export function useFocusTrap(isOpen, onClose) {
  const containerRef = useRef(null);
  const previousFocusRef = useRef(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!isOpen || typeof document === "undefined") return;

    previousFocusRef.current = document.activeElement;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const container = containerRef.current;
    if (container) {
      const focusables = container.querySelectorAll(FOCUSABLE_SELECTOR);
      if (focusables.length > 0) {
        focusables[0].focus();
      } else {
        container.focus();
      }
    }

    function handleKeyDown(e) {
      if (e.key === "Escape") {
        e.stopPropagation();
        if (onCloseRef.current) onCloseRef.current();
        return;
      }

      if (e.key !== "Tab" || !containerRef.current) return;

      const focusables = Array.from(
        containerRef.current.querySelectorAll(FOCUSABLE_SELECTOR)
      ).filter((el) => !el.hasAttribute("disabled") && el.offsetParent !== null);

      if (focusables.length === 0) {
        e.preventDefault();
        return;
      }

      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (e.shiftKey) {
        if (
          document.activeElement === first ||
          !containerRef.current.contains(document.activeElement)
        ) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (
          document.activeElement === last ||
          !containerRef.current.contains(document.activeElement)
        ) {
          e.preventDefault();
          first.focus();
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
      const opener = previousFocusRef.current;
      if (opener && typeof opener.focus === "function") {
        try {
          opener.focus();
        } catch {
          // Ignore focus restore errors if element was unmounted
        }
      }
    };
  }, [isOpen]);

  return containerRef;
}
