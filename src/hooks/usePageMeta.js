import { useEffect } from "react";

/**
 * Updates document.title and the meta description tag (creating it if missing).
 * @param {{ title: string, description: string }} meta
 */
export function usePageMeta({ title, description }) {
  useEffect(() => {
    if (typeof document === "undefined") return;

    if (title) {
      document.title = title;
    }

    if (description) {
      let metaTag = document.querySelector('meta[name="description"]');
      if (!metaTag) {
        metaTag = document.createElement("meta");
        metaTag.setAttribute("name", "description");
        document.head.appendChild(metaTag);
      }
      metaTag.setAttribute("content", description);
    }
  }, [title, description]);
}
