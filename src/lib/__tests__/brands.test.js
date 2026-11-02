import { describe, it, expect } from "vitest";
import { BRANDS } from "../../config/brands.js";
import { buildBrandDirectory, getBrandCatalogUrl, getBrandProductCount } from "../brands.js";
import catalog from "../../data/catalog.json";

describe("brands lib", () => {
  it("highlights Brady with all 11 catalog items (Brady + Brady IDPAL)", () => {
    const brady = BRANDS.find((b) => b.slug === "brady");
    expect(brady).toBeDefined();
    expect(getBrandProductCount(brady, catalog)).toBe(11);
    const { inStock, onDemand } = buildBrandDirectory(BRANDS, catalog);
    expect(inStock[0].brand.slug).toBe("brady");
    expect(inStock[0].count).toBe(11);
    expect(inStock.every((entry) => entry.count > 0)).toBe(true);
    expect(onDemand.every((entry) => entry.count === 0)).toBe(true);
  });

  it("returns real count for SMC from catalog data", () => {
    const smc = BRANDS.find((b) => b.slug === "smc");
    expect(smc).toBeDefined();
    const count = getBrandProductCount(smc, catalog);
    expect(count).toBe(8);
  });

  it("returns real count for Siemens from catalog data", () => {
    const siemens = BRANDS.find((b) => b.slug === "siemens");
    expect(siemens).toBeDefined();
    const count = getBrandProductCount(siemens, catalog);
    expect(count).toBe(3);
  });

  it("counts 'TRUPER EXPERT' products for Truper", () => {
    const truper = BRANDS.find((b) => b.slug === "truper");
    expect(truper).toBeDefined();
    const count = getBrandProductCount(truper, catalog);
    expect(count).toBe(1);
  });

  it("returns 0 for a brand with match: []", () => {
    const balluff = BRANDS.find((b) => b.slug === "balluff");
    expect(balluff).toBeDefined();
    expect(balluff.match).toEqual([]);
    const count = getBrandProductCount(balluff, catalog);
    expect(count).toBe(0);
  });

  it("ensures all brand slugs in BRANDS are unique", () => {
    const slugs = BRANDS.map((b) => b.slug);
    const uniqueSlugs = new Set(slugs);
    expect(uniqueSlugs.size).toBe(slugs.length);
  });

  it("generates proper catalog URLs with exact match strings", () => {
    const smc = BRANDS.find((b) => b.slug === "smc");
    expect(getBrandCatalogUrl(smc)).toBe("/catalogo?brand=SMC");

    const truper = BRANDS.find((b) => b.slug === "truper");
    expect(getBrandCatalogUrl(truper)).toBe("/catalogo?brand=TRUPER%20EXPERT");

    const balluff = BRANDS.find((b) => b.slug === "balluff");
    expect(getBrandCatalogUrl(balluff)).toBe("/catalogo");

    const multiMatch = { match: ["Brand A", "Brand B"] };
    expect(getBrandCatalogUrl(multiMatch)).toBe(
      "/catalogo?brand=Brand%20A,Brand%20B"
    );
  });
});
