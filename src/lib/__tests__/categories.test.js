import { describe, it, expect } from "vitest";
import catalog from "../../data/catalog.json";
import { getCategoryLabel } from "../categories.js";

describe("getCategoryLabel", () => {
  it("returns the original name in Spanish", () => {
    expect(getCategoryLabel("Herramienta", "es")).toBe("Herramienta");
  });

  it("translates known categories in English", () => {
    expect(getCategoryLabel("Neumática", "en")).toBe("Pneumatics");
    expect(getCategoryLabel("Seguridad industrial", "en")).toBe(
      "Industrial safety"
    );
  });

  it("falls back to the original name for unknown categories", () => {
    expect(getCategoryLabel("Otra", "en")).toBe("Otra");
  });

  it("has an English label for every category in the catalog", () => {
    const names = new Set(catalog.map((p) => p.category).filter(Boolean));
    for (const name of names) {
      expect(getCategoryLabel(name, "en")).not.toBe(name);
    }
  });
});
