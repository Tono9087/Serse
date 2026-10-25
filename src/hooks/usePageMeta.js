import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { SITE } from "../config/site.js";

/**
 * Updates document.title, meta description, canonical link, and OpenGraph tags.
 * @param {{ title: string, description: string }} meta
 */
export function usePageMeta({ title, description }) {
  const location = useLocation();

  useEffect(() => {
    if (typeof document === "undefined") return;

    if (title) {
      document.title = title;

      let ogTitleTag = document.querySelector('meta[property="og:title"]');
      if (!ogTitleTag) {
        ogTitleTag = document.createElement("meta");
        ogTitleTag.setAttribute("property", "og:title");
        document.head.appendChild(ogTitleTag);
      }
      ogTitleTag.setAttribute("content", title);
    }

    if (description) {
      let metaTag = document.querySelector('meta[name="description"]');
      if (!metaTag) {
        metaTag = document.createElement("meta");
        metaTag.setAttribute("name", "description");
        document.head.appendChild(metaTag);
      }
      metaTag.setAttribute("content", description);

      let ogDescTag = document.querySelector('meta[property="og:description"]');
      if (!ogDescTag) {
        ogDescTag = document.createElement("meta");
        ogDescTag.setAttribute("property", "og:description");
        document.head.appendChild(ogDescTag);
      }
      ogDescTag.setAttribute("content", description);
    }

    // Canonical URL: SITE.siteUrl + location.pathname
    // For /catalogo, include only cat and brand params, never page, size, sort, view
    let canonicalUrl = `${SITE.siteUrl}${location.pathname}`;
    if (location.pathname === "/catalogo") {
      const searchParams = new URLSearchParams(location.search);
      const canonicalParams = new URLSearchParams();
      for (const [key, value] of searchParams.entries()) {
        if (key === "cat" || key === "brand") {
          canonicalParams.append(key, value);
        }
      }
      const queryString = canonicalParams.toString();
      if (queryString) {
        canonicalUrl += `?${queryString}`;
      }
    }

    let canonicalTag = document.querySelector('link[rel="canonical"]');
    if (!canonicalTag) {
      canonicalTag = document.createElement("link");
      canonicalTag.setAttribute("rel", "canonical");
      document.head.appendChild(canonicalTag);
    }
    canonicalTag.setAttribute("href", canonicalUrl);

    let ogUrlTag = document.querySelector('meta[property="og:url"]');
    if (!ogUrlTag) {
      ogUrlTag = document.createElement("meta");
      ogUrlTag.setAttribute("property", "og:url");
      document.head.appendChild(ogUrlTag);
    }
    ogUrlTag.setAttribute("content", canonicalUrl);
  }, [title, description, location.pathname, location.search]);
}
