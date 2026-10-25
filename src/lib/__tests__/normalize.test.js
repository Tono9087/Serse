import { describe, it, expect } from "vitest";
import { normalizeNp, normalizeText, slugifyBrand } from "../normalize.js";

describe("normalize", () => {
  it("normalizes part numbers identically regardless of spaces, slashes, dashes or casing", () => {
    const a = normalizeNp("PC 3/8-01");
    const b = normalizeNp("pc3/8-01");
    const c = normalizeNp("PC38 01");
    expect(a).toBe("pc3801");
    expect(b).toBe(a);
    expect(c).toBe(a);
  });

  it("returns empty string for null or undefined in normalizeNp", () => {
    expect(normalizeNp(null)).toBe("");
    expect(normalizeNp(undefined)).toBe("");
  });

  it("normalizes text by stripping accents, lowercasing, and collapsing whitespace", () => {
    expect(normalizeText("  Válvula   Neumática  ")).toBe("valvula neumatica");
    expect(normalizeText(null)).toBe("");
    expect(normalizeText(undefined)).toBe("");
  });

  describe("slugifyBrand", () => {
    it("lowercases, removes accents, replaces non-alphanumerics with hyphens and trims", () => {
      expect(slugifyBrand("Automation Components Inc.")).toBe(
        "automation-components-inc"
      );
      expect(slugifyBrand("Brady IDPAL")).toBe("brady-idpal");
      expect(slugifyBrand("NASS Magnet / SYPC")).toBe("nass-magnet-sypc");
    });

    it("handles accents and special characters properly", () => {
      expect(slugifyBrand("FESTO Neumática")).toBe("festo-neumatica");
      expect(slugifyBrand("3M")).toBe("3m");
      expect(slugifyBrand("SMC Corporation")).toBe("smc-corporation");
    });

    it("handles null, undefined, empty, and whitespace strings", () => {
      expect(slugifyBrand(null)).toBe("");
      expect(slugifyBrand(undefined)).toBe("");
      expect(slugifyBrand("")).toBe("");
      expect(slugifyBrand("   ---   ")).toBe("");
    });
  });
});
