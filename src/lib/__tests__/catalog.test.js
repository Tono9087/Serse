import { describe, it, expect } from "vitest";
import { es } from "../../i18n/es.js";
import { en } from "../../i18n/en.js";
import catalog from "../../data/catalog.json";

const KNOWN_CATEGORIES = new Set([
  "Herramienta",
  "Neumática",
  "Mantenimiento y consumibles",
  "Eléctrico y electrónica",
  "Etiquetado e identificación",
  "Medición",
  "Mecánica y lubricación",
  "Seguridad industrial",
]);

describe("i18n and catalog integrity", () => {
  it("es and en dictionaries have identical key sets", () => {
    const esKeys = Object.keys(es).sort();
    const enKeys = Object.keys(en).sort();
    expect(esKeys).toEqual(enKeys);
  });

  it("verifies catalog integrity: unique ids, valid categories, and valid image paths", () => {
    expect(catalog.length).toBeGreaterThan(0);
    const ids = new Set();

    for (const item of catalog) {
      expect(typeof item.id).toBe("string");
      expect(ids.has(item.id)).toBe(false);
      ids.add(item.id);

      expect(KNOWN_CATEGORIES.has(item.category)).toBe(true);

      const validImage =
        item.image === null ||
        (typeof item.image === "string" && item.image.startsWith("/images/"));
      expect(validImage).toBe(true);
    }
  });
});
